
import { Request, Response, NextFunction } from 'express';

interface PerformanceMetrics {
  timestamp: string;
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  memoryUsage: NodeJS.MemoryUsage;
}

const performanceLog: PerformanceMetrics[] = [];
const MAX_LOG_SIZE = 1000;

export const performanceMonitoring = (req: Request, res: Response, next: NextFunction) => {
  const startTime = process.hrtime.bigint();
  
  res.on('finish', () => {
    const endTime = process.hrtime.bigint();
    const responseTime = Number(endTime - startTime) / 1000000; // Convert to milliseconds
    
    const metrics: PerformanceMetrics = {
      timestamp: new Date().toISOString(),
      endpoint: req.path,
      method: req.method,
      responseTime,
      statusCode: res.statusCode,
      memoryUsage: process.memoryUsage()
    };
    
    // Keep only recent metrics
    performanceLog.push(metrics);
    if (performanceLog.length > MAX_LOG_SIZE) {
      performanceLog.shift();
    }
    
    // Log slow requests
    if (responseTime > 1000) {
      console.warn(`Slow request: ${req.method} ${req.path} took ${responseTime}ms`);
    }
  });
  
  next();
};

export const getPerformanceMetrics = (): PerformanceMetrics[] => {
  return performanceLog.slice(-100); // Return last 100 metrics
};
