

# Add Excel-Like Keyboard Shortcuts and Drag-to-Autofill

## Overview
Enhance the custom spreadsheet with real Excel behaviours so students build transferable skills. This adds arrow key navigation, common keyboard shortcuts, and a drag-to-autofill handle on the selected cell.

## Features to Add

### 1. Arrow Key Navigation
When a cell is selected (but not being edited), arrow keys move the selection:
- Up/Down/Left/Right to move one cell in that direction
- Stays within grid bounds
- If the newly selected cell is editable, it gets selected but does NOT auto-enter edit mode (matching Excel behaviour)

### 2. Keyboard Shortcuts
- **F2** -- Enter edit mode on the selected cell (like Excel)
- **Delete / Backspace** -- Clear the selected cell's value (if editable)
- **Double-click** -- Enter edit mode (already partially works via single click; make it more precise)
- **Arrow keys while editing** -- Allow normal cursor movement inside the input; only navigate cells when NOT editing

### 3. Drag-to-Autofill Handle
- When a cell is selected, show a small blue square at the bottom-right corner of the cell (the "fill handle")
- Dragging this handle downward auto-fills cells below with:
  - **Numbers**: Increment pattern (e.g., 1, 2, 3 or 10, 20, 30 if two source cells detected)
  - **Formulas**: Adjust row references (e.g., `=A1*B1` becomes `=A2*B2`, `=A3*B3`, etc.)
  - **Text**: Copy the value as-is
- Only fills into editable cells; skips locked cells
- Visual feedback: highlight the range being filled while dragging

### 4. Visual Polish
- Show a subtle cursor change (`crosshair`) when hovering the fill handle
- Brief highlight animation on cells that were just auto-filled

## Technical Details

### File: `src/components/SpreadsheetWorkspace.tsx`

**Arrow key + shortcut navigation:**
- Add a `handleGridKeyDown` function attached to the table container (via `tabIndex={0}` and `onKeyDown`)
- When not editing: arrow keys change `selectedCell`, F2 enters edit mode, Delete clears value
- When editing: keys go to the input as normal (already handled by `handleKeyDown`)

**Fill handle rendering:**
- When `selectedCell` is set and the cell is editable, render a small `<div>` positioned at the bottom-right corner of the selected `<td>`
- Attach `onMouseDown` to begin a drag operation
- Track drag via `mousemove` / `mouseup` on the document (cleaned up on unmount)
- Calculate which cells the drag covers (only vertical for simplicity)

**Autofill logic (new helper function `autoFillCells`):**
- Detect the source cell's value type:
  - If numeric: increment by 1 for each row (or detect pattern from adjacent cells)
  - If formula: parse cell references and adjust row numbers (e.g., `=A1*B1` shifted down becomes `=A2*B2`)
  - If text: copy as-is
- Apply values only to cells in `editableCells`
- Trigger `onDataChange` after fill completes

**Double-click vs single-click:**
- Change current `onClick` to select the cell without entering edit mode
- Add `onDoubleClick` to enter edit mode (or keep single-click-to-edit for editable cells since it's more intuitive for students -- this can be a design choice)

### New state variables
- `isDragging: boolean` -- whether a fill drag is in progress
- `dragRange: string[]` -- cells being dragged over (for visual highlight)

### Files modified
- `src/components/SpreadsheetWorkspace.tsx` -- all changes in this single file

