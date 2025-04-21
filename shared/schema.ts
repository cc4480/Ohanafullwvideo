import { pgTable, text, serial, integer, boolean, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Property Type enum
export const PropertyType = {
  RESIDENTIAL: 'RESIDENTIAL',
  COMMERCIAL: 'COMMERCIAL',
  LAND: 'LAND'
} as const;

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

export const insertPropertySchema = createInsertSchema(properties);
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

// Define the Neighborhood table schema
export const neighborhoods = pgTable("neighborhoods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  features: text("features").array(),
});

export const insertNeighborhoodSchema = createInsertSchema(neighborhoods);
export type InsertNeighborhood = z.infer<typeof insertNeighborhoodSchema>;
export type Neighborhood = typeof neighborhoods.$inferSelect;

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

export const insertMessageSchema = createInsertSchema(messages);
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Define the AI Chat Messages table schema
export const chatMessages = pgTable("chatMessages", {
  id: serial("id").primaryKey(),
  sessionId: text("sessionId").notNull(),
  message: text("message").notNull(),
  isUser: boolean("isUser").notNull(),
  createdAt: text("createdAt").notNull(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages);
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

// Users table schema remains as is
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
