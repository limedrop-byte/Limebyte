-- Migration: Add pinned column to posts table
-- Date: 2025-01-08

ALTER TABLE posts ADD COLUMN pinned BOOLEAN DEFAULT FALSE NOT NULL;

-- Create index for better query performance when filtering by pinned status
CREATE INDEX idx_posts_pinned ON posts(pinned);

-- Add comment for documentation
COMMENT ON COLUMN posts.pinned IS 'Whether this post is pinned to the top of the list'; 