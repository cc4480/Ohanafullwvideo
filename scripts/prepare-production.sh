#!/bin/bash
# Script to prepare the application for production deployment

echo "==== Preparing application for production deployment ===="

# Set environment
export NODE_ENV=production

# Install production dependencies only
echo "Installing production dependencies..."
npm ci --production

# Removing development files
echo "Removing development and temporary files..."
rm -rf .git .github node_modules/.cache

# Build optimized assets
echo "Building optimized assets..."
npm run build

# Set proper permissions
echo "Setting proper file permissions..."
find . -type f -not -path "*/node_modules/*" -not -path "*/\.*" -exec chmod 644 {} \;
find . -type d -not -path "*/node_modules/*" -not -path "*/\.*" -exec chmod 755 {} \;
chmod +x scripts/*.sh

# Run database migration
echo "Running database migration..."
npm run db:push

# Verify config files
echo "Verifying configuration files..."
if [ ! -f ".env" ]; then
    echo "Warning: No .env file found. Make sure environment variables are set in your deployment platform."
fi

# Security check
echo "Running security checks..."
npm audit --production

echo "==== Production preparation complete ===="
echo "To deploy your application, follow these steps:"
echo "1. Commit your changes"
echo "2. Push to your deployment platform"
echo "3. Set the following environment variables in your deployment platform:"
echo "   - NODE_ENV=production"
echo "   - DATABASE_URL=(your database connection string)"
echo ""
echo "Congratulations! Your application is ready for deployment."