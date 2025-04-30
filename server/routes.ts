import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage, initializeSampleData } from "./storage";
import { insertMessageSchema } from "@shared/schema";
import { z } from "zod";
import { db } from "./db";
import { sql } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize database with sample data
  try {
    console.log("Initializing database with sample data...");
    await initializeSampleData();
    console.log("Database initialization complete.");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
  const apiRouter = express.Router();

  // Get all properties
  apiRouter.get("/properties", async (req, res) => {
    try {
      const properties = await storage.getProperties();
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  // Get featured properties (top properties using database sorting)
  apiRouter.get("/properties/featured", async (req, res) => {
    try {
      // Get the limit parameter if provided, default to 4 if not
      let limit = 4;
      if (req.query.limit) {
        limit = parseInt(String(req.query.limit));
        // Check if the parsed limit is a valid number
        if (isNaN(limit) || limit <= 0) {
          limit = 4; // Default to 4 if limit is invalid
        }
      }
      
      console.log(`Route handler requesting featured properties with limit: ${limit}`);
      
      // Use database-optimized method for fetching featured properties
      const featuredProperties = await storage.getFeaturedProperties(limit);
      
      res.json(featuredProperties);
    } catch (error) {
      console.error("Featured properties error:", error);
      res.status(500).json({ message: "Failed to fetch featured properties" });
    }
  });
  
  // Search properties with filters
  apiRouter.get("/properties/search", async (req, res) => {
    try {
      const { 
        type, 
        minPrice, 
        maxPrice, 
        minBeds, 
        minBaths, 
        city, 
        zipCode, 
        neighborhood,
        sortBy,
        order,
        limit,
        offset
      } = req.query;
      
      // Prepare filter object with correct types
      const filters: {
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
      } = {};
      
      // Add only defined filters with proper type conversion
      if (type) filters.type = String(type);
      
      if (minPrice) {
        const price = Number(minPrice);
        if (!isNaN(price) && price >= 0) {
          filters.minPrice = price;
        }
      }
      
      if (maxPrice) {
        const price = Number(maxPrice);
        if (!isNaN(price) && price >= 0) {
          filters.maxPrice = price;
        }
      }
      
      if (minBeds) {
        const beds = Number(minBeds);
        if (!isNaN(beds) && beds >= 0) {
          filters.minBeds = beds;
        }
      }
      
      if (minBaths) {
        const baths = Number(minBaths);
        if (!isNaN(baths) && baths >= 0) {
          filters.minBaths = baths;
        }
      }
      
      if (city) filters.city = String(city);
      if (zipCode) filters.zipCode = String(zipCode);
      
      if (neighborhood) {
        const neighborhoodId = Number(neighborhood);
        if (!isNaN(neighborhoodId) && neighborhoodId > 0) {
          filters.neighborhood = neighborhoodId;
        }
      }
      
      // Add sorting parameters
      if (sortBy) {
        const validSortFields = ['price', 'bedrooms', 'bathrooms', 'squareFeet'];
        const field = String(sortBy);
        if (validSortFields.includes(field)) {
          filters.sortBy = field;
        }
      }
      
      if (order) {
        const direction = String(order).toLowerCase();
        if (direction === 'asc' || direction === 'desc') {
          filters.order = direction;
        }
      }
      
      // Add pagination parameters
      if (limit) {
        const limitVal = Number(limit);
        if (!isNaN(limitVal) && limitVal > 0 && limitVal <= 100) {
          filters.limit = limitVal;
        }
      }
      
      if (offset) {
        const offsetVal = Number(offset);
        if (!isNaN(offsetVal) && offsetVal >= 0) {
          filters.offset = offsetVal;
        }
      }
      
      // Log the search filters for debugging
      console.log("Searching properties with filters:", JSON.stringify(filters, null, 2));
      
      // Calculate total count for pagination
      const totalCount = await storage.getPropertiesCount(filters);
      
      // Use the database-optimized search method
      const properties = await storage.searchProperties(filters);
      
      // Return structured response with metadata
      res.json({
        properties,
        meta: {
          total: totalCount,
          limit: filters.limit || properties.length,
          offset: filters.offset || 0,
          hasMore: totalCount > (filters.offset || 0) + (filters.limit || properties.length)
        }
      });
    } catch (error) {
      console.error("Property search error:", error);
      res.status(500).json({ message: "Failed to search properties" });
    }
  });
  
  // Get properties by type (moved to non-conflicting route)
  apiRouter.get("/propertiesByType/:type", async (req, res) => {
    try {
      const type = req.params.type;
      const properties = await storage.getPropertiesByType(type);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch properties by type" });
    }
  });
  
  // Get property by ID (needs to be AFTER the specific routes to avoid conflicts)
  apiRouter.get("/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      res.json(property);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });


  // Get all neighborhoods
  apiRouter.get("/neighborhoods", async (req, res) => {
    try {
      const neighborhoods = await storage.getNeighborhoods();
      res.json(neighborhoods);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch neighborhoods" });
    }
  });
  
  // Get a single neighborhood by ID
  apiRouter.get("/neighborhoods/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid neighborhood ID" });
      }
      
      const neighborhood = await storage.getNeighborhood(id);
      if (!neighborhood) {
        return res.status(404).json({ message: "Neighborhood not found" });
      }
      
      res.json(neighborhood);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch neighborhood details" });
    }
  });
  
  // Get properties by neighborhood ID
  apiRouter.get("/neighborhoods/:id/properties", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid neighborhood ID" });
      }
      
      // First check if the neighborhood exists
      const neighborhood = await storage.getNeighborhood(id);
      if (!neighborhood) {
        return res.status(404).json({ message: "Neighborhood not found" });
      }
      
      // Then get all properties in that neighborhood
      const properties = await storage.getPropertiesByNeighborhood(id);
      
      res.json(properties);
    } catch (error) {
      console.error("Error fetching properties by neighborhood:", error);
      res.status(500).json({ message: "Failed to fetch properties for this neighborhood" });
    }
  });

  // Submit contact form
  apiRouter.post("/contact", async (req, res) => {
    try {
      const result = insertMessageSchema.safeParse({
        ...req.body,
        createdAt: new Date().toISOString()
      });

      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid form data", 
          errors: result.error.errors 
        });
      }

      const message = await storage.createMessage(result.data);
      res.status(201).json({ message: "Message sent successfully", id: message.id });
    } catch (error) {
      res.status(500).json({ message: "Failed to send message" });
    }
  });
  
  // Schedule a property viewing
  apiRouter.post("/schedule-viewing", async (req, res) => {
    try {
      const viewingSchema = z.object({
        propertyId: z.number(),
        name: z.string().min(2),
        email: z.string().email(),
        phone: z.string().min(10),
        date: z.string(),
        time: z.string(),
        notes: z.string().optional()
      });
      
      const result = viewingSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid viewing request data", 
          errors: result.error.errors 
        });
      }
      
      const { propertyId, name, email, phone, date, time, notes } = result.data;
      
      // Get property details
      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Create a message with the viewing request details
      const message = await storage.createMessage({
        name,
        email,
        phone,
        interest: "Property Viewing",
        message: `Viewing request for ${property.address} on ${date} at ${time}. ${notes ? 'Notes: ' + notes : ''}`,
        createdAt: new Date().toISOString()
      });
      
      res.status(201).json({ 
        message: "Viewing scheduled successfully", 
        details: {
          property: property.address,
          date,
          time,
          id: message.id
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to schedule viewing" });
    }
  });
  
  // Property inquiry
  apiRouter.post("/property-inquiry", async (req, res) => {
    try {
      const inquirySchema = z.object({
        propertyId: z.number(),
        name: z.string().min(2),
        email: z.string().email(),
        phone: z.string().min(10),
        questions: z.string().min(5)
      });
      
      const result = inquirySchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid inquiry data", 
          errors: result.error.errors 
        });
      }
      
      const { propertyId, name, email, phone, questions } = result.data;
      
      // Get property details
      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Create a message with the inquiry details
      const message = await storage.createMessage({
        name,
        email,
        phone,
        interest: "Property Inquiry",
        message: `Inquiry about ${property.address}: ${questions}`,
        createdAt: new Date().toISOString()
      });
      
      res.status(201).json({ 
        message: "Inquiry submitted successfully", 
        id: message.id 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to submit inquiry" });
    }
  });

  // No AI chat features as requested

  // User favorites endpoints
  apiRouter.post("/favorites", async (req, res) => {
    try {
      const { userId, propertyId } = req.body;
      
      if (!userId || !propertyId) {
        return res.status(400).json({ 
          message: "User ID and Property ID are required" 
        });
      }
      
      // Validate that the user and property exist
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Add the favorite
      const favorite = await storage.addFavorite({ userId, propertyId });
      
      res.status(201).json({
        message: "Property added to favorites",
        favorite
      });
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(500).json({ message: "Failed to add property to favorites" });
    }
  });
  
  // Remove a property from favorites
  apiRouter.delete("/favorites/:userId/:propertyId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const propertyId = parseInt(req.params.propertyId);
      
      if (isNaN(userId) || isNaN(propertyId)) {
        return res.status(400).json({ 
          message: "Invalid user ID or property ID" 
        });
      }
      
      // Remove the favorite
      const success = await storage.removeFavorite(userId, propertyId);
      
      if (success) {
        res.json({ message: "Property removed from favorites" });
      } else {
        res.status(404).json({ message: "Favorite not found" });
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ message: "Failed to remove property from favorites" });
    }
  });
  
  // Get a user's favorite properties
  apiRouter.get("/favorites/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Check if user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get the user's favorites
      const favorites = await storage.getUserFavorites(userId);
      
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching user favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });
  
  // Check if a property is in user's favorites
  apiRouter.get("/favorites/:userId/:propertyId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const propertyId = parseInt(req.params.propertyId);
      
      if (isNaN(userId) || isNaN(propertyId)) {
        return res.status(400).json({ 
          message: "Invalid user ID or property ID" 
        });
      }
      
      // Check favorite status
      const isFavorite = await storage.isFavorite(userId, propertyId);
      
      res.json({ isFavorite });
    } catch (error) {
      console.error("Error checking favorite status:", error);
      res.status(500).json({ message: "Failed to check favorite status" });
    }
  });

  // Airbnb rentals endpoints
  // Get all Airbnb rentals
  apiRouter.get("/airbnb", async (req, res) => {
    try {
      const rentals = await storage.getAirbnbRentals();
      res.json(rentals);
    } catch (error) {
      console.error("Error fetching Airbnb rentals:", error);
      res.status(500).json({ message: "Failed to fetch Airbnb rentals" });
    }
  });

  // Get featured Airbnb rentals
  apiRouter.get("/airbnb/featured", async (req, res) => {
    try {
      // Get the limit parameter if provided
      let limit = 4;
      if (req.query.limit) {
        limit = parseInt(String(req.query.limit));
        // Check if the parsed limit is a valid number
        if (isNaN(limit) || limit <= 0) {
          limit = 4; // Default to 4 if limit is invalid
        }
      }
      
      // Use database-optimized method for fetching featured Airbnb rentals
      const featuredRentals = await storage.getFeaturedAirbnbRentals(limit);
      
      res.json(featuredRentals);
    } catch (error) {
      console.error("Featured Airbnb rentals error:", error);
      res.status(500).json({ message: "Failed to fetch featured Airbnb rentals" });
    }
  });

  // Search Airbnb rentals with filters
  apiRouter.get("/airbnb/search", async (req, res) => {
    try {
      const { 
        minPrice, 
        maxPrice, 
        minBeds, 
        minBaths,
        guests,
        city, 
        neighborhood,
        sortBy,
        order,
        limit,
        offset
      } = req.query;
      
      // Prepare filter object with correct types
      const filters: {
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
      } = {};
      
      // Add only defined filters with proper type conversion
      if (minPrice) {
        const price = Number(minPrice);
        if (!isNaN(price) && price >= 0) {
          filters.minPrice = price;
        }
      }
      
      if (maxPrice) {
        const price = Number(maxPrice);
        if (!isNaN(price) && price >= 0) {
          filters.maxPrice = price;
        }
      }
      
      if (minBeds) {
        const beds = Number(minBeds);
        if (!isNaN(beds) && beds >= 0) {
          filters.minBeds = beds;
        }
      }
      
      if (minBaths) {
        const baths = Number(minBaths);
        if (!isNaN(baths) && baths >= 0) {
          filters.minBaths = baths;
        }
      }
      
      if (guests) {
        const guestCount = Number(guests);
        if (!isNaN(guestCount) && guestCount >= 0) {
          filters.guests = guestCount;
        }
      }
      
      if (city) filters.city = String(city);
      
      if (neighborhood) {
        const neighborhoodId = Number(neighborhood);
        if (!isNaN(neighborhoodId) && neighborhoodId > 0) {
          filters.neighborhood = neighborhoodId;
        }
      }
      
      // Add sorting parameters
      if (sortBy) {
        const validSortFields = ['price', 'bedrooms', 'bathrooms', 'guests', 'rating'];
        const field = String(sortBy);
        if (validSortFields.includes(field)) {
          filters.sortBy = field;
        }
      }
      
      if (order) {
        const direction = String(order).toLowerCase();
        if (direction === 'asc' || direction === 'desc') {
          filters.order = direction;
        }
      }
      
      // Add pagination parameters
      if (limit) {
        const limitVal = Number(limit);
        if (!isNaN(limitVal) && limitVal > 0 && limitVal <= 100) {
          filters.limit = limitVal;
        }
      }
      
      if (offset) {
        const offsetVal = Number(offset);
        if (!isNaN(offsetVal) && offsetVal >= 0) {
          filters.offset = offsetVal;
        }
      }
      
      // Log the search filters for debugging
      console.log("Searching Airbnb rentals with filters:", JSON.stringify(filters, null, 2));
      
      // Use the database-optimized search method
      const rentals = await storage.searchAirbnbRentals(filters);
      
      // Return structured response with metadata
      res.json({
        rentals,
        meta: {
          total: rentals.length,
          limit: filters.limit || rentals.length,
          offset: filters.offset || 0,
          hasMore: false // We don't have pagination count for Airbnb rentals yet
        }
      });
    } catch (error) {
      console.error("Airbnb rental search error:", error);
      res.status(500).json({ message: "Failed to search Airbnb rentals" });
    }
  });

  // Get Airbnb rental by ID
  apiRouter.get("/airbnb/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid Airbnb rental ID" });
      }

      const rental = await storage.getAirbnbRental(id);
      if (!rental) {
        return res.status(404).json({ message: "Airbnb rental not found" });
      }

      res.json(rental);
    } catch (error) {
      console.error("Error fetching Airbnb rental:", error);
      res.status(500).json({ message: "Failed to fetch Airbnb rental" });
    }
  });

  // Health check endpoint for deployment monitoring
  apiRouter.get("/health", async (req, res) => {
    try {
      // Check database connection
      await db.execute(sql`SELECT 1`);
      
      // Return health status with basic system information
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        server: {
          node: process.version,
          memory: process.memoryUsage(),
        }
      });
    } catch (error) {
      console.error('Health check failed:', error);
      res.status(500).json({ 
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: process.env.NODE_ENV === 'production' ? 'Service unavailable' : String(error)
      });
    }
  });

  // Register the API router
  app.use("/api", apiRouter);
  
  // SEO Routes - Sitemap and Robots.txt
  
  // XML Sitemap
  app.get('/sitemap.xml', async (req, res) => {
    try {
      // Get all properties and neighborhoods from the database
      const properties = await storage.getProperties();
      const neighborhoods = await storage.getNeighborhoods();
      
      // Base URL for the sitemap
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://ohanarealty.com'
        : `http://${req.headers.host}`;
      
      // Generate sitemap XML content
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
      
      // Add main pages
      const mainPages = [
        { url: '', changefreq: 'weekly', priority: 1.0 },
        { url: 'properties', changefreq: 'daily', priority: 0.9 },
        { url: 'neighborhoods', changefreq: 'weekly', priority: 0.8 },
        { url: 'about', changefreq: 'monthly', priority: 0.7 },
        { url: 'contact', changefreq: 'monthly', priority: 0.7 }
      ];
      
      // Add main pages to sitemap
      for (const page of mainPages) {
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/${page.url}</loc>\n`;
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority.toFixed(1)}</priority>\n`;
        xml += '  </url>\n';
      }
      
      // Add property pages
      for (const property of properties) {
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/properties/${property.id}</loc>\n`;
        // Use current date for lastmod
        const today = new Date().toISOString().split('T')[0];
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.8</priority>\n';
        xml += '  </url>\n';
      }
      
      // Add neighborhood pages
      for (const neighborhood of neighborhoods) {
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/neighborhoods/${neighborhood.id}</loc>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.7</priority>\n';
        xml += '  </url>\n';
      }
      
      // Filter pages for various property types
      // Create a collection of unique property types
      const typeSet = new Set<string>();
      properties.forEach(p => p.type && typeSet.add(p.type));
      const propertyTypes = Array.from(typeSet);
      
      for (const type of propertyTypes) {
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/properties?type=${type.toLowerCase()}</loc>\n`;
        xml += '    <changefreq>daily</changefreq>\n';
        xml += '    <priority>0.7</priority>\n';
        xml += '  </url>\n';
      }
      
      // City-based filter pages
      // Create a collection of unique cities
      const citySet = new Set<string>();
      properties.forEach(p => p.city && citySet.add(p.city));
      const cities = Array.from(citySet);
      
      for (const city of cities) {
        if (city) {
          xml += '  <url>\n';
          xml += `    <loc>${baseUrl}/properties?city=${encodeURIComponent(city)}</loc>\n`;
          xml += '    <changefreq>weekly</changefreq>\n';
          xml += '    <priority>0.6</priority>\n';
          xml += '  </url>\n';
        }
      }
      
      xml += '</urlset>';
      
      // Set headers and send response
      res.header('Content-Type', 'application/xml');
      res.header('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
      res.send(xml);
    } catch (error) {
      console.error('Error generating sitemap:', error);
      res.status(500).send('Error generating sitemap');
    }
  });
  
  // HTML Sitemap
  app.get('/sitemap.html', async (req, res) => {
    try {
      // Get all properties and neighborhoods from the database
      const properties = await storage.getProperties();
      const neighborhoods = await storage.getNeighborhoods();
      
      // Base URL for the website
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://ohanarealty.com'
        : `http://${req.headers.host}`;
      
      // Generate HTML sitemap
      let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Site Map - Ohana Realty</title>
  <meta name="robots" content="index, follow">
  <style>
    body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; color: #333; }
    h1 { color: #0A2342; }
    h2 { color: #1D3557; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-top: 30px; }
    h3 { color: #457B9D; margin-top: 20px; }
    ul { list-style-type: none; padding-left: 20px; }
    li { margin: 8px 0; }
    a { text-decoration: none; color: #2A6496; }
    a:hover { text-decoration: underline; }
    .category { display: flex; flex-wrap: wrap; }
    .category-column { flex: 1; min-width: 250px; margin-right: 20px; }
    header { display: flex; align-items: center; margin-bottom: 30px; }
    .logo { max-width: 200px; margin-right: 20px; }
    .back-link { margin-top: 40px; display: inline-block; padding: 10px 20px; background-color: #0A2342; color: white; border-radius: 4px; }
    footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
    @media (max-width: 768px) {
      .category { flex-direction: column; }
    }
  </style>
</head>
<body>
  <header>
    <h1>Ohana Realty Sitemap</h1>
  </header>
  
  <p>Welcome to our complete site map. Find quick links to all pages on the Ohana Realty website below.</p>
  
  <h2>Main Pages</h2>
  <ul>
    <li><a href="${baseUrl}/">Home</a></li>
    <li><a href="${baseUrl}/properties">Properties</a></li>
    <li><a href="${baseUrl}/neighborhoods">Neighborhoods</a></li>
    <li><a href="${baseUrl}/about">About Us</a></li>
    <li><a href="${baseUrl}/contact">Contact</a></li>
    <li><a href="${baseUrl}/favorites">Favorites</a></li>
  </ul>
  
  <h2>Property Listings</h2>
  <div class="category">
    <div class="category-column">
      <h3>Residential Properties</h3>
      <ul>
        ${properties
          .filter(p => p.type === 'RESIDENTIAL')
          .map(p => `<li><a href="${baseUrl}/properties/${p.id}">${p.address}, ${p.city}</a></li>`)
          .join('\n        ')}
      </ul>
    </div>
    
    <div class="category-column">
      <h3>Commercial Properties</h3>
      <ul>
        ${properties
          .filter(p => p.type === 'COMMERCIAL')
          .map(p => `<li><a href="${baseUrl}/properties/${p.id}">${p.address}, ${p.city}</a></li>`)
          .join('\n        ')}
      </ul>
    </div>
  </div>
  
  <h2>Neighborhoods</h2>
  <ul>
    ${neighborhoods
      .map(n => `<li><a href="${baseUrl}/neighborhoods/${n.id}">${n.name}</a></li>`)
      .join('\n    ')}
  </ul>
  
  <a href="${baseUrl}" class="back-link">Back to Home</a>
  
  <footer>
    <p>© ${new Date().getFullYear()} Ohana Realty. All rights reserved.</p>
    <p>123 Main Street, Laredo, TX 78040 | (956) 123-4567 | info@ohanarealty.com</p>
  </footer>
</body>
</html>`;
      
      // Send the HTML sitemap
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
      res.send(html);
    } catch (error) {
      console.error('Error generating HTML sitemap:', error);
      res.status(500).send('Error generating HTML sitemap');
    }
  });
  
  // Robots.txt
  app.get('/robots.txt', (req, res) => {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://ohanarealty.com'
      : `http://${req.headers.host}`;
    
    const robotsTxt = `
# Ohana Realty Robots.txt
# Website: ${baseUrl}
# Generated: ${new Date().toISOString()}

User-agent: *
Allow: /

# Disallow admin and internal pages
Disallow: /admin/
Disallow: /internal/
Disallow: /api/

# Allow search engines to process important pages
Allow: /properties
Allow: /neighborhoods
Allow: /about
Allow: /contact

# Sitemap locations
Sitemap: ${baseUrl}/sitemap.xml
# HTML Sitemap for users
# ${baseUrl}/sitemap.html

# Crawl delay to avoid overloading the server
Crawl-delay: 1
    `.trim();
    
    res.header('Content-Type', 'text/plain');
    res.header('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.send(robotsTxt);
  });

  // Direct video serving endpoint that bypasses Vite's handling
  app.get('/api/video/property', (req, res) => {
    const path = require('path');
    const fs = require('fs');
    const videoPath = path.join(process.cwd(), 'public', 'property-video.mp4');
    
    // Set the appropriate MIME type for mp4 videos
    res.setHeader('Content-Type', 'video/mp4');
    
    // Create a read stream and pipe it to the response
    const fileStream = fs.createReadStream(videoPath);
    fileStream.pipe(res);
    
    // Handle file stream errors
    fileStream.on('error', (err) => {
      console.error('Error streaming video file:', err);
      if (!res.headersSent) {
        res.status(500).send('Error streaming video file');
      }
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
