import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";
import helmet from "helmet";
import { db } from "./db";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use Helmet for production security headers
if (process.env.NODE_ENV === 'production') {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com", "https://fonts.googleapis.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https://*"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "https://unpkg.com"],
        connectSrc: ["'self'", "https://api.ohanarealty.com"],
        frameSrc: ["'self'", "https://*.stripe.com"],
        objectSrc: ["'none'"]
      }
    },
    crossOriginEmbedderPolicy: false // Allow embedding of cross-origin resources
  }));
} else {
  // Less restrictive security for development
  app.use(helmet({
    contentSecurityPolicy: false
  }));
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
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    console.error(`Server error: ${message}`, err);
    
    // In production, don't expose error details to clients
    const responseMessage = process.env.NODE_ENV === 'production' 
      ? "Internal Server Error" 
      : message;
    
    res.status(status).json({ message: responseMessage });
    
    // Don't throw the error again in production
    if (process.env.NODE_ENV !== 'production') {
      throw err;
    }
  });

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
})();
