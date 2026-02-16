

## Pre-Launch Security and Auth Hardening

### Current State Summary

Your app is in good shape. RLS is enabled on every table with restrictive (not permissive) policies. Edge functions validate teacher ownership server-side. Here's what needs attention:

---

### 1. Security and Permissions Fixes

**Already solid:**
- RLS enabled on all 8 tables with restrictive policies
- Student progress scoped to own user ID
- Teacher queries scoped to own classes/modules
- Edge functions (create-student, delete-student, bulk-create-students) verify teacher role and class ownership server-side

**Fixes needed:**

| Issue | What to do |
|-------|-----------|
| Students can't view their own class info | Add a SELECT policy on `classes` so students enrolled via `class_students` can see their class name |
| Module banner uploads not teacher-scoped | Tighten the `module-banners` storage policy to check `has_role(auth.uid(), 'teacher')` instead of just `auth.uid() IS NOT NULL` (currently any logged-in student could upload/delete banners) |
| Leaked password protection disabled | Enable it via the authentication settings to prevent users from using known compromised passwords |
| No admin role needed for MVP | Skip admin-level access for now -- teacher + student roles are sufficient. Can add later as Phase 2. |

---

### 2. Authentication Improvements

**Current state:** Email+password for teachers, username+PIN for students. No password reset, no session management, no SSO.

**MVP plan:**

| Feature | Implementation |
|---------|---------------|
| Password reset for teachers | Add a "Forgot password?" link on the login form, create a `/reset-password` page that handles the recovery token and lets teachers set a new password |
| Session timeout | Not critical for MVP -- Supabase sessions auto-refresh. Revisit if schools require it. |
| "Log out everywhere" | Not available without custom session tracking. The existing sign-out clears the current session, which is sufficient for MVP. |
| Google/Microsoft SSO | Mark as Phase 1.1 -- not needed for launch. Lovable Cloud supports Google OAuth out of the box when you're ready. |
| Account linking (email + SSO) | Only relevant once SSO is added. Phase 1.1. |

---

### 3. Route Protection

Currently, routes are "soft-protected" via `useEffect` redirects. This works but briefly flashes content before redirecting. For MVP this is acceptable, but we can tighten it by showing a loading spinner until auth state is confirmed.

---

### Implementation Steps

1. **Database migration** -- Add `classes` SELECT policy for students
2. **Database migration** -- Tighten `module-banners` storage policies to require teacher role
3. **Enable leaked password protection** via auth settings
4. **Add password reset flow:**
   - "Forgot password?" link on the teacher login tab
   - New `/reset-password` page that reads the recovery token and calls `updateUser({ password })`
   - Add route in `App.tsx`
5. **Minor:** Ensure loading states prevent content flash on protected routes

### What's deferred to Phase 1.1
- Google/Microsoft SSO for school accounts
- Account linking rules
- "Log out everywhere" / session management
- Admin role with full access
- Signed URLs for storage (public buckets are fine for avatars and module banners since they contain no sensitive data)

### Technical Details

**New SELECT policy on `classes`:**
```sql
CREATE POLICY "Students can view enrolled classes"
ON public.classes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.class_students
    WHERE class_students.class_id = classes.id
    AND class_students.student_user_id = auth.uid()
  )
);
```

**Tightened storage policies for module-banners:**
```sql
-- Drop overly permissive policies
DROP POLICY "Teachers can upload module banners" ON storage.objects;
DROP POLICY "Teachers can update module banners" ON storage.objects;
DROP POLICY "Teachers can delete module banners" ON storage.objects;

-- Recreate with role check
CREATE POLICY "Teachers can upload module banners" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'module-banners' AND has_role(auth.uid(), 'teacher')
);
CREATE POLICY "Teachers can update module banners" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'module-banners' AND has_role(auth.uid(), 'teacher')
);
CREATE POLICY "Teachers can delete module banners" ON storage.objects
FOR DELETE USING (
  bucket_id = 'module-banners' AND has_role(auth.uid(), 'teacher')
);
```

**Password reset page (`/reset-password`):**
- Reads `type=recovery` from URL hash
- Shows a "Set new password" form
- Calls `supabase.auth.updateUser({ password })`
- Redirects to `/auth` on success

