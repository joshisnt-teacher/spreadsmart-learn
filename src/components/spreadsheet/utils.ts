export function parseCellRef(ref: string): { row: number; col: number } {
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

export function cellRefFromCoords(row: number, col: number): string {
  return `${String.fromCharCode(65 + col)}${row + 1}`;
}

export function adjustFormulaRow(formula: string, rowOffset: number): string {
  // Shift all cell references' row numbers by rowOffset
  return formula.replace(/([A-Z]+)(\d+)/gi, (match, colPart, rowPart) => {
    const newRow = parseInt(rowPart, 10) + rowOffset;
    return newRow > 0 ? `${colPart.toUpperCase()}${newRow}` : match;
  });
}
