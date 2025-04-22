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

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay to avoid overloading the server
Crawl-delay: 1
    `.trim();
    
    res.header('Content-Type', 'text/plain');
    res.header('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.send(robotsTxt);
  });

  const httpServer = createServer(app);
  return httpServer;
}
