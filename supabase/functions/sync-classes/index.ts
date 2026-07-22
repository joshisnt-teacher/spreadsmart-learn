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
  const { data: assignments } = await central
    .from('app_assignments')
    .select('class_id')
    .eq('app_slug', 'circuit')
    .eq('is_active', true)
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
