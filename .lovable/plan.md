

# Replace Sorting/Filtering with Interactive React Table

## Overview

Replace the current spreadsheet-based sorting and filtering steps (Lesson 3) with an interactive React data table. Students will sort and filter real sample data by clicking column headers and using filter controls, then answer questions about the results.

## Sample Data

A table of 8 students with three columns:

| Name | Age | Height (cm) |
|------|-----|-------------|
| Ava | 14 | 158 |
| Liam | 16 | 172 |
| Zoe | 13 | 149 |
| Noah | 15 | 165 |
| Mia | 14 | 161 |
| Ethan | 17 | 178 |
| Olivia | 13 | 152 |
| James | 16 | 168 |

## New Step Flow for Lesson 3

```text
Step 1: Instruction - What is Sorting? (updated with new data context)
Step 2: Quiz - Sorting vocabulary (keep as-is)
Step 3: Table Task - Sort by Age descending, answer "Who is the oldest?"
Step 4: Instruction - What is Filtering? (updated)
Step 5: Table Task - Sort by Height ascending, answer "Who is the shortest?"
Step 6: Table Task - Filter to age 14 only, answer "How many students are 14?"
Step 7: Quiz - Filtering concept check (keep as-is)
```

## New Step Type: `'table-task'`

A new interactive step where students see a sortable/filterable table and must answer a question based on how they manipulate it.

### Data model additions (`src/types/lesson.ts`)

```typescript
interface TableColumn {
  key: string;
  label: string;
  type: 'text' | 'number';
}

interface TableTaskConfig {
  columns: TableColumn[];
  data: Record<string, string | number>[];
  question: string;
  correctAnswer: string;
  acceptableAnswers?: string[];
  explanation?: string;
  enableSort?: boolean;
  enableFilter?: boolean;
}
```

Add `tableTask?: TableTaskConfig` to the `Step` interface and `'table-task'` to the type union.

## New Components

### `src/components/InteractiveTable.tsx`

An interactive data table built with the existing shadcn Table components (`src/components/ui/table.tsx`):

- **Sortable columns**: Click a column header to toggle ascending/descending sort (with arrow indicators)
- **Filter controls**: A dropdown or input per column to filter rows (only shown when `enableFilter` is true)
- **Question + Answer area**: Below the table, displays the question text and a text input for the student's answer
- **Clean, student-friendly UI**: Uses existing Card, Badge, and Button components

The component will manage its own sort/filter state internally and expose only the student's typed answer via a callback.

### Marking integration

Add a `checkTableTaskAnswer()` function to `src/lib/marking-engine.ts` that works like `checkQuizAnswer` -- case-insensitive, whitespace-trimmed comparison against `correctAnswer` and `acceptableAnswers`.

## Files to Create

- **`src/components/InteractiveTable.tsx`** -- The sortable/filterable table component with question input

## Files to Modify

- **`src/types/lesson.ts`** -- Add `TableColumn`, `TableTaskConfig` interfaces; add `'table-task'` to step type; add `tableTask` to Step
- **`src/lib/marking-engine.ts`** -- Add `checkTableTaskAnswer()` function
- **`src/components/LessonPlayer.tsx`** -- Detect `type === 'table-task'`, render `InteractiveTable`, wire check button to marking, add table icon to sidebar
- **`src/data/excel-basics-module.ts`** -- Replace Lesson 3 steps 3-6 (the LARGE/SMALL, COUNTIF, IF formula steps) with the new table-task steps described above

## What This Achieves

- Students learn sorting and filtering by actually doing it on a visual table -- much more intuitive than formulas
- Practical questions ("Who is the oldest?", "Who is the shortest?") give immediate purpose to the sorting
- Filter task introduces the concept of narrowing data to a subset
- The existing quiz steps (sorting vocabulary and filtering concepts) remain for conceptual reinforcement
- No dependency on the FortuneSheet spreadsheet for this lesson

