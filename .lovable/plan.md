

## Fix: Spreadsheet Editing and Analytics Visibility

### Problem 1: Spreadsheet cells can't be clicked

The previous fix added `allowEdit={false}` to the entire FortuneSheet Workbook component. This completely disables editing for every cell -- including the ones students need to type in. The cell lock/unlock mechanism (`lo: 0` for editable, `lo: 1` for locked) combined with sheet protection (`authority.sheet = 1`) is the correct approach and was already in place. The `allowEdit={false}` prop overrides all of that.

**Fix:**
- Remove `allowEdit={false}` from the Workbook props in `SpreadsheetWorkspace.tsx`
- Keep the existing CSS overrides that suppress the input box crash on locked cells (these are still useful as a safety net)
- The sheet protection config (`authority.sheet = 1`) already handles preventing edits to locked cells

### Problem 2: Analytics shows empty for most classes

The analytics data IS being recorded correctly in the database (19 step_starts, 3 completes, 2 check_fails). The issue is that the analytics view filters by class -- it only shows events from students enrolled in the currently selected class. Right now:

- Most events are from the teacher account (previewing modules) or from a student in a specific class
- If you're viewing a class that has no student activity yet, it correctly shows "No analytics data yet"
- Teacher preview events don't appear anywhere because the teacher isn't enrolled as a student in any class

**Fix:** Add an "All classes" option to the analytics view so teachers can see aggregate data across all students (and their own preview activity). This makes the analytics useful even before every class has completed lessons.

### Technical Changes

**File: `src/components/SpreadsheetWorkspace.tsx`**
- Remove `allowEdit={false}` from the Workbook props (line 152)
- Keep all other protections (cell locking, sheet authority, CSS overrides)

**File: `src/components/ModuleAnalyticsView.tsx`**
- Accept `classId` as optional (allow `null` for "all classes" view)
- When no class filter is set, skip the `class_students` join and show all events

**File: `src/hooks/useModuleAnalytics.ts`**
- When `classId` is `null`, skip the student ID filtering step so all events are returned

**File: `src/pages/TeacherDashboard.tsx`**
- Move the Analytics tab to also appear at the dashboard level (not just inside a class), or add an "All Classes" option within the class-level analytics selector

