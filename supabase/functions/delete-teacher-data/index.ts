// Service-to-service endpoint: called by the central hub (edufied.com.au)
// when a teacher deletes their central account. Wipes this teacher's local
// shadow account (and everything it owns, including their students' shadow
// accounts) in Circuit.
//
// Not a self-service endpoint — auth is a shared secret (HUB_DELETE_SECRET),
// not a teacher's own session, because the central account (and its
// session) no longer exists by the time this runs. Mirrors the cleanup done
// by the self-service delete-teacher-account function, but resolves the
// local account via teacher_profiles.central_teacher_id instead of the
// caller's own JWT.
//
// Idempotent: a teacher who never used this app resolves to "no local
// account found" and returns success with nothing to do.
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
    const expectedSecret = Deno.env.get('HUB_DELETE_SECRET')
    if (!expectedSecret) {
      console.error('Missing secret: HUB_DELETE_SECRET')
      return json({ error: 'Server misconfiguration: missing HUB_DELETE_SECRET' }, 500)
    }

    const authHeader = req.headers.get('Authorization')
    if (authHeader !== `Bearer ${expectedSecret}`) {
      return json({ error: 'Unauthorized' }, 401)
    }

    const { central_teacher_id } = await req.json()
    if (!central_teacher_id) {
      return json({ error: 'Missing central_teacher_id' }, 400)
    }

    const local = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    )

    const { data: profile, error: profileErr } = await local
      .from('teacher_profiles')
      .select('id')
      .eq('central_teacher_id', central_teacher_id)
      .maybeSingle()

    if (profileErr) {
      console.error('teacher_profiles lookup failed:', profileErr)
      return json({ error: profileErr.message }, 500)
    }

    if (!profile?.id) {
      // Teacher never used this app locally — nothing to clean up.
      return json({ success: true, found: false })
    }

    const teacherId = profile.id

    // Get all classes owned by this teacher
    const { data: classes } = await local.from('classes').select('id').eq('teacher_id', teacherId)
    const classIds = (classes ?? []).map((c: { id: string }) => c.id)

    // Get all students in those classes
    let studentUserIds: string[] = []
    if (classIds.length > 0) {
      const { data: students } = await local
        .from('class_students')
        .select('student_user_id')
        .in('class_id', classIds)
      studentUserIds = [...new Set((students ?? []).map((s: { student_user_id: string }) => s.student_user_id))]
    }

    // Delete all student shadow accounts and their data
    for (const studentId of studentUserIds) {
      await Promise.all([
        local.from('class_students').delete().eq('student_user_id', studentId),
        local.from('lesson_progress').delete().eq('user_id', studentId),
        local.from('module_progress').delete().eq('user_id', studentId),
        local.from('badges').delete().eq('user_id', studentId),
        local.from('step_events').delete().eq('user_id', studentId),
        local.from('profiles').delete().eq('user_id', studentId),
        local.from('user_roles').delete().eq('user_id', studentId),
      ])
      await local.auth.admin.deleteUser(studentId)
    }

    // Delete teacher's own data
    await Promise.all([
      local.from('assignments').delete().eq('teacher_id', teacherId),
      local.from('step_events').delete().eq('user_id', teacherId),
      local.from('lesson_progress').delete().eq('user_id', teacherId),
      local.from('module_progress').delete().eq('user_id', teacherId),
      local.from('badges').delete().eq('user_id', teacherId),
    ])

    // Delete classes
    if (classIds.length > 0) {
      await local.from('classes').delete().in('id', classIds)
    }

    await local.from('profiles').delete().eq('user_id', teacherId)
    await local.from('user_roles').delete().eq('user_id', teacherId)

    // Delete the teacher's local shadow auth account (cascades teacher_profiles)
    const { error: authErr } = await local.auth.admin.deleteUser(teacherId)
    if (authErr) {
      console.error('auth user delete failed:', authErr)
      return json({ error: `auth user delete failed: ${authErr.message}` }, 500)
    }

    return json({ success: true, found: true })
  } catch (err) {
    console.error('delete-teacher-data error:', err)
    return json({ error: err instanceof Error ? err.message : 'Internal server error' }, 500)
  }
})

function json(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
