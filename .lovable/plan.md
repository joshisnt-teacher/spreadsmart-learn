

# Fix: Allow Free Navigation in Completed Lessons

## Problem

When a student finishes a lesson and returns to it later, the `LessonPlayer` skips loading saved progress because of this condition on line 65:

```typescript
if (saved && !saved.completed) {
```

Since the lesson is marked `completed: true`, the progress (completed step IDs, XP, attempts) is never restored. The student sees all steps locked again starting from step 1.

## Solution

Remove the `!saved.completed` check so progress is always restored when saved data exists. For completed lessons, default to showing step 1 (the beginning) but with all steps unlocked and navigable.

## Changes

### `src/components/LessonPlayer.tsx` (lines 64-79)

Change the progress loading logic from:

```typescript
if (saved && !saved.completed) {
```

to:

```typescript
if (saved) {
```

And for completed lessons, start at step 1 instead of jumping to `current_step_id` (since all steps are done). The step index jump (`if (idx >= 0) setCurrentStepIndex(idx)`) should only happen for in-progress lessons:

```typescript
loadProgress().then((saved) => {
  if (saved) {
    const attempts = (saved.attempts && typeof saved.attempts === 'object' && !Array.isArray(saved.attempts))
      ? saved.attempts as Record<string, number>
      : {};
    setProgress({
      lessonId: lesson.id,
      completedStepIds: saved.completed_step_ids,
      currentStepId: saved.current_step_id || lesson.steps[0]?.id || '',
      totalXp: saved.total_xp,
      attempts,
    });
    // Jump to saved step only for in-progress lessons; completed lessons start at step 1
    if (!saved.completed) {
      const idx = lesson.steps.findIndex(s => s.id === saved.current_step_id);
      if (idx >= 0) setCurrentStepIndex(idx);
    }
  }
});
```

This ensures:
- All completed steps show checkmarks and are clickable
- The student starts at step 1 for review but can click any step
- No XP is re-awarded (the existing `isRedoing` logic handles this)

No other files need changes.
