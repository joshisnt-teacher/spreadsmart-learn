-- Assessment results table
-- One row per user per lesson. Stores whether the student passed the final assessment.
CREATE TABLE IF NOT EXISTS public.lesson_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  passed BOOLEAN NOT NULL DEFAULT false,
  score NUMERIC(5,2), -- optional 0-100 score
  attempt_count INTEGER NOT NULL DEFAULT 1,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);

-- Enable RLS
ALTER TABLE public.lesson_assessments ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lesson_assessments' AND policyname = 'Users can view own lesson assessments') THEN
    CREATE POLICY "Users can view own lesson assessments"
      ON public.lesson_assessments FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lesson_assessments' AND policyname = 'Users can insert own lesson assessments') THEN
    CREATE POLICY "Users can insert own lesson assessments"
      ON public.lesson_assessments FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lesson_assessments' AND policyname = 'Users can update own lesson assessments') THEN
    CREATE POLICY "Users can update own lesson assessments"
      ON public.lesson_assessments FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lesson_assessments' AND policyname = 'Teachers can view all lesson assessments') THEN
    CREATE POLICY "Teachers can view all lesson assessments"
      ON public.lesson_assessments FOR SELECT
      USING (public.has_role(auth.uid(), 'teacher'));
  END IF;
END $$;

-- Updated_at trigger
DROP TRIGGER IF EXISTS update_lesson_assessments_updated_at ON public.lesson_assessments;
CREATE TRIGGER update_lesson_assessments_updated_at
  BEFORE UPDATE ON public.lesson_assessments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
