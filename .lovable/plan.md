

# Rework Module: Introduction to Excel (Year 8)

## Overview

Rewrite `src/data/excel-basics-module.ts` to match the expanded 3-lesson curriculum. The module title, description, and all lesson/step content will be replaced. No other files need to change -- the types, marking engine, and LessonPlayer all remain the same.

## Important Note on Lesson 3 (Sorting and Filtering)

Sorting and filtering are **interactive UI actions** (right-click menus, toolbar buttons) rather than cell edits. The current marking engine can only check cell **values and formulas** -- it cannot verify whether a student clicked "Sort" or applied a filter. Two options:

- **Option A (recommended):** Make the sorting/filtering lesson instructional-only with read-only demo sheets, plus a final activity where students manually reorder data into cells (proving they understand the concept). This works with the existing system today.
- **Option B:** Skip sorting/filtering for now and add it later when we build a more advanced interaction-tracking system.

The plan below uses **Option A** -- sorting steps are instructional with a hands-on "manually sort the data" activity to verify understanding.

## Structure

### Lesson 1: Navigating a Spreadsheet (6 steps)
1. **Instruction** -- What Is a Spreadsheet? (grid structure, cell addresses, example table with Name/Maths/English)
2. **Task** -- Identifying Cells (edit B2 to 80, C3 to 77)
3. **Instruction** -- How Excel Calculates (formulas start with =, operators)
4. **Task** -- Your First Formula (Qty x Price dataset, write =B2*C2 for D2, D3, D4)
5. **Instruction** -- Using the Fill Handle (drag-to-copy explanation)
6. **Task** -- Use Fill Down (delete D3/D4, drag D2 down, check all totals correct)

### Lesson 2: Built-in Functions (5 steps)
1. **Instruction** -- SUM and AVERAGE (syntax, colon ranges)
2. **Task** -- Total Sales (Monday-Thursday sales, B6=SUM, B7=AVERAGE)
3. **Instruction** -- MIN, MAX and COUNT (syntax, examples)
4. **Task** -- Find the Extremes (B8=MAX, B9=MIN, B10=COUNT on same sales data)
5. **Challenge** -- School Canteen Analysis (Burger/Wrap/Juice/Chips dataset with Sold/Price/Revenue columns; calculate revenue per item, total revenue, most sold item via MAX, average sold via AVERAGE)

### Lesson 3: Sorting and Filtering (4 steps)
1. **Instruction** -- Sorting Data (concept explanation, visual before/after example)
2. **Task** -- Sort the Data (students manually enter Ava/Liam/Noah/Zoe scores in descending order into a results table to prove they understand sorting)
3. **Instruction** -- Filtering Data (concept explanation, criteria-based example)
4. **Task** -- Apply a Filter (students enter only the names/scores above 75 into a filtered results table)

## Technical Details

### File to modify
- `src/data/excel-basics-module.ts` -- complete rewrite of the module data with all new lessons, steps, cell data, and task expectations

### Key data design decisions
- Module title changes to "Introduction to Excel"
- All cell data uses the existing `CellData` format (r, c, v with v/m/f/bl/bg properties)
- Fill Down task (Step 6) checks D3 and D4 have correct values and formulas (=B3*C3, =B4*C4) -- FortuneSheet's autofill will handle the formula adjustment
- Canteen challenge uses a 4-item dataset matching the user's spec (Burger 25x6, Wrap 18x7, Juice 40x3, Chips 32x4)
- Sorting/filtering tasks use a "manual entry" approach where students type sorted/filtered results into a separate output area, verified by the marking engine

### No changes to
- `src/types/lesson.ts`
- `src/lib/marking-engine.ts`
- `src/components/LessonPlayer.tsx`
- `src/components/SpreadsheetWorkspace.tsx`

