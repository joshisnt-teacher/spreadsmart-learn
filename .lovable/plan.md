

# Improve Sorting and Filtering Lesson Steps

## Problem

The current "Sort the Data" and "Apply a Filter" steps ask students to manually copy names and scores into a second table in the correct order. This is tedious busywork that doesn't teach actual spreadsheet skills.

## Solution

Replace the manual-copy tasks with **formula-based tasks** and **additional quiz questions** that teach real spreadsheet techniques while reinforcing sorting/filtering concepts.

### New Step Flow for Lesson 3 (Sorting and Filtering)

```text
Step 1: Instruction - Sorting Data (keep as-is)
Step 2: Quiz - Sorting vocabulary (keep as-is)
Step 3: Task - Use LARGE/SMALL functions to extract sorted values
Step 4: Instruction - Filtering Data (keep, improve wording)
Step 5: Task - Use COUNTIF to count filtered results
Step 6: Task - Use IF to filter matching rows
Step 7: Quiz - Filtering concept check
```

### Step 3 — "Find the Top and Bottom Scores" (replaces manual sort)

Instead of copying data, students use the `LARGE()` and `SMALL()` functions:

- Instruction explains that `LARGE(range, k)` returns the k-th largest value and `SMALL(range, k)` returns the k-th smallest
- Students write:
  - `=LARGE(B2:B5, 1)` in D2 to find the highest score
  - `=LARGE(B2:B5, 2)` in D3 for second highest
  - `=SMALL(B2:B5, 1)` in D4 for the lowest score
- This teaches a real formula approach to ranking/sorting data

### Step 5 — "Count the Matches" (new COUNTIF task)

Students use `COUNTIF` to count how many students scored above 75:

- `=COUNTIF(B2:B5, ">75")` in a result cell
- This introduces criteria-based functions and connects to the concept of filtering

### Step 6 — "Filter with IF" (replaces manual filter copy)

Students write IF formulas to show or hide values:

- `=IF(B2>75, A2, "")` in D2, dragged/copied down to D5
- The result shows only names of students who scored above 75, with blanks for those who didn't
- This teaches a practical formula-based filtering technique

### Step 7 — Quiz: Filtering Concept

Multiple choice: "What happens to data that doesn't match a filter?"
- Options: "It is deleted" / "It is hidden temporarily" / "It turns red" / "It moves to another sheet"
- Correct: "It is hidden temporarily"

## Technical Details

### Files to modify

**`src/data/excel-basics-module.ts`** (lines 660-791)

Replace the existing steps 3-2 (Sort the Data) and 3-4 (Apply a Filter) with the new formula-based steps described above. Update step IDs and order numbers accordingly.

The new steps use the same `initialSheetState`, `task`, and `expectations` structure already in use -- just with formula-based expectations (`expectedFormula` and `checkFormula: true`) instead of plain value expectations.

### No other files need changes

The marking engine (`marking-engine.ts`) already supports `checkFormula` and `expectedFormula` in task expectations. The `LessonPlayer`, `SpreadsheetWorkspace`, and `QuizStep` components all work as-is.

## What This Achieves

- Students learn real spreadsheet functions (LARGE, SMALL, COUNTIF, IF) instead of manually copying data
- Sorting and filtering concepts are reinforced through practical formula use
- Quiz questions confirm conceptual understanding
- The lesson connects back to the functions taught in Lesson 2, reinforcing prior learning
