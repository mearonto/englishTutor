ALTER TABLE students ADD COLUMN IF NOT EXISTS leon_categories JSONB NOT NULL DEFAULT '[]'::jsonb;
