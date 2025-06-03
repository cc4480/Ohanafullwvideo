
import { Request, Response } from 'express';
import { db } from './db';
import { sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

export async function healthCheck(req: Request, res: Response) {
  const checks = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    version: '1.0.0',
    status: 'ok',
    checks: {
      database: false,
      videoFiles: false,
      staticAssets: false,
      apiEndpoints: false
    },
    errors: [] as string[]
  };

  try {
    // Test database connection
    await db.execute(sql`SELECT 1`);
    checks.checks.database = true;
  } catch (error) {
    checks.errors.push(`Database: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  try {
    // Test video files exist
    const videoPath = path.join(process.cwd(), 'public/OHANAVIDEOMASTER.mp4');
    if (fs.existsSync(videoPath)) {
      const stats = fs.statSync(videoPath);
      checks.checks.videoFiles = stats.size > 0;
    } else {
      checks.errors.push('Video file OHANAVIDEOMASTER.mp4 not found');
    }
  } catch (error) {
    checks.errors.push(`Video files: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  try {
    // Test static assets
    const assetsPath = path.join(process.cwd(), 'public/assets');
    if (fs.existsSync(assetsPath)) {
      checks.checks.staticAssets = true;
    } else {
      checks.errors.push('Assets directory not found');
    }
  } catch (error) {
    checks.errors.push(`Static assets: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Set overall status
  if (checks.errors.length > 0) {
    checks.status = 'warning';
  }

  const statusCode = checks.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(checks);
}
