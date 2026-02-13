

# Fix Multi-Operand Formula Evaluation

## Problem
The spreadsheet's formula engine only handles simple two-cell arithmetic (e.g., `=A2+B2`). Any formula with three or more terms like `=C2+C3+C4` returns `#ERROR` because the regex pattern `^([A-Z]+\d+)([\+\-\*\/])([A-Z]+\d+)$` requires exactly two cell references with one operator.

## Solution
Replace the rigid two-operand regex with a general-purpose arithmetic evaluator that supports any number of cell references and operators chained together (e.g., `=A1+B1+C1-D1*E1`).

## Technical Details

### File: `src/components/SpreadsheetWorkspace.tsx`

**Replace the arithmetic handling block** (around lines 101-114) with a general parser that:

1. Tokenizes the expression into cell references, numbers, and operators using a regex like `/([A-Z]+\d+|\d+\.?\d*|[\+\-\*\/])/g`
2. Iterates through tokens, resolving cell references via `getDisplayValue`
3. Evaluates left-to-right (with standard operator precedence: `*` and `/` before `+` and `-`)
4. Returns `#ERROR` only if the expression is truly malformed

This will support formulas like:
- `=C2+C3+C4` (the one currently failing)
- `=A2*B2+C2` (mixed operators)
- `=A1+10` (cell + literal number)
- `=MAX(A1:A5)-MIN(A1:A5)` -- still handled by the function matcher above, with the subtraction of results being a future enhancement

### Scope
- One file changed: `src/components/SpreadsheetWorkspace.tsx`
- Only the `evaluateFormula` function is modified
- No changes to the marking engine, types, or module data

