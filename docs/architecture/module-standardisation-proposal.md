# Circuit Module Standardisation Proposal

## Executive Summary

The current module system is tightly coupled to Excel/spreadsheet concepts. To support **Computer Literacy** (email, file management, etc.) and future topics, we need to decouple the lesson model from spreadsheet-specific fields, introduce a **block-based content system**, and refactor progress tracking from a simple XP model to a **competency-based progression system**.

---

## 1. Current State Audit

### 1.1 Type Architecture (`src/types/lesson.ts`)

```ts
interface Step {
  id: string;
  order: number;
  title: string;
  instruction: string;
  type?: 'instruction' | 'task' | 'challenge' | 'chart' | 'quiz' | 'table-task';
  whyItMatters?: string;
  mediaUrl?: string;
  initialSheetState?: SheetState;   // Spreadsheet-only
  task?: TaskDefinition;            // Spreadsheet-only
  chartConfig?: ChartConfig;        // Chart-only
  chartTask?: ChartTaskExpectation; // Chart-only
  tableTask?: TableTaskConfig;      // Table-only
  quiz?: QuizQuestion;              // Quiz-only
}
```

**Problem:** `Step` is a "god object." Every step carries baggage for every possible interaction. Adding a new step type (e.g., `email-simulation`) means polluting this interface with more optional fields.

### 1.2 Rendering (`StepContentArea.tsx`)

The renderer uses a cascade of `if (isChartStep)`, `if (isQuizStep)`, etc. This is:
- **Not open for extension:** Adding a type requires editing this component.
- **Not composable:** You cannot mix a video embed with a spreadsheet task in the same step.

### 1.3 Data Authoring

Modules are hard-coded TypeScript files (`excel-basics-module.ts`, `charts-module.ts`). To create a module, you must:
1. Write raw TypeScript.
2. Understand `SheetState`, `CellData`, `TaskExpectation` internals.
3. Import and register in `module-registry.ts`.

This is a developer workflow, not a teacher/content-author workflow.

### 1.4 Progress & Scoring (`useProgress.ts`, `useLessonPlayer.ts`)

**Current tracking:**
- `lesson_progress`: `completed_step_ids`, `total_xp`, `attempts` (opaque JSONB).
- `module_progress`: `completed_lesson_ids`, `total_xp`.

**Problems:**
1. **XP-only metric** — No concept of skill mastery, accuracy, or time-on-task.
2. **Opaque `attempts` blob** — Cannot run analytics like "which steps are hardest across all modules?"
3. **No per-step outcomes** — Cannot query "how many students mastered formula entry?"
4. **No prerequisites / adaptive unlocking** — Linear progression only.
5. **Quiz steps require a dummy `task`** — Confusing data model.
6. **No standardised assessment rubric** — A "Computer Literacy" module needs to certify "can send an email", not just award 50 XP.

---

## 2. Proposed Architecture

### 2.1 Core Principle: The Step is a Layout + Blocks

A **Step** should define:
- `id`, `order`, `title` (metadata)
- `layout`: How the screen is divided (e.g., `split-left-instruction`, `full-width`, `stacked`).
- `blocks`: An ordered array of content/interaction blocks.
- `outcomes`: What competencies this step assesses (optional).

This is inspired by CMS block editors (WordPress Gutenberg, Notion) and allows infinite combinations without changing the type system.

### 2.2 New Type System

```ts
// ── Content Blocks ───────────────────────────────

export interface TextBlock {
  type: 'text';
  content: string; // Markdown
}

export interface VideoBlock {
  type: 'video';
  url: string;           // YouTube embed, Vimeo, or direct MP4
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
  variant: 'tip' | 'warning' | 'why-it-matters';
  content: string;
}

// ── Interaction Blocks ───────────────────────────

export interface SpreadsheetBlock {
  type: 'spreadsheet';
  initialState: SheetState;
  editableCells: string[];
  expectations: TaskExpectation[];
}

export interface QuizBlock {
  type: 'quiz';
  question: QuizQuestion;
}

export interface ChartBuilderBlock {
  type: 'chart-builder';
  config: ChartConfig;
  task: ChartTaskExpectation;
}

export interface InteractiveTableBlock {
  type: 'interactive-table';
  config: TableTaskConfig;
}

export interface ExternalToolBlock {
  type: 'external-tool';
  toolId: string;        // e.g., 'email-simulator', 'file-explorer'
  config: Record<string, unknown>;
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
  | ExternalToolBlock;

// ── Step ─────────────────────────────────────────

export interface Step {
  id: string;
  order: number;
  title: string;
  layout: StepLayout;
  blocks: StepBlock[];
  outcomes?: StepOutcome[];      // What this step teaches/assesses
  scoring?: StepScoringConfig;   // Overrides default scoring
}

export type StepLayout =
  | 'instruction-full'           // Text/media only, no workspace
  | 'split-left-instruction'     // Instruction left, workspace right (classic Excel)
  | 'split-right-instruction'    // Workspace left, instruction right
  | 'stacked'                    // Instruction top, workspace bottom
  | 'workspace-full';            // Full-screen workspace (e.g., file explorer sim)

// ── Outcomes & Competencies ──────────────────────

export interface StepOutcome {
  competencyId: string;          // e.g., 'excel.formulas.sum', 'email.draft.subject'
  level: 'introduced' | 'practised' | 'mastered'; // How this step relates to the competency
}

export interface StepScoringConfig {
  xpValue: number;
  bonusXp?: number;
  hints?: string[];
  successMessage: string;
  almostCorrectMessage?: string;
  incorrectMessage?: string;
}

// ── Lesson & Module ──────────────────────────────

export interface Lesson {
  id: string;
  order: number;
  title: string;
  description: string;
  steps: Step[];
  prerequisites?: string[];      // Lesson IDs that must be completed first
}

export interface Module {
  id: string;
  title: string;
  description: string;
  topic: string;                 // e.g., 'excel', 'computer-literacy', 'charts'
  estimatedMinutes: number;
  bannerUrl?: string;
  lessons: Lesson[];
  competencies: Competency[];    // What this module teaches
}

export interface Competency {
  id: string;
  name: string;
  description: string;
  parentId?: string;             // Allows hierarchical competency trees
}
```

### 2.3 Block Registry & Rendering

Instead of a giant `if/else` chain, we use a **registry pattern**:

```tsx
// src/components/blocks/BlockRegistry.tsx
import { TextBlockRenderer } from './TextBlockRenderer';
import { VideoBlockRenderer } from './VideoBlockRenderer';
import { SpreadsheetBlockRenderer } from './SpreadsheetBlockRenderer';
import { QuizBlockRenderer } from './QuizBlockRenderer';
// ... etc

const blockRenderers: Record<string, React.FC<any>> = {
  text: TextBlockRenderer,
  video: VideoBlockRenderer,
  image: ImageBlockRenderer,
  callout: CalloutBlockRenderer,
  spreadsheet: SpreadsheetBlockRenderer,
  quiz: QuizBlockRenderer,
  'chart-builder': ChartBuilderBlockRenderer,
  'interactive-table': InteractiveTableBlockRenderer,
  'external-tool': ExternalToolBlockRenderer,
};

export function renderBlock(block: StepBlock, context: BlockContext) {
  const Renderer = blockRenderers[block.type];
  if (!Renderer) return <UnknownBlock type={block.type} />;
  return <Renderer block={block} context={context} />;
}
```

**Benefits:**
- Adding a new block type is just adding a file + one line in the registry.
- A step can contain multiple blocks (e.g., a video *and* a quiz).
- Layout is handled separately from content.

### 2.4 Standardised Step Layouts

The `StepPlayer` (renamed from `LessonPlayer`) reads `step.layout` and arranges the blocks accordingly:

| Layout | Use Case |
|--------|----------|
| `instruction-full` | Pure theory, video explanations, "Why it matters" |
| `split-left-instruction` | Classic Circuit — instructions left, spreadsheet right |
| `split-right-instruction` | Chart reading — chart left, questions right |
| `stacked` | Mobile-friendly; instruction top, workspace bottom |
| `workspace-full` | File explorer sim, email client sim — immersive |

### 2.5 External Tool Block (The Key to Non-Excel Modules)

For topics like Computer Literacy, we don't want to hardcode "email simulator" into the core types. Instead:

```ts
interface ExternalToolBlock {
  type: 'external-tool';
  toolId: string;
  config: Record<string, unknown>;
}
```

Tools are registered in a separate `ToolRegistry`:

```tsx
// src/tools/ToolRegistry.ts
import { EmailSimulator } from './email-simulator';
import { FileExplorerSim } from './file-explorer-sim';

export const toolRegistry: Record<string, ToolDefinition> = {
  'email-simulator': EmailSimulator,
  'file-explorer': FileExplorerSim,
};
```

Each `ToolDefinition` exposes:
- `render(config) => ReactNode`
- `checkAnswer(state, config) => CheckResult`
- `getInitialState(config) => unknown`

This makes the platform **extensible by plugins**.

---

## 3. Progress & Scoring Refactor

### 3.1 New Data Model

**`step_completions` table (replaces opaque `attempts` JSONB):**

```sql
CREATE TABLE public.step_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  step_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  attempt_count INTEGER NOT NULL DEFAULT 1,
  time_on_step_seconds INTEGER NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  accuracy_score NUMERIC(5,2), -- 0-100, derived from attempt_count / hints used
  competency_ids TEXT[],       -- Which competencies were touched
  UNIQUE (user_id, step_id)
);
```

**`competency_progress` table (new):**

```sql
CREATE TABLE public.competency_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  competency_id TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 0, -- 0=none, 1=introduced, 2=practised, 3=mastered
  evidence_count INTEGER NOT NULL DEFAULT 0, -- How many steps contributed
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, competency_id)
);
```

**`module_progress` (augmented):**

```sql
ALTER TABLE public.module_progress
  ADD COLUMN completed_step_ids TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN accuracy_average NUMERIC(5,2),
  ADD COLUMN total_time_seconds INTEGER NOT NULL DEFAULT 0;
```

### 3.2 Scoring Logic (`useStepPlayer.ts`)

```ts
function calculateStepScore(
  baseXp: number,
  bonusXp: number,
  attemptCount: number,
  hintsUsed: number,
  timeOnStep: number
): StepScore {
  const firstAttemptBonus = attemptCount === 1 ? bonusXp : 0;
  const hintPenalty = hintsUsed * 2; // Small XP penalty per hint
  const xp = Math.max(0, baseXp + firstAttemptBonus - hintPenalty);
  
  // Accuracy is a 0-100 metric independent of XP
  const accuracy = Math.max(0, 100 - (attemptCount - 1) * 15 - hintsUsed * 5);
  
  return { xp, accuracy };
}
```

**Why this matters:**
- Teachers can see that a student "got it right but needed 5 hints" (low accuracy, high completion).
- Adaptive systems can recommend remediation for low-accuracy completions.
- Competency tracking lets us say "Student has mastered SUM formulas" across multiple modules.

### 3.3 Adaptive Unlocking

With the `prerequisites` field on `Lesson` and `competency_progress`, we can implement:

```ts
function isLessonUnlocked(lesson: Lesson, userProgress: UserProgress): boolean {
  if (!lesson.prerequisites || lesson.prerequisites.length === 0) return true;
  return lesson.prerequisites.every(id => userProgress.completedLessonIds.includes(id));
}
```

For a Computer Literacy module:
- Lesson 1: File Management (no prereq)
- Lesson 2: Sending Emails (prereq: Lesson 1)
- Lesson 3: Email Attachments (prereq: Lesson 2)
- Lesson 4: Excel Basics (no prereq — parallel track)

---

## 4. Content Authoring Improvements

### 4.1 JSON/YAML Module Definition

Instead of TypeScript, modules should be definable in **JSON or YAML** (validated by Zod schema):

```json
{
  "id": "computer-literacy-101",
  "title": "Computer Literacy Basics",
  "topic": "computer-literacy",
  "estimatedMinutes": 60,
  "lessons": [
    {
      "id": "lesson-1",
      "title": "The File Explorer",
      "steps": [
        {
          "id": "step-1-1",
          "title": "What is a File?",
          "layout": "instruction-full",
          "blocks": [
            { "type": "text", "content": "A file is a digital document..." },
            { "type": "video", "url": "https://youtube.com/embed/abc123", "caption": "Watch how files are organised." },
            { "type": "callout", "variant": "why-it-matters", "content": "Understanding files is essential for every digital task." }
          ]
        },
        {
          "id": "step-1-2",
          "title": "Create a New Folder",
          "layout": "workspace-full",
          "blocks": [
            {
              "type": "external-tool",
              "toolId": "file-explorer",
              "config": {
                "task": "create-folder",
                "targetPath": "/Documents/School"
              }
            }
          ],
          "outcomes": [{ "competencyId": "files.create-folder", "level": "practised" }],
          "scoring": {
            "xpValue": 15,
            "bonusXp": 5,
            "successMessage": "Folder created!",
            "hints": ["Right-click in empty space...", "Look for 'New Folder'..."]
          }
        }
      ]
    }
  ]
}
```

### 4.2 Validation (`src/lib/module-validator.ts`)

Use Zod to validate JSON modules at build time and runtime:

```ts
const StepBlockSchema = z.union([
  z.object({ type: z.literal('text'), content: z.string() }),
  z.object({ type: z.literal('video'), url: z.string().url() }),
  z.object({ type: z.literal('spreadsheet'), initialState: SheetStateSchema }),
  // ...
]);

const StepSchema = z.object({
  id: z.string(),
  layout: z.enum(['instruction-full', 'split-left-instruction', /* ... */]),
  blocks: z.array(StepBlockSchema).min(1),
  outcomes: z.array(OutcomeSchema).optional(),
  scoring: ScoringConfigSchema.optional(),
});
```

### 4.3 Dynamic Module Loading

Instead of a static TypeScript registry:

```ts
// src/data/module-registry.ts
async function loadModule(moduleId: string): Promise<Module | null> {
  // 1. Check built-in modules
  if (builtInModules[moduleId]) return builtInModules[moduleId];
  
  // 2. Check Supabase `custom_modules` + `custom_lessons` + `custom_steps`
  const { data } = await supabase.from('custom_modules').select('*, lessons:custom_lessons(*)').eq('id', moduleId).single();
  if (data) return parseCustomModule(data);
  
  // 3. Check static JSON files (for authored content)
  try {
    const moduleJson = await import(`@/modules/${moduleId}.json`);
    return StepModuleSchema.parse(moduleJson);
  } catch { /* not found */ }
  
  return null;
}
```

---

## 5. Migration Path

### Phase 1: Introduce Block Renderers (Non-breaking)
- Keep existing `Step` type and `StepContentArea`.
- Create `BlockRegistry` and new renderer components alongside old ones.
- Migrate `instruction` steps to use `blocks: [{ type: 'text' }, { type: 'video' }]` internally.

### Phase 2: Extract Spreadsheet/Chart/Quiz into Blocks
- Refactor `SpreadsheetWorkspace`, `ChartBuilder`, `QuizStep` into block renderers.
- Update `excel-basics-module.ts` and `charts-module.ts` to use new `blocks` array (still in TS).
- Update `StepContentArea` to delegate to `BlockRegistry`.

### Phase 3: New Progress Schema
- Add `step_completions` and `competency_progress` tables.
- Backfill from existing `lesson_progress.attempts` JSONB.
- Update `useProgress.ts` to write to new tables.

### Phase 4: JSON Module Authoring
- Build Zod schemas and validator.
- Create a module authoring UI (or at least a JSON upload flow).
- Convert `excel-basics-module.ts` → `excel-basics-module.json` as proof of concept.

### Phase 5: External Tools & New Topics
- Build `ToolRegistry`.
- Create first external tool (e.g., `email-simulator`).
- Launch Computer Literacy module.

---

## 6. Immediate Wins (Quick Fixes)

Even before the full refactor, we can make the current system more standardised:

1. **Add `video` support to the current `Step` type** — render an embedded player in `StepContentArea` when `mediaUrl` is present and matches a video pattern.
2. **Add a `topic` field to `Module`** — enables filtering on the student dashboard.
3. **Separate quiz scoring from dummy `task` objects** — let `QuizQuestion` hold its own `xpValue`, `hints`, and `successMessage`.
4. **Add `prerequisites` to `Lesson`** — simple array of lesson IDs; unlock logic in `ModuleLanding`.
5. **Compute `accuracy` in `useLessonPlayer`** — derive from attempts/hints and log it to analytics even if the DB schema doesn't store it yet.
