

# Fix Module Builder Save Performance + Inline Title Editing

## Problem

Three inputs in the Module Builder call `builder.updateModule()` or `builder.updateLesson()` on every keystroke. Each call writes to the database AND refetches the entire module tree, causing extreme jankiness -- especially in the FortuneSheet editor which gets remounted on every refetch.

**Affected inputs:**
- Module Title (Settings panel, line 173)
- Module Description (Settings panel, line 189)
- Estimated Minutes (Settings panel, line 181)
- Lesson Title (Steps column, line 249)

The step editor already uses local state with an explicit "Save Step" button -- which is the correct pattern.

## Changes

### 1. Local State for Settings Panel (`ModuleBuilder.tsx`)

Add local state variables for module title, description, and estimated minutes. Populate them from `builder.module` when it loads. Only call `builder.updateModule()` on blur (when the user clicks away from the field).

```text
Before: onChange -> DB write + refetch (every keystroke)
After:  onChange -> local state only | onBlur -> DB write + refetch (once)
```

### 2. Local State for Lesson Title (`ModuleBuilder.tsx`)

Same pattern: add a local `lessonTitle` state, populate from `currentLesson.title`, save on blur via `builder.updateLesson()`.

### 3. Click-to-Edit Module Title in Header (`ModuleBuilder.tsx`)

Replace the static `<h1>` title in the header (line 146) with a click-to-edit inline input:
- Default: displays the title as text
- On click: transforms into an `<Input>` field, auto-focused
- On blur or Enter key: saves to local state (and syncs to DB)
- Shows a subtle pencil icon on hover to indicate editability

### 4. Files to Modify

**`src/pages/ModuleBuilder.tsx`** only:
- Add `moduleTitle`, `moduleDescription`, `moduleMinutes`, `lessonTitle` local state
- Add `useEffect` to sync local state from `builder.module` and `currentLesson`
- Settings panel inputs: change `onChange` to update local state, add `onBlur` to save
- Lesson title input: same treatment
- Header title: replace `<h1>` with click-to-edit component
- No changes to `useCustomModules.ts` or any other files

### Technical Notes

- The `useEffect` syncing local state should depend on `builder.module?.id` and `builder.module?.updated_at` to avoid overwriting user edits during typing
- For the lesson title, sync should depend on `currentLesson?.id` (already done for step state)
- The click-to-edit title uses a boolean `isEditingTitle` state to toggle between display and input mode
