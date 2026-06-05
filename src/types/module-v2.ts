// ═══════════════════════════════════════════════════════════════
// Base Blocks — Content
// ═══════════════════════════════════════════════════════════════

export interface TextBlock {
  type: 'text';
  content: string; // Markdown
}

export interface VideoBlock {
  type: 'video';
  url: string; // YouTube embed URL, Vimeo, or direct MP4
  caption?: string;
}

export interface ImageBlock {
  type: 'image';
  url: string;
  alt: string;
  caption?: string;
}

export interface CalloutBlock {
  type: 'callout';
  variant: 'tip' | 'warning' | 'why-it-matters' | 'reflection';
  content: string;
}

// ═══════════════════════════════════════════════════════════════
// Base Blocks — Interaction
// ═══════════════════════════════════════════════════════════════

// Re-use existing spreadsheet types where possible
export interface SheetState {
  name: string;
  celldata: CellData[];
  row?: number;
  column?: number;
  config?: Record<string, unknown>;
}

export interface CellData {
  r: number;
  c: number;
  v: {
    v?: string | number;
    m?: string;
    f?: string;
    ct?: { fa: string; t: string };
    bg?: string;
    fc?: string;
    bl?: number;
    fs?: number;
  };
}

export interface TaskExpectation {
  cellRef: string;
  expectedValue?: string | number;
  expectedFormula?: string;
  tolerancePercent?: number;
  checkFormula?: boolean;
}

export interface SpreadsheetBlock {
  type: 'spreadsheet';
  initialState: SheetState;
  editableCells: string[];
  expectations: TaskExpectation[];
}

export interface QuizQuestion {
  type: 'multiple-choice' | 'short-answer';
  options?: string[];
  correctAnswer: string;
  acceptableAnswers?: string[];
  explanation?: string;
}

export interface QuizBlock {
  type: 'quiz';
  question: QuizQuestion;
}

export type ChartType = 'bar' | 'line' | 'pie' | 'area';

export interface ChartConfig {
  type: ChartType;
  dataSource: 'sheet' | 'static';
  staticData?: { name: string; value: number }[];
  xKey?: string;
  yKey?: string;
  title?: string;
}

export interface ChartTaskExpectation {
  expectedChartType?: ChartType;
  acceptableChartTypes?: ChartType[];
  expectedXKey?: string;
  expectedYKey?: string;
}

export interface ChartBuilderBlock {
  type: 'chart-builder';
  config: ChartConfig;
  task: ChartTaskExpectation;
}

export interface TableColumn {
  key: string;
  label: string;
  type: 'text' | 'number';
}

export interface TableTaskConfig {
  columns: TableColumn[];
  data: Record<string, string | number>[];
  question: string;
  correctAnswer: string;
  acceptableAnswers?: string[];
  explanation?: string;
  enableSort?: boolean;
  enableFilter?: boolean;
}

export interface InteractiveTableBlock {
  type: 'interactive-table';
  config: TableTaskConfig;
}

// ═══════════════════════════════════════════════════════════════
// New Interactive Blocks — v2
// ═══════════════════════════════════════════════════════════════

export interface FillInBlankBlock {
  type: 'fill-blank';
  blockId: string;
  /** Use {{blank}} as placeholder, e.g. "Revenue is {{blank}} minus {{blank}}" */
  text: string;
  blanks: Array<{
    id: string;
    accepted: string[]; // case-insensitive
    hint?: string;
  }>;
}

export interface WordMatchBlock {
  type: 'word-match';
  blockId: string;
  instruction?: string;
  pairs: Array<{
    id: string;
    term: string;
    definition: string;
  }>;
}

export interface DragSortBlock {
  type: 'drag-sort';
  blockId: string;
  instruction: string;
  items: Array<{
    id: string;
    label: string;
    correctPosition: number; // 1-based
    group?: string;
  }>;
  mode: 'order' | 'group';
}

export interface ImageHotspotBlock {
  type: 'image-hotspot';
  blockId: string;
  imageUrl: string;
  imageAlt: string;
  hotspots: Array<{
    id: string;
    x: number; // percentage from left (0–100)
    y: number; // percentage from top (0–100)
    label: string;
    revealText?: string;
    question?: string;
    accepted?: string[];
  }>;
}

export interface FlashcardBlock {
  type: 'flashcard';
  blockId: string;
  instruction?: string;
  cards: Array<{
    id: string;
    front: string;
    back: string;
  }>;
}

export interface TrueFalseBlock {
  type: 'true-false';
  blockId: string;
  statement: string;
  correct: boolean;
  explanation: string;
}

export interface LabelDiagramBlock {
  type: 'label-diagram';
  blockId: string;
  imageUrl: string;
  imageAlt: string;
  labels: Array<{ id: string; text: string }>;
  slots: Array<{
    id: string;
    x: number; // percentage from left
    y: number; // percentage from top
    correctLabelId: string;
  }>;
}

export interface SequenceBlock {
  type: 'sequence';
  blockId: string;
  instruction: string;
  items: Array<{
    id: string;
    label: string;
    correctIndex: number; // 0-based
  }>;
}

export interface CrosswordBlock {
  type: 'crossword';
  blockId: string;
  clues: Array<{
    word: string;    // uppercase, no spaces
    clue: string;
    direction: 'across' | 'down';
    row: number;     // 0-based grid row for first letter
    col: number;     // 0-based grid col for first letter
  }>;
}

export type StepBlock =
  | TextBlock
  | VideoBlock
  | ImageBlock
  | CalloutBlock
  | SpreadsheetBlock
  | QuizBlock
  | ChartBuilderBlock
  | InteractiveTableBlock
  | FillInBlankBlock
  | WordMatchBlock
  | DragSortBlock
  | ImageHotspotBlock
  | FlashcardBlock
  | TrueFalseBlock
  | LabelDiagramBlock
  | SequenceBlock
  | CrosswordBlock;

// ═══════════════════════════════════════════════════════════════
// Scoring & Feedback
// ═══════════════════════════════════════════════════════════════

export type FeedbackType = 'correct' | 'almost' | 'incorrect';

export interface CheckResult {
  type: FeedbackType;
  message: string;
  details?: string[];
}

export interface StepScoringConfig {
  xpValue: number;
  bonusXp?: number;
  hints: string[];
  successMessage: string;
  almostCorrectMessage?: string;
  incorrectMessage?: string;
}

export interface StepScore {
  xp: number;
  accuracy: number; // 0-100
}

// ═══════════════════════════════════════════════════════════════
// Competency & Outcome Tracking
// ═══════════════════════════════════════════════════════════════

export interface Competency {
  id: string;
  name: string;
  description: string;
  parentId?: string; // Hierarchical: e.g. 'excel' → 'excel.formulas' → 'excel.formulas.sum'
}

export interface StepOutcome {
  competencyId: string;
  level: 'introduced' | 'practised' | 'mastered';
}

export interface CompetencyProgress {
  competencyId: string;
  level: 0 | 1 | 2 | 3; // none → introduced → practised → mastered
  evidenceCount: number;
  lastUpdated: string;
}

// ═══════════════════════════════════════════════════════════════
// Step, Lesson, Module
// ═══════════════════════════════════════════════════════════════

export type StepLayout =
  | 'instruction-full'      // Text/media only
  | 'split-left-instruction' // Instructions left, workspace right
  | 'split-right-instruction'// Workspace left, instructions right
  | 'stacked'               // Instruction top, workspace bottom
  | 'workspace-full';       // Immersive workspace (sims, games)

export interface Step {
  id: string;
  order: number;
  title: string;
  layout: StepLayout;
  blocks: StepBlock[];
  outcomes?: StepOutcome[];
  scoring?: StepScoringConfig;
}

export interface Lesson {
  id: string;
  order: number;
  title: string;
  description: string;
  steps: Step[];
  prerequisites?: string[]; // Lesson IDs that must be completed first
}

export interface Module {
  id: string;
  title: string;
  description: string;
  topic?: string; // e.g. 'excel', 'computer-literacy', 'charts'
  estimatedMinutes: number;
  bannerUrl?: string;
  lessons: Lesson[];
  competencies: Competency[];
}

// ═══════════════════════════════════════════════════════════════
// Progress (Server-side shape)
// ═══════════════════════════════════════════════════════════════

export interface StepCompletion {
  stepId: string;
  lessonId: string;
  moduleId: string;
  completedAt: string;
  attemptCount: number;
  timeOnStepSeconds: number;
  xpEarned: number;
  accuracyScore: number;
  competencyIds: string[];
}

export interface ModuleProgress {
  moduleId: string;
  completedLessonIds: string[];
  completedStepIds: string[];
  totalXp: number;
  accuracyAverage: number | null;
  totalTimeSeconds: number;
}

export interface LessonProgress {
  lessonId: string;
  completedStepIds: string[];
  currentStepId: string;
  totalXp: number;
  attempts: Record<string, number>; // stepId → count
}
