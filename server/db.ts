import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure neon to use WebSockets for better serverless compatibility
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create optimized connection pool with enhanced performance settings
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  // Production optimized connection pooling
  max: process.env.NODE_ENV === 'production' ? 20 : 3, // Increased max connections for production
  min: process.env.NODE_ENV === 'production' ? 2 : 0, // Maintain minimum connections in production
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 5000, // Reduced connection timeout for faster failure recognition
  allowExitOnIdle: process.env.NODE_ENV !== 'production', // Only allow exit on idle in development
  keepAlive: process.env.NODE_ENV === 'production', // Keep connections alive in production
  statement_timeout: 10000, // Timeout long-running queries after 10 seconds
});

// Add connection error handling for improved stability
pool.on('error', (err) => {
  console.error('Unexpected database connection error:', err);
  // Try to recover connection on next request
});

// Initialize Drizzle ORM with our schema and performance options
export const db = drizzle(pool, { 
  schema,
  // Enable prepared statements for better performance
  logger: process.env.NODE_ENV === 'development' ? true : false
});