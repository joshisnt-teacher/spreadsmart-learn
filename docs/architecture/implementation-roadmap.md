# Implementation Roadmap

## What I Built For You

To make the proposal concrete, I've created **starter files** that demonstrate the new architecture:

| File | Purpose |
|------|---------|
| `src/types/module-v2.ts` | New type system (blocks, layouts, competencies) |
| `src/components/blocks/BlockRegistry.tsx` | Registry pattern for rendering blocks |
| `src/components/blocks/StepLayoutEngine.tsx` | Layout engine that arranges blocks per step |
| `src/components/blocks/TextBlockRenderer.tsx` | Reusable text renderer with markdown support |
| `src/components/blocks/VideoBlockRenderer.tsx` | YouTube/Vimeo embed renderer |
| `src/components/blocks/CalloutBlockRenderer.tsx` | Tip / warning / why-it-matters boxes |
| `src/components/blocks/SpreadsheetBlockRenderer.tsx` | Wraps existing spreadsheet workspace |
| `src/components/blocks/QuizBlockRenderer.tsx` | Wraps existing quiz component |
| `src/lib/module-validator.ts` | Zod schema to validate JSON modules |
| `src/modules/computer-literacy-101.json` | Example JSON module for non-Excel content |

---

## Immediate Next Steps

You have three options for how to proceed:

### Option A: Quick Wins (1–2 days)
Leave the current architecture alone but add video support and decouple quiz scoring.

1. **Add video support** to the current `Step` type by checking `mediaUrl` in `StepContentArea.tsx`.
2. **Remove dummy `task` objects from quiz steps** — move `xpValue`, `hints`, `successMessage` into `QuizQuestion`.
3. **Add `topic` to `Module`** and filter the student dashboard by topic.
4. **Add `prerequisites` to `Lesson`** with simple unlock logic in `ModuleLanding`.

### Option B: Gradual Migration (1–2 weeks)
Adopt the block system internally while keeping the old module files working.

1. **Create a migration helper** that converts the old `Step` shape into the new `StepBlock[]` array at runtime.
2. **Replace `StepContentArea.tsx`** with `StepLayoutEngine.tsx` that consumes the migrated blocks.
3. **Update `excel-basics-module.ts` and `charts-module.ts`** to use the new block syntax (still TypeScript).
4. **Keep the existing progress tables** but start computing `accuracy` in `useLessonPlayer.ts` and logging it.

### Option C: Full Refactor (2–4 weeks)
Complete the v2 architecture including database changes and JSON authoring.

1. **Write Supabase migrations** for `step_completions` and `competency_progress`.
2. **Build the external tool registry** and create a `file-explorer` or `email-simulator` tool.
3. **Add a module upload/management UI** for teachers to import JSON modules.
4. **Backfill existing progress** into the new tables.
5. **Launch the Computer Literacy module** as the first non-Excel proof of concept.

---

## Key Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Existing student progress is lost | Backfill from `lesson_progress.attempts` JSONB into `step_completions` |
| Teachers are confused by new authoring format | Keep the TypeScript authoring path alive during transition; JSON is optional |
| External tools are hard to build | Start with simple DOM-based simulators (not full emulators) |
| Performance of block registry | Use React.lazy for heavy block renderers (spreadsheet, chart builder) |

---

## What I Recommend

**Start with Option B (Gradual Migration).** It gives you:
- Video blocks and rich instructional layouts immediately.
- A standardised internal model that makes Option C easier later.
- No disruption to existing students or modules.
- The ability to launch a Computer Literacy module using the `external-tool` block once you build the simulator.

If you want me to proceed with any of these options, just say the word and I'll start cutting the code.
