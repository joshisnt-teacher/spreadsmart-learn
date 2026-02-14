export interface CellData {
  r: number; // row
  c: number; // column
  v: {
    v?: string | number; // value
    m?: string; // display value
    f?: string; // formula
    ct?: { fa: string; t: string }; // cell type
    bg?: string; // background
    fc?: string; // font color
    bl?: number; // bold
    fs?: number; // font size
  };
}

export interface SheetState {
  name: string;
  celldata: CellData[];
  row?: number;
  column?: number;
  config?: Record<string, unknown>;
}

export interface TaskExpectation {
  cellRef: string; // e.g. "B5"
  expectedValue?: string | number;
  expectedFormula?: string; // e.g. "=SUM(B2:B4)"
  tolerancePercent?: number;
  checkFormula?: boolean;
}

export interface TaskDefinition {
  id: string;
  expectations: TaskExpectation[];
  editableCells: string[]; // e.g. ["B5", "C5"]
  hints: string[];
  successMessage: string;
  almostCorrectMessage?: string;
  incorrectMessage?: string;
  xpValue: number;
  bonusXp?: number; // first-attempt bonus
}

export type ChartType = 'bar' | 'line' | 'pie' | 'area';

export interface ChartConfig {
  type: ChartType;
  dataSource: 'sheet' | 'static';
  staticData?: { name: string; value: number }[];
  xKey?: string; // column header for X axis
  yKey?: string; // column header for Y axis
  title?: string;
}

export interface ChartTaskExpectation {
  expectedChartType?: ChartType;
  expectedXKey?: string;
  expectedYKey?: string;
}

export interface Step {
  id: string;
  order: number;
  title: string;
  instruction: string;
  type?: 'instruction' | 'task' | 'challenge' | 'chart';
  whyItMatters?: string;
  mediaUrl?: string;
  initialSheetState?: SheetState;
  task?: TaskDefinition;
  chartConfig?: ChartConfig;
  chartTask?: ChartTaskExpectation;
}

export interface Lesson {
  id: string;
  order: number;
  title: string;
  description: string;
  steps: Step[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  lessons: Lesson[];
}

export type FeedbackType = 'correct' | 'almost' | 'incorrect';

export interface CheckResult {
  type: FeedbackType;
  message: string;
  details?: string[];
}

export interface LessonProgress {
  lessonId: string;
  completedStepIds: string[];
  currentStepId: string;
  totalXp: number;
  attempts: Record<string, number>; // stepId -> attempt count
}
