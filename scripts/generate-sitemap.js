// Sitemap Generator for Ohana Realty
// This script generates a sitemap.xml file based on current properties and pages

const fs = require('fs');
const path = require('path');
const { Pool } = require('@neondatabase/serverless');

// Base URL of the website
const SITE_URL = process.env.SITE_URL || 'https://ohanarealty.com';

// Static pages that should be included in the sitemap
const STATIC_PAGES = [
  { url: '', priority: 1.0, changefreq: 'weekly' },         // Home page
  { url: 'about', priority: 0.8, changefreq: 'monthly' },    // About page
  { url: 'contact', priority: 0.8, changefreq: 'monthly' },  // Contact page
  { url: 'properties', priority: 0.9, changefreq: 'daily' }, // Properties listing
  { url: 'rentals', priority: 0.9, changefreq: 'daily' },    // Rentals listing
];

async function generateSitemap() {
  console.log('Generating sitemap.xml...');
  
  try {
    // Connect to the database
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined');
    }
    
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    // Fetch all properties from the database
    const propertyResult = await pool.query('SELECT id, address, city, state, "createdAt", "updatedAt" FROM properties WHERE status = \'ACTIVE\'');
    const properties = propertyResult.rows;
    
    // Fetch all rentals from the database
    const rentalResult = await pool.query('SELECT id, title, address, city, state, "createdAt", "updatedAt" FROM airbnb_rentals');
    const rentals = rentalResult.rows;
    
    // Fetch all neighborhoods from the database
    const neighborhoodResult = await pool.query('SELECT id, name, "createdAt", "updatedAt" FROM neighborhoods');
    const neighborhoods = neighborhoodResult.rows;
    
    // Start building the XML content
    let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xmlContent += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Add static pages
    STATIC_PAGES.forEach(page => {
      xmlContent += '  <url>\n';
      xmlContent += `    <loc>${SITE_URL}/${page.url}</loc>\n`;
      xmlContent += '    <lastmod>' + new Date().toISOString() + '</lastmod>\n';
      xmlContent += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xmlContent += `    <priority>${page.priority}</priority>\n`;
      xmlContent += '  </url>\n';
    });
    
    // Add properties
    properties.forEach(property => {
      const lastMod = property.updatedAt || property.createdAt || new Date();
      
      xmlContent += '  <url>\n';
      xmlContent += `    <loc>${SITE_URL}/properties/${property.id}</loc>\n`;
      xmlContent += '    <lastmod>' + new Date(lastMod).toISOString() + '</lastmod>\n';
      xmlContent += '    <changefreq>weekly</changefreq>\n';
      xmlContent += '    <priority>0.7</priority>\n';
      xmlContent += '  </url>\n';
    });
    
    // Add rentals
    rentals.forEach(rental => {
      const lastMod = rental.updatedAt || rental.createdAt || new Date();
      
      xmlContent += '  <url>\n';
      xmlContent += `    <loc>${SITE_URL}/rentals/${rental.id}</loc>\n`;
      xmlContent += '    <lastmod>' + new Date(lastMod).toISOString() + '</lastmod>\n';
      xmlContent += '    <changefreq>weekly</changefreq>\n';
      xmlContent += '    <priority>0.7</priority>\n';
      xmlContent += '  </url>\n';
    });
    
    // Add neighborhoods
    neighborhoods.forEach(neighborhood => {
      const lastMod = neighborhood.updatedAt || neighborhood.createdAt || new Date();
      
      xmlContent += '  <url>\n';
      xmlContent += `    <loc>${SITE_URL}/neighborhoods/${neighborhood.id}</loc>\n`;
      xmlContent += '    <lastmod>' + new Date(lastMod).toISOString() + '</lastmod>\n';
      xmlContent += '    <changefreq>monthly</changefreq>\n';
      xmlContent += '    <priority>0.6</priority>\n';
      xmlContent += '  </url>\n';
    });
    
    // Close the XML content
    xmlContent += '</urlset>';
    
    // Write to file
    fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), xmlContent);
    
    console.log(`Sitemap generated with ${STATIC_PAGES.length + properties.length + rentals.length + neighborhoods.length} URLs`);
    console.log('Sitemap saved to public/sitemap.xml');
    
    // Close the database connection
    await pool.end();
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the sitemap generator
generateSitemap();
