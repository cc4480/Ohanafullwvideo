import { integer, text, timestamp, pgTable, jsonb, serial, boolean, real, decimal } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { z } from 'zod';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  role: text('role').default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastLogin: timestamp('last_login'),
});

// User schema for validation
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Neighborhoods table
export const neighborhoods = pgTable('neighborhoods', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zipCode: text('zipCode').notNull(),
  image: text('image'),
  lat: decimal('lat', { precision: 9, scale: 6 }),
  lng: decimal('lng', { precision: 9, scale: 6 }),
  amenities: jsonb('amenities'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  // Enhanced SEO fields
  seoMetaTitle: text('seo_meta_title'),
  seoMetaDescription: text('seo_meta_description'),
  seoKeywords: text('seo_keywords'),
  // Enhanced Laredo-specific neighborhood data
  history: text('history'),                        // Neighborhood history and background
  schools: jsonb('schools').$type<string[]>(),     // Local schools in the neighborhood
  shopping: jsonb('shopping').$type<string[]>(),   // Shopping centers and retail options
  dining: jsonb('dining').$type<string[]>(),       // Local restaurants and dining options
  recreation: jsonb('recreation').$type<string[]>(),  // Parks, sports facilities, etc.
  transportation: jsonb('transportation').$type<string[]>(), // Public transit, highways, etc.
  medianHomePrice: integer('median_home_price'),   // Median home price in the neighborhood
  crimeRate: real('crime_rate'),                  // Crime statistics (lower is better)
  schoolRating: real('school_rating'),            // Average school rating (1-10)
  walkScore: integer('walk_score'),               // Walkability score (0-100)
  yearEstablished: integer('year_established'),    // When the neighborhood was established
  localLandmarks: jsonb('local_landmarks').$type<string[]>(),  // Notable landmarks in the area
});

// Neighborhood validation schema
export const insertNeighborhoodSchema = createInsertSchema(neighborhoods).omit({ id: true });
export type InsertNeighborhood = z.infer<typeof insertNeighborhoodSchema>;
export type Neighborhood = typeof neighborhoods.$inferSelect;

// Properties table
export const properties = pgTable('properties', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zipCode: text('zipCode').notNull(),
  price: integer('price').notNull(),
  bedrooms: integer('bedrooms').notNull(),
  bathrooms: decimal('bathrooms', { precision: 3, scale: 1 }).notNull(),
  squareFeet: integer('square_feet').notNull(),
  description: text('description').notNull(),
  features: jsonb('features'),
  images: jsonb('images').$type<string[]>(),
  status: text('status').default('active').notNull(), // active, pending, sold
  yearBuilt: integer('year_built'),
  parkingSpaces: integer('parking_spaces'),
  lat: decimal('lat', { precision: 9, scale: 6 }),
  lng: decimal('lng', { precision: 9, scale: 6 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  neighborhoodId: integer('neighborhood_id').references(() => neighborhoods.id),
  featured: boolean('featured').default(false).notNull(),
  seoMetaTitle: text('seo_meta_title'),
  seoMetaDescription: text('seo_meta_description'),
  seoKeywords: text('seo_keywords'),
});

// Property validation schema
export const insertPropertySchema = createInsertSchema(properties).omit({ id: true });
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

// Airbnb rentals table
export const airbnbRentals = pgTable('airbnb_rentals', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  type: text('type').notNull(), // entire home, private room, etc.
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zipCode: text('zipCode').notNull(),
  price: integer('price').notNull(), // per night
  bedrooms: integer('bedrooms').notNull(),
  bathrooms: decimal('bathrooms', { precision: 3, scale: 1 }).notNull(),
  maxGuests: integer('max_guests').notNull(),
  squareFeet: integer('square_feet'),
  description: text('description').notNull(),
  amenities: jsonb('amenities').$type<string[]>(),
  images: jsonb('images').$type<string[]>(),
  lat: decimal('lat', { precision: 9, scale: 6 }),
  lng: decimal('lng', { precision: 9, scale: 6 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  neighborhoodId: integer('neighborhood_id').references(() => neighborhoods.id),
  featured: boolean('featured').default(false).notNull(),
  seoMetaTitle: text('seo_meta_title'),
  seoMetaDescription: text('seo_meta_description'),
  seoKeywords: text('seo_keywords'),
});

// Airbnb rental validation schema
export const insertAirbnbRentalSchema = createInsertSchema(airbnbRentals).omit({ id: true });
export type InsertAirbnbRental = z.infer<typeof insertAirbnbRentalSchema>;
export type AirbnbRental = typeof airbnbRentals.$inferSelect;

// Messages/inquiries table
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  message: text('message').notNull(),
  propertyId: integer('property_id').references(() => properties.id),
  airbnbRentalId: integer('airbnb_rental_id').references(() => airbnbRentals.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  read: boolean('read').default(false).notNull(),
});

// Message validation schema
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true });
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Favorites table - tracks user's favorited properties
export const favorites = pgTable('favorites', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  propertyId: integer('property_id').references(() => properties.id),
  airbnbRentalId: integer('airbnb_rental_id').references(() => airbnbRentals.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Favorite validation schema
export const insertFavoriteSchema = createInsertSchema(favorites).omit({ id: true });
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

// SEO keyword tracking table for monitoring rankings
export const seoKeywords = pgTable('seo_keywords', {
  id: serial('id').primaryKey(),
  keyword: text('keyword').notNull().unique(),
  category: text('category').notNull(), // primary, long-tail, neighborhood, competitor
  searchVolume: integer('search_volume').default(0),
  difficultyScore: integer('difficulty_score').default(50),
  priority: integer('priority').default(0).notNull(), // 0-10, higher = more important
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// SEO keyword schema
export const insertSeoKeywordSchema = createInsertSchema(seoKeywords).omit({ id: true });
export type InsertSeoKeyword = z.infer<typeof insertSeoKeywordSchema>;
export type SeoKeyword = typeof seoKeywords.$inferSelect;

// SEO ranking history table for tracking position changes over time
export const seoRankings = pgTable('seo_rankings', {
  id: serial('id').primaryKey(),
  keywordId: integer('keyword_id').notNull().references(() => seoKeywords.id),
  position: integer('position').notNull(),
  date: timestamp('date').defaultNow().notNull(),
  url: text('url').notNull(), // URL that's ranking
  // Competitor positions
  coldwellPosition: integer('coldwell_position'),
  remaxPosition: integer('remax_position'),
  zillowPosition: integer('zillow_position'),
  truliaPosition: integer('trulia_position'),
});

// SEO ranking schema
export const insertSeoRankingSchema = createInsertSchema(seoRankings).omit({ id: true });
export type InsertSeoRanking = z.infer<typeof insertSeoRankingSchema>;
export type SeoRanking = typeof seoRankings.$inferSelect;

// SEO backlinks table for tracking external links to the site
export const seoBacklinks = pgTable('seo_backlinks', {
  id: serial('id').primaryKey(),
  sourceDomain: text('source_domain').notNull(),
  sourceUrl: text('source_url').notNull(),
  targetUrl: text('target_url').notNull(),
  anchorText: text('anchor_text'),
  doFollow: boolean('do_follow').default(true).notNull(),
  domainAuthority: integer('domain_authority'),
  pageAuthority: integer('page_authority'),
  discovered: timestamp('discovered').defaultNow().notNull(),
  lastChecked: timestamp('last_checked'),
  active: boolean('active').default(true).notNull(),
});

// SEO backlink schema
export const insertSeoBacklinkSchema = createInsertSchema(seoBacklinks).omit({ id: true });
export type InsertSeoBacklink = z.infer<typeof insertSeoBacklinkSchema>;
export type SeoBacklink = typeof seoBacklinks.$inferSelect;

// Backlink organizations tracking table (for outreach purposes)
export const backlinkOrganizations = pgTable('backlink_organizations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  website: text('website').notNull(),
  category: text('category').notNull(), // chamber, news, education, business, local, etc.
  contactEmail: text('contact_email'),
  contactPhone: text('contact_phone'),
  contactPerson: text('contact_person'),
  notes: text('notes'),
  status: text('status').default('pending').notNull(), // pending, contacted, acquired, rejected
  priority: integer('priority').default(5).notNull(), // 1-10 scale
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Backlink organization schema
export const insertBacklinkOrganizationSchema = createInsertSchema(backlinkOrganizations).omit({ id: true });
export type InsertBacklinkOrganization = z.infer<typeof insertBacklinkOrganizationSchema>;
export type BacklinkOrganization = typeof backlinkOrganizations.$inferSelect;

// SEO strategy table (for managing overall Laredo ranking strategies)
export const seoStrategies = pgTable('seo_strategies', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  targetKeywords: jsonb('target_keywords').$type<string[]>(),
  description: text('description').notNull(),
  status: text('status').default('active').notNull(),
  startDate: timestamp('start_date').defaultNow().notNull(),
  endDate: timestamp('end_date'),
  budget: integer('budget'),
  progress: integer('progress').default(0), // 0-100
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// SEO strategy schema
export const insertSeoStrategySchema = createInsertSchema(seoStrategies).omit({ id: true });
export type InsertSeoStrategy = z.infer<typeof insertSeoStrategySchema>;
export type SeoStrategy = typeof seoStrategies.$inferSelect;

// Schema optimization table (for Schema.org markup management)
export const schemaMarkups = pgTable('schema_markups', {
  id: serial('id').primaryKey(),
  pageUrl: text('page_url').notNull(),
  pageType: text('page_type').notNull(), // homepage, property, neighborhood, about, contact
  markupType: text('markup_type').notNull(), // LocalBusiness, RealEstateListing, Place, etc.
  jsonData: jsonb('json_data').notNull(),
  active: boolean('active').default(true).notNull(),
  lastTested: timestamp('last_tested'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Schema markup schema
export const insertSchemaMarkupSchema = createInsertSchema(schemaMarkups).omit({ id: true });
export type InsertSchemaMarkup = z.infer<typeof insertSchemaMarkupSchema>;
export type SchemaMarkup = typeof schemaMarkups.$inferSelect;

// Define database relations
export const usersRelations = relations(users, ({ many }) => ({
  favorites: many(favorites),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  neighborhood: one(neighborhoods, {
    fields: [properties.neighborhoodId],
    references: [neighborhoods.id],
  }),
  favorites: many(favorites),
  messages: many(messages),
}));

export const airbnbRentalsRelations = relations(airbnbRentals, ({ one, many }) => ({
  neighborhood: one(neighborhoods, {
    fields: [airbnbRentals.neighborhoodId],
    references: [neighborhoods.id],
  }),
  favorites: many(favorites),
  messages: many(messages),
}));

export const neighborhoodsRelations = relations(neighborhoods, ({ many }) => ({
  properties: many(properties),
  airbnbRentals: many(airbnbRentals),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  property: one(properties, {
    fields: [favorites.propertyId],
    references: [properties.id],
  }),
  airbnbRental: one(airbnbRentals, {
    fields: [favorites.airbnbRentalId],
    references: [airbnbRentals.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  property: one(properties, {
    fields: [messages.propertyId],
    references: [properties.id],
  }),
  airbnbRental: one(airbnbRentals, {
    fields: [messages.airbnbRentalId],
    references: [airbnbRentals.id],
  }),
}));

export const seoKeywordsRelations = relations(seoKeywords, ({ many }) => ({
  rankings: many(seoRankings),
}));

export const seoRankingsRelations = relations(seoRankings, ({ one }) => ({
  keyword: one(seoKeywords, {
    fields: [seoRankings.keywordId],
    references: [seoKeywords.id],
  }),
}));

export const backlinkOrganizationsRelations = relations(backlinkOrganizations, ({ }) => ({
  // Add relations when needed
}));

export const seoStrategiesRelations = relations(seoStrategies, ({ }) => ({
  // Add relations when needed
}));

export const schemaMarkupsRelations = relations(schemaMarkups, ({ }) => ({
  // Add relations when needed
}));