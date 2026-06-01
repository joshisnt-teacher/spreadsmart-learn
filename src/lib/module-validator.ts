/**
 * Module Validator (Zod)
 *
 * Validates JSON/YAML module definitions at build time and runtime.
 * Ensures modules are structurally correct before they reach the player.
 */
import { z } from 'zod';

// ── Re-use existing primitives where possible ─────────────────

const CellDataSchema = z.object({
  r: z.number().int(),
  c: z.number().int(),
  v: z.record(z.any()),
});

const SheetStateSchema = z.object({
  name: z.string(),
  celldata: z.array(CellDataSchema),
  row: z.number().int().optional(),
  column: z.number().int().optional(),
  config: z.record(z.unknown()).optional(),
});

const TaskExpectationSchema = z.object({
  cellRef: z.string(),
  expectedValue: z.union([z.string(), z.number()]).optional(),
  expectedFormula: z.string().optional(),
  tolerancePercent: z.number().optional(),
  checkFormula: z.boolean().optional(),
});

const QuizQuestionSchema = z.object({
  type: z.enum(['multiple-choice', 'short-answer']),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string(),
  acceptableAnswers: z.array(z.string()).optional(),
  explanation: z.string().optional(),
});

const ChartTypeSchema = z.enum(['bar', 'line', 'pie', 'area']);

const ChartConfigSchema = z.object({
  type: ChartTypeSchema,
  dataSource: z.enum(['sheet', 'static']),
  staticData: z.array(z.object({ name: z.string(), value: z.number() })).optional(),
  xKey: z.string().optional(),
  yKey: z.string().optional(),
  title: z.string().optional(),
});

const ChartTaskExpectationSchema = z.object({
  expectedChartType: ChartTypeSchema.optional(),
  acceptableChartTypes: z.array(ChartTypeSchema).optional(),
  expectedXKey: z.string().optional(),
  expectedYKey: z.string().optional(),
});

const TableColumnSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: z.enum(['text', 'number']),
});

const TableTaskConfigSchema = z.object({
  columns: z.array(TableColumnSchema),
  data: z.array(z.record(z.union([z.string(), z.number()]))),
  question: z.string(),
  correctAnswer: z.string(),
  acceptableAnswers: z.array(z.string()).optional(),
  explanation: z.string().optional(),
  enableSort: z.boolean().optional(),
  enableFilter: z.boolean().optional(),
});

// ── Blocks ────────────────────────────────────────────────────

const TextBlockSchema = z.object({
  type: z.literal('text'),
  content: z.string().min(1),
});

const VideoBlockSchema = z.object({
  type: z.literal('video'),
  url: z.string().url(),
  caption: z.string().optional(),
});

const ImageBlockSchema = z.object({
  type: z.literal('image'),
  url: z.string().url(),
  alt: z.string(),
  caption: z.string().optional(),
});

const CalloutBlockSchema = z.object({
  type: z.literal('callout'),
  variant: z.enum(['tip', 'warning', 'why-it-matters', 'reflection']),
  content: z.string(),
});

const SpreadsheetBlockSchema = z.object({
  type: z.literal('spreadsheet'),
  initialState: SheetStateSchema,
  editableCells: z.array(z.string()),
  expectations: z.array(TaskExpectationSchema),
});

const QuizBlockSchema = z.object({
  type: z.literal('quiz'),
  question: QuizQuestionSchema,
});

const ChartBuilderBlockSchema = z.object({
  type: z.literal('chart-builder'),
  config: ChartConfigSchema,
  task: ChartTaskExpectationSchema,
});

const InteractiveTableBlockSchema = z.object({
  type: z.literal('interactive-table'),
  config: TableTaskConfigSchema,
});

const ExternalToolBlockSchema = z.object({
  type: z.literal('external-tool'),
  toolId: z.string().min(1),
  config: z.record(z.unknown()),
});

const StepBlockSchema = z.union([
  TextBlockSchema,
  VideoBlockSchema,
  ImageBlockSchema,
  CalloutBlockSchema,
  SpreadsheetBlockSchema,
  QuizBlockSchema,
  ChartBuilderBlockSchema,
  InteractiveTableBlockSchema,
  ExternalToolBlockSchema,
]);

// ── Step, Lesson, Module ──────────────────────────────────────

const StepLayoutSchema = z.enum([
  'instruction-full',
  'split-left-instruction',
  'split-right-instruction',
  'stacked',
  'workspace-full',
]);

const StepOutcomeSchema = z.object({
  competencyId: z.string(),
  level: z.enum(['introduced', 'practised', 'mastered']),
});

const StepScoringConfigSchema = z.object({
  xpValue: z.number().int().min(0),
  bonusXp: z.number().int().min(0).optional(),
  hints: z.array(z.string()),
  successMessage: z.string(),
  almostCorrectMessage: z.string().optional(),
  incorrectMessage: z.string().optional(),
});

const StepSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().min(0),
  title: z.string().min(1),
  layout: StepLayoutSchema,
  blocks: z.array(StepBlockSchema).min(1, 'Every step needs at least one block'),
  outcomes: z.array(StepOutcomeSchema).optional(),
  scoring: StepScoringConfigSchema.optional(),
});

const LessonSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().min(0),
  title: z.string().min(1),
  description: z.string(),
  steps: z.array(StepSchema).min(1),
  prerequisites: z.array(z.string()).optional(),
});

const CompetencySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  parentId: z.string().optional(),
});

export const ModuleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  topic: z.string().min(1),
  estimatedMinutes: z.number().int().min(1),
  bannerUrl: z.string().url().optional(),
  lessons: z.array(LessonSchema).min(1),
  competencies: z.array(CompetencySchema),
});

// ── Validation helpers ────────────────────────────────────────

export type ValidatedModule = z.infer<typeof ModuleSchema>;

export function validateModule(data: unknown): ValidatedModule {
  return ModuleSchema.parse(data);
}

export function validateModuleSafe(data: unknown): { success: true; data: ValidatedModule } | { success: false; errors: z.ZodError } {
  const result = ModuleSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}
