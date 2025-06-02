import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configure connection pool with better settings
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 10, // Maximum number of connections
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 10000, // Wait up to 10s for new connections
});

// Add error handling for the pool
pool.on('error', (err) => {
  console.error('Database pool error:', err?.message || 'Unknown pool error');
});

export const db = drizzle({ client: pool, schema });
