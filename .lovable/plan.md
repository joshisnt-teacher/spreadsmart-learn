

# Fix Cell Edit Click Bug and Add Excel Shortcuts

## Bug Fix: Clicking inside an editing cell closes it

**Root cause:** The `<td>` element has an `onClick` handler that always calls `handleCellClick(ref)`, which sets `editingCell = null`. When you click inside the `<input>` to reposition your cursor, the click event bubbles up to the `<td>` and kills the edit.

**Fix:** In `handleCellClick`, check if the clicked cell is already being edited. If so, do nothing -- let the click pass through to the input naturally.

```
const handleCellClick = (ref: string) => {
  if (editingCell === ref) return; // Don't close if already editing this cell
  setSelectedCell(ref);
  setEditingCell(null);
};
```

## New Excel Shortcuts

### 1. Click-to-select cell references while editing formulas
When typing a formula (value starts with `=`) and the user clicks another cell, instead of closing the editor, insert that cell reference at the cursor position. Dragging across multiple cells inserts a range like `A1:B3`.

- Detect "formula editing mode" when the input value starts with `=`
- Clicking a different cell while in formula mode appends/inserts the clicked cell's reference (e.g., `A2`) into the formula input
- Shift+Click or click-and-drag selects a range and inserts `A1:A5` style references
- Clicking a cell when NOT in formula mode behaves normally (selects that cell, exits edit)

### 2. Escape to cancel editing
Already partially handled in `handleKeyDown`, but will ensure it reverts the cell value to what it was before editing started (true cancel, not just exit).

- Store the original value when entering edit mode
- On Escape, restore the original value and exit edit mode without firing `onDataChange`

### 3. Tab to move right
Already implemented -- Tab moves to the next column. No changes needed.

## Technical Details

### File: `src/components/SpreadsheetWorkspace.tsx`

**State additions:**
- `editingOriginalValue: string | null` -- stores the value before editing began, for Escape to revert
- `formulaEditMode: boolean` -- derived from whether the current input starts with `=`

**`handleCellClick` changes:**
- If `editingCell === ref`, return early (fixes the bug)
- If currently editing a formula (value starts with `=`), insert the clicked cell reference into the formula input instead of closing the editor

**`handleCellDoubleClick` / edit mode entry changes:**
- When entering edit mode, save the current cell value as `editingOriginalValue`

**`handleKeyDown` changes:**
- Escape: restore `editingOriginalValue` to `cellValues`, clear `editingCell`, do NOT fire `onDataChange`

**Click-to-reference in formula mode:**
- When a cell is clicked while editing a formula, append the cell reference to the input value
- Visual: briefly highlight the referenced cell with a colored border

### Files modified
- `src/components/SpreadsheetWorkspace.tsx` -- all changes in this single file

