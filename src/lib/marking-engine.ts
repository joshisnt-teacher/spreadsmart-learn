import type { TaskDefinition, CheckResult, TaskExpectation } from '@/types/lesson';

/**
 * Parse a cell reference like "B5" into { row, col } (0-indexed)
 */
export function parseCellRef(ref: string): { row: number; col: number } {
  const match = ref.match(/^([A-Z]+)(\d+)$/i);
  if (!match) throw new Error(`Invalid cell reference: ${ref}`);
  const colStr = match[1].toUpperCase();
  const row = parseInt(match[2], 10) - 1;
  let col = 0;
  for (let i = 0; i < colStr.length; i++) {
    col = col * 26 + (colStr.charCodeAt(i) - 64);
  }
  return { row, col: col - 1 };
}

/**
 * Get a cell's value and formula from FortuneSheet data
 */
export function getCellData(
  sheetData: any[],
  cellRef: string
): { value: any; formula: string | undefined } {
  const { row, col } = parseCellRef(cellRef);
  const cell = sheetData.find(
    (c: any) => c.r === row && c.c === col
  );
  if (!cell || !cell.v) return { value: undefined, formula: undefined };
  return {
    value: cell.v.v,
    formula: cell.v.f,
  };
}

function normalizeFormula(f: string): string {
  return f.replace(/\s+/g, '').toUpperCase();
}

function valuesMatch(actual: any, expected: any, tolerance?: number): boolean {
  if (actual === undefined || actual === null) return false;
  const numActual = Number(actual);
  const numExpected = Number(expected);
  if (!isNaN(numActual) && !isNaN(numExpected)) {
    if (tolerance) {
      return Math.abs(numActual - numExpected) <= Math.abs(numExpected * tolerance / 100);
    }
    return Math.abs(numActual - numExpected) < 0.0001;
  }
  return String(actual).trim() === String(expected).trim();
}

/**
 * Check a single expectation against the current sheet data
 */
function checkExpectation(
  sheetData: any[],
  exp: TaskExpectation
): { passed: boolean; formulaWrong: boolean; valueWrong: boolean } {
  const { value, formula } = getCellData(sheetData, exp.cellRef);
  
  let valueOk = true;
  let formulaOk = true;

  if (exp.expectedValue !== undefined) {
    valueOk = valuesMatch(value, exp.expectedValue, exp.tolerancePercent);
  }

  if (exp.checkFormula && exp.expectedFormula) {
    if (!formula) {
      formulaOk = false;
    } else {
      formulaOk = normalizeFormula(formula) === normalizeFormula(exp.expectedFormula);
    }
  }

  return {
    passed: valueOk && formulaOk,
    formulaWrong: !formulaOk,
    valueWrong: !valueOk,
  };
}

/**
 * Main marking function — checks all expectations for a task
 */
export function checkTask(
  sheetData: any[],
  task: TaskDefinition,
  attemptCount: number
): CheckResult {
  const results = task.expectations.map((exp) => ({
    ...checkExpectation(sheetData, exp),
    cellRef: exp.cellRef,
    exp,
  }));

  const allPassed = results.every((r) => r.passed);
  const someValueCorrect = results.some((r) => !r.valueWrong && r.formulaWrong);

  if (allPassed) {
    return {
      type: 'correct',
      message: task.successMessage,
    };
  }

  if (someValueCorrect && task.almostCorrectMessage) {
    return {
      type: 'almost',
      message: task.almostCorrectMessage,
      details: results
        .filter((r) => r.formulaWrong)
        .map((r) => `Cell ${r.cellRef}: correct value but check your formula.`),
    };
  }

  const wrongCells = results
    .filter((r) => !r.passed)
    .map((r) => r.cellRef);

  return {
    type: 'incorrect',
    message: task.incorrectMessage || 'Not quite right — check the highlighted cells.',
    details: wrongCells.map((c) => `Cell ${c} needs attention.`),
  };
}

/**
 * Get the appropriate hint based on attempt count
 */
export function getHint(task: TaskDefinition, attemptCount: number): string | null {
  if (attemptCount < 2) return null;
  const hintIndex = Math.min(attemptCount - 2, task.hints.length - 1);
  return task.hints[hintIndex] ?? null;
}
