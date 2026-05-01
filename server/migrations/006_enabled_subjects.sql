-- Per-student enabled subjects (teacher controls which subjects appear)
ALTER TABLE students
  ADD COLUMN IF NOT EXISTS enabled_subjects JSONB NOT NULL DEFAULT '["astronomy","canada","math-kangaroo"]';
