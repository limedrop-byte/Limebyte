-- Drop existing settings table to start fresh
DROP TABLE IF EXISTS settings;

-- Create settings table
CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  site_title VARCHAR(255) NOT NULL DEFAULT 'LIMEBYTE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO settings (site_title) VALUES ('LIMEBYTE'); 