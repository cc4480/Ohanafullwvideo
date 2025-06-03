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

// Memory storage interface
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
  getPropertiesCount(filters?: any): Promise<number>;
  searchProperties(filters: any): Promise<Property[]>;
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
  searchAirbnbRentals(filters: any): Promise<AirbnbRental[]>;
  createAirbnbRental(rental: InsertAirbnbRental): Promise<AirbnbRental>;
  updateAirbnbRental(id: number, rental: Partial<AirbnbRental>): Promise<AirbnbRental | undefined>;
  deleteAirbnbRental(id: number): Promise<boolean>;
}

// Memory-based storage implementation
class MemoryStorage {
  private properties: Property[] = [];
  private neighborhoods: Neighborhood[] = [];
  private users: User[] = [];
  private messages: Message[] = [];
  private isInitialized = false;
  private _propertiesCache: Map<number, Property> = new Map();
  private _searchCache: Map<string, Property[]> = new Map();
  private airbnbRentals: AirbnbRental[] = []; // Initialize airbnbRentals here
  private favorites: Favorite[] = [];
  private nextId: number = 1;

  constructor() {
    // Initialize data immediately for instant access
    this.initializeDataSync();
  }

  private initializeDataSync() {
    // Initialize neighborhoods first
    this.neighborhoods = [
      {
        id: 1,
        name: 'Del Mar',
        description: 'A prestigious waterfront neighborhood offering luxury living with beautiful views and upscale amenities.',
        city: 'Laredo',
        state: 'TX',
        zipCode: '78045',
        image: '/assets/del-mar.png',
        lat: '27.5806',
        lng: '-99.4739',
        amenities: ['waterfront access', 'golf course', 'marina', 'upscale shopping'],
        createdAt: new Date(),
        updatedAt: new Date(),
        seoMetaTitle: 'Del Mar Neighborhood - Luxury Homes in Laredo, TX',
        seoMetaDescription: 'Discover luxury living in Del Mar, Laredo\'s premier waterfront neighborhood',
        seoKeywords: 'Del Mar Laredo, luxury homes, waterfront properties',
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
        id: 2,
        name: 'North Laredo',
        description: 'Family-friendly area with excellent schools, parks, and convenient shopping.',
        city: 'Laredo',
        state: 'TX',
        zipCode: '78045',
        image: '/assets/north-laredo-industrial-park.png',
        lat: '27.5742',
        lng: '-99.4685',
        amenities: ['parks', 'schools', 'shopping centers', 'medical facilities'],
        createdAt: new Date(),
        updatedAt: new Date(),
        seoMetaTitle: 'North Laredo - Family Homes & Great Schools',
        seoMetaDescription: 'Find your family home in North Laredo with excellent schools and amenities',
        seoKeywords: 'North Laredo, family homes, schools',
        history: 'North Laredo has experienced significant growth since 2000.',
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
        id: 3,
        name: 'Downtown Historic District',
        description: 'Rich in history and culture, the heart of Laredo with historic architecture.',
        city: 'Laredo',
        state: 'TX',
        zipCode: '78040',
        image: '/assets/downtown-laredo.png',
        lat: '27.5036',
        lng: '-99.5075',
        amenities: ['historic sites', 'cultural venues', 'restaurants', 'government buildings'],
        createdAt: new Date(),
        updatedAt: new Date(),
        seoMetaTitle: 'Downtown Laredo Historic District - Cultural Heart',
        seoMetaDescription: 'Experience historic Laredo in the downtown district with rich culture',
        seoKeywords: 'Downtown Laredo, historic homes, cultural district',
        history: 'Founded in 1755, Downtown Laredo is the historic heart of the city.',
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
      }
    ];

    // Initialize properties with data from attached assets
    this.properties = [
      {
        id: 1,
        type: 'house',
        address: '11118 Don Tomas Loop',
        city: 'Laredo',
        state: 'TX',
        zipCode: '78045',
        price: 135000,
        bedrooms: 3,
        bathrooms: '2.0',
        squareFeet: 1200,
        description: 'Charming 3-bedroom, 2-bathroom home in a desirable Laredo neighborhood. This well-maintained property features a spacious living area, modern kitchen, and a large backyard perfect for entertaining.',
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
        lng: '-99.4739',
        createdAt: new Date(),
        updatedAt: new Date(),
        seoMetaTitle: '3BR House for Sale - 11118 Don Tomas Loop, Laredo TX',
        seoMetaDescription: 'Beautiful 3-bedroom home with modern kitchen and large backyard in Del Mar neighborhood',
        seoKeywords: 'Laredo house for sale, Don Tomas Loop, 3 bedroom home'
      },

      {
        id: 2,
        type: 'house',
        address: '1314 Iturbide St',
        city: 'Laredo',
        state: 'TX',
        zipCode: '78040',
        price: 165000,
        bedrooms: 3,
        bathrooms: '2.0',
        squareFeet: 1350,
        description: 'Beautiful 3-bedroom, 2-bathroom home in the heart of Laredo. This property offers a perfect blend of comfort and convenience.',
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
        lng: '-99.5075',
        createdAt: new Date(),
        updatedAt: new Date(),
        seoMetaTitle: '3BR House for Sale - 1314 Iturbide St, Laredo TX',
        seoMetaDescription: 'Charming 3-bedroom home with hardwood floors in historic downtown Laredo',
        seoKeywords: 'Laredo house for sale, Iturbide Street, downtown Laredo'
      },
      {
        id: 3,
        type: 'house',
        address: '1318 Iturbide St',
        city: 'Laredo',
        state: 'TX',
        zipCode: '78040',
        price: 175000,
        bedrooms: 4,
        bathrooms: '2.5',
        squareFeet: 1600,
        description: 'Spacious 4-bedroom, 2.5-bathroom family home with modern amenities. Perfect for growing families.',
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
        lng: '-99.5073',
        createdAt: new Date(),
        updatedAt: new Date(),
        seoMetaTitle: '4BR House for Sale - 1318 Iturbide St, Laredo TX',
        seoMetaDescription: 'Spacious 4-bedroom family home with open floor plan in downtown Laredo',
        seoKeywords: 'Laredo house for sale, 4 bedroom home, family house'
      },
      {
        id: 4,
        type: 'house',
        address: '3720 Flores Ave',
        city: 'Laredo',
        state: 'TX',
        zipCode: '78041',
        price: 195000,
        bedrooms: 3,
        bathrooms: '2.0',
        squareFeet: 1300,
        description: 'Charming 3-bedroom, 2-bathroom home on Flores Avenue. Move-in ready with updated features.',
        features: ['move-in ready', 'updated fixtures', 'corner lot', 'mature landscaping', 'covered parking'],
        images: [
          '/images/properties/3720-flores-ave/img1.webp',
          '/images/properties/3720-flores-ave/img2.webp',
          '/images/properties/3720-flores-ave/img3.webp',
          '/images/properties/3720-flores-ave/img4.webp'
        ],
        status: 'active',
        featured: true,
        neighborhoodId: 2,
        yearBuilt: 2014,
        parkingSpaces: 2,
        lat: '27.5200',
        lng: '-99.4900',
        createdAt: new Date(),
        updatedAt: new Date(),
        seoMetaTitle: '3BR House for Sale - 3720 Flores Ave, Laredo TX',
        seoMetaDescription: 'Move-in ready 3-bedroom home with updated fixtures on corner lot',
        seoKeywords: 'Laredo house for sale, Flores Avenue, move-in ready'
      }
    ];

    // Mock data for Airbnb rentals
    this.airbnbRentals = [
      {
        id: 1,
        title: "505 Shiloh Dr Unit 6 - Modern Laredo Getaway",
        description: "Experience comfort and convenience at this beautifully appointed unit in Laredo's desirable Shiloh Drive complex. Perfect for business travelers, families, or anyone seeking a peaceful stay with modern amenities. This bright and spacious unit features contemporary furnishings, a fully equipped kitchen, and all the comforts of home.",
        address: "505 Shiloh Dr Unit 6",
        city: "Laredo",
        state: "Texas",
        zipCode: "78045",
        price: 85,
        beds: 2,
        bathrooms: 1,
        guests: 4,
        images: [
          "/assets/shiloh-dr/shiloh-exterior-full.jpg",
          "/assets/shiloh-dr/505-shiloh-dr-unit-6-laredo-tx-primary-photo(1).jpg",
          "/assets/shiloh-dr/505-shiloh-dr-unit-6-laredo-tx-building-photo.jpg",
          "/assets/shiloh-dr/505-shiloh-dr-unit-6-laredo-tx-building-photo(1).jpg",
          "/assets/shiloh-dr/505-shiloh-dr-unit-6-laredo-tx-building-photo(2).jpg",
          "/assets/shiloh-dr/505-shiloh-dr-unit-6-laredo-tx-building-photo(3).jpg"
        ],
        amenities: [
          "High-Speed WiFi", 
          "Fully Equipped Kitchen", 
          "Central Air Conditioning", 
          "Free Parking", 
          "Smart TV with Streaming", 
          "Washer & Dryer",
          "Professional Cleaning",
          "24/7 Support",
          "Keyless Entry",
          "Business-Friendly Workspace"
        ],
        featured: true,
        airbnbUrl: "https://www.airbnb.com/rooms/shiloh-dr-unit-6",
        neighborhood_id: 1,
        lat: 27.5432,
        lng: -99.4654,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        title: "Luxurious Downtown Loft",
        description: "A stunning modern loft in the heart of downtown Laredo with premium amenities and spectacular city views.",
        address: "123 San Bernardo Ave",
        city: "Laredo",
        state: "Texas",
        zipCode: "78040",
        price: 150,
        beds: 2,
        bathrooms: 2,
        guests: 4,
        images: [
          "/shiloh-main.jpg",
          "/shiloh-building1.jpg",
          "/shiloh-building2.jpg"
        ],
        amenities: ["WiFi", "Kitchen", "Air Conditioning", "Parking", "TV"],
        featured: false,
        airbnbUrl: "https://www.airbnb.com/rooms/123456789",
        neighborhood_id: 1,
        lat: 27.5064,
        lng: -99.5075,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.nextId = Math.max(
      ...this.properties.map(p => p.id), 
      ...this.neighborhoods.map(n => n.id),
      ...this.airbnbRentals.map(r => r.id)
      ) + 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.nextId++,
      ...insertUser,
      createdAt: new Date(),
      lastLogin: null
    };
    this.users.push(user);
    return user;
  }

  async updateUserLastLogin(id: number): Promise<User | undefined> {
    const user = this.users.find(u => u.id === id);
    if (user) {
      user.lastLogin = new Date();
    }
    return user;
  }

  async getProperties(): Promise<Property[]> {
    if (!this.isInitialized) {
      this.initializeDataSync(); // Sync initialization for instant response
    }
    console.log(`Memory storage: Returning ${this.properties.length} properties (cached)`);
    return this.properties;
  }

  // Add instant property lookup by ID
  async getPropertyById(id: number): Promise<Property | null> {
    if (this._propertiesCache.has(id)) {
      return this._propertiesCache.get(id) || null;
    }

    const property = this.properties.find(p => p.id === id);
    if (property) {
      this._propertiesCache.set(id, property);
    }
    return property || null;
  }

  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.find(p => p.id === id);
  }

  async getPropertiesByType(type: string): Promise<Property[]> {
    return this.properties.filter(p => p.type === type);
  }

  async getFeaturedProperties(limit?: number): Promise<Property[]> {
    const featured = this.properties.filter(p => p.featured);
    return limit ? featured.slice(0, limit) : featured;
  }

  async getPropertiesCount(filters?: any): Promise<number> {
    if (!filters) return this.properties.length;

    let filtered = this.properties;

    if (filters.type) {
      filtered = filtered.filter(p => p.type === filters.type);
    }
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= filters.minPrice);
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice);
    }
    if (filters.minBeds) {
      filtered = filtered.filter(p => p.bedrooms >= filters.minBeds);
    }
    if (filters.minBaths) {
      filtered = filtered.filter(p => Number(p.bathrooms) >= filters.minBaths);
    }
    if (filters.city) {
      filtered = filtered.filter(p => p.city.toLowerCase().includes(filters.city.toLowerCase()));
    }
    if (filters.zipCode) {
      filtered = filtered.filter(p => p.zipCode === filters.zipCode);
    }
    if (filters.neighborhood) {
      filtered = filtered.filter(p => p.neighborhoodId === filters.neighborhood);
    }

    return filtered.length;
  }

  async searchProperties(filters: any): Promise<Property[]> {
    let filtered = [...this.properties];

    if (filters.type) {
      filtered = filtered.filter(p => p.type === filters.type);
    }
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= filters.minPrice);
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice);
    }
    if (filters.minBeds) {
      filtered = filtered.filter(p => p.bedrooms >= filters.minBeds);
    }
    if (filters.minBaths) {
      filtered = filtered.filter(p => Number(p.bathrooms) >= filters.minBaths);
    }
    if (filters.city) {
      filtered = filtered.filter(p => p.city.toLowerCase().includes(filters.city.toLowerCase()));
    }
    if (filters.zipCode) {
      filtered = filtered.filter(p => p.zipCode === filters.zipCode);
    }
    if (filters.neighborhood) {
      filtered = filtered.filter(p => p.neighborhoodId === filters.neighborhood);
    }

    // Apply sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        const aVal = a[filters.sortBy as keyof Property] as number;
        const bVal = b[filters.sortBy as keyof Property] as number;
        return filters.order === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }

    // Apply pagination
    if (filters.limit) {
      const start = filters.offset || 0;
      filtered = filtered.slice(start, start + filters.limit);
    }

    return filtered;
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const property: Property = {
      id: this.nextId++,
      ...insertProperty,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.properties.push(property);
    return property;
  }

  async updateProperty(id: number, propertyData: Partial<Property>): Promise<Property | undefined> {
    const index = this.properties.findIndex(p => p.id === id);
    if (index !== -1) {
      this.properties[index] = { ...this.properties[index], ...propertyData, updatedAt: new Date() };
      return this.properties[index];
    }
    return undefined;
  }

  async deleteProperty(id: number): Promise<boolean> {
    const index = this.properties.findIndex(p => p.id === id);
    if (index !== -1) {
      this.properties.splice(index, 1);
      return true;
    }
    return false;
  }

  async getNeighborhoods(): Promise<Neighborhood[]> {
    return [...this.neighborhoods];
  }

  async getNeighborhood(id: number): Promise<Neighborhood | undefined> {
    return this.neighborhoods.find(n => n.id === id);
  }

  async getPropertiesByNeighborhood(neighborhoodId: number): Promise<Property[]> {
    return this.properties.filter(p => p.neighborhoodId === neighborhoodId);
  }

  async createNeighborhood(insertNeighborhood: InsertNeighborhood): Promise<Neighborhood> {
    const neighborhood: Neighborhood = {
      id: this.nextId++,
      ...insertNeighborhood,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.neighborhoods.push(neighborhood);
    return neighborhood;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const message: Message = {
      id: this.nextId++,
      ...insertMessage,
      createdAt: new Date(),
      read: false
    };
    this.messages.push(message);
    return message;
  }

  async getMessages(): Promise<Message[]> {
    return [...this.messages].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async addFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const existing = this.favorites.find(f => 
      f.userId === insertFavorite.userId && f.propertyId === insertFavorite.propertyId
    );
    if (existing) return existing;

    const favorite: Favorite = {
      id: this.nextId++,
      ...insertFavorite,
      createdAt: new Date()
    };
    this.favorites.push(favorite);
    return favorite;
  }

  async removeFavorite(userId: number, propertyId: number): Promise<boolean> {
    const index = this.favorites.findIndex(f => f.userId === userId && f.propertyId === propertyId);
    if (index !== -1) {
      this.favorites.splice(index, 1);
      return true;
    }
    return false;
  }

  async getUserFavorites(userId: number): Promise<Property[]> {
    if (!this.users || this.users.length === 0) {
      return [];
    }

    const favoriteIds = this.users
      .filter((user) => user.id === userId)
      .flatMap((user) => user.favoriteProperties || []);

    return this.properties.filter((property) => favoriteIds.includes(property.id));
  }

  async isFavorite(userId: number, propertyId: number): Promise<boolean> {
    return this.favorites.some(f => f.userId === userId && f.propertyId === propertyId);
  }

  // Airbnb methods (simplified for now)
  async getAirbnbRentals(): Promise<AirbnbRental[]> {
    return [...this.airbnbRentals];
  }

  async getAirbnbRental(id: number): Promise<AirbnbRental | undefined> {
    return this.airbnbRentals.find(r => r.id === id);
  }

  async getFeaturedAirbnbRentals(limit?: number): Promise<AirbnbRental[]> {
    const featured = this.airbnbRentals.filter(r => r.featured);
    return limit ? featured.slice(0, limit) : featured;
  }

  async searchAirbnbRentals(filters: any): Promise<AirbnbRental[]> {
    return [...this.airbnbRentals];
  }

  async createAirbnbRental(insertRental: InsertAirbnbRental): Promise<AirbnbRental> {
    const rental: AirbnbRental = {
      id: this.nextId++,
      ...insertRental,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.airbnbRentals.push(rental);
    return rental;
  }

  async updateAirbnbRental(id: number, rentalData: Partial<AirbnbRental>): Promise<AirbnbRental | undefined> {
    const index = this.airbnbRentals.findIndex(r => r.id === id);
    if (index !== -1) {
      this.airbnbRentals[index] = { ...this.airbnbRentals[index], ...rentalData, updatedAt: new Date() };
      return this.airbnbRentals[index];
    }
    return undefined;
  }

  async deleteAirbnbRental(id: number): Promise<boolean> {
    const index = this.airbnbRentals.findIndex(r => r.id === id);
    if (index !== -1) {
      this.airbnbRentals.splice(index, 1);
      return true;
    }
    return false;
  }
}

// Initialize sample data function
export async function initializeSampleData() {
  console.log("Using memory storage - data already initialized");
  return;
}

// Use memory storage
export const storage = new MemoryStorage();