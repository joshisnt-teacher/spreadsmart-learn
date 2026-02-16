

## Quality-of-Life Module Fixes

### 1. Fix: Spreadsheet Cell Click Freezing

**Root cause:** FortuneSheet throws an internal `TypeError` when students click on locked (non-editable) cells. The library tries to position a text caret in a read-only cell and crashes silently, leaving the selection overlay stuck. The error boundary catches full crashes, but partial internal failures leave the UI in a broken state where cells appear highlighted but won't respond to clicks.

**Fix:** Add CSS to suppress the caret/editing overlay on locked cells and hook into FortuneSheet's `onCellSelected` or equivalent to prevent the internal crash. Specifically:
- Add a `cellInput` hook or CSS override to disable the contenteditable input box from activating on locked cells
- Add `pointer-events: none` on the luckysheet input box when the selected cell is locked
- Add a `beforeCellEdit` / `allowEdit` check via FortuneSheet's config to return `false` for locked cells, which prevents the internal `setCaretPosition` crash entirely

### 2. Fix: InteractiveTable Sizing and Responsiveness

**Current problem:** The `InteractiveTable` component is wrapped in a `Card` inside a flex column with fixed padding (`p-6 gap-4`). On larger screens or projectors, it doesn't expand to use available space. The table itself has no max-height scroll behavior.

**Changes to `InteractiveTable.tsx`:**
- Make the outer container use `flex-1 min-h-0` so it fills available vertical space
- Add `overflow-auto` to the table's scroll container with a responsive max-height
- Reduce padding on smaller screens
- Ensure the Card fills the width of the workspace area

**Changes to `LessonPlayer.tsx`:**
- The table-task rendering block (line 474-479) should mirror how the spreadsheet workspace fills the screen -- wrap it in a `flex-1 min-h-0` container instead of relying on the component's own padding

### 3. Verify Analytics Tracking Coverage

After reviewing the code, the analytics hooks are wired up correctly. Here is the current coverage:

| Event | Where it fires | Status |
|-------|---------------|--------|
| `step_start` | `LessonPlayer.tsx` line 117, fires on `currentStepIndex` change | Working |
| `step_complete` | Line 171 (task steps) and line 208 (instruction steps) | Working |
| `check_fail` | Line 186, fires on incorrect/almost answers | Working |
| `hint_used` | Lines 267/271, fires when hint is shown | Working |
| `time_spent_seconds` | `useStepAnalytics.ts` computes elapsed time between start and complete | Working |
| `attempt_count` | Passed as metadata on `step_complete` | Working |

**One gap found:** When a student opens a quiz step or table-task step and answers correctly on the first try, the `step_complete` event fires with `attempt_count` but the hint tracking for these step types is correct. However, **drop-off tracking** relies on comparing `step_start` counts across sequential steps -- this works because every step change triggers `step_start`. No code changes needed for analytics.

**Minor improvement:** The `step_start` event currently fires even when revisiting already-completed steps (when `isRedoing` is true). This could inflate start counts. Add a guard to only log `step_start` for non-completed steps, or tag revisits with `{ revisit: true }` metadata so the analytics view can filter them out.

### Technical Changes

**File: `src/components/SpreadsheetWorkspace.tsx`**
- Add `allowEdit` callback to FortuneSheet config that returns `false` for locked cells
- Add CSS override for the luckysheet input element to prevent focus on locked cells

**File: `src/index.css`**
- Add CSS rules targeting the FortuneSheet internal input/caret elements on locked cells

**File: `src/components/InteractiveTable.tsx`**
- Change outer container from `flex-1 flex flex-col p-6 gap-4 overflow-auto` to `flex-1 flex flex-col p-4 md:p-6 gap-4 min-h-0 overflow-hidden`
- Make the Card with the table use `flex-1 min-h-0 overflow-auto`
- Ensure the table stretches to fill available width

**File: `src/components/LessonPlayer.tsx`**
- Wrap the `InteractiveTable` rendering (lines 474-479) in a `flex-1 p-4 min-h-0` container to match how other workspace types fill the screen
- Add `revisit` metadata flag to `step_start` event when `isRedoing` is true

