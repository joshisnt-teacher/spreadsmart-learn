# Circuit SSO — Handoff Notes
_Last updated: 2026-06-02_

---

## What Was Done This Session

### 1. Fixed `student-sso` edge function (env var bug)
`supabase/functions/student-sso/index.ts` was using `SB_URL` and `SB_SERVICE_ROLE_KEY`
instead of the Supabase auto-provided `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
This would have caused the function to crash silently on every invocation.
**Fixed and redeployed.**

### 2. Auth.tsx — teacher tab replaced with "Sign in with Edufied"
`src/pages/Auth.tsx` previously had a full email/password login form for teachers plus
a teacher signup flow. Both were removed. The teacher tab now shows a single
"Sign in with Edufied" button (`window.location.href = 'https://edufied.com.au'`).
The student tab (username + PIN) is unchanged — legacy local students still use it.

### 3. Migrations pushed to production
Three migrations were applied to the Circuit Supabase project (`ribpzkdzvpqyheftxblz`):
- `20260523000000_add_teacher_profiles.sql` — creates `teacher_profiles` bridge table
- `20260531230000_lesson_assessments.sql` — creates `lesson_assessments` table + RLS
- `20260601152258_add_central_class_id.sql` — adds `central_class_id` to `classes`

All three were made idempotent (IF NOT EXISTS / DO $$ guards) because the remote DB
already had some of the schema applied manually via the dashboard.

### 4. `student-sso` deployed to production
The `student-sso` edge function was deployed to Circuit's Supabase project for the first
time. It was in the codebase but had never been deployed live.

### 5. `teacher-sso` redeployed
`teacher-sso` was redeployed to pick up the latest code and ensure a clean deployment.

### 6. Merged `feature/assessment-based-modules` → `main` and pushed to GitHub
All changes (plus the full assessment-based modules feature that was on the branch)
are now on `main` and should trigger a Netlify deploy.

---

## Architecture Summary

Circuit SSO works as follows:

**Teacher login:**
1. Teacher goes to `circuit.edufied.com.au/auth`, clicks "Sign in with Edufied"
2. Redirected to `edufied.com.au`, authenticates, launches Circuit from the tools page
3. `edufied.com.au` calls `mintTokenForTeacher('circuit')` → inserts into central `sso_tokens`
4. Redirects to `circuit.edufied.com.au/auth/teacher/sso?token=xxx`
5. `TeacherSSO.tsx` calls the `teacher-sso` edge function on Circuit's Supabase project
6. Edge function validates token against central DB, finds/creates local auth user,
   upserts `teacher_profiles` row, issues magic link
7. Frontend calls `supabase.auth.verifyOtp()`, session established, navigates to `/dashboard`

**Student login:**
1. Student logs into `student.edufied.com.au`, selects Circuit
2. Student hub creates a token in central `sso_tokens` with `student_id` set
3. Redirects to `circuit.edufied.com.au/auth/sso?token=xxx`
4. `StudentSSO.tsx` calls the `student-sso` edge function
5. Edge function validates token, finds/creates shadow auth account
   (`student-{central_student_id}@circuit.internal`), auto-enrols in circuit classes,
   issues magic link
6. Frontend calls `supabase.auth.verifyOtp()`, session established, navigates to `/student`

**Central DB (kjjazhqkvefkesqfzcok.supabase.co):**
- `sso_tokens` — one-time tokens, 5 min expiry
- `apps` — has a `circuit` row with `base_url = https://circuit.edufied.com.au`
- `app_assignments` — `circuit` is assigned to classes `8.2 Digi` and `8.4 Digi`

**Circuit Supabase project:** `ribpzkdzvpqyheftxblz`

---

## Current Issue — Teacher SSO Redirects Back to Edufied

**Symptom:** When launching Circuit from `edufied.com.au`, the teacher is immediately
redirected back to `edufied.com.au` instead of landing on the Circuit dashboard.

**Diagnosis from `sso_tokens` table:**
Multiple recent `circuit` tokens show `used: false` even after expiry. This means
edufied.com.au is generating the tokens correctly and redirecting to Circuit, but
Circuit's `teacher-sso` edge function is never marking them used. It's failing before
step 2 (mark token used), which means it's crashing at step 1 (token validation) or
at the top-of-function secrets check.

The `teacher-sso` function crashes with "Server misconfiguration: missing central DB
secrets" if `CENTRAL_SUPABASE_URL` or `CENTRAL_SUPABASE_SERVICE_ROLE_KEY` are not set.
This returns a 500 to `TeacherSSO.tsx`, which redirects to `edufied.com.au?error=session_expired`.

**What's been confirmed:**
- Secrets `CENTRAL_SUPABASE_URL` and `CENTRAL_SUPABASE_SERVICE_ROLE_KEY` are reportedly
  already saved in the Supabase dashboard for the Circuit project.
- `teacher-sso` was redeployed fresh this session.
- The MCP tool does not have access to Circuit's edge function logs
  (`ribpzkdzvpqyheftxblz` returns access denied).

**Next steps to diagnose:**
1. Go to the Supabase dashboard → Circuit project (`ribpzkdzvpqyheftxblz`) →
   Edge Functions → `teacher-sso` → **Logs tab**. Try to launch Circuit from edufied.com.au
   and watch for the log output. Look for: "Missing secrets", "Invalid or expired token",
   or any uncaught exception.
2. If secrets look correct in logs, the issue may be that the Netlify deploy hasn't
   finished yet (the old frontend might still be live). Check the Netlify deploy status
   for the `circuit.edufied.com.au` site.
3. Once the correct error is identified from logs, the fix will be straightforward.

**One more thing — teacher account migration:**
Josh's teacher account was created via direct email/password signup on Circuit (not
via Edufied SSO). The `teacher_profiles` table row linking his local Circuit user ID
to his central teacher UUID does not exist yet. This row is auto-created the FIRST time
he logs in via the Edufied hub. Until that first successful SSO login, some
teacher-specific functionality that relies on `teacher_profiles` may not work.

---

## Key File Paths

| File | Purpose |
|---|---|
| `src/pages/Auth.tsx` | Login page — student PIN tab + teacher "Sign in with Edufied" |
| `src/pages/TeacherSSO.tsx` | Handles `/auth/teacher/sso?token=xxx` redirect |
| `src/pages/StudentSSO.tsx` | Handles `/auth/sso?token=xxx` redirect |
| `src/hooks/useStudentSession.tsx` | Reads SSO student identity from user_metadata |
| `supabase/functions/teacher-sso/index.ts` | Validates teacher token, creates local auth |
| `supabase/functions/student-sso/index.ts` | Validates student token, creates shadow account |
| `supabase/migrations/20260601152258_add_central_class_id.sql` | SSO auto-enrolment schema |

## Supabase Projects

| Project | Ref | Purpose |
|---|---|---|
| Circuit (local) | `ribpzkdzvpqyheftxblz` | Circuit's own auth, classes, progress data |
| Central (Edufied hub) | `kjjazhqkvefkesqfzcok` | Student/teacher identity, SSO tokens |
