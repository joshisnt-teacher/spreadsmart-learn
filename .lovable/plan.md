

# Assignment System for Teachers

## Overview

Add the ability for teachers to assign modules, individual lessons, or specific steps to entire classes or individual students -- with a **live date** (when students can start) and a **due date** (deadline). Teachers manage all assignments from the dashboard. Students only see content that has been assigned to them and is currently live.

## Database Changes

A single new `assignments` table:

```text
assignments
-----------
id              uuid (PK, default gen_random_uuid())
teacher_id      uuid (NOT NULL, references auth.users)
class_id        uuid (nullable, references classes)
student_user_id uuid (nullable) -- for individual assignments
module_id       text (NOT NULL)
lesson_id       text (nullable) -- null = whole module
step_id         text (nullable) -- null = whole lesson
live_date       timestamptz (NOT NULL) -- when it becomes visible
due_date        timestamptz (nullable) -- optional deadline
created_at      timestamptz (default now())
```

- If `class_id` is set, the assignment applies to every student in that class.
- If `student_user_id` is set instead, it targets one student.
- `lesson_id` being null means the entire module is assigned; a specific `lesson_id` scopes it to that lesson; adding `step_id` scopes it further to a single step/stage.

RLS policies:
- Teachers can CRUD their own assignments.
- Students can SELECT assignments where they are the target student OR belong to the target class, AND `live_date <= now()`.

## Teacher Dashboard Changes

### New "Assignments" Tab or Section

When a teacher selects a class, a new **Assignments** tab appears alongside the existing student progress view. This tab shows:

1. **"New Assignment" button** -- opens a dialog with:
   - **Scope selector**: Module / Lesson / Step (dropdown that narrows progressively)
   - **Target**: "Whole class" (default) or select specific student(s)
   - **Live date**: Date picker (defaults to now)
   - **Due date**: Optional date picker
2. **Assignment list** -- a table showing all assignments for the class:
   - Scope (e.g. "Lesson 2: Built-in Functions")
   - Target (class or student name)
   - Live date
   - Due date
   - Status (Scheduled / Live / Past Due)
   - Delete button

### Files modified:
- `src/pages/TeacherDashboard.tsx` -- add Assignments tab, "New Assignment" dialog, assignment list

## Student-Side Content Filtering

Currently students see all lessons in the module. With assignments:

- The `Index.tsx` page and `ModuleLanding` component will check assigned content for the logged-in student.
- If assignments exist for this student, only assigned (and currently live) lessons/steps are shown.
- If no assignments exist at all, all content remains visible (backwards-compatible for unmanaged classes).

### Files modified:
- `src/pages/Index.tsx` -- fetch assignments for current user, filter visible lessons
- `src/components/ModuleLanding.tsx` -- accept optional `assignedLessonIds` prop, dim or hide unassigned lessons, show due dates on assigned ones

## New Shared Hook

A `useAssignments` hook to:
- Fetch assignments for a student (used on Index page)
- Fetch assignments for a class (used on Teacher Dashboard)

### Files created:
- `src/hooks/useAssignments.ts`

## Summary of Changes

| Area | Change |
|------|--------|
| Database | New `assignments` table with RLS |
| Teacher Dashboard | Assignments tab with create/list/delete |
| Student view | Filter visible content by live assignments |
| Hooks | New `useAssignments.ts` |
| Types | No changes needed (assignment data is simple enough for inline types) |

## What This Does NOT Change

- The module data file, marking engine, lesson player, and spreadsheet workspace remain untouched.
- Existing progress tracking continues to work as-is.
- Classes without any assignments behave exactly as they do today (all content visible).

