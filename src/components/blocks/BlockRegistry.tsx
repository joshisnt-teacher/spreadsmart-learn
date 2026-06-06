/**
 * Block Registry
 *
 * Maps block types to React renderers.
 * Adding a new block type is a one-line change here.
 */
import React from 'react';
import type { StepBlock, CheckResult, StepScoringConfig } from '@/types/module-v2';
import { TextBlockRenderer } from './TextBlockRenderer';
import { VideoBlockRenderer } from './VideoBlockRenderer';
import { ImageBlockRenderer } from './ImageBlockRenderer';
import { CalloutBlockRenderer } from './CalloutBlockRenderer';
import { SpreadsheetBlockRenderer } from './SpreadsheetBlockRenderer';
import { QuizBlockRenderer } from './QuizBlockRenderer';
import { TrueFalseRenderer } from './TrueFalseRenderer';
import { FillInBlankRenderer } from './FillInBlankRenderer';
import { WordMatchRenderer } from './WordMatchRenderer';
import { FlashcardRenderer } from './FlashcardRenderer';
import { DragSortRenderer } from './DragSortRenderer';
import { SequenceRenderer } from './SequenceRenderer';
import { ImageHotspotRenderer } from './ImageHotspotRenderer';
import { LabelDiagramRenderer } from './LabelDiagramRenderer';

export interface BlockResponseParams {
  blockId: string;
  blockType: string;
  correct: boolean;
  answer: unknown;
}

export interface BlockContext {
  stepId: string;
  lessonId: string;
  moduleId: string;
  onCheck?: (result: CheckResult) => void;        // v1 compat
  onResponse?: (params: BlockResponseParams) => void; // v2
  scoring?: StepScoringConfig;
}

interface BlockRendererEntry {
  component: React.FC<{ block: any; context: BlockContext }>;
  /** If true, the block owns its own workspace area (used by layout engine) */
  isWorkspace?: boolean;
}

const registry: Record<string, BlockRendererEntry> = {
  text: { component: TextBlockRenderer },
  video: { component: VideoBlockRenderer },
  image: { component: ImageBlockRenderer },
  callout: { component: CalloutBlockRenderer },
  spreadsheet: { component: SpreadsheetBlockRenderer, isWorkspace: true },
  quiz: { component: QuizBlockRenderer },
  'true-false': { component: TrueFalseRenderer, isWorkspace: true },
  'fill-blank': { component: FillInBlankRenderer, isWorkspace: true },
  'word-match': { component: WordMatchRenderer, isWorkspace: true },
  'flashcard': { component: FlashcardRenderer, isWorkspace: true },
  'drag-sort': { component: DragSortRenderer, isWorkspace: true },
  'sequence': { component: SequenceRenderer, isWorkspace: true },
  'image-hotspot': { component: ImageHotspotRenderer, isWorkspace: true },
  'label-diagram': { component: LabelDiagramRenderer, isWorkspace: true },
  // TODO: chart-builder, interactive-table, external-tool
};

export function renderBlock(
  block: StepBlock,
  context: BlockContext,
  key?: string | number
): React.ReactNode {
  const entry = registry[block.type];
  if (!entry) {
    return (
      <div
        key={key}
        className="p-4 border border-dashed border-destructive rounded-lg text-destructive text-sm"
      >
        Unknown block type: <code>{block.type}</code>
      </div>
    );
  }

  const Component = entry.component;
  return <Component key={key} block={block} context={context} />;
}

export function getWorkspaceBlocks(blocks: StepBlock[]): StepBlock[] {
  return blocks.filter((b) => registry[b.type]?.isWorkspace);
}

export function getInstructionBlocks(blocks: StepBlock[]): StepBlock[] {
  return blocks.filter((b) => !registry[b.type]?.isWorkspace);
}
