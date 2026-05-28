# Circuit — Student SSO Design

**Date:** 2026-05-29  
**Status:** Approved  
**Goal:** Allow students enrolled in a central Edufied class (that has Circuit assigned) to SSO into Circuit from the student hub, with progress stored locally and identity anchored in the central database.

---

## Background

Circuit (spreadsmart-learn) previously managed its own students via in-app creation and local PINs. The Edufied platform now has a central student database at `kjjazhqkvefkesqfzcok.supabase.co` that is the single source of truth for student identity. Students log in at `student.edufied.com.au` with username + PIN, pick an app, and are redirected to `{app}/auth/sso?token=xxx` with a short-lived SSO token.

Circuit currently handles teacher SSO (`/auth/teacher/sso`) but has no student SSO route.

---

## Principles

- The central database is the **only** source of student identity — no local `students` table in Circuit
- Student identity is carried in the Supabase auth **`user_metadata`** on shadow accounts
- All progress data (`lesson_progress`, `module_progress`, `step_events` etc.) stays in Circuit's local DB, keyed to the shadow account's `auth.users.id`
- Class enrolment stays local via `class_students`

---

## Architecture

### Central DB (read-only from Circuit)

| Table | Used for |
|---|---|
| `sso_tokens` | Validating one-time SSO tokens (`student_id` column) |
| `students` | Fetching student identity on SSO |
| `student_classes` | Finding which classes a student is enrolled in |
| `app_assignments` | Checking which classes have `circuit` assigned |
| `classes` | Getting class name and `teacher_id` for auto-creation |
| `teacher_profiles` (via `teachers`) | Mapping central teacher to Circuit local teacher |

### Circuit Local DB (changes)

**1. Add `central_class_id` to `classes` table**
```sql
ALTER TABLE classes ADD COLUMN central_class_id uuid;
CREATE UNIQUE INDEX classes_central_class_id_idx ON classes (central_class_id)
  WHERE central_class_id IS NOT NULL;
```
Links each Circuit class to its central counterpart. Prevents duplicate classes being created on repeated student logins.

**No other schema changes.** Student identity is stored in `auth.users.user_metadata` only.

### Shadow Auth Account Convention

Each student gets one shadow account in Circuit's `auth.users`:
- **Email:** `student-{central_student_id}@circuit.internal`
- **user_metadata:**
  ```json
  {
    "central_student_id": "<uuid>",
    "first_name": "Emily",
    "last_name": "Smith",
    "role": "student"
  }
  ```
- No password set — account is accessed only via magic link issued by the edge function

---

## Components

### 1. Edge Function — `student-sso`

**Path:** `supabase/functions/student-sso/index.ts`  
**JWT verification:** disabled (`verify_jwt = false` in `config.toml`)  
**Secrets required:** `CENTRAL_SUPABASE_URL`, `CENTRAL_SUPABASE_SERVICE_ROLE_KEY`

**Flow:**

```
POST /functions/v1/student-sso
Body: { token: string }
```

1. **Validate token** — query central `sso_tokens` where `token = ?`, `used = false`, `expires_at > now()`, `student_id IS NOT NULL`. Return 401 if not found.
2. **Mark token used** — `UPDATE sso_tokens SET used = true WHERE id = ?`. Prevents replay.
3. **Fetch student from central** — `students` table: `id, first_name, last_name, username, year_level`.
4. **Find or create shadow auth account** — look for `student-{central_student_id}@circuit.internal` in Circuit `auth.users` via `admin.listUsers`. Create if not found, with `user_metadata` as above.
5. **Auto-enrol in Circuit classes:**
   - Query central `student_classes` for this student's class IDs
   - Query central `app_assignments` to filter those classes to ones with `app_slug = 'circuit'` and `is_active = true`
   - For each qualifying class:
     - Check if a Circuit class exists with `central_class_id = centralClassId`
     - If not: look up class name + teacher from central, find Circuit `teacher_profiles` row by `central_teacher_id` to get the local `teacher_id`. If no `teacher_profiles` row exists (teacher hasn't SSO'd into Circuit yet), skip class creation and log a warning — the student still gets a session but won't be enrolled in a class until the teacher logs in first. Otherwise: create Circuit class with `name`, `central_class_id`, `teacher_id`
     - Upsert a `class_students` row: `(class_id, student_user_id = shadow auth.users.id, username)`
6. **Issue magic link** — `local.auth.admin.generateLink({ type: 'magiclink', email: studentEmail })`. Return `{ token_hash }`.

**Error handling:** Any failure returns `{ error: '...' }` with appropriate HTTP status. The frontend redirects to `https://student.edufied.com.au?error=session_expired` on any non-OK response.

---

### 2. Page — `StudentSSO.tsx`

**Route:** `/auth/sso`  
**File:** `src/pages/StudentSSO.tsx`

On mount:
1. Read `?token` from URL. If missing → redirect to student hub with `?error=invalid_token`.
2. POST to `student-sso` edge function with the token.
3. On success: call `supabase.auth.verifyOtp({ token_hash, type: 'magiclink' })`.
4. On OTP success: navigate to `/student` (replace history).
5. On any failure: show "Sign In Failed" error card (same style as `TeacherSSO.tsx`).

Shows a full-screen spinner while processing.

---

### 3. Hook — `useStudentSession`

**File:** `src/hooks/useStudentSession.tsx`

Reads from the active Supabase auth session's `user_metadata`:
- `central_student_id`
- `first_name`, `last_name`
- `role` (must equal `'student'` to be treated as a student session)

Exposes:
- `studentSession: { central_student_id, first_name, last_name } | null`
- `isStudent: boolean`
- `signOut()` — calls `supabase.auth.signOut()` then redirects to `https://student.edufied.com.au`

Used by `StudentDashboard.tsx` to:
- Show the student's name in the header
- Guard the route (redirect to `/auth` if no student session)

---

### 4. Router — App.tsx

Add route:
```tsx
<Route path="/auth/sso" element={<StudentSSO />} />
```

---

### 5. Migration Script — Existing Pilot Students

**File:** `scripts/link-existing-students.ts` (run once, not a SQL migration)

1. List all Circuit `auth.users` where `user_roles.role = 'student'`
2. For each: find their `username` from `class_students.username`
3. Query central `students` by `username` to find a match
4. If matched: update Circuit auth user's `user_metadata` to add `central_student_id` + `role: 'student'`
5. Log unmatched students (no central record) — these keep working via direct login until removed

This script is idempotent — safe to run multiple times.

---

### 6. In-App Student Creation (to remove after SSO confirmed)

Once student SSO is verified working in production:
- Remove "Add Student" and "Bulk Add Students" buttons/UI from the teacher dashboard
- The `create-student` and `bulk-create-students` edge functions remain deployed but are no longer called

This is a separate follow-up task — not part of this implementation.

---

## RLS Considerations

Existing Circuit RLS policies use `auth.uid()` for progress tables — this continues to work unchanged, since the shadow account's `auth.users.id` is a stable UUID.

No RLS policy changes are required for this feature. Teachers already have blanket read access to all progress via `has_role(auth.uid(), 'teacher')`.

---

## Data Flow Summary

```
student.edufied.com.au
  → mint SSO token (central sso_tokens)
  → redirect to circuit.edufied.com.au/auth/sso?token=xxx

StudentSSO.tsx (Circuit)
  → POST student-sso edge function
      → validate token (central sso_tokens)
      → fetch student (central students)
      → find/create shadow auth account (circuit auth.users)
      → auto-enrol in circuit classes (circuit class_students)
      → return token_hash
  → verifyOtp → Supabase session established
  → navigate to /student
```

---

## Out of Scope

- Student PIN login directly on Circuit (existing pilot students only; removal is a follow-up)
- Student-facing class switching or multi-app navigation (ToolSwitcher is teacher-only)
- Syncing progress back to the central database
