
# Enhanced Lesson Scaffolding with Instructional Steps

## Overview
Currently, every step requires a spreadsheet task. This plan adds support for **instruction-only steps** -- pure teaching moments where students read, absorb, and continue -- so we can scaffold concepts like "What are cells?", "What are columns and rows?", and "How does SUM work?" before asking students to do anything.

## What Changes

### 1. Update the Step type to support instruction-only steps
- Make the `task` and `initialSheetState` fields **optional** on the `Step` interface
- Add a `type` field: `'instruction'` or `'task'` (defaulting to `'task'` for backward compatibility)
- Instruction steps can optionally include a read-only `initialSheetState` to show an example spreadsheet without editable cells

### 2. Update the LessonPlayer to render instruction steps
- When the current step has `type: 'instruction'`, hide the Check/Hint/Reset buttons
- Show a simple **"Got it"** or **"Continue"** button instead
- Clicking it marks the step complete (awards its XP) and advances
- The spreadsheet area will either show a read-only example sheet or be hidden if no sheet state is provided
- The instruction panel gets more vertical space for longer explanatory text

### 3. Update the marking engine and progress logic
- `checkTask` is never called for instruction steps, so no changes needed there
- The progress tracking already works by step ID, so instruction steps get marked complete when the student clicks Continue
- XP for instruction steps will typically be small (5 XP) as a participation reward

### 4. Expand the Excel Basics module content
The current 4 lessons (8 steps total) will be expanded to include proper scaffolding. Here is the new lesson structure:

**Lesson 1: Navigating a Spreadsheet** (currently 2 steps, becomes 5)
- NEW Step 1: "What is a Spreadsheet?" -- instruction explaining columns (A, B, C...), rows (1, 2, 3...), and cells (e.g., B2 is column B, row 2). Shows a labelled example sheet (read-only).
- NEW Step 2: "Understanding Cell References" -- instruction explaining that every cell has a unique address like A1, B3, C5. Shows an example sheet with a few cells highlighted.
- NEW Step 3: "Selecting and Typing" -- instruction explaining that you click a cell to select it, then type to enter data. Numbers go right-aligned, text goes left-aligned.
- Existing Step: "Select a Cell" -- type 42 in B2 (task)
- Existing Step: "Enter Multiple Values" -- enter 10, 20, 30 (task)

**Lesson 2: Basic Formulas** (currently 2 steps, becomes 4)
- NEW Step 1: "What is a Formula?" -- instruction explaining formulas start with `=`, they reference other cells, and they update automatically when inputs change.
- NEW Step 2: "Arithmetic Operators" -- instruction showing `+`, `-`, `*`, `/` with a read-only example sheet demonstrating `=A2+B2`.
- Existing Step: "Add Two Numbers" (task)
- Existing Step: "Subtract and Multiply" (task)

**Lesson 3: SUM and AVERAGE** (currently 2 steps, becomes 4)
- NEW Step 1: "Why Use Functions?" -- instruction explaining that when you have lots of cells, typing `=A1+A2+A3+...` is tedious. Functions like SUM do it in one go.
- NEW Step 2: "How Ranges Work" -- instruction explaining that `B2:B5` means "all cells from B2 down to B5". Shows a visual example.
- Existing Step: "Your First SUM" (task)
- Existing Step: "Calculate an Average" (task)

**Lesson 4: MIN, MAX and COUNT** (currently 2 steps, becomes 3)
- NEW Step 1: "Summarising Data" -- instruction explaining MIN finds the smallest, MAX finds the largest, COUNT tells you how many. Shows a table of student scores as context.
- Existing Step: "Find the Minimum and Maximum" (task)
- Existing Step: "Count Your Data" (task)

Total steps go from 8 to 16, giving students proper context before each hands-on task.

## Technical Details

### Type changes (`src/types/lesson.ts`)
```typescript
export interface Step {
  id: string;
  order: number;
  title: string;
  instruction: string;
  type?: 'instruction' | 'task'; // defaults to 'task'
  whyItMatters?: string;
  mediaUrl?: string;
  initialSheetState?: SheetState; // now optional
  task?: TaskDefinition;          // now optional
}
```

### LessonPlayer changes (`src/components/LessonPlayer.tsx`)
- Add a check: `const isInstructionStep = currentStep.type === 'instruction' || !currentStep.task`
- For instruction steps: render the instruction panel with more space, optionally show a read-only spreadsheet, and show a single "Continue" button that auto-completes the step
- For task steps: keep existing Check/Hint/Reset/Continue flow unchanged
- Update the step completion logic so instruction steps award XP immediately on Continue

### Module data changes (`src/data/excel-basics-module.ts`)
- Insert new instruction steps before existing task steps in each lesson
- Each instruction step uses `type: 'instruction'`, has no `task` or `editableCells`, and may include a read-only `initialSheetState` for visual examples
- Re-number step orders and IDs accordingly
- Update `estimatedMinutes` from 90 to ~120

### Files modified
- `src/types/lesson.ts` -- make `task` and `initialSheetState` optional, add `type` field
- `src/components/LessonPlayer.tsx` -- handle instruction-only steps
- `src/data/excel-basics-module.ts` -- add scaffolding steps to all 4 lessons
