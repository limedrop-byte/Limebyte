-- Add footer_text and site_description columns to settings table
ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS footer_text TEXT DEFAULT 'Building the future, one commit at a time.',
ADD COLUMN IF NOT EXISTS site_description TEXT DEFAULT 'No expectations, just building weird stuff for fun. Made with AI. Repo''s public. Check out the shorts, the games, and join the newsletter n'' shit.'; 