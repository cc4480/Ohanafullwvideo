import { properties, neighborhoods, messages, users, favorites, airbnbRentals, seoKeywords, seoRankings } from "@shared/schema";
import type { 
  Property, InsertProperty, 
  Neighborhood, InsertNeighborhood, 
  Message, InsertMessage, 
  User, InsertUser, 
  Favorite, InsertFavorite,
  AirbnbRental, InsertAirbnbRental,
  SeoKeyword, InsertSeoKeyword,
  SeoRanking, InsertSeoRanking
} from "@shared/schema";
import { db } from './db';
import { eq, sql, and, or, asc, desc, type SQL } from 'drizzle-orm';

// Add more CRUD methods for the storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(id: number): Promise<User | undefined>;

  // Property methods
  getProperties(): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  getPropertiesByType(type: string): Promise<Property[]>;
  getFeaturedProperties(limit?: number): Promise<Property[]>;
  getPropertiesCount(filters?: {
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    minBeds?: number;
    minBaths?: number;
    city?: string;
    zipCode?: string;
    neighborhood?: number;
  }): Promise<number>;
  searchProperties(filters: {
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    minBeds?: number;
    minBaths?: number;
    city?: string;
    zipCode?: string;
    neighborhood?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<Property>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;

  // Neighborhood methods
  getNeighborhoods(): Promise<Neighborhood[]>;
  getNeighborhood(id: number): Promise<Neighborhood | undefined>;
  getPropertiesByNeighborhood(neighborhoodId: number): Promise<Property[]>;
  createNeighborhood(neighborhood: InsertNeighborhood): Promise<Neighborhood>;

  // Message methods
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(): Promise<Message[]>;

  // Favorites methods
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, propertyId: number): Promise<boolean>;
  getUserFavorites(userId: number): Promise<Property[]>;
  isFavorite(userId: number, propertyId: number): Promise<boolean>;

  // Airbnb rental methods
  getAirbnbRentals(): Promise<AirbnbRental[]>;
  getAirbnbRental(id: number): Promise<AirbnbRental | undefined>;
  getFeaturedAirbnbRentals(limit?: number): Promise<AirbnbRental[]>;
  searchAirbnbRentals(filters: {
    minPrice?: number;
    maxPrice?: number;
    minBeds?: number;
    minBaths?: number;
    guests?: number;
    city?: string;
    neighborhood?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<AirbnbRental[]>;
  createAirbnbRental(rental: InsertAirbnbRental): Promise<AirbnbRental>;
  updateAirbnbRental(id: number, rental: Partial<AirbnbRental>): Promise<AirbnbRental | undefined>;
  deleteAirbnbRental(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getProperties(): Promise<Property[]> {
    try {
      // Using raw SQL to avoid column name issues
      const result = await db.execute(sql`SELECT * FROM properties`);
      const propertiesList = result.rows as Property[];
      console.log("Properties fetched successfully:", propertiesList?.length || 0);
      return propertiesList || [];
    } catch (error) {
      console.error("Error fetching properties:", error);
      // Return empty array instead of throwing error
      return [];
    }
  }

  async getFeaturedProperties(limit?: number): Promise<Property[]> {
    try {
      const limitClause = limit ? `LIMIT ${limit}` : '';
      const result = await db.execute(sql`SELECT * FROM properties WHERE featured = true ORDER BY created_at DESC ${sql.raw(limitClause)}`);
      const propertiesList = result.rows as Property[];
      console.log("Featured properties fetched successfully:", propertiesList?.length || 0);
      return propertiesList || [];
    } catch (error) {
      console.error("Error fetching featured properties:", error);
      return [];
    }
  }

  async getProperty(id: number): Promise<Property | undefined> {
    try {
      // Using raw SQL to avoid column name issues
      const result = await db.execute(sql`SELECT * FROM properties WHERE id = ${id}`);
      if (result.rows.length === 0) {
        return undefined;
      }
      return result.rows[0] as Property;
    } catch (error) {
      console.error("Property fetch error:", error);
      throw error;
    }
  }

  async getPropertiesByType(type: string): Promise<Property[]> {
    return await db.select().from(properties).where(eq(properties.type, type));
  }

  // Get count of properties based on filters (for pagination)
  async getPropertiesCount(filters?: {
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    minBeds?: number;
    minBaths?: number;
    city?: string;
    zipCode?: string;
    neighborhood?: number;
  }): Promise<number> {
    // If no filters, get total count of all properties quickly
    if (!filters) {
      const [result] = await db.select({ count: sql`count(*)` }).from(properties);
      return Number(result.count);
    }

    // Otherwise, create conditions array based on filters
    const conditions: Array<SQL> = [];

    // Add conditions based on filters
    if (filters.type) {
      conditions.push(eq(properties.type, filters.type));
    }

    if (filters.minPrice) {
      conditions.push(sql`${properties.price} >= ${filters.minPrice}`);
    }

    if (filters.maxPrice) {
      conditions.push(sql`${properties.price} <= ${filters.maxPrice}`);
    }

    if (filters.minBeds) {
      conditions.push(sql`${properties.bedrooms} >= ${filters.minBeds}`);
    }

    if (filters.minBaths) {
      conditions.push(sql`${properties.bathrooms} >= ${filters.minBaths}`);
    }

    if (filters.city) {
      conditions.push(sql`${properties.city} ILIKE ${`%${filters.city}%`}`);
    }

    if (filters.zipCode) {
      conditions.push(eq(properties.zipCode, filters.zipCode));
    }

    if (filters.neighborhood) {
      conditions.push(eq(properties.neighborhoodId, filters.neighborhood));
    }

    // If no conditions, return total count
    if (conditions.length === 0) {
      const [result] = await db.select({ count: sql`count(*)` }).from(properties);
      return Number(result.count);
    }

    // Otherwise, apply conditions to count query
    const whereClause = conditions.reduce((combined, current, index) => {
      if (index === 0) return current;
      return sql`${combined} AND ${current}`;
    });

    const [result] = await db
      .select({ count: sql`count(*)` })
      .from(properties)
      .where(whereClause);

    return Number(result.count);
  }

  // Enhanced search properties method with sorting and pagination
  async searchProperties(filters: {
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    minBeds?: number;
    minBaths?: number;
    city?: string;
    zipCode?: string;
    neighborhood?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<Property[]> {
    try {
      // First get all properties using raw SQL to avoid column name issues
      const result = await db.execute(sql`SELECT * FROM properties`);
      const allProperties = result.rows as Property[];

      // Then filter in memory
      let filteredProperties = allProperties.filter(property => {
        let includeProperty = true;

        // Filter by type
        if (filters.type && property.type !== filters.type) {
          includeProperty = false;
        }

        // Filter by price range
        if (filters.minPrice && property.price < filters.minPrice) {
          includeProperty = false;
        }

        if (filters.maxPrice && property.price > filters.maxPrice) {
          includeProperty = false;
        }

        // Filter by bedrooms
        if (filters.minBeds && (!property.bedrooms || property.bedrooms < filters.minBeds)) {
          includeProperty = false;
        }

        // Filter by bathrooms
        if (filters.minBaths && (!property.bathrooms || Number(property.bathrooms) < filters.minBaths)) {
          includeProperty = false;
        }

        // Filter by city
        if (filters.city && property.city && property.city.toLowerCase().indexOf(filters.city.toLowerCase()) === -1) {
          includeProperty = false;
        }

        // Filter by zipCode
        if (filters.zipCode && property.zipCode !== filters.zipCode) {
          includeProperty = false;
        }

        // Filter by neighborhood
        if (filters.neighborhood && property.neighborhoodId !== filters.neighborhood) {
          includeProperty = false;
        }

        return includeProperty;
      });

      // Sort the filtered results
      if (filters.sortBy) {
        const column = filters.sortBy;

        // Determine column name for sorting
        let columnName: keyof Property;
        if (column === 'price' || column === 'bedrooms' || column === 'bathrooms' || column === 'squareFeet') {
          columnName = column as keyof Property;
        } else {
          // Default to price if invalid column
          columnName = 'price';
        }

        // Apply sort direction
        filteredProperties = filteredProperties.sort((a, b) => {
          const valueA = a[columnName] as number | null;
          const valueB = b[columnName] as number | null;

          // Handle null values (null values always go last)
          if (valueA === null && valueB === null) return 0;
          if (valueA === null) return 1;
          if (valueB === null) return -1;

          // Regular comparison
          if (filters.order && filters.order.toLowerCase() === 'asc') {
            return Number(valueA) - Number(valueB);
          } else {
            return Number(valueB) - Number(valueA);
          }
        });
      } else {
        // Default sorting by price descending
        filteredProperties = filteredProperties.sort((a, b) => {
          return (b.price || 0) - (a.price || 0);
        });
      }

      // Apply pagination if specified
      if (filters.limit && filters.limit > 0) {
        const startIndex = filters.offset || 0;
        const endIndex = startIndex + filters.limit;
        filteredProperties = filteredProperties.slice(startIndex, endIndex);
      }

      // Log the filter criteria and result count
      console.log(`Search completed with ${filteredProperties.length} properties found`);

      return filteredProperties;
    } catch (error) {
      console.error("Error in searchProperties:", error);
      // Return empty array instead of throwing error
      return [];
    }
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    try {
      // Using raw SQL to avoid column name issues
      // We need to extract all the fields from insertProperty
      const {
        type, address, city, state, zipCode, price, bedrooms, bathrooms, squareFeet,
        description, images, features, neighborhoodId, status, yearBuilt, 
        parkingSpaces, lat, lng, seoMetaTitle, seoMetaDescription, seoKeywords, featured
      } = insertProperty;

      // Insert with raw SQL
      const result = await db.execute(sql`
        INSERT INTO properties (
          "type", address, city, state, "zipCode", price, bedrooms, bathrooms, "squareFeet",
          description, images, features, "neighborhoodId", status, "yearBuilt", 
          "parkingSpaces", lat, lng, "seoMetaTitle", "seoMetaDescription", "seoKeywords", 
          featured, "createdAt", "updatedAt"
        ) VALUES (
          ${type}, ${address}, ${city}, ${state}, ${zipCode}, ${price}, ${bedrooms}, ${bathrooms}, ${squareFeet},
          ${description}, ${images || null}, ${features || null}, ${neighborhoodId || null}, ${status || 'active'}, ${yearBuilt || null}, 
          ${parkingSpaces || null}, ${lat || null}, ${lng || null}, ${seoMetaTitle || null}, ${seoMetaDescription || null}, ${seoKeywords || null}, 
          ${featured || false}, NOW(), NOW()
        ) RETURNING *
      `);

      // Return the first row as the created property
      return result.rows[0] as Property;
    } catch (error) {
      console.error("Error creating property:", error);
      throw error;
    }
  }

  async updateProperty(id: number, propertyData: Partial<Property>): Promise<Property | undefined> {
    const [property] = await db
      .update(properties)
      .set(propertyData)
      .where(eq(properties.id, id))
      .returning();
    return property;
  }

  async deleteProperty(id: number): Promise<boolean> {
    const result = await db
      .delete(properties)
      .where(eq(properties.id, id));
    return !!result;
  }

  async getNeighborhoods(): Promise<Neighborhood[]> {
    return await db.select().from(neighborhoods);
  }

  async getNeighborhood(id: number): Promise<Neighborhood | undefined> {
    try {
      // Using raw SQL to avoid column name issues
      const result = await db.execute(sql`SELECT * FROM neighborhoods WHERE id = ${id}`);
      if (result.rows.length === 0) {
        return undefined;
      }
      return result.rows[0] as Neighborhood;
    } catch (error) {
      console.error("Neighborhood fetch error:", error);
      throw error;
    }
  }

  /**
   * Get a neighborhood with all its properties included
   * @param id The neighborhood ID
   * @returns Neighborhood with properties or undefined
   */
  async getNeighborhoodWithProperties(id: number): Promise<(Neighborhood & { properties: Property[] }) | undefined> {
    // First get the neighborhood
    const neighborhood = await this.getNeighborhood(id);
    if (!neighborhood) {
      return undefined;
    }

    // Then get its properties
    const neighborhoodProperties = await this.getPropertiesByNeighborhood(id);

    // Return the combined result
    return {
      ...neighborhood,
      properties: neighborhoodProperties
    };
  }

  // Get properties by neighborhood ID
  async getPropertiesByNeighborhood(neighborhoodId: number): Promise<Property[]> {
    try {
      console.log(`Fetching properties for neighborhood ID: ${neighborhoodId}`);

      // Using raw SQL to avoid column name issues
      const result = await db.execute(
        sql`SELECT * FROM properties WHERE "neighborhoodId" = ${neighborhoodId}`
      );

      return result.rows as Property[];
    } catch (error) {
      console.error("Error fetching properties by neighborhood:", error);
      return [];
    }
  }

  async createNeighborhood(insertNeighborhood: InsertNeighborhood): Promise<Neighborhood> {
    try {
      // Extract fields from insertNeighborhood
      const {
        name, city, state, zipCode, description, image, lat, lng, history,
        schools, shopping, dining, recreation, transportation, medianHomePrice, 
        crimeRate, schoolRating, walkScore, yearEstablished, localLandmarks,
        amenities, seoMetaTitle, seoMetaDescription, seoKeywords
      } = insertNeighborhood;

      // Insert using raw SQL
      const result = await db.execute(sql`
        INSERT INTO neighborhoods (
          name, city, state, "zipCode", description, image, lat, lng, history,
          schools, shopping, dining, recreation, transportation, "medianHomePrice", 
          "crimeRate", "schoolRating", "walkScore", "yearEstablished", "localLandmarks",
          amenities, "seoMetaTitle", "seoMetaDescription", "seoKeywords", "createdAt", "updatedAt"
        ) VALUES (
          ${name}, ${city}, ${state}, ${zipCode}, ${description}, ${image || null}, ${lat || null}, ${lng || null}, ${history || null},
          ${schools || null}, ${shopping || null}, ${dining || null}, ${recreation || null}, ${transportation || null}, ${medianHomePrice || null}, 
          ${crimeRate || null}, ${schoolRating || null}, ${walkScore || null}, ${yearEstablished || null}, ${localLandmarks || null},
          ${amenities || null}, ${seoMetaTitle || null}, ${seoMetaDescription || null}, ${seoKeywords || null}, NOW(), NOW()
        ) RETURNING *
      `);

      return result.rows[0] as Neighborhood;
    } catch (error) {
      console.error("Error creating neighborhood:", error);
      throw error;
    }
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getMessages(): Promise<Message[]> {
    return await db.select().from(messages).orderBy(desc(messages.createdAt));
  }

  // Get featured properties (top properties by price)
  async getFeaturedProperties(limit: number = 4): Promise<Property[]> {
    try {
      // Ensure limit is a valid number
      const validLimit = isNaN(limit) || limit <= 0 ? 4 : limit;

      console.log(`Fetching featured properties with limit: ${validLimit}`);

      // Using raw SQL to avoid column name issues
      const result = await db.execute(
        sql`SELECT * FROM properties ORDER BY price DESC LIMIT ${validLimit}`
      );

      // Return the properties
      return result.rows.slice(0, validLimit) as Property[];
    } catch (error) {
      console.error("Error fetching featured properties:", error);
      return [];
    }
  }

  // Update user's last login timestamp
  async updateUserLastLogin(id: number): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Add a property to user's favorites
  async addFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    try {
      // Use raw SQL with correct column names - using camelCase as in the DB schema
      // Check if this favorite already exists
      const existing = await db.execute(
        sql`SELECT * FROM favorites 
            WHERE "userId" = ${insertFavorite.userId} 
            AND "propertyId" = ${insertFavorite.propertyId}`
      );

      // If it already exists, return it
      if (existing.rows.length > 0) {
        return existing.rows[0] as Favorite;
      }

      // Otherwise, create a new favorite
      const result = await db.execute(
        sql`INSERT INTO favorites ("userId", "propertyId") 
            VALUES (${insertFavorite.userId}, ${insertFavorite.propertyId}) 
            RETURNING *`
      );

      return result.rows[0] as Favorite;
    } catch (error) {
      console.error("Error adding favorite:", error);
      throw error;
    }
  }

  // Remove a property from user's favorites
  async removeFavorite(userId: number, propertyId: number): Promise<boolean> {
    try {
      // Use raw SQL with correct column names - using camelCase as in DB schema
      await db.execute(
        sql`DELETE FROM favorites WHERE "userId" = ${userId} AND "propertyId" = ${propertyId}`
      );

      return true;
    } catch (error) {
      console.error("Error removing favorite:", error);
      return false;
    }
  }

  // Get all favorited properties for a user
  async getUserFavorites(userId: number): Promise<Property[]> {
    try {
      console.log(`Getting favorites for user ID: ${userId}`);

      // Using raw SQL for better control over column names - using camelCase as in the DB schema
      const result = await db.execute(
        sql`SELECT p.* FROM properties p
            JOIN favorites f ON p.id = f."propertyId"
            WHERE f."userId" = ${userId}`
      );

      // Convert the raw result to typed array
      const properties = result.rows as Property[];
      console.log(`Found ${properties.length} favorite properties for user ID: ${userId}`);

      return properties;
    } catch (error) {
      console.error("Error getting user favorites:", error);
      return [];
    }
  }

  // Check if a property is in user's favorites
  async isFavorite(userId: number, propertyId: number): Promise<boolean> {
    try {
      // Use raw SQL with correct column names - using camelCase as in the DB schema
      const result = await db.execute(
        sql`SELECT * FROM favorites WHERE "userId" = ${userId} AND "propertyId" = ${propertyId} LIMIT 1`
      );

      // Check if we got any results
      return result.rows.length > 0;
    } catch (error) {
      console.error("Error checking favorite status:", error);
      return false;
    }
  }

  // Get all Airbnb rentals
  async getAirbnbRentals(): Promise<AirbnbRental[]> {
    try {
      // Using raw SQL to avoid column name issues
      const result = await db.execute(
        sql`SELECT * FROM airbnb_rentals`
      );

      return result.rows as AirbnbRental[];
    } catch (error) {
      console.error("Error fetching Airbnb rentals:", error);
      return [];
    }
  }

  // Get a single Airbnb rental by ID
  async getAirbnbRental(id: number): Promise<AirbnbRental | undefined> {
    try {
      // Using raw SQL to avoid column name issues
      const result = await db.execute(sql`SELECT * FROM airbnb_rentals WHERE id = ${id}`);
      if (result.rows.length === 0) {
        return undefined;
      }
      return result.rows[0] as AirbnbRental;
    } catch (error) {
      console.error("Airbnb rental fetch error:", error);
      throw error;
    }
  }

  // Get featured Airbnb rentals
  async getFeaturedAirbnbRentals(limit: number = 4): Promise<AirbnbRental[]> {
    try {
      // Ensure limit is valid
      const validLimit = isNaN(limit) || limit <= 0 ? 4 : limit;

      // Using raw SQL to avoid column name issues
      const result = await db.execute(
        sql`SELECT * FROM airbnb_rentals ORDER BY price DESC LIMIT ${validLimit}`
      );

      // Return the rentals
      return result.rows.slice(0, validLimit) as AirbnbRental[];
    } catch (error) {
      console.error("Error fetching featured Airbnb rentals:", error);
      return [];
    }
  }

  // Search Airbnb rentals with filters
  async searchAirbnbRentals(filters: {
    minPrice?: number;
    maxPrice?: number;
    minBeds?: number;
    minBaths?: number;
    guests?: number;
    city?: string;
    neighborhood?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<AirbnbRental[]> {
    try {
      // First get all rentals using raw SQL
      const result = await db.execute(sql`SELECT * FROM airbnb_rentals`);
      const allRentals = result.rows as AirbnbRental[];

      // Then filter in memory
      let filteredRentals = allRentals.filter(rental => {
        let includeRental = true;

        // Filter by price range
        if (filters.minPrice && rental.price < filters.minPrice) {
          includeRental = false;
        }

        if (filters.maxPrice && rental.price > filters.maxPrice) {
          includeRental = false;
        }

        // Filter by bedrooms
        if (filters.minBeds && (!rental.bedrooms || rental.bedrooms < filters.minBeds)) {
          includeRental = false;
        }

        // Filter by bathrooms
        if (filters.minBaths && (!rental.bathrooms || Number(rental.bathrooms) < filters.minBaths)) {
          includeRental = false;
        }

        // Filter by guests
        if (filters.guests && (!rental.maxGuests || rental.maxGuests < filters.guests)) {
          includeRental = false;
        }

        // Filter by city
        if (filters.city && rental.city && rental.city.toLowerCase().indexOf(filters.city.toLowerCase()) === -1) {
          includeRental = false;
        }

        // Filter by neighborhood
        if (filters.neighborhood && rental.neighborhoodId !== filters.neighborhood) {
          includeRental = false;
        }

        return includeRental;
      });

      // Sort the filtered results
      if (filters.sortBy) {
        const column = filters.sortBy;

        // Determine column name for sorting
        let columnName: keyof AirbnbRental;
        if (column === 'price' || column === 'bedrooms' || column === 'bathrooms' || column === 'maxGuests') {
          columnName = column as keyof AirbnbRental;
        } else {
          // Default to price if invalid column
          columnName = 'price';
        }

        // Apply sort direction
        filteredRentals = filteredRentals.sort((a, b) => {
          const valueA = a[columnName] as number | null;
          const valueB = b[columnName] as number | null;

          // Handle null values (null values always go last)
          if (valueA === null && valueB === null) return 0;
          if (valueA === null) return 1;
          if (valueB === null) return -1;

          // Regular comparison
          if (filters.order && filters.order.toLowerCase() === 'asc') {
            return Number(valueA) - Number(valueB);
          } else {
            return Number(valueB) - Number(valueA);
          }
        });
      } else {
        // Default sorting by price descending
        filteredRentals = filteredRentals.sort((a, b) => {
          return (b.price || 0) - (a.price || 0);
        });
      }

      // Apply pagination if specified
      if (filters.limit && filters.limit > 0) {
        const startIndex = filters.offset || 0;
        const endIndex = startIndex + filters.limit;
        filteredRentals = filteredRentals.slice(startIndex, endIndex);
      }

      return filteredRentals;
    } catch (error) {
      console.error("Error in searchAirbnbRentals:", error);
      return [];
    }
  }

  // Create a new Airbnb rental
  async createAirbnbRental(insertRental: InsertAirbnbRental): Promise<AirbnbRental> {
    try {
      // Extract fields from insertRental
      const {
        type, address, city, state, zipCode, price, bedrooms, bathrooms,
        description, title, maxGuests, neighborhoodId, images, amenities,
        squareFeet, lat, lng, seoMetaTitle, seoMetaDescription, seoKeywords, featured
      } = insertRental;

      // Insert using raw SQL
      const result = await db.execute(sql`
        INSERT INTO airbnb_rentals (
          type, address, city, state, "zipCode", price, bedrooms, bathrooms,
          description, title, "maxGuests", "neighborhoodId", images, amenities,
          "squareFeet", lat, lng, "seoMetaTitle", "seoMetaDescription", "seoKeywords",
          featured, "createdAt", "updatedAt"
        ) VALUES (
          ${type}, ${address}, ${city}, ${state}, ${zipCode}, ${price}, ${bedrooms}, ${bathrooms},
          ${description}, ${title}, ${maxGuests}, ${neighborhoodId || null}, ${images || null}, ${amenities || null},
          ${squareFeet || null}, ${lat || null}, ${lng || null}, ${seoMetaTitle || null}, ${seoMetaDescription || null}, ${seoKeywords || null},
          ${featured || false}, NOW(), NOW()
        ) RETURNING *
      `);

      return result.rows[0] as AirbnbRental;
    } catch (error) {
      console.error("Error creating Airbnb rental:", error);
      throw error;
    }
  }

  // Update an existing Airbnb rental
  async updateAirbnbRental(id: number, rentalData: Partial<AirbnbRental>): Promise<AirbnbRental | undefined> {
    const [rental] = await db
      .update(airbnbRentals)
      .set(rentalData)
      .where(eq(airbnbRentals.id, id))
      .returning();
    return rental;
  }

  // Delete an Airbnb rental
  async deleteAirbnbRental(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(airbnbRentals)
        .where(eq(airbnbRentals.id, id));
      return !!result;
    } catch (error) {
      console.error(`Error deleting Airbnb rental with ID ${id}:`, error);
      return false;
    }
  }
}

// Function to add SEO data for dashboard testing
async function addSEOData() {
  try {
    // Check if SEO data already exists
    const existingKeywords = await db.select({ count: sql`count(*)` }).from(seoKeywords);
    if (Number(existingKeywords[0].count) > 0) {
      console.log("SEO data already exists, skipping initialization");
      return;
    }

    // Sample SEO keywords for tracking
    const sampleKeywords = [
      {
        keyword: "homes laredo",
        category: "primary",
        searchVolume: 5400,
        difficultyScore: 65,
        priority: 10
      },
      {
        keyword: "houses for sale in laredo",
        category: "primary",
        searchVolume: 3600,
        difficultyScore: 62,
        priority: 10
      },
      {
        keyword: "laredo real estate",
        category: "primary",
        searchVolume: 2900,
        difficultyScore: 68,
        priority: 9
      },
      {
        keyword: "luxury homes laredo",
        category: "primary",
        searchVolume: 1300,
        difficultyScore: 55,
        priority: 8
      },
      {
        keyword: "houses for rent in laredo",
        category: "primary",
        searchVolume: 4200,
        difficultyScore: 58,
        priority: 9
      },
      {
        keyword: "condos for rent in laredo",
        category: "primary",
        searchVolume: 1700,
        difficultyScore: 45,
        priority: 8
      },
      {
        keyword: "laredo apartment rentals",
        category: "primary",
        searchVolume: 2100,
        difficultyScore: 50,
        priority: 7
      },
      {
        keyword: "new homes laredo tx",
        category: "long-tail",
        searchVolume: 720,
        difficultyScore: 40,
        priority: 7
      },
      {
        keyword: "affordable homes in laredo",
        category: "long-tail",
        searchVolume: 590,
        difficultyScore: 35,
        priority: 6
      },
      {
        keyword: "best neighborhoods in laredo",
        category: "neighborhood",
        searchVolume: 850,
        difficultyScore: 30,
        priority: 8
      },
      {
        keyword: "north laredo homes for sale",
        category: "neighborhood",
        searchVolume: 480,
        difficultyScore: 25,
        priority: 7
      },
      {
        keyword: "downtown laredo condos",
        category: "neighborhood",
        searchVolume: 320,
        difficultyScore: 20,
        priority: 6
      },
      {
        keyword: "plantation neighborhood laredo",
        category: "neighborhood",
        searchVolume: 210,
        difficultyScore: 15,
        priority: 5
      },
      {
        keyword: "houses with pools laredo",
        category: "long-tail",
        searchVolume: 180,
        difficultyScore: 12,
        priority: 4
      },
      {
        keyword: "4 bedroom house laredo",
        category: "long-tail",
        searchVolume: 290,
        difficultyScore: 22,
        priority: 5
      },
      {
        keyword: "laredo fixer upper homes",
        category: "long-tail",
        searchVolume: 140,
        difficultyScore: 12,
        priority: 3
      },
      {
        keyword: "laredo waterfront property",
        category: "long-tail",
        searchVolume: 110,
        difficultyScore: 28,
        priority: 4
      },
      {
        keyword: "laredo gated community homes",
        category: "long-tail",
        searchVolume: 90,
        difficultyScore: 20,
        priority: 3
      },
      {
        keyword: "laredo smart homes",
        category: "long-tail",
        searchVolume: 70,
        difficultyScore: 15,
        priority: 2
      },
      {
        keyword: "coldwell banker laredo",
        category: "competitor",
        searchVolume: 1200,
        difficultyScore: 72,
        priority: 6
      },
      {
        keyword: "remax laredo",
        category: "competitor",
        searchVolume: 980,
        difficultyScore: 68,
        priority: 6
      },
      {
        keyword: "century 21 laredo",
        category: "competitor",
        searchVolume: 820,
        difficultyScore: 65,
        priority: 5
      },
      {
        keyword: "keller williams laredo",
        category: "competitor",
        searchVolume: 750,
        difficultyScore: 62,
        priority: 5
      },
      {
        keyword: "zillow laredo tx",
        category: "competitor",
        searchVolume: 6200,
        difficultyScore: 85,
        priority: 7
      },
      {
        keyword: "trulia laredo",
        category: "competitor",
        searchVolume: 4800,
        difficultyScore: 82,
        priority: 7
      },
      {
        keyword: "realtor.com laredo",
        category: "competitor",
        searchVolume: 3900,
        difficultyScore: 80,
        priority: 6
      },
      {
        keyword: "homes.com laredo",
        category: "competitor",
        searchVolume: 2100,
        difficultyScore: 75,
        priority: 5
      }
    ];

    // Insert the keywords first
    const keywords = await db.insert(seoKeywords).values(sampleKeywords).returning();
    console.log(`Added ${keywords.length} SEO keywords for tracking`);

    // Create sample rankings for the keywords
    const today = new Date();
    const sampleRankings = [];

    // For each keyword, create a ranking entry
    for (const keyword of keywords) {
      // For primary keywords, show Ohana ranking higher than competitors
      if (keyword.category === 'primary') {
        sampleRankings.push({
          keywordId: keyword.id,
          position: Math.floor(Math.random() * 3) + 1, // Position 1-3
          date: today,
          url: `https://ohanarealty.com/search?q=${encodeURIComponent(keyword.keyword)}`,
          coldwellPosition: Math.floor(Math.random() * 5) + 4, // Position 4-8
          remaxPosition: Math.floor(Math.random() * 5) + 5, // Position 5-9
          zillowPosition: Math.floor(Math.random() * 3) + 2, // Position 2-4
          truliaPosition: Math.floor(Math.random() * 4) + 6 // Position 6-9
        });
      } 
      // For neighborhood keywords, also ranking well
      else if (keyword.category === 'neighborhood') {
        sampleRankings.push({
          keywordId: keyword.id,
          position: Math.floor(Math.random() * 4) + 1, // Position 1-4
          date: today,
          url: `https://ohanarealty.com/neighborhoods?q=${encodeURIComponent(keyword.keyword)}`,
          coldwellPosition: Math.floor(Math.random() * 5) + 3, // Position 3-7
          remaxPosition: Math.floor(Math.random() * 5) + 4, // Position 4-8
          zillowPosition: Math.floor(Math.random() * 3) + 1, // Position 1-3
          truliaPosition: Math.floor(Math.random() * 5) + 5 // Position 5-9
        });
      }
      // For long-tail keywords, mixed results
      else if (keyword.category === 'long-tail') {
        sampleRankings.push({
          keywordId: keyword.id,
          position: Math.floor(Math.random() * 10) + 1, // Position 1-10
          date: today,
          url: `https://ohanarealty.com/properties?q=${encodeURIComponent(keyword.keyword)}`,
          coldwellPosition: Math.floor(Math.random() * 10) + 1, // Position 1-10
          remaxPosition: Math.floor(Math.random() * 10) + 1, // Position 1-10
          zillowPosition: Math.floor(Math.random() * 10) + 1, // Position 1-10
          truliaPosition: Math.floor(Math.random() * 10) + 1 // Position 1-10
        });
      }
      // For competitor keywords, ranking below them
      else if (keyword.category === 'competitor') {
        sampleRankings.push({
          keywordId: keyword.id,
          position: Math.floor(Math.random() * 5) + 6, // Position 6-10
          date: today,
          url: `https://ohanarealty.com`,
          coldwellPosition: keyword.keyword.includes('coldwell') ? 1 : Math.floor(Math.random() * 5) + 3,
          remaxPosition: keyword.keyword.includes('remax') ? 1 : Math.floor(Math.random() * 5) + 3,
          zillowPosition: keyword.keyword.includes('zillow') ? 1 : Math.floor(Math.random() * 5) + 3,
          truliaPosition: keyword.keyword.includes('trulia') ? 1 : Math.floor(Math.random() * 5) + 3
        });
      }
    }

    // Insert all the rankings
    await db.insert(seoRankings).values(sampleRankings);
    console.log(`SEO data initialized with ${keywords.length} keywords and ${sampleRankings.length} rankings`);
  } catch (error) {
    console.error("Error adding SEO data:", error);
  }
}

// Initialize sample data function
export async function initializeSampleData() {
  // Featured Properties - real listings
  const sampleProperties: InsertProperty[] = [
    {
      type: 'house',
      address: '11118 Don Tomas Loop',
      city: 'Laredo',
      state: 'TX',
      zipCode: '78045',
      price: 135000,
      bedrooms: 3,
      bathrooms: '2.0',
      squareFeet: 1200,
      description: 'Charming 3-bedroom, 2-bathroom home in a desirable Laredo neighborhood. This well-maintained property features a spacious living area, modern kitchen, and a large backyard perfect for entertaining. Great location with easy access to schools, shopping, and major highways.',
      features: ['garage', 'backyard', 'modern kitchen', 'tile flooring', 'central air', 'fenced yard'],
      images: [
        '/images/properties/don-tomas-loop-fixed/img1.jpg',
        '/images/properties/don-tomas-loop-fixed/img2.jpg',
        '/images/properties/don-tomas-loop-fixed/img3.jpg',
        '/images/properties/don-tomas-loop-fixed/img4.jpg',
        '/images/properties/don-tomas-loop-fixed/img5.jpg',
        '/images/properties/don-tomas-loop-fixed/img6.jpg',
        '/images/properties/don-tomas-loop-fixed/img7.jpg'
      ],
      status: 'active',
      featured: true,
      neighborhoodId: 1,
      yearBuilt: 2015,
      parkingSpaces: 2,
      lat: '27.5806',
      lng: '-99.4739'
    },
    {
      type: 'condo',
      address: '505 Shiloh Dr Unit 6',
      city: 'Laredo',
      state: 'TX',
      zipCode: '78045',
      price: 95000,
      bedrooms: 2,
      bathrooms: '1.0',
      squareFeet: 900,
      description: 'Affordable 2-bedroom, 1-bathroom condo in a well-maintained complex. Perfect for first-time buyers or investors. Features include updated kitchen, spacious bedrooms, and community amenities. Great location near shopping and dining.',
      features: ['updated kitchen', 'community pool', 'laundry hookups', 'covered parking', 'gated community'],
      images: [
        '/assets/shiloh-dr/505-shiloh-dr-unit-6-laredo-tx-primary-photo(1).jpg',
        '/assets/shiloh-dr/505-shiloh-dr-unit-6-laredo-tx-building-photo.jpg',
        '/assets/shiloh-dr/505-shiloh-dr-unit-6-laredo-tx-building-photo(1).jpg',
        '/assets/shiloh-dr/505-shiloh-dr-unit-6-laredo-tx-building-photo(2).jpg',
        '/assets/shiloh-dr/505-shiloh-dr-unit-6-laredo-tx-building-photo(3).jpg'
      ],
      status: 'active',
      featured: true,
      neighborhoodId: 2,
      yearBuilt: 2010,
      parkingSpaces: 1,
      lat: '27.5742',
      lng: '-99.4685'
    },
    {
      type: 'house',
      address: '1314 Iturbide St',
      city: 'Laredo',
      state: 'TX',
      zipCode: '78040',
      price: 165000,
      bedrooms: 3,
      bathrooms: '2.0',
      squareFeet: 1350,
      description: 'Beautiful 3-bedroom, 2-bathroom home in the heart of Laredo. This property offers a perfect blend of comfort and convenience with updated features throughout. Close to downtown amenities and major transportation routes.',
      features: ['hardwood floors', 'updated bathrooms', 'large kitchen', 'covered patio', 'mature trees'],
      images: [
        '/images/properties/1314-iturbide-st/img1.jpg',
        '/images/properties/1314-iturbide-st/img2.jpg',
        '/images/properties/1314-iturbide-st/img3.jpg',
        '/images/properties/1314-iturbide-st/img4.jpg',
        '/images/properties/1314-iturbide-st/img5.jpg',
        '/images/properties/1314-iturbide-st/img6.jpg',
        '/images/properties/1314-iturbide-st/img7.jpg',
        '/images/properties/1314-iturbide-st/img8.jpg'
      ],
      status: 'active',
      featured: true,
      neighborhoodId: 3,
      yearBuilt: 2008,
      parkingSpaces: 2,
      lat: '27.5036',
      lng: '-99.5075'
    },
    {
      type: 'house',
      address: '1318 Iturbide St',
      city: 'Laredo',
      state: 'TX',
      zipCode: '78040',
      price: 175000,
      bedrooms: 4,
      bathrooms: '2.5',
      squareFeet: 1600,
      description: 'Spacious 4-bedroom, 2.5-bathroom family home with modern amenities. This well-designed property features an open floor plan, master suite, and plenty of storage space. Perfect for growing families.',
      features: ['open floor plan', 'master suite', 'walk-in closets', 'double garage', 'sprinkler system'],
      images: [
        '/images/properties/1318-iturbide-st/img1.jpg',
        '/images/properties/1318-iturbide-st/img2.jpg',
        '/images/properties/1318-iturbide-st/img3.jpg',
        '/images/properties/1318-iturbide-st/img4.jpg',
        '/images/properties/1318-iturbide-st/img5.jpg',
        '/images/properties/1318-iturbide-st/img6.jpg',
        '/images/properties/1318-iturbide-st/img7.jpg',
        '/images/properties/1318-iturbide-st/img8.jpg'
      ],
      status: 'active',
      featured: true,
      neighborhoodId: 3,
      yearBuilt: 2012,
      parkingSpaces: 2,
      lat: '27.5038',
      lng: '-99.5073'
    },
    {
      type: 'house',
      address: '3405 Juan Novoa Dr',
      city: 'Laredo',
      state: 'TX',
      zipCode: '78046',
      price: 220000,
      bedrooms: 3,
      bathrooms: '2.0',
      squareFeet: 1450,
      description: 'Stunning 3-bedroom, 2-bathroom home in a prime Laredo location. This property features contemporary design, energy-efficient appliances, and a beautifully landscaped yard. Great neighborhood with excellent schools nearby.',
      features: ['energy efficient', 'landscaped yard', 'granite countertops', 'tile throughout', 'security system'],
      images: [
        '/images/properties/3405-juan-novoa-dr/img1.png',
        '/images/properties/3405-juan-novoa-dr/img2.jpg'
      ],
      status: 'active',
      featured: true,
      neighborhoodId: 4,
      yearBuilt: 2018,
      parkingSpaces: 2,
      lat: '27.5500',
      lng: '-99.4800'
    },
    {
      type: 'house',
      address: '3720 Flores Ave',
      city: 'Laredo',
      state: 'TX',
      zipCode: '78041',
      price: 195000,
      bedrooms: 3,
      bathrooms: '2.0',
      squareFeet: 1300,
      description: 'Charming 3-bedroom, 2-bathroom home on Flores Avenue. This property offers comfortable living with updated features and a great location. Perfect for families looking for a move-in ready home.',
      features: ['move-in ready', 'updated fixtures', 'corner lot', 'mature landscaping', 'covered parking'],
      images: [
        '/images/properties/3720-flores-ave/img1.webp',
        '/images/properties/3720-flores-ave/img2.webp',
        '/images/properties/3720-flores-ave/img3.webp',
        '/images/properties/3720-flores-ave/img4.webp'
      ],
      status: 'active',
      featured: true,
      neighborhoodId: 5,
      yearBuilt: 2014,
      parkingSpaces: 2,
      lat: '27.5200',
      lng: '-99.4900'
    }
  ];

  const sampleNeighborhoods: InsertNeighborhood[] = [
    {
      name: 'Del Mar',
      description: 'A prestigious waterfront neighborhood offering luxury living with beautiful views and upscale amenities.',
      city: 'Laredo',
      state: 'TX',
      zipCode: '78045',
      image: '/assets/del-mar.png',
      lat: '27.5806',
      lng: '-99.4739',
      amenities: ['waterfront access', 'golf course', 'marina', 'upscale shopping'],
      history: 'Del Mar is one of Laredo\'s most sought-after neighborhoods, developed in the 1990s as a master-planned community.',
      schools: ['Del Mar Elementary', 'Memorial Middle School', 'United High School'],
      shopping: ['Mall Del Norte', 'Village at Del Mar', 'HEB Plus'],
      dining: ['Palenque Grill', 'Cafe Dolce Vita', 'Casa Blanca Restaurant'],
      recreation: ['Del Mar Golf Course', 'Del Mar Park', 'Lake Casa Blanca'],
      transportation: ['I-35 Access', 'Loop 20', 'Public Transit'],
      medianHomePrice: 180000,
      crimeRate: 2.5,
      schoolRating: 8.5,
      walkScore: 65,
      yearEstablished: 1995,
      localLandmarks: ['Lake Casa Blanca', 'Del Mar Golf Course', 'Laredo Country Club']
    },
    {
      name: 'North Laredo',
      description: 'Family-friendly area with excellent schools, parks, and convenient shopping. A growing community perfect for families.',
      city: 'Laredo',
      state: 'TX',
      zipCode: '78045',
      image: '/assets/north-laredo-industrial-park.png',
      lat: '27.5742',
      lng: '-99.4685',
      amenities: ['parks', 'schools', 'shopping centers', 'medical facilities'],
      history: 'North Laredo has experienced significant growth since 2000, becoming a hub for families and young professionals.',
      schools: ['North Elementary', 'Laredo Middle School Academy', 'Alexander High School'],
      shopping: ['Outlet Shoppes at Laredo', 'Walmart Supercenter', 'Target'],
      dining: ['Chili\'s', 'Olive Garden', 'Local Tex-Mex favorites'],
      recreation: ['North Central Park', 'Uni-Trade Stadium', 'Youth Sports Complex'],
      transportation: ['I-35 Corridor', 'Bob Bullock Loop', 'City Bus Routes'],
      medianHomePrice: 125000,
      crimeRate: 3.2,
      schoolRating: 7.8,
      walkScore: 55,
      yearEstablished: 2000,
      localLandmarks: ['Uni-Trade Stadium', 'North Central Park', 'Laredo Medical Center']
    },
    {
      name: 'Downtown Historic District',
      description: 'Rich in history and culture, the heart of Laredo with historic architecture and vibrant city life.',
      city: 'Laredo',
      state: 'TX',
      zipCode: '78040',
      image: '/assets/downtown-laredo.png',
      lat: '27.5036',
      lng: '-99.5075',
      amenities: ['historic sites', 'cultural venues', 'restaurants', 'government buildings'],
      history: 'Founded in 1755, Downtown Laredo is the historic heart of the city with beautiful colonial architecture.',
      schools: ['Cigarroa Elementary', 'J.W. Nixon High School', 'Laredo Community College'],
      shopping: ['San Bernardo Avenue', 'Mercado District', 'Historic Downtown Shops'],
      dining: ['Taco Palenque', 'Zaragoza Grill', 'La Mexicana Restaurant'],
      recreation: ['San Agustin Plaza', 'Jarvis Plaza', 'Republic of Rio Grande Museum'],
      transportation: ['Downtown Transit Hub', 'International Bridge Access', 'Historic Trolley'],
      medianHomePrice: 85000,
      crimeRate: 4.1,
      schoolRating: 6.5,
      walkScore: 85,
      yearEstablished: 1755,
      localLandmarks: ['San Agustin Cathedral', 'Republic of Rio Grande Museum', 'Laredo Center for the Arts']
    },
    {
      name: 'West Laredo',
      description: 'A developing area with modern amenities and great potential for growth. Perfect for young families and professionals.',
      city: 'Laredo',
      state: 'TX',
      zipCode: '78046',
      image: '/assets/beautiful-home-exterior_994641-29.avif',
      lat: '27.5500',
      lng: '-99.4800',
      amenities: ['new developments', 'shopping', 'dining', 'recreational facilities'],
      history: 'West Laredo has seen rapid development since 2010, attracting families with its modern infrastructure.',
      schools: ['West Elementary', 'Laredo ISD Schools', 'Private School Options'],
      shopping: ['The Shops at West Laredo', 'HEB', 'Retail Centers'],
      dining: ['Chain Restaurants', 'Local Favorites', 'Fast Casual Options'],
      recreation: ['West Laredo Park', 'Sports Complex', 'Walking Trails'],
      transportation: ['Highway Access', 'Public Transportation', 'Major Roads'],
      medianHomePrice: 165000,
      crimeRate: 2.8,
      schoolRating: 7.5,
      walkScore: 50,
      yearEstablished: 2010,
      localLandmarks: ['West Laredo Park', 'Shopping Centers', 'Modern Residential Areas']
    },
    {
      name: 'South Laredo',
      description: 'Established neighborhood with tree-lined streets, local charm, and affordable housing options.',
      city: 'Laredo',
      state: 'TX',
      zipCode: '78041',
      image: '/assets/south-laredo.png',
      lat: '27.5200',
      lng: '-99.4900',
      amenities: ['established community', 'local businesses', 'parks', 'schools'],
      history: 'South Laredo is one of the city\'s oldest residential areas, known for its strong community ties.',
      schools: ['South Elementary', 'Cigarroa High School', 'Community Schools'],
      shopping: ['Local Markets', 'Neighborhood Stores', 'Small Business District'],
      dining: ['Family Restaurants', 'Tex-Mex Cuisine', 'Local Cafes'],
      recreation: ['Neighborhood Parks', 'Community Centers', 'Youth Programs'],
      transportation: ['Local Bus Routes', 'Major Street Access', 'Walkable Areas'],
      medianHomePrice: 95000,
      crimeRate: 3.5,
      schoolRating: 6.8,
      walkScore: 60,
      yearEstablished: 1960,
      localLandmarks: ['Historic Churches', 'Community Centers', 'Local Parks']
    }
  ];
  try {
    // Check if data already exists
    const existingProperties = await db.select({ count: sql`count(*)` }).from(properties);
    if (Number(existingProperties[0].count) > 0) {
      console.log("Data already exists, skipping initialization");

      // Always add SEO data for testing the dashboard
      await addSEOData();

      return; // Data already exists
    }

    // Insert sample neighborhoods
    await db.insert(neighborhoods).values(sampleNeighborhoods);
    console.log("Inserted sample neighborhoods");

    // Insert sample properties
    await db.insert(properties).values(sampleProperties);
    console.log("Inserted sample properties");
  } catch (error) {
    console.error("Error initializing sample data:", error);
  }

  // Call addSEOData to initialize SEO data
  await addSEOData();
}

// Use database storage
export const storage = new DatabaseStorage();