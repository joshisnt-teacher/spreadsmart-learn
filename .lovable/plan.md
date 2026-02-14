

# Teacher Module Builder -- Investigation and Implementation Plan

## Feasibility Assessment

This is a **large but achievable** feature. The current architecture stores modules as hardcoded TypeScript objects. Moving to database-driven modules with a visual builder requires new database tables, a multi-step editor UI, and refactoring how modules are loaded.

## Current Architecture (What We're Working With)

Modules are nested TypeScript constants:

```text
Module
  +-- id, title, description, estimatedMinutes
  +-- Lesson[]
        +-- id, order, title, description
        +-- Step[]
              +-- id, order, title, instruction, type, whyItMatters
              +-- initialSheetState? (celldata, row, column, config)
              +-- task? (expectations, editableCells, hints, xpValue, bonusXp, messages)
              +-- quiz? (type, options, correctAnswer, acceptableAnswers, explanation)
              +-- tableTask? (columns, data, question, correctAnswer, enableSort, enableFilter)
              +-- chartConfig? / chartTask?
```

The LessonPlayer, marking engine, SpreadsheetWorkspace, InteractiveTable, and ChartBuilder all consume these types directly. They don't care where the data comes from -- they just need objects matching the `Module` / `Lesson` / `Step` interfaces.

## Database Design

### New Tables

**`custom_modules`** -- Stores the top-level module metadata

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| teacher_id | uuid (FK auth.users) | Owner |
| title | text | Module name |
| description | text | |
| estimated_minutes | integer | |
| status | enum: draft/published | Only published modules are visible to students |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**`custom_lessons`** -- Lessons within a custom module

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| module_id | uuid (FK custom_modules) | |
| order | integer | Sort order |
| title | text | |
| description | text | |

**`custom_steps`** -- Steps within a lesson (stores all step data as JSONB)

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| lesson_id | uuid (FK custom_lessons) | |
| order | integer | Sort order |
| type | text | instruction, task, quiz, table-task, chart, challenge |
| title | text | |
| instruction | text | Markdown content |
| why_it_matters | text | Optional |
| config | jsonb | All type-specific config (sheet state, task, quiz, tableTask, chartConfig) |

Using a single `config` JSONB column for step-type-specific data keeps the schema simple while supporting all current and future step types.

### RLS Policies

- Teachers can CRUD their own modules (WHERE teacher_id = auth.uid())
- Students can SELECT published modules that are assigned to them (via assignments table)
- No cross-teacher access

## Builder Interface Design

### Module Editor Page (`/dashboard/module-builder/:moduleId?`)

A multi-panel editor with three levels of navigation:

```text
+-------------------------------------------+
| Module Settings (title, description, etc) |
+--------+----------------------------------+
| Lesson | Step Editor                      |
| List   |                                  |
|        | [Type selector]                  |
| L1 *   | [Title + Instruction fields]     |
| L2     | [Type-specific config panel]     |
| L3     |   - Spreadsheet builder          |
|        |   - Quiz builder                 |
|        |   - Table builder                |
|        |   - Chart builder                |
+--------+----------------------------------+
```

### Step Type Editors

**Instruction Step**: Title, rich-text instruction area (markdown), optional "Why It Matters" text, optional spreadsheet preview (read-only demonstration).

**Task Step (Spreadsheet)**: 
- A live FortuneSheet instance where the teacher fills in initial data
- A cell selector to mark which cells are editable
- For each editable cell: expected value, expected formula (optional), tolerance
- Hints (ordered list of text inputs)
- Success/incorrect/almost messages
- XP value and bonus XP

**Quiz Step**: Question text, answer type (multiple-choice or short-answer), correct answer, acceptable alternatives, explanation.

**Table Task Step**: Column definitions (name + type), row data entry (a simple editable grid), question, correct answer, acceptable answers, toggle sort/filter.

**Chart Step**: Would be deferred to Phase 2 due to complexity (requires linking chart config to sheet data).

### How the Spreadsheet Builder Works

This is the trickiest part. The teacher needs to:

1. Enter data into a live spreadsheet (reuse the existing FortuneSheet component in "unlocked" mode)
2. Click cells to toggle them as "editable" (highlighted in a different colour)
3. For editable cells, set expected values/formulas in a side panel

The builder would capture the FortuneSheet state on save and serialise it into the `CellData[]` format the system already uses. A "preview" button would let them test the step as a student would see it.

## Module Loading Refactor

### Hybrid Registry

The existing `moduleRegistry` would become a hybrid that serves both hardcoded and database modules:

```typescript
// module-registry.ts (updated)
export async function getAllModulesForUser(userId: string): Promise<Module[]> {
  // 1. Start with hardcoded built-in modules
  const builtIn = [excelBasicsModule, chartsModule];
  
  // 2. Fetch published custom modules assigned to this user
  const { data } = await supabase
    .from('custom_modules')
    .select('*, custom_lessons(*, custom_steps(*))')
    .eq('status', 'published');
  
  // 3. Transform DB rows into Module objects
  const custom = data?.map(transformDbModule) ?? [];
  
  return [...builtIn, ...custom];
}
```

A `transformDbModule()` function converts the flat DB structure back into the nested `Module` type that LessonPlayer already expects. No changes needed to LessonPlayer, marking engine, or any rendering components.

## Risk Assessment

### High Risk Areas

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Spreadsheet state serialisation** | If celldata format is wrong, the sheet won't render or marking breaks | Build a robust serialiser with validation; add a "Preview as Student" mode |
| **Formula expectations** | Teachers may set impossible or ambiguous formula checks | Provide a "test your answer" button in the builder that runs the marking engine |
| **JSONB data corruption** | Invalid JSON in the config column breaks step loading | Validate with Zod schema before saving; wrap step rendering in error boundaries |
| **Large payloads** | A module with many steps could produce large JSONB objects | JSONB in Postgres handles this well (up to 1GB), but add client-side size warnings |
| **XP gaming** | Custom modules could set absurdly high XP values | Cap XP per step (e.g., max 50) and validate on save |

### Medium Risk Areas

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Draft/published state confusion** | Students seeing incomplete modules | Strict status filtering in queries; clear UI indicators |
| **Ordering bugs** | Steps or lessons appearing in wrong order | Use integer ordering with drag-and-drop reorder; validate no gaps |
| **Cross-teacher visibility** | Teacher A seeing Teacher B's drafts | Strict RLS policies on all custom_ tables |

### Low Risk Areas

- Existing components (LessonPlayer, marking engine, SpreadsheetWorkspace) don't need changes -- they consume the `Module` type interface regardless of data source
- The assignment system already works with module/lesson IDs -- custom modules just use UUID IDs instead of string slugs

## Phased Implementation

### Phase 1: Foundation (recommended starting point)
- Database tables and RLS policies
- Module metadata editor (create/edit/delete modules and lessons)
- Instruction and Quiz step builders
- Module loading from database
- Publish/draft toggle

### Phase 2: Spreadsheet Builder
- FortuneSheet-based cell data editor
- Editable cell selector
- Task expectation configuration (values, formulas, hints)
- Preview mode

### Phase 3: Table Task and Chart Builders
- Interactive table data editor
- Chart configuration builder
- Challenge step support

### Phase 4: Polish
- Drag-and-drop reordering for lessons and steps
- Module duplication/templating
- Import/export modules as JSON

## Files to Create
- `src/pages/ModuleBuilder.tsx` -- Main builder page
- `src/components/builder/ModuleSettings.tsx` -- Title/description form
- `src/components/builder/LessonList.tsx` -- Sidebar lesson navigator
- `src/components/builder/StepEditor.tsx` -- Step type router
- `src/components/builder/InstructionEditor.tsx` -- Instruction step form
- `src/components/builder/QuizEditor.tsx` -- Quiz step form
- `src/components/builder/TaskEditor.tsx` -- Spreadsheet task form
- `src/components/builder/TableTaskEditor.tsx` -- Table task form
- `src/components/builder/SpreadsheetEditor.tsx` -- FortuneSheet wrapper for building initial states
- `src/hooks/useCustomModules.ts` -- CRUD hooks for custom modules
- `src/lib/module-transform.ts` -- DB row to Module type transformer

## Files to Modify
- `src/data/module-registry.ts` -- Add async loading of custom modules
- `src/pages/TeacherDashboard.tsx` -- Add "Create Module" button and list custom modules
- `src/App.tsx` -- Add route for `/dashboard/module-builder/:moduleId?`
- `src/pages/ModulePlayer.tsx` -- Support loading custom modules by UUID
- `src/hooks/useAssignments.ts` -- Support assigning custom modules

## Estimated Effort

This is a substantial feature -- roughly equivalent to building a simple CMS. Phase 1 alone would be a significant amount of work. The good news is that the existing rendering and marking infrastructure doesn't need to change at all, which eliminates the biggest source of risk.

