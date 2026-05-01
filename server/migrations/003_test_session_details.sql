-- Phase 9: add subject + wrong_words to test_sessions
ALTER TABLE test_sessions
  ADD COLUMN IF NOT EXISTS subject     TEXT,
  ADD COLUMN IF NOT EXISTS wrong_words JSONB NOT NULL DEFAULT '[]';
