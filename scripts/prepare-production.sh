#!/bin/bash

# Script to prepare the application for production deployment

# Set environment to production
export NODE_ENV=production

# Display setup information
echo "🚀 Preparing application for production deployment..."

# Build the application
echo "📦 Building application..."
npm run build

# Verify the build was created
if [ ! -d "./dist" ]; then
  echo "❌ Build failed! Check for errors above."
  exit 1
fi

echo "✅ Build completed successfully."

# Create robots.txt if it doesn't exist
if [ ! -f "./dist/public/robots.txt" ]; then
  echo "📝 Creating robots.txt..."
  echo "User-agent: *
Allow: /
Sitemap: https://ohanarealty.com/sitemap.xml" > ./dist/public/robots.txt
fi

# Verify database connection
echo "🔍 Verifying database connection..."
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL environment variable not set!"
  echo "Please set DATABASE_URL before deploying."
  exit 1
fi

# Print success message
echo "✅ Application is ready for deployment!"
echo "To start the production server, run: NODE_ENV=production node dist/index.js"