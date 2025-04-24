import { properties, neighborhoods, messages, users, favorites } from "@shared/schema";
import type { Property, InsertProperty, Neighborhood, InsertNeighborhood, Message, InsertMessage, User, InsertUser, Favorite, InsertFavorite } from "@shared/schema";
import { db } from './db';
import { eq, sql, and, or, type SQL } from 'drizzle-orm';

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
    return await db.select().from(properties);
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
    // Create an array to hold query conditions
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
    
    // Log the search filters for debugging
    console.log("Searching properties with filters:", JSON.stringify(filters, null, 2));
    
    // Start building the query
    let query = db.select().from(properties);
    
    // Apply filtering conditions if they exist
    if (conditions.length > 0) {
      // Combine conditions with AND logic
      const whereClause = conditions.reduce((combined, current, index) => {
        if (index === 0) return current;
        return sql`${combined} AND ${current}`;
      });
      
      query = query.where(whereClause);
    }
    
    // Apply sorting if specified
    if (filters.sortBy) {
      const column = filters.sortBy;
      
      // Determine which column to sort by
      let sortColumn: SQL;
      if (column === 'price') {
        sortColumn = properties.price;
      } else if (column === 'bedrooms') {
        sortColumn = properties.bedrooms;
      } else if (column === 'bathrooms') {
        sortColumn = properties.bathrooms;
      } else if (column === 'squareFeet') {
        sortColumn = properties.squareFeet;
      } else {
        // Default to price if invalid column
        sortColumn = properties.price;
      }
      
      // Apply sort direction
      if (filters.order && filters.order.toLowerCase() === 'asc') {
        query = query.orderBy(sql`${sortColumn} ASC`);
      } else {
        query = query.orderBy(sql`${sortColumn} DESC`);
      }
    } else {
      // Default sorting by price descending
      query = query.orderBy(sql`${properties.price} DESC`);
    }
    
    // Apply pagination if specified
    if (filters.limit && filters.limit > 0) {
      query = query.limit(filters.limit);
      
      if (filters.offset && filters.offset >= 0) {
        query = query.offset(filters.offset);
      }
    }
    
    // Execute the final query
    return await query;
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
    return await db.select().from(messages).orderBy(sql`${messages.createdAt} DESC`);
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
      .orderBy(sql`${properties.price} DESC`)
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
}

// Initialize sample data function
export async function initializeSampleData() {
  // Check if data already exists
  const existingProperties = await db.select({ count: sql`count(*)` }).from(properties);
  if (Number(existingProperties[0].count) > 0) {
    console.log("Data already exists, skipping initialization");
    return; // Data already exists
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

// Use database storage
export const storage = new DatabaseStorage();
