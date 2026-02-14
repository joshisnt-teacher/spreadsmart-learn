

# Add "Resizing Rows and Columns" Step to Lesson 1

## Overview

Add a new step early in Lesson 1 (after "What Is a Spreadsheet?" and before "Identifying Cells") that teaches students how to resize columns and rows by dragging. The step uses a clever verification trick: a cell contains a long message that is hidden because the column is too narrow. The student must widen the column to read the full message, then type it into an answer cell to prove they did it.

## New Step Details

- **Position**: Step 2 in Lesson 1 (current steps 2-6 shift to become steps 3-7)
- **Type**: `task` (with a simple text-match check)
- **Title**: "Resizing Rows and Columns"
- **Concept**: Cell A2 contains a long sentence like `"Spreadsheets are awesome"` but the column is intentionally narrow (configured via column width settings) so the text is cut off. The student widens column A to reveal the full message, then types it into cell B2 to confirm.

## What Changes

### 1. `src/data/excel-basics-module.ts`

- Insert a new step object at position 2 in Lesson 1's `steps` array with:
  - A narrow column A (using the sheet config `columnlen` to set column A width to around 40px)
  - Cell A1: header "Hidden Message" 
  - Cell A2: a long string like `Spreadsheets are awesome`
  - Cell B1: header "Type the message here"
  - Cell B2: empty, editable -- where the student types the answer
  - Task expectation: B2 must match the hidden text (case-insensitive via string comparison)
  - Hints guiding the student to hover over the column border between A and B, then drag to widen
- Update the `order` field of all subsequent steps (old step 2 becomes 3, etc.)
- Update all step `id` values accordingly (e.g. old `step-1-2` becomes `step-1-3`, and so on through `step-1-7`)

### 2. No other file changes needed

The `LessonPlayer`, `SpreadsheetWorkspace`, and marking engine already support text-value expectations and column width config -- no code changes required outside the data file.

## Step Content Preview

**Instruction text:**
> Sometimes data in a cell is too long to see. You can **resize columns** to make the data easier to read.
>
> To widen a column, hover your mouse over the **border between two column letters** (e.g. between A and B) at the top. Your cursor will change to a resize arrow. Then **click and drag** to the right.
>
> You can do the same for rows by dragging the border between row numbers.
>
> **Your task:** Column A below is too narrow to read the full message. Widen it, then type the hidden message into cell **B2**.

**Why it matters:** Being able to adjust column widths helps you view and work with data of all sizes -- a skill you'll use constantly.

## Technical Notes

- Column width is controlled via the sheet's `config.columnlen` property (e.g., `{ "0": 40 }` sets column A to 40px)
- The marking engine's `checkTask` compares expected string values, which handles this verification naturally
- All existing step IDs in Lesson 1 will be renumbered to maintain sequential ordering, and any saved student progress referencing old IDs will gracefully skip (students may need to redo Lesson 1 steps, but this is acceptable for a content update)
