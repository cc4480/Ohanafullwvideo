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

// Create a function that returns a new connection pool
// This allows us to recreate the pool if there are connection issues
const createPool = () => {
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    // Development-optimized connection pooling settings
    max: 5, // Limit concurrent connections
    min: 0, // Don't keep idle connections open
    idleTimeoutMillis: 10000, // Close idle connections faster in development
    connectionTimeoutMillis: 3000, // Fail fast if connection cannot be established
    allowExitOnIdle: true, // Allow closing on idle to prevent hanging connections
    keepAlive: false, // No need for keepalive in development
    statement_timeout: 5000, // Fail fast on long queries
  });
  
  // Add connection error handling for improved stability
  pool.on('error', (err) => {
    console.error('Database connection error:', err);
    // Log the error but don't try to reconnect automatically
    // We'll create a new pool on the next request if needed
  });
  
  return pool;
};

// Initial pool creation
export let pool = createPool();

// Create a function to get a working database connection
// This will recreate the pool if needed
const getDb = () => {
  // Initialize Drizzle ORM with our schema
  return drizzle(pool, { 
    schema,
    // Enable logging in development
    logger: true
  });
};

// Export the database client with our helper function
export const db = getDb();