
-- Drop restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Teachers can view own classes" ON public.classes;
DROP POLICY IF EXISTS "Teachers can insert own classes" ON public.classes;
DROP POLICY IF EXISTS "Teachers can update own classes" ON public.classes;
DROP POLICY IF EXISTS "Teachers can delete own classes" ON public.classes;

CREATE POLICY "Teachers can view own classes" ON public.classes FOR SELECT TO authenticated USING (auth.uid() = teacher_id);
CREATE POLICY "Teachers can insert own classes" ON public.classes FOR INSERT TO authenticated WITH CHECK (auth.uid() = teacher_id);
CREATE POLICY "Teachers can update own classes" ON public.classes FOR UPDATE TO authenticated USING (auth.uid() = teacher_id);
CREATE POLICY "Teachers can delete own classes" ON public.classes FOR DELETE TO authenticated USING (auth.uid() = teacher_id);

-- Fix class_students too
DROP POLICY IF EXISTS "Teachers can view students in own classes" ON public.class_students;
DROP POLICY IF EXISTS "Teachers can insert students in own classes" ON public.class_students;
DROP POLICY IF EXISTS "Teachers can delete students from own classes" ON public.class_students;
DROP POLICY IF EXISTS "Students can view own enrollment" ON public.class_students;

CREATE POLICY "Teachers can view students in own classes" ON public.class_students FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM classes WHERE classes.id = class_students.class_id AND classes.teacher_id = auth.uid()));
CREATE POLICY "Teachers can insert students in own classes" ON public.class_students FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM classes WHERE classes.id = class_students.class_id AND classes.teacher_id = auth.uid()));
CREATE POLICY "Teachers can delete students from own classes" ON public.class_students FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM classes WHERE classes.id = class_students.class_id AND classes.teacher_id = auth.uid()));
CREATE POLICY "Students can view own enrollment" ON public.class_students FOR SELECT TO authenticated USING (auth.uid() = student_user_id);

-- Fix other tables with same issue
DROP POLICY IF EXISTS "Users can view own badges" ON public.badges;
DROP POLICY IF EXISTS "Users can insert own badges" ON public.badges;
DROP POLICY IF EXISTS "Teachers can view all badges" ON public.badges;

CREATE POLICY "Users can view own badges" ON public.badges FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own badges" ON public.badges FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Teachers can view all badges" ON public.badges FOR SELECT TO authenticated USING (has_role(auth.uid(), 'teacher'::app_role));

-- Fix lesson_progress
DROP POLICY IF EXISTS "Users can view own lesson progress" ON public.lesson_progress;
DROP POLICY IF EXISTS "Users can insert own lesson progress" ON public.lesson_progress;
DROP POLICY IF EXISTS "Users can update own lesson progress" ON public.lesson_progress;
DROP POLICY IF EXISTS "Teachers can view all lesson progress" ON public.lesson_progress;

CREATE POLICY "Users can view own lesson progress" ON public.lesson_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own lesson progress" ON public.lesson_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own lesson progress" ON public.lesson_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Teachers can view all lesson progress" ON public.lesson_progress FOR SELECT TO authenticated USING (has_role(auth.uid(), 'teacher'::app_role));

-- Fix module_progress
DROP POLICY IF EXISTS "Users can view own module progress" ON public.module_progress;
DROP POLICY IF EXISTS "Users can insert own module progress" ON public.module_progress;
DROP POLICY IF EXISTS "Users can update own module progress" ON public.module_progress;
DROP POLICY IF EXISTS "Teachers can view all module progress" ON public.module_progress;

CREATE POLICY "Users can view own module progress" ON public.module_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own module progress" ON public.module_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own module progress" ON public.module_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Teachers can view all module progress" ON public.module_progress FOR SELECT TO authenticated USING (has_role(auth.uid(), 'teacher'::app_role));

-- Fix profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Fix user_roles
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Teachers can view all roles" ON public.user_roles;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Teachers can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (has_role(auth.uid(), 'teacher'::app_role));
