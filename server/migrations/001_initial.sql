-- Word Quest: Initial Schema
-- Run once on first startup; idempotent via IF NOT EXISTS

CREATE TABLE IF NOT EXISTS questions (
  id               SERIAL PRIMARY KEY,
  subject          TEXT    NOT NULL,
  type             TEXT    NOT NULL,
  grade            INTEGER NOT NULL DEFAULT 0,
  word             TEXT    NOT NULL,
  prompt           TEXT    NOT NULL,
  choices          JSONB   NOT NULL,
  answer           TEXT    NOT NULL,
  definition       TEXT    NOT NULL,
  context_sentence TEXT    NOT NULL DEFAULT '',
  hints            JSONB   NOT NULL DEFAULT '["",""]',
  coach            TEXT    NOT NULL DEFAULT '',
  difficulty       INTEGER NOT NULL DEFAULT 3 CHECK (difficulty BETWEEN 1 AND 5),
  active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
  id               SERIAL PRIMARY KEY,
  name             TEXT    NOT NULL UNIQUE,
  grade_unlocked   INTEGER NOT NULL DEFAULT 3,
  xp               INTEGER NOT NULL DEFAULT 0,
  stars            INTEGER NOT NULL DEFAULT 0,
  tokens           INTEGER NOT NULL DEFAULT 0,
  streak           INTEGER NOT NULL DEFAULT 0,
  mastery3         JSONB   NOT NULL DEFAULT '{}',
  learned          JSONB   NOT NULL DEFAULT '{}',
  inventory        JSONB   NOT NULL DEFAULT '[]',
  subject          TEXT    NOT NULL DEFAULT 'english',
  astronomy_categories      JSONB NOT NULL DEFAULT '["all"]',
  canada_categories         JSONB NOT NULL DEFAULT '["all"]',
  math_kangaroo_categories  JSONB NOT NULL DEFAULT '["all"]',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Per-student question pool overrides (empty = use global pool)
CREATE TABLE IF NOT EXISTS student_questions (
  id          SERIAL PRIMARY KEY,
  student_id  INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  assigned    BOOLEAN NOT NULL DEFAULT TRUE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, question_id)
);

-- Teacher-defined test templates
CREATE TABLE IF NOT EXISTS test_configs (
  id             SERIAL PRIMARY KEY,
  student_id     INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  name           TEXT    NOT NULL,
  subject        TEXT,                       -- NULL = any subject
  category       TEXT,                       -- NULL = any category
  difficulty_min INTEGER NOT NULL DEFAULT 1,
  difficulty_max INTEGER NOT NULL DEFAULT 5,
  question_count INTEGER NOT NULL DEFAULT 10,
  active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Individual test runs
CREATE TABLE IF NOT EXISTS test_sessions (
  id          SERIAL PRIMARY KEY,
  student_id  INTEGER NOT NULL REFERENCES students(id),
  config_id   INTEGER REFERENCES test_configs(id),
  started_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  score       INTEGER,
  total       INTEGER
);

-- Per-question answers within a test session
CREATE TABLE IF NOT EXISTS test_answers (
  id          SERIAL PRIMARY KEY,
  session_id  INTEGER NOT NULL REFERENCES test_sessions(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES questions(id),
  correct     BOOLEAN NOT NULL,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: auto-update updated_at on questions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS questions_updated_at ON questions;
CREATE TRIGGER questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
