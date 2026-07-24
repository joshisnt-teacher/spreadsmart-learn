// Lets a signed-in Circuit teacher pull their latest classes down from the
// central Edufied hub without needing a fresh SSO login. teacher-sso already
// does this sync on every hub->Circuit handoff; this exists for the
// fast-switch path (AuthSwitch.tsx), which skips that handoff entirely when
// a local session already exists — so assigning/unassigning Circuit to a
// class, or archiving a class, on the hub would otherwise never propagate to
// an already-logged-in Circuit session.
//
// syncClasses is copied verbatim from teacher-sso/index.ts rather than
// shared, matching the existing convention for this sync pattern (see
// Atlas's and the-teacher-tool's sync-classes, which duplicate teacher-sso's
// logic the same way).
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return json({ error: 'Missing auth token' }, 401)
  }
  const localToken = authHeader.replace('Bearer ', '')

  const centralUrl = Deno.env.get('CENTRAL_SUPABASE_URL')
  const centralKey = Deno.env.get('CENTRAL_SUPABASE_SERVICE_ROLE_KEY')
  if (!centralUrl || !centralKey) {
    console.error('Missing secrets: CENTRAL_SUPABASE_URL=' + !!centralUrl + ' CENTRAL_SUPABASE_SERVICE_ROLE_KEY=' + !!centralKey)
    return json({ error: 'Server misconfiguration: missing central DB secrets' }, 500)
  }

  const local = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  )

  const { data: { user }, error: userErr } = await local.auth.getUser(localToken)
  if (userErr || !user) {
    return json({ error: 'Invalid auth token' }, 401)
  }

  const { data: profile, error: profileErr } = await local
    .from('teacher_profiles')
    .select('central_teacher_id')
    .eq('id', user.id)
    .maybeSingle()

  if (profileErr) {
    console.error('teacher_profiles lookup failed', profileErr)
    return json({ error: 'Failed to load teacher profile' }, 500)
  }
  if (!profile?.central_teacher_id) {
    return json({ error: 'Teacher profile not linked to central account' }, 400)
  }

  const central = createClient(centralUrl, centralKey)

  try {
    const result = await syncClasses(central, local, user.id, profile.central_teacher_id as string)

    try {
      await syncStudents(central, local, profile.central_teacher_id as string)
    } catch (syncErr) {
      console.error('student sync failed (non-fatal):', syncErr)
    }

    return json(result)
  } catch (e) {
    console.error('class sync failed', e)
    return json({ error: 'Sync failed' }, 500)
  }
})

// ---------------------------------------------------------------------------
// syncClasses — mirrors hub classes into Circuit. Identical to
// teacher-sso/index.ts's copy, plus a { synced, archived } return value
// (teacher-sso ignores the return since it's non-fatal there).
// ---------------------------------------------------------------------------
async function syncClasses(
  central: ReturnType<typeof createClient>,
  local: ReturnType<typeof createClient>,
  localUserId: string,
  hubTeacherId: string,
): Promise<{ synced: number; archived: number }> {
  const { data: assignments, error: assignmentsError } = await central
    .from('app_assignments')
    .select('class_id')
    .eq('app_slug', 'circuit')
    .eq('is_active', true)
  if (assignmentsError) {
    // Bail out rather than treating a fetch failure as "no assignments" —
    // that would archive every synced class below.
    console.error('hub app_assignments fetch failed, skipping sync this run', assignmentsError)
    return { synced: 0, archived: 0 }
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
      return { synced: 0, archived: 0 }
    }
    hubClasses = data ?? []
  }

  let synced = 0
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
    if (upsertErr) {
      console.error('class upsert failed', hubClass.id, upsertErr)
    } else {
      synced++
    }
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

  let archived = 0
  if (staleIds.length > 0) {
    const { error: archiveErr } = await local
      .from('classes')
      .update({ archived_at: new Date().toISOString() })
      .in('id', staleIds)
    if (archiveErr) {
      console.error('class archive failed', staleIds, archiveErr)
    } else {
      archived = staleIds.length
    }
  }

  return { synced, archived }
}

// ---------------------------------------------------------------------------
// syncStudents — identical to teacher-sso/index.ts's copy. Auto-provisions a
// local shadow account (real Supabase Auth user, matching student-sso's own
// account-creation logic) for every student on the hub roster across the
// teacher's active Circuit classes, and enrols them in class_students.
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

    // One lookup for the whole run, instead of one per student — the old code
    // tried createUser first and fell back to a full listUsers scan on every
    // already-existing student (i.e. every returning student, every login),
    // which was slow enough to time out a class-sized sync and take the whole
    // login down with it.
    // NOTE: caps at 1000 local auth users (perPage max). If this school's
    // Circuit accounts ever exceed that, students past the first 1000 won't
    // be found here and will hit the createUser-fails-as-duplicate branch
    // below with no recovery — revisit with real pagination if that happens.
    const { data: existingUsersPage, error: listError } = await local.auth.admin.listUsers({ perPage: 1000 })
    if (listError) console.error('listUsers failed, student sync may mis-handle existing accounts this run', listError)
    const existingByEmail = new Map((existingUsersPage?.users ?? []).map(u => [u.email, u]))

    for (const cs of centralStudents ?? []) {
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
      const existingUser = existingByEmail.get(studentEmail)

      if (existingUser) {
        localUserId = existingUser.id
        const meta = existingUser.user_metadata ?? {}
        const metadataChanged = Object.entries(studentMetadata).some(([k, v]) => meta[k] !== v)
        if (metadataChanged) {
          await local.auth.admin.updateUserById(localUserId, { user_metadata: studentMetadata })
        }
      } else {
        const { data: newUser, error: createError } = await local.auth.admin.createUser({
          email: studentEmail,
          email_confirm: true,
          user_metadata: studentMetadata,
        })
        if (newUser?.user) {
          localUserId = newUser.user.id
        } else {
          // Falls through here if the account actually already existed but
          // wasn't in the upfront listUsers snapshot (e.g. it was created
          // moments earlier and hadn't propagated yet, or the snapshot missed
          // a page). Re-check just this one student before giving up, rather
          // than the old code's full-list rescan on every already-existing one.
          const { data: retryList, error: retryListError } = await local.auth.admin.listUsers({ perPage: 1000 })
          const foundOnRetry = retryList?.users?.find(u => u.email === studentEmail) ?? null
          if (!foundOnRetry) {
            console.error('student account creation failed', {
              centralStudentId: cs.id,
              username: cs.username,
              email: studentEmail,
              createError,
              retryListError,
            })
            continue
          }
          localUserId = foundOnRetry.id
          await local.auth.admin.updateUserById(localUserId, { user_metadata: studentMetadata })
        }
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
