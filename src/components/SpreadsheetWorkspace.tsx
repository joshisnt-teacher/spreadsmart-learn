import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { SheetState } from '@/types/lesson';

interface SpreadsheetWorkspaceProps {
  initialState: SheetState;
  editableCells: string[];
  onDataChange?: (celldata: any[]) => void;
  resetKey?: number;
}

function parseCellRef(ref: string): { row: number; col: number } {
  const match = ref.match(/^([A-Z]+)(\d+)$/i);
  if (!match) return { row: -1, col: -1 };
  const colStr = match[1].toUpperCase();
  const row = parseInt(match[2], 10) - 1;
  let col = 0;
  for (let i = 0; i < colStr.length; i++) {
    col = col * 26 + (colStr.charCodeAt(i) - 64);
  }
  return { row, col: col - 1 };
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
  const inputRef = useRef<HTMLInputElement>(null);

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

      // Handle simple arithmetic like =A2+B2, =A2-B2, =A2*B2, =A2/B2
      const arithMatch = expr.match(/^([A-Z]+\d+)([\+\-\*\/])([A-Z]+\d+)$/);
      if (arithMatch) {
        const [, ref1, op, ref2] = arithMatch;
        const v1 = Number(getDisplayValue(ref1));
        const v2 = Number(getDisplayValue(ref2));
        switch (op) {
          case '+': return v1 + v2;
          case '-': return v1 - v2;
          case '*': return v1 * v2;
          case '/': return v2 !== 0 ? v1 / v2 : '#DIV/0!';
        }
      }

      return '#ERROR';
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

  const handleCellClick = (ref: string) => {
    setSelectedCell(ref);
    if (isEditable(ref)) {
      setEditingCell(ref);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleCellChange = (ref: string, value: string) => {
    const newValues = { ...cellValues, [ref]: value };
    setCellValues(newValues);
  };

  const handleCellBlur = () => {
    if (editingCell && onDataChange) {
      // Convert to celldata format for marking engine
      const celldata = Object.entries(cellValues).map(([ref, val]) => {
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
    }
    setEditingCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, ref: string) => {
    if (e.key === 'Enter') {
      handleCellBlur();
      // Move to next row
      const { row, col } = parseCellRef(ref);
      const nextRef = `${String.fromCharCode(65 + col)}${row + 2}`;
      setSelectedCell(nextRef);
      if (isEditable(nextRef)) {
        setEditingCell(nextRef);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleCellBlur();
      const { row, col } = parseCellRef(ref);
      const nextRef = `${String.fromCharCode(65 + col + 1)}${row + 1}`;
      setSelectedCell(nextRef);
      if (isEditable(nextRef)) {
        setEditingCell(nextRef);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

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
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-sm">
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
                  const displayVal = getDisplayValue(ref);

                  return (
                    <td
                      key={ref}
                      className={`border border-border p-0 h-7 relative cursor-default transition-colors ${
                        isSelected
                          ? 'ring-2 ring-primary ring-inset z-10'
                          : ''
                      } ${
                        editable
                          ? 'bg-primary/5 hover:bg-primary/10'
                          : header
                          ? 'bg-muted/30 font-semibold'
                          : 'bg-background'
                      }`}
                      onClick={() => handleCellClick(ref)}
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
