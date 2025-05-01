/**
 * Security Configuration for Ohana Realty
 * Implements enterprise-grade security headers and protections
 */

import { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';

// Content Security Policy configuration
const cspConfig = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", 'https://maps.googleapis.com', 'https://unpkg.com'],
    styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    imgSrc: ["'self'", 'data:', 'https://*.googleapis.com', 'https://*.unsplash.com', 'https://*.gstatic.com', 'https://maps.gstatic.com'],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    connectSrc: ["'self'", 'https://*.googleapis.com'],
    frameSrc: ["'self'", 'https://www.google.com'],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
};

// Configure security middleware
export function configureSecurity(app: Express) {
  // Use Helmet for security headers
  app.use(helmet());
  
  // Set Content Security Policy
  app.use(helmet.contentSecurityPolicy(cspConfig));
  
  // Prevent clickjacking
  app.use(helmet.frameguard({ action: 'deny' }));
  
  // Set strict transport security for HTTPS
  app.use(helmet.hsts({
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true,
    preload: true,
  }));
  
  // Remove fingerprinting headers
  app.use(helmet.hidePoweredBy());
  
  // Prevent MIME type sniffing
  app.use(helmet.noSniff());
  
  // Set X-XSS-Protection header
  app.use(helmet.xssFilter());
  
  // Disable DNS prefetching
  app.use(helmet.dnsPrefetchControl());
  
  // Custom middleware for additional security headers
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Set permissions policy
    res.setHeader(
      'Permissions-Policy',
      'geolocation=(self), camera=(), microphone=(), payment=(), xr-spatial-tracking=()'
    );
    
    // Custom referrer policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    next();
  });
  
  // Rate limiting for API requests
  configureRateLimiting(app);
  
  console.log('Security middleware configured');
}

// Simple rate limiting implementation
function configureRateLimiting(app: Express) {
  const requestCounts = new Map<string, { count: number, resetTime: number }>();
  
  app.use('/api', (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute window
    const maxRequests = 100; // max 100 requests per minute
    
    // Get or initialize request count
    let requestData = requestCounts.get(ip);
    if (!requestData || now > requestData.resetTime) {
      requestData = { count: 0, resetTime: now + windowMs };
      requestCounts.set(ip, requestData);
    }
    
    // Increment request count
    requestData.count++;
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - requestData.count).toString());
    res.setHeader('X-RateLimit-Reset', Math.ceil(requestData.resetTime / 1000).toString());
    
    // Check if rate limit exceeded
    if (requestData.count > maxRequests) {
      return res.status(429).json({
        error: 'Too many requests, please try again later',
        retryAfter: Math.ceil((requestData.resetTime - now) / 1000),
      });
    }
    
    next();
  });
  
  // Cleanup old entries every minute
  setInterval(() => {
    const now = Date.now();
    // Use Array.from to convert the map entries to an array to avoid iterator issues
    Array.from(requestCounts.entries()).forEach(([ip, data]) => {
      if (now > data.resetTime) {
        requestCounts.delete(ip);
      }
    });
  }, 60000);
}
