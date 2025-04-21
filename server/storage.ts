import { properties, neighborhoods, messages, chatMessages, users } from "@shared/schema";
import type { Property, InsertProperty, Neighborhood, InsertNeighborhood, Message, InsertMessage, ChatMessage, InsertChatMessage, User, InsertUser } from "@shared/schema";

// Add more CRUD methods for the storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Property methods
  getProperties(): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  getPropertiesByType(type: string): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  
  // Neighborhood methods
  getNeighborhoods(): Promise<Neighborhood[]>;
  getNeighborhood(id: number): Promise<Neighborhood | undefined>;
  createNeighborhood(neighborhood: InsertNeighborhood): Promise<Neighborhood>;
  
  // Message methods
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Chat methods
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private neighborhoods: Map<number, Neighborhood>;
  private messages: Map<number, Message>;
  private chatMessages: Map<number, ChatMessage>;
  
  private userId: number;
  private propertyId: number;
  private neighborhoodId: number;
  private messageId: number;
  private chatMessageId: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.neighborhoods = new Map();
    this.messages = new Map();
    this.chatMessages = new Map();
    
    this.userId = 1;
    this.propertyId = 1;
    this.neighborhoodId = 1;
    this.messageId = 1;
    this.chatMessageId = 1;
    
    // Initialize with sample properties
    this.initializeSampleData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Property methods
  async getProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }
  
  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }
  
  async getPropertiesByType(type: string): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.type === type
    );
  }
  
  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.propertyId++;
    const property: Property = { ...insertProperty, id };
    this.properties.set(id, property);
    return property;
  }
  
  // Neighborhood methods
  async getNeighborhoods(): Promise<Neighborhood[]> {
    return Array.from(this.neighborhoods.values());
  }
  
  async getNeighborhood(id: number): Promise<Neighborhood | undefined> {
    return this.neighborhoods.get(id);
  }
  
  async createNeighborhood(insertNeighborhood: InsertNeighborhood): Promise<Neighborhood> {
    const id = this.neighborhoodId++;
    const neighborhood: Neighborhood = { ...insertNeighborhood, id };
    this.neighborhoods.set(id, neighborhood);
    return neighborhood;
  }
  
  // Message methods
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageId++;
    const message: Message = { ...insertMessage, id };
    this.messages.set(id, message);
    return message;
  }
  
  // Chat methods
  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values()).filter(
      (message) => message.sessionId === sessionId
    );
  }
  
  async createChatMessage(insertChatMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.chatMessageId++;
    const chatMessage: ChatMessage = { ...insertChatMessage, id };
    this.chatMessages.set(id, chatMessage);
    return chatMessage;
  }
  
  // Initialize sample data
  private initializeSampleData() {
    // Sample properties
    const sampleProperties: InsertProperty[] = [
      {
        address: "3720 Flores Ave",
        city: "Laredo",
        state: "TX",
        zipCode: "78041",
        price: 200000,
        description: "Beautiful residential property in a quiet neighborhood.",
        bedrooms: 2,
        bathrooms: 1,
        squareFeet: 1514,
        type: "RESIDENTIAL",
        images: ["https://images.unsplash.com/photo-1605146769289-440113cc3d00?q=80&w=1470&auto=format&fit=crop"],
        features: ["Garage", "Backyard", "Updated Kitchen"],
        lat: 27.526600,
        lng: -99.503700,
      },
      {
        address: "1318 Iturbide St",
        city: "Laredo",
        state: "TX",
        zipCode: "78040",
        price: 220000,
        description: "Spacious commercial property in downtown Laredo.",
        squareFeet: 6615,
        type: "COMMERCIAL",
        images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1470&auto=format&fit=crop"],
        features: ["Open Floor Plan", "Display Windows", "Storage Area"],
        lat: 27.507200,
        lng: -99.503200,
      },
      {
        address: "1314 Iturbide St",
        city: "Laredo",
        state: "TX",
        zipCode: "78040",
        price: 220000,
        description: "Prime commercial property in downtown Laredo.",
        squareFeet: 8427,
        type: "COMMERCIAL",
        images: ["https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1469&auto=format&fit=crop"],
        features: ["Large Storefront", "Basement Storage", "Renovated Interior"],
        lat: 27.507100,
        lng: -99.503100,
      }
    ];
    
    // Add the properties to the map
    sampleProperties.forEach(prop => {
      const id = this.propertyId++;
      const property: Property = { ...prop, id };
      this.properties.set(id, property);
    });
    
    // Sample neighborhoods
    const sampleNeighborhoods: InsertNeighborhood[] = [
      {
        name: "North Laredo",
        description: "A growing area with newer homes and modern shopping centers, perfect for families.",
        image: "https://images.unsplash.com/photo-1534430690052-19fcd3205a60?q=80&w=1470&auto=format&fit=crop",
        features: ["Family-friendly", "Shopping", "Restaurants"],
      },
      {
        name: "Downtown Laredo",
        description: "Historic charm with a vibrant mix of culture, dining, and business opportunities.",
        image: "https://images.unsplash.com/photo-1606247357835-d27fe83fc6a3?q=80&w=1470&auto=format&fit=crop",
        features: ["Historic", "Cultural", "Business"],
      },
      {
        name: "South Laredo",
        description: "A diverse community with affordable housing options and convenient access to international bridges.",
        image: "https://images.unsplash.com/photo-1502659586859-42de64fd898a?q=80&w=1470&auto=format&fit=crop",
        features: ["Affordable", "Diverse", "Convenient"],
      }
    ];
    
    // Add the neighborhoods to the map
    sampleNeighborhoods.forEach(neighborhood => {
      const id = this.neighborhoodId++;
      const newNeighborhood: Neighborhood = { ...neighborhood, id };
      this.neighborhoods.set(id, newNeighborhood);
    });
    
    // Sample chat messages
    const sampleChatMessages: InsertChatMessage[] = [
      {
        sessionId: "demo-session",
        message: "Show me affordable properties near Shiloh Drive.",
        isUser: true,
        createdAt: new Date().toISOString(),
      },
      {
        sessionId: "demo-session",
        message: "I found 3 properties near Shiloh Drive under $250,000. The closest one is 3720 Flores Ave at $200,000, just 1.5 miles away. Would you like to see the details?",
        isUser: false,
        createdAt: new Date().toISOString(),
      }
    ];
    
    // Add the chat messages to the map
    sampleChatMessages.forEach(message => {
      const id = this.chatMessageId++;
      const chatMessage: ChatMessage = { ...message, id };
      this.chatMessages.set(id, chatMessage);
    });
  }
}

export const storage = new MemStorage();
