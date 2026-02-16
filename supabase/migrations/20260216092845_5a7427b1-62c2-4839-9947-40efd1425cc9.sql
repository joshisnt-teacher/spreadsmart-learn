
-- Security definer function to check class ownership without triggering RLS on classes
CREATE OR REPLACE FUNCTION public.is_class_teacher(_class_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.classes
    WHERE id = _class_id AND teacher_id = _user_id
  )
$$;

-- Security definer function to check student enrollment without triggering RLS on class_students
CREATE OR REPLACE FUNCTION public.is_enrolled_student(_class_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.class_students
    WHERE class_id = _class_id AND student_user_id = _user_id
  )
$$;

-- Fix classes policies
DROP POLICY IF EXISTS "Students can view enrolled classes" ON public.classes;
CREATE POLICY "Students can view enrolled classes" ON public.classes
FOR SELECT USING (public.is_enrolled_student(id, auth.uid()));

-- Fix class_students policies that reference classes
DROP POLICY IF EXISTS "Teachers can view students in own classes" ON public.class_students;
CREATE POLICY "Teachers can view students in own classes" ON public.class_students
FOR SELECT USING (public.is_class_teacher(class_id, auth.uid()));

DROP POLICY IF EXISTS "Teachers can insert students in own classes" ON public.class_students;
CREATE POLICY "Teachers can insert students in own classes" ON public.class_students
FOR INSERT WITH CHECK (public.is_class_teacher(class_id, auth.uid()));

DROP POLICY IF EXISTS "Teachers can delete students from own classes" ON public.class_students;
CREATE POLICY "Teachers can delete students from own classes" ON public.class_students
FOR DELETE USING (public.is_class_teacher(class_id, auth.uid()));

-- Fix assignments policies that reference class_students
DROP POLICY IF EXISTS "Students can view their assignments" ON public.assignments;
CREATE POLICY "Students can view their assignments" ON public.assignments
FOR SELECT USING (
  live_date <= now() AND (
    student_user_id = auth.uid()
    OR (class_id IS NOT NULL AND public.is_enrolled_student(class_id, auth.uid()))
  )
);

-- Fix custom_modules student policy that references class_students
DROP POLICY IF EXISTS "Students can view assigned published modules" ON public.custom_modules;
CREATE POLICY "Students can view assigned published modules" ON public.custom_modules
FOR SELECT USING (
  status = 'published'::module_status AND EXISTS (
    SELECT 1 FROM assignments a
    WHERE a.module_id = (custom_modules.id)::text
    AND (
      a.student_user_id = auth.uid()
      OR (a.class_id IS NOT NULL AND public.is_enrolled_student(a.class_id, auth.uid()))
    )
  )
);

-- Fix custom_lessons student policy
DROP POLICY IF EXISTS "Students can view lessons of assigned published modules" ON public.custom_lessons;
CREATE POLICY "Students can view lessons of assigned published modules" ON public.custom_lessons
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM custom_modules m
    WHERE m.id = custom_lessons.module_id
    AND m.status = 'published'::module_status
    AND EXISTS (
      SELECT 1 FROM assignments a
      WHERE a.module_id = (m.id)::text
      AND (
        a.student_user_id = auth.uid()
        OR (a.class_id IS NOT NULL AND public.is_enrolled_student(a.class_id, auth.uid()))
      )
    )
  )
);

-- Fix custom_steps student policy
DROP POLICY IF EXISTS "Students can view steps of assigned published modules" ON public.custom_steps;
CREATE POLICY "Students can view steps of assigned published modules" ON public.custom_steps
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM custom_lessons l
    JOIN custom_modules m ON m.id = l.module_id
    WHERE l.id = custom_steps.lesson_id
    AND m.status = 'published'::module_status
    AND EXISTS (
      SELECT 1 FROM assignments a
      WHERE a.module_id = (m.id)::text
      AND (
        a.student_user_id = auth.uid()
        OR (a.class_id IS NOT NULL AND public.is_enrolled_student(a.class_id, auth.uid()))
      )
    )
  )
);
