import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { SheetState } from '@/types/lesson';
import { parseCellRef, cellRefFromCoords } from './spreadsheet/utils';
import { useAutofill } from './spreadsheet/useAutofill';

interface SpreadsheetWorkspaceProps {
  initialState: SheetState;
  editableCells: string[];
  onDataChange?: (celldata: any[]) => void;
  resetKey?: number;
}

const SpreadsheetWorkspace: React.FC<SpreadsheetWorkspaceProps> = ({
  initialState,
  editableCells,
  onDataChange,
  resetKey = 0,
}) => {
  const [cellValues, setCellValues] = useState<Record<string, string>>({});
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editingOriginalValue, setEditingOriginalValue] = useState<string | null>(null);
  const [referencedCells, setReferencedCells] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const suppressBlurRef = useRef(false);

  const rows = initialState.row || 10;
  const cols = initialState.column || 6;
  const colLetters = Array.from({ length: cols }, (_, i) => String.fromCharCode(65 + i));

  // Initialize cell values from initial state
  useEffect(() => {
    const values: Record<string, string> = {};
    initialState.celldata.forEach((cell) => {
      const colLetter = String.fromCharCode(65 + cell.c);
      const ref = `${colLetter}${cell.r + 1}`;
      if (cell.v.f) {
        values[ref] = cell.v.f;
      } else if (cell.v.v !== undefined) {
        values[ref] = String(cell.v.v);
      }
    });
    setCellValues(values);
    setSelectedCell(null);
    setEditingCell(null);
  }, [initialState, resetKey]);

  const isEditable = useCallback((ref: string) => {
    return editableCells.includes(ref);
  }, [editableCells]);

  const isHeader = useCallback((ref: string) => {
    const cell = initialState.celldata.find((c) => {
      const colLetter = String.fromCharCode(65 + c.c);
      return `${colLetter}${c.r + 1}` === ref;
    });
    return cell?.v?.bl === 1;
  }, [initialState]);

  // Simple formula evaluation
  const evaluateFormula = useCallback((formula: string): string | number => {
    if (!formula.startsWith('=')) return formula;
    try {
      const expr = formula.substring(1).toUpperCase();

      // Handle SUM, AVERAGE, MIN, MAX, COUNT
      const funcMatch = expr.match(/^(SUM|AVERAGE|MIN|MAX|COUNT|COUNTA)\(([A-Z]+\d+):([A-Z]+\d+)\)$/);
      if (funcMatch) {
        const [, func, startRef, endRef] = funcMatch;
        const start = parseCellRef(startRef);
        const end = parseCellRef(endRef);
        const values: number[] = [];
        for (let r = start.row; r <= end.row; r++) {
          for (let c = start.col; c <= end.col; c++) {
            const ref = `${String.fromCharCode(65 + c)}${r + 1}`;
            const val = cellValues[ref];
            if (val !== undefined) {
              const evaluated = val.startsWith?.('=') ? evaluateFormula(val) : val;
              const num = Number(evaluated);
              if (!isNaN(num)) values.push(num);
            }
          }
        }
        switch (func) {
          case 'SUM': return values.reduce((a, b) => a + b, 0);
          case 'AVERAGE': return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
          case 'MIN': return values.length ? Math.min(...values) : 0;
          case 'MAX': return values.length ? Math.max(...values) : 0;
          case 'COUNT': return values.length;
          case 'COUNTA': return values.length;
        }
      }

      // General-purpose arithmetic: tokenize into cell refs, numbers, and operators
      const tokens = expr.match(/([A-Z]+\d+|\d+\.?\d*|[\+\-\*\/])/g);
      if (!tokens || tokens.length === 0) return '#ERROR';

      // Resolve tokens to numbers
      const resolved: (number | string)[] = tokens.map((t) => {
        if (/^[A-Z]+\d+$/.test(t)) {
          const val = getDisplayValue(t);
          const num = Number(val);
          return isNaN(num) ? NaN : num;
        }
        if (/^\d+\.?\d*$/.test(t)) return Number(t);
        return t; // operator
      });

      // Build values and ops arrays
      const numValues: number[] = [];
      const ops: string[] = [];
      for (let i = 0; i < resolved.length; i++) {
        if (i % 2 === 0) {
          if (typeof resolved[i] !== 'number' || isNaN(resolved[i] as number)) return '#ERROR';
          numValues.push(resolved[i] as number);
        } else {
          if (typeof resolved[i] !== 'string' || !/^[\+\-\*\/]$/.test(resolved[i] as string)) return '#ERROR';
          ops.push(resolved[i] as string);
        }
      }

      if (numValues.length === 0 || numValues.length !== ops.length + 1) return '#ERROR';

      // Apply * and / first (operator precedence)
      const addValues: number[] = [numValues[0]];
      const addOps: string[] = [];
      for (let i = 0; i < ops.length; i++) {
        if (ops[i] === '*' || ops[i] === '/') {
          const left = addValues.pop()!;
          if (ops[i] === '/' && numValues[i + 1] === 0) return '#DIV/0!';
          addValues.push(ops[i] === '*' ? left * numValues[i + 1] : left / numValues[i + 1]);
        } else {
          addValues.push(numValues[i + 1]);
          addOps.push(ops[i]);
        }
      }

      // Apply + and -
      let result = addValues[0];
      for (let i = 0; i < addOps.length; i++) {
        result = addOps[i] === '+' ? result + addValues[i + 1] : result - addValues[i + 1];
      }

      return result;
    } catch {
      return '#ERROR';
    }
  }, [cellValues]);

  const getDisplayValue = useCallback((ref: string): string => {
    const val = cellValues[ref];
    if (val === undefined) return '';
    if (typeof val === 'string' && val.startsWith('=')) {
      const result = evaluateFormula(val);
      return String(result);
    }
    return val;
  }, [cellValues, evaluateFormula]);

  const fireDataChange = useCallback((values: Record<string, string>) => {
    if (!onDataChange) return;
    const celldata = Object.entries(values).map(([ref, val]) => {
      const { row, col } = parseCellRef(ref);
      const isFormula = typeof val === 'string' && val.startsWith('=');
      return {
        r: row,
        c: col,
        v: {
          v: isFormula ? evaluateFormula(val) : (isNaN(Number(val)) ? val : Number(val)),
          m: String(isFormula ? evaluateFormula(val) : val),
          f: isFormula ? val : undefined,
        },
      };
    });
    onDataChange(celldata);
  }, [onDataChange, evaluateFormula]);

  // Autofill hook
  const { isDragging, dragRange, filledCells, handleFillHandleMouseDown } = useAutofill({
    selectedCell,
    cellValues,
    editableCells,
    rows,
    onFill: (newValues) => {
      const updated = { ...cellValues, ...newValues };
      setCellValues(updated);
      fireDataChange(updated);
    },
  });

  const isFormulaEditing = editingCell && cellValues[editingCell]?.startsWith('=');

  const handleCellClick = (ref: string) => {
    // Don't close if clicking inside the cell already being edited
    if (editingCell === ref) return;

    // If editing a formula, insert clicked cell reference instead of closing
    if (editingCell && isFormulaEditing) {
      suppressBlurRef.current = true;
      const input = inputRef.current;
      const currentVal = cellValues[editingCell] || '';
      if (input) {
        const pos = input.selectionStart ?? currentVal.length;
        const newVal = currentVal.slice(0, pos) + ref + currentVal.slice(pos);
        setCellValues((prev) => ({ ...prev, [editingCell]: newVal }));
        setReferencedCells((prev) => [...prev, ref]);
        setTimeout(() => {
          input.focus();
          const newPos = pos + ref.length;
          input.setSelectionRange(newPos, newPos);
          suppressBlurRef.current = false;
        }, 0);
        // Clear highlight after a moment
        setTimeout(() => setReferencedCells((prev) => prev.filter((c) => c !== ref)), 600);
      }
      return;
    }

    setSelectedCell(ref);
    setEditingCell(null);
    setEditingOriginalValue(null);
  };

  const handleCellDoubleClick = (ref: string) => {
    if (isEditable(ref)) {
      setEditingOriginalValue(cellValues[ref] || '');
      setEditingCell(ref);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleCellChange = (ref: string, value: string) => {
    setCellValues((prev) => ({ ...prev, [ref]: value }));
  };

  const handleCellBlur = () => {
    if (suppressBlurRef.current) return;
    if (editingCell) {
      fireDataChange(cellValues);
    }
    setEditingCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, ref: string) => {
    if (e.key === 'Enter') {
      handleCellBlur();
      const { row, col } = parseCellRef(ref);
      const nextRef = cellRefFromCoords(row + 1, col);
      if (row + 1 < rows) setSelectedCell(nextRef);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleCellBlur();
      const { row, col } = parseCellRef(ref);
      if (col + 1 < cols) {
        const nextRef = cellRefFromCoords(row, col + 1);
        setSelectedCell(nextRef);
      }
    } else if (e.key === 'Escape') {
      // Revert to original value
      if (editingCell && editingOriginalValue !== null) {
        setCellValues((prev) => ({ ...prev, [editingCell]: editingOriginalValue }));
      }
      setEditingCell(null);
      setEditingOriginalValue(null);
    }
  };

  // Grid-level keyboard navigation
  const handleGridKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (editingCell) return; // let input handle keys
    if (!selectedCell) return;

    const { row, col } = parseCellRef(selectedCell);

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (row > 0) setSelectedCell(cellRefFromCoords(row - 1, col));
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (row < rows - 1) setSelectedCell(cellRefFromCoords(row + 1, col));
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (col > 0) setSelectedCell(cellRefFromCoords(row, col - 1));
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (col < cols - 1) setSelectedCell(cellRefFromCoords(row, col + 1));
        break;
      case 'F2':
        e.preventDefault();
        if (isEditable(selectedCell)) {
          setEditingOriginalValue(cellValues[selectedCell] || '');
          setEditingCell(selectedCell);
          setTimeout(() => inputRef.current?.focus(), 0);
        }
        break;
      case 'Delete':
      case 'Backspace':
        e.preventDefault();
        if (isEditable(selectedCell)) {
          const updated = { ...cellValues, [selectedCell]: '' };
          setCellValues(updated);
          fireDataChange(updated);
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (isEditable(selectedCell)) {
          setEditingOriginalValue(cellValues[selectedCell] || '');
          setEditingCell(selectedCell);
          setTimeout(() => inputRef.current?.focus(), 0);
        }
        break;
      default:
        // Start typing into editable cell
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && isEditable(selectedCell)) {
          setEditingOriginalValue(cellValues[selectedCell] || '');
          setEditingCell(selectedCell);
          setCellValues((prev) => ({ ...prev, [selectedCell]: e.key }));
          setTimeout(() => inputRef.current?.focus(), 0);
        }
        break;
    }
  }, [editingCell, selectedCell, rows, cols, isEditable, cellValues, fireDataChange]);

  // Focus grid when a cell is selected (so keyboard events work)
  useEffect(() => {
    if (selectedCell && !editingCell) {
      gridRef.current?.focus();
    }
  }, [selectedCell, editingCell]);

  return (
    <div className="flex flex-col h-full">
      {/* Formula bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 border-b text-sm">
        <span className="font-mono text-xs bg-background px-2 py-0.5 rounded border min-w-[3rem] text-center">
          {selectedCell || ''}
        </span>
        <span className="text-muted-foreground">fx</span>
        <span className="font-mono text-xs flex-1">
          {selectedCell ? (cellValues[selectedCell] || '') : ''}
        </span>
      </div>

      {/* Grid */}
      <div
        ref={gridRef}
        className="flex-1 overflow-auto outline-none"
        tabIndex={0}
        onKeyDown={handleGridKeyDown}
      >
        <table className="w-full border-collapse text-sm select-none">
          <thead>
            <tr>
              <th className="w-10 bg-muted/60 border border-border text-xs text-muted-foreground font-normal p-0 h-7"></th>
              {colLetters.map((letter) => (
                <th
                  key={letter}
                  className="bg-muted/60 border border-border text-xs text-muted-foreground font-medium p-0 h-7 min-w-[80px]"
                >
                  {letter}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }, (_, rowIdx) => (
              <tr key={rowIdx}>
                <td className="bg-muted/60 border border-border text-xs text-muted-foreground text-center p-0 h-7 font-normal">
                  {rowIdx + 1}
                </td>
                {colLetters.map((letter) => {
                  const ref = `${letter}${rowIdx + 1}`;
                  const editable = isEditable(ref);
                  const header = isHeader(ref);
                  const isSelected = selectedCell === ref;
                  const isEditing = editingCell === ref;
                  const isDragTarget = dragRange.includes(ref);
                  const isJustFilled = filledCells.includes(ref);
                  const isReferenced = referencedCells.includes(ref);
                  const displayVal = getDisplayValue(ref);

                  return (
                    <td
                      key={ref}
                      data-cell-ref={ref}
                      className={`border border-border p-0 h-7 relative cursor-default transition-colors ${
                        isSelected
                          ? 'ring-2 ring-primary ring-inset z-10'
                          : ''
                      } ${
                        isReferenced
                          ? 'ring-2 ring-accent ring-inset bg-accent/20 z-10'
                          : isDragTarget
                          ? 'bg-primary/20 ring-1 ring-primary/40 ring-inset'
                          : editable
                          ? 'bg-primary/5 hover:bg-primary/10'
                          : header
                          ? 'bg-muted/30 font-semibold'
                          : 'bg-background'
                      } ${
                        isJustFilled ? 'animate-pulse' : ''
                      }`}
                      onMouseDown={() => {
                        if (editingCell && editingCell !== ref && isFormulaEditing) {
                          suppressBlurRef.current = true;
                        }
                      }}
                      onClick={() => handleCellClick(ref)}
                      onDoubleClick={() => handleCellDoubleClick(ref)}
                    >
                      {isEditing ? (
                        <input
                          ref={inputRef}
                          className="absolute inset-0 w-full h-full px-1.5 text-sm font-mono bg-background border-none outline-none"
                          value={cellValues[ref] || ''}
                          onChange={(e) => handleCellChange(ref, e.target.value)}
                          onBlur={handleCellBlur}
                          onKeyDown={(e) => handleKeyDown(e, ref)}
                        />
                      ) : (
                        <div className={`px-1.5 truncate text-sm ${
                          !isNaN(Number(displayVal)) && displayVal !== '' ? 'text-right' : ''
                        } ${header ? 'font-semibold' : ''}`}>
                          {displayVal}
                        </div>
                      )}
                      {/* Fill handle */}
                      {isSelected && editable && !isEditing && (
                        <div
                          className="absolute -bottom-[3px] -right-[3px] w-[7px] h-[7px] bg-primary border border-background cursor-crosshair z-20"
                          onMouseDown={handleFillHandleMouseDown}
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpreadsheetWorkspace;
