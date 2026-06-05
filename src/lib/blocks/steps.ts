import type { Step, StepBlock, StepLayout, StepScoringConfig, StepOutcome } from '@/types/module-v2';

const id = () => crypto.randomUUID();

export function instructionStep(options: {
  title: string;
  blocks: StepBlock[];
  layout?: StepLayout;
  outcomes?: StepOutcome[];
}): Step {
  return {
    id: id(),
    order: 0, // assembler sets final order
    title: options.title,
    layout: options.layout ?? 'instruction-full',
    blocks: options.blocks,
    outcomes: options.outcomes,
  };
}

export function interactiveStep(options: {
  title: string;
  blocks: StepBlock[];
  layout?: StepLayout;
  scoring?: StepScoringConfig;
  outcomes?: StepOutcome[];
}): Step {
  return {
    id: id(),
    order: 0,
    title: options.title,
    layout: options.layout ?? 'stacked',
    blocks: options.blocks,
    scoring: options.scoring,
    outcomes: options.outcomes,
  };
}
