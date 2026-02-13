

# Switch from Custom Spreadsheet to FortuneSheet

## Why

The custom-built React spreadsheet can't replicate all of Excel's keyboard shortcuts, formula editing, drag-to-autofill, cell references, and other interactions reliably. FortuneSheet (`@fortune-sheet/react`) is already installed in the project and provides all of this out of the box -- it's a full Excel clone built specifically for React.

## What Changes

### Replace `SpreadsheetWorkspace` with a FortuneSheet `Workbook` wrapper

Create a new version of `SpreadsheetWorkspace` that renders FortuneSheet's `<Workbook>` component instead of the custom HTML table. This wrapper will:

1. **Convert lesson data to FortuneSheet format** -- the existing `SheetState` / `CellData` types already match FortuneSheet's `celldata` format (same `r`, `c`, `v` structure), so conversion is minimal.

2. **Lock non-editable cells** -- use FortuneSheet's built-in sheet protection (`config.authority`) to lock the entire sheet, then mark only the `editableCells` as unlocked (by setting `v.lo = 0` on those cells). This gives students a real Excel-like experience where they can only edit the cells the lesson allows.

3. **Capture changes via `onChange`** -- FortuneSheet emits an `onChange` callback with updated sheet data. The wrapper will extract cell values from this and pass them to the existing `onDataChange` prop so the marking engine continues to work unchanged.

4. **Hide unnecessary UI** -- disable the toolbar, sheet tabs, and formula bar (or keep the formula bar for educational value) since students shouldn't be adding sheets or changing formatting.

5. **Reset on step change** -- use the `resetKey` prop to force a fresh FortuneSheet instance when stepping between lesson steps.

## What Students Get for Free

- Full arrow key navigation
- F2 to edit, Escape to cancel, Enter/Tab to confirm
- Formula bar with live formula display
- Click-to-reference cells while typing formulas (with colored highlights)
- Drag-to-autofill handle with smart increment and formula adjustment
- Copy/paste (Ctrl+C, Ctrl+V)
- Undo/redo (Ctrl+Z, Ctrl+Y)
- All 400+ Excel functions (SUM, AVERAGE, VLOOKUP, IF, etc.)
- Cell selection with Shift+Click and Shift+Arrow
- Double-click to edit
- Right-aligned numbers, left-aligned text
- Proper cursor positioning inside cell editors

## What Stays the Same

- The `marking-engine.ts` -- no changes needed, it already reads the `{ r, c, v: { v, f } }` format
- The `LessonPlayer.tsx` -- same props interface (`initialState`, `editableCells`, `onDataChange`, `resetKey`)
- The lesson data in `excel-basics-module.ts` -- same `SheetState` format
- All XP, confetti, hints, and progress logic

## Technical Details

### Files to modify

**`src/components/SpreadsheetWorkspace.tsx`** -- rewrite to wrap FortuneSheet

Key implementation:
- Import `Workbook` from `@fortune-sheet/react` and its CSS
- Convert `initialState.celldata` to mark locked/unlocked cells based on `editableCells`
- Configure sheet with `authority: { sheet: 1, selectLockedCells: 1, selectunLockedCells: 1 }` to enable protection
- Set `showToolbar: false`, `showSheetTabs: false` to hide UI chrome
- Use `onChange` to extract cell data and call `onDataChange`
- Use `key={resetKey}` on the Workbook to force remount on step changes

**`src/index.css`** -- update FortuneSheet CSS overrides if needed for theme consistency

### Files to remove (optional cleanup)

- `src/components/spreadsheet/useAutofill.ts` -- no longer needed (FortuneSheet handles autofill)
- `src/components/spreadsheet/utils.ts` -- keep `parseCellRef` and `cellRefFromCoords` since `marking-engine.ts` uses the same logic via its own copy

### No changes to

- `src/lib/marking-engine.ts`
- `src/types/lesson.ts`
- `src/data/excel-basics-module.ts`
- `src/components/LessonPlayer.tsx`

