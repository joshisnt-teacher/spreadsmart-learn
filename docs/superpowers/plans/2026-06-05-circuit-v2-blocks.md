# Circuit v2 Block System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the v2 block-based module system with 9 interactive block types, DB-first module loading, factory functions for AI-authored modules, and student response storage.

**Architecture:** Promote `module-v2.ts` to the live type system with 9 new interactive block types. Modules are stored in Supabase (`custom_modules`/`custom_steps`) and loaded DB-first by `ModulePlayer`; existing hardcoded TypeScript modules continue working as a fallback. Student responses are stored in a new `block_responses` table via `useBlockResponse`. A new `V2LessonPlayer` handles v2 lessons using `StepLayoutEngine` + `BlockRegistry`.

**Tech Stack:** React 18, TypeScript, Vite, Supabase, Tailwind CSS, shadcn/ui, Framer Motion, Vitest + @testing-library/react

**Spec:** `docs/superpowers/specs/2026-06-05-circuit-v2-blocks-design.md`

---

## File Map

| File | Action |
|---|---|
| `src/types/module-v2.ts` | Modify — add 9 new block types, make `topic` optional |
| `src/lib/blocks/factories.ts` | Create — one factory function per block type |
| `src/lib/blocks/steps.ts` | Create — instructionStep + interactiveStep helpers |
| `src/lib/blocks/assembler.ts` | Create — publishModule writes to Supabase |
| `src/hooks/useBlockResponse.ts` | Create — writes to block_responses + step_events |
| `src/hooks/useCustomModule.ts` | Create — fetches v2 module from Supabase |
| `src/components/blocks/BlockRegistry.tsx` | Modify — add BlockResponseParams + onResponse to BlockContext |
| `src/components/blocks/TrueFalseRenderer.tsx` | Create |
| `src/components/blocks/FillInBlankRenderer.tsx` | Create |
| `src/components/blocks/WordMatchRenderer.tsx` | Create |
| `src/components/blocks/FlashcardRenderer.tsx` | Create |
| `src/components/blocks/DragSortRenderer.tsx` | Create |
| `src/components/blocks/SequenceRenderer.tsx` | Create |
| `src/components/blocks/ImageHotspotRenderer.tsx` | Create |
| `src/components/blocks/LabelDiagramRenderer.tsx` | Create |
| `src/components/blocks/CrosswordRenderer.tsx` | Create |
| `src/components/blocks/__tests__/TrueFalseRenderer.test.tsx` | Create |
| `src/components/blocks/__tests__/FillInBlankRenderer.test.tsx` | Create |
| `src/components/blocks/__tests__/WordMatchRenderer.test.tsx` | Create |
| `src/components/blocks/__tests__/SequenceRenderer.test.tsx` | Create |
| `src/components/V2LessonPlayer.tsx` | Create |
| `src/pages/ModulePlayer.tsx` | Modify — DB-first module loading |
| `docs/circuit/MODULE-AUTHORING.md` | Create — AI authoring guide |

---

## Task 1: Extend module-v2.ts with 9 new block types

**Files:**
- Modify: `src/types/module-v2.ts`

- [ ] **Step 1: Add new block type interfaces and update the union**

Open `src/types/module-v2.ts`. Remove the "PROPOSAL" comment at the top. Make `topic` optional on `Module`. Add the following after the `InteractiveTableBlock` interface and before the `StepBlock` union:

```typescript
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
```

- [ ] **Step 2: Update the StepBlock union and Module type**

Replace the existing `StepBlock` union and `Module` interface `topic` field:

```typescript
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
```

In the `Module` interface, change `topic: string` to `topic?: string`.

- [ ] **Step 3: Run TypeScript check**

```bash
cd C:/Users/joshu/CodingProjects/Edufied/spreadsmart-learn
npx tsc --noEmit
```

Expected: no errors related to module-v2.ts.

- [ ] **Step 4: Commit**

```bash
git add src/types/module-v2.ts
git commit -m "feat(types): promote module-v2.ts with 9 new interactive block types"
```

---

## Task 2: Supabase migration — block_responses + layout column

**Files:**
- Supabase migration (applied via MCP or CLI)
- Modify: `src/integrations/supabase/types.ts` (regenerated)

- [ ] **Step 1: Apply migration via Supabase MCP**

Run the following SQL using the `mcp__supabase__apply_migration` tool (or Supabase dashboard SQL editor):

```sql
-- Add layout column to custom_steps
alter table public.custom_steps
  add column if not exists layout text not null default 'instruction-full';

-- Create block_responses table
create table if not exists public.block_responses (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null,
  module_id      text not null,
  lesson_id      text not null,
  step_id        text not null,
  block_id       text not null,
  block_type     text not null,
  correct        boolean not null,
  answer         jsonb,
  attempt_number integer not null default 1,
  created_at     timestamptz not null default now()
);

-- RLS
alter table public.block_responses enable row level security;

create policy "Students insert own block responses"
  on public.block_responses for insert
  with check (auth.uid() = user_id);

create policy "Teachers read their students block responses"
  on public.block_responses for select
  using (
    exists (
      select 1
      from public.class_students cs
      join public.classes c on c.id = cs.class_id
      where cs.student_user_id = block_responses.user_id
        and c.teacher_id = auth.uid()
    )
  );
```

- [ ] **Step 2: Regenerate Supabase types**

```bash
npx supabase gen types typescript --project-id <your-project-id> > src/integrations/supabase/types.ts
```

If CLI unavailable, manually add `block_responses` and the `layout` column to `src/integrations/supabase/types.ts` following the existing pattern:

```typescript
block_responses: {
  Row: {
    id: string
    user_id: string
    module_id: string
    lesson_id: string
    step_id: string
    block_id: string
    block_type: string
    correct: boolean
    answer: Json | null
    attempt_number: number
    created_at: string
  }
  Insert: {
    id?: string
    user_id: string
    module_id: string
    lesson_id: string
    step_id: string
    block_id: string
    block_type: string
    correct: boolean
    answer?: Json | null
    attempt_number?: number
    created_at?: string
  }
  Update: {
    correct?: boolean
    answer?: Json | null
  }
  Relationships: []
}
```

Also add `layout: string` to `custom_steps.Row` and `layout?: string` to `custom_steps.Insert`.

- [ ] **Step 3: Commit**

```bash
git add src/integrations/supabase/types.ts
git commit -m "feat(db): add block_responses table and layout column on custom_steps"
```

---

## Task 3: Block factory functions

**Files:**
- Create: `src/lib/blocks/factories.ts`

- [ ] **Step 1: Create the factories file**

Create `src/lib/blocks/factories.ts`:

```typescript
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
```

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/blocks/factories.ts
git commit -m "feat(blocks): add factory functions for all block types"
```

---

## Task 4: Step and module assembler

**Files:**
- Create: `src/lib/blocks/steps.ts`
- Create: `src/lib/blocks/assembler.ts`

- [ ] **Step 1: Create steps.ts**

Create `src/lib/blocks/steps.ts`:

```typescript
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
```

- [ ] **Step 2: Create assembler.ts**

Create `src/lib/blocks/assembler.ts`:

```typescript
import { supabase } from '@/integrations/supabase/client';
import type { Step } from '@/types/module-v2';

export interface ModuleMeta {
  title: string;
  description: string;
  estimatedMinutes: number;
  bannerUrl?: string;
}

export interface LessonDef {
  title: string;
  description: string;
  steps: Step[];
}

/**
 * Publishes a complete module to Supabase.
 * Inserts custom_modules → custom_lessons → custom_steps in order.
 * Requires an authenticated teacher session.
 */
export async function publishModule(
  meta: ModuleMeta,
  lessonDefs: LessonDef[],
): Promise<{ moduleId: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated — publishModule requires a signed-in teacher');

  const { data: mod, error: modError } = await supabase
    .from('custom_modules')
    .insert({
      title: meta.title,
      description: meta.description,
      estimated_minutes: meta.estimatedMinutes,
      banner_url: meta.bannerUrl ?? null,
      teacher_id: user.id,
      status: 'published',
    })
    .select('id')
    .single();

  if (modError || !mod) throw new Error(modError?.message ?? 'Failed to create module');

  for (let li = 0; li < lessonDefs.length; li++) {
    const lessonDef = lessonDefs[li];

    const { data: lesson, error: lessonError } = await supabase
      .from('custom_lessons')
      .insert({
        module_id: mod.id,
        title: lessonDef.title,
        description: lessonDef.description,
        order: li + 1,
      })
      .select('id')
      .single();

    if (lessonError || !lesson) throw new Error(lessonError?.message ?? `Failed to create lesson ${li + 1}`);

    const stepRows = lessonDef.steps.map((step, si) => ({
      lesson_id: lesson.id,
      title: step.title,
      layout: step.layout ?? 'instruction-full',
      order: si + 1,
      type: 'v2',
      instruction: '',
      config: { blocks: step.blocks, scoring: step.scoring ?? null },
    }));

    const { error: stepError } = await supabase.from('custom_steps').insert(stepRows);
    if (stepError) throw new Error(stepError.message);
  }

  return { moduleId: mod.id };
}
```

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/blocks/steps.ts src/lib/blocks/assembler.ts
git commit -m "feat(blocks): add step helpers and publishModule assembler"
```

---

## Task 5: useBlockResponse hook

**Files:**
- Create: `src/hooks/useBlockResponse.ts`

- [ ] **Step 1: Create useBlockResponse.ts**

Create `src/hooks/useBlockResponse.ts`:

```typescript
import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface SubmitParams {
  moduleId: string;
  lessonId: string;
  stepId: string;
  blockId: string;
  blockType: string;
  correct: boolean;
  answer: unknown;
  attemptNumber: number;
}

export function useBlockResponse() {
  const { user } = useAuth();

  const submitResponse = useCallback(async (params: SubmitParams) => {
    if (!user?.id) return;

    await supabase.from('block_responses').insert({
      user_id: user.id,
      module_id: params.moduleId,
      lesson_id: params.lessonId,
      step_id: params.stepId,
      block_id: params.blockId,
      block_type: params.blockType,
      correct: params.correct,
      answer: params.answer as Record<string, unknown>,
      attempt_number: params.attemptNumber,
    });

    await supabase.from('step_events').insert({
      user_id: user.id,
      module_id: params.moduleId,
      lesson_id: params.lessonId,
      step_id: params.stepId,
      event_type: `${params.blockType}:submit`,
      metadata: {
        block_id: params.blockId,
        correct: params.correct,
        answer: params.answer,
        attempt_number: params.attemptNumber,
      },
    });
  }, [user?.id]);

  return { submitResponse };
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useBlockResponse.ts
git commit -m "feat(hooks): add useBlockResponse for block_responses + step_events writes"
```

---

## Task 6: Update BlockRegistry with onResponse

**Files:**
- Modify: `src/components/blocks/BlockRegistry.tsx`

- [ ] **Step 1: Add BlockResponseParams and onResponse to BlockContext**

Replace the `BlockContext` interface in `src/components/blocks/BlockRegistry.tsx`:

```typescript
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
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors — existing renderers don't use `onResponse` so adding it is non-breaking.

- [ ] **Step 3: Commit**

```bash
git add src/components/blocks/BlockRegistry.tsx
git commit -m "feat(blocks): add BlockResponseParams and onResponse to BlockContext"
```

---

## Task 7: TrueFalseRenderer

**Files:**
- Create: `src/components/blocks/__tests__/TrueFalseRenderer.test.tsx`
- Create: `src/components/blocks/TrueFalseRenderer.tsx`
- Modify: `src/components/blocks/BlockRegistry.tsx`

- [ ] **Step 1: Write failing test**

Create `src/components/blocks/__tests__/TrueFalseRenderer.test.tsx`:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TrueFalseRenderer } from '../TrueFalseRenderer';
import type { TrueFalseBlock } from '@/types/module-v2';
import type { BlockContext } from '../BlockRegistry';

const block: TrueFalseBlock = {
  type: 'true-false',
  blockId: 'tf-1',
  statement: 'A business with high revenue always makes a profit.',
  correct: false,
  explanation: 'Revenue is income; profit is revenue minus costs.',
};

const ctx: BlockContext = { stepId: 's1', lessonId: 'l1', moduleId: 'm1' };

describe('TrueFalseRenderer', () => {
  it('renders the statement', () => {
    render(<TrueFalseRenderer block={block} context={ctx} />);
    expect(screen.getByText(/high revenue always makes a profit/i)).toBeTruthy();
  });

  it('calls onResponse with correct:false when student picks False on a false statement', () => {
    const onResponse = vi.fn();
    render(<TrueFalseRenderer block={block} context={{ ...ctx, onResponse }} />);
    fireEvent.click(screen.getByRole('button', { name: /false/i }));
    expect(onResponse).toHaveBeenCalledWith({
      blockId: 'tf-1',
      blockType: 'true-false',
      correct: true,
      answer: false,
    });
  });

  it('calls onResponse with correct:false when student picks True on a false statement', () => {
    const onResponse = vi.fn();
    render(<TrueFalseRenderer block={block} context={{ ...ctx, onResponse }} />);
    fireEvent.click(screen.getByRole('button', { name: /true/i }));
    expect(onResponse).toHaveBeenCalledWith(
      expect.objectContaining({ correct: false })
    );
  });

  it('shows explanation after answering', () => {
    render(<TrueFalseRenderer block={block} context={ctx} />);
    fireEvent.click(screen.getByRole('button', { name: /false/i }));
    expect(screen.getByText(/revenue is income/i)).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx vitest run src/components/blocks/__tests__/TrueFalseRenderer.test.tsx
```

Expected: FAIL — `TrueFalseRenderer` not found.

- [ ] **Step 3: Implement TrueFalseRenderer**

Create `src/components/blocks/TrueFalseRenderer.tsx`:

```typescript
import React, { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TrueFalseBlock } from '@/types/module-v2';
import type { BlockContext } from './BlockRegistry';

interface Props {
  block: TrueFalseBlock;
  context: BlockContext;
}

export const TrueFalseRenderer: React.FC<Props> = ({ block, context }) => {
  const [answered, setAnswered] = useState<boolean | null>(null);

  const handleAnswer = (chosen: boolean) => {
    if (answered !== null) return;
    setAnswered(chosen);
    const isCorrect = chosen === block.correct;
    context.onResponse?.({
      blockId: block.blockId,
      blockType: 'true-false',
      correct: isCorrect,
      answer: chosen,
    });
  };

  const isCorrect = answered !== null && answered === block.correct;

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 max-w-xl mx-auto w-full">
      <div className="text-center bg-muted/50 rounded-xl p-6 w-full">
        <p className="text-base font-medium leading-relaxed">"{block.statement}"</p>
      </div>

      <div className="flex gap-4 w-full max-w-xs">
        <Button
          variant={answered === true ? (block.correct === true ? 'default' : 'destructive') : 'outline'}
          className="flex-1 h-12 text-base font-semibold"
          onClick={() => handleAnswer(true)}
          disabled={answered !== null}
        >
          True
        </Button>
        <Button
          variant={answered === false ? (block.correct === false ? 'default' : 'destructive') : 'outline'}
          className="flex-1 h-12 text-base font-semibold"
          onClick={() => handleAnswer(false)}
          disabled={answered !== null}
        >
          False
        </Button>
      </div>

      {answered !== null && (
        <div className={`flex items-start gap-3 p-4 rounded-lg w-full ${isCorrect ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
          {isCorrect
            ? <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
            : <XCircle className="w-5 h-5 mt-0.5 shrink-0" />}
          <div>
            <p className="font-semibold text-sm">{isCorrect ? 'Correct!' : 'Not quite.'}</p>
            <p className="text-sm mt-1">{block.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
};
```

- [ ] **Step 4: Run test — expect pass**

```bash
npx vitest run src/components/blocks/__tests__/TrueFalseRenderer.test.tsx
```

Expected: all 4 tests PASS.

- [ ] **Step 5: Register in BlockRegistry**

In `src/components/blocks/BlockRegistry.tsx`, add the import and registry entry:

```typescript
import { TrueFalseRenderer } from './TrueFalseRenderer';
// ...in registry object:
'true-false': { component: TrueFalseRenderer, isWorkspace: true },
```

- [ ] **Step 6: Commit**

```bash
git add src/components/blocks/TrueFalseRenderer.tsx src/components/blocks/__tests__/TrueFalseRenderer.test.tsx src/components/blocks/BlockRegistry.tsx
git commit -m "feat(blocks): add TrueFalseRenderer"
```

---

## Task 8: FillInBlankRenderer

**Files:**
- Create: `src/components/blocks/__tests__/FillInBlankRenderer.test.tsx`
- Create: `src/components/blocks/FillInBlankRenderer.tsx`
- Modify: `src/components/blocks/BlockRegistry.tsx`

- [ ] **Step 1: Write failing test**

Create `src/components/blocks/__tests__/FillInBlankRenderer.test.tsx`:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FillInBlankRenderer } from '../FillInBlankRenderer';
import type { FillInBlankBlock } from '@/types/module-v2';
import type { BlockContext } from '../BlockRegistry';

const block: FillInBlankBlock = {
  type: 'fill-blank',
  blockId: 'fb-1',
  text: 'Revenue minus {{blank}} equals {{blank}}.',
  blanks: [
    { id: 'b1', accepted: ['costs', 'expenses'] },
    { id: 'b2', accepted: ['profit'] },
  ],
};

const ctx: BlockContext = { stepId: 's1', lessonId: 'l1', moduleId: 'm1' };

describe('FillInBlankRenderer', () => {
  it('renders inputs in place of {{blank}} markers', () => {
    render(<FillInBlankRenderer block={block} context={ctx} />);
    expect(screen.getAllByRole('textbox')).toHaveLength(2);
  });

  it('calls onResponse correct:true when all blanks match accepted answers', () => {
    const onResponse = vi.fn();
    render(<FillInBlankRenderer block={block} context={{ ...ctx, onResponse }} />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'costs' } });
    fireEvent.change(inputs[1], { target: { value: 'profit' } });
    fireEvent.click(screen.getByRole('button', { name: /check/i }));
    expect(onResponse).toHaveBeenCalledWith(
      expect.objectContaining({ correct: true, blockId: 'fb-1' })
    );
  });

  it('calls onResponse correct:false when a blank is wrong', () => {
    const onResponse = vi.fn();
    render(<FillInBlankRenderer block={block} context={{ ...ctx, onResponse }} />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'wrong' } });
    fireEvent.change(inputs[1], { target: { value: 'profit' } });
    fireEvent.click(screen.getByRole('button', { name: /check/i }));
    expect(onResponse).toHaveBeenCalledWith(
      expect.objectContaining({ correct: false })
    );
  });

  it('accepts case-insensitive answers', () => {
    const onResponse = vi.fn();
    render(<FillInBlankRenderer block={block} context={{ ...ctx, onResponse }} />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'EXPENSES' } });
    fireEvent.change(inputs[1], { target: { value: 'Profit' } });
    fireEvent.click(screen.getByRole('button', { name: /check/i }));
    expect(onResponse).toHaveBeenCalledWith(
      expect.objectContaining({ correct: true })
    );
  });
});
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx vitest run src/components/blocks/__tests__/FillInBlankRenderer.test.tsx
```

- [ ] **Step 3: Implement FillInBlankRenderer**

Create `src/components/blocks/FillInBlankRenderer.tsx`:

```typescript
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { FillInBlankBlock } from '@/types/module-v2';
import type { BlockContext } from './BlockRegistry';

interface Props {
  block: FillInBlankBlock;
  context: BlockContext;
}

export const FillInBlankRenderer: React.FC<Props> = ({ block, context }) => {
  const [values, setValues] = useState<string[]>(block.blanks.map(() => ''));
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);

  const handleCheck = () => {
    if (submitted) return;
    const checked = block.blanks.map((blank, i) =>
      blank.accepted.some(a => a.toLowerCase() === values[i].trim().toLowerCase())
    );
    setResults(checked);
    setSubmitted(true);
    context.onResponse?.({
      blockId: block.blockId,
      blockType: 'fill-blank',
      correct: checked.every(Boolean),
      answer: values,
    });
  };

  // Split text on {{blank}} and interleave with inputs
  const parts = block.text.split('{{blank}}');

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto w-full">
      <p className="text-base leading-loose">
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            <span>{part}</span>
            {i < block.blanks.length && (
              <input
                role="textbox"
                value={values[i]}
                onChange={e => {
                  if (submitted) return;
                  const next = [...values];
                  next[i] = e.target.value;
                  setValues(next);
                }}
                disabled={submitted}
                className={`inline-block w-28 mx-1 px-2 py-0.5 border-b-2 bg-transparent text-center text-sm focus:outline-none transition-colors
                  ${submitted
                    ? results[i]
                      ? 'border-green-500 text-green-700'
                      : 'border-red-500 text-red-700'
                    : 'border-primary focus:border-primary/70'
                  }`}
              />
            )}
          </React.Fragment>
        ))}
      </p>

      {!submitted && (
        <Button onClick={handleCheck} className="self-start">
          Check
        </Button>
      )}

      {submitted && (
        <div className={`text-sm font-medium px-4 py-2 rounded-lg ${results.every(Boolean) ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {results.every(Boolean) ? 'All correct!' : `${results.filter(Boolean).length} of ${results.length} correct.`}
        </div>
      )}
    </div>
  );
};
```

- [ ] **Step 4: Run test — expect pass**

```bash
npx vitest run src/components/blocks/__tests__/FillInBlankRenderer.test.tsx
```

Expected: all 4 tests PASS.

- [ ] **Step 5: Register in BlockRegistry**

```typescript
import { FillInBlankRenderer } from './FillInBlankRenderer';
// registry:
'fill-blank': { component: FillInBlankRenderer, isWorkspace: true },
```

- [ ] **Step 6: Commit**

```bash
git add src/components/blocks/FillInBlankRenderer.tsx src/components/blocks/__tests__/FillInBlankRenderer.test.tsx src/components/blocks/BlockRegistry.tsx
git commit -m "feat(blocks): add FillInBlankRenderer"
```

---

## Task 9: WordMatchRenderer

**Files:**
- Create: `src/components/blocks/__tests__/WordMatchRenderer.test.tsx`
- Create: `src/components/blocks/WordMatchRenderer.tsx`
- Modify: `src/components/blocks/BlockRegistry.tsx`

- [ ] **Step 1: Write failing test**

Create `src/components/blocks/__tests__/WordMatchRenderer.test.tsx`:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WordMatchRenderer } from '../WordMatchRenderer';
import type { WordMatchBlock } from '@/types/module-v2';
import type { BlockContext } from '../BlockRegistry';

const block: WordMatchBlock = {
  type: 'word-match',
  blockId: 'wm-1',
  pairs: [
    { id: 'p1', term: 'Revenue', definition: 'Total income from sales' },
    { id: 'p2', term: 'Profit', definition: 'Income minus expenses' },
  ],
};

const ctx: BlockContext = { stepId: 's1', lessonId: 'l1', moduleId: 'm1' };

describe('WordMatchRenderer', () => {
  it('renders all terms and definitions', () => {
    render(<WordMatchRenderer block={block} context={ctx} />);
    expect(screen.getByText('Revenue')).toBeTruthy();
    expect(screen.getByText('Profit')).toBeTruthy();
    expect(screen.getByText('Total income from sales')).toBeTruthy();
  });

  it('calls onResponse correct:true when all pairs correctly matched', () => {
    const onResponse = vi.fn();
    render(<WordMatchRenderer block={block} context={{ ...ctx, onResponse }} />);
    fireEvent.click(screen.getByText('Revenue'));
    fireEvent.click(screen.getByText('Total income from sales'));
    fireEvent.click(screen.getByText('Profit'));
    fireEvent.click(screen.getByText('Income minus expenses'));
    fireEvent.click(screen.getByRole('button', { name: /check/i }));
    expect(onResponse).toHaveBeenCalledWith(
      expect.objectContaining({ correct: true, blockId: 'wm-1' })
    );
  });
});
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx vitest run src/components/blocks/__tests__/WordMatchRenderer.test.tsx
```

- [ ] **Step 3: Implement WordMatchRenderer**

Create `src/components/blocks/WordMatchRenderer.tsx`:

```typescript
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import type { WordMatchBlock } from '@/types/module-v2';
import type { BlockContext } from './BlockRegistry';

interface Props {
  block: WordMatchBlock;
  context: BlockContext;
}

export const WordMatchRenderer: React.FC<Props> = ({ block, context }) => {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({}); // termId → defId
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState<Record<string, boolean>>({});

  // Shuffle definitions on mount
  const shuffledDefs = useMemo(() => [...block.pairs].sort(() => Math.random() - 0.5), [block.pairs]);

  const handleTermClick = (termId: string) => {
    if (submitted) return;
    setSelectedTerm(prev => (prev === termId ? null : termId));
  };

  const handleDefClick = (defId: string) => {
    if (submitted || !selectedTerm) return;
    setMatches(prev => ({ ...prev, [selectedTerm]: defId }));
    setSelectedTerm(null);
  };

  const handleCheck = () => {
    if (submitted) return;
    const results: Record<string, boolean> = {};
    for (const pair of block.pairs) {
      results[pair.id] = matches[pair.id] === pair.id;
    }
    setCorrect(results);
    setSubmitted(true);
    context.onResponse?.({
      blockId: block.blockId,
      blockType: 'word-match',
      correct: Object.values(results).every(Boolean),
      answer: matches,
    });
  };

  const allMatched = Object.keys(matches).length === block.pairs.length;

  return (
    <div className="flex flex-col gap-4 p-6 max-w-2xl mx-auto w-full">
      {block.instruction && <p className="text-sm text-muted-foreground">{block.instruction}</p>}

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Terms</p>
          {block.pairs.map(pair => {
            const isSelected = selectedTerm === pair.id;
            const isMatched = pair.id in matches;
            const borderColor = submitted
              ? correct[pair.id] ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
              : isSelected ? 'border-primary bg-primary/5' : isMatched ? 'border-blue-400 bg-blue-50' : 'border-border';
            return (
              <button
                key={pair.id}
                onClick={() => handleTermClick(pair.id)}
                disabled={submitted}
                className={`px-3 py-2 rounded-lg border-2 text-sm font-medium text-left transition-colors ${borderColor}`}
              >
                {pair.term}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Definitions</p>
          {shuffledDefs.map(pair => {
            const isMatched = Object.values(matches).includes(pair.id);
            const matchingTermId = Object.entries(matches).find(([, v]) => v === pair.id)?.[0];
            const borderColor = submitted
              ? (matchingTermId && correct[matchingTermId]) ? 'border-green-500 bg-green-50' : matchingTermId ? 'border-red-500 bg-red-50' : 'border-border'
              : isMatched ? 'border-blue-400 bg-blue-50' : selectedTerm ? 'border-dashed border-primary/50 hover:border-primary hover:bg-primary/5' : 'border-border';
            return (
              <button
                key={pair.id}
                onClick={() => handleDefClick(pair.id)}
                disabled={submitted}
                className={`px-3 py-2 rounded-lg border-2 text-sm text-left transition-colors ${borderColor}`}
              >
                {pair.definition}
              </button>
            );
          })}
        </div>
      </div>

      {!submitted && (
        <Button onClick={handleCheck} disabled={!allMatched} className="self-start">
          Check
        </Button>
      )}

      {submitted && (
        <p className={`text-sm font-medium ${Object.values(correct).every(Boolean) ? 'text-green-700' : 'text-red-700'}`}>
          {Object.values(correct).filter(Boolean).length} of {block.pairs.length} correct.
        </p>
      )}
    </div>
  );
};
```

- [ ] **Step 4: Run test — expect pass**

```bash
npx vitest run src/components/blocks/__tests__/WordMatchRenderer.test.tsx
```

- [ ] **Step 5: Register in BlockRegistry**

```typescript
import { WordMatchRenderer } from './WordMatchRenderer';
// registry:
'word-match': { component: WordMatchRenderer, isWorkspace: true },
```

- [ ] **Step 6: Commit**

```bash
git add src/components/blocks/WordMatchRenderer.tsx src/components/blocks/__tests__/WordMatchRenderer.test.tsx src/components/blocks/BlockRegistry.tsx
git commit -m "feat(blocks): add WordMatchRenderer"
```

---

## Task 10: FlashcardRenderer

**Files:**
- Create: `src/components/blocks/FlashcardRenderer.tsx`
- Modify: `src/components/blocks/BlockRegistry.tsx`

*(No test for flashcard — it is explore-mode with no right/wrong answer, onResponse fires when all cards viewed.)*

- [ ] **Step 1: Implement FlashcardRenderer**

Create `src/components/blocks/FlashcardRenderer.tsx`:

```typescript
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { FlashcardBlock } from '@/types/module-v2';
import type { BlockContext } from './BlockRegistry';

interface Props {
  block: FlashcardBlock;
  context: BlockContext;
}

export const FlashcardRenderer: React.FC<Props> = ({ block, context }) => {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [done, setDone] = useState(false);

  const card = block.cards[index];

  const markSeen = (id: string) => {
    const next = new Set(seen).add(id);
    setSeen(next);
    if (next.size === block.cards.length && !done) {
      setDone(true);
      context.onResponse?.({
        blockId: block.blockId,
        blockType: 'flashcard',
        correct: true,
        answer: { viewed: next.size, total: block.cards.length },
      });
    }
  };

  const goTo = (i: number) => {
    markSeen(card.id);
    setIndex(i);
    setFlipped(false);
  };

  const handleFlip = () => {
    setFlipped(f => !f);
    if (!flipped) markSeen(card.id);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 w-full max-w-lg mx-auto">
      {block.instruction && <p className="text-sm text-muted-foreground text-center">{block.instruction}</p>}

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{index + 1} / {block.cards.length}</span>
        <Badge variant="secondary">{seen.size} viewed</Badge>
      </div>

      <div
        className="relative w-full cursor-pointer select-none"
        style={{ perspective: 1000 }}
        onClick={handleFlip}
      >
        <motion.div
          className="relative w-full"
          style={{ transformStyle: 'preserve-3d', minHeight: 180 }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 flex items-center justify-center rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-6 text-center backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <p className="text-lg font-semibold">{card.front}</p>
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 flex items-center justify-center rounded-2xl border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-accent/10 p-6 text-center"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <p className="text-base">{card.back}</p>
          </div>
        </motion.div>
      </div>

      <p className="text-xs text-muted-foreground">Click card to flip</p>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => goTo(Math.max(0, index - 1))} disabled={index === 0}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => { setIndex(0); setFlipped(false); }}>
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => goTo(Math.min(block.cards.length - 1, index + 1))} disabled={index === block.cards.length - 1}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {done && (
        <p className="text-sm text-green-700 font-medium">All cards reviewed!</p>
      )}
    </div>
  );
};
```

- [ ] **Step 2: Register in BlockRegistry**

```typescript
import { FlashcardRenderer } from './FlashcardRenderer';
// registry:
'flashcard': { component: FlashcardRenderer, isWorkspace: true },
```

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/blocks/FlashcardRenderer.tsx src/components/blocks/BlockRegistry.tsx
git commit -m "feat(blocks): add FlashcardRenderer"
```

---

## Task 11: DragSortRenderer

**Files:**
- Create: `src/components/blocks/DragSortRenderer.tsx`
- Modify: `src/components/blocks/BlockRegistry.tsx`

*(Uses click-to-move interaction — compatible with mobile, no drag library needed.)*

- [ ] **Step 1: Implement DragSortRenderer**

Create `src/components/blocks/DragSortRenderer.tsx`:

```typescript
import React, { useState, useMemo } from 'react';
import { GripVertical, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DragSortBlock } from '@/types/module-v2';
import type { BlockContext } from './BlockRegistry';

interface Props {
  block: DragSortBlock;
  context: BlockContext;
}

export const DragSortRenderer: React.FC<Props> = ({ block, context }) => {
  const shuffled = useMemo(() => [...block.items].sort(() => Math.random() - 0.5), [block.items]);
  const [order, setOrder] = useState(shuffled.map(i => i.id));
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});

  const handleItemClick = (itemId: string) => {
    if (submitted) return;
    if (!selected) {
      setSelected(itemId);
      return;
    }
    if (selected === itemId) {
      setSelected(null);
      return;
    }
    // Swap selected and clicked
    setOrder(prev => {
      const next = [...prev];
      const fromIdx = next.indexOf(selected);
      const toIdx = next.indexOf(itemId);
      [next[fromIdx], next[toIdx]] = [next[toIdx], next[fromIdx]];
      return next;
    });
    setSelected(null);
  };

  const handleCheck = () => {
    if (submitted) return;
    const itemMap = Object.fromEntries(block.items.map(i => [i.id, i]));
    const res: Record<string, boolean> = {};
    order.forEach((id, idx) => {
      res[id] = itemMap[id].correctPosition === idx + 1;
    });
    setResults(res);
    setSubmitted(true);
    context.onResponse?.({
      blockId: block.blockId,
      blockType: 'drag-sort',
      correct: Object.values(res).every(Boolean),
      answer: order,
    });
  };

  const itemMap = Object.fromEntries(block.items.map(i => [i.id, i]));

  return (
    <div className="flex flex-col gap-4 p-6 max-w-xl mx-auto w-full">
      <p className="text-sm font-medium">{block.instruction}</p>
      {!submitted && <p className="text-xs text-muted-foreground">Click an item to select it, then click another to swap positions.</p>}

      <div className="flex flex-col gap-2">
        {order.map((id, idx) => {
          const item = itemMap[id];
          const isSelected = selected === id;
          const borderColor = submitted
            ? results[id] ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
            : isSelected ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border bg-card hover:border-primary/50';

          return (
            <button
              key={id}
              onClick={() => handleItemClick(id)}
              disabled={submitted}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border-2 text-sm font-medium text-left transition-all ${borderColor}`}
            >
              <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-bold shrink-0">{idx + 1}</span>
              <span className="flex-1">{item.label}</span>
              {submitted && (results[id]
                ? <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                : <XCircle className="w-4 h-4 text-red-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {!submitted && (
        <Button onClick={handleCheck} className="self-start">Check Order</Button>
      )}
    </div>
  );
};
```

- [ ] **Step 2: Register in BlockRegistry**

```typescript
import { DragSortRenderer } from './DragSortRenderer';
// registry:
'drag-sort': { component: DragSortRenderer, isWorkspace: true },
```

- [ ] **Step 3: Commit**

```bash
git add src/components/blocks/DragSortRenderer.tsx src/components/blocks/BlockRegistry.tsx
git commit -m "feat(blocks): add DragSortRenderer"
```

---

## Task 12: SequenceRenderer

**Files:**
- Create: `src/components/blocks/__tests__/SequenceRenderer.test.tsx`
- Create: `src/components/blocks/SequenceRenderer.tsx`
- Modify: `src/components/blocks/BlockRegistry.tsx`

- [ ] **Step 1: Write failing test**

Create `src/components/blocks/__tests__/SequenceRenderer.test.tsx`:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SequenceRenderer } from '../SequenceRenderer';
import type { SequenceBlock } from '@/types/module-v2';
import type { BlockContext } from '../BlockRegistry';

const block: SequenceBlock = {
  type: 'sequence',
  blockId: 'seq-1',
  instruction: 'Order these steps',
  items: [
    { id: 'i1', label: 'Research', correctIndex: 0 },
    { id: 'i2', label: 'Prototype', correctIndex: 1 },
    { id: 'i3', label: 'Launch', correctIndex: 2 },
  ],
};

const ctx: BlockContext = { stepId: 's1', lessonId: 'l1', moduleId: 'm1' };

describe('SequenceRenderer', () => {
  it('renders all items', () => {
    render(<SequenceRenderer block={block} context={ctx} />);
    expect(screen.getByText('Research')).toBeTruthy();
    expect(screen.getByText('Prototype')).toBeTruthy();
    expect(screen.getByText('Launch')).toBeTruthy();
  });

  it('has a check button', () => {
    render(<SequenceRenderer block={block} context={ctx} />);
    expect(screen.getByRole('button', { name: /check/i })).toBeTruthy();
  });

  it('calls onResponse after checking', () => {
    const onResponse = vi.fn();
    render(<SequenceRenderer block={block} context={{ ...ctx, onResponse }} />);
    fireEvent.click(screen.getByRole('button', { name: /check/i }));
    expect(onResponse).toHaveBeenCalledWith(
      expect.objectContaining({ blockId: 'seq-1', blockType: 'sequence' })
    );
  });
});
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx vitest run src/components/blocks/__tests__/SequenceRenderer.test.tsx
```

- [ ] **Step 3: Implement SequenceRenderer**

Create `src/components/blocks/SequenceRenderer.tsx`:

```typescript
import React, { useState, useMemo } from 'react';
import { GripVertical, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SequenceBlock } from '@/types/module-v2';
import type { BlockContext } from './BlockRegistry';

interface Props {
  block: SequenceBlock;
  context: BlockContext;
}

export const SequenceRenderer: React.FC<Props> = ({ block, context }) => {
  const shuffled = useMemo(() => [...block.items].sort(() => Math.random() - 0.5), [block.items]);
  const [order, setOrder] = useState(shuffled.map(i => i.id));
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});

  const itemMap = Object.fromEntries(block.items.map(i => [i.id, i]));

  const handleClick = (id: string) => {
    if (submitted) return;
    if (!selected) { setSelected(id); return; }
    if (selected === id) { setSelected(null); return; }
    setOrder(prev => {
      const next = [...prev];
      const a = next.indexOf(selected), b = next.indexOf(id);
      [next[a], next[b]] = [next[b], next[a]];
      return next;
    });
    setSelected(null);
  };

  const handleCheck = () => {
    const res: Record<string, boolean> = {};
    order.forEach((id, idx) => { res[id] = itemMap[id].correctIndex === idx; });
    setResults(res);
    setSubmitted(true);
    context.onResponse?.({
      blockId: block.blockId,
      blockType: 'sequence',
      correct: Object.values(res).every(Boolean),
      answer: order,
    });
  };

  return (
    <div className="flex flex-col gap-4 p-6 max-w-xl mx-auto w-full">
      <p className="text-sm font-medium">{block.instruction}</p>
      {!submitted && <p className="text-xs text-muted-foreground">Click an item to select it, then click another to swap.</p>}
      <div className="flex flex-col gap-2">
        {order.map((id, idx) => {
          const item = itemMap[id];
          const isSelected = selected === id;
          const bg = submitted
            ? results[id] ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
            : isSelected ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border bg-card hover:border-primary/40';
          return (
            <button key={id} onClick={() => handleClick(id)} disabled={submitted}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border-2 text-sm font-medium text-left transition-all ${bg}`}>
              <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-bold shrink-0">{idx + 1}</span>
              <span className="flex-1">{item.label}</span>
              {submitted && (results[id] ? <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" /> : <XCircle className="w-4 h-4 text-red-500 shrink-0" />)}
            </button>
          );
        })}
      </div>
      {!submitted && <Button onClick={handleCheck} className="self-start">Check</Button>}
    </div>
  );
};
```

- [ ] **Step 4: Run test — expect pass**

```bash
npx vitest run src/components/blocks/__tests__/SequenceRenderer.test.tsx
```

- [ ] **Step 5: Register in BlockRegistry**

```typescript
import { SequenceRenderer } from './SequenceRenderer';
// registry:
'sequence': { component: SequenceRenderer, isWorkspace: true },
```

- [ ] **Step 6: Commit**

```bash
git add src/components/blocks/SequenceRenderer.tsx src/components/blocks/__tests__/SequenceRenderer.test.tsx src/components/blocks/BlockRegistry.tsx
git commit -m "feat(blocks): add SequenceRenderer"
```

---

## Task 13: ImageHotspotRenderer

**Files:**
- Create: `src/components/blocks/ImageHotspotRenderer.tsx`
- Modify: `src/components/blocks/BlockRegistry.tsx`

- [ ] **Step 1: Implement ImageHotspotRenderer**

Create `src/components/blocks/ImageHotspotRenderer.tsx`:

```typescript
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ImageHotspotBlock } from '@/types/module-v2';
import type { BlockContext } from './BlockRegistry';

interface Props {
  block: ImageHotspotBlock;
  context: BlockContext;
}

export const ImageHotspotRenderer: React.FC<Props> = ({ block, context }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [done, setDone] = useState(false);

  // If no hotspots have questions, auto-complete immediately (info-only mode)
  const questionHotspots = block.hotspots.filter(h => h.accepted?.length);
  React.useEffect(() => {
    if (questionHotspots.length === 0 && !done) {
      setDone(true);
      context.onResponse?.({ blockId: block.blockId, blockType: 'image-hotspot', correct: true, answer: {} });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeHotspot = block.hotspots.find(h => h.id === activeId);

  const handleHotspotClick = (id: string) => {
    setActiveId(prev => (prev === id ? null : id));
  };

  const handleSubmitAnswer = (hotspotId: string) => {
    const hotspot = block.hotspots.find(h => h.id === hotspotId);
    if (!hotspot?.accepted) return;
    const answer = (answers[hotspotId] ?? '').trim().toLowerCase();
    const correct = hotspot.accepted.some(a => a.toLowerCase() === answer);
    const next = { ...submitted, [hotspotId]: correct };
    setSubmitted(next);

    if (Object.keys(next).length === block.hotspots.filter(h => h.accepted?.length).length && !done) {
      setDone(true);
      context.onResponse?.({
        blockId: block.blockId,
        blockType: 'image-hotspot',
        correct: Object.values(next).every(Boolean),
        answer: answers,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto w-full">
      <div className="relative w-full rounded-xl overflow-hidden border bg-muted">
        <img src={block.imageUrl} alt={block.imageAlt} className="w-full h-auto" draggable={false} />

        {block.hotspots.map(hotspot => (
          <button
            key={hotspot.id}
            onClick={() => handleHotspotClick(hotspot.id)}
            className={`absolute w-7 h-7 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold transition-transform hover:scale-110
              ${submitted[hotspot.id] !== undefined
                ? submitted[hotspot.id] ? 'bg-green-500' : 'bg-red-500'
                : 'bg-primary animate-pulse'
              }`}
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            aria-label={hotspot.label}
          >
            ?
          </button>
        ))}
      </div>

      {activeHotspot && (
        <div className="border rounded-xl p-4 bg-card flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-sm">{activeHotspot.label}</p>
            <button onClick={() => setActiveId(null)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          {activeHotspot.revealText && !activeHotspot.question && (
            <p className="text-sm text-muted-foreground">{activeHotspot.revealText}</p>
          )}

          {activeHotspot.question && (
            <>
              <p className="text-sm">{activeHotspot.question}</p>
              <div className="flex gap-2">
                <Input
                  value={answers[activeHotspot.id] ?? ''}
                  onChange={e => setAnswers(prev => ({ ...prev, [activeHotspot.id]: e.target.value }))}
                  disabled={activeHotspot.id in submitted}
                  placeholder="Type your answer..."
                  className="flex-1"
                  onKeyDown={e => { if (e.key === 'Enter') handleSubmitAnswer(activeHotspot.id); }}
                />
                <Button
                  size="sm"
                  onClick={() => handleSubmitAnswer(activeHotspot.id)}
                  disabled={activeHotspot.id in submitted || !answers[activeHotspot.id]?.trim()}
                >
                  Check
                </Button>
              </div>
              {activeHotspot.id in submitted && (
                <p className={`text-xs font-medium ${submitted[activeHotspot.id] ? 'text-green-600' : 'text-red-600'}`}>
                  {submitted[activeHotspot.id] ? 'Correct!' : `Not quite. Answer: ${activeHotspot.accepted?.[0]}`}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
```

- [ ] **Step 2: Register in BlockRegistry**

```typescript
import { ImageHotspotRenderer } from './ImageHotspotRenderer';
// registry:
'image-hotspot': { component: ImageHotspotRenderer, isWorkspace: true },
```

- [ ] **Step 3: Commit**

```bash
git add src/components/blocks/ImageHotspotRenderer.tsx src/components/blocks/BlockRegistry.tsx
git commit -m "feat(blocks): add ImageHotspotRenderer"
```

---

## Task 14: LabelDiagramRenderer

**Files:**
- Create: `src/components/blocks/LabelDiagramRenderer.tsx`
- Modify: `src/components/blocks/BlockRegistry.tsx`

*(Click-to-place interaction: click label from pool, then click slot on diagram.)*

- [ ] **Step 1: Implement LabelDiagramRenderer**

Create `src/components/blocks/LabelDiagramRenderer.tsx`:

```typescript
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { LabelDiagramBlock } from '@/types/module-v2';
import type { BlockContext } from './BlockRegistry';

interface Props {
  block: LabelDiagramBlock;
  context: BlockContext;
}

export const LabelDiagramRenderer: React.FC<Props> = ({ block, context }) => {
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Record<string, string>>({}); // slotId → labelId
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});

  const placedLabelIds = new Set(Object.values(placements));

  const handleLabelClick = (labelId: string) => {
    if (submitted) return;
    setSelectedLabel(prev => (prev === labelId ? null : labelId));
  };

  const handleSlotClick = (slotId: string) => {
    if (submitted || !selectedLabel) return;
    setPlacements(prev => ({ ...prev, [slotId]: selectedLabel }));
    setSelectedLabel(null);
  };

  const handleCheck = () => {
    const res: Record<string, boolean> = {};
    for (const slot of block.slots) {
      res[slot.id] = placements[slot.id] === slot.correctLabelId;
    }
    setResults(res);
    setSubmitted(true);
    context.onResponse?.({
      blockId: block.blockId,
      blockType: 'label-diagram',
      correct: Object.values(res).every(Boolean),
      answer: placements,
    });
  };

  const allPlaced = block.slots.every(s => s.id in placements);
  const labelMap = Object.fromEntries(block.labels.map(l => [l.id, l.text]));

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto w-full">
      <p className="text-xs text-muted-foreground">
        {submitted ? 'Results shown below.' : selectedLabel ? `Placing: "${labelMap[selectedLabel]}" — click a slot on the diagram` : 'Select a label, then click its position on the diagram.'}
      </p>

      {/* Diagram */}
      <div className="relative w-full rounded-xl overflow-hidden border bg-muted">
        <img src={block.imageUrl} alt={block.imageAlt} className="w-full h-auto" draggable={false} />

        {block.slots.map(slot => {
          const placed = placements[slot.id];
          const isCorrect = submitted && results[slot.id];
          const isWrong = submitted && !results[slot.id];
          return (
            <button
              key={slot.id}
              onClick={() => handleSlotClick(slot.id)}
              disabled={submitted}
              className={`absolute px-2 py-1 rounded text-xs font-semibold border-2 min-w-16 text-center transition-all
                ${placed
                  ? isCorrect ? 'bg-green-100 border-green-500 text-green-800'
                    : isWrong ? 'bg-red-100 border-red-500 text-red-700'
                    : 'bg-white border-primary text-primary'
                  : selectedLabel
                    ? 'bg-primary/10 border-dashed border-primary text-primary hover:bg-primary/20'
                    : 'bg-white/80 border-dashed border-muted-foreground text-muted-foreground'
                }`}
              style={{ left: `${slot.x}%`, top: `${slot.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              {placed ? labelMap[placed] : '+ Label'}
            </button>
          );
        })}
      </div>

      {/* Label pool */}
      <div className="flex flex-wrap gap-2">
        {block.labels.filter(l => !placedLabelIds.has(l.id)).map(label => (
          <button
            key={label.id}
            onClick={() => handleLabelClick(label.id)}
            disabled={submitted}
            className={`px-3 py-1.5 rounded-lg border-2 text-sm font-medium transition-all
              ${selectedLabel === label.id
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card hover:border-primary/50'
              }`}
          >
            {label.text}
          </button>
        ))}
      </div>

      {!submitted && (
        <Button onClick={handleCheck} disabled={!allPlaced} className="self-start">
          Check Labels
        </Button>
      )}

      {submitted && (
        <div className={`flex items-center gap-2 text-sm font-medium ${Object.values(results).every(Boolean) ? 'text-green-700' : 'text-amber-700'}`}>
          {Object.values(results).every(Boolean)
            ? <><CheckCircle2 className="w-4 h-4" /> All labels correct!</>
            : <><XCircle className="w-4 h-4" /> {Object.values(results).filter(Boolean).length} of {block.slots.length} correct.</>
          }
        </div>
      )}
    </div>
  );
};
```

- [ ] **Step 2: Register in BlockRegistry**

```typescript
import { LabelDiagramRenderer } from './LabelDiagramRenderer';
// registry:
'label-diagram': { component: LabelDiagramRenderer, isWorkspace: true },
```

- [ ] **Step 3: Commit**

```bash
git add src/components/blocks/LabelDiagramRenderer.tsx src/components/blocks/BlockRegistry.tsx
git commit -m "feat(blocks): add LabelDiagramRenderer"
```

---

## Task 15: CrosswordRenderer

**Files:**
- Create: `src/components/blocks/CrosswordRenderer.tsx`
- Modify: `src/components/blocks/BlockRegistry.tsx`

- [ ] **Step 1: Implement CrosswordRenderer**

Create `src/components/blocks/CrosswordRenderer.tsx`:

```typescript
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import type { CrosswordBlock } from '@/types/module-v2';
import type { BlockContext } from './BlockRegistry';

interface Props {
  block: CrosswordBlock;
  context: BlockContext;
}

function buildGrid(clues: CrosswordBlock['clues']): (string | null)[][] {
  if (!clues.length) return [];
  let maxRow = 0, maxCol = 0;
  for (const c of clues) {
    if (c.direction === 'across') {
      maxRow = Math.max(maxRow, c.row);
      maxCol = Math.max(maxCol, c.col + c.word.length - 1);
    } else {
      maxRow = Math.max(maxRow, c.row + c.word.length - 1);
      maxCol = Math.max(maxCol, c.col);
    }
  }
  const grid: (string | null)[][] = Array.from({ length: maxRow + 1 }, () =>
    Array(maxCol + 1).fill(null)
  );
  for (const c of clues) {
    for (let i = 0; i < c.word.length; i++) {
      const r = c.direction === 'across' ? c.row : c.row + i;
      const col = c.direction === 'across' ? c.col + i : c.col;
      grid[r][col] = c.word[i];
    }
  }
  return grid;
}

export const CrosswordRenderer: React.FC<Props> = ({ block, context }) => {
  const solution = buildGrid(block.clues);
  const rows = solution.length;
  const cols = rows > 0 ? solution[0].length : 0;
  const [inputs, setInputs] = useState<string[][]>(() =>
    Array.from({ length: rows }, () => Array(cols).fill(''))
  );
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState<boolean[][] | null>(null);

  const handleChange = useCallback((r: number, c: number, val: string) => {
    if (submitted) return;
    setInputs(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = val.toUpperCase().slice(-1);
      return next;
    });
  }, [submitted]);

  const handleCheck = () => {
    const res = solution.map((row, r) =>
      row.map((cell, c) => cell === null || inputs[r][c].toUpperCase() === cell)
    );
    setCorrect(res);
    setSubmitted(true);
    const allCorrect = res.every(row => row.every(Boolean));
    context.onResponse?.({
      blockId: block.blockId,
      blockType: 'crossword',
      correct: allCorrect,
      answer: inputs,
    });
  };

  const allFilled = solution.every((row, r) =>
    row.every((cell, c) => cell === null || inputs[r][c] !== '')
  );

  const across = block.clues.filter(c => c.direction === 'across');
  const down = block.clues.filter(c => c.direction === 'down');

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 max-w-3xl mx-auto w-full">
      {/* Grid */}
      <div className="flex-shrink-0">
        <div
          className="inline-grid gap-0.5 bg-foreground/20 p-0.5 rounded"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {solution.map((row, r) =>
            row.map((cell, c) =>
              cell === null ? (
                <div key={`${r}-${c}`} className="w-8 h-8 bg-foreground rounded-sm" />
              ) : (
                <input
                  key={`${r}-${c}`}
                  maxLength={1}
                  value={inputs[r][c]}
                  onChange={e => handleChange(r, c, e.target.value)}
                  disabled={submitted}
                  className={`w-8 h-8 text-center text-sm font-bold uppercase border-0 outline-none focus:bg-primary/10 transition-colors
                    ${submitted && correct
                      ? correct[r][c] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'
                      : 'bg-white'
                    }`}
                />
              )
            )
          )}
        </div>

        {!submitted && (
          <Button onClick={handleCheck} disabled={!allFilled} className="mt-3 w-full">
            Check Crossword
          </Button>
        )}
        {submitted && (
          <p className={`mt-2 text-sm font-medium ${correct?.every(r => r.every(Boolean)) ? 'text-green-700' : 'text-amber-700'}`}>
            {correct?.every(r => r.every(Boolean)) ? 'Solved!' : 'Some letters are wrong — check the red cells.'}
          </p>
        )}
      </div>

      {/* Clues */}
      <div className="flex flex-col gap-4 text-sm">
        {across.length > 0 && (
          <div>
            <p className="font-semibold mb-1 text-xs uppercase tracking-wide text-muted-foreground">Across</p>
            {across.map((c, i) => (
              <p key={i} className="text-muted-foreground leading-snug py-0.5">
                <span className="font-medium text-foreground">{i + 1}.</span> {c.clue}
              </p>
            ))}
          </div>
        )}
        {down.length > 0 && (
          <div>
            <p className="font-semibold mb-1 text-xs uppercase tracking-wide text-muted-foreground">Down</p>
            {down.map((c, i) => (
              <p key={i} className="text-muted-foreground leading-snug py-0.5">
                <span className="font-medium text-foreground">{i + 1}.</span> {c.clue}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Register in BlockRegistry**

```typescript
import { CrosswordRenderer } from './CrosswordRenderer';
// registry:
'crossword': { component: CrosswordRenderer, isWorkspace: true },
```

- [ ] **Step 3: TypeScript check + full test run**

```bash
npx tsc --noEmit && npx vitest run
```

Expected: no TS errors, all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/blocks/CrosswordRenderer.tsx src/components/blocks/BlockRegistry.tsx
git commit -m "feat(blocks): add CrosswordRenderer"
```

---

## Task 16: useCustomModule hook

**Files:**
- Create: `src/hooks/useCustomModule.ts`

- [ ] **Step 1: Create useCustomModule.ts**

Create `src/hooks/useCustomModule.ts`:

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Module, Lesson, Step, StepBlock, StepLayout, StepScoringConfig } from '@/types/module-v2';

export function useCustomModule(moduleId: string | undefined) {
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!moduleId) { setLoading(false); return; }

    let cancelled = false;
    setLoading(true);
    setError(null);

    async function load() {
      const { data: mod } = await supabase
        .from('custom_modules')
        .select('*')
        .eq('id', moduleId)
        .maybeSingle();

      if (!mod) {
        if (!cancelled) setLoading(false);
        return;
      }

      const { data: lessonRows, error: lessonErr } = await supabase
        .from('custom_lessons')
        .select('*')
        .eq('module_id', moduleId)
        .order('order');

      if (lessonErr || !lessonRows) {
        if (!cancelled) { setError(lessonErr?.message ?? 'Failed to load lessons'); setLoading(false); }
        return;
      }

      const lessonIds = lessonRows.map(l => l.id);
      const { data: stepRows, error: stepErr } = lessonIds.length
        ? await supabase.from('custom_steps').select('*').in('lesson_id', lessonIds).order('order')
        : { data: [], error: null };

      if (stepErr) {
        if (!cancelled) { setError(stepErr.message); setLoading(false); }
        return;
      }

      const stepsByLesson = new Map<string, Step[]>();
      for (const row of stepRows ?? []) {
        if (row.type !== 'v2') continue;
        const config = (row.config as { blocks?: StepBlock[]; scoring?: StepScoringConfig }) ?? {};
        const step: Step = {
          id: row.id,
          order: row.order,
          title: row.title,
          layout: (row.layout as StepLayout) || 'instruction-full',
          blocks: config.blocks ?? [],
          scoring: config.scoring,
        };
        if (!stepsByLesson.has(row.lesson_id)) stepsByLesson.set(row.lesson_id, []);
        stepsByLesson.get(row.lesson_id)!.push(step);
      }

      const lessons: Lesson[] = lessonRows.map(l => ({
        id: l.id,
        order: l.order,
        title: l.title,
        description: l.description,
        steps: stepsByLesson.get(l.id) ?? [],
      }));

      const result: Module = {
        id: mod.id,
        title: mod.title,
        description: mod.description,
        estimatedMinutes: mod.estimated_minutes,
        bannerUrl: mod.banner_url ?? undefined,
        lessons,
        competencies: [],
      };

      if (!cancelled) { setModule(result); setLoading(false); }
    }

    load();
    return () => { cancelled = true; };
  }, [moduleId]);

  return { module, loading, error };
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useCustomModule.ts
git commit -m "feat(hooks): add useCustomModule for DB-first module loading"
```

---

## Task 17: V2LessonPlayer

**Files:**
- Create: `src/components/V2LessonPlayer.tsx`

- [ ] **Step 1: Create V2LessonPlayer.tsx**

Create `src/components/V2LessonPlayer.tsx`:

```typescript
import React, { useState, useCallback } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StepLayoutEngine } from '@/components/blocks/StepLayoutEngine';
import type { BlockContext, BlockResponseParams } from '@/components/blocks/BlockRegistry';
import { useBlockResponse } from '@/hooks/useBlockResponse';
import { useLessonProgress } from '@/hooks/useProgress';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Lesson } from '@/types/module-v2';
import confetti from 'canvas-confetti';

// Block types that require a response before the step is marked complete
const INTERACTIVE_TYPES = new Set([
  'fill-blank', 'word-match', 'drag-sort', 'image-hotspot', 'true-false',
  'label-diagram', 'sequence', 'crossword', 'quiz', 'spreadsheet',
  'chart-builder', 'interactive-table', 'flashcard',
]);

interface Props {
  lesson: Lesson;
  moduleId: string;
  onComplete: (xpEarned: number) => void;
  onBack: () => void;
}

export const V2LessonPlayer: React.FC<Props> = ({ lesson, moduleId, onComplete, onBack }) => {
  const isMobile = useIsMobile();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);
  const [totalXp, setTotalXp] = useState(0);
  const [responses, setResponses] = useState<Map<string, BlockResponseParams>>(new Map());
  const { submitResponse } = useBlockResponse();
  const { saveProgress } = useLessonProgress(lesson.id);

  const currentStep = lesson.steps[currentStepIndex];
  const isLastStep = currentStepIndex === lesson.steps.length - 1;
  const progressPercent = (currentStepIndex / lesson.steps.length) * 100;

  const interactiveBlocks = currentStep.blocks.filter(b => INTERACTIVE_TYPES.has(b.type));
  const isInstructionStep = interactiveBlocks.length === 0;
  const isStepComplete = isInstructionStep || interactiveBlocks.every(b => {
    const withId = b as { blockId?: string };
    return withId.blockId ? responses.has(withId.blockId) : true;
  });

  const handleResponse = useCallback(async (params: BlockResponseParams) => {
    setResponses(prev => new Map(prev).set(params.blockId, params));
    await submitResponse({
      moduleId,
      lessonId: lesson.id,
      stepId: currentStep.id,
      blockId: params.blockId,
      blockType: params.blockType,
      correct: params.correct,
      answer: params.answer,
      attemptNumber: 1,
    });
  }, [moduleId, lesson.id, currentStep.id, submitResponse]);

  const handleContinue = useCallback(async () => {
    const stepXp = currentStep.scoring?.xpValue ?? 5;
    const newTotalXp = totalXp + stepXp;
    const newCompleted = [...completedStepIds, currentStep.id];

    setTotalXp(newTotalXp);
    setCompletedStepIds(newCompleted);
    await saveProgress(newCompleted, currentStep.id, newTotalXp, {}, isLastStep);

    if (isLastStep) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.7 }, colors: ['#FFD700', '#FF6B6B', '#4CAF50', '#2196F3'] });
      onComplete(newTotalXp);
      return;
    }

    setCurrentStepIndex(prev => prev + 1);
    setResponses(new Map());
  }, [currentStep, isLastStep, totalXp, completedStepIds, saveProgress, onComplete]);

  const handlePrevious = useCallback(() => {
    if (currentStepIndex === 0) return;
    setCurrentStepIndex(prev => prev - 1);
    setResponses(new Map());
  }, [currentStepIndex]);

  const context: BlockContext = {
    stepId: currentStep.id,
    lessonId: lesson.id,
    moduleId,
    onResponse: handleResponse,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-card px-4 py-3 flex items-center gap-3 shrink-0">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{lesson.title}</p>
          <p className="text-xs text-muted-foreground">
            Step {currentStepIndex + 1} of {lesson.steps.length} — {currentStep.title}
          </p>
        </div>
      </header>

      <Progress value={progressPercent} className="h-1 rounded-none" />

      <div className="flex-1 flex flex-col min-h-0 overflow-auto">
        <StepLayoutEngine step={currentStep} context={context} isMobile={isMobile} />
      </div>

      <footer className="border-t bg-card px-4 py-3 flex items-center justify-between shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevious}
          disabled={currentStepIndex === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Previous
        </Button>
        <Button
          size="sm"
          onClick={handleContinue}
          disabled={!isStepComplete}
        >
          {isLastStep ? 'Finish' : 'Continue'} <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </footer>
    </div>
  );
};
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/V2LessonPlayer.tsx
git commit -m "feat: add V2LessonPlayer for block-based module rendering"
```

---

## Task 18: Update ModulePlayer for DB-first loading

**Files:**
- Modify: `src/pages/ModulePlayer.tsx`

- [ ] **Step 1: Add DB-first loading and V2LessonPlayer routing**

The current `ModulePlayer.tsx` only checks the hardcoded TypeScript registry. Update it to try `useCustomModule` first, then fall back. Also route v2 lessons through `V2LessonPlayer`.

Replace the `useEffect` that loads the module and add the new hook. The full updated file:

```typescript
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ModuleLanding from '@/components/ModuleLanding';
import LessonPlayer from '@/components/LessonPlayer';
import { V2LessonPlayer } from '@/components/V2LessonPlayer';
import { getModuleById } from '@/data/module-registry';
import { useCustomModule } from '@/hooks/useCustomModule';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import type { Module as LegacyModule } from '@/types/lesson';
import type { Module as V2Module, Lesson as V2Lesson } from '@/types/module-v2';
import { useProgress, useModuleAssessments } from '@/hooks/useProgress';
import { useStudentAssignments } from '@/hooks/useAssignments';
import { Button } from '@/components/ui/button';

const ModulePlayer: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Try DB-first, then fall back to hardcoded
  const { module: dbModule, loading: dbLoading } = useCustomModule(moduleId);
  const [legacyModule, setLegacyModule] = useState<LegacyModule | undefined>(undefined);
  const [moduleLoading, setModuleLoading] = useState(true);

  useEffect(() => {
    if (dbLoading) return;
    if (dbModule) { setModuleLoading(false); return; }
    // DB miss — try hardcoded registry
    const builtin = moduleId ? getModuleById(moduleId) : undefined;
    setLegacyModule(builtin);
    setModuleLoading(false);
  }, [dbLoading, dbModule, moduleId]);

  const isV2 = !!dbModule;
  const displayModule = isV2
    ? { id: dbModule!.id, title: dbModule!.title, description: dbModule!.description, estimatedMinutes: dbModule!.estimatedMinutes, bannerUrl: dbModule!.bannerUrl, lessons: dbModule!.lessons }
    : legacyModule;

  const { completedLessonIds, totalXp, loading: progressLoading, markLessonComplete } = useProgress(displayModule?.id ?? '');
  const { assessments, loading: assessmentLoading } = useModuleAssessments(displayModule?.id ?? '');
  const { assignments, hasAssignments, isLessonAssigned, getDueDate, loading: assignLoading } = useStudentAssignments(displayModule?.id ?? '');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  const moduleDueDates = assignments.filter(a => a.due_date).map(a => new Date(a.due_date!));
  const nearestDue = moduleDueDates.length > 0 ? new Date(Math.min(...moduleDueDates.map(d => d.getTime()))) : null;
  const daysUntilDue = nearestDue ? Math.ceil((nearestDue.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
  const moduleDueLabel = daysUntilDue !== null
    ? daysUntilDue <= 0 ? 'Due today' : daysUntilDue === 1 ? 'Due tomorrow' : `Due in ${daysUntilDue} days`
    : null;

  useEffect(() => {
    const lessonParam = searchParams.get('lesson');
    if (lessonParam && displayModule?.lessons.some(l => l.id === lessonParam)) {
      setActiveLessonId(lessonParam);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams, displayModule]);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [authLoading, user, navigate]);

  const handleStartLesson = useCallback((lessonId: string) => setActiveLessonId(lessonId), []);

  const handleLessonComplete = useCallback(async (xpEarned: number) => {
    if (activeLessonId) {
      await markLessonComplete(activeLessonId, xpEarned);
      toast({ title: '🎉 Lesson Complete!', description: `You earned ${xpEarned} XP. Great work!` });
      setActiveLessonId(null);
    }
  }, [activeLessonId, markLessonComplete]);

  const handleBack = useCallback(() => setActiveLessonId(null), []);

  if (authLoading || progressLoading || assignLoading || moduleLoading || assessmentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pb-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  if (!displayModule) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pb-12">
        <p className="text-muted-foreground">Module not found</p>
      </div>
    );
  }

  // V2 active lesson — use V2LessonPlayer
  if (activeLessonId && isV2) {
    const v2Lesson = (dbModule as V2Module).lessons.find(l => l.id === activeLessonId) as V2Lesson | undefined;
    if (v2Lesson) {
      return (
        <V2LessonPlayer
          lesson={v2Lesson}
          moduleId={displayModule.id}
          onComplete={handleLessonComplete}
          onBack={handleBack}
        />
      );
    }
  }

  // Legacy active lesson — use existing LessonPlayer
  if (activeLessonId && !isV2) {
    const legacyLesson = (legacyModule as LegacyModule).lessons.find(l => l.id === activeLessonId);
    if (legacyLesson) {
      return (
        <LessonPlayer
          lesson={legacyLesson}
          moduleId={displayModule.id}
          onComplete={handleLessonComplete}
          onBack={handleBack}
        />
      );
    }
  }

  // ModuleLanding expects legacy Module type — only use it for legacy modules.
  // For v2 modules on the landing screen, cast is safe because ModuleLanding only reads
  // id, title, description, bannerUrl, and lessons[].{id,title,description,steps.length}.
  return (
    <div className="relative">
      <div className="absolute top-4 left-4 z-10">
        <Button variant="ghost" size="sm" onClick={() => navigate('/student')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Button>
      </div>
      <ModuleLanding
        module={displayModule as unknown as LegacyModule}
        completedLessonIds={completedLessonIds}
        totalXp={totalXp}
        onStartLesson={handleStartLesson}
        hasAssignments={hasAssignments}
        isLessonAssigned={isLessonAssigned}
        getDueDate={getDueDate}
        moduleDueLabel={moduleDueLabel}
        assessments={assessments}
      />
    </div>
  );
};

export default ModulePlayer;
```

- [ ] **Step 2: TypeScript check + full test run**

```bash
npx tsc --noEmit && npx vitest run
```

Expected: no TS errors, all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/pages/ModulePlayer.tsx
git commit -m "feat: DB-first module loading in ModulePlayer with V2LessonPlayer routing"
```

---

## Task 19: MODULE-AUTHORING.md — AI authoring guide

**Files:**
- Create: `docs/circuit/MODULE-AUTHORING.md`

- [ ] **Step 1: Create the authoring guide**

Create `docs/circuit/MODULE-AUTHORING.md`:

````markdown
# Circuit Module Authoring Guide

This guide is for AI agents building modules for Circuit (spreadsmart-learn).
Load this file as context at the start of any module-creation session.

## Overview

A **Module** contains **Lessons**, which contain **Steps**.
Each step has a `layout` and a `blocks[]` array.
Blocks are the atomic content units — text, video, interactive activities, etc.

## Quick Start

```typescript
import { text, callout, trueFalse, wordMatch, fillInBlank, flashcards, sequence, dragSort, imageHotspot, labelDiagram, crossword } from '@/lib/blocks/factories';
import { instructionStep, interactiveStep } from '@/lib/blocks/steps';
import { publishModule } from '@/lib/blocks/assembler';

const result = await publishModule(
  {
    title: 'Introduction to Business',
    description: 'Learn key business concepts through interactive activities.',
    estimatedMinutes: 20,
  },
  [
    {
      title: 'Lesson 1: Revenue and Profit',
      description: 'Understand how businesses generate and measure success.',
      steps: [
        instructionStep({
          title: 'What is Revenue?',
          blocks: [
            text('**Revenue** is the total income a business earns from selling goods or services.'),
            callout({ variant: 'why-it-matters', content: 'Revenue is the starting point of all business analysis.' }),
          ],
        }),
        interactiveStep({
          title: 'True or False?',
          layout: 'stacked',
          blocks: [
            text('Test your understanding:'),
            trueFalse({
              statement: 'A business with high revenue always makes a profit.',
              correct: false,
              explanation: 'Revenue is total income. Profit = Revenue − Costs. High revenue does not guarantee profit.',
            }),
          ],
          scoring: { xpValue: 10, hints: [], successMessage: 'Correct!' },
        }),
      ],
    },
  ]
);

console.log('Published module ID:', result.moduleId);
```

---

## Block Types Reference

### `text(content: string)`
Markdown content. Supports **bold**, *italic*, lists, headings.
```typescript
text('## Key Terms\n- **Revenue** — total income\n- **Profit** — income minus costs')
```

### `callout({ variant, content })`
Variants: `'tip'` | `'warning'` | `'why-it-matters'` | `'reflection'`
```typescript
callout({ variant: 'tip', content: 'Remember: costs include both fixed and variable expenses.' })
```

### `video(url, caption?)`
YouTube embed URL or direct MP4.
```typescript
video('https://www.youtube.com/embed/dQw4w9WgXcQ', 'Introduction to supply and demand')
```

### `trueFalse({ statement, correct, explanation })`
Binary choice. Always provide a clear explanation — shown after answering.
```typescript
trueFalse({
  statement: 'Supply increases when price decreases.',
  correct: false,
  explanation: 'Higher prices incentivise producers to supply more, not less.',
})
```

### `fillInBlank({ text, blanks })`
Use `{{blank}}` in text for each gap. Blanks match by array index.
```typescript
fillInBlank({
  text: 'When demand increases and supply stays the same, price will {{blank}}.',
  blanks: [{ accepted: ['rise', 'increase', 'go up'] }],
})
```

### `wordMatch({ pairs, instruction? })`
Best for vocabulary matching. Provide 3–6 pairs.
```typescript
wordMatch({
  instruction: 'Match each term to its definition.',
  pairs: [
    { term: 'Supply', definition: 'Amount producers are willing to sell' },
    { term: 'Demand', definition: 'Amount consumers want to buy' },
    { term: 'Equilibrium', definition: 'Point where supply equals demand' },
  ],
})
```

### `dragSort({ instruction, items, mode? })`
Mode `'order'` for sequential steps. Mode `'group'` for categorisation.
```typescript
dragSort({
  instruction: 'Put these steps of the design thinking process in order.',
  mode: 'order',
  items: [
    { label: 'Empathise', correctPosition: 1 },
    { label: 'Define', correctPosition: 2 },
    { label: 'Ideate', correctPosition: 3 },
    { label: 'Prototype', correctPosition: 4 },
    { label: 'Test', correctPosition: 5 },
  ],
})
```

### `sequence({ instruction, items })`
Simpler than dragSort — click-to-swap ordering only, no groups.
```typescript
sequence({
  instruction: 'Arrange these events in chronological order.',
  items: [
    { label: 'Industrial Revolution begins', correctIndex: 0 },
    { label: 'World War I', correctIndex: 1 },
    { label: 'Moon landing', correctIndex: 2 },
  ],
})
```

### `flashcards({ cards, instruction? })`
Explore-mode — no right/wrong. Students flip through cards.
Best at the start of a lesson to introduce vocabulary.
```typescript
flashcards({
  instruction: 'Review these key terms before starting.',
  cards: [
    { front: 'GDP', back: 'Gross Domestic Product — total market value of all goods and services produced in a country.' },
    { front: 'Inflation', back: 'The rate at which the general level of prices rises over time.' },
  ],
})
```

### `imageHotspot({ imageUrl, imageAlt, hotspots })`
For diagrams with labelled regions. Use `revealText` for info-only hotspots,
`question` + `accepted` for interactive ones.
```typescript
imageHotspot({
  imageUrl: 'https://example.com/supply-demand-graph.png',
  imageAlt: 'Supply and demand diagram',
  hotspots: [
    { x: 50, y: 30, label: 'Equilibrium Point', revealText: 'Where supply and demand curves intersect.' },
    { x: 20, y: 20, label: 'Surplus Region', question: 'What happens to price in this region?', accepted: ['falls', 'decreases', 'drops'] },
  ],
})
```

### `labelDiagram({ imageUrl, imageAlt, labels, slots })`
Students drag labels to correct positions on a diagram.
`correctLabelIndex` refers to the index in the `labels` array.
```typescript
labelDiagram({
  imageUrl: 'https://example.com/cell-diagram.png',
  imageAlt: 'Plant cell diagram',
  labels: [
    { text: 'Cell Wall' },
    { text: 'Chloroplast' },
    { text: 'Nucleus' },
    { text: 'Vacuole' },
  ],
  slots: [
    { x: 10, y: 50, correctLabelIndex: 0 },
    { x: 30, y: 25, correctLabelIndex: 1 },
    { x: 50, y: 50, correctLabelIndex: 2 },
    { x: 70, y: 60, correctLabelIndex: 3 },
  ],
})
```

### `crossword({ clues })`
Words must be UPPERCASE. Author pre-calculates grid positions.
Best for 4–8 vocabulary terms at the end of a lesson.
```typescript
crossword({
  clues: [
    { word: 'REVENUE',  clue: 'Total income from sales',           direction: 'across', row: 0, col: 0 },
    { word: 'PROFIT',   clue: 'Revenue minus costs',               direction: 'down',   row: 0, col: 3 },
    { word: 'COST',     clue: 'Expense incurred by a business',    direction: 'across', row: 2, col: 3 },
  ],
})
```
**Grid placement tip:** Draw the grid on paper first, then encode `row`/`col` for each word's starting letter.

---

## Step Layouts

| Layout | When to use |
|---|---|
| `'instruction-full'` | Text, video, callouts — no interactive workspace |
| `'stacked'` | Instruction above, interactive block below (default for interactive steps) |
| `'split-left-instruction'` | Long instruction with a spreadsheet or complex workspace |
| `'split-right-instruction'` | Workspace on left, notes on right |
| `'workspace-full'` | Full-screen interactive (crosswords, complex diagrams) |

---

## Module Design Patterns

### Vocabulary lesson (HASS / Business)
1. `instructionStep` — flashcards to introduce terms
2. `instructionStep` — text with definitions and context
3. `interactiveStep` — wordMatch to test understanding
4. `interactiveStep` — fillInBlank in context
5. `interactiveStep` — crossword as final review

### Process / sequence lesson
1. `instructionStep` — text + callout explaining the process
2. `instructionStep` — video of the process
3. `interactiveStep` — dragSort or sequence to order steps
4. `interactiveStep` — trueFalse statements about the process
5. `interactiveStep` — imageHotspot on a process diagram

### Science / geography diagram lesson
1. `instructionStep` — text + image intro
2. `instructionStep` — imageHotspot (info mode, no questions)
3. `interactiveStep` — labelDiagram
4. `interactiveStep` — fillInBlank with key facts
5. `interactiveStep` — wordMatch for terminology

---

## Publishing via Supabase MCP

If using the Supabase MCP directly instead of `publishModule()`, insert in this order:

1. `custom_modules` — requires `teacher_id` (from auth), `title`, `description`, `estimated_minutes`, `status: 'published'`
2. `custom_lessons` — requires `module_id`, `title`, `description`, `order`
3. `custom_steps` — requires `lesson_id`, `title`, `layout`, `order`, `type: 'v2'`, `instruction: ''`, `config: { blocks: [...], scoring: { ... } }`

The `config` JSON column on `custom_steps` holds the complete step definition:
```json
{
  "blocks": [ ...block objects... ],
  "scoring": { "xpValue": 10, "hints": [], "successMessage": "Great work!" }
}
```
````

- [ ] **Step 2: Commit**

```bash
git add docs/circuit/MODULE-AUTHORING.md
git commit -m "docs: add Circuit MODULE-AUTHORING.md for AI module creation"
```

---

## Final verification

- [ ] **Run full test suite**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Start dev server and smoke-test**

```bash
npm run dev
```

1. Navigate to `/student` — existing modules should still load.
2. Navigate to a v2 module URL (after publishing one via `publishModule`) — should load via `V2LessonPlayer`.
3. Play through a step with a `TrueFalseBlock` — clicking an answer should disable buttons and show explanation.
4. Check Supabase `block_responses` table — row should appear after answering.
