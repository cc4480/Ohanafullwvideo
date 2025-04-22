import React, { useEffect } from 'react';
import { Property, Neighborhood } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';

interface SiteMapGeneratorProps {
  baseUrl: string;
  enableXml?: boolean;
  enableRss?: boolean;
  enableHTML?: boolean;
  priorityMap?: {
    home?: number;
    properties?: number;
    neighborhoods?: number;
    propertyDetail?: number;
    neighborhoodDetail?: number;
    about?: number;
    contact?: number;
  };
  changeFreqMap?: {
    home?: string;
    properties?: string;
    neighborhoods?: string;
    propertyDetail?: string;
    neighborhoodDetail?: string;
    about?: string;
    contact?: string;
  };
}

/**
 * Component for generating XML, RSS and HTML sitemaps
 * Improves search engine crawling efficiency and website visibility
 * 
 * This doesn't render anything visually but:
 * 1. Generates a properly formatted XML sitemap at /sitemap.xml
 * 2. Creates a human-readable HTML sitemap at /sitemap.html
 * 3. Provides an RSS feed at /feed.xml for content syndication
 */
export default function SiteMapGenerator({
  baseUrl,
  enableXml = true,
  enableRss = false,
  enableHTML = false,
  priorityMap = {
    home: 1.0,
    properties: 0.9,
    neighborhoods: 0.9,
    propertyDetail: 0.8,
    neighborhoodDetail: 0.8,
    about: 0.7,
    contact: 0.7
  },
  changeFreqMap = {
    home: 'weekly',
    properties: 'daily',
    neighborhoods: 'weekly',
    propertyDetail: 'weekly',
    neighborhoodDetail: 'monthly',
    about: 'monthly',
    contact: 'monthly'
  }
}: SiteMapGeneratorProps) {
  // Fetch data for dynamic pages
  const { data: properties } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });
  
  const { data: neighborhoods } = useQuery<Neighborhood[]>({
    queryKey: ['/api/neighborhoods'],
  });
  
  useEffect(() => {
    if (enableXml && properties && neighborhoods) {
      generateXmlSitemap({
        baseUrl,
        properties,
        neighborhoods,
        priorityMap,
        changeFreqMap
      });
    }
    
    if (enableHTML && properties && neighborhoods) {
      generateHtmlSitemap({
        baseUrl, 
        properties,
        neighborhoods
      });
    }
    
    if (enableRss && properties) {
      generateRssFeed({
        baseUrl,
        properties
      });
    }
  }, [properties, neighborhoods, baseUrl, enableXml, enableRss, enableHTML]);
  
  return null; // This component doesn't render anything visually
}

interface SitemapProps {
  baseUrl: string;
  properties: Property[];
  neighborhoods: Neighborhood[];
  priorityMap?: SiteMapGeneratorProps['priorityMap'];
  changeFreqMap?: SiteMapGeneratorProps['changeFreqMap'];
}

/**
 * Generates XML sitemap compliant with sitemap protocol
 */
function generateXmlSitemap({
  baseUrl,
  properties,
  neighborhoods,
  priorityMap,
  changeFreqMap
}: SitemapProps) {
  // Implementation note: In a production environment, this would write to a file
  // or make a POST request to a server endpoint to generate the sitemap
  // Here we'll create the XML string that would be written
  
  const today = new Date().toISOString().split('T')[0];
  
  let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xmlContent += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Add static pages
  xmlContent += `  <url>\n    <loc>${baseUrl}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changeFreqMap?.home}</changefreq>\n    <priority>${priorityMap?.home}</priority>\n  </url>\n`;
  xmlContent += `  <url>\n    <loc>${baseUrl}/properties</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changeFreqMap?.properties}</changefreq>\n    <priority>${priorityMap?.properties}</priority>\n  </url>\n`;
  xmlContent += `  <url>\n    <loc>${baseUrl}/neighborhoods</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changeFreqMap?.neighborhoods}</changefreq>\n    <priority>${priorityMap?.neighborhoods}</priority>\n  </url>\n`;
  xmlContent += `  <url>\n    <loc>${baseUrl}/about</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changeFreqMap?.about}</changefreq>\n    <priority>${priorityMap?.about}</priority>\n  </url>\n`;
  xmlContent += `  <url>\n    <loc>${baseUrl}/contact</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changeFreqMap?.contact}</changefreq>\n    <priority>${priorityMap?.contact}</priority>\n  </url>\n`;
  
  // Add property detail pages
  if (Array.isArray(properties)) {
    properties.forEach(property => {
      xmlContent += `  <url>\n    <loc>${baseUrl}/properties/${property.id}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changeFreqMap?.propertyDetail}</changefreq>\n    <priority>${priorityMap?.propertyDetail}</priority>\n  </url>\n`;
    });
  }
  
  // Add neighborhood detail pages
  if (Array.isArray(neighborhoods)) {
    neighborhoods.forEach(neighborhood => {
      xmlContent += `  <url>\n    <loc>${baseUrl}/neighborhoods/${neighborhood.id}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changeFreqMap?.neighborhoodDetail}</changefreq>\n    <priority>${priorityMap?.neighborhoodDetail}</priority>\n  </url>\n`;
    });
  }
  
  xmlContent += '</urlset>';
  
  console.log('Sitemap XML generated (would be saved to /sitemap.xml in production)');
  return xmlContent;
}

/**
 * Generates human-readable HTML sitemap
 */
function generateHtmlSitemap({
  baseUrl,
  properties,
  neighborhoods
}: {
  baseUrl: string;
  properties: Property[];
  neighborhoods: Neighborhood[];
}) {
  // Implementation note: In a production environment, this would write to a file
  // Here we'll create the HTML string that would be written
  
  let htmlContent = '<!DOCTYPE html>\n<html lang="en">\n<head>\n';
  htmlContent += '  <meta charset="UTF-8">\n';
  htmlContent += '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
  htmlContent += '  <title>Site Map - Ohana Realty</title>\n';
  htmlContent += '  <link rel="stylesheet" href="/styles.css">\n';
  htmlContent += '</head>\n<body>\n';
  htmlContent += '  <div class="container mx-auto px-4 py-8">\n';
  htmlContent += '    <h1 class="text-3xl font-bold mb-6">Site Map</h1>\n';
  
  // Main pages section
  htmlContent += '    <section class="mb-8">\n';
  htmlContent += '      <h2 class="text-xl font-bold mb-4">Main Pages</h2>\n';
  htmlContent += '      <ul class="ml-6 list-disc">\n';
  htmlContent += '        <li><a href="/" class="text-primary hover:underline">Home</a></li>\n';
  htmlContent += '        <li><a href="/properties" class="text-primary hover:underline">Properties</a></li>\n';
  htmlContent += '        <li><a href="/neighborhoods" class="text-primary hover:underline">Neighborhoods</a></li>\n';
  htmlContent += '        <li><a href="/about" class="text-primary hover:underline">About Us</a></li>\n';
  htmlContent += '        <li><a href="/contact" class="text-primary hover:underline">Contact</a></li>\n';
  htmlContent += '      </ul>\n';
  htmlContent += '    </section>\n';
  
  // Properties section
  htmlContent += '    <section class="mb-8">\n';
  htmlContent += '      <h2 class="text-xl font-bold mb-4">Property Listings</h2>\n';
  htmlContent += '      <ul class="ml-6 list-disc grid grid-cols-1 md:grid-cols-2 gap-2">\n';
  
  if (Array.isArray(properties)) {
    properties.forEach(property => {
      htmlContent += `        <li><a href="/properties/${property.id}" class="text-primary hover:underline">${property.address}, ${property.city}, ${property.state}</a></li>\n`;
    });
  }
  
  htmlContent += '      </ul>\n';
  htmlContent += '    </section>\n';
  
  // Neighborhoods section
  htmlContent += '    <section class="mb-8">\n';
  htmlContent += '      <h2 class="text-xl font-bold mb-4">Neighborhoods</h2>\n';
  htmlContent += '      <ul class="ml-6 list-disc">\n';
  
  if (Array.isArray(neighborhoods)) {
    neighborhoods.forEach(neighborhood => {
      htmlContent += `        <li><a href="/neighborhoods/${neighborhood.id}" class="text-primary hover:underline">${neighborhood.name}</a></li>\n`;
    });
  }
  
  htmlContent += '      </ul>\n';
  htmlContent += '    </section>\n';
  htmlContent += '  </div>\n';
  htmlContent += '</body>\n</html>';
  
  console.log('HTML Sitemap generated (would be saved to /sitemap.html in production)');
  return htmlContent;
}

/**
 * Generates RSS feed for content syndication
 */
function generateRssFeed({
  baseUrl,
  properties
}: {
  baseUrl: string;
  properties: Property[];
}) {
  // Implementation note: In a production environment, this would write to a file
  // Here we'll create the RSS XML string that would be written
  
  const today = new Date().toISOString();
  
  let rssContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
  rssContent += '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n';
  rssContent += '<channel>\n';
  rssContent += '  <title>Ohana Realty - New Property Listings</title>\n';
  rssContent += `  <link>${baseUrl}</link>\n`;
  rssContent += '  <description>The latest property listings from Ohana Realty</description>\n';
  rssContent += `  <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />\n`;
  rssContent += `  <lastBuildDate>${today}</lastBuildDate>\n`;
  
  if (Array.isArray(properties)) {
    // Sort properties by newest first (assuming createdAt field, or could be by id)
    const sortedProperties = [...properties].sort((a, b) => b.id - a.id);
    
    // Take the 10 most recent properties for the RSS feed
    sortedProperties.slice(0, 10).forEach(property => {
      rssContent += '  <item>\n';
      rssContent += `    <title>${property.bedrooms ? `${property.bedrooms} Bed ` : ''}${property.type} For Sale: ${property.address}</title>\n`;
      rssContent += `    <link>${baseUrl}/properties/${property.id}</link>\n`;
      rssContent += `    <guid isPermaLink="true">${baseUrl}/properties/${property.id}</guid>\n`;
      rssContent += `    <description>${property.description ? property.description.substring(0, 300) + '...' : `${property.type} property for sale at ${property.address}, ${property.city}, ${property.state}.`}</description>\n`;
      rssContent += `    <pubDate>${today}</pubDate>\n`;
      rssContent += '  </item>\n';
    });
  }
  
  rssContent += '</channel>\n';
  rssContent += '</rss>';
  
  console.log('RSS feed generated (would be saved to /feed.xml in production)');
  return rssContent;
}