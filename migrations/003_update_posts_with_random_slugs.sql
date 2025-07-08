-- Update all existing posts with random 6-digit number slugs
UPDATE posts 
SET slug = LPAD((RANDOM() * 900000 + 100000)::INT::TEXT, 6, '0')
WHERE slug IS NULL OR slug = '';

-- Also update any posts that might have title-based slugs with random numbers
UPDATE posts 
SET slug = LPAD((RANDOM() * 900000 + 100000)::INT::TEXT, 6, '0')
WHERE LENGTH(slug) > 10 OR slug ~ '[a-z-]'; 