import { useState, useCallback, useEffect, useRef } from 'react';
import { parseCellRef, cellRefFromCoords, adjustFormulaRow } from './utils';

interface UseAutofillProps {
  selectedCell: string | null;
  cellValues: Record<string, string>;
  editableCells: string[];
  rows: number;
  onFill: (newValues: Record<string, string>) => void;
}

export function useAutofill({ selectedCell, cellValues, editableCells, rows, onFill }: UseAutofillProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragRange, setDragRange] = useState<string[]>([]);
  const [filledCells, setFilledCells] = useState<string[]>([]);
  const dragStartRef = useRef<string | null>(null);

  // Clear filled highlight after animation
  useEffect(() => {
    if (filledCells.length > 0) {
      const timer = setTimeout(() => setFilledCells([]), 600);
      return () => clearTimeout(timer);
    }
  }, [filledCells]);

  const handleFillHandleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedCell) return;
    dragStartRef.current = selectedCell;
    setIsDragging(true);
    setDragRange([]);
  }, [selectedCell]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const td = target.closest('td[data-cell-ref]') as HTMLElement | null;
      if (!td || !dragStartRef.current) return;

      const targetRef = td.getAttribute('data-cell-ref');
      if (!targetRef) return;

      const start = parseCellRef(dragStartRef.current);
      const end = parseCellRef(targetRef);

      // Only vertical dragging, same column
      if (start.col !== end.col) return;

      const range: string[] = [];
      const minRow = Math.min(start.row, end.row);
      const maxRow = Math.max(start.row, end.row);
      for (let r = minRow; r <= maxRow; r++) {
        const ref = cellRefFromCoords(r, start.col);
        if (ref !== dragStartRef.current) {
          range.push(ref);
        }
      }
      setDragRange(range);
    };

    const handleMouseUp = () => {
      if (dragStartRef.current && dragRange.length > 0) {
        const sourceRef = dragStartRef.current;
        const sourceVal = cellValues[sourceRef] || '';
        const sourceCoords = parseCellRef(sourceRef);
        const newValues: Record<string, string> = {};

        dragRange.forEach((ref) => {
          if (!editableCells.includes(ref)) return;
          const targetCoords = parseCellRef(ref);
          const rowOffset = targetCoords.row - sourceCoords.row;

          if (typeof sourceVal === 'string' && sourceVal.startsWith('=')) {
            // Adjust formula references
            newValues[ref] = adjustFormulaRow(sourceVal, rowOffset);
          } else {
            const num = Number(sourceVal);
            if (!isNaN(num) && sourceVal !== '') {
              // Increment number
              newValues[ref] = String(num + rowOffset);
            } else {
              // Copy text as-is
              newValues[ref] = sourceVal;
            }
          }
        });

        if (Object.keys(newValues).length > 0) {
          onFill(newValues);
          setFilledCells(Object.keys(newValues));
        }
      }

      setIsDragging(false);
      setDragRange([]);
      dragStartRef.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragRange, cellValues, editableCells, onFill]);

  return {
    isDragging,
    dragRange,
    filledCells,
    handleFillHandleMouseDown,
  };
}
