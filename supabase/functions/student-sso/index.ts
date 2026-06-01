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

    // 1. Validate SSO token — must be unused, not expired, and for a student
    const { data: tokenRow, error: tokenError } = await central
      .from('sso_tokens')
      .select('id, student_id, used, expires_at')
      .eq('token', token)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .not('student_id', 'is', null)
      .maybeSingle()

    if (tokenError || !tokenRow) {
      return json({ error: 'Invalid or expired token' }, 401)
    }

    // 2. Mark token as used immediately to prevent replay
    await central
      .from('sso_tokens')
      .update({ used: true })
      .eq('id', tokenRow.id)

    // 3. Fetch student details from central DB
    const { data: centralStudent, error: studentError } = await central
      .from('students')
      .select('id, first_name, last_name, username, year_level')
      .eq('id', tokenRow.student_id)
      .single()

    if (studentError || !centralStudent) {
      console.error('Central student lookup error:', JSON.stringify(studentError))
      return json({ error: 'Student not found in central database' }, 401)
    }

    // 4. Find or create shadow auth account for this student
    const studentEmail = `student-${centralStudent.id}@circuit.internal`

    const listResult = await local.auth.admin.listUsers({ perPage: 1000 })
    const existingUser = listResult.data?.users?.find(u => u.email === studentEmail) ?? null

    let localUserId: string

    if (existingUser) {
      localUserId = existingUser.id
      // Update metadata in case names changed
      await local.auth.admin.updateUserById(localUserId, {
        user_metadata: {
          central_student_id: centralStudent.id,
          first_name: centralStudent.first_name,
          last_name: centralStudent.last_name,
          username: centralStudent.username,
          year_level: centralStudent.year_level,
          role: 'student',
        },
      })
    } else {
      const { data: newUser, error: createError } = await local.auth.admin.createUser({
        email: studentEmail,
        email_confirm: true,
        user_metadata: {
          central_student_id: centralStudent.id,
          first_name: centralStudent.first_name,
          last_name: centralStudent.last_name,
          username: centralStudent.username,
          year_level: centralStudent.year_level,
          role: 'student',
        },
      })

      if (createError || !newUser?.user) {
        console.error('Create student auth user error:', JSON.stringify(createError))
        return json({ error: 'Failed to create student account' }, 500)
      }

      localUserId = newUser.user.id
    }

    // Ensure user_roles has 'student' for this user
    try {
      await local.from('user_roles').upsert(
        { user_id: localUserId, role: 'student' },
        { onConflict: 'user_id' }
      )
    } catch (roleErr) {
      console.warn('user_roles upsert skipped:', roleErr)
    }

    // 5. Auto-enrol in Circuit classes based on central assignments
    try {
      // Get the classes this student is enrolled in at the central hub
      const { data: centralEnrolments } = await central
        .from('student_classes')
        .select('class_id')
        .eq('student_id', centralStudent.id)

      if (centralEnrolments && centralEnrolments.length > 0) {
        const centralClassIds = centralEnrolments.map(e => e.class_id)

        // Filter to only classes that have 'circuit' assigned and active
        const { data: appAssignments } = await central
          .from('app_assignments')
          .select('class_id')
          .in('class_id', centralClassIds)
          .eq('app_slug', 'circuit')
          .eq('is_active', true)

        const assignedCentralClassIds = new Set(appAssignments?.map(a => a.class_id) ?? [])

        for (const centralClassId of assignedCentralClassIds) {
          // Check if local class already exists
          const { data: existingLocalClass } = await local
            .from('classes')
            .select('id')
            .eq('central_class_id', centralClassId)
            .maybeSingle()

          let localClassId: string

          if (existingLocalClass) {
            localClassId = existingLocalClass.id
          } else {
            // Look up class details from central
            const { data: centralClass } = await central
              .from('classes')
              .select('name, teacher_id')
              .eq('id', centralClassId)
              .maybeSingle()

            if (!centralClass) continue

            // Find local teacher by central_teacher_id
            const { data: localTeacherProfile } = await local
              .from('teacher_profiles')
              .select('id')
              .eq('central_teacher_id', centralClass.teacher_id)
              .maybeSingle()

            if (!localTeacherProfile) {
              console.warn(`Teacher for central class ${centralClassId} has not logged into Circuit yet. Skipping class creation.`)
              continue
            }

            // Create local class
            const { data: newClass, error: classCreateError } = await local
              .from('classes')
              .insert({
                name: centralClass.name,
                central_class_id: centralClassId,
                teacher_id: localTeacherProfile.id,
                join_code: generateJoinCode(),
              })
              .select('id')
              .single()

            if (classCreateError || !newClass) {
              console.warn('Failed to create local class for central class', centralClassId, classCreateError)
              continue
            }

            localClassId = newClass.id
          }

          // Upsert class_students enrolment
          await local
            .from('class_students')
            .upsert({
              class_id: localClassId,
              student_user_id: localUserId,
              username: centralStudent.username,
            }, { onConflict: 'class_id,student_user_id' })
        }
      }
    } catch (enrolErr) {
      console.warn('Auto-enrolment warning (non-fatal):', enrolErr)
    }

    // 6. Generate a one-time magic link token for the client to establish a session
    const { data: linkData, error: linkError } = await local.auth.admin.generateLink({
      type: 'magiclink',
      email: studentEmail,
    })

    if (linkError || !linkData?.properties?.hashed_token) {
      console.error('Generate link error:', JSON.stringify(linkError))
      return json({ error: 'Failed to generate session token' }, 500)
    }

    return json({ token_hash: linkData.properties.hashed_token })

  } catch (err) {
    console.error('Student SSO error:', err)
    return json({ error: 'Internal server error' }, 500)
  }
})

function generateJoinCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

function json(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
