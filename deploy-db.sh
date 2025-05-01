#!/bin/bash

# Make script executable
chmod +x "$0"

# This script automates the database push process for Ohana Realty's SEO system
echo "Starting enterprise-grade SEO database deployment..."

# Create the SEO-related tables directly using SQL
echo "Creating SEO database tables..."
cat << EOF | psql $DATABASE_URL
-- SEO keyword tracking table for monitoring rankings
CREATE TABLE IF NOT EXISTS seo_keywords (
  id SERIAL PRIMARY KEY,
  keyword TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  search_volume INTEGER DEFAULT 0,
  difficulty_score INTEGER DEFAULT 50,
  priority INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- SEO ranking history table for tracking position changes over time
CREATE TABLE IF NOT EXISTS seo_rankings (
  id SERIAL PRIMARY KEY,
  keyword_id INTEGER NOT NULL REFERENCES seo_keywords(id),
  position INTEGER NOT NULL,
  date TIMESTAMP NOT NULL DEFAULT NOW(),
  url TEXT NOT NULL,
  coldwell_position INTEGER,
  remax_position INTEGER,
  zillow_position INTEGER,
  trulia_position INTEGER
);

-- SEO backlinks table for tracking external links to the site
CREATE TABLE IF NOT EXISTS seo_backlinks (
  id SERIAL PRIMARY KEY,
  source_domain TEXT NOT NULL,
  source_url TEXT NOT NULL,
  target_url TEXT NOT NULL,
  anchor_text TEXT,
  do_follow BOOLEAN NOT NULL DEFAULT TRUE,
  domain_authority INTEGER,
  page_authority INTEGER,
  discovered TIMESTAMP NOT NULL DEFAULT NOW(),
  last_checked TIMESTAMP,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Add SEO fields to existing tables if they don't exist
ALTER TABLE properties ADD COLUMN IF NOT EXISTS seo_meta_title TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS seo_meta_description TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS seo_keywords TEXT;

ALTER TABLE neighborhoods ADD COLUMN IF NOT EXISTS seo_meta_title TEXT;
ALTER TABLE neighborhoods ADD COLUMN IF NOT EXISTS seo_meta_description TEXT;
ALTER TABLE neighborhoods ADD COLUMN IF NOT EXISTS seo_keywords TEXT;

ALTER TABLE airbnb_rentals ADD COLUMN IF NOT EXISTS seo_meta_title TEXT;
ALTER TABLE airbnb_rentals ADD COLUMN IF NOT EXISTS seo_meta_description TEXT;
ALTER TABLE airbnb_rentals ADD COLUMN IF NOT EXISTS seo_keywords TEXT;
EOF

# Seed the SEO keywords table with primary categories
cat << EOF | psql $DATABASE_URL
-- Insert primary keywords
INSERT INTO seo_keywords (keyword, category, search_volume, difficulty_score, priority)
VALUES 
('homes for sale in Laredo TX', 'primary', 2200, 68, 10),
('houses for sale in Laredo', 'primary', 1800, 62, 10),
('Laredo real estate', 'primary', 1500, 75, 10),
('Laredo homes for sale', 'primary', 1750, 70, 10),
('houses for sale Laredo TX', 'primary', 1600, 65, 10),
('condos for sale in Laredo', 'primary', 320, 45, 10),
('Laredo houses for sale', 'primary', 1400, 67, 10),
('real estate Laredo TX', 'primary', 980, 72, 10),
('Laredo houses for rent', 'primary', 1350, 58, 10),
('homes for rent in Laredo', 'primary', 1200, 52, 10)
ON CONFLICT (keyword) DO UPDATE SET 
  category = EXCLUDED.category,
  search_volume = EXCLUDED.search_volume,
  difficulty_score = EXCLUDED.difficulty_score,
  priority = EXCLUDED.priority;

-- Insert long-tail keywords
INSERT INTO seo_keywords (keyword, category, search_volume, difficulty_score, priority)
VALUES 
('affordable homes for sale in Laredo TX', 'long-tail', 280, 35, 8),
('houses for sale in Laredo under 200k', 'long-tail', 320, 38, 8),
('luxury houses for sale in Laredo TX', 'long-tail', 150, 42, 8),
('Laredo homes for sale with pool', 'long-tail', 180, 40, 8),
('downtown Laredo condos for sale', 'long-tail', 120, 32, 8),
('Laredo houses for rent pet friendly', 'long-tail', 210, 30, 8)
ON CONFLICT (keyword) DO UPDATE SET 
  category = EXCLUDED.category,
  search_volume = EXCLUDED.search_volume,
  difficulty_score = EXCLUDED.difficulty_score,
  priority = EXCLUDED.priority;

-- Insert neighborhood keywords
INSERT INTO seo_keywords (keyword, category, search_volume, difficulty_score, priority)
VALUES 
('Downtown Laredo real estate', 'neighborhood', 210, 39, 7),
('North Laredo homes for sale', 'neighborhood', 190, 36, 7),
('South Laredo houses', 'neighborhood', 170, 37, 7),
('East Laredo properties', 'neighborhood', 110, 35, 7),
('West Laredo homes for rent', 'neighborhood', 150, 33, 7)
ON CONFLICT (keyword) DO UPDATE SET 
  category = EXCLUDED.category,
  search_volume = EXCLUDED.search_volume,
  difficulty_score = EXCLUDED.difficulty_score,
  priority = EXCLUDED.priority;

-- Insert competitor keywords
INSERT INTO seo_keywords (keyword, category, search_volume, difficulty_score, priority)
VALUES 
('better than Coldwell Banker Laredo', 'competitor', 45, 62, 9),
('Laredo real estate alternatives to RE/MAX', 'competitor', 70, 65, 9),
('why choose Ohana Realty over Coldwell Banker', 'competitor', 30, 58, 9),
('Ohana Realty vs RE/MAX Laredo', 'competitor', 55, 60, 9),
('best real estate agency in Laredo TX', 'competitor', 95, 68, 9),
('top rated Laredo realtors', 'competitor', 110, 58, 9)
ON CONFLICT (keyword) DO UPDATE SET 
  category = EXCLUDED.category,
  search_volume = EXCLUDED.search_volume,
  difficulty_score = EXCLUDED.difficulty_score,
  priority = EXCLUDED.priority;
EOF

echo "Enterprise SEO database deployment complete!"
