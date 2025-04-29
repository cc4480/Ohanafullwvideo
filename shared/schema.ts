import { pgTable, text, serial, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Property Type enum
export const PropertyType = {
  RESIDENTIAL: 'RESIDENTIAL',
  COMMERCIAL: 'COMMERCIAL',
  LAND: 'LAND',
  RENTAL: 'RENTAL',
  AIRBNB: 'AIRBNB'
} as const;

// Define the Neighborhood table schema first so we can reference it
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
  neighborhood: integer("neighborhood").references(() => neighborhoods.id),
});

export const insertPropertySchema = createInsertSchema(properties);
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

// Define relations between properties and neighborhoods
export const propertyRelations = relations(properties, ({ one }) => ({
  neighborhood: one(neighborhoods, {
    fields: [properties.neighborhood],
    references: [neighborhoods.id],
  }),
}));

export const insertNeighborhoodSchema = createInsertSchema(neighborhoods);
export type InsertNeighborhood = z.infer<typeof insertNeighborhoodSchema>;
export type Neighborhood = typeof neighborhoods.$inferSelect;

// Define relations for neighborhoods to include properties
export const neighborhoodRelations = relations(neighborhoods, ({ many }) => ({
  properties: many(properties),
}));

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

// Users table schema with enhanced fields
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  fullName: text("fullName"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  lastLogin: timestamp("lastLogin"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// User favorites table for saved properties
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id),
  propertyId: integer("propertyId").notNull().references(() => properties.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const insertFavoriteSchema = createInsertSchema(favorites).pick({
  userId: true,
  propertyId: true,
});

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

// Define relations for favorites
export const favoriteRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  property: one(properties, {
    fields: [favorites.propertyId],
    references: [properties.id],
  }),
}));

// Add relation from users to favorites
export const userRelations = relations(users, ({ many }) => ({
  favorites: many(favorites),
}));

// Add relation from properties to favorites
export const propertyFavoriteRelations = relations(properties, ({ many }) => ({
  favorites: many(favorites),
}));

// Define the AirbnbRentals table schema
export const airbnbRentals = pgTable("airbnb_rentals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zipCode").notNull(),
  price: integer("price").notNull(), // Price per night
  description: text("description").notNull(),
  guests: integer("guests").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  beds: integer("beds").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  amenities: text("amenities").array().notNull(),
  highlights: text("highlights").array().notNull(), // Special features like "Exceptional check-in experience"
  images: text("images").array().notNull(),
  rating: real("rating"),
  reviewCount: integer("reviewCount"),
  lat: real("lat"),
  lng: real("lng"),
  neighborhood: integer("neighborhood").references(() => neighborhoods.id),
  propertyId: integer("propertyId").references(() => properties.id), // Optional link to regular property
  cancellationPolicy: text("cancellationPolicy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const insertAirbnbRentalSchema = createInsertSchema(airbnbRentals);
export type InsertAirbnbRental = z.infer<typeof insertAirbnbRentalSchema>;
export type AirbnbRental = typeof airbnbRentals.$inferSelect;

// Define relations for Airbnb rentals
export const airbnbRentalRelations = relations(airbnbRentals, ({ one }) => ({
  neighborhood: one(neighborhoods, {
    fields: [airbnbRentals.neighborhood],
    references: [neighborhoods.id],
  }),
  property: one(properties, {
    fields: [airbnbRentals.propertyId],
    references: [properties.id],
  }),
}));

// Update neighborhood relations to include Airbnb rentals
export const neighborhoodAirbnbRelations = relations(neighborhoods, ({ many }) => ({
  airbnbRentals: many(airbnbRentals),
}));
