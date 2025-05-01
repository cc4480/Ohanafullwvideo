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
      // Simple optimized query with error handling and consistent performance
      return await db.select().from(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      // Return empty array instead of throwing error
      return [];
    }
  }

  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property || undefined;
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
      conditions.push(eq(properties.neighborhood, filters.neighborhood));
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
      // Build a query that combines all filters without complex query building
      // that was causing TypeScript errors
      
      // Create separate queries for each filter condition
      // and then combine results in memory to avoid TypeScript errors
      
      // First get all properties
      const allProperties = await db.select().from(properties);
      
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
        if (filters.minBaths && (!property.bathrooms || property.bathrooms < filters.minBaths)) {
          includeProperty = false;
        }
        
        // Filter by city
        if (filters.city && property.city.toLowerCase().indexOf(filters.city.toLowerCase()) === -1) {
          includeProperty = false;
        }
        
        // Filter by zipCode
        if (filters.zipCode && property.zipCode !== filters.zipCode) {
          includeProperty = false;
        }
        
        // Filter by neighborhood
        if (filters.neighborhood && property.neighborhood !== filters.neighborhood) {
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
            return valueA - valueB;
          } else {
            return valueB - valueA;
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
    const [property] = await db
      .insert(properties)
      .values(insertProperty)
      .returning();
    return property;
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
    const [neighborhood] = await db.select().from(neighborhoods).where(eq(neighborhoods.id, id));
    return neighborhood || undefined;
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
    console.log(`Fetching properties for neighborhood ID: ${neighborhoodId}`);
    
    return await db
      .select()
      .from(properties)
      .where(eq(properties.neighborhood, neighborhoodId));
  }

  async createNeighborhood(insertNeighborhood: InsertNeighborhood): Promise<Neighborhood> {
    const [neighborhood] = await db
      .insert(neighborhoods)
      .values(insertNeighborhood)
      .returning();
    return neighborhood;
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
    // Ensure limit is a valid number
    const validLimit = isNaN(limit) || limit <= 0 ? 4 : limit;
    
    console.log(`Fetching featured properties with limit: ${validLimit}`);
    
    // Build a more explicit query to control the limit
    const result = await db
      .select()
      .from(properties)
      .orderBy(desc(properties.price))
      .limit(validLimit);
    
    // Only return the specified number of properties, enforced by JavaScript
    return result.slice(0, validLimit);
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
      // Check if this favorite already exists
      const existing = await db
        .select()
        .from(favorites)
        .where(and(
          eq(favorites.userId, insertFavorite.userId),
          eq(favorites.propertyId, insertFavorite.propertyId)
        ));
      
      // If it already exists, return it
      if (existing.length > 0) {
        return existing[0];
      }
      
      // Otherwise, create a new favorite
      const [favorite] = await db
        .insert(favorites)
        .values(insertFavorite)
        .returning();
      
      return favorite;
    } catch (error) {
      console.error("Error adding favorite:", error);
      throw error;
    }
  }
  
  // Remove a property from user's favorites
  async removeFavorite(userId: number, propertyId: number): Promise<boolean> {
    try {
      await db
        .delete(favorites)
        .where(and(
          eq(favorites.userId, userId),
          eq(favorites.propertyId, propertyId)
        ));
      
      return true;
    } catch (error) {
      console.error("Error removing favorite:", error);
      return false;
    }
  }
  
  // Get all favorited properties for a user
  async getUserFavorites(userId: number): Promise<Property[]> {
    try {
      // First get all favorites for the user
      const userFavorites = await db
        .select()
        .from(favorites)
        .where(eq(favorites.userId, userId));
      
      // If the user has no favorites, return empty array
      if (userFavorites.length === 0) {
        return [];
      }
      
      // Extract the property IDs
      const propertyIds = userFavorites.map(fav => fav.propertyId);
      
      // Execute separate queries for each property
      // This avoids issues with SQL parameter formatting
      const favoriteProperties: Property[] = [];
      
      // Get each property individually
      for (const propId of propertyIds) {
        const property = await this.getProperty(propId);
        if (property) {
          favoriteProperties.push(property);
        }
      }
      
      return favoriteProperties;
    } catch (error) {
      console.error("Error getting user favorites:", error);
      return [];
    }
  }
  
  // Check if a property is in user's favorites
  async isFavorite(userId: number, propertyId: number): Promise<boolean> {
    try {
      const favorite = await db
        .select()
        .from(favorites)
        .where(and(
          eq(favorites.userId, userId),
          eq(favorites.propertyId, propertyId)
        ));
      
      return favorite.length > 0;
    } catch (error) {
      console.error("Error checking favorite status:", error);
      return false;
    }
  }

  // Airbnb rental methods implementation
  async getAirbnbRentals(): Promise<AirbnbRental[]> {
    try {
      return await db.select().from(airbnbRentals);
    } catch (error) {
      console.error("Error fetching Airbnb rentals:", error);
      return [];
    }
  }

  async getAirbnbRental(id: number): Promise<AirbnbRental | undefined> {
    try {
      const [rental] = await db.select().from(airbnbRentals).where(eq(airbnbRentals.id, id));
      return rental || undefined;
    } catch (error) {
      console.error(`Error fetching Airbnb rental with ID ${id}:`, error);
      return undefined;
    }
  }

  async getFeaturedAirbnbRentals(limit: number = 4): Promise<AirbnbRental[]> {
    try {
      // Ensure limit is a valid number
      const validLimit = isNaN(limit) || limit <= 0 ? 4 : limit;
      
      console.log(`Fetching featured Airbnb rentals with limit: ${validLimit}`);
      
      // Build a query to get the top rated rentals
      const result = await db
        .select()
        .from(airbnbRentals)
        .orderBy(desc(airbnbRentals.rating))
        .limit(validLimit);
      
      return result.slice(0, validLimit);
    } catch (error) {
      console.error("Error fetching featured Airbnb rentals:", error);
      return [];
    }
  }

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
      // First get all Airbnb rentals
      const allRentals = await db.select().from(airbnbRentals);
      
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
        if (filters.minBeds && rental.bedrooms < filters.minBeds) {
          includeRental = false;
        }
        
        // Filter by bathrooms
        if (filters.minBaths && rental.bathrooms < filters.minBaths) {
          includeRental = false;
        }
        
        // Filter by guest capacity
        if (filters.guests && rental.guests < filters.guests) {
          includeRental = false;
        }
        
        // Filter by city
        if (filters.city && rental.city.toLowerCase().indexOf(filters.city.toLowerCase()) === -1) {
          includeRental = false;
        }
        
        // Filter by neighborhood
        if (filters.neighborhood && rental.neighborhood !== filters.neighborhood) {
          includeRental = false;
        }
        
        return includeRental;
      });
      
      // Sort the filtered results
      if (filters.sortBy) {
        const column = filters.sortBy;
        
        // Determine column name for sorting
        let columnName: keyof AirbnbRental;
        if (column === 'price' || column === 'bedrooms' || column === 'bathrooms' || column === 'guests' || column === 'rating') {
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
            return valueA - valueB;
          } else {
            return valueB - valueA;
          }
        });
      } else {
        // Default sorting by rating descending
        filteredRentals = filteredRentals.sort((a, b) => {
          return (b.rating || 0) - (a.rating || 0);
        });
      }
      
      // Apply pagination if specified
      if (filters.limit && filters.limit > 0) {
        const startIndex = filters.offset || 0;
        const endIndex = startIndex + filters.limit;
        filteredRentals = filteredRentals.slice(startIndex, endIndex);
      }
      
      // Log the filter criteria and result count
      console.log(`Search completed with ${filteredRentals.length} Airbnb rentals found`);
      
      return filteredRentals;
    } catch (error) {
      console.error("Error in searchAirbnbRentals:", error);
      return [];
    }
  }

  async createAirbnbRental(insertRental: InsertAirbnbRental): Promise<AirbnbRental> {
    try {
      const [rental] = await db
        .insert(airbnbRentals)
        .values(insertRental)
        .returning();
      return rental;
    } catch (error) {
      console.error("Error creating Airbnb rental:", error);
      throw error;
    }
  }

  async updateAirbnbRental(id: number, rentalData: Partial<AirbnbRental>): Promise<AirbnbRental | undefined> {
    try {
      const [rental] = await db
        .update(airbnbRentals)
        .set(rentalData)
        .where(eq(airbnbRentals.id, id))
        .returning();
      return rental;
    } catch (error) {
      console.error(`Error updating Airbnb rental with ID ${id}:`, error);
      return undefined;
    }
  }

  async deleteAirbnbRental(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(airbnbRentals)
        .where(eq(airbnbRentals.id, id));
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
// Initialize database with sample data
export async function initializeSampleData() {
  try {
    // Check if data already exists
    const existingProperties = await db.select({ count: sql`count(*)` }).from(properties);
    if (Number(existingProperties[0].count) > 0) {
      // Skip Airbnb rentals initialization entirely per customer request
      console.log("Data already exists, skipping initialization");
      
      // Always add SEO data for testing the dashboard
      await addSEOData();
      
      return; // Data already exists
    }
  } catch (error) {
    console.error("Error checking existing data:", error);
  }

  // Sample properties
  const sampleProperties = [
    {
      address: "3720 Flores Ave",
      city: "Laredo",
      state: "TX",
      zipCode: "78041",
      price: 359000,
      bedrooms: 4,
      bathrooms: 3,
      squareFeet: 2800,
      description: "Beautiful home in prime location. This spacious property features hardwood floors, updated kitchen with granite countertops, and a large backyard perfect for entertaining. The master suite includes a walk-in closet and spa-like bathroom. Located in a quiet neighborhood close to schools, parks, and shopping centers.",
      type: "RESIDENTIAL",
      status: "ACTIVE",
      yearBuilt: 2015,
      features: ["Hardwood floors", "Granite countertops", "Stainless steel appliances", "Attached garage", "Central AC", "Fenced yard"],
      images: [
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
      ],
      lat: 27.523389,
      lng: -99.487146,
      neighborhood: 1
    },
    {
      address: "1318 & 1314 Iturbide St",
      city: "Laredo",
      state: "TX",
      zipCode: "78040",
      price: 899000,
      squareFeet: 5400,
      description: "Prime commercial opportunity in downtown Laredo. This property offers excellent visibility and high foot traffic, making it ideal for retail or office space. The building features large display windows, updated electrical, and plenty of parking. Great investment potential with steady appreciation in this rapidly developing area.",
      type: "COMMERCIAL",
      status: "ACTIVE",
      yearBuilt: 1995,
      features: ["High visibility location", "Corner lot", "Renovated interior", "Ample parking", "Separate storage space", "Security system"],
      images: [
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
      ],
      lat: 27.507068,
      lng: -99.507283,
      neighborhood: 2
    },
    {
      address: "245 Brumoso Ct",
      city: "Laredo",
      state: "TX",
      zipCode: "78041",
      price: 425000,
      bedrooms: 5,
      bathrooms: 4,
      squareFeet: 3200,
      description: "Luxurious family home in exclusive gated community. This elegant residence features high ceilings, custom finishes, and an open floor plan perfect for entertaining. The gourmet kitchen includes premium appliances and a large island. Master suite with spa bathroom and walk-in closets. Beautiful landscaped yard with covered patio and built-in BBQ area.",
      type: "RESIDENTIAL",
      status: "ACTIVE",
      yearBuilt: 2018,
      features: ["Gated community", "Smart home system", "Custom cabinetry", "Quartz countertops", "Walk-in closets", "Energy-efficient appliances", "Covered patio"],
      images: [
        "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1604014438553-9e574a54ba62?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
      ],
      lat: 27.542321,
      lng: -99.480752,
      neighborhood: 1
    }
  ];

  // Sample neighborhoods
  const sampleNeighborhoods = [
    {
      name: "North Laredo",
      description: "A growing residential area with plenty of amenities including shopping centers, parks, and top-rated schools. North Laredo offers a suburban feel while still being close to all city conveniences.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      features: ["Family-friendly", "Top schools", "Shopping centers", "Parks and recreation", "Modern developments"],
      lat: 27.5419,
      lng: -99.4815
    },
    {
      name: "Downtown Laredo",
      description: "Historic downtown area with rich cultural heritage, government offices, and emerging businesses. The area is experiencing revitalization with new restaurants, shops, and entertainment venues.",
      image: "https://images.unsplash.com/photo-1581280525830-33b94edc8707?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      features: ["Historic architecture", "Cultural attractions", "Business district", "Rio Grande views", "Emerging nightlife"],
      lat: 27.507,
      lng: -99.5075
    },
    {
      name: "Del Mar",
      description: "Established neighborhood known for its beautiful homes, tree-lined streets, and excellent location. Del Mar offers a mix of older character homes and newer constructions, with easy access to schools and shopping.",
      image: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      features: ["Mature trees", "Character homes", "Strong community", "Convenient location", "Well-maintained properties"],
      lat: 27.5315,
      lng: -99.4765
    }
  ];

  // Insert sample data
  try {
    // Insert neighborhoods first
    await db.insert(neighborhoods).values(sampleNeighborhoods);
    
    // Then insert properties
    await db.insert(properties).values(sampleProperties);
    
    console.log("Sample data initialized successfully");
  } catch (error) {
    console.error("Error initializing sample data:", error);
  }
}

// Function to add Airbnb rentals
async function addAirbnbRentals() {
  // Sample Airbnb rental based on user request with uploaded AVIF images
  const sampleRentals = [
    {
      title: "Luxurious 2BR Downtown Apartment - Near River Walk",
      address: "425 Market Street",
      city: "Laredo",
      state: "Texas",
      zipCode: "78040",
      price: 145, // Price per night
      description: "Enjoy this beautiful rental unit in the heart of Laredo. Perfect for both short and extended stays with all the comforts of home. This newly renovated apartment features modern furnishings, high-end appliances, and a stunning view of downtown Laredo. Located just steps away from the scenic River Walk, you'll have easy access to shopping, dining, and entertainment. Whether you're visiting for business or pleasure, this luxury apartment offers the perfect combination of comfort, convenience, and style.",
      guests: 4,
      bedrooms: 2,
      beds: 2,
      bathrooms: 2,
      amenities: [
        "Free high-speed WiFi", 
        "Modern full kitchen with granite countertops", 
        "In-unit washer/dryer", 
        "Central air conditioning",
        "Smart TV with premium streaming services",
        "Dedicated workspace with ergonomic chair",
        "Free secured parking",
        "Pool access with lounging area",
        "24-hour fitness center",
        "Contactless self check-in",
        "Cleaning products provided",
        "Coffee maker and complimentary coffee"
      ],
      highlights: [
        "Exceptional check-in experience",
        "Sparkling clean with enhanced sanitization",
        "Great downtown location near River Walk",
        "Professional hospitality with 24/7 support",
        "Fast and reliable internet for remote work"
      ],
      images: [
        "/attached_assets/c2b0b3fe-cb9a-4fb3-8d2c-ae98d4d7d42e.avif",
        "/attached_assets/334820f6-c947-4ccc-b235-95c82d2632c9.avif",
        "/attached_assets/dd475122-ac40-4402-bb0c-d50f3c799c4d.avif",
        "/attached_assets/bb715d2c-1bd0-4e76-ad13-3007b26c3eb7.avif",
        "/attached_assets/c254a014-5cc8-4fab-b8ce-b54fedcf4a6e.avif",
        "/attached_assets/c25b907e-f6e4-4211-9754-c30385cc6fe3.avif",
        "/attached_assets/c40dd59e-0e3a-4ee3-8366-d46f065ac774.avif",
        "/attached_assets/f6c0b7dd-c5cb-442d-9f79-a364cdd461c3.avif",
        "/attached_assets/3348dbfd-67f6-4c8c-b771-0c70fed16cf3.avif"
      ],
      rating: 4.96,
      reviewCount: 148,
      lat: 27.505823,
      lng: -99.502912,
      neighborhood: 2, // Downtown Laredo
      cancellationPolicy: "Free cancellation before 4:00 PM on May 15. After that, cancel before check-in and get a 50% refund, minus the service fee.",
      propertyId: null // Not linked to a regular property
    }
  ];

  try {
    // Insert the Airbnb rentals
    await db.insert(airbnbRentals).values(sampleRentals);
    console.log("Airbnb rentals added successfully");
  } catch (error) {
    console.error("Error adding Airbnb rentals:", error);
  }
}

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
        difficultyScore: 18,
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

// Use database storage
export const storage = new DatabaseStorage();
