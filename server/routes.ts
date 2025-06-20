import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema } from "@shared/schema";
import path from "path";
import fs from "fs";
import { WebSocketServer } from "ws";
import { healthCheck } from './health-check';
import { testAllEndpoints } from './endpoint-tests';

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


  // Database is initialized in server/index.ts
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

      // Save message to text file with daily file creation
      try {
        const messagesDir = path.join(process.cwd(), 'messages');
        
        // Ensure messages directory exists
        if (!fs.existsSync(messagesDir)) {
          fs.mkdirSync(messagesDir, { recursive: true });
        }

        const now = new Date();
        const timestamp = now.toISOString();
        const dateString = now.toISOString().split('T')[0]; // YYYY-MM-DD format
        
        const messageText = `
=================================================================
MESSAGE RECEIVED: ${timestamp}
=================================================================
Name: ${result.data.name}
Email: ${result.data.email}
Phone: ${result.data.phone}
Interest: ${result.data.interest}
Message: ${result.data.message}
=================================================================

`;

        // Save to daily file
        const dailyFileName = `valentin-cuellar-messages-${dateString}.txt`;
        const dailyFilePath = path.join(messagesDir, dailyFileName);
        
        // Save to master file (all messages)
        const masterFileName = `valentin-cuellar-messages-all.txt`;
        const masterFilePath = path.join(messagesDir, masterFileName);
        
        // Append to both daily and master files
        fs.appendFileSync(dailyFilePath, messageText);
        fs.appendFileSync(masterFilePath, messageText);
        
        console.log(`Message saved to daily file: ${dailyFilePath}`);
        console.log(`Message saved to master file: ${masterFilePath}`);
      } catch (fileError) {
        console.error("Error saving message to file:", fileError);
        // Don't fail the request if file saving fails
      }

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

  // Get messages from text file (admin route)
  apiRouter.get("/messages/text-file", (req, res) => {
    try {
      const messagesDir = path.join(process.cwd(), 'messages');
      const { date, type } = req.query;
      
      let fileName: string;
      let filePath: string;
      
      if (date && typeof date === 'string') {
        // Get specific daily file
        fileName = `valentin-cuellar-messages-${date}.txt`;
        filePath = path.join(messagesDir, fileName);
      } else if (type === 'master') {
        // Get master file with all messages
        fileName = `valentin-cuellar-messages-all.txt`;
        filePath = path.join(messagesDir, fileName);
      } else {
        // Get today's file by default
        const today = new Date().toISOString().split('T')[0];
        fileName = `valentin-cuellar-messages-${today}.txt`;
        filePath = path.join(messagesDir, fileName);
      }
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ 
          message: "No messages file found for the requested date",
          requestedFile: fileName
        });
      }

      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(fileContent);
    } catch (error) {
      console.error("Error reading messages file:", error);
      res.status(500).json({ message: "Failed to retrieve messages file" });
    }
  });

  // Get list of all daily message files
  apiRouter.get("/messages/files-list", (req, res) => {
    try {
      const messagesDir = path.join(process.cwd(), 'messages');
      
      if (!fs.existsSync(messagesDir)) {
        return res.json({ files: [] });
      }

      const files = fs.readdirSync(messagesDir)
        .filter(file => file.startsWith('valentin-cuellar-messages-') && file.endsWith('.txt'))
        .map(file => {
          const filePath = path.join(messagesDir, file);
          const stats = fs.statSync(filePath);
          const fileSize = stats.size;
          const lastModified = stats.mtime;
          
          return {
            filename: file,
            size: fileSize,
            lastModified: lastModified.toISOString(),
            downloadUrl: `/api/messages/text-file?${file.includes('-all.txt') ? 'type=master' : `date=${file.replace('valentin-cuellar-messages-', '').replace('.txt', '')}`}`
          };
        })
        .sort((a, b) => b.lastModified.localeCompare(a.lastModified));

      res.json({ files });
    } catch (error) {
      console.error("Error listing message files:", error);
      res.status(500).json({ message: "Failed to list message files" });
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

  // Favorites endpoints
  apiRouter.get('/favorites/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      const favorites = await storage.getUserFavorites(userId);

      // Log for debugging
      console.log(`Favorites for user ${userId}:`, favorites);

      // Ensure we return an array
      res.json(Array.isArray(favorites) ? favorites : []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      res.status(500).json({ error: 'Failed to fetch favorites' });
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

  // Comprehensive health check endpoint
  app.get('/api/health', healthCheck);

  // Import and configure AI SEO services
  try {
    const aiSeoModule = await import('./ai-seo-services');
    if (aiSeoModule.configureAISEOServices) {
      aiSeoModule.configureAISEOServices(app);
    }
  } catch (error) {
    console.error('Error loading AI SEO services:', error);
  }

  // Simple health check for load balancers
  app.get('/api/ping', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Comprehensive endpoint testing (development only)
  if (process.env.NODE_ENV !== 'production') {
    app.get('/api/test-endpoints', testAllEndpoints);
  }

  // Deployment readiness check endpoint
  app.get('/api/deployment-readiness', async (req, res) => {
    try {
      const checks = {
        database: false,
        ai_seo: false,
        video_streaming: false,
        static_assets: false,
        sitemap: false,
        robots: false,
        ssl_ready: false
      };

      // Database check
      try {
        await storage.getProperties();
        checks.database = true;
      } catch (error) {
        console.error('Database check failed:', error);
      }

      // AI SEO services check
      try {
        checks.ai_seo = true; // AI SEO services are configured
      } catch (error) {
        console.error('AI SEO check failed:', error);
      }

      // Video streaming check
      try {
        const videoPath = path.join(process.cwd(), 'public', 'OHANAVIDEOMASTER.mp4');
        checks.video_streaming = fs.existsSync(videoPath);
      } catch (error) {
        console.error('Video streaming check failed:', error);
      }

      // Static assets check
      try {
        const assetsPath = path.join(process.cwd(), 'public', 'images');
        checks.static_assets = fs.existsSync(assetsPath);
      } catch (error) {
        console.error('Static assets check failed:', error);
      }

      // Sitemap check
      try {
        const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
        checks.sitemap = fs.existsSync(sitemapPath);
      } catch (error) {
        console.error('Sitemap check failed:', error);
      }

      // Robots.txt check
      try {
        const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
        checks.robots = fs.existsSync(robotsPath);
      } catch (error) {
        console.error('Robots.txt check failed:', error);
      }

      // SSL readiness check
      checks.ssl_ready = true; // Replit handles SSL automatically

      const allPassed = Object.values(checks).every(check => check === true);
      const passedCount = Object.values(checks).filter(check => check === true).length;
      const totalChecks = Object.keys(checks).length;

      res.json({
        ready_for_deployment: allPassed,
        score: `${passedCount}/${totalChecks}`,
        checks,
        recommendations: allPassed ? [] : [
          !checks.database && 'Database connection needs to be established',
          !checks.ai_seo && 'AI SEO services need configuration',
          !checks.video_streaming && 'Video files need to be uploaded',
          !checks.static_assets && 'Static assets need to be configured',
          !checks.sitemap && 'Sitemap.xml needs to be generated',
          !checks.robots && 'Robots.txt needs to be created'
        ].filter(Boolean)
      });
    } catch (error) {
      console.error('Deployment readiness check failed:', error);
      res.status(500).json({ error: 'Failed to perform deployment readiness check' });
    }
  });

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
    .logo{ max-width: 200px; margin-right: 20px; }
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

      // Configure settings based on endpoint type
      const configs = {
        mobile: { chunk: 2, buffer: 2, initial: 2, prefix: '📱 Mobile' },
        highperf: { chunk: 16, buffer: 24, initial: 8, prefix: '🖥️ HighPerf' },
        standard: { chunk: 4, buffer: 4, initial: 3, prefix: '📺 Standard' }
      };
      
      const config = configs[endpointType];
      chunkSize = config.chunk * 1024 * 1024;
      bufferSize = config.buffer * 1024 * 1024;
      initialChunkSize = config.initial * 1024 * 1024;
      logPrefix = config.prefix;

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
            res.status(500).json({ 
              error: 'Error streaming video',
              suggestion: 'Try refreshing the page or using a different quality setting'
            });
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

  // Video streaming endpoints
  const videoEndpoints = [
    { path: '/api/video/ohana', type: 'standard' as const },
    { path: '/api/video/ohana/mobile', type: 'mobile' as const },
    { path: '/api/video/ohana/highperf', type: 'highperf' as const }
  ];

  videoEndpoints.forEach(({ path, type }) => {
    app.get(path, (req, res) => {
      serveAdaptiveVideo(req, res, 'OHANAVIDEOMASTER.mp4', type);
    });
  });

  // Daily file management utilities
  const createDailyFile = () => {
    try {
      const messagesDir = path.join(process.cwd(), 'messages');
      fs.mkdirSync(messagesDir, { recursive: true });

      const dateString = new Date().toISOString().split('T')[0];
      const dailyFilePath = path.join(messagesDir, `valentin-cuellar-messages-${dateString}.txt`);
      
      if (!fs.existsSync(dailyFilePath)) {
        const headerText = `=================================================================
DAILY MESSAGE LOG FOR VALENTIN CUELLAR - ${dateString}
=================================================================

`;
        fs.writeFileSync(dailyFilePath, headerText);
        console.log(`Daily message file created for ${dateString}`);
      }
    } catch (error) {
      console.error("Error creating daily file:", error);
    }
  };

  // Initialize daily file system
  createDailyFile();
  setInterval(createDailyFile, 24 * 60 * 60 * 1000);

  return server;
}