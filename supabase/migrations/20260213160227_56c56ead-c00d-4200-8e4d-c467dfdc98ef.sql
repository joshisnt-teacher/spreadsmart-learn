
-- Create assignments table
CREATE TABLE public.assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL,
  class_id uuid REFERENCES public.classes(id) ON DELETE CASCADE,
  student_user_id uuid,
  module_id text NOT NULL,
  lesson_id text,
  step_id text,
  live_date timestamptz NOT NULL DEFAULT now(),
  due_date timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Teachers can CRUD their own assignments
CREATE POLICY "Teachers can view own assignments"
  ON public.assignments FOR SELECT
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can create assignments"
  ON public.assignments FOR INSERT
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update own assignments"
  ON public.assignments FOR UPDATE
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete own assignments"
  ON public.assignments FOR DELETE
  USING (auth.uid() = teacher_id);

-- Students can view assignments targeting them (directly or via class) that are live
CREATE POLICY "Students can view their assignments"
  ON public.assignments FOR SELECT
  USING (
    live_date <= now()
    AND (
      student_user_id = auth.uid()
      OR (
        class_id IS NOT NULL
        AND EXISTS (
          SELECT 1 FROM public.class_students
          WHERE class_students.class_id = assignments.class_id
            AND class_students.student_user_id = auth.uid()
        )
      )
    )
  );

-- Index for common queries
CREATE INDEX idx_assignments_class_id ON public.assignments(class_id);
CREATE INDEX idx_assignments_teacher_id ON public.assignments(teacher_id);
CREATE INDEX idx_assignments_student_user_id ON public.assignments(student_user_id);
