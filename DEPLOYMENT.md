# Ohana Realty Deployment Guide

## Overview

This guide outlines the steps to deploy the Ohana Realty website to a production environment. Our platform is built with a React frontend and Node.js backend, utilizing enterprise-grade features including PostgreSQL database integration, advanced SEO, and optimized video streaming.

## Prerequisites

- Node.js 20.x or higher
- PostgreSQL database
- Environment with at least 2GB RAM and 1 CPU core
- Domain name (for production use)

## Environment Variables

The following environment variables must be set in your production environment:

```
DATABASE_URL=<your-postgresql-connection-string>
NODE_ENV=production
PORT=3000 (or your preferred port)
```

## Deployment Steps

### 1. Prepare the Database

Initialize and migrate the database schema:

```bash
./deploy-db.sh
```

This script creates all necessary tables and relationships in your PostgreSQL database using our schema definitions.

### 2. Build the Application

Create a production build of the application:

```bash
npm run build
```

This command:
- Builds the frontend with Vite
- Bundles the backend with esbuild
- Optimizes all assets for production

### 3. Start the Server

Launch the production server:

```bash
npm run start
```

For production environments, we recommend using a process manager like PM2:

```bash
npm install -g pm2
pm2 start dist/index.js --name "ohana-realty"
```

## Video Streaming Configuration

Our application uses adaptive video streaming with three quality levels:

1. `/api/video/ohana/mobile` - Optimized for mobile devices (smaller chunk size)
2. `/api/video/ohana` - Standard quality for most devices
3. `/api/video/ohana/highperf` - High performance for fast connections

The system automatically routes users to the appropriate stream based on their device and connection quality.

## SEO Optimization

The application is optimized for search engines with:

- Structured data for business information
- Proper meta tags with geographic information
- Schema.org markup for real estate listings
- Optimized page load times with code splitting

## Monitoring and Maintenance

- Check server logs in `/var/log/ohana-realty/`
- Monitor database performance regularly
- Update business information in the standardized format across the site

## Common Issues

### Database Connection Errors

If you experience database connection issues, verify:

1. The DATABASE_URL environment variable is correctly set
2. PostgreSQL server is running and accessible
3. Database user has proper permissions

### Video Streaming Problems

If video playback is inconsistent:

1. Check that video files are in the correct location
2. Verify server has sufficient bandwidth
3. Confirm MIME types are properly configured on the server

## Support

For additional deployment assistance, please contact Ohana Realty technical support.
