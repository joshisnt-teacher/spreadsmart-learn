-- ============================================================
-- Circuit (spreadsmart-learn) catch-up migration
-- Run this in the Supabase SQL editor if custom_modules,
-- custom_lessons, and custom_steps are missing.
-- Safe to re-run: uses IF NOT EXISTS on tables/indexes,
-- and DROP IF EXISTS before each policy.
-- ============================================================

-- 1. Enum (use DO block — CREATE TYPE has no IF NOT EXISTS) ------
DO $$ BEGIN
  CREATE TYPE public.module_status AS ENUM ('draft', 'published');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. custom_modules ---------------------------------------------
CREATE TABLE IF NOT EXISTS public.custom_modules (
  id                uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id        uuid          NOT NULL,
  title             text          NOT NULL DEFAULT 'Untitled Module',
  description       text          NOT NULL DEFAULT '',
  estimated_minutes integer       NOT NULL DEFAULT 15,
  banner_url        text          DEFAULT NULL,
  status            module_status NOT NULL DEFAULT 'draft',
  created_at        timestamptz   NOT NULL DEFAULT now(),
  updated_at        timestamptz   NOT NULL DEFAULT now()
);

ALTER TABLE public.custom_modules ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_custom_modules_teacher_id ON public.custom_modules(teacher_id);
CREATE INDEX IF NOT EXISTS idx_custom_modules_status     ON public.custom_modules(status);

DROP POLICY IF EXISTS "Teachers can view own modules"   ON public.custom_modules;
DROP POLICY IF EXISTS "Teachers can create modules"     ON public.custom_modules;
DROP POLICY IF EXISTS "Teachers can update own modules" ON public.custom_modules;
DROP POLICY IF EXISTS "Teachers can delete own modules" ON public.custom_modules;

CREATE POLICY "Teachers can view own modules"
  ON public.custom_modules FOR SELECT USING (auth.uid() = teacher_id);
CREATE POLICY "Teachers can create modules"
  ON public.custom_modules FOR INSERT WITH CHECK (auth.uid() = teacher_id);
CREATE POLICY "Teachers can update own modules"
  ON public.custom_modules FOR UPDATE USING (auth.uid() = teacher_id);
CREATE POLICY "Teachers can delete own modules"
  ON public.custom_modules FOR DELETE USING (auth.uid() = teacher_id);

-- 3. custom_lessons ---------------------------------------------
CREATE TABLE IF NOT EXISTS public.custom_lessons (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id   uuid        NOT NULL REFERENCES public.custom_modules(id) ON DELETE CASCADE,
  "order"     integer     NOT NULL DEFAULT 0,
  title       text        NOT NULL DEFAULT 'Untitled Lesson',
  description text        NOT NULL DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.custom_lessons ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_custom_lessons_module_id ON public.custom_lessons(module_id);

DROP POLICY IF EXISTS "Teachers can view own lessons"   ON public.custom_lessons;
DROP POLICY IF EXISTS "Teachers can create lessons"     ON public.custom_lessons;
DROP POLICY IF EXISTS "Teachers can update own lessons" ON public.custom_lessons;
DROP POLICY IF EXISTS "Teachers can delete own lessons" ON public.custom_lessons;

CREATE POLICY "Teachers can view own lessons"
  ON public.custom_lessons FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.custom_modules m WHERE m.id = custom_lessons.module_id AND m.teacher_id = auth.uid())
  );
CREATE POLICY "Teachers can create lessons"
  ON public.custom_lessons FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.custom_modules m WHERE m.id = custom_lessons.module_id AND m.teacher_id = auth.uid())
  );
CREATE POLICY "Teachers can update own lessons"
  ON public.custom_lessons FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.custom_modules m WHERE m.id = custom_lessons.module_id AND m.teacher_id = auth.uid())
  );
CREATE POLICY "Teachers can delete own lessons"
  ON public.custom_lessons FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.custom_modules m WHERE m.id = custom_lessons.module_id AND m.teacher_id = auth.uid())
  );

-- 4. custom_steps -----------------------------------------------
CREATE TABLE IF NOT EXISTS public.custom_steps (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id      uuid        NOT NULL REFERENCES public.custom_lessons(id) ON DELETE CASCADE,
  "order"        integer     NOT NULL DEFAULT 0,
  type           text        NOT NULL DEFAULT 'instruction',
  title          text        NOT NULL DEFAULT 'Untitled Step',
  instruction    text        NOT NULL DEFAULT '',
  why_it_matters text,
  config         jsonb       NOT NULL DEFAULT '{}'::jsonb,
  layout         text        NOT NULL DEFAULT 'instruction-full',
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.custom_steps ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_custom_steps_lesson_id ON public.custom_steps(lesson_id);

DROP POLICY IF EXISTS "Teachers can view own steps"   ON public.custom_steps;
DROP POLICY IF EXISTS "Teachers can create steps"     ON public.custom_steps;
DROP POLICY IF EXISTS "Teachers can update own steps" ON public.custom_steps;
DROP POLICY IF EXISTS "Teachers can delete own steps" ON public.custom_steps;

CREATE POLICY "Teachers can view own steps"
  ON public.custom_steps FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.custom_lessons l
      JOIN public.custom_modules m ON m.id = l.module_id
      WHERE l.id = custom_steps.lesson_id AND m.teacher_id = auth.uid()
    )
  );
CREATE POLICY "Teachers can create steps"
  ON public.custom_steps FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.custom_lessons l
      JOIN public.custom_modules m ON m.id = l.module_id
      WHERE l.id = custom_steps.lesson_id AND m.teacher_id = auth.uid()
    )
  );
CREATE POLICY "Teachers can update own steps"
  ON public.custom_steps FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.custom_lessons l
      JOIN public.custom_modules m ON m.id = l.module_id
      WHERE l.id = custom_steps.lesson_id AND m.teacher_id = auth.uid()
    )
  );
CREATE POLICY "Teachers can delete own steps"
  ON public.custom_steps FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.custom_lessons l
      JOIN public.custom_modules m ON m.id = l.module_id
      WHERE l.id = custom_steps.lesson_id AND m.teacher_id = auth.uid()
    )
  );

-- 5. Security-definer helper functions --------------------------
CREATE OR REPLACE FUNCTION public.is_class_teacher(_class_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.classes WHERE id = _class_id AND teacher_id = _user_id)
$$;

CREATE OR REPLACE FUNCTION public.is_enrolled_student(_class_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.class_students WHERE class_id = _class_id AND student_user_id = _user_id)
$$;

-- 6. Student RLS policies (requires helper functions from step 5)
DROP POLICY IF EXISTS "Students can view assigned published modules" ON public.custom_modules;
CREATE POLICY "Students can view assigned published modules"
  ON public.custom_modules FOR SELECT USING (
    status = 'published'::module_status AND EXISTS (
      SELECT 1 FROM public.assignments a
      WHERE a.module_id = (custom_modules.id)::text
        AND (
          a.student_user_id = auth.uid()
          OR (a.class_id IS NOT NULL AND public.is_enrolled_student(a.class_id, auth.uid()))
        )
    )
  );

DROP POLICY IF EXISTS "Students can view lessons of assigned published modules" ON public.custom_lessons;
CREATE POLICY "Students can view lessons of assigned published modules"
  ON public.custom_lessons FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.custom_modules m
      WHERE m.id = custom_lessons.module_id AND m.status = 'published'::module_status
        AND EXISTS (
          SELECT 1 FROM public.assignments a
          WHERE a.module_id = (m.id)::text
            AND (
              a.student_user_id = auth.uid()
              OR (a.class_id IS NOT NULL AND public.is_enrolled_student(a.class_id, auth.uid()))
            )
        )
    )
  );

DROP POLICY IF EXISTS "Students can view steps of assigned published modules" ON public.custom_steps;
CREATE POLICY "Students can view steps of assigned published modules"
  ON public.custom_steps FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.custom_lessons l
      JOIN public.custom_modules m ON m.id = l.module_id
      WHERE l.id = custom_steps.lesson_id AND m.status = 'published'::module_status
        AND EXISTS (
          SELECT 1 FROM public.assignments a
          WHERE a.module_id = (m.id)::text
            AND (
              a.student_user_id = auth.uid()
              OR (a.class_id IS NOT NULL AND public.is_enrolled_student(a.class_id, auth.uid()))
            )
        )
    )
  );

-- 7. block_responses --------------------------------------------
CREATE TABLE IF NOT EXISTS public.block_responses (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid        NOT NULL,
  module_id      text        NOT NULL,
  lesson_id      text        NOT NULL,
  step_id        text        NOT NULL,
  block_id       text        NOT NULL,
  block_type     text        NOT NULL,
  correct        boolean     NOT NULL,
  answer         jsonb,
  attempt_number integer     NOT NULL DEFAULT 1,
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.block_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students insert own block responses"           ON public.block_responses;
DROP POLICY IF EXISTS "Teachers read their students block responses"  ON public.block_responses;

CREATE POLICY "Students insert own block responses"
  ON public.block_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Teachers read their students block responses"
  ON public.block_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.class_students cs
      JOIN public.classes c ON c.id = cs.class_id
      WHERE cs.student_user_id = block_responses.user_id
        AND c.teacher_id = auth.uid()
    )
  );

-- 8. Storage bucket for module banners -------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('module-banners', 'module-banners', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Module banners are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Teachers can upload module banners"     ON storage.objects;
DROP POLICY IF EXISTS "Teachers can update module banners"     ON storage.objects;
DROP POLICY IF EXISTS "Teachers can delete module banners"     ON storage.objects;

CREATE POLICY "Module banners are publicly accessible"
  ON storage.objects FOR SELECT USING (bucket_id = 'module-banners');
CREATE POLICY "Teachers can upload module banners"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'module-banners' AND auth.uid() IS NOT NULL);
CREATE POLICY "Teachers can update module banners"
  ON storage.objects FOR UPDATE USING (bucket_id = 'module-banners' AND auth.uid() IS NOT NULL);
CREATE POLICY "Teachers can delete module banners"
  ON storage.objects FOR DELETE USING (bucket_id = 'module-banners' AND auth.uid() IS NOT NULL);
