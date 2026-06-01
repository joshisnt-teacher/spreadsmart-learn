-- Add central_class_id to classes for SSO auto-enrolment
ALTER TABLE classes ADD COLUMN IF NOT EXISTS central_class_id uuid;

CREATE UNIQUE INDEX IF NOT EXISTS classes_central_class_id_idx ON classes (central_class_id)
  WHERE central_class_id IS NOT NULL;

-- Prevent duplicate student enrolments in the same class
CREATE UNIQUE INDEX IF NOT EXISTS class_students_class_id_student_user_id_idx ON class_students (class_id, student_user_id);
