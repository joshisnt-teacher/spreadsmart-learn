-- Classes are created on the Edufied hub only and synced into Circuit by
-- teacher-sso / sync-classes, both of which use the service role key and so
-- bypass RLS entirely. Authenticated teachers have no legitimate reason to
-- insert into public.classes directly, so drop the policy that allowed it
-- (previously exploitable via the now-removed "New Class" UI, or directly
-- against the Supabase API).
DROP POLICY IF EXISTS "Teachers can insert own classes" ON public.classes;
