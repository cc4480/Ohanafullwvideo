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

// Connect to database with pooled connections
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  // Add connection pooling configuration for production
  max: process.env.NODE_ENV === 'production' ? 10 : 3, // Max 10 connections in production, 3 in development
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection cannot be established
  allowExitOnIdle: process.env.NODE_ENV !== 'production' // Only allow exit on idle in non-production environments
});

// Initialize Drizzle ORM with our schema
export const db = drizzle(pool, { schema });