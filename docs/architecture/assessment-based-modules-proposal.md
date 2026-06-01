# Assessment-Based Module Architecture

## Core Idea

Instead of tracking granular competencies on every step, we keep the student experience simple:

1. **Practice Steps** — Students learn, explore, and earn XP. Attempts, hints, and mistakes are fine. This is formative.
2. **Lesson Assessment** — At the end of every lesson, a **single assessment step** tests whether they can actually do the thing independently.
3. **The assessment result is the signal.** Teachers see "completed 7/8 steps, **passed assessment**" or "completed 7/8 steps, **failed assessment**". The assessment is what determines mastery and unlock progression.

This mirrors how actual classrooms work: practice exercises + a quiz/test at the end.

---

## Why This Is Better

| Concern | Full Competency Model | Assessment-Based Model |
|---------|----------------------|------------------------|
| Data complexity | New tables, JSON parsing, competency trees | One extra boolean/score per lesson |
| Teacher mental load | "Ava is level 2 on `files.create-folder`" | "Ava passed the File Explorer assessment" |
| Student experience | Same XP + confetti flow | Same XP + confetti flow |
| Analytics | Complex aggregation queries | Simple: "What % passed the assessment?" |
| Implementation time | 2–4 weeks | 3–5 days |
| Works across topics | Yes, but requires mapping every step to a competency | Yes — just swap the assessment task type |

---

## How It Works in Practice

### Lesson Structure (unchanged for practice steps)

```
Lesson: "Files & Folders"
├── Step 1: Instruction — "What is a file?" (instruction-full)
├── Step 2: Task — "Navigate to the Maths folder" (external-tool)
├── Step 3: Task — "Create a folder called English" (external-tool)
└── Step 4: Assessment — "Create 3 folders and organise these files" (external-tool, timed, no hints)
```

### Assessment Rules

- **No hints** during assessment (or hints cost significant XP/penalty).
- **Must pass to unlock the next lesson.** If they fail, they retry the assessment or go back to practice.
- **Assessment score is separate from XP.** You can get max lesson XP from practice but still fail the assessment.
- **Attempts are logged** but only the *best* attempt matters for progression.

### What the Teacher Sees

| Student | Steps Completed | Assessment | Status |
|---------|----------------|------------|--------|
| Ava | 7/8 | ✅ Pass | Ready for next lesson |
| Liam | 8/8 | ❌ Fail (2 attempts) | Needs remediation |
| Zoe | 5/8 | ⏳ Not attempted | In progress |

---

## Minimal Data Changes

We can do this with **almost no schema changes**.

### Option A: Add one column (minimal)

```sql
ALTER TABLE lesson_progress
  ADD COLUMN assessment_passed BOOLEAN DEFAULT NULL;
```

- `NULL` = not attempted yet
- `false` = attempted and failed
- `true` = passed

### Option B: Add a lightweight results table (recommended)

```sql
CREATE TABLE lesson_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  passed BOOLEAN NOT NULL,
  score NUMERIC(5,2), -- optional: 0-100 or percent correct
  attempt_count INTEGER NOT NULL DEFAULT 1,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);
```

This gives you:
- A clear pass/fail record per lesson
- Optional score for "how well did they do?"
- Attempt count for identifying struggling students
- Queryable analytics: `SELECT lesson_id, AVG(score), COUNT(*) FILTER (WHERE passed) FROM lesson_assessments GROUP BY lesson_id`

---

## How Assessment Steps Work in Code

### 1. Mark a step as `isAssessment: true`

In the module data, the final step of each lesson gets a flag:

```ts
// In the Step type (or module-v2 Block model)
interface Step {
  // ... existing fields
  isAssessment?: boolean;  // NEW
  assessmentConfig?: {
    timeLimitSeconds?: number;
    maxAttempts?: number;
    passingScore?: number; // e.g. 80% of expectations must pass
  };
}
```

### 2. LessonPlayer treats assessments differently

In `useLessonPlayer.ts`:

```ts
const isAssessment = currentStep?.isAssessment === true;

// During assessment:
// - Disable hints (or make them unavailable)
// - Track as assessment attempt, not practice attempt
// - If passed: mark assessment_passed = true, allow lesson completion
// - If failed: show "Review the practice steps and try again", stay on step
```

### 3. Unlock logic uses assessment results

In `ModuleLanding.tsx` / `LessonSidebar`:

```ts
function isLessonUnlocked(lesson: Lesson, progress: ModuleProgress): boolean {
  // First lesson is always unlocked
  if (!lesson.prerequisites || lesson.prerequisites.length === 0) return true;
  
  // Subsequent lessons require previous lesson's assessment to be passed
  return lesson.prerequisites.every(prevLessonId => {
    const prevAssessment = assessments[prevLessonId];
    return prevAssessment?.passed === true;
  });
}
```

---

## Cross-Topic Standardisation

This model makes it trivial to support any topic:

| Topic | Practice Steps | Assessment |
|-------|---------------|------------|
| **Excel Basics** | Formula drills, fill-handle tasks | "Calculate this budget sheet from scratch" |
| **Computer Literacy** | File navigation sim, email sim | "Organise these files and send an email with attachments" |
| **Email Etiquette** | Subject line exercises, tone quizzes | "Draft a professional email to a teacher asking for an extension" |
| **Charts** | Chart reading, builder exercises | "Given this raw data, choose and build the right chart" |

The **practice steps** can use any block type (spreadsheet, external-tool, quiz, video).
The **assessment** is just another step with `isAssessment: true` and a task that combines the skills.

---

## UX Flow

### Student Flow

1. Student opens lesson, sees practice steps.
2. They check their work, get hints if stuck, earn XP.
3. They reach the final step — the Assessment.
4. UI changes slightly: banner says "Assessment — no hints available", maybe a timer.
5. They complete the task and click Check.
6. **Pass:** "Assessment passed! 🎉 You can move to the next lesson." Lesson completes, XP tallied.
7. **Fail:** "Not quite. Review the practice steps and try again." They can retry immediately or go back.

### Teacher Flow

1. Teacher opens Class Detail view.
2. Sees a table: Student | Lesson | Steps Done | Assessment | Action Needed
3. Clicks a student to see their assessment attempt history (if using Option B table).

---

## Implementation Checklist (3–5 days)

- [ ] Add `isAssessment` and `assessmentConfig` to `Step` type
- [ ] Create `lesson_assessments` table (or add `assessment_passed` to existing table)
- [ ] Update `useLessonPlayer.ts` to handle assessment mode (no hints, different logging)
- [ ] Update `FeedbackBar.tsx` to show assessment-specific messaging
- [ ] Update `LessonSidebar` / `ModuleLanding` to use assessment pass for unlock logic
- [ ] Update `ClassDetailView` / teacher dashboard to show assessment column
- [ ] Write one Computer Literacy lesson with a file-explorer assessment to prove the model

---

## Summary

> **Students** get the same XP-and-confetti experience.  
> **Teachers** get a clean pass/fail signal per lesson.  
> **You** get cross-topic standardisation without complex data models.  
> **Analytics** become simple: "What % passed the assessment?" instead of "What is the weighted average competency level across nested skill trees?"

This is the 80/20 solution. It solves the principal's concern ("did they actually learn it?") with minimal architectural overhead.
