import type {
  FillInBlankBlock, WordMatchBlock, DragSortBlock, ImageHotspotBlock,
  FlashcardBlock, TrueFalseBlock, LabelDiagramBlock, SequenceBlock,
  CrosswordBlock, TextBlock, CalloutBlock, VideoBlock, ImageBlock,
} from '@/types/module-v2';

const id = () => crypto.randomUUID();

export function fillInBlank(options: {
  text: string;
  blanks: Array<{ accepted: string[]; hint?: string }>;
}): FillInBlankBlock {
  return {
    type: 'fill-blank',
    blockId: id(),
    text: options.text,
    blanks: options.blanks.map(b => ({ id: id(), ...b })),
  };
}

export function wordMatch(options: {
  pairs: Array<{ term: string; definition: string }>;
  instruction?: string;
}): WordMatchBlock {
  return {
    type: 'word-match',
    blockId: id(),
    instruction: options.instruction,
    pairs: options.pairs.map(p => ({ id: id(), ...p })),
  };
}

export function dragSort(options: {
  instruction: string;
  items: Array<{ label: string; correctPosition: number; group?: string }>;
  mode?: 'order' | 'group';
}): DragSortBlock {
  return {
    type: 'drag-sort',
    blockId: id(),
    instruction: options.instruction,
    mode: options.mode ?? 'order',
    items: options.items.map(item => ({ id: id(), ...item })),
  };
}

export function imageHotspot(options: {
  imageUrl: string;
  imageAlt: string;
  hotspots: Array<{
    x: number; y: number; label: string;
    revealText?: string; question?: string; accepted?: string[];
  }>;
}): ImageHotspotBlock {
  return {
    type: 'image-hotspot',
    blockId: id(),
    imageUrl: options.imageUrl,
    imageAlt: options.imageAlt,
    hotspots: options.hotspots.map(h => ({ id: id(), ...h })),
  };
}

export function flashcards(options: {
  cards: Array<{ front: string; back: string }>;
  instruction?: string;
}): FlashcardBlock {
  return {
    type: 'flashcard',
    blockId: id(),
    instruction: options.instruction,
    cards: options.cards.map(c => ({ id: id(), ...c })),
  };
}

export function trueFalse(options: {
  statement: string;
  correct: boolean;
  explanation: string;
}): TrueFalseBlock {
  return { type: 'true-false', blockId: id(), ...options };
}

export function labelDiagram(options: {
  imageUrl: string;
  imageAlt: string;
  labels: Array<{ text: string }>;
  slots: Array<{ x: number; y: number; correctLabelIndex: number }>;
}): LabelDiagramBlock {
  const labels = options.labels.map(l => ({ id: id(), text: l.text }));
  return {
    type: 'label-diagram',
    blockId: id(),
    imageUrl: options.imageUrl,
    imageAlt: options.imageAlt,
    labels,
    slots: options.slots.map(s => ({
      id: id(),
      x: s.x,
      y: s.y,
      correctLabelId: labels[s.correctLabelIndex].id,
    })),
  };
}

export function sequence(options: {
  instruction: string;
  items: Array<{ label: string; correctIndex: number }>;
}): SequenceBlock {
  return {
    type: 'sequence',
    blockId: id(),
    instruction: options.instruction,
    items: options.items.map(item => ({ id: id(), ...item })),
  };
}

export function crossword(options: {
  clues: Array<{
    word: string; clue: string;
    direction: 'across' | 'down'; row: number; col: number;
  }>;
}): CrosswordBlock {
  return { type: 'crossword', blockId: id(), clues: options.clues };
}

// Content block helpers
export function text(content: string): TextBlock {
  return { type: 'text', content };
}

export function callout(options: {
  variant: 'tip' | 'warning' | 'why-it-matters' | 'reflection';
  content: string;
}): CalloutBlock {
  return { type: 'callout', ...options };
}

export function video(url: string, caption?: string): VideoBlock {
  return { type: 'video', url, caption };
}

export function image(url: string, alt: string, caption?: string): ImageBlock {
  return { type: 'image', url, alt, caption };
}
