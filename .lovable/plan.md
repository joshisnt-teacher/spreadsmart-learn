

# End-of-Lesson Challenges

## Overview
Each lesson will end with a **challenge step** -- a slightly harder task that combines skills from that lesson. This gives students a chance to practice independently before moving on, reinforcing what they just learned.

## What Changes

### 1. Add a new step type: 'challenge'
Extend the existing `type` field on the `Step` interface to include `'challenge'` alongside `'instruction'` and `'task'`. Challenge steps work like task steps (they have a spreadsheet, editable cells, and auto-marking) but are visually distinguished with a different header style and a trophy/challenge icon to signal "this is your moment to prove it."

### 2. Update the LessonPlayer UI for challenge steps
- Challenge steps show a distinct visual banner (e.g., a gradient accent background with a trophy icon and "Challenge" badge) in the instruction panel so students know this is the final test
- The Check/Hint/Reset buttons remain available since challenges are interactive tasks
- Award higher XP for challenges (e.g., 30-50 XP with a 15-20 XP first-attempt bonus)
- On completion, show a celebratory "Lesson Complete" animation or enhanced success message before transitioning

### 3. Add challenge steps to each lesson

**Lesson 1 Challenge: "Build a Mini Dataset"**
- Students are given column headers (Name, Age, Score) and must fill in 3 rows of data themselves (6 cells total)
- Tests that they can navigate and enter both text and numbers across multiple cells
- 35 XP + 15 bonus

**Lesson 2 Challenge: "Complete the Invoice"**
- Given a small invoice with Quantity in A2:A4 and Unit Price in B2:B4
- Students must write formulas in C2, C3, C4 to calculate Line Total (=A2*B2, etc.) and D2 for a grand total (=C2+C3+C4)
- Combines addition, subtraction, and multiplication in a realistic scenario
- 40 XP + 20 bonus

**Lesson 3 Challenge: "Quarterly Report"**
- Given quarterly revenue data across 4 quarters
- Students must calculate: Total (SUM), Average (AVERAGE), and a percentage-of-total for Q1 (=B2/B6, or similar)
- Combines SUM and AVERAGE in a new context, with a small stretch (division)
- 40 XP + 20 bonus

**Lesson 4 Challenge: "Analyse the Class"**
- Given a table of 6 student scores
- Students must fill in: MIN, MAX, COUNT, and the Range (=MAX-MIN)
- Combines all functions learned, plus requires using formula results within another formula
- 50 XP + 25 bonus

### 4. Update progress tracking
The `StudentProgressView` already calculates step counts from the module data, so adding steps will automatically reflect in the teacher dashboard. No changes needed there.

## Technical Details

### Type change (`src/types/lesson.ts`)
```typescript
type?: 'instruction' | 'task' | 'challenge'; // add 'challenge'
```

### LessonPlayer changes (`src/components/LessonPlayer.tsx`)
- Add detection: `const isChallengeStep = currentStep?.type === 'challenge'`
- Challenge steps use the same task-checking flow (Check/Hint/Reset/Continue) as regular task steps
- Render a visual distinction in the instruction panel header: a badge saying "Challenge" with a trophy icon and a subtle accent background
- On challenge completion (last step + correct), trigger the existing `onComplete` callback

### Module data changes (`src/data/excel-basics-module.ts`)
- Append one challenge step to each of the 4 lessons
- Each challenge has a richer `initialSheetState` with more data, multiple `editableCells`, and multiple `expectations`
- Total steps go from 16 to 20
- Update `estimatedMinutes` from 120 to ~140

### Files modified
- `src/types/lesson.ts` -- add `'challenge'` to the type union
- `src/components/LessonPlayer.tsx` -- visual distinction for challenge steps
- `src/data/excel-basics-module.ts` -- add 4 challenge steps (one per lesson)

