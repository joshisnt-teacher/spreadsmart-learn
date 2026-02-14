

# Add Quiz Step Type to Modules

## Overview

Add a new `'quiz'` step type that supports **multiple-choice** and **short-answer** questions. These steps will appear inline alongside existing spreadsheet and chart steps, testing vocabulary and conceptual knowledge without needing a spreadsheet.

## Changes

### 1. Extend types (`src/types/lesson.ts`)

Add a `QuizQuestion` interface and include `'quiz'` in the step type union:

- `QuizQuestion.type`: `'multiple-choice'` or `'short-answer'`
- `QuizQuestion.options`: string array for multiple-choice
- `QuizQuestion.correctAnswer`: the primary correct answer
- `QuizQuestion.acceptableAnswers`: optional alternative accepted answers (for short-answer flexibility)
- `QuizQuestion.explanation`: shown after a correct answer for reinforcement
- Add `quiz?: QuizQuestion` to the `Step` interface
- Add `'quiz'` to the step `type` union

### 2. New component: `src/components/QuizStep.tsx`

A focused UI component that renders:
- **Multiple choice**: Styled radio cards using the existing `RadioGroup` component, with clear option labels
- **Short answer**: A text `Input` field that submits on Enter
- Visual feedback: green highlight for correct, red for incorrect, with explanation text after success
- A "Check" callback that returns the student's selected/typed answer

### 3. Extend marking engine (`src/lib/marking-engine.ts`)

Add a `checkQuizAnswer()` function:
- Case-insensitive, whitespace-trimmed comparison
- Checks against `correctAnswer` and all `acceptableAnswers`
- Returns standard `CheckResult` with the explanation as a detail

### 4. Update `src/components/LessonPlayer.tsx`

- Detect `type === 'quiz'` steps (new `isQuizStep` boolean)
- Render `QuizStep` in the main content area instead of a spreadsheet/chart
- Wire the check button to `checkQuizAnswer()`
- Track quiz answer state with a new `quizAnswer` state variable
- Show `HelpCircle` icon in the sidebar step list for quiz steps

### 5. Add quiz questions to Excel Basics module (`src/data/excel-basics-module.ts`)

Insert quiz steps at natural points within existing lessons:

**Lesson 1 (Navigating a Spreadsheet)** -- add after "What Is a Spreadsheet?" (step 1):
- "What is the name given to a group of cells that run vertically?" -- **Column** (short-answer, also accept "Columns")

**Lesson 2 (Built-in Functions)** -- add after "SUM and AVERAGE" instruction:
- "What symbol must every formula in a spreadsheet start with?" -- **=** (short-answer, accept "equals", "equals sign")

**Lesson 3 (Sorting and Filtering)** -- add after "Sorting Data" instruction:
- "If data is sorted from largest to smallest, what is this order called?" -- Multiple choice: Ascending / **Descending** / Alphabetical / Random

### 6. Add quiz questions to Charts module (`src/data/charts-module.ts`)

**Lesson 1 (Preparing Data for Charts)** -- add after "What Makes a Good Chart?" instruction:
- "Which chart type is best for showing parts of a whole?" -- Multiple choice: Bar / Line / **Pie** / Area

**Lesson 2 (Reading Charts)** -- add at the start:
- "What is the term for the horizontal line along the bottom of a chart?" -- **X-axis** (short-answer, accept "x axis", "horizontal axis")

**Lesson 4 (Data Summary Tables)** -- add after "What Is a Summary Table?" instruction:
- "Which function adds values only when a specific condition is met?" -- Multiple choice: SUM / AVERAGE / **SUMIF** / COUNT

## What Stays the Same

- XP system, progress tracking, hints, and attempt counting all work identically
- Existing instruction, task, challenge, and chart step types are unchanged
- The step ordering within lessons shifts to accommodate the new quiz steps (IDs and order numbers updated accordingly)

