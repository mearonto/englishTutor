-- Per-student lottery settings and history
ALTER TABLE students
  ADD COLUMN IF NOT EXISTS lottery_cost    INTEGER NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS lottery_prizes  JSONB   NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS lottery_history JSONB   NOT NULL DEFAULT '[]';
