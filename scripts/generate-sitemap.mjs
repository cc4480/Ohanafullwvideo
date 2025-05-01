/**
 * Sitemap Generator for Ohana Realty
 * 
 * This script generates a sitemap.xml file listing all the public pages on the site
 * for better SEO visibility. It also generates per-property URLs.
 */

import fs from 'fs';
import path from 'path';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ws from 'ws';

// Configure WebSocket for Neon serverless
neonConfig.webSocketConstructor = ws;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_URL = 'https://ohanarealty.com';

// Pages that should be included in the sitemap
const staticPages = [
  '',                 // Home page
  'properties',       // Properties listing page
  'airbnb-rentals',   // Airbnb rentals page
  'neighborhoods',    // Neighborhoods page
  'about',            // About page
  'contact',          // Contact page
  'gallery',          // Gallery page
  'testimonials',     // Testimonials page
];

async function generateSitemap() {
  console.log('Starting sitemap generation...');
  
  try {
    // Create database connection
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    const pool = new Pool({ connectionString });
    
    // Get dynamic property pages
    console.log('Fetching properties data...');
    const propertiesResult = await pool.query('SELECT id, updated_at FROM properties');
    
    // Get dynamic neighborhood pages
    console.log('Fetching neighborhoods data...');
    const neighborhoodsResult = await pool.query('SELECT id, updated_at FROM neighborhoods');
    
    // Get dynamic Airbnb rental pages
    console.log('Fetching Airbnb rental data...');
    const airbnbResult = await pool.query('SELECT id, updated_at FROM airbnb_rentals');
    
    // Start building the sitemap
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Add static pages
    for (const page of staticPages) {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${SITE_URL}/${page}</loc>\n`;
      sitemap += '    <changefreq>weekly</changefreq>\n';
      sitemap += '    <priority>0.8</priority>\n';
      sitemap += '  </url>\n';
    }
    
    // Add property pages
    for (const property of propertiesResult.rows) {
      const lastmod = property.updated_at ? new Date(property.updated_at).toISOString() : new Date().toISOString();
      
      sitemap += '  <url>\n';
      sitemap += `    <loc>${SITE_URL}/properties/${property.id}</loc>\n`;
      sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
      sitemap += '    <changefreq>weekly</changefreq>\n';
      sitemap += '    <priority>0.9</priority>\n';
      sitemap += '  </url>\n';
    }
    
    // Add neighborhood pages
    for (const neighborhood of neighborhoodsResult.rows) {
      const lastmod = neighborhood.updated_at ? new Date(neighborhood.updated_at).toISOString() : new Date().toISOString();
      
      sitemap += '  <url>\n';
      sitemap += `    <loc>${SITE_URL}/neighborhoods/${neighborhood.id}</loc>\n`;
      sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
      sitemap += '    <changefreq>monthly</changefreq>\n';
      sitemap += '    <priority>0.7</priority>\n';
      sitemap += '  </url>\n';
    }
    
    // Add Airbnb rental pages
    for (const rental of airbnbResult.rows) {
      const lastmod = rental.updated_at ? new Date(rental.updated_at).toISOString() : new Date().toISOString();
      
      sitemap += '  <url>\n';
      sitemap += `    <loc>${SITE_URL}/airbnb-rentals/${rental.id}</loc>\n`;
      sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
      sitemap += '    <changefreq>weekly</changefreq>\n';
      sitemap += '    <priority>0.9</priority>\n';
      sitemap += '  </url>\n';
    }
    
    // Close sitemap
    sitemap += '</urlset>';
    
    // Write the sitemap to a file
    const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    fs.writeFileSync(outputPath, sitemap);
    
    console.log(`Sitemap successfully generated and saved to ${outputPath}`);
    console.log(`Total URLs: ${staticPages.length + propertiesResult.rows.length + neighborhoodsResult.rows.length + airbnbResult.rows.length}`);
    
    // Close the database connection
    await pool.end();
    
    return true;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return false;
  }
}

// Run the sitemap generator if this is the main module
if (import.meta.url.endsWith(process.argv[1])) {
  generateSitemap()
    .then(success => {
      if (success) {
        console.log('Sitemap generation completed successfully.');
        process.exit(0);
      } else {
        console.error('Sitemap generation failed.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Uncaught exception during sitemap generation:', error);
      process.exit(1);
    });
}

export { generateSitemap };
