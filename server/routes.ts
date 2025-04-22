import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage, initializeSampleData } from "./storage";
import { insertMessageSchema } from "@shared/schema";
import { z } from "zod";

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

  // Get property by ID
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

  // Get featured properties (top 4 properties)
  apiRouter.get("/properties/featured", async (req, res) => {
    try {
      const properties = await storage.getProperties();
      // Sort by price (descending) and select top 4
      const featuredProperties = properties
        .sort((a, b) => b.price - a.price)
        .slice(0, 4);
      
      res.json(featuredProperties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured properties" });
    }
  });
  
  // Search properties with filters
  apiRouter.get("/properties/search", async (req, res) => {
    try {
      const { type, minPrice, maxPrice, minBeds, minBaths, city, zipCode } = req.query;
      
      let properties = await storage.getProperties();
      
      // Apply filters
      if (type) {
        properties = properties.filter(p => p.type.toLowerCase() === String(type).toLowerCase());
      }
      
      if (minPrice) {
        properties = properties.filter(p => p.price >= Number(minPrice));
      }
      
      if (maxPrice) {
        properties = properties.filter(p => p.price <= Number(maxPrice));
      }
      
      if (minBeds) {
        properties = properties.filter(p => p.bedrooms && p.bedrooms >= Number(minBeds));
      }
      
      if (minBaths) {
        properties = properties.filter(p => p.bathrooms && p.bathrooms >= Number(minBaths));
      }
      
      if (city) {
        properties = properties.filter(p => p.city.toLowerCase().includes(String(city).toLowerCase()));
      }
      
      if (zipCode) {
        properties = properties.filter(p => p.zipCode === String(zipCode));
      }
      
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to search properties" });
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

  // Get neighborhood by ID
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
      res.status(500).json({ message: "Failed to fetch neighborhood" });
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

  // Register the API router
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
