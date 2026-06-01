-- Add central_class_id to classes for SSO auto-enrolment
ALTER TABLE classes ADD COLUMN IF NOT EXISTS central_class_id uuid;

CREATE UNIQUE INDEX IF NOT EXISTS classes_central_class_id_idx ON classes (central_class_id)
  WHERE central_class_id IS NOT NULL;
