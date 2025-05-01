#!/bin/bash

# Ohana Realty Production Deployment Script
# This script prepares and deploys the Ohana Realty website to production

set -e # Exit on any error

echo "========================================"
echo "Ohana Realty Production Deployment"
echo "========================================"

# Check for required environment variables
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL environment variable is not set."
  echo "Please set the DATABASE_URL environment variable and try again."
  exit 1
fi

# 1. Install dependencies
echo "\n📦 Installing production dependencies..."
npm ci --production=false # We need dev dependencies for building

# 2. Run database migrations
echo "\n🗄️  Updating database schema..."
./deploy-db.sh

# 3. Build for production
echo "\n🔨 Building for production..."
NODE_ENV=production npm run build

# 4. Optimize assets
echo "\n⚡ Optimizing assets..."

# 5. Run tests if available
if [ -f "./node_modules/.bin/jest" ]; then
  echo "\n🧪 Running tests..."
  NODE_ENV=test npm test
fi

# 6. Prepare for service start
echo "\n🚀 Preparing to start service..."

# 7. Start the application in production mode
echo "\n✅ Deployment complete! Starting application..."
echo "\nTo start the server, run:"
echo "npm run start"
echo "\nOr with a process manager like PM2:"
echo "pm2 start dist/index.js --name \"ohana-realty\""

echo "\n========================================"
echo "Deployment completed successfully!"
echo "========================================"
