

## Step-Level Analytics for Teachers

### Overview
Add granular event tracking to the lesson player so teachers can see which steps students struggle with most, where they drop off, how long they spend, and how often they use hints. This data powers a new "Module Analytics" tab in the teacher dashboard.

### 1. New Database Table: `step_events`

A single append-only events table captures all analytics signals:

```text
step_events
-----------
id            uuid (PK, default gen_random_uuid())
user_id       uuid (NOT NULL)
module_id     text (NOT NULL)
lesson_id     text (NOT NULL)
step_id       text (NOT NULL)
event_type    text (NOT NULL)  -- 'step_start', 'step_complete', 'check_fail', 'hint_used'
metadata      jsonb (default '{}')  -- e.g. { attempt: 2, time_spent_seconds: 45 }
created_at    timestamptz (default now())
```

RLS policies:
- Students can INSERT their own events (`auth.uid() = user_id`)
- Students can SELECT their own events
- Teachers can SELECT all events (for analytics)

Index on `(module_id, lesson_id, step_id, event_type)` for fast aggregation queries.

### 2. Client-Side Event Logging

Modify `LessonPlayer.tsx` to emit events at key moments:

| Trigger | Event Type | Metadata |
|---------|-----------|----------|
| Step becomes active (index changes) | `step_start` | `{}` |
| Step marked complete (correct answer or instruction continue) | `step_complete` | `{ time_spent_seconds, attempt_count }` |
| Check returns incorrect/almost | `check_fail` | `{ attempt: N, feedback_type }` |
| Hint shown | `hint_used` | `{ hint_index }` |

Time tracking: record `Date.now()` when a step starts, compute duration on complete.

A lightweight `useStepAnalytics` hook will handle this:
- Accepts `moduleId`, `lessonId`, `userId`
- Exposes `logEvent(stepId, eventType, metadata)` 
- Batches inserts or fires individually (individual is fine for MVP given low volume)

### 3. Teacher Analytics View

Add a new "Analytics" tab inside the class-specific view (alongside "Students" and "Modules" tabs).

**Components:**

**ModuleAnalyticsView** -- the main analytics panel with:
- Module and lesson selector dropdowns
- Three data cards at the top:
  - Total step starts vs completes (drop-off indicator)
  - Average time per step
  - Average attempts per step

**MostFailedSteps table** -- sorted by failure count descending:

```text
| Step Title          | Lesson       | Fail Count | Avg Attempts | Avg Time | Hint Usage |
|---------------------|-------------|------------|-------------|----------|------------|
| Enter SUM formula   | Lesson 1    | 47         | 3.2         | 2m 15s   | 68%        |
| Create bar chart    | Lesson 3    | 31         | 2.8         | 1m 45s   | 52%        |
```

**Drop-off funnel** -- a simple bar chart (using Recharts, already installed) showing how many students reached each step in a lesson. Steep drops indicate problem areas.

### 4. Data Fetching

A new hook `useModuleAnalytics(moduleId, classId?)` will:
1. Query `step_events` aggregated by step_id and event_type
2. Optionally filter by class (join through `class_students` to scope by user_ids in that class)
3. Return structured data for the UI components

### 5. File Changes Summary

| File | Change |
|------|--------|
| **New migration** | Create `step_events` table with RLS policies and index |
| **New: `src/hooks/useStepAnalytics.ts`** | Hook to log events from the lesson player |
| **`src/components/LessonPlayer.tsx`** | Wire up the analytics hook -- log step_start, step_complete, check_fail, hint_used |
| **New: `src/hooks/useModuleAnalytics.ts`** | Hook to fetch and aggregate step events for the teacher view |
| **New: `src/components/ModuleAnalyticsView.tsx`** | Teacher-facing analytics panel with failed steps table and drop-off chart |
| **`src/pages/TeacherDashboard.tsx`** | Add "Analytics" tab in the class view |

### 6. Privacy and Performance Notes

- Events are scoped by RLS -- students can only write their own, teachers can read all
- The events table is append-only (no UPDATE/DELETE for students) to preserve data integrity
- For MVP, direct queries are fine. If event volume grows large, a database view or materialized aggregation can be added later
- No personally identifiable information beyond user_id is stored in events

