

# Teacher Dashboard Refresh

## Overview

Redesign the teacher dashboard's class view to show **cross-module student progress**, add a **module filter dropdown**, let teachers **preview modules**, and polish the overall visual design.

## Current Issues

- `StudentProgressView` is hardcoded to `excelBasicsModule` only -- ignores the Charts module entirely
- No way for teachers to enter/preview modules themselves
- The class view is functional but visually flat
- No aggregate stats for the class (average progress, top students, etc.)

## Changes

### 1. Multi-Module Student Progress (`StudentProgressView.tsx`)

**Replace hardcoded single-module approach with all-module aggregation:**

- Import `allModules` from the module registry instead of just `excelBasicsModule`
- Fetch `module_progress` and `lesson_progress` for ALL modules (remove the `.eq('module_id', ...)` filter)
- Add a module filter dropdown (Select component) at the top: "All Modules", "Introduction to Excel", "Charts & Data Summaries"
- Default view: "All Modules" -- shows aggregate progress across everything

**"All Modules" view (default):**
- Progress bar = total completed lessons across all modules / total lessons across all modules
- Lessons column = total completed / total available
- XP = sum of all module XP

**Per-module filter:**
- When a specific module is selected, show progress for just that module (like current behavior but for any module)

**Expanded row per student:**
- Show a collapsible section per module (with module title as a subheader)
- Under each module, list lesson-level progress (same as current)

### 2. Class Summary Stats

Add a row of stat cards at the top of the class view (above the student table):

- **Students**: total count
- **Avg. Progress**: average completion percentage across all students
- **Total XP Earned**: sum of all student XP
- **Completion Rate**: percentage of students who have completed all lessons

These use the same data already fetched for the student table -- no extra queries needed.

### 3. Teacher Module Preview

**On the main dashboard (no class selected):**
- Add a "Preview" button to each module card in the "Available Modules" section
- Clicking it navigates to `/module/{moduleId}` -- the same route students use
- The existing `ModulePlayer` page already works for any authenticated user (no role restriction)

**In the header:**
- Change the existing "Lessons" button to "Preview Modules" for clarity

### 4. Visual Polish

- Replace the plain `<table>` in `StudentProgressView` with the shadcn `Table` components for consistent styling
- Add subtle row hover animations
- Improve the header area of the class view with a gradient banner (matching student dashboard style)
- Add student count badge to class cards on the main view

## Technical Details

### Files to Modify

**`src/components/StudentProgressView.tsx`** (major rewrite)
- Replace `excelBasicsModule` import with `allModules` from module registry
- Change data model to track progress per module per student
- Add module filter Select dropdown
- Fetch all module/lesson progress without module_id filter
- Update expanded row to group lessons by module
- Use shadcn Table components
- Add class summary stat cards

**`src/pages/TeacherDashboard.tsx`**
- Add "Preview" button to module cards that navigates to `/module/{moduleId}`
- Add gradient header styling to class view
- Rename "Lessons" nav button to "Preview Modules"
- Fetch student count per class for display on class cards

### No Database Changes Required

All data already exists in `module_progress` and `lesson_progress` tables. The teacher RLS policies already allow viewing all progress records via the `has_role()` function.

