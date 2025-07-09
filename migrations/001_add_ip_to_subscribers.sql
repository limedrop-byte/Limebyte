-- Add IP address column to subscribers table
ALTER TABLE subscribers ADD COLUMN ip_address INET;

-- Create index for fast IP lookups
CREATE INDEX idx_subscribers_ip_address ON subscribers(ip_address); 