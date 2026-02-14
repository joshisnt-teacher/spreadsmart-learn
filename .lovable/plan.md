

# Fix: AI Module Generation Not Saving Steps

## What Went Well
The AI edge function produced excellent content -- a full "Computer Hardware Essentials" module with 6 steps (instructions, spreadsheet tasks with SUM formulas, a quiz, and memory classification). The problem is purely in how the generated content gets saved to the database.

## The Problem
The `handleAiResult` function has a race condition. Each call to `builder.addLesson()` or `builder.addStep()` triggers a database insert AND a React state refetch. But the code then immediately reads `builder.fullModule` expecting the freshly-fetched data -- which hasn't arrived yet because React state updates are asynchronous.

Result: the module metadata (title, description) saved correctly, one empty "Untitled Lesson" was created, but zero steps were populated.

## The Fix

Refactor `handleAiResult` to **not rely on React state between operations**. Instead:

1. Insert lessons directly via Supabase and capture the returned IDs immediately
2. Insert steps directly via Supabase using those lesson IDs
3. Only call `builder.refetch()` once at the very end to sync the UI

### Changes to `src/pages/ModuleBuilder.tsx`

Replace the `handleAiResult` function's `generate_module` branch:

- Instead of calling `builder.addLesson()` (which triggers a refetch), directly insert into `custom_lessons` and capture the returned `id`
- Instead of calling `builder.addStep()`, directly insert into `custom_steps` with the full config in one go
- This eliminates the need for multiple refetch cycles and the stale-state problem
- One single `builder.refetch()` at the end syncs the UI

### Changes to `src/pages/ModuleBuilder.tsx` (generate_step branch)

Apply the same pattern: insert the step directly with its config rather than adding a blank step and then updating it in a second pass.

### Changes to `src/hooks/useCustomModules.ts`

No changes needed -- the builder hook methods are fine for interactive use. The AI handler will bypass them for bulk operations only.

## Technical Detail

```text
Before (broken):
  addLesson() -> fetchFull() [async, state not ready]
  refetch()   -> fetchFull() [async, state not ready]  
  read builder.fullModule -> STALE DATA (empty lessons)
  loop does nothing

After (fixed):
  supabase.insert('custom_lessons') -> returns { id } immediately
  supabase.insert('custom_steps', { lesson_id, config, ... }) -> done
  builder.refetch() once -> UI updates with all data
```

The key insight: for bulk sequential operations, bypass the React-state-based builder methods and use direct Supabase calls, collecting returned IDs along the way.
