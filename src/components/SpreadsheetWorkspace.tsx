import React, { useMemo, useCallback, useRef } from 'react';
import { Workbook } from '@fortune-sheet/react';
import '@fortune-sheet/react/dist/index.css';
import type { SheetState } from '@/types/lesson';
import { parseCellRef } from './spreadsheet/utils';

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
  const onDataChangeRef = useRef(onDataChange);
  onDataChangeRef.current = onDataChange;

  // Build the set of editable cell coords for fast lookup
  const editableSet = useMemo(() => {
    const set = new Set<string>();
    editableCells.forEach((ref) => {
      const { row, col } = parseCellRef(ref);
      set.add(`${row},${col}`);
    });
    return set;
  }, [editableCells]);

  // Convert initialState to FortuneSheet sheet data
  const sheetData = useMemo(() => {
    const celldata = initialState.celldata.map((cell) => {
      const key = `${cell.r},${cell.c}`;
      const isEditable = editableSet.has(key);
      return {
        r: cell.r,
        c: cell.c,
        v: {
          ...cell.v,
          // lo=0 means unlocked; lo=1 means locked
          lo: isEditable ? 0 : 1,
        },
      };
    });

    // Also add empty unlocked cells for editable cells not in initial data
    editableCells.forEach((ref) => {
      const { row, col } = parseCellRef(ref);
      const exists = celldata.some((c) => c.r === row && c.c === col);
      if (!exists) {
        celldata.push({
          r: row,
          c: col,
          v: { lo: 0 } as any,
        });
      }
    });

    return [
      {
        name: initialState.name || 'Sheet1',
        celldata,
        row: initialState.row || 10,
        column: initialState.column || 6,
        config: {
          ...(initialState.config || {}),
          authority: {
            sheet: 1, // enable sheet protection
            selectLockedCells: 1, // allow selecting locked cells
            selectunLockedCells: 1, // allow selecting unlocked cells
          },
        },
      },
    ];
  }, [initialState, editableCells, editableSet]);

  // Handle changes from FortuneSheet
  const handleChange = useCallback(
    (data: any[]) => {
      if (!onDataChangeRef.current || !data?.[0]) return;

      const sheet = data[0];
      // FortuneSheet stores data in a 2D array after init, but celldata may also be available
      // We need to convert back to the celldata format the marking engine expects
      const celldata: any[] = [];

      if (sheet.data) {
        // sheet.data is a 2D CellMatrix
        for (let r = 0; r < sheet.data.length; r++) {
          const row = sheet.data[r];
          if (!row) continue;
          for (let c = 0; c < row.length; c++) {
            const cell = row[c];
            if (cell && (cell.v !== undefined || cell.f)) {
              celldata.push({
                r,
                c,
                v: {
                  v: cell.v,
                  m: cell.m,
                  f: cell.f,
                },
              });
            }
          }
        }
      }

      onDataChangeRef.current(celldata);
    },
    []
  );

  return (
    <div className="flex flex-col h-full fortune-sheet-container">
      <Workbook
        key={resetKey}
        data={sheetData}
        showToolbar={false}
        showSheetTabs={false}
        showFormulaBar={true}
        onChange={handleChange}
        column={initialState.column || 6}
        row={initialState.row || 10}
      />
    </div>
  );
};

export default SpreadsheetWorkspace;
