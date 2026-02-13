-- Classes table for teachers
CREATE TABLE public.classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL,
  name text NOT NULL,
  join_code text NOT NULL UNIQUE DEFAULT substring(md5(random()::text) from 1 for 6),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can view own classes"
  ON public.classes FOR SELECT
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can insert own classes"
  ON public.classes FOR INSERT
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update own classes"
  ON public.classes FOR UPDATE
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete own classes"
  ON public.classes FOR DELETE
  USING (auth.uid() = teacher_id);

CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON public.classes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Class students linking table
CREATE TABLE public.class_students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  student_user_id uuid NOT NULL,
  username text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.class_students ENABLE ROW LEVEL SECURITY;

-- Teachers can see students in their own classes
CREATE POLICY "Teachers can view students in own classes"
  ON public.class_students FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.classes WHERE classes.id = class_students.class_id AND classes.teacher_id = auth.uid()
  ));

CREATE POLICY "Teachers can insert students in own classes"
  ON public.class_students FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.classes WHERE classes.id = class_students.class_id AND classes.teacher_id = auth.uid()
  ));

CREATE POLICY "Teachers can delete students from own classes"
  ON public.class_students FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.classes WHERE classes.id = class_students.class_id AND classes.teacher_id = auth.uid()
  ));

-- Students can see their own enrollment
CREATE POLICY "Students can view own enrollment"
  ON public.class_students FOR SELECT
  USING (auth.uid() = student_user_id);