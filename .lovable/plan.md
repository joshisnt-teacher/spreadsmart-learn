

## Two Bugs: Root Causes and Fixes

### Bug 1: Completed Lessons No Longer Show as Completed

**Root Cause:** The sorting/filtering lesson was recently expanded from 6 steps to 9 steps (three new steps were added: `step-3-6-combo`, `step-3-7-diet`, `step-3-8-reflection`). The student had already completed the original 6 steps, so their `lesson_progress` record shows `completed_step_ids` with 6 entries. However, the lesson completion check on line 110-111 of `LessonPlayer.tsx` compares `completedStepIds.length === lesson.steps.length` -- since 6 !== 9, the lesson is now marked incomplete. This also means `module_progress.completed_lesson_ids` no longer includes it.

The "Continue Learning" button on the module landing page finds the first lesson whose ID is NOT in `completed_lesson_ids`, so it correctly points to the sorting lesson. But when the student enters that lesson, they see all 6 original steps ticked off and get dumped at step 1 (because the saved `current_step_id` is `step-3-5`, which was the old last step, so the player jumps there, but the lesson is "not completed" so it resumes from the saved position). The 3 new steps at the end are not yet completed.

**Fix:** Make the lesson completion logic resilient to content changes. Instead of checking `completedStepIds.length === lesson.steps.length`, check whether every step ID in the current lesson definition exists in the completed set. Additionally, when a student re-enters a lesson where some steps are already done but new steps were added, resume at the first incomplete step rather than step 1 or the old saved position.

Changes in `LessonPlayer.tsx`:
- Line 110-111: Change `progress.completedStepIds.length === lesson.steps.length` to `lesson.steps.every(s => progress.completedStepIds.includes(s.id))`
- Line 90-92: When loading saved progress and the lesson is NOT marked completed, find the first step whose ID is NOT in `completed_step_ids` and jump there (instead of using `current_step_id` which may point to a step that no longer exists or is in the wrong position)

Changes in `useProgress.ts` (data repair):
- No code changes needed -- the `completed` flag will be correctly recomputed next time the student finishes the lesson

**Database Fix:** Update the student's existing `lesson_progress` so they don't have to redo the 6 steps they already finished. This is a one-time data concern; the code fix prevents it from happening again.

---

### Bug 2: Table Filters Persisting Between Steps

**Root Cause:** The `InteractiveTable` component (line 20-23 of `InteractiveTable.tsx`) stores sort/filter state in `useState`. When the student moves from one `table-task` step to the next, React reuses the same `InteractiveTable` component instance because:
1. Both consecutive steps render `InteractiveTable` in the same position in the component tree
2. No `key` prop is provided to force React to unmount and remount the component
3. The `resetKey` (which IS incremented on step change) is never passed to `InteractiveTable`

So filters set on Step 4 (e.g. "filter Year Group to Year 9") carry over to Step 5, which has completely different data, resulting in zero matching rows.

**Fix:** Add a `key` prop to the `InteractiveTable` component in `LessonPlayer.tsx` so React creates a fresh instance on each step change. This is a one-line fix.

Change in `LessonPlayer.tsx` line 478:
```
<InteractiveTable
  key={currentStep.id}    // <-- forces remount on step change
  config={currentStep.tableTask}
  answer={tableAnswer}
  onAnswerChange={setTableAnswer}
/>
```

---

### Summary of Code Changes

| File | Change |
|------|--------|
| `src/components/LessonPlayer.tsx` | 1. Add `key={currentStep.id}` to `InteractiveTable` (line 478) to fix filter persistence. 2. Change the completion check (line 110-111) from length comparison to `every()` check. 3. Fix resume logic (line 90-92) to jump to the first incomplete step when re-entering an in-progress lesson. |

Both fixes are small and surgical -- no new files, no schema changes, no new dependencies.
