import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Workbook } from '@fortune-sheet/react';
import '@fortune-sheet/react/dist/index.css';
import { Plus, Trash2, Target, Lightbulb, MessageSquare, Zap, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { SheetState, CellData, TaskDefinition, TaskExpectation } from '@/types/lesson';
import { parseCellRef, cellRefFromCoords } from '@/components/spreadsheet/utils';

export interface TaskStepConfig {
  initialSheetState: SheetState;
  task: TaskDefinition;
}

interface TaskStepEditorProps {
  config: TaskStepConfig | null;
  onChange: (config: TaskStepConfig) => void;
}

const DEFAULT_ROWS = 10;
const DEFAULT_COLS = 6;

function createDefaultConfig(): TaskStepConfig {
  return {
    initialSheetState: {
      name: 'Sheet1',
      celldata: [],
      row: DEFAULT_ROWS,
      column: DEFAULT_COLS,
    },
    task: {
      id: crypto.randomUUID(),
      expectations: [],
      editableCells: [],
      hints: [''],
      successMessage: 'Correct! Well done.',
      almostCorrectMessage: 'Almost there — check your formula.',
      incorrectMessage: 'Not quite — try again!',
      xpValue: 10,
      bonusXp: 5,
    },
  };
}

const TaskStepEditor: React.FC<TaskStepEditorProps> = ({ config, onChange }) => {
  const cfg = config ?? createDefaultConfig();
  const [sheetKey, setSheetKey] = useState(0);
  const cellDataRef = useRef<CellData[]>(cfg.initialSheetState.celldata);

  // Sync ref when config changes externally
  useEffect(() => {
    cellDataRef.current = cfg.initialSheetState.celldata;
  }, [cfg.initialSheetState.celldata]);

  const updateTask = useCallback((updates: Partial<TaskDefinition>) => {
    onChange({ ...cfg, task: { ...cfg.task, ...updates } });
  }, [cfg, onChange]);

  const updateSheetState = useCallback((updates: Partial<SheetState>) => {
    onChange({ ...cfg, initialSheetState: { ...cfg.initialSheetState, ...updates } });
  }, [cfg, onChange]);

  // FortuneSheet data (unlocked — no protection)
  const sheetData = useMemo(() => [{
    name: cfg.initialSheetState.name || 'Sheet1',
    celldata: cfg.initialSheetState.celldata.map(cell => ({
      r: cell.r,
      c: cell.c,
      v: { ...cell.v },
    })),
    row: cfg.initialSheetState.row || DEFAULT_ROWS,
    column: cfg.initialSheetState.column || DEFAULT_COLS,
    config: {},
  }], [cfg.initialSheetState, sheetKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Capture sheet changes
  const handleSheetChange = useCallback((data: any[]) => {
    if (!data?.[0]?.data) return;
    const sheet = data[0];
    const newCellData: CellData[] = [];
    for (let r = 0; r < sheet.data.length; r++) {
      const row = sheet.data[r];
      if (!row) continue;
      for (let c = 0; c < row.length; c++) {
        const cell = row[c];
        if (cell && (cell.v !== undefined && cell.v !== null || cell.f || cell.bg || cell.bl || cell.fc)) {
          newCellData.push({
            r, c,
            v: {
              v: cell.v,
              m: cell.m,
              f: cell.f,
              ct: cell.ct,
              bg: cell.bg,
              fc: cell.fc,
              bl: cell.bl,
              fs: cell.fs,
            },
          });
        }
      }
    }
    cellDataRef.current = newCellData;
  }, []);

  const captureSheetState = useCallback(() => {
    updateSheetState({ celldata: cellDataRef.current });
  }, [updateSheetState]);

  // Editable cells management
  const toggleEditableCell = useCallback((cellRef: string) => {
    const current = cfg.task.editableCells;
    const next = current.includes(cellRef)
      ? current.filter(c => c !== cellRef)
      : [...current, cellRef];
    updateTask({ editableCells: next });
  }, [cfg.task.editableCells, updateTask]);

  // Expectations management
  const addExpectation = useCallback(() => {
    const newExp: TaskExpectation = {
      cellRef: cfg.task.editableCells[0] || 'A1',
      checkFormula: false,
    };
    updateTask({ expectations: [...cfg.task.expectations, newExp] });
  }, [cfg.task, updateTask]);

  const updateExpectation = useCallback((idx: number, updates: Partial<TaskExpectation>) => {
    const next = cfg.task.expectations.map((e, i) => i === idx ? { ...e, ...updates } : e);
    updateTask({ expectations: next });
  }, [cfg.task.expectations, updateTask]);

  const removeExpectation = useCallback((idx: number) => {
    updateTask({ expectations: cfg.task.expectations.filter((_, i) => i !== idx) });
  }, [cfg.task.expectations, updateTask]);

  // Hints management
  const updateHint = useCallback((idx: number, value: string) => {
    const next = cfg.task.hints.map((h, i) => i === idx ? value : h);
    updateTask({ hints: next });
  }, [cfg.task.hints, updateTask]);

  const addHint = useCallback(() => {
    updateTask({ hints: [...cfg.task.hints, ''] });
  }, [cfg.task.hints, updateTask]);

  const removeHint = useCallback((idx: number) => {
    updateTask({ hints: cfg.task.hints.filter((_, i) => i !== idx) });
  }, [cfg.task.hints, updateTask]);

  // Grid dimensions
  const rows = cfg.initialSheetState.row || DEFAULT_ROWS;
  const cols = cfg.initialSheetState.column || DEFAULT_COLS;

  return (
    <div className="space-y-6">
      {/* Spreadsheet Data Editor */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Grid3X3 className="w-4 h-4" /> Spreadsheet Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Rows</Label>
              <Input
                type="number" min={3} max={30}
                value={rows}
                onChange={e => { updateSheetState({ row: parseInt(e.target.value) || DEFAULT_ROWS }); setSheetKey(k => k + 1); }}
                className="w-20 h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Columns</Label>
              <Input
                type="number" min={2} max={20}
                value={cols}
                onChange={e => { updateSheetState({ column: parseInt(e.target.value) || DEFAULT_COLS }); setSheetKey(k => k + 1); }}
                className="w-20 h-8 text-sm"
              />
            </div>
            <div className="flex-1" />
            <Button size="sm" variant="outline" onClick={captureSheetState}>
              Capture Sheet Data
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Fill in the initial data students will see. Click "Capture Sheet Data" after editing to save your changes.
          </p>
          <div className="border border-border rounded-md overflow-hidden fortune-sheet-container" style={{ height: Math.min(rows * 28 + 50, 400) }}>
            <Workbook
              key={sheetKey}
              data={sheetData}
              showToolbar={false}
              showSheetTabs={false}
              showFormulaBar={true}
              onChange={handleSheetChange}
              column={cols}
              row={rows}
            />
          </div>
        </CardContent>
      </Card>

      {/* Editable Cells Selector */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="w-4 h-4" /> Editable Cells
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Click cells below to toggle which ones students can edit. Editable cells are highlighted in green.
          </p>
          <div className="border border-border rounded-md overflow-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr>
                  <th className="w-8 p-1 border-b border-r border-border bg-muted" />
                  {Array.from({ length: cols }, (_, c) => (
                    <th key={c} className="p-1 border-b border-r border-border bg-muted text-muted-foreground font-mono min-w-[60px]">
                      {String.fromCharCode(65 + c)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: Math.min(rows, 20) }, (_, r) => (
                  <tr key={r}>
                    <td className="p-1 border-b border-r border-border bg-muted text-muted-foreground font-mono text-center">
                      {r + 1}
                    </td>
                    {Array.from({ length: cols }, (_, c) => {
                      const ref = cellRefFromCoords(r, c);
                      const isEditable = cfg.task.editableCells.includes(ref);
                      const cellVal = cfg.initialSheetState.celldata.find(cd => cd.r === r && cd.c === c);
                      const display = cellVal?.v?.m ?? cellVal?.v?.v ?? '';
                      return (
                        <td
                          key={c}
                          className={`p-1 border-b border-r border-border cursor-pointer text-center transition-colors select-none ${
                            isEditable
                              ? 'bg-green-100 dark:bg-green-900/30 ring-1 ring-inset ring-green-500/40 font-semibold'
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => toggleEditableCell(ref)}
                          title={`${ref}${isEditable ? ' (editable)' : ''}`}
                        >
                          {display ? String(display) : <span className="text-muted-foreground/30">·</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {cfg.task.editableCells.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {cfg.task.editableCells.map(ref => (
                <Badge key={ref} variant="secondary" className="text-xs font-mono">
                  {ref}
                  <button className="ml-1 hover:text-destructive" onClick={() => toggleEditableCell(ref)}>×</button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Expectations */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="w-4 h-4" /> Expected Answers
            </CardTitle>
            <Button size="sm" variant="outline" onClick={addExpectation}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {cfg.task.expectations.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              No expectations yet. Add one to define what students should enter.
            </p>
          )}
          {cfg.task.expectations.map((exp, idx) => (
            <div key={idx} className="border border-border rounded-md p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Expectation {idx + 1}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeExpectation(idx)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Cell Reference</Label>
                  <Input
                    value={exp.cellRef}
                    onChange={e => updateExpectation(idx, { cellRef: e.target.value.toUpperCase() })}
                    placeholder="e.g. B5"
                    className="h-8 text-sm font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Expected Value</Label>
                  <Input
                    value={exp.expectedValue ?? ''}
                    onChange={e => {
                      const val = e.target.value;
                      updateExpectation(idx, { expectedValue: val === '' ? undefined : (isNaN(Number(val)) ? val : Number(val)) });
                    }}
                    placeholder="e.g. 150"
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={exp.checkFormula ?? false}
                    onCheckedChange={v => updateExpectation(idx, { checkFormula: v })}
                  />
                  <Label className="text-xs">Check Formula</Label>
                </div>
                {exp.checkFormula && (
                  <div className="flex-1 space-y-1">
                    <Input
                      value={exp.expectedFormula ?? ''}
                      onChange={e => updateExpectation(idx, { expectedFormula: e.target.value })}
                      placeholder="e.g. =SUM(B2:B4)"
                      className="h-8 text-sm font-mono"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Tolerance % <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <Input
                  type="number"
                  value={exp.tolerancePercent ?? ''}
                  onChange={e => updateExpectation(idx, { tolerancePercent: e.target.value === '' ? undefined : Number(e.target.value) })}
                  placeholder="e.g. 5"
                  className="h-8 text-sm w-24"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Hints */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="w-4 h-4" /> Hints
            </CardTitle>
            <Button size="sm" variant="outline" onClick={addHint}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-muted-foreground">Hints are revealed progressively after failed attempts.</p>
          {cfg.task.hints.map((hint, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-5 shrink-0">{idx + 1}.</span>
              <Input
                value={hint}
                onChange={e => updateHint(idx, e.target.value)}
                placeholder={`Hint ${idx + 1}`}
                className="text-sm"
              />
              {cfg.task.hints.length > 1 && (
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => removeHint(idx)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Messages & XP */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Feedback Messages & XP
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Success Message</Label>
            <Input
              value={cfg.task.successMessage}
              onChange={e => updateTask({ successMessage: e.target.value })}
              placeholder="Correct! Well done."
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Almost Correct Message</Label>
            <Input
              value={cfg.task.almostCorrectMessage ?? ''}
              onChange={e => updateTask({ almostCorrectMessage: e.target.value || undefined })}
              placeholder="Almost — check your formula."
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Incorrect Message</Label>
            <Input
              value={cfg.task.incorrectMessage ?? ''}
              onChange={e => updateTask({ incorrectMessage: e.target.value || undefined })}
              placeholder="Not quite — try again!"
              className="text-sm"
            />
          </div>
          <Separator />
          <div className="flex items-center gap-6">
            <div className="space-y-1">
              <Label className="text-xs flex items-center gap-1"><Zap className="w-3 h-3" /> XP Value</Label>
              <Input
                type="number" min={0} max={50}
                value={cfg.task.xpValue}
                onChange={e => updateTask({ xpValue: Math.min(50, parseInt(e.target.value) || 0) })}
                className="w-20 h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Bonus XP (first attempt)</Label>
              <Input
                type="number" min={0} max={25}
                value={cfg.task.bonusXp ?? 0}
                onChange={e => updateTask({ bonusXp: Math.min(25, parseInt(e.target.value) || 0) })}
                className="w-20 h-8 text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskStepEditor;
