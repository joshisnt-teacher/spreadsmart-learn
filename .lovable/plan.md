

# Fix: Students Can't Open Modules (Redirect Loop)

## Problem

When a student clicks "Continue" on the dashboard, it navigates to `/`. But the recent redirect change in `Index.tsx` sends students right back to `/student` before the lesson player ever loads.

## Solution

Move the module/lesson player to its own route (`/module/:moduleId`) so it's independent of the `/` redirect logic. The student dashboard will link there instead of to `/`.

## Changes

### 1. Create a new Module Player page (`src/pages/ModulePlayer.tsx`)

A new page at `/module/:moduleId` that contains the module landing + lesson player logic currently in `Index.tsx`. It will:
- Read `moduleId` from the URL params (for now, only `excelBasicsModule` exists so it maps directly)
- Accept an optional `?lesson=lessonId` query param to jump straight into a lesson
- Show `ModuleLanding` by default, switch to `LessonPlayer` when a lesson is selected
- Include a "Back to Dashboard" button
- Use `useProgress` and `useStudentAssignments` as before

### 2. Register the route (`src/App.tsx`)

Add `<Route path="/module/:moduleId" element={<ModulePlayer />} />`.

### 3. Update StudentDashboard links (`src/pages/StudentDashboard.tsx`)

Change the "Continue" / "Start" button and lesson row clicks from `navigate('/')` to `navigate('/module/excel-basics')`.

### 4. Simplify Index.tsx (`src/pages/Index.tsx`)

The `/` route becomes a simple redirect hub: students go to `/student`, teachers go to `/dashboard`, unauthenticated users go to `/auth`. The module/lesson player logic is removed since it now lives in `ModulePlayer`.

