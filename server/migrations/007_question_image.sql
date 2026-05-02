-- Migration 007: add image_url column to questions
ALTER TABLE questions ADD COLUMN IF NOT EXISTS image_url TEXT;
