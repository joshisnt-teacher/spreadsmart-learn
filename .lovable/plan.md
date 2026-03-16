

## Excel Academy — Readiness Assessment

### Overall Verdict: **Strong foundation, a few issues to address before public release**

The codebase is well-structured, security is thoughtfully implemented, and the core learning experience works. Below are findings organised by severity.

---

### 1. Critical Issues (Fix Before Launch)

**A. Mobile responsiveness is missing**
The `LessonPlayer` uses a fixed sidebar layout (`w-64` + `flex h-screen`) that breaks completely on mobile. The spreadsheet workspace, chart builder, and step navigation are all desktop-only. A teacher trying to demo on a tablet or a student on a phone will see a broken layout. This is the single biggest blocker for real-world classroom use.

**B. No error handling on network failures**
Almost every database call (`supabase.from(...)`) silently ignores errors. If a student loses Wi-Fi mid-lesson, their progress save fails silently, their XP disappears, and they get no feedback. Key examples:
- `useProgress.ts` line 30-35: no error handling on load
- `useProgress.ts` line 55-63: no error handling on upsert
- `useStepAnalytics.ts`: analytics insert failures are silent
- `useAssignments.ts`: student assignment fetch has no error state

At minimum, progress saves should retry or show a toast on failure.

**C. Student dashboard only shows built-in modules**
`StudentDashboard.tsx` line 173 uses `allModules` (the hardcoded registry) to calculate `totalLessons`. Custom modules assigned by teachers are never shown on the student dashboard. The `assignedModuleIds` filter on line 176 checks against `allModules`, so any custom module ID will never match. Students assigned a teacher-created module have no way to access it from their dashboard.

---

### 2. Significant Issues (Fix Soon After Launch)

**D. The `useProgress` hook has a stale closure in `markLessonComplete`**
The `markLessonComplete` callback (line 47) captures `state` via its dependency array. If a student completes two steps quickly, the second call reads stale `completedLessonIds` from the first render, potentially dropping the first step's completion. Should use a functional setState pattern or ref.

**E. No confirmation before destructive actions**
- Deleting a student (StudentProgressView line 131) has no confirmation dialog — one misclick removes a student and all their progress
- Deleting an assignment has no confirmation
- These should use AlertDialog like the account deletion does

**F. Custom modules section is hidden on teacher dashboard**
Line 246 has a comment "hidden for now, will be re-enabled later". Teachers have a Module Builder at `/dashboard/module-builder/:moduleId` but no UI to list or create custom modules from the dashboard. The `useTeacherModules` hook is imported but the section is commented out.

**G. No loading/empty states for some views**
- `ModuleAnalyticsView` shows "Loading analytics…" as plain text, not a proper skeleton
- Teacher dashboard has no loading state while classes fetch

---

### 3. Code Quality & Architecture

**Strengths:**
- Clean separation of concerns: hooks for data, components for UI, marking engine is pure logic
- RLS policies are comprehensive and correctly use `security definer` functions to avoid recursion
- Edge functions properly verify teacher role before mutations
- The `handle_new_user` trigger + role override pattern for students is clever and secure
- Type definitions in `types/lesson.ts` are thorough
- The marking engine supports multiple step types (spreadsheet, chart, quiz, table) cleanly
- Step-level analytics with time tracking and hint usage is a strong feature for teachers
- Error boundary around FortuneSheet is smart defensive programming

**Areas for improvement:**
- `TeacherDashboard.tsx` is 471 lines with inline state management for classes, students, bulk upload, and navigation — should be split into sub-components
- `ModuleBuilder.tsx` is 687 lines — same issue
- `LessonPlayer.tsx` at 604 lines handles rendering, progress tracking, marking, confetti, and analytics — would benefit from extracting the progress/marking logic into a custom hook
- No React Query usage for server state — everything is manual `useState` + `useEffect` + `useCallback`. The `QueryClient` is set up in App.tsx but never used
- Several places create Supabase queries without the `user` check being tied to the query lifecycle (e.g. `useAllStudentAssignments` fetches on mount with no user guard)

---

### 4. Security

**Good:**
- RLS policies on all tables
- Edge functions verify teacher role via service role key
- Student PIN auth uses fake email domain pattern, preventing real email enumeration
- Account deletion cascade is thorough
- No client-side role checks for security decisions

**Minor concerns:**
- `useAllStudentAssignments` (line 119) calls `select('*')` with no user filter — relies entirely on RLS. This works but returns all columns including `teacher_id` to the student client
- The `delete-teacher-account` function deletes students sequentially in a loop (line 74) — could timeout for large classes. Should use batch operations or a database function

---

### 5. Publish Readiness Checklist

| Area | Status | Notes |
|------|--------|-------|
| Auth (teacher + student) | Ready | Solid dual-auth pattern |
| Class management | Ready | Create, join codes, bulk import |
| Module content (built-in) | Ready | 2 modules, 10 lessons, varied step types |
| Module builder (custom) | Partial | Builder exists but dashboard entry point is hidden |
| Student progress tracking | Ready | Step-level with resume support |
| Assignment system | Ready | Module/lesson-level, due dates, live dates |
| Teacher analytics | Ready | Drop-off funnel, failed steps, time tracking |
| Mobile support | Not ready | Layout breaks on screens < 768px |
| Error handling | Not ready | Silent failures on network issues |
| Custom module delivery | Not ready | Students can't see custom modules |
| Performance at scale | Untested | No pagination, 1000-row query limit could bite |

---

### 6. Recommended Priority Order

1. **Fix custom module visibility on student dashboard** — teachers who build modules need students to see them
2. **Add mobile layout for LessonPlayer** — responsive sidebar collapse, stacked layout for spreadsheet + instructions
3. **Add error toasts on progress save failures** — prevents silent data loss
4. **Re-enable custom modules section on teacher dashboard** — the code is there, just hidden
5. **Add confirmation dialogs for delete actions** — prevent accidental data loss
6. **Extract large components** — TeacherDashboard, ModuleBuilder, LessonPlayer into smaller pieces for maintainability

