-- Phase 8: per-student difficulty range for gameplay filtering
ALTER TABLE students
  ADD COLUMN IF NOT EXISTS difficulty_min INTEGER NOT NULL DEFAULT 1
    CHECK (difficulty_min BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS difficulty_max INTEGER NOT NULL DEFAULT 5
    CHECK (difficulty_max BETWEEN 1 AND 5);
