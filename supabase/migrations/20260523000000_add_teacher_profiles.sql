CREATE TABLE IF NOT EXISTS teacher_profiles (
  id                  uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  central_teacher_id  uuid UNIQUE NOT NULL,
  email               text UNIQUE NOT NULL,
  first_name          text,
  last_name           text,
  created_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE teacher_profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'teacher_profiles' AND policyname = 'Teachers can view their own profile'
  ) THEN
    CREATE POLICY "Teachers can view their own profile"
      ON teacher_profiles FOR SELECT
      TO authenticated
      USING (id = auth.uid());
  END IF;
END $$;
