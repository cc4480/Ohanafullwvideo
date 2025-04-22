import { pgTable, text, serial, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Property Type enum (as constant values)
export const PropertyType = {
  RESIDENTIAL: 'RESIDENTIAL',
  COMMERCIAL: 'COMMERCIAL',
  LAND: 'LAND'
} as const;

// Define the Neighborhood table schema
export const neighborhoods = pgTable("neighborhoods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  features: text("features").array(),
});

// Define the Property table schema
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zipCode").notNull(),
  price: integer("price").notNull(),
  description: text("description").notNull(),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  squareFeet: integer("squareFeet"),
  type: text("type").notNull(),
  images: text("images").array().notNull(),
  features: text("features").array(),
  lat: real("lat"),
  lng: real("lng"),
});

// Define the Contact Messages table schema
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  interest: text("interest").notNull(),
  message: text("message").notNull(),
  createdAt: text("createdAt").notNull(),
});

// Users table schema - enhanced for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: text("role").default("USER").notNull(),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
  lastLogin: text("last_login"),
  isVerified: integer("is_verified").default(0),
});

// Create insert schemas
export const insertPropertySchema = createInsertSchema(properties, {
  images: z.array(z.string()),
  features: z.array(z.string()).optional(),
});

export const insertNeighborhoodSchema = createInsertSchema(neighborhoods, {
  features: z.array(z.string()).optional(),
});

export const insertMessageSchema = createInsertSchema(messages);

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
});

// Export types
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

export type InsertNeighborhood = z.infer<typeof insertNeighborhoodSchema>;
export type Neighborhood = typeof neighborhoods.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
