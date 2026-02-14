
-- Create module status enum
CREATE TYPE public.module_status AS ENUM ('draft', 'published');

-- Custom modules table
CREATE TABLE public.custom_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'Untitled Module',
  description text NOT NULL DEFAULT '',
  estimated_minutes integer NOT NULL DEFAULT 15,
  status module_status NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.custom_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can view own modules"
  ON public.custom_modules FOR SELECT
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can create modules"
  ON public.custom_modules FOR INSERT
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update own modules"
  ON public.custom_modules FOR UPDATE
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete own modules"
  ON public.custom_modules FOR DELETE
  USING (auth.uid() = teacher_id);

-- Students can view published modules assigned to them
CREATE POLICY "Students can view assigned published modules"
  ON public.custom_modules FOR SELECT
  USING (
    status = 'published' AND EXISTS (
      SELECT 1 FROM public.assignments a
      WHERE a.module_id = custom_modules.id::text
        AND (
          a.student_user_id = auth.uid()
          OR (a.class_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.class_students cs
            WHERE cs.class_id = a.class_id AND cs.student_user_id = auth.uid()
          ))
        )
    )
  );

CREATE TRIGGER update_custom_modules_updated_at
  BEFORE UPDATE ON public.custom_modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Custom lessons table
CREATE TABLE public.custom_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES public.custom_modules(id) ON DELETE CASCADE,
  "order" integer NOT NULL DEFAULT 0,
  title text NOT NULL DEFAULT 'Untitled Lesson',
  description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.custom_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can view own lessons"
  ON public.custom_lessons FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.custom_modules m WHERE m.id = custom_lessons.module_id AND m.teacher_id = auth.uid()
  ));

CREATE POLICY "Teachers can create lessons"
  ON public.custom_lessons FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.custom_modules m WHERE m.id = custom_lessons.module_id AND m.teacher_id = auth.uid()
  ));

CREATE POLICY "Teachers can update own lessons"
  ON public.custom_lessons FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.custom_modules m WHERE m.id = custom_lessons.module_id AND m.teacher_id = auth.uid()
  ));

CREATE POLICY "Teachers can delete own lessons"
  ON public.custom_lessons FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.custom_modules m WHERE m.id = custom_lessons.module_id AND m.teacher_id = auth.uid()
  ));

CREATE POLICY "Students can view lessons of assigned published modules"
  ON public.custom_lessons FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.custom_modules m
    WHERE m.id = custom_lessons.module_id AND m.status = 'published'
      AND EXISTS (
        SELECT 1 FROM public.assignments a
        WHERE a.module_id = m.id::text
          AND (a.student_user_id = auth.uid() OR (a.class_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.class_students cs WHERE cs.class_id = a.class_id AND cs.student_user_id = auth.uid()
          )))
      )
  ));

-- Custom steps table
CREATE TABLE public.custom_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES public.custom_lessons(id) ON DELETE CASCADE,
  "order" integer NOT NULL DEFAULT 0,
  type text NOT NULL DEFAULT 'instruction',
  title text NOT NULL DEFAULT 'Untitled Step',
  instruction text NOT NULL DEFAULT '',
  why_it_matters text,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.custom_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can view own steps"
  ON public.custom_steps FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.custom_lessons l
    JOIN public.custom_modules m ON m.id = l.module_id
    WHERE l.id = custom_steps.lesson_id AND m.teacher_id = auth.uid()
  ));

CREATE POLICY "Teachers can create steps"
  ON public.custom_steps FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.custom_lessons l
    JOIN public.custom_modules m ON m.id = l.module_id
    WHERE l.id = custom_steps.lesson_id AND m.teacher_id = auth.uid()
  ));

CREATE POLICY "Teachers can update own steps"
  ON public.custom_steps FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.custom_lessons l
    JOIN public.custom_modules m ON m.id = l.module_id
    WHERE l.id = custom_steps.lesson_id AND m.teacher_id = auth.uid()
  ));

CREATE POLICY "Teachers can delete own steps"
  ON public.custom_steps FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.custom_lessons l
    JOIN public.custom_modules m ON m.id = l.module_id
    WHERE l.id = custom_steps.lesson_id AND m.teacher_id = auth.uid()
  ));

CREATE POLICY "Students can view steps of assigned published modules"
  ON public.custom_steps FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.custom_lessons l
    JOIN public.custom_modules m ON m.id = l.module_id
    WHERE l.id = custom_steps.lesson_id AND m.status = 'published'
      AND EXISTS (
        SELECT 1 FROM public.assignments a
        WHERE a.module_id = m.id::text
          AND (a.student_user_id = auth.uid() OR (a.class_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.class_students cs WHERE cs.class_id = a.class_id AND cs.student_user_id = auth.uid()
          )))
      )
  ));

-- Indexes for performance
CREATE INDEX idx_custom_lessons_module_id ON public.custom_lessons(module_id);
CREATE INDEX idx_custom_steps_lesson_id ON public.custom_steps(lesson_id);
CREATE INDEX idx_custom_modules_teacher_id ON public.custom_modules(teacher_id);
CREATE INDEX idx_custom_modules_status ON public.custom_modules(status);
