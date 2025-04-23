// This script runs drizzle-kit push to update the database schema
import { execSync } from 'child_process';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Ensure we have a database URL
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable not set');
  process.exit(1);
}

console.log('Running drizzle-kit push to update database schema...');
try {
  execSync('npx drizzle-kit push:pg', { stdio: 'inherit' });
  console.log('Database schema updated successfully!');
} catch (error) {
  console.error('Error updating database schema:', error);
  process.exit(1);
}