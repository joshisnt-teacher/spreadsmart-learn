

## Curriculum Assessment & "I'm Stuck" Feature

### Part 1: Curriculum Quality Assessment

**Module 1: Introduction to Excel (5 lessons, ~38 steps)**

The scaffolding is strong. Each lesson follows a consistent pattern: instruction → quiz → task → harder task → challenge. Specific observations:

- **Lesson 1 (Navigation)**: Well-paced. Starts with "what is a spreadsheet" (zero assumed knowledge), progresses through cell identification, formulas, and fill handle. The hidden-message resize task is clever and engaging. One minor issue: the fill handle step (step-1-7) asks students to drag a fill handle, which relies on FortuneSheet supporting that interaction correctly -- if it doesn't work, students have no visual feedback why, and the third hint gives a manual fallback which undermines the learning objective.

- **Lesson 2 (Functions)**: Good use of the Sports Day theme across steps 2 and 4 -- the data carries over visually (step 4 shows pre-filled SUM/AVERAGE results from step 2 with green backgrounds), which reinforces continuity. The Gaming High Scores challenge is well-designed with 6 expectations across different function types.

- **Lesson 3 (Formatting)**: Solid. The percentage quiz (17/20 = 85%) is a good pre-check before the calculation task. The "Splitting the Canteen Bill" challenge is excellent -- it combines SUM, division, and ROUND in a real-world scenario with a clear "why" (you can't pay £2.8333).

- **Lesson 4 (IF Functions)**: Well-scaffolded from simple IF → nested IF. The grade boundaries challenge is appropriately hard for a challenge step. The closing quiz about `>=50` with a value of exactly 50 is a subtle but important edge-case check.

- **Lesson 5 (Sorting & Filtering)**: The table-task steps are well-sequenced (sort only → filter only → sort+filter combined). The school trip dataset is reused across steps 6-7 with different questions, which is realistic. The final quiz (sort vs filter) is a good conceptual wrap-up.

**Module 2: Charts & Data Summaries (4 lessons, ~22 steps)**

- **Lesson 1 (Preparing Data)**: Good progression from "fix broken data" to "summarise with SUM" to a challenge combining SUM + chart type selection. The challenge asking students to type "bar" in a cell is a creative way to test conceptual understanding alongside formula skills.

- **Lesson 2 (Reading Charts)**: Strong variety -- bar, line, and pie charts each with a different analytical task. The pie chart step asking students to calculate a percentage formula (`=B3/SUM(B2:B5)*100`) is a nice callback to Module 1 formatting skills.

- **Lesson 3 (Building Charts)**: Good scaffolding from guided ("set to Bar") to independent ("figure it out yourself"). The last two steps (rainfall = line, budget = pie, downloads = area) remove explicit type instructions and force students to reason about data-to-chart mapping. However, the App Downloads step expects "area" specifically, which is debatable -- a line chart would also be correct for time-series data. Students who choose "line" will be marked wrong, which could feel unfair.

- **Lesson 4 (Data Summary Tables)**: Excellent. Teaching SUMIF/COUNTIF manually before introducing the pivot table concept is pedagogically sound. The final challenge (class 8A vs 8B with total/count/average) ties everything together well.

**Curriculum Gaps / Suggestions:**
1. The area chart expectation in charts-3-6 should also accept "line" as correct (both are valid for time-series)
2. No lesson covers CONCATENATE, VLOOKUP, or absolute references ($) -- these could be a third module for advanced users
3. No reflection or self-assessment step at the end of either module

---

### Part 2: "I'm Stuck" Button

**Concept:** A button that appears after a student has been on a task step for 60+ seconds without checking or completing it. When pressed, it:
1. Logs a `stuck` event to `step_events` (for developer/teacher analytics)
2. Shows the first unused hint automatically
3. Optionally shows a more supportive message ("This step is tricky -- here's some help")

**Implementation plan:**

**Database:** No schema changes needed. The existing `step_events` table already supports arbitrary `event_type` strings and a `metadata` JSONB column. We just insert `event_type: 'stuck'` with metadata like `{ time_on_step_seconds: 95, attempt_count: 0 }`.

**UI (FeedbackBar.tsx):**
- Add an `elapsedSeconds` prop (tracked in `useLessonPlayer`)
- After 60 seconds on a non-instruction step with no successful check, show an amber "I'm stuck" button between the Hint and Reset buttons
- When clicked: log the event, auto-trigger the hint system, and hide the button (replace with a supportive message)

**Hook (useLessonPlayer.ts):**
- Add a `useEffect` with a `setInterval` that increments a `stepElapsed` counter every second, reset on step change
- Add a `handleStuck` callback that: logs the `stuck` event via `logEvent`, calls `handleHint`, sets a `stuckTriggered` flag to hide the button
- Pass `stepElapsed`, `stuckTriggered`, and `handleStuck` to the return object

**Teacher Analytics (ModuleAnalyticsView.tsx):**
- Query `step_events` where `event_type = 'stuck'` grouped by `step_id`
- Show a "Stuck Signals" column in the analytics table alongside existing drop-off and failure data
- Steps with high stuck counts relative to attempts indicate unclear instructions or excessive difficulty

**Files to change:**
| File | Change |
|------|--------|
| `src/hooks/useLessonPlayer.ts` | Add `stepElapsed` timer, `stuckTriggered` state, `handleStuck` callback |
| `src/components/lesson/FeedbackBar.tsx` | Add "I'm stuck" button (conditional on elapsed > 60s and not yet triggered) |
| `src/components/LessonPlayer.tsx` | Pass new props through to FeedbackBar |
| `src/components/ModuleAnalyticsView.tsx` | Add stuck event counts to analytics display |

No database migration needed -- the existing `step_events` table handles this naturally.

