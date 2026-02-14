import type { Module, Lesson, Step, QuizQuestion, TaskDefinition, TableTaskConfig, ChartConfig, ChartTaskExpectation, SheetState } from '@/types/lesson';

interface DbStep {
  id: string;
  order: number;
  type: string;
  title: string;
  instruction: string;
  why_it_matters: string | null;
  config: Record<string, unknown>;
}

interface DbLesson {
  id: string;
  order: number;
  title: string;
  description: string;
  custom_steps: DbStep[];
}

interface DbModule {
  id: string;
  title: string;
  description: string;
  estimated_minutes: number;
  status: string;
  teacher_id: string;
  custom_lessons: DbLesson[];
}

function transformStep(db: DbStep): Step {
  const cfg = db.config ?? {};
  const step: Step = {
    id: db.id,
    order: db.order,
    title: db.title,
    instruction: db.instruction,
    type: (db.type as Step['type']) ?? 'instruction',
    whyItMatters: db.why_it_matters ?? undefined,
  };

  if (cfg.initialSheetState) step.initialSheetState = cfg.initialSheetState as SheetState;
  if (cfg.task) step.task = cfg.task as TaskDefinition;
  if (cfg.quiz) step.quiz = cfg.quiz as QuizQuestion;
  if (cfg.tableTask) step.tableTask = cfg.tableTask as TableTaskConfig;
  if (cfg.chartConfig) step.chartConfig = cfg.chartConfig as ChartConfig;
  if (cfg.chartTask) step.chartTask = cfg.chartTask as ChartTaskExpectation;

  return step;
}

function transformLesson(db: DbLesson): Lesson {
  return {
    id: db.id,
    order: db.order,
    title: db.title,
    description: db.description,
    steps: (db.custom_steps ?? [])
      .sort((a, b) => a.order - b.order)
      .map(transformStep),
  };
}

export function transformDbModule(db: DbModule): Module {
  return {
    id: db.id,
    title: db.title,
    description: db.description,
    estimatedMinutes: db.estimated_minutes,
    bannerUrl: (db as any).banner_url ?? undefined,
    lessons: (db.custom_lessons ?? [])
      .sort((a, b) => a.order - b.order)
      .map(transformLesson),
  };
}

/** Convert a Step back to the DB config shape for saving */
export function stepToConfig(step: Partial<Step>): Record<string, unknown> {
  const config: Record<string, unknown> = {};
  if (step.initialSheetState) config.initialSheetState = step.initialSheetState;
  if (step.task) config.task = step.task;
  if (step.quiz) config.quiz = step.quiz;
  if (step.tableTask) config.tableTask = step.tableTask;
  if (step.chartConfig) config.chartConfig = step.chartConfig;
  if (step.chartTask) config.chartTask = step.chartTask;
  return config;
}
