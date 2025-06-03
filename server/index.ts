import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";
import helmet from "helmet";
import { db } from "./db";
import { configureSecurity } from "./security";
import { configureSEO } from "./seo";
import { initializeSampleData } from "./storage";
import { globalErrorHandler } from "./error-handler";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add explicit CORS headers and disable caching for development
app.use((req, res, next) => {
  // CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Aggressive no-cache headers to prevent ERR_BLOCKED_BY_RESPONSE
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  res.header('Surrogate-Control', 'no-store');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Apply enhanced security middleware
if (process.env.NODE_ENV === 'production') {
  // Use enterprise-grade security settings in production
  configureSecurity(app);
  console.log('Enterprise-grade security enabled for production');
} else {
  // Less restrictive security for development
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false
  }));
  console.log('Development security settings applied');
}

// Health check endpoint (useful for deployment monitoring)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime() + 's',
    version: '1.0.0'
  });
});

// Security headers are now being set by Helmet above

// Serve static files from the client/public directory
app.use(express.static(path.join(process.cwd(), "client/public"), {
  // Add cache control headers for static assets in production
  setHeaders: (res, filePath) => {
    if (process.env.NODE_ENV === 'production') {
      // Cache images, fonts, and assets for 1 week (in seconds)
      if (filePath.match(/\.(jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
      } 
      // Cache CSS and JS for 1 day (in seconds)
      else if (filePath.match(/\.(css|js)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=86400');
      }
    }
  }
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Initialize database with sample data (only once)
  console.log('Initializing database with sample data...');
  try {
    await initializeSampleData();
    console.log('Database initialization complete.');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
  
  // Configure SEO with advanced features
  console.log('Setting up enterprise-grade SEO optimization...');
  configureSEO(app);
  console.log('SEO optimization system configured successfully!');
  
  const server = await registerRoutes(app);

  // Global error handling middleware
  app.use(globalErrorHandler);

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})().catch((error) => {
  console.error('Server startup failed:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
