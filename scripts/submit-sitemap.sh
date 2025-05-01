#!/bin/bash

# Script to build and submit sitemap to major search engines

SITE_URL="https://ohanarealty.com"
SITEMAP_URL="$SITE_URL/sitemap.xml"

# First, regenerate sitemap
echo "Generating fresh sitemap..."
node scripts/generate-sitemap.js

# Check if sitemap was generated successfully
if [ ! -f "public/sitemap.xml" ]; then
    echo "Error: Sitemap generation failed!"
    exit 1
fi

echo "Sitemap generated successfully."

# Submit to Google
echo "Submitting sitemap to Google..."
curl "https://www.google.com/ping?sitemap=$SITEMAP_URL"
echo ""

# Submit to Bing
echo "Submitting sitemap to Bing..."
curl "https://www.bing.com/ping?sitemap=$SITEMAP_URL"
echo ""

# Submit to Yandex (optional but good for international visibility)
echo "Submitting sitemap to Yandex..."
curl "https://webmaster.yandex.com/ping?sitemap=$SITEMAP_URL"
echo ""

echo "Sitemap submission complete!"
echo "Note: It may take search engines several days to weeks to fully index your content."
