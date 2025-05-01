#!/bin/bash

# Ohana Realty Database Deployment Script
# This script handles database migrations for production deployment

set -e  # Exit immediately if a command exits with a non-zero status

echo "===== OHANA REALTY DATABASE DEPLOYMENT ====="
echo "Starting database deployment process..."

# Ensure DATABASE_URL is available
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL environment variable is not set"
  echo "Please set the DATABASE_URL environment variable before running this script"
  exit 1
fi

# Step 1: Push schema changes to database
echo "\n[1/3] Pushing schema changes to production database..."
NODE_ENV=production npx drizzle-kit push
echo "✓ Schema changes applied successfully"

# Step 2: Run any additional database setup/migrations if needed
echo "\n[2/3] Checking for existing database data..."
# This is a simple check to see if we need to initialize sample data
# In a real production environment, you might want to skip sample data
# initialization completely

NODE_ENV=production node -e '
const { Pool } = require("@neondatabase/serverless");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function checkDatabaseContent() {
  try {
    // Check if users table has any records
    const result = await pool.query("SELECT COUNT(*) FROM users");
    const count = parseInt(result.rows[0].count, 10);
    
    if (count === 0) {
      console.log("Database appears to be empty, will initialize sample data");
      process.exit(1); // Exit with error code to trigger initialization
    } else {
      console.log(`Database already has ${count} users, skipping initialization");
      process.exit(0); // Exit with success code to skip initialization
    }
  } catch (error) {
    console.error("Error checking database content:", error);
    process.exit(1); // Exit with error code
  } finally {
    await pool.end();
  }
}

checkDatabaseContent();
'

# If the previous command exited with an error code (indicating empty DB)
# then run the initialization
if [ $? -ne 0 ]; then
  echo "\n[3/3] Initializing database with sample data..."
  NODE_ENV=production node -e '
  const { initializeSampleData } = require("./server/storage.js");
  
  async function initialize() {
    try {
      await initializeSampleData();
      console.log("Sample data initialized successfully");
      process.exit(0);
    } catch (error) {
      console.error("Error initializing sample data:", error);
      process.exit(1);
    }
  }
  
  initialize();
  '

  if [ $? -eq 0 ]; then
    echo "✓ Database initialized successfully with sample data"
  else
    echo "❌ Failed to initialize database with sample data"
    exit 1
  fi
else
  echo "\n[3/3] Skipping database initialization (data already exists)"
  echo "✓ Database is already populated"
fi

echo "\n===== DATABASE DEPLOYMENT COMPLETED SUCCESSFULLY ====="
echo "Your Ohana Realty database is now ready for production use."
echo "==================================================="
