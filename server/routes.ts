import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema, insertChatMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create API routes
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

  // Get properties by type
  apiRouter.get("/properties/type/:type", async (req, res) => {
    try {
      const type = req.params.type;
      const properties = await storage.getPropertiesByType(type);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch properties by type" });
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

  // Chat with AI assistant
  apiRouter.post("/chat", async (req, res) => {
    try {
      // Validate the request body
      const messageValidation = z.object({
        sessionId: z.string(),
        message: z.string(),
      }).safeParse(req.body);

      if (!messageValidation.success) {
        return res.status(400).json({ 
          message: "Invalid chat message", 
          errors: messageValidation.error.errors 
        });
      }

      const { sessionId, message } = messageValidation.data;

      // Save user message
      const userMessage = await storage.createChatMessage({
        sessionId,
        message,
        isUser: true,
        createdAt: new Date().toISOString()
      });

      // Generate simple AI response based on the message content
      let aiResponse = "";
      
      if (message.toLowerCase().includes("shiloh drive")) {
        aiResponse = "I found 3 properties near Shiloh Drive under $250,000. The closest one is 3720 Flores Ave at $200,000, just 1.5 miles away. Would you like to see the details?";
      } else if (message.toLowerCase().includes("3720 flores")) {
        aiResponse = "3720 Flores Ave is a 2-bedroom, 1-bathroom home with 1,514 sq. ft. It's listed at $200,000. Would you like to schedule a viewing?";
      } else if (message.toLowerCase().includes("iturbide")) {
        aiResponse = "There are 2 commercial properties on Iturbide St. 1318 and 1314 Iturbide St, both priced at $220,000. They are retail/office spaces in downtown Laredo.";
      } else if (message.toLowerCase().includes("commercial")) {
        aiResponse = "We have 2 commercial properties available in Laredo. Both are located on Iturbide St in downtown. Would you like more information?";
      } else if (message.toLowerCase().includes("residential")) {
        aiResponse = "We have a residential property at 3720 Flores Ave. It's a 2-bedroom home listed at $200,000. Are you interested in this property?";
      } else if (message.toLowerCase().includes("valentin")) {
        aiResponse = "Valentin Cuellar is our real estate expert in Laredo. Would you like me to arrange a call with him? His number is 956-712-3000.";
      } else if (message.toLowerCase().includes("neighborhood")) {
        aiResponse = "Laredo has several great neighborhoods. North Laredo is popular for families, Downtown offers historic charm, and South Laredo is known for affordable housing options. Which area interests you most?";
      } else {
        aiResponse = "I'd be happy to help you find your dream property in Laredo. Could you tell me more about what you're looking for?";
      }

      // Save AI response
      const botMessage = await storage.createChatMessage({
        sessionId,
        message: aiResponse,
        isUser: false,
        createdAt: new Date().toISOString()
      });

      // Get conversation history
      const chatHistory = await storage.getChatMessages(sessionId);

      res.json({
        reply: aiResponse,
        history: chatHistory
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // Get chat history
  apiRouter.get("/chat/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const chatHistory = await storage.getChatMessages(sessionId);
      res.json(chatHistory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat history" });
    }
  });

  // Register the API router
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
