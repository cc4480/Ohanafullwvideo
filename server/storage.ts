import { properties, neighborhoods, messages, users } from "@shared/schema";
import type { Property, InsertProperty, Neighborhood, InsertNeighborhood, Message, InsertMessage, User, InsertUser } from "@shared/schema";
import { db } from './db';
import { eq, sql } from 'drizzle-orm';

// Add more CRUD methods for the storage interface
export interface IStorage {
  // User methods (simplified)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Property methods
  getProperties(): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  getPropertiesByType(type: string): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<Property>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  
  // Neighborhood methods
  getNeighborhoods(): Promise<Neighborhood[]>;
  getNeighborhood(id: number): Promise<Neighborhood | undefined>;
  createNeighborhood(neighborhood: InsertNeighborhood): Promise<Neighborhood>;
  
  // Message methods
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(): Promise<Message[]>;
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
      features: ["Hardwood floors", "Granite countertops", "Stainless steel appliances", "Attached garage", "Central AC", "Fenced yard"],
      images: [
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
      ],
      lat: 27.523389,
      lng: -99.487146
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
      features: ["High visibility location", "Corner lot", "Renovated interior", "Ample parking", "Separate storage space", "Security system"],
      images: [
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
      ],
      lat: 27.507068,
      lng: -99.507283
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
      features: ["Gated community", "Smart home system", "Custom cabinetry", "Quartz countertops", "Walk-in closets", "Energy-efficient appliances", "Covered patio"],
      images: [
        "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1604014438553-9e574a54ba62?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
      ],
      lat: 27.542321,
      lng: -99.480752
    }
  ];

  // Sample neighborhoods
  const sampleNeighborhoods = [
    {
      name: "North Laredo",
      description: "A growing residential area with plenty of amenities including shopping centers, parks, and top-rated schools. North Laredo offers a suburban feel while still being close to all city conveniences.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      features: ["Family-friendly", "Top schools", "Shopping centers", "Parks and recreation", "Modern developments"]
    },
    {
      name: "Downtown Laredo",
      description: "Historic downtown area with rich cultural heritage, government offices, and emerging businesses. The area is experiencing revitalization with new restaurants, shops, and entertainment venues.",
      image: "https://images.unsplash.com/photo-1581280525830-33b94edc8707?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      features: ["Historic architecture", "Cultural attractions", "Business district", "Rio Grande views", "Emerging nightlife"]
    },
    {
      name: "Del Mar",
      description: "Established neighborhood known for its beautiful homes, tree-lined streets, and excellent location. Del Mar offers a mix of older character homes and newer constructions, with easy access to schools and shopping.",
      image: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      features: ["Mature trees", "Character homes", "Strong community", "Convenient location", "Well-maintained properties"]
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
