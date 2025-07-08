-- Add view_count column to posts table
ALTER TABLE posts ADD COLUMN view_count INTEGER DEFAULT 0 NOT NULL; 