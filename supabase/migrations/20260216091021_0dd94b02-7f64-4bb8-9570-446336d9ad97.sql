
-- 1. Allow students to view classes they are enrolled in
CREATE POLICY "Students can view enrolled classes"
ON public.classes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.class_students
    WHERE class_students.class_id = classes.id
    AND class_students.student_user_id = auth.uid()
  )
);

-- 2. Tighten module-banners storage policies to require teacher role
DROP POLICY IF EXISTS "Teachers can upload module banners" ON storage.objects;
DROP POLICY IF EXISTS "Teachers can update module banners" ON storage.objects;
DROP POLICY IF EXISTS "Teachers can delete module banners" ON storage.objects;

CREATE POLICY "Teachers can upload module banners" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'module-banners' AND has_role(auth.uid(), 'teacher'::app_role)
);

CREATE POLICY "Teachers can update module banners" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'module-banners' AND has_role(auth.uid(), 'teacher'::app_role)
);

CREATE POLICY "Teachers can delete module banners" ON storage.objects
FOR DELETE USING (
  bucket_id = 'module-banners' AND has_role(auth.uid(), 'teacher'::app_role)
);
