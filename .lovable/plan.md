

# Fix XP Duplication Bugs

## Problem

XP can be earned multiple times by:
1. Clicking through instruction steps repeatedly (they always award 5 XP, no completion check)
2. Replaying a completed lesson from the module landing page (the `isRedoing` flag only activates when navigating back within a lesson, not on full replay)
3. Completing a lesson again at the module level (module progress always adds XP without checking if the lesson was already done)

## Changes

### 1. `src/components/LessonPlayer.tsx`

**`handleInstructionContinue` (line 183-208)**: Add a guard so instruction steps only award XP if the step is not already in `completedStepIds`.

```typescript
const handleInstructionContinue = useCallback(() => {
  if (!currentStep) return;
  const alreadyDone = progress.completedStepIds.includes(currentStep.id);
  const xp = alreadyDone ? 0 : (currentStep.task?.xpValue ?? 5);
  // ... rest stays the same but uses this xp value
```

**`handleCheck` (line 150-164)**: In addition to the existing `isRedoing` check, also check if the step was already completed before awarding XP.

```typescript
const xp = (isRedoing || isStepComplete)
  ? 0
  : (currentStep.task?.xpValue ?? 0) + (isFirstAttempt ? (currentStep.task?.bonusXp || 0) : 0);
```

**Lesson load (line 69-90)**: When loading a completed lesson, set `isRedoing` to true so that replaying awards 0 XP.

### 2. `src/hooks/useProgress.ts`

**`markLessonComplete` (line 42-58)**: Only add XP if the lesson is not already in `completedLessonIds`.

```typescript
const alreadyCompleted = state.completedLessonIds.includes(lessonId);
const newXp = alreadyCompleted ? state.totalXp : state.totalXp + xpEarned;
```

## Summary of Guards

| Location | Current behavior | Fix |
|----------|-----------------|-----|
| Instruction steps | Always award 5 XP | Skip if step already completed |
| Task/quiz/chart check | Only skips if `isRedoing` | Also skip if step already in completedStepIds |
| Lesson replay from landing | `isRedoing` not set | Set `isRedoing=true` when loading a completed lesson |
| Module-level completion | Always adds XP | Skip if lesson already in completedLessonIds |

