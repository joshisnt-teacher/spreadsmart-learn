

## Bug: Module Progress Shows 0 XP / No Completed Lessons

### Root Cause: Race Condition in `useProgress`

The `useProgress` hook has a classic async race condition:

1. `ModulePlayer` initially renders with `currentModule = undefined`, so `useProgress('')` is called
2. The hook fires an async query with `module_id = ''` (Query A)
3. A moment later, `currentModule` loads, so `useProgress('excel-basics')` is called
4. The hook fires a new async query with `module_id = 'excel-basics'` (Query B)
5. **Query B resolves first** with the correct progress data and updates state
6. **Query A resolves second** with `null` (no module with id '') and **overwrites the correct data** with empty arrays and 0 XP

Additionally, `loading` is never reset to `true` when `moduleId` changes, so the loading screen is skipped and the user briefly sees empty data even in the best case.

The database confirms josh (user `ccaeef26`) has 4/5 lessons completed with 420 XP -- the data is there, it's just being overwritten by a stale query response.

### Fix (single file: `src/hooks/useProgress.ts`)

Add a stale-query guard using an `ignore` flag in the useEffect cleanup, and reset loading when the moduleId changes:

```typescript
useEffect(() => {
  if (!user) {
    setState({ completedLessonIds: [], totalXp: 0, loading: false });
    return;
  }

  let ignore = false;                    // <-- guard flag
  setState(prev => ({ ...prev, loading: true }));  // <-- reset loading

  const load = async () => {
    const { data } = await supabase
      .from('module_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('module_id', moduleId)
      .maybeSingle();

    if (ignore) return;                  // <-- discard stale result

    setState({
      completedLessonIds: data?.completed_lesson_ids ?? [],
      totalXp: data?.total_xp ?? 0,
      loading: false,
    });
  };

  load();
  return () => { ignore = true; };      // <-- cleanup cancels stale query
}, [user, moduleId]);
```

This is a 3-line addition to the existing code. No other files need to change.

### Why This Fully Fixes the Issue

- When `moduleId` changes from `''` to `'excel-basics'`, the cleanup runs and sets `ignore = true` for the old query
- If the old query resolves after the new one, its `setState` is skipped
- `loading` is reset to `true` so the loading screen shows until the correct data arrives
- The student sees their actual progress (420 XP, 4/5 lessons) immediately when the page loads

