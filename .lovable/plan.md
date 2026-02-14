

# Student Dashboard Improvements

## Issues Found

### Bug 1: Stats only reflect the first module
Lines 128-130 call `useProgress(allModules[0]?.id)` and `useStudentAssignments(allModules[0]?.id)`, so the header stats (Total XP, Lessons Done, Upcoming Due) only show data for the "Introduction to Excel" module. They should aggregate across all modules.

### Bug 2: Button never says "Review" / "View"
Line 64 only checks `completedCount > 0` to toggle between "Start" and "Continue". It never detects a fully completed module.

### Bug 3: Per-lesson due dates shown unnecessarily
Lines 106-111 display a due date badge on each lesson row, but due dates are only meaningful at the module level (already shown next to the title).

---

## Plan

### 1. Fix aggregated stats
- Remove the single-module `useProgress` / `useStudentAssignments` calls from the main `StudentDashboard` component.
- Create a small `useAggregatedStats` hook (or inline logic) that queries `module_progress` for all rows belonging to the current user, then sums `total_xp` and counts all `completed_lesson_ids` across every module.
- For "Upcoming Due", query all assignments for the student (no module filter) and count those with a future `due_date`.

### 2. Completed module state
- In `ModuleCard`, compare `completedCount === totalLessons` (and `totalLessons > 0`).
- If fully complete: show a "Review" button (with a different icon, e.g. `Eye` or `RotateCcw`) instead of "Continue", and add a small "Completed" badge/checkmark on the card.
- The progress bar will show 100%.

### 3. Remove per-lesson due dates
- Remove the `getDueDate` call and the `CalendarClock` badge from each lesson row inside `ModuleCard`.
- Keep the module-level due date label next to the title (already working).

### 4. "More Modules" section
- Below "My Modules", add a "More Modules" section.
- This will list modules from `allModules` that the student does **not** have any assignments for (i.e., optional/unassigned modules).
- Teachers can assign these later, making them appear in "My Modules".
- If there are no unassigned modules, hide the section.
- Assigned modules appear in "My Modules"; unassigned ones appear in "More Modules" with a lighter visual treatment.

### 5. Profile button
- Add an avatar/profile button in the header (top-right, next to Sign Out).
- Clicking it opens a dialog/sheet where the student can:
  - Edit their display name (updates `profiles.display_name`).
  - Upload an avatar image (uploads to a storage bucket, updates `profiles.avatar_url`).
- Show the student's current avatar (or initials fallback) in the header.
- The `profiles` table already has `display_name` and `avatar_url` columns, so no database changes are needed.
- A new `avatar-uploads` storage bucket will be created for student avatar images.

---

## Technical Details

### Files to modify
- **`src/pages/StudentDashboard.tsx`** -- main changes for all 5 items
- **`src/hooks/useProgress.ts`** -- add a new `useAggregatedProgress` hook that fetches all `module_progress` rows for the user
- **`src/hooks/useAssignments.ts`** -- add a `useAllStudentAssignments` hook (no module filter) for the upcoming due count and for splitting modules into assigned vs. unassigned

### New files
- **`src/components/StudentProfileDialog.tsx`** -- profile edit dialog with name input and avatar upload

### Database / Storage
- Create an `avatar-uploads` public storage bucket with appropriate RLS (authenticated users can upload/manage their own files, public read access)
- No table schema changes needed (profiles table already has the right columns)

### Aggregated stats query approach
```sql
-- All module progress for user
SELECT module_id, completed_lesson_ids, total_xp
FROM module_progress
WHERE user_id = :userId

-- All assignments for student (across all modules)
SELECT * FROM assignments
WHERE student_user_id = :userId OR class_id IN (
  SELECT class_id FROM class_students WHERE student_user_id = :userId
)
```

### Module splitting logic
- Fetch all student assignments (no module filter).
- "My Modules" = modules where at least one assignment exists targeting that module.
- "More Modules" = remaining modules from `allModules` with no assignments.
- If the student has zero assignments total, default to showing everything under "My Modules" (current behavior).
