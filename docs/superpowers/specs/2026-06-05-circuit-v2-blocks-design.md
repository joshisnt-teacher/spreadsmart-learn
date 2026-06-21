# Circuit — v2 Block System & Interactive Block Types

**Date:** 2026-06-05  
**Status:** Approved  
**Scope:** Promote module-v2.ts to the live type system; add 9 interactive block types; DB-first module loading; factory functions for AI-authored modules; student response storage.

---

## 1. Goals

1. Replace the spreadsheet-centric step model with a flexible, block-based step model (module-v2.ts).
2. Add 9 new interactive block types that work for any subject (HASS, Business, Digital Technologies, Science, etc.).
3. Enable fully agentic module creation — an AI session can author and publish a complete module to Supabase with no code deploy.
4. Store every student block response with enough structure for teacher analytics.
5. Keep existing hardcoded TypeScript modules working without migration.

---

## 2. Type System (`src/types/module-v2.ts`)

`module-v2.ts` is promoted from "proposal" to the canonical module type file. `lesson.ts` is kept for backward-compat with existing hardcoded modules but is not extended further.

### 2.1 Existing block types (unchanged)

| Type | Description |
|---|---|
| `text` | Markdown content |
| `video` | YouTube / Vimeo / MP4 embed |
| `image` | Static image with alt + caption |
| `callout` | Tip / warning / why-it-matters / reflection callout |
| `spreadsheet` | Fortune-sheet spreadsheet with cell expectations |
| `quiz` | Multiple-choice or short-answer question |
| `chart-builder` | Chart construction task |
| `interactive-table` | Sortable/filterable data table task |

### 2.2 New block types

Every new block has a mandatory `blockId: string` field used to key `block_responses` rows.

#### `fill-blank`
```ts
interface FillInBlankBlock {
  type: 'fill-blank';
  blockId: string;
  text: string;          // Use {{blank}} as placeholder, e.g. "Revenue is {{blank}} minus {{blank}}"
  blanks: Array<{
    id: string;          // matches placeholder order by array index
    accepted: string[];  // case-insensitive accepted answers
    hint?: string;
  }>;
}
```

#### `word-match`
```ts
interface WordMatchBlock {
  type: 'word-match';
  blockId: string;
  instruction?: string;
  pairs: Array<{
    id: string;
    term: string;
    definition: string;
  }>;
}
```

#### `drag-sort`
```ts
interface DragSortBlock {
  type: 'drag-sort';
  blockId: string;
  instruction: string;
  items: Array<{
    id: string;
    label: string;
    correctPosition: number;   // 1-based
    group?: string;            // optional: for category-sorting variant
  }>;
  mode: 'order' | 'group';
}
```

#### `image-hotspot`
```ts
interface ImageHotspotBlock {
  type: 'image-hotspot';
  blockId: string;
  imageUrl: string;
  imageAlt: string;
  hotspots: Array<{
    id: string;
    x: number;           // percentage from left (0–100)
    y: number;           // percentage from top (0–100)
    label: string;
    revealText?: string; // shown when clicked (info mode)
    question?: string;   // if present, student must answer
    accepted?: string[];
  }>;
}
```

#### `flashcard`
```ts
interface FlashcardBlock {
  type: 'flashcard';
  blockId: string;
  instruction?: string;
  cards: Array<{
    id: string;
    front: string;  // term / question
    back: string;   // definition / answer
  }>;
}
// No right/wrong — explore mode. Response stored as { viewed: number, total: number }
```

#### `true-false`
```ts
interface TrueFalseBlock {
  type: 'true-false';
  blockId: string;
  statement: string;
  correct: boolean;
  explanation: string;  // shown after student answers
}
```

#### `label-diagram`
```ts
interface LabelDiagramBlock {
  type: 'label-diagram';
  blockId: string;
  imageUrl: string;
  imageAlt: string;
  labels: Array<{ id: string; text: string }>;
  slots: Array<{
    id: string;
    x: number;         // percentage from left
    y: number;         // percentage from top
    correctLabelId: string;
  }>;
}
```

#### `sequence`
```ts
interface SequenceBlock {
  type: 'sequence';
  blockId: string;
  instruction: string;
  items: Array<{
    id: string;
    label: string;
    correctIndex: number;  // 0-based correct position
  }>;
}
```

#### `crossword`
```ts
interface CrosswordBlock {
  type: 'crossword';
  blockId: string;
  clues: Array<{
    word: string;       // uppercase, no spaces
    clue: string;
    direction: 'across' | 'down';
    row: number;        // 0-based grid row for first letter
    col: number;        // 0-based grid col for first letter
  }>;
}
```

### 2.3 Updated StepBlock union

```ts
export type StepBlock =
  | TextBlock | VideoBlock | ImageBlock | CalloutBlock
  | SpreadsheetBlock | QuizBlock | ChartBuilderBlock | InteractiveTableBlock
  | FillInBlankBlock | WordMatchBlock | DragSortBlock | ImageHotspotBlock
  | FlashcardBlock | TrueFalseBlock | LabelDiagramBlock | SequenceBlock | CrosswordBlock;
```

### 2.4 Step layouts

```ts
export type StepLayout =
  | 'instruction-full'       // text/media only — full width
  | 'split-left-instruction' // instruction left, block workspace right
  | 'split-right-instruction'// block workspace left, instruction right
  | 'stacked'                // instruction top, workspace bottom
  | 'workspace-full';        // immersive — no persistent instruction panel
```

---

## 3. Database

### 3.1 New table: `block_responses`

```sql
create table public.block_responses (
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

-- RLS: students can insert their own rows; teachers can read rows for their classes
alter table public.block_responses enable row level security;

create policy "Students insert own responses"
  on public.block_responses for insert
  with check (auth.uid() = user_id);

create policy "Teachers read class responses"
  on public.block_responses for select
  using (
    -- Scoped to teachers who have at least one class containing that student
    exists (
      select 1
      from public.class_students cs
      join public.classes c on c.id = cs.class_id
      where cs.student_user_id = block_responses.user_id
        and c.teacher_id = auth.uid()
    )
  );
```

### 3.2 Column addition: `custom_steps.layout`

```sql
alter table public.custom_steps
  add column layout text not null default 'instruction-full';
```

### 3.3 Existing tables used (no changes)

- `custom_modules` — module metadata (title, description, estimated_minutes, etc.)
- `custom_lessons` — lesson metadata (title, description, order, module_id)
- `custom_steps` — steps; `config jsonb` stores the `blocks[]` array; `type` is set to `'v2'` for all v2 block steps (signals the player to deserialise `config` as a blocks array)
- `step_events` — still written to alongside `block_responses` for backward compat

---

## 4. Factory Functions

### 4.1 Block factories (`src/lib/blocks/factories.ts`)

One export per block type. All return a fully typed block config with a generated `blockId`.

```ts
import { nanoid } from 'nanoid'; // already in project

export function fillInBlank(options: {
  text: string;
  blanks: Array<{ accepted: string[]; hint?: string }>;
}): FillInBlankBlock

export function wordMatch(options: {
  pairs: Array<{ term: string; definition: string }>;
  instruction?: string;
}): WordMatchBlock

export function dragSort(options: {
  instruction: string;
  items: Array<{ label: string; correctPosition: number; group?: string }>;
  mode?: 'order' | 'group';
}): DragSortBlock

export function imageHotspot(options: {
  imageUrl: string;
  imageAlt: string;
  hotspots: Array<{
    x: number; y: number; label: string;
    revealText?: string; question?: string; accepted?: string[];
  }>;
}): ImageHotspotBlock

export function flashcards(options: {
  cards: Array<{ front: string; back: string }>;
  instruction?: string;
}): FlashcardBlock

export function trueFalse(options: {
  statement: string;
  correct: boolean;
  explanation: string;
}): TrueFalseBlock

export function labelDiagram(options: {
  imageUrl: string;
  imageAlt: string;
  labels: Array<{ text: string }>;
  slots: Array<{ x: number; y: number; correctLabelIndex: number }>;
}): LabelDiagramBlock

export function sequence(options: {
  instruction: string;
  items: Array<{ label: string; correctIndex: number }>;
}): SequenceBlock

export function crossword(options: {
  clues: Array<{
    word: string; clue: string;
    direction: 'across' | 'down'; row: number; col: number;
  }>;
}): CrosswordBlock
```

All IDs (`blockId`, `id` on items/pairs/cards/etc.) are generated via `crypto.randomUUID()` inside the factory — the caller never manages IDs. No extra dependency required.

### 4.2 Step factories (`src/lib/blocks/steps.ts`)

```ts
export function instructionStep(options: {
  title: string;
  blocks: StepBlock[];
  layout?: StepLayout;       // default: 'instruction-full'
  outcomes?: StepOutcome[];
}): Step

export function interactiveStep(options: {
  title: string;
  blocks: StepBlock[];
  layout?: StepLayout;       // default: 'stacked'
  scoring?: StepScoringConfig;
  outcomes?: StepOutcome[];
}): Step
```

### 4.3 Module assembler (`src/lib/blocks/assembler.ts`)

```ts
export interface ModuleMeta {
  title: string;
  description: string;
  topic: string;
  estimatedMinutes: number;
  bannerUrl?: string;
}

export interface LessonDef {
  title: string;
  description: string;
  steps: Step[];
}

export async function publishModule(
  meta: ModuleMeta,
  lessons: LessonDef[],
  supabaseClient: SupabaseClient
): Promise<{ moduleId: string }>
```

`publishModule` handles the multi-table insert in order: module → lessons → steps (with blocks serialised into `config`). Returns the new `moduleId`. Throws on any DB error so the caller gets a clear failure signal.

---

## 5. Block Renderers

### 5.1 File structure

```
src/components/blocks/
  BlockRegistry.tsx              ← maps type → renderer (updated)
  StepLayoutEngine.tsx           ← implements all 5 layouts (updated)
  FillInBlankRenderer.tsx        ← new
  WordMatchRenderer.tsx          ← new
  DragSortRenderer.tsx           ← new
  ImageHotspotRenderer.tsx       ← new
  FlashcardRenderer.tsx          ← new
  TrueFalseRenderer.tsx          ← new
  LabelDiagramRenderer.tsx       ← new
  SequenceRenderer.tsx           ← new
  CrosswordRenderer.tsx          ← new
  CalloutBlockRenderer.tsx       ← existing
  QuizBlockRenderer.tsx          ← existing
  SpreadsheetBlockRenderer.tsx   ← existing
  TextBlockRenderer.tsx          ← existing
  VideoBlockRenderer.tsx         ← existing
```

### 5.2 Renderer interface

Every renderer receives:

```ts
interface BlockRendererProps<T extends StepBlock> {
  block: T;
  onResponse: (result: { correct: boolean; answer: unknown }) => void;
  disabled?: boolean;  // true after student has submitted this block
}
```

The renderer calls `onResponse` exactly once when the student submits. The parent (`StepContentArea`) handles debouncing and writing to Supabase.

### 5.3 BlockRegistry update

```ts
const REGISTRY: Record<StepBlock['type'], React.ComponentType<BlockRendererProps<any>>> = {
  'text': TextBlockRenderer,
  'video': VideoBlockRenderer,
  'image': ImageBlockRenderer,
  'callout': CalloutBlockRenderer,
  'spreadsheet': SpreadsheetBlockRenderer,
  'quiz': QuizBlockRenderer,
  'chart-builder': ChartBuilderRenderer,
  'interactive-table': InteractiveTableRenderer,
  'fill-blank': FillInBlankRenderer,
  'word-match': WordMatchRenderer,
  'drag-sort': DragSortRenderer,
  'image-hotspot': ImageHotspotRenderer,
  'flashcard': FlashcardRenderer,
  'true-false': TrueFalseRenderer,
  'label-diagram': LabelDiagramRenderer,
  'sequence': SequenceRenderer,
  'crossword': CrosswordRenderer,
};
```

### 5.4 StepLayoutEngine

Implements all 5 layouts as CSS grid/flex arrangements:

- `instruction-full` — single column, full width
- `split-left-instruction` — 40% instruction | 60% block workspace
- `split-right-instruction` — 60% block workspace | 40% instruction
- `stacked` — instruction panel top, block workspace below
- `workspace-full` — block fills entire step area, no instruction panel

---

## 6. Response Storage

### 6.1 `useBlockResponse` hook (`src/hooks/useBlockResponse.ts`)

```ts
export function useBlockResponse() {
  const { user } = useAuth();
  const { studentSession } = useStudentSession();

  async function submitResponse(params: {
    moduleId: string;
    lessonId: string;
    stepId: string;
    blockId: string;
    blockType: string;
    correct: boolean;
    answer: unknown;
    attemptNumber: number;
  }): Promise<void>
}
```

`submitResponse` writes to `block_responses` and also writes a `step_events` row with `event_type: '<blockType>:submit'` and the full params in `metadata`. Uses the resolved user ID from either `useAuth` (SSO students) or `useStudentSession`.

---

## 7. Module Player Updates

### 7.1 DB-first loading (`src/hooks/useLessonPlayer.ts`)

Updated resolution order:

1. Query `custom_modules` in Supabase by `moduleId`
2. If found, load lessons from `custom_lessons` and steps from `custom_steps` — deserialise `config` into `blocks[]`
3. If not found, fall back to the hardcoded `allModules` registry (existing TypeScript modules untouched)

### 7.2 `StepContentArea` (`src/components/lesson/StepContentArea.tsx`)

Updated to:
- Render `step.blocks[]` via `BlockRegistry` instead of the old single-type switch
- Pass `onResponse` to each block renderer
- Call `useBlockResponse().submitResponse(...)` on each response
- Mark step complete when all interactive blocks in the step have received a response

---

## 8. AI Authoring Guide

**File:** `docs/circuit/MODULE-AUTHORING.md`

Documents:
- Every block type with a full worked example
- Which layout to use for each block type
- How to structure a module (recommended lesson/step counts)
- The `publishModule` call + Supabase MCP alternative for direct DB insert
- Subject-area patterns (HASS vocabulary module, Business case study, Science method module)
- Response shape reference for each block type

This file is the primary context document loaded at the start of any AI module-creation session.

---

## 9. Out of Scope

- Module builder UI (teacher visual editor) — future work
- Migrating existing hardcoded TypeScript modules to DB — not required; they continue to work via fallback
- Leaderboards or XP changes — no changes to `lesson_progress` or `module_progress` tables
- Image upload UI for hotspot/label blocks — authoring guide instructs use of public image URLs

---

## 10. File Checklist

### New files
- `src/types/module-v2.ts` — promoted + extended (replaces as canonical)
- `src/lib/blocks/factories.ts`
- `src/lib/blocks/steps.ts`
- `src/lib/blocks/assembler.ts`
- `src/hooks/useBlockResponse.ts`
- `src/components/blocks/FillInBlankRenderer.tsx`
- `src/components/blocks/WordMatchRenderer.tsx`
- `src/components/blocks/DragSortRenderer.tsx`
- `src/components/blocks/ImageHotspotRenderer.tsx`
- `src/components/blocks/FlashcardRenderer.tsx`
- `src/components/blocks/TrueFalseRenderer.tsx`
- `src/components/blocks/LabelDiagramRenderer.tsx`
- `src/components/blocks/SequenceRenderer.tsx`
- `src/components/blocks/CrosswordRenderer.tsx`
- `docs/circuit/MODULE-AUTHORING.md`
- Supabase migration: `block_responses` table + `custom_steps.layout` column

### Modified files
- `src/components/blocks/BlockRegistry.tsx`
- `src/components/blocks/StepLayoutEngine.tsx`
- `src/components/lesson/StepContentArea.tsx`
- `src/hooks/useLessonPlayer.ts`
- `src/integrations/supabase/types.ts` (regenerated after migration)
