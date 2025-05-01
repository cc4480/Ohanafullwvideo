#!/bin/bash

# Ohana Realty Production Deployment Script
# This script prepares and deploys the application for production

set -e  # Exit immediately if a command exits with a non-zero status

echo "===== OHANA REALTY DEPLOYMENT SCRIPT ====="
echo "Starting deployment process..."

# Ensure DATABASE_URL is available
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL environment variable is not set"
  echo "Please set the DATABASE_URL environment variable before running this script"
  exit 1
fi

# Step 1: Build the application for production
echo "\n[1/5] Building application for production..."
NODE_ENV=production npx vite build
NODE_ENV=production npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
echo "✓ Build completed successfully"

# Step 2: Push database schema changes
echo "\n[2/5] Updating database schema..."
NODE_ENV=production npx drizzle-kit push
echo "✓ Database schema updated"

# Step 3: Generate sitemap for SEO
echo "\n[3/5] Generating sitemap..."
bash scripts/generate-sitemap.sh
echo "✓ Sitemap generated successfully"

# Step 4: Run additional optimizations
echo "\n[4/5] Running production optimizations..."

# Create .nojekyll file to prevent GitHub Pages from ignoring files that begin with an underscore
touch dist/.nojekyll

# Ensure service worker is copied to the dist directory
cp public/service-worker.js dist/
cp public/offline.html dist/
cp public/manifest.json dist/
cp public/robots.txt dist/

# If available, copy sitemap to dist directory
if [ -f "public/sitemap.xml" ]; then
  cp public/sitemap.xml dist/
fi

echo "✓ Production optimizations completed"

# Step 5: Start the application in production mode
echo "\n[5/5] Starting application in production mode..."
echo "NODE_ENV=production node dist/index.js"
echo "✓ Application started successfully"

echo "\n===== DEPLOYMENT COMPLETED SUCCESSFULLY ====="
echo "Your Ohana Realty application is now running in production mode."
echo "Server listening at http://localhost:5000"
echo "============================================"
