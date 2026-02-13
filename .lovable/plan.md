

# Excel Training Platform MVP — "ExcelPath"

## Overview
A web-based student learning platform that teaches Microsoft Excel through guided, interactive lessons with an embedded spreadsheet. The first iteration focuses on the core learning experience: an embedded spreadsheet with auto-marked tasks, progressing through the flagship "Excel Basics" module.

---

## Phase 1: Core Learning Experience (This Build)

### 1. Embedded Spreadsheet Workspace
- Use **FortuneSheet** (React-based, canvas-rendered, strong formula support including SUM, AVERAGE, MIN, MAX, COUNT, COUNTA, relative/absolute references)
- Wrap it in a custom component that supports:
  - **Locked cells** (non-editable) vs **highlighted editable cells**
  - **Progressive feature unlocking** — toolbar buttons/features hidden until the lesson enables them
  - **Formula bar** display
  - **Pre-loaded data** per step from the database
  - **Reset** to restore the step's initial state

### 2. Lesson Player Interface
A guided, step-by-step lesson experience with this layout:
- **Left sidebar**: Step list with progress indicators (completed/current/locked), lesson title
- **Center panel**: Instruction text, optional example image/GIF, "Why this matters" callout
- **Right/bottom panel**: Embedded spreadsheet workspace
- **Persistent controls**: Check, Hint, Reset Step, Continue (locked until correct)

### 3. Auto-Marking Engine
When a student clicks "Check":
- Validate **cell values** against expected outputs
- Validate **formulas** in target cells (not just results)
- Run a **hidden variant dataset** test to prevent hard-coded answers
- Check **fill-down consistency** where applicable
- Return structured feedback:
  - ✅ Correct — success message with skill reinforcement
  - ⚠️ Almost correct — specific improvement suggestion
  - ❌ Incorrect — hint toward the likely issue
- After 2+ failed attempts: unlock escalating hints

### 4. Flagship Module: "Excel Basics"
Seeded into the database with ~8 lessons and ~40-50 steps covering:
1. **Navigating a Spreadsheet** — selecting cells, ranges, basic movement
2. **Entering & Editing Data** — typing, deleting, undo
3. **Basic Formulas** — arithmetic operators (+, -, *, /)
4. **SUM & AVERAGE** — function syntax, ranges
5. **MIN, MAX, COUNT** — more functions, combining knowledge
6. **Fill Down & Patterns** — dragging formulas, relative references
7. **Absolute References** — $A$1 syntax, when and why
8. **Review & Challenge** — mixed tasks applying all skills

Each step includes: instruction text, optional media, spreadsheet initial state, task definition, expected outputs, hints, and XP value.

### 5. Basic Gamification
- **XP** earned per completed task (bonus for first-attempt success)
- **Badges** for lesson completion and special achievements (e.g., "Formula Rookie", "Perfect Score")
- Simple progress bar showing module completion percentage

---

## Phase 2: Authentication & Dashboards (Next Build)

### 6. Backend Setup (Lovable Cloud / Supabase)
- Database tables: users, classes, enrollments, modules, lessons, steps, tasks, worksheets, attempts, points, badges, user_roles
- Teacher accounts with email login
- Student accounts with username + PIN (no email required, pseudonymous)
- Role-based access (teacher vs student) stored in a separate user_roles table

### 7. Teacher Dashboard
- Create classes and generate join codes
- Bulk-create student accounts with pseudonymous usernames
- View student progress: module/lesson completion, attempts per task, common mistakes
- Assign modules to classes
- Configure: mastery requirements, attempt limits, hint availability, due dates

### 8. Student Dashboard
- View assigned modules with progress bars
- See XP total and badges earned
- Resume lessons from where they left off

---

## Architecture Principles
- **Database-driven content**: All modules, lessons, steps, and tasks stored in the database — adding new content requires no code changes
- **Modular task/checker system**: Task definitions and marking logic are generic, supporting future task types (upload-based, mini-games) as plugins
- **Upload-ready schema**: Database structure will accommodate future .xlsx upload tasks even though they won't be implemented yet
- **Extensible gamification**: Points and badges system designed to support future additions (leaderboards, streaks, etc.)

---

## Design Direction
- Clean, academic but modern aesthetic
- Minimal distractions — focus on the learning content
- High contrast, clear labels, keyboard-friendly
- The spreadsheet feels familiar but simplified
- Mobile-responsive dashboards (lesson player optimized for desktop/tablet)

