

# Fix: Student Deletion Not Removing Auth Account

## Problem

The current "delete student" button only removes the row from `class_students`. The underlying auth user (with email `username@student.excelpath.local`) remains in the system. When a teacher tries to re-create the same username, the backend rejects it because the email is already registered.

## Solution

Create a new backend function (`delete-student`) that:
1. Verifies the caller is a teacher who owns the class
2. Deletes the `class_students` row
3. Cleans up related data (`lesson_progress`, `module_progress`, `badges`, `profiles`, `user_roles`)
4. Deletes the auth user account using the admin API

Then update the frontend to call this function instead of directly deleting from `class_students`.

## Changes

### 1. New Edge Function: `supabase/functions/delete-student/index.ts`

- Accepts `{ student_user_id, class_id }` in the request body
- Validates the calling teacher owns the class
- Deletes from `class_students`, `lesson_progress`, `module_progress`, `badges`, `profiles`, `user_roles`
- Calls `adminClient.auth.admin.deleteUser(student_user_id)` to fully remove the auth account
- Returns success/error JSON

### 2. Update `supabase/config.toml`

Add the new function config with `verify_jwt = false` (same pattern as other student management functions, since auth is checked manually inside the function).

### 3. Update `src/components/StudentProgressView.tsx`

Change the `handleDelete` function from:
```
supabase.from('class_students').delete().eq('id', student.id)
```
to calling the new `delete-student` edge function via `supabase.functions.invoke('delete-student', ...)`.

### 4. Summary of file changes

| File | Change |
|------|--------|
| `supabase/functions/delete-student/index.ts` | New edge function to fully delete student account |
| `supabase/config.toml` | Add `[functions.delete-student]` config |
| `src/components/StudentProgressView.tsx` | Call edge function instead of direct table delete |

## No Database Schema Changes

All required tables and RLS policies already exist. The edge function uses the service role to bypass RLS for cleanup.
