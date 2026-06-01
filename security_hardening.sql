-- =====================================================
-- RLS SECURITY HARDENING FOR CIRCUIT
-- =====================================================
-- This script ensures all tables have RLS enabled and
-- policies are correctly configured.

-- Enable RLS on all public tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.step_events ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES
-- =====================================================
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- USER_ROLES
-- =====================================================
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Teachers can view all roles" ON public.user_roles;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Teachers can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'teacher'::public.app_role));

-- =====================================================
-- LESSON_PROGRESS
-- =====================================================
DROP POLICY IF EXISTS "Users can view own lesson progress" ON public.lesson_progress;
DROP POLICY IF EXISTS "Users can insert own lesson progress" ON public.lesson_progress;
DROP POLICY IF EXISTS "Users can update own lesson progress" ON public.lesson_progress;
DROP POLICY IF EXISTS "Teachers can view all lesson progress" ON public.lesson_progress;

CREATE POLICY "Users can view own lesson progress" ON public.lesson_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own lesson progress" ON public.lesson_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own lesson progress" ON public.lesson_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Teachers can view all lesson progress" ON public.lesson_progress FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'teacher'::public.app_role));

-- =====================================================
-- MODULE_PROGRESS
-- =====================================================
DROP POLICY IF EXISTS "Users can view own module progress" ON public.module_progress;
DROP POLICY IF EXISTS "Users can insert own module progress" ON public.module_progress;
DROP POLICY IF EXISTS "Users can update own module progress" ON public.module_progress;
DROP POLICY IF EXISTS "Teachers can view all module progress" ON public.module_progress;

CREATE POLICY "Users can view own module progress" ON public.module_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own module progress" ON public.module_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own module progress" ON public.module_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Teachers can view all module progress" ON public.module_progress FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'teacher'::public.app_role));

-- =====================================================
-- BADGES
-- =====================================================
DROP POLICY IF EXISTS "Users can view own badges" ON public.badges;
DROP POLICY IF EXISTS "Users can insert own badges" ON public.badges;
DROP POLICY IF EXISTS "Teachers can view all badges" ON public.badges;

CREATE POLICY "Users can view own badges" ON public.badges FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own badges" ON public.badges FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Teachers can view all badges" ON public.badges FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'teacher'::public.app_role));

-- =====================================================
-- CLASSES
-- =====================================================
DROP POLICY IF EXISTS "Teachers can view own classes" ON public.classes;
DROP POLICY IF EXISTS "Teachers can insert own classes" ON public.classes;
DROP POLICY IF EXISTS "Teachers can update own classes" ON public.classes;
DROP POLICY IF EXISTS "Teachers can delete own classes" ON public.classes;
DROP POLICY IF EXISTS "Students can view enrolled classes" ON public.classes;

CREATE POLICY "Teachers can view own classes" ON public.classes FOR SELECT TO authenticated USING (auth.uid() = teacher_id);
CREATE POLICY "Teachers can insert own classes" ON public.classes FOR INSERT TO authenticated WITH CHECK (auth.uid() = teacher_id);
CREATE POLICY "Teachers can update own classes" ON public.classes FOR UPDATE TO authenticated USING (auth.uid() = teacher_id);
CREATE POLICY "Teachers can delete own classes" ON public.classes FOR DELETE TO authenticated USING (auth.uid() = teacher_id);
CREATE POLICY "Students can view enrolled classes" ON public.classes FOR SELECT TO authenticated USING (public.is_enrolled_student(id, auth.uid()));

-- =====================================================
-- CLASS_STUDENTS
-- =====================================================
DROP POLICY IF EXISTS "Teachers can view students in own classes" ON public.class_students;
DROP POLICY IF EXISTS "Teachers can insert students in own classes" ON public.class_students;
DROP POLICY IF EXISTS "Teachers can delete students from own classes" ON public.class_students;
DROP POLICY IF EXISTS "Students can view own enrollment" ON public.class_students;

CREATE POLICY "Teachers can view students in own classes" ON public.class_students FOR SELECT TO authenticated USING (public.is_class_teacher(class_id, auth.uid()));
CREATE POLICY "Teachers can insert students in own classes" ON public.class_students FOR INSERT TO authenticated WITH CHECK (public.is_class_teacher(class_id, auth.uid()));
CREATE POLICY "Teachers can delete students from own classes" ON public.class_students FOR DELETE TO authenticated USING (public.is_class_teacher(class_id, auth.uid()));
CREATE POLICY "Students can view own enrollment" ON public.class_students FOR SELECT TO authenticated USING (auth.uid() = student_user_id);

-- =====================================================
-- ASSIGNMENTS
-- =====================================================
DROP POLICY IF EXISTS "Teachers can view own assignments" ON public.assignments;
DROP POLICY IF EXISTS "Teachers can create assignments" ON public.assignments;
DROP POLICY IF EXISTS "Teachers can update own assignments" ON public.assignments;
DROP POLICY IF EXISTS "Teachers can delete own assignments" ON public.assignments;
DROP POLICY IF EXISTS "Students can view their assignments" ON public.assignments;

CREATE POLICY "Teachers can view own assignments" ON public.assignments FOR SELECT TO authenticated USING (auth.uid() = teacher_id);
CREATE POLICY "Teachers can create assignments" ON public.assignments FOR INSERT TO authenticated WITH CHECK (auth.uid() = teacher_id);
CREATE POLICY "Teachers can update own assignments" ON public.assignments FOR UPDATE TO authenticated USING (auth.uid() = teacher_id);
CREATE POLICY "Teachers can delete own assignments" ON public.assignments FOR DELETE TO authenticated USING (auth.uid() = teacher_id);
CREATE POLICY "Students can view their assignments" ON public.assignments FOR SELECT TO authenticated USING (
  live_date <= now() AND (
    student_user_id = auth.uid()
    OR (class_id IS NOT NULL AND public.is_enrolled_student(class_id, auth.uid()))
  )
);

-- =====================================================
-- STEP_EVENTS
-- =====================================================
DROP POLICY IF EXISTS "Students can insert own events" ON public.step_events;
DROP POLICY IF EXISTS "Students can view own events" ON public.step_events;
DROP POLICY IF EXISTS "Teachers can view all events" ON public.step_events;

CREATE POLICY "Students can insert own events" ON public.step_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Students can view own events" ON public.step_events FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Teachers can view all events" ON public.step_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'teacher'::public.app_role));
