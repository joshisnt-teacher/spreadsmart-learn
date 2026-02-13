

# Rework Assignments Tab into Modules Hub

## Overview

Rename the "Assignments" tab to "Modules" and redesign the UI so teachers see their available modules as cards. From there, they can expand a module to see its lessons (with checkboxes to select specific ones), then click "Assign to Class" to walk through a simple assignment flow (target, live date, due date).

## Changes

### 1. Rename Tab (TeacherDashboard.tsx)

Change the tab label from "Assignments" to "Modules".

### 2. Redesign AssignmentManager into a Modules View (AssignmentManager.tsx)

Replace the current "New Assignment" button + dropdown-based dialog with:

**Module Card(s)**
- Show available modules as cards (currently just the one "Introduction to Excel" module, but future-proofed for more).
- Each card shows the module title, description, estimated time, and number of lessons.
- An "Assign to Class" button on each card.
- A collapsible/expandable section showing all lessons within the module, each with a checkbox.

**Assignment Flow (Dialog)**
When the teacher clicks "Assign to Class" (or selects specific lessons via checkboxes then clicks assign):

1. The module is pre-selected. If specific lesson checkboxes were ticked, those are pre-filled.
2. Dialog shows:
   - Module name (read-only) with a summary like "All lessons" or "2 of 3 lessons selected"
   - Target: Whole Class (default) or Specific Student dropdown
   - Live Date picker
   - Due Date picker (optional)
3. "Create Assignment" button

**Existing Assignments List**
Below the module card(s), keep the existing assignments table showing what has already been assigned, with status badges and delete buttons.

### 3. File Changes

| File | Change |
|------|--------|
| `src/pages/TeacherDashboard.tsx` | Rename tab label from "Assignments" to "Modules" |
| `src/components/AssignmentManager.tsx` | Complete rewrite of the UI: module card with expandable lesson checkboxes, redesigned assign dialog, existing assignments table kept below |

### 4. No Database Changes

The `assignments` table already supports both full-module assignments (`lesson_id = null`) and per-lesson assignments (`lesson_id` set). No schema changes needed.

### 5. UX Flow

```text
Modules Tab
  |
  +-- Module Card: "Introduction to Excel"
  |     |-- Description, 3 lessons, ~45 min
  |     |-- [Expand] to show lessons with checkboxes:
  |     |     [ ] Lesson 1: Navigating a Spreadsheet
  |     |     [ ] Lesson 2: Built-in Functions
  |     |     [ ] Lesson 3: Sorting and Filtering
  |     |-- [Assign to Class] button
  |
  +-- Existing Assignments table (same as current, below)
```

When no checkboxes are ticked, "Assign to Class" assigns the entire module. When specific lessons are checked, clicking "Assign to Class" creates individual assignments for each selected lesson.

