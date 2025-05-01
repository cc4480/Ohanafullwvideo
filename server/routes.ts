import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage, initializeSampleData } from "./storage";
import { insertMessageSchema } from "@shared/schema";
import { z } from "zod";
import { db } from "./db";
import { sql } from "drizzle-orm";
import path from "path";
import fs from "fs";
import WebSocket, { WebSocketServer } from "ws";

export async function registerRoutes(app: Express): Promise<Server> {
  // Explicitly serve videos directory to ensure video files are accessible
  app.use('/videos', express.static(path.join(process.cwd(), 'public/videos'), {
    maxAge: 31536000000, // Cache for 1 year in milliseconds
    immutable: true, // Files will never change - informs browsers they can cache forever
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }));
  
  // Serve public directory with aggressively optimized caching for static content
  app.use('/static', express.static(path.join(process.cwd(), 'public'), {
    maxAge: 31536000000, // Cache for 1 year in milliseconds
    immutable: true, // Files will never change - informs browsers they can cache forever
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }));
  
  // Serve images directory directly to match database paths
  app.use('/images', express.static(path.join(process.cwd(), 'public/images'), {
    maxAge: 31536000000, // Cache for 1 year in milliseconds
    immutable: true,
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }));

  
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

  // Get a property by ID
  apiRouter.get("/properties/:id", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      if (isNaN(propertyId)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }
      
      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      res.json(property);
    } catch (error) {
      console.error("Property fetch error:", error);
      res.status(500).json({ message: "Failed to fetch property details" });
    }
  });
  
  // Get all properties of a specified type
  apiRouter.get("/properties/type/:type", async (req, res) => {
    try {
      const type = req.params.type;
      if (!type) {
        return res.status(400).json({ message: "Invalid property type" });
      }
      
      const properties = await storage.getPropertiesByType(type);
      
      res.json(properties);
    } catch (error) {
      console.error("Property type fetch error:", error);
      res.status(500).json({ message: "Failed to fetch properties by type" });
    }
  });
  
  // Get all neighborhoods
  apiRouter.get("/neighborhoods", async (req, res) => {
    try {
      const neighborhoods = await storage.getNeighborhoods();
      res.json(neighborhoods);
    } catch (error) {
      console.error("Neighborhoods fetch error:", error);
      res.status(500).json({ message: "Failed to fetch neighborhoods" });
    }
  });
  
  // Get a neighborhood by ID with its properties
  apiRouter.get("/neighborhoods/:id", async (req, res) => {
    try {
      const neighborhoodId = parseInt(req.params.id);
      if (isNaN(neighborhoodId)) {
        return res.status(400).json({ message: "Invalid neighborhood ID" });
      }
      
      const neighborhood = await storage.getNeighborhood(neighborhoodId);
      if (!neighborhood) {
        return res.status(404).json({ message: "Neighborhood not found" });
      }
      
      // Fetch properties in this neighborhood
      const properties = await storage.getPropertiesByNeighborhood(neighborhoodId);
      
      // Return combined response
      res.json({
        ...neighborhood,
        properties
      });
    } catch (error) {
      console.error("Neighborhood detail fetch error:", error);
      res.status(500).json({ message: "Failed to fetch neighborhood details" });
    }
  });
  
  // Submit a contact message
  apiRouter.post("/messages", async (req, res) => {
    try {
      const result = insertMessageSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid message data",
          errors: result.error.flatten() 
        });
      }
      
      // Validate email format
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(result.data.email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      
      // Create the message
      const newMessage = await storage.createMessage(result.data);
      
      res.status(201).json({
        message: "Message sent successfully",
        data: newMessage
      });
    } catch (error) {
      console.error("Message creation error:", error);
      res.status(500).json({ message: "Failed to submit your message" });
    }
  });
  
  // Get all messages (admin route)
  apiRouter.get("/messages", async (req, res) => {
    try {
      // In a real application, authentication would be required here
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (error) {
      console.error("Messages fetch error:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });
  
  // Add a property to favorites
  apiRouter.post("/favorites", async (req, res) => {
    try {
      const { userId, propertyId } = req.body;
      
      // Validate IDs
      if (!userId || !propertyId || isNaN(Number(userId)) || isNaN(Number(propertyId))) {
        return res.status(400).json({ message: "Invalid user ID or property ID" });
      }
      
      // Check if already favorite
      const isAlreadyFavorite = await storage.isFavorite(userId, propertyId);
      if (isAlreadyFavorite) {
        return res.json({ message: "Property is already in favorites", favorite: true });
      }
      
      // Add to favorites
      const favorite = await storage.addFavorite({ userId, propertyId });
      
      res.status(201).json({
        message: "Property added to favorites",
        favorite: true,
        data: favorite
      });
    } catch (error) {
      console.error("Add favorite error:", error);
      res.status(500).json({ message: "Failed to add property to favorites" });
    }
  });
  
  // Remove a property from favorites
  apiRouter.delete("/favorites/:userId/:propertyId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const propertyId = parseInt(req.params.propertyId);
      
      if (isNaN(userId) || isNaN(propertyId)) {
        return res.status(400).json({ message: "Invalid user ID or property ID" });
      }
      
      // Remove from favorites
      const removed = await storage.removeFavorite(userId, propertyId);
      
      if (removed) {
        res.json({
          message: "Property removed from favorites",
          favorite: false
        });
      } else {
        res.status(404).json({ message: "Favorite not found" });
      }
    } catch (error) {
      console.error("Remove favorite error:", error);
      res.status(500).json({ message: "Failed to remove property from favorites" });
    }
  });
  
  // Get user's favorite properties
  apiRouter.get("/favorites/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
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
      const rentalId = parseInt(req.params.id);
      if (isNaN(rentalId)) {
        return res.status(400).json({ message: "Invalid rental ID" });
      }
      
      const rental = await storage.getAirbnbRental(rentalId);
      if (!rental) {
        return res.status(404).json({ message: "Rental not found" });
      }
      
      res.json(rental);
    } catch (error) {
      console.error("Airbnb rental fetch error:", error);
      res.status(500).json({ message: "Failed to fetch rental details" });
    }
  });

  // Create WebSocket server for real-time communications
  const server = createServer(app);
  const wss = new WebSocketServer({ server, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received WebSocket message:', data);
        
        // Handle different message types
        if (data.type === 'video_metrics') {
          // Process video metrics from the client
          const metrics = data.metrics;
          console.log('Received video metrics:', metrics);
          
          // Based on metrics, we could respond with optimized video settings
          // Just a simple example response
          ws.send(JSON.stringify({
            type: 'video_config',
            config: {
              quality: metrics.memoryUsage > 70 ? 'medium' : 'high',
              bufferSize: metrics.bufferLevel < 5 ? 10 : 5,
              // Add suggested cached URLs if available
              cachedUrls: [
                '/api/video/ohana/highperf',
                '/api/video/ohana/mobile'
              ]
            }
          }));
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  // Register API routes
  app.use('/api', apiRouter);
  
  // Generate XML sitemap for SEO
  app.get('/sitemap.xml', async (req, res) => {
    try {
      // Get all properties and neighborhoods from the database
      const properties = await storage.getProperties();
      const neighborhoods = await storage.getNeighborhoods();
      
      // Base URL for the website
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://ohanarealty.com'
        : `http://${req.headers.host}`;
      
      // Generate XML sitemap
      let xml = '<?xml version="1.0" encoding="UTF-8"?>';
      xml += '\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      
      // Add static pages
      const staticPages = ['', 'properties', 'about', 'contact', 'neighborhoods', 'favorites'];
      for (const page of staticPages) {
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/${page}</loc>\n`;
        xml += '    <changefreq>daily</changefreq>\n';
        xml += '    <priority>1.0</priority>\n';
        xml += '  </url>\n';
      }
      
      // Add property detail pages
      for (const property of properties) {
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/properties/${property.id}</loc>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.8</priority>\n';
        xml += '  </url>\n';
      }
      
      // Add neighborhood detail pages
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

  // YouTube-like adaptive video serving based on request path and device capabilities
  function serveAdaptiveVideo(req: express.Request, res: express.Response, videoFileName: string, endpointType: 'standard' | 'mobile' | 'highperf') {
    try {
      const videoPath = path.join(process.cwd(), 'public', videoFileName);
      
      // Check if file exists
      if (!fs.existsSync(videoPath)) {
        console.error(`Video file not found at: ${videoPath}`);
        return res.status(404).send('Video file not found');
      }
      
      // Get file stats
      const stat = fs.statSync(videoPath);
      const fileSize = stat.size;
      
      // YouTube-like adaptive streaming parameters based on endpoint type
      let chunkSize: number;
      let bufferSize: number;
      let initialChunkSize: number; // Special initial chunk for immediate playback start
      let logPrefix: string;
      
      // Configure settings based on endpoint type with DRASTICALLY smaller chunks
      if (endpointType === 'mobile') {
        // Mobile-optimized settings (tiny chunks, tiny buffers, extremely quick start)
        chunkSize = 256 * 1024;          // 256KB chunks - drastically smaller
        bufferSize = 128 * 1024;         // 128KB buffer - even smaller
        initialChunkSize = 512 * 1024;   // 512KB initial chunk - just enough to start playing
        logPrefix = '📱 Mobile';
        console.log(`${logPrefix}: Serving super-optimized video for mobile: ${videoFileName} (${(fileSize / 1024 / 1024).toFixed(2)}MB)`); 
      } 
      else if (endpointType === 'highperf') {
        // High-performance settings with much smaller chunks
        chunkSize = 2 * 1024 * 1024;     // 2MB chunks - radically reduced from 40MB
        bufferSize = 512 * 1024;         // 512KB buffer - much smaller buffer
        initialChunkSize = 1 * 1024 * 1024; // 1MB initial chunk - gets playback going immediately
        logPrefix = '🖥️ HighPerf';
        console.log(`${logPrefix}: Serving chunk-optimized video: ${videoFileName} (${(fileSize / 1024 / 1024).toFixed(2)}MB)`);
      } 
      else {
        // Standard settings (balanced for most devices)
        chunkSize = 1 * 1024 * 1024;     // 1MB chunks - reduced from 5MB
        bufferSize = 256 * 1024;         // 256KB buffer - reduced
        initialChunkSize = 768 * 1024;   // 768KB preview - smaller initial chunk for faster start
        logPrefix = '📺 Standard';
        console.log(`${logPrefix}: Serving optimized standard video: ${videoFileName} (${(fileSize / 1024 / 1024).toFixed(2)}MB)`);
      }
      
      const range = req.headers.range;
      
      // CRITICAL FIX: If no range is specified, send a perfect initial chunk
      // This is key to fixing the 3-second play-stop issue
      if (!range) {
        // Send a special initial chunk for immediate playback
        const headers = {
          'Content-Length': initialChunkSize,
          'Accept-Ranges': 'bytes',
          'Content-Type': 'video/mp4',
          'Cache-Control': 'public, max-age=86400', // 24 hour cache
          'Connection': 'keep-alive',
          'X-Content-Type-Options': 'nosniff'
        };
        
        console.log(`${logPrefix}: Sending perfect initial chunk: ${(initialChunkSize / 1024).toFixed(2)}KB`);
        
        // Create a special stream with a smaller buffer
        const fileStream = fs.createReadStream(videoPath, { 
          start: 0,
          end: initialChunkSize - 1,
          highWaterMark: bufferSize
        });
        
        res.writeHead(200, headers);
        
        // Log when chunk is completely sent
        let bytesSent = 0;
        fileStream.on('data', (chunk) => {
          bytesSent += chunk.length;
        });
        
        fileStream.on('end', () => {
          console.log(`${logPrefix}: Initial chunk complete: ${bytesSent} bytes sent`);
        });
        
        // Pipe the file stream to the response
        fileStream.pipe(res);
        
        // Handle errors and disconnects
        fileStream.on('error', (error: Error) => {
          console.error(`${logPrefix}: Error streaming initial chunk:`, error);
          if (!res.headersSent) {
            res.status(500).send('Error streaming video');
          }
          fileStream.close();
        });
        
        req.on('close', () => {
          console.log(`${logPrefix}: Client disconnected during initial chunk`);
          fileStream.close();
        });
        
        return; // End function execution after sending initial chunk
      }
      
      // YouTube-like handling of range requests for video seeking
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        
        // Adaptive end position based on device capabilities
        let end: number;
        if (parts[1]) {
          end = parseInt(parts[1], 10);
        } else {
          // If no end specified, use the appropriate chunk size
          end = Math.min(start + chunkSize, fileSize - 1);
        }
        
        // Ensure end doesn't exceed file size
        end = Math.min(end, fileSize - 1);
        
        const chunksize = (end - start) + 1;
        
        // Log range request with appropriate prefix
        if (endpointType === 'mobile') {
          console.log(`${logPrefix}: Range request: ${start}-${end}/${fileSize} (${(chunksize / 1024).toFixed(2)}KB)`);
        } else {
          console.log(`${logPrefix}: Range request: ${start}-${end}/${fileSize} (${(chunksize / 1024 / 1024).toFixed(2)}MB)`);
        }
        
        // Set YouTube-like headers with adaptive caching
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
          'Cache-Control': 'public, max-age=31536000, immutable', // YouTube-like aggressive caching
          'Connection': 'keep-alive',
        });
        
        // Create optimized read stream with adaptive buffer size
        const fileStream = fs.createReadStream(videoPath, { 
          start, 
          end,
          highWaterMark: bufferSize // Adaptive buffer size based on device type
        });
        
        // YouTube-like efficient piping
        fileStream.pipe(res, { end: true });
        
        // Handle stream end
        fileStream.on('end', () => {
          console.log(`${logPrefix}: Video chunk complete: ${start}-${end}`);
        });
        
        // Enhanced error handling
        fileStream.on('error', (error: Error) => {
          console.error(`${logPrefix}: Error streaming video:`, error);
          if (!res.headersSent) {
            res.status(500).send('Error streaming video');
          }
          fileStream.destroy();
        });
        
        // Handle client disconnect
        req.on('close', () => {
          console.log(`${logPrefix}: Client disconnected, closing video stream`);
          fileStream.destroy();
        });
      } 
      // No range requested - deliver YouTube-like optimized initial segment
      else {
        // For high-performance, we might send the entire video
        // For mobile, we send just enough to start playing quickly
        const initialSize = Math.min(initialChunkSize, fileSize);
        
        // Log initial load with appropriate prefix
        if (endpointType === 'mobile') {
          console.log(`${logPrefix}: Initial segment: ${(initialSize / 1024).toFixed(2)}KB`);
        } else if (endpointType === 'highperf') {
          console.log(`${logPrefix}: Sending full video: ${(initialSize / 1024 / 1024).toFixed(2)}MB`);
        } else {
          console.log(`${logPrefix}: Initial segment: ${(initialSize / 1024 / 1024).toFixed(2)}MB`);
        }
        
        // Set YouTube-like optimized headers
        res.writeHead(206, {
          'Content-Range': `bytes 0-${initialSize - 1}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': initialSize,
          'Content-Type': 'video/mp4',
          'Cache-Control': 'public, max-age=31536000, immutable', // YouTube-like aggressive caching
          'Connection': 'keep-alive',
        });
        
        // Create optimized read stream with adaptive buffer size
        const fileStream = fs.createReadStream(videoPath, { 
          start: 0, 
          end: initialSize - 1,
          highWaterMark: bufferSize // Adaptive buffer size based on device type
        });
        
        // YouTube-like efficient piping
        fileStream.pipe(res, { end: true });
        
        // Enhanced error handling
        fileStream.on('error', (error: Error) => {
          console.error(`${logPrefix}: Error streaming video:`, error);
          if (!res.headersSent) {
            res.status(500).send('Error streaming video');
          }
          fileStream.destroy();
        });
        
        // Handle client disconnect
        req.on('close', () => {
          console.log(`${logPrefix}: Client disconnected, closing stream`);
          fileStream.destroy();
        });
      }
    } catch (error) {
      console.error(`Error serving video (${endpointType}):`, error);
      if (!res.headersSent) {
        res.status(500).send('Error serving video file');
      }
    }
  }

  // Legacy endpoint for property video
  app.get('/api/video/property', (req, res) => {
    serveVideoFile(req, res, 'property-video.mp4');
  });
  
  // YouTube-like streaming endpoints for OHANAVIDEOMASTER.mp4
  app.get('/api/video/ohana', (req, res) => {
    serveAdaptiveVideo(req, res, 'OHANAVIDEOMASTER.mp4', 'standard');
  });
  
  // Mobile-optimized video endpoint with smaller chunks and buffer
  app.get('/api/video/ohana/mobile', (req, res) => {
    serveAdaptiveVideo(req, res, 'OHANAVIDEOMASTER.mp4', 'mobile');
  });
  
  // High-performance optimized endpoint with larger chunks and buffer
  app.get('/api/video/ohana/highperf', (req, res) => {
    serveAdaptiveVideo(req, res, 'OHANAVIDEOMASTER.mp4', 'highperf');
  });
  
  // Legacy function to maintain compatibility with existing code
  // Will be gradually replaced by serveAdaptiveVideo
  function serveVideoFile(req: express.Request, res: express.Response, videoFileName: string) {
    try {
      // Simply redirect to the adaptive video serving function with standard settings
      serveAdaptiveVideo(req, res, videoFileName, 'standard');
    } catch (error) {
      console.error(`Legacy video serving error for ${videoFileName}:`, error);
      if (!res.headersSent) {
        res.status(500).send('Error serving video file');
      }
    }
  }

  return server;
}
