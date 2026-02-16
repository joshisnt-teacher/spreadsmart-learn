

## Lesson Reorder and Module Improvements

### 1. Swap Lesson Order: Functions Before Formatting

The "Cell Formatting & Number Types" lesson currently sits at order 2, but it uses `=SUM()` and `=ROUND()` before students have learned what built-in functions are (taught in order 3). The fix is to swap their `order` values:

| Lesson | Current Order | New Order |
|--------|--------------|-----------|
| Built-in Functions (`lesson-2`) | 3 | 2 |
| Cell Formatting & Number Types (`lesson-formatting`) | 2 | 3 |

This is a small change -- just updating the `order` property on each lesson object in `src/data/excel-basics-module.ts` and physically reordering the lesson blocks in the file so the code reads top-to-bottom in the correct sequence.

---

### 2. Top 3 Suggested Improvements

After reviewing the full module, here are the three changes that would have the biggest impact:

**A. More student-relatable data scenarios**

The "Built-in Functions" lesson uses a generic "daily sales" dataset (Monday-Thursday shop sales). Secondary school students don't run shops. Replacing this with something like **sports day results**, **gaming high scores**, or **weekly pocket money tracking** would make the exercises feel more relevant and keep students engaged. The canteen theme in the formatting lesson works well -- the functions lesson should match that energy.

**B. Add an IF function lesson (new Lesson 4, pushing Sorting to Lesson 5)**

IF is arguably the most important function students will use in real life, and it's completely missing. A short lesson (4-5 steps) covering:
- What IF does (instruction)
- Simple IF: pass/fail based on a test score (task)
- Nested concept: IF with AND/OR (instruction)
- Challenge: grade boundaries (task -- e.g. "Distinction", "Merit", "Pass", "Fail")

This would slot naturally between the current functions lesson and sorting/filtering.

**C. Sorting and Filtering lesson needs more depth**

The current lesson has only basic single-column sorts and one filter task. It could be strengthened with:
- A combined sort-then-filter challenge (e.g. "Filter to Year 9 students, then sort by score -- who scored highest?")
- A real-world scenario like filtering a school trip sign-up list by dietary requirements or bus allocation
- A final reflection quiz asking when you'd use sort vs filter

---

### Technical Changes

All changes are in a single file: `src/data/excel-basics-module.ts`

| Change | Detail |
|--------|--------|
| Swap lesson order | Change `order: 2` to `order: 3` on the formatting lesson, and `order: 3` to `order: 2` on the functions lesson. Physically reorder the blocks in the array. |
| Update functions data | Replace "daily sales" data with a student-relevant theme (e.g. sports day event scores) across all steps in that lesson. |
| Add IF function lesson | Insert a new lesson object with 4-5 steps covering basic and applied IF usage. Bump sorting lesson order from 4 to 5. |
| Expand sorting/filtering | Add 2-3 more steps: a combined sort+filter table-task and a closing quiz. |

