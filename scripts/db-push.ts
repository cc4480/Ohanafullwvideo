import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import * as schema from "../shared/schema";

// Required for Neon serverless
neonConfig.webSocketConstructor = ws;

async function main() {
  console.log("Starting database push...");

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  // This uses Drizzle's built-in migration engine to push schema changes
  // It's a safer alternative to drizzle-kit push which can destroy data
  console.log("Applying schema to database...");
  // We'll use the schema from our shared folder
  const result = await db.execute(`
    -- Create tables if they don't exist
    CREATE TABLE IF NOT EXISTS neighborhoods (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      image TEXT,
      features TEXT[],
      "lat" DOUBLE PRECISION,
      "lng" DOUBLE PRECISION,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS properties (
      id SERIAL PRIMARY KEY,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      "zipCode" TEXT NOT NULL,
      price INTEGER NOT NULL,
      description TEXT,
      bedrooms INTEGER,
      bathrooms INTEGER,
      "squareFeet" INTEGER,
      type TEXT NOT NULL,
      status TEXT DEFAULT 'ACTIVE',
      "yearBuilt" INTEGER,
      features TEXT[],
      images TEXT[],
      "lat" DOUBLE PRECISION,
      "lng" DOUBLE PRECISION,
      neighborhood INTEGER REFERENCES neighborhoods(id),
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      message TEXT NOT NULL,
      "propertyId" INTEGER REFERENCES properties(id),
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      "firstName" TEXT,
      "lastName" TEXT,
      role TEXT DEFAULT 'user',
      "profileImage" TEXT,
      "lastLogin" TIMESTAMP WITH TIME ZONE,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id SERIAL PRIMARY KEY,
      "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      "propertyId" INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE("userId", "propertyId")
    );

    CREATE TABLE IF NOT EXISTS airbnb_rentals (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      "zipCode" TEXT NOT NULL,
      price INTEGER NOT NULL,
      description TEXT,
      guests INTEGER,
      bedrooms INTEGER,
      beds INTEGER,
      bathrooms INTEGER,
      amenities TEXT[],
      highlights TEXT[],
      images TEXT[],
      rating DOUBLE PRECISION,
      "reviewCount" INTEGER,
      "lat" DOUBLE PRECISION,
      "lng" DOUBLE PRECISION,
      neighborhood INTEGER REFERENCES neighborhoods(id),
      "cancellationPolicy" TEXT,
      "propertyId" INTEGER REFERENCES properties(id),
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("Schema push completed successfully!");

  // Close the pool to end the process
  await pool.end();
}

main().catch((e) => {
  console.error("Error during database push:", e);
  process.exit(1);
});
