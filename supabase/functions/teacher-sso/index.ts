import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const centralUrl = Deno.env.get('CENTRAL_SUPABASE_URL')
    const centralKey = Deno.env.get('CENTRAL_SUPABASE_SERVICE_ROLE_KEY')

    if (!centralUrl || !centralKey) {
      console.error('Missing secrets: CENTRAL_SUPABASE_URL=' + !!centralUrl + ' CENTRAL_SUPABASE_SERVICE_ROLE_KEY=' + !!centralKey)
      return json({ error: 'Server misconfiguration: missing central DB secrets' }, 500)
    }

    const { token } = await req.json()

    if (!token) {
      return json({ error: 'Missing token' }, 400)
    }

    // Central DB — service role to bypass RLS
    const central = createClient(centralUrl, centralKey)

    // Local DB — service role for admin auth operations
    const local = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // 1. Validate SSO token — must be unused, not expired, and for a teacher
    const { data: tokenRow, error: tokenError } = await central
      .from('sso_tokens')
      .select('id, teacher_id, used, expires_at')
      .eq('token', token)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .not('teacher_id', 'is', null)
      .maybeSingle()

    if (tokenError || !tokenRow) {
      return json({ error: 'Invalid or expired token' }, 401)
    }

    // 2. Fetch teacher details from central DB
    const { data: teacher, error: teacherError } = await central
      .from('teachers')
      .select('id, email, first_name, last_name')
      .eq('id', tokenRow.teacher_id)
      .single()

    if (teacherError || !teacher) {
      return json({ error: 'Teacher not found' }, 401)
    }

    // 3. Mark token as used now that we know the token resolves to a real
    // teacher — burning it any earlier meant a mid-flight failure below
    // forced the teacher back through the hub for a fresh SSO link.
    await central
      .from('sso_tokens')
      .update({ used: true })
      .eq('id', tokenRow.id)

    // 4. Find or create local auth account for this teacher.
    // Fast path: we've synced this central teacher before, so teacher_profiles
    // already has the local auth user id — skip scanning every auth user.
    let localUserId: string

    const { data: existingProfile } = await local
      .from('teacher_profiles')
      .select('id')
      .eq('central_teacher_id', teacher.id)
      .maybeSingle()

    if (existingProfile?.id) {
      localUserId = existingProfile.id
    } else {
      const { data: newUser, error: createError } = await local.auth.admin.createUser({
        email: teacher.email,
        email_confirm: true,
        user_metadata: {
          first_name: teacher.first_name,
          last_name: teacher.last_name,
          central_teacher_id: teacher.id,
        },
      })

      if (newUser?.user) {
        localUserId = newUser.user.id
      } else {
        // First time seeing this central teacher locally, and createUser failed —
        // almost certainly a legacy direct-login account with the same email that
        // predates SSO. Only now fall back to a full scan to find it.
        // perPage:1000 avoids pagination — default 50 would miss users past page 1.
        const listResult = await local.auth.admin.listUsers({ perPage: 1000 })
        const existingAuthUser = listResult.data?.users?.find(u => u.email === teacher.email) ?? null
        if (!existingAuthUser) {
          console.error('Create user error:', JSON.stringify(createError))
          return json({ error: 'Failed to create account' }, 500)
        }
        localUserId = existingAuthUser.id
      }
    }

    // Upsert teacher_profiles bridge record (non-fatal — don't block SSO if table is missing)
    try {
      await local.from('teacher_profiles').upsert({
        id: localUserId,
        central_teacher_id: teacher.id,
        email: teacher.email,
        first_name: teacher.first_name,
        last_name: teacher.last_name,
      }, { onConflict: 'id' })
    } catch (profileErr) {
      console.warn('teacher_profiles upsert skipped:', profileErr)
    }

    // 5. Sync classes from the central hub into Circuit (non-fatal if it fails)
    try {
      await syncClasses(central, local, localUserId, teacher.id)
    } catch (syncErr) {
      console.error('class sync failed (non-fatal):', syncErr)
    }

    // 5b. Sync students from the central hub into Circuit (non-fatal if it fails)
    try {
      await syncStudents(central, local, teacher.id)
    } catch (syncErr) {
      console.error('student sync failed (non-fatal):', syncErr)
    }

    // 6. Generate a one-time magic link token for the client to establish a session
    const { data: linkData, error: linkError } = await local.auth.admin.generateLink({
      type: 'magiclink',
      email: teacher.email,
    })

    if (linkError || !linkData?.properties?.hashed_token) {
      console.error('Generate link error:', JSON.stringify(linkError))
      return json({ error: 'Failed to generate session token' }, 500)
    }

    return json({ token_hash: linkData.properties.hashed_token, email: teacher.email })

  } catch (err) {
    console.error('Teacher SSO error:', err)
    return json({ error: 'Internal server error' }, 500)
  }
})

function json(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

// ---------------------------------------------------------------------------
// syncClasses — mirrors hub classes into Circuit's local classes table.
// Previously only student-sso created local classes, lazily, the first time
// a student happened to log in. Teachers now see an assigned class immediately.
// ---------------------------------------------------------------------------
async function syncClasses(
  central: ReturnType<typeof createClient>,
  local: ReturnType<typeof createClient>,
  localUserId: string,
  hubTeacherId: string,
) {
  const { data: assignments, error: assignmentsError } = await central
    .from('app_assignments')
    .select('class_id')
    .eq('app_slug', 'circuit')
    .eq('is_active', true)
  if (assignmentsError) {
    // Bail out rather than treating a fetch failure as "no assignments" —
    // that would archive every synced class below.
    console.error('hub app_assignments fetch failed, skipping sync this run', assignmentsError)
    return
  }
  const activeAssignedIds = (assignments ?? []).map(a => a.class_id as string)

  let hubClasses: { id: string; name: string }[] = []
  if (activeAssignedIds.length > 0) {
    const { data, error } = await central
      .from('classes')
      .select('id, name')
      .eq('teacher_id', hubTeacherId)
      .in('id', activeAssignedIds)
      .is('archived_at', null)
    if (error) {
      // Bail out rather than treating a fetch failure as "no active classes" —
      // that would archive every synced class below.
      console.error('hub classes fetch failed, skipping sync this run', error)
      return
    }
    hubClasses = data ?? []
  }

  for (const hubClass of hubClasses) {
    const { error: upsertErr } = await local
      .from('classes')
      .upsert(
        {
          central_class_id: hubClass.id,
          teacher_id: localUserId,
          name: hubClass.name,
          archived_at: null,
        },
        { onConflict: 'central_class_id' },
      )
    if (upsertErr) console.error('class upsert failed', hubClass.id, upsertErr)
  }

  // Archive local classes no longer actively assigned to Circuit. Never delete —
  // class_students, lesson_progress, module_progress, and badges hang off class_id.
  const activeIdSet = new Set(hubClasses.map(c => c.id))
  const { data: locallySynced } = await local
    .from('classes')
    .select('id, central_class_id')
    .eq('teacher_id', localUserId)
    .not('central_class_id', 'is', null)
    .is('archived_at', null)

  const staleIds = (locallySynced ?? [])
    .filter(c => !activeIdSet.has(c.central_class_id as string))
    .map(c => c.id as string)

  if (staleIds.length > 0) {
    const { error: archiveErr } = await local
      .from('classes')
      .update({ archived_at: new Date().toISOString() })
      .in('id', staleIds)
    if (archiveErr) console.error('class archive failed', staleIds, archiveErr)
  }
}

// ---------------------------------------------------------------------------
// syncStudents — auto-provisions a local shadow account (real Supabase Auth
// user, matching student-sso's own account-creation logic) for every student
// on the hub roster across the teacher's active Circuit classes, and enrols
// them in class_students. Runs for the whole roster at once instead of
// waiting for each student to sign into Circuit themselves.
// ---------------------------------------------------------------------------
async function syncStudents(
  central: ReturnType<typeof createClient>,
  local: ReturnType<typeof createClient>,
  hubTeacherId: string,
) {
  const { data: assignments, error: assignmentsError } = await central
    .from('app_assignments')
    .select('class_id')
    .eq('app_slug', 'circuit')
    .eq('is_active', true)
  if (assignmentsError) {
    console.error('app_assignments fetch failed, skipping student sync this run', assignmentsError)
    return
  }
  const activeAssignedIds = (assignments ?? []).map(a => a.class_id as string)

  let teacherActiveClassIds: string[] = []
  if (activeAssignedIds.length > 0) {
    const { data: hubClasses, error: hubClassesErr } = await central
      .from('classes')
      .select('id')
      .eq('teacher_id', hubTeacherId)
      .in('id', activeAssignedIds)
      .is('archived_at', null)
    if (hubClassesErr) {
      console.error('hub classes fetch failed, skipping student sync this run', hubClassesErr)
      return
    }
    teacherActiveClassIds = (hubClasses ?? []).map(c => c.id as string)
  }

  let enrolments: { student_id: string; class_id: string }[] = []
  if (teacherActiveClassIds.length > 0) {
    const { data, error: enrolErr } = await central
      .from('student_classes')
      .select('student_id, class_id')
      .in('class_id', teacherActiveClassIds)
    if (enrolErr) {
      console.error('student_classes fetch failed, skipping student sync this run', enrolErr)
      return
    }
    enrolments = data ?? []
  }

  const localClassIdByCentral = new Map<string, string>()
  if (teacherActiveClassIds.length > 0) {
    const { data: localClasses } = await local
      .from('classes')
      .select('id, central_class_id')
      .in('central_class_id', teacherActiveClassIds)
    for (const c of localClasses ?? []) {
      if (c.central_class_id) localClassIdByCentral.set(c.central_class_id as string, c.id as string)
    }
  }

  const centralStudentIds = [...new Set(enrolments.map(e => e.student_id))]

  if (centralStudentIds.length > 0) {
    const { data: centralStudents, error: centralStudentsErr } = await central
      .from('students')
      .select('id, first_name, last_name, username, year_level')
      .in('id', centralStudentIds)
    if (centralStudentsErr) {
      console.error('central students fetch failed, skipping student sync this run', centralStudentsErr)
      return
    }

    for (const cs of centralStudents ?? []) {
      // Email is deterministic from the central student id — matches
      // student-sso's own scheme so both entry points resolve to one account.
      const studentEmail = `student-${cs.id}@circuit.internal`
      const studentMetadata = {
        central_student_id: cs.id,
        first_name: cs.first_name,
        last_name: cs.last_name,
        username: cs.username,
        year_level: cs.year_level,
        role: 'student',
      }

      let localUserId: string
      const { data: newUser, error: createError } = await local.auth.admin.createUser({
        email: studentEmail,
        email_confirm: true,
        user_metadata: studentMetadata,
      })

      if (newUser?.user) {
        localUserId = newUser.user.id
      } else {
        // perPage:1000 avoids pagination — default 50 would miss users past page 1.
        // NOTE: if total local auth users ever exceeds 1000 this fallback can still
        // miss a match on page 2+ — watch for that if lookups keep failing at scale.
        const { data: listResult, error: listError } = await local.auth.admin.listUsers({ perPage: 1000 })
        if (listError) console.error('listUsers failed during student lookup', cs.id, listError)
        const existingUser = listResult?.users?.find(u => u.email === studentEmail) ?? null
        if (!existingUser) {
          console.error('student account create/lookup failed', {
            centralStudentId: cs.id,
            username: cs.username,
            email: studentEmail,
            createError,
            totalUsersScanned: listResult?.users?.length ?? 0,
          })
          continue
        }
        localUserId = existingUser.id
        await local.auth.admin.updateUserById(localUserId, { user_metadata: studentMetadata })
      }

      try {
        const { data: existingRole } = await local
          .from('user_roles')
          .select('id')
          .eq('user_id', localUserId)
          .eq('role', 'student')
          .maybeSingle()
        if (!existingRole) {
          await local.from('user_roles').insert({ user_id: localUserId, role: 'student' })
        }
      } catch (roleErr) {
        console.warn('user_roles upsert skipped:', roleErr)
      }

      const classIdsForStudent = enrolments
        .filter(e => e.student_id === cs.id)
        .map(e => localClassIdByCentral.get(e.class_id))
        .filter((id): id is string => !!id)

      for (const classId of classIdsForStudent) {
        const { error: enrolUpsertErr } = await local
          .from('class_students')
          .upsert(
            { class_id: classId, student_user_id: localUserId, username: cs.username },
            { onConflict: 'class_id,student_user_id' },
          )
        if (enrolUpsertErr) console.error('class_students upsert failed', cs.id, classId, enrolUpsertErr)
      }
    }
  }

  // Prune students no longer on the hub roster for this teacher's active
  // Circuit classes. Mirrors student-sso's own prune step — hard-deletes the
  // shadow account and dependent rows since no FK cascade is confirmed for
  // these tables. Skipped entirely if nothing synced this run (localClassIdByCentral
  // empty), same "unknown roster, not empty roster" reasoning as the classes sync above.
  if (localClassIdByCentral.size === 0) return

  const localClassIds = [...localClassIdByCentral.values()]
  const { data: localEnrolments } = await local
    .from('class_students')
    .select('student_user_id, class_id')
    .in('class_id', localClassIds)

  const validCentralStudentIds = new Set(centralStudentIds)
  const staleUserIds = new Set<string>()

  for (const enrol of localEnrolments ?? []) {
    const { data: authUser } = await local.auth.admin.getUserById(enrol.student_user_id as string)
    const centralId = authUser?.user?.user_metadata?.central_student_id as string | undefined
    if (!centralId || !validCentralStudentIds.has(centralId)) {
      staleUserIds.add(enrol.student_user_id as string)
    }
  }

  for (const staleId of staleUserIds) {
    await Promise.all([
      local.from('class_students').delete().eq('student_user_id', staleId),
      local.from('lesson_progress').delete().eq('user_id', staleId),
      local.from('module_progress').delete().eq('user_id', staleId),
      local.from('badges').delete().eq('user_id', staleId),
      local.from('profiles').delete().eq('user_id', staleId),
      local.from('user_roles').delete().eq('user_id', staleId),
    ])
    await local.auth.admin.deleteUser(staleId)
  }
}
