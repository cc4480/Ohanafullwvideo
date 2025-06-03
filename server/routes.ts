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

  apiRouter.get("/properties", async (req, res) => {
    try {
      const properties = await storage.getProperties();
      res.json(properties || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });

  apiRouter.get("/properties/featured", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const properties = await (storage as any).getFeaturedProperties?.(limit) || await storage.getProperties();
      const featuredProperties = properties.filter((p: any) => p.featured === true).slice(0, limit || 4);
      res.json(featuredProperties || []);
    } catch (error) {
      console.error("Error fetching featured properties:", error);
      res.status(500).json({ error: "Failed to fetch featured properties" });
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

  // Track active connections to prevent spam
  const activeConnections = new Set();
  const connectionConfigs = new Map();

  wss.on('connection', (ws) => {
    const connectionId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    activeConnections.add(connectionId);

    console.log(`WebSocket connection established: ${connectionId}`);

    // Rate limiting for messages
    let lastMessageTime = 0;
    const MESSAGE_THROTTLE_MS = 2000; // Only process messages every 2 seconds

    ws.on('message', (message) => {
      try {
        const now = Date.now();
        if (now - lastMessageTime < MESSAGE_THROTTLE_MS) {
          return; // Throttle messages to prevent spam
        }
        lastMessageTime = now;

        const data = JSON.parse(message.toString());

        // Handle different message types
        if (data.type === 'video_metrics') {
          const metrics = data.metrics;

          // Only send config if it has changed significantly
          const currentConfig = connectionConfigs.get(connectionId);
          const newQuality = metrics.bufferLevel < 3 ? 'mobile' : 
                           metrics.bufferLevel < 7 ? 'standard' : 'high';
          const newBufferSize = metrics.bufferLevel < 5 ? 10 : 5;

          if (!currentConfig || 
              currentConfig.quality !== newQuality || 
              currentConfig.bufferSize !== newBufferSize) {

            const config = {
              quality: newQuality,
              bufferSize: newBufferSize,
              cachedUrls: [
                '/api/video/ohana/highperf',
                '/api/video/ohana/mobile'
              ]
            };

            connectionConfigs.set(connectionId, config);

            ws.send(JSON.stringify({
              type: 'video_config',
              config
            }));
          }
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log(`WebSocket connection closed: ${connectionId}`);
      activeConnections.delete(connectionId);
      connectionConfigs.delete(connectionId);
    });

    ws.on('error', (error) => {
      console.error(`WebSocket error for ${connectionId}:`, error);
      activeConnections.delete(connectionId);
      connectionConfigs.delete(connectionId);
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
    <p>123 Main Street, Laredo, TX 78040 | (956) 324-6714 | info@ohanarealty.com</p>
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

      // Configure settings based on endpoint type with optimized chunk sizes
      if (endpointType === 'mobile') {
        // Mobile-optimized settings with smaller 2MB chunks for reliable playback
        chunkSize = 2 * 1024 * 1024;     // 2MB chunks for smooth mobile playback
        bufferSize = 2 * 1024 * 1024;    // 2MB buffer - matching buffer size
        initialChunkSize = 2 * 1024 * 1024; // 2MB initial chunk
        logPrefix = '📱 Mobile';
        console.log(`${logPrefix}: Serving super-optimized video for mobile: ${videoFileName} (${(fileSize / 1024 / 1024).toFixed(2)}MB)`); 
      } 
      else if (endpointType === 'highperf') {
        // High-performance settings optimized for 16GB+ RAM systems
        chunkSize = 16 * 1024 * 1024;    // 16MB chunks for high-RAM devices
        bufferSize = 24 * 1024 * 1024;   // 24MB buffer for much faster loading
        initialChunkSize = 8 * 1024 * 1024; // 8MB initial chunk for near-instant startup
        logPrefix = '🖥️ HighPerf';
        console.log(`${logPrefix}: Serving ultra high-performance optimized video: ${videoFileName} (${(fileSize / 1024 / 1024).toFixed(2)}MB)`);
      } 
      else {
        // Standard settings with balanced 4MB chunk size
        chunkSize = 4 * 1024 * 1024;     // 4MB chunks - balanced for most devices
        bufferSize = 4 * 1024 * 1024;    // 4MB buffer - matching buffer size
        initialChunkSize = 3 * 1024 * 1024; // 3MB initial chunk for quick start
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
          // Aggressive cache headers for instant playback
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800, immutable',
          'Expires': new Date(Date.now() + 86400000).toUTCString(),
          'ETag': `"${videoPath}-${stat.mtime.getTime()}"`,
          'Last-Modified': stat.mtime.toUTCString(),
          'X-Content-Type-Options': 'nosniff',
          'Access-Control-Max-Age': '86400',
          'Connection': 'keep-alive',
          'X-Content-Type-Options': 'nosniff'
        };

        console.log(`${logPrefix}: Sending perfect initial chunk: ${(initialChunkSize / 1024 / 1024).toFixed(2)}MB`);

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
        // For all endpoint types, we're now using MB to be consistent
        console.log(`${logPrefix}: Range request: ${start}-${end}/${fileSize} (${(chunksize / 1024 / 1024).toFixed(2)}MB)`);

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

        // Enhanced error handling with retry capability
        fileStream.on('error', (error: Error) => {
          console.error(`${logPrefix}: Error streaming video:`, error);
          if (!res.headersSent) {
            res.status(500).send('Error streaming video');
          }
          fileStream.destroy();
        });

        // Improved client disconnect handling
        let clientDisconnected = false;
        req.on('close', () => {
          if (!clientDisconnected) {
            console.log(`${logPrefix}: Client disconnected, closing video stream`);
            clientDisconnected = true;
            fileStream.destroy();
          }
        });

        // Handle response finish to prevent multiple logs
        res.on('finish', () => {
          if (!clientDisconnected) {
            fileStream.destroy();
          }
        });
      } 
      // No range requested - deliver YouTube-like optimized initial segment
      else {
        // For high-performance, we might send the entire video
        // For mobile, we send just enough to start playing quickly
        const initialSize = Math.min(initialChunkSize, fileSize);

        // Log initial load with appropriate prefix - all in MB for consistency
        if (endpointType === 'highperf') {
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

import { Property } from "@shared/types";
import { Neighborhood } from "@shared/types";
import { ContactMessage } from "@shared/types";
import { Favorite } from "@shared/types";
import { AirbnbRental } from "@shared/types";

// Define the in-memory storage
interface Storage {
  properties: Property[];
  neighborhoods: Neighborhood[];
  messages: ContactMessage[];
  favorites: Favorite[];
  airbnbRentals: AirbnbRental[];
  getProperty: (id: number) => Promise<Property | undefined>;
  getProperties: () => Promise<Property[]>;
  getPropertiesByType: (type: string) => Promise<Property[]>;
  searchProperties: (filters: any) => Promise<Property[]>;
  getPropertiesCount: (filters: any) => Promise<number>;
  getFeaturedProperties?: (limit?: number) => Promise<Property[]>;
  getNeighborhood: (id: number) => Promise<Neighborhood | undefined>;
  getNeighborhoods: () => Promise<Neighborhood[]>;
  getPropertiesByNeighborhood: (neighborhoodId: number) => Promise<Property[]>;
  createMessage: (message: ContactMessage) => Promise<ContactMessage>;
  getMessages: () => Promise<ContactMessage[]>;
  addFavorite: (favorite: Favorite) => Promise<Favorite>;
  removeFavorite: (userId: number, propertyId: number) => Promise<boolean>;
  getUserFavorites: (userId: number) => Promise<Favorite[]>;
  isFavorite: (userId: number, propertyId: number) => Promise<boolean>;
  getAirbnbRentals: () => Promise<AirbnbRental[]>;
  getAirbnbRental: (id: number) => Promise<AirbnbRental | undefined>;
  getFeaturedAirbnbRentals: (limit?: number) => Promise<AirbnbRental[]>;
  searchAirbnbRentals: (filters: any) => Promise<AirbnbRental[]>;
}

// Mock data for properties
const properties: Property[] = [
  {
    id: 1,
    type: "RESIDENTIAL",
    address: "123 Main St",
    city: "Laredo",
    state: "TX",
    zipCode: "78040",
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1500,
    price: 250000,
    description: "Charming 3-bedroom home in a great neighborhood.",
    images: [
      "/house1-primary.webp",
      "/house1-kitchen.webp",
      "/house1-living.webp",
      "/house1-backyard.webp",
      "/house1-master.webp"
    ],
    yearBuilt: 1995,
    lotSize: 0.5,
    mlsNumber: "1234567",
    taxes: 3000,
    hoa: 100,
    amenities: ["Garage", "Backyard", "Central Air"],
    nearbySchools: ["Elementary School", "Middle School", "High School"],
    location: {
      latitude: 27.506615,
      longitude: -99.507433
    },
    featured: true,
    neighborhood: 1,
    virtualTourUrl: "https://example.com/virtual-tour",
    floorPlans: [
      {
        name: "First Floor",
        imageUrl: "/floorplan1.webp"
      },
      {
        name: "Second Floor",
        imageUrl: "/floorplan2.webp"
      }
    ]
  },
  {
    id: 2,
    type: "COMMERCIAL",
    address: "456 Business Ave",
    city: "Laredo",
    state: "TX",
    zipCode: "78041",
    squareFeet: 5000,
    price: 750000,
    description: "Prime commercial space in a high-traffic area.",
    images: [
      "/commercial1-front.webp",
      "/commercial1-interior1.webp",
      "/commercial1-interior2.webp",
      "/commercial1-street.webp",
      "/commercial1-parking.webp"
    ],
    yearBuilt: 2010,
    lotSize: 1.2,
    mlsNumber: "7654321",
    taxes: 10000,
    hoa: 0,
    amenities: ["Parking", "Loading Dock", "Central Air"],
    nearbyBusinesses: ["Restaurant", "Retail Store", "Office Building"],
    location: {
      latitude: 27.515094,
      longitude: -99.502506
    },
    featured: false,
    neighborhood: 2
  },
  {
    id: 3,
    type: "RESIDENTIAL",
    address: "789 Oak St",
    city: "Laredo",
    state: "TX",
    zipCode: "78042",
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2200,
    price: 380000,
    description: "Spacious 4-bedroom home with a large backyard and pool.",
    images: [
      "/house2-primary.webp",
      "/house2-kitchen.webp",
      "/house2-living.webp",
      "/house2-pool.webp",
      "/house2-master.webp"
    ],
    yearBuilt: 2005,
    lotSize: 0.75,
    mlsNumber: "9876543",
    taxes: 4500,
    hoa: 150,
    amenities: ["Pool", "Garage", "Backyard", "Central Air"],
    nearbySchools: ["Elementary School", "Middle School", "High School"],
    location: {
      latitude: 27.523573,
      longitude: -99.497578
    },
    featured: true,
    neighborhood: 1,
    virtualTourUrl: "https://example.com/virtual-tour2",
    floorPlans: [
      {
        name: "First Floor",
        imageUrl: "/floorplan3.webp"
      },
      {
        name: "Second Floor",
        imageUrl: "/floorplan4.webp"
      }
    ]
  },
  {
    id: 4,
    type: "COMMERCIAL",
    address: "101 Main St",
    city: "Laredo",
    state: "TX",
    zipCode: "78040",
    squareFeet: 3000,
    price: 450000,
    description: "Excellent commercial space for retail or office use.",
    images: [
      "/commercial2-front.webp",
      "/commercial2-interior1.webp",
      "/commercial2-interior2.webp",
      "/commercial2-street.webp",
      "/commercial2-parking.webp"
    ],
    yearBuilt: 1980,
    lotSize: 0.8,
    mlsNumber: "4567890",
    taxes: 6000,
    hoa: 0,
    amenities: ["Parking", "Central Air", "High Visibility"],
    nearbyBusinesses: ["Restaurant", "Bank", "Office Building"],
    location: {
      latitude: 27.508281,
      longitude: -99.505882
    },
    featured: false,
    neighborhood: 2
  },
  {
    id: 5,
    type: "RESIDENTIAL",
    address: "222 Pine St",
    city: "Laredo",
    state: "TX",
    zipCode: "78043",
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1800,
    price: 290000,
    description: "Well-maintained 3-bedroom home with a fenced backyard.",
    images: [
      "/house3-primary.webp",
      "/house3-kitchen.webp",
      "/house3-living.webp",
      "/house3-backyard.webp",
      "/house3-master.webp"
    ],
    yearBuilt: 2000,
    lotSize: 0.6,
    mlsNumber: "2345678",
    taxes: 3500,
    hoa: 120,
    amenities: ["Garage", "Fenced Backyard", "Central Air"],
    nearbySchools: ["Elementary School", "Middle School", "High School"],
    location: {
      latitude: 27.516762,
      longitude: -99.511718
    },
    featured: false,
    neighborhood: 1,
    virtualTourUrl: "https://example.com/virtual-tour3",
    floorPlans: [
      {
        name: "First Floor",
        imageUrl: "/floorplan5.webp"
      },
      {
        name: "Second Floor",
        imageUrl: "/floorplan6.webp"
      }
    ]
  },
  {
    id: 6,
    type: "COMMERCIAL",
    address: "777 Industrial Blvd",
    city: "Laredo",
    state: "TX",
    zipCode: "78045",
    squareFeet: 7000,
    price: 950000,
    description: "Spacious industrial property with ample parking and loading docks.",
    images: [
      "/industrial1-front.webp",
      "/industrial1-interior1.webp",
      "/industrial1-interior2.webp",
      "/industrial1-parking.webp",
      "/industrial1-loading.webp"
    ],
    yearBuilt: 2015,
    lotSize: 2.5,
    mlsNumber: "8765432",
    taxes: 12000,
    hoa: 0,
    amenities: ["Parking", "Loading Docks", "High Ceilings"],
    nearbyBusinesses: ["Manufacturing", "Distribution", "Warehouse"],
    location: {
      latitude: 27.525243,
      longitude: -99.500865
    },
    featured: true,
    neighborhood: 2
  },
  {
    id: 7,
    type: "RESIDENTIAL",
    address: "444 Lakeview Dr",
    city: "Laredo",
    state: "TX",
    zipCode: "78046",
    bedrooms: 5,
    bathrooms: 4,
    squareFeet: 3000,
    price: 480000,
    description: "Luxury 5-bedroom home with lake views and a private dock.",
    images: [
      "/house4-primary.webp",
      "/house4-kitchen.webp",
      "/house4-living.webp",
      "/house4-lake.webp",
      "/house4-dock.webp"
    ],
    yearBuilt: 2010,
    lotSize: 1,
    mlsNumber: "3456789",
    taxes: 6000,
    hoa: 200,
    amenities: ["Lake View", "Private Dock", "Garage", "Central Air"],
    nearbySchools: ["Elementary School", "Middle School", "High School"],
    location: {
      latitude: 27.513421,
      longitude: -99.509274
    },
    featured: true,
    neighborhood: 1,
    virtualTourUrl: "https://example.com/virtual-tour4",
    floorPlans: [
      {
        name: "First Floor",
        imageUrl: "/floorplan7.webp"
      },
      {
        name: "Second Floor",
        imageUrl: "/floorplan8.webp"
      }
    ]
  },
  {
    id: 8,
    type: "COMMERCIAL",
    address: "999 Tech Park Dr",
    city: "Laredo",
    state: "TX",
    zipCode: "78045",
    squareFeet: 4000,
    price: 600000,
    description: "Modern office space in a tech park with high-speed internet.",
    images: [
      "/office1-front.webp",
      "/office1-interior1.webp",
      "/office1-interior2.webp",
      "/office1-lobby.webp",
      "/office1-conference.webp"
    ],
    yearBuilt: 2018,
    lotSize: 1.5,
    mlsNumber: "5678901",
    taxes: 8000,
    hoa: 0,
    amenities: ["High-Speed Internet", "Parking", "Central Air"],
    nearbyBusinesses: ["Tech Companies", "Startups", "Research Facilities"],
    location: {
      latitude: 27.521902,
      longitude: -99.495921
    },
    featured: false,
    neighborhood: 2
  },
  {
    id: 9,
    type: "RESIDENTIAL",
    address: "666 Hilltop Ln",
    city: "Laredo",
    state: "TX",
    zipCode: "78047",
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2500,
    price: 420000,
    description: "Beautiful 4-bedroom home with hilltop views and a spacious deck.",
    images: [
      "/house5-primary.webp",
      "/house5-kitchen.webp",
      "/house5-living.webp",
      "/house5-deck.webp",
      "/house5-master.webp"
    ],
    yearBuilt: 2008,
    lotSize: 0.8,
    mlsNumber: "6789012",
    taxes: 5000,
    hoa: 180,
    amenities: ["Hilltop Views", "Spacious Deck", "Garage", "Central Air"],
    nearbySchools: ["Elementary School", "Middle School", "High School"],
    location: {
      latitude: 27.530383,
      longitude: -99.489209
    },
    featured: false,
    neighborhood: 1,
    virtualTourUrl: "https://example.com/virtual-tour5",
    floorPlans: [
      {
        name: "First Floor",
        imageUrl: "/floorplan9.webp"
      },
      {
        name: "Second Floor",
        imageUrl: "/floorplan10.webp"
      }
    ]
  },
  {
    id: 10,
    type: "COMMERCIAL",
    address: "333 Riverfront Pkwy",
    city: "Laredo",
    state: "TX",
    zipCode: "78040",
    squareFeet: 6000,
    price: 800000,
    description: "Modern commercial space with riverfront views and ample parking.",
    images: [
      "/commercial3-front.webp",
      "/commercial3-interior1.webp",
      "/commercial3-interior2.webp",
      "/commercial3-river.webp",
      "/commercial3-parking.webp"
    ],
    yearBuilt: 2012,
    lotSize: 1.8,
    mlsNumber: "7890123",
    taxes: 11000,
    hoa: 0,
    amenities: ["Riverfront Views", "Parking", "Central Air"],
    nearbyBusinesses: ["Restaurant", "Retail Store", "Office Building"],
    location: {
      latitude: 27.505062,
      longitude: -99.504235
    },
    featured: true,
    neighborhood: 2
  }
];

// Mock data for neighborhoods
const neighborhoods: Neighborhood[] = [
  {
    id: 1,
    name: "North Laredo",
    description: "A vibrant residential area with excellent schools and parks.",
    image: "/neighborhood1.webp",
    location: {
      latitude: 27.520000,
      longitude: -99.500000
    },
    population: 50000,
    averageIncome: 60000,
    amenities: ["Parks", "Schools", "Shopping Centers"]
  },
  {
    id: 2,
    name: "Downtown Laredo",
    description: "The heart of Laredo with historic buildings and cultural attractions.",
    image: "/neighborhood2.webp",
    location: {
      latitude: 27.500000,
      longitude: -99.510000
    },
    population: 25000,
    averageIncome: 45000,
    amenities: ["Historic Sites", "Restaurants", "Shopping Centers"]
  }
];

// Mock data for airbnb rentals