#!/bin/bash

# Generate sitemap.xml for Ohana Realty
echo "Starting sitemap generation process..."

# Ensure we have DATABASE_URL environment variable
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL environment variable is not set"
  exit 1
fi

# Run the sitemap generator
NODE_ENV=production node --input-type=module scripts/generate-sitemap.js

# Check if sitemap generation was successful
if [ $? -eq 0 ]; then
  echo "Sitemap generation completed successfully"
  echo "Sitemap saved to public/sitemap.xml"
  exit 0
else
  echo "Sitemap generation failed"
  exit 1
fi
