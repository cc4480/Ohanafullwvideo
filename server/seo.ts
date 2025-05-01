import express from 'express';
import { Express } from 'express';
import { storage } from './storage';

/**
 * Enhanced SEO Functions
 * Provides advanced SEO capabilities for improved search engine visibility
 */
export function configureSEO(app: Express) {
  // Generate dynamic schema.org structured data for properties
  app.get('/api/schema/:type/:id', async (req, res) => {
    try {
      const { type, id } = req.params;
      let structuredData;
      
      // Generate different structured data based on content type
      if (type === 'property' && id) {
        const property = await storage.getProperty(parseInt(id));
        if (!property) {
          return res.status(404).json({ error: 'Property not found' });
        }
        
        // Create RealEstateListing structured data
        structuredData = {
          "@context": "https://schema.org",
          "@type": "RealEstateListing",
          "name": `${property.address}, ${property.city}, ${property.state} ${property.zipCode}`,
          "description": property.description,
          "datePosted": new Date().toISOString(),
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${req.protocol}://${req.get('host')}/properties/${property.id}`
          },
          "image": property.images && property.images.length > 0 ? property.images : [],
          "offers": {
            "@type": "Offer",
            "price": property.price,
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          },
          "address": {
            "@type": "PostalAddress",
            "streetAddress": property.address,
            "addressLocality": property.city,
            "addressRegion": property.state,
            "postalCode": property.zipCode,
            "addressCountry": "US"
          },
          "numberOfRooms": property.bedrooms || 0,
          "numberOfBathroomsTotal": property.bathrooms || 0,
          "floorSize": {
            "@type": "QuantitativeValue",
            "value": property.squareFeet || 0,
            "unitCode": "FTK"
          },
          "geo": property.lat && property.lng ? {
            "@type": "GeoCoordinates",
            "latitude": property.lat,
            "longitude": property.lng
          } : undefined
        };
      } else if (type === 'neighborhood' && id) {
        const neighborhood = await storage.getNeighborhood(parseInt(id));
        if (!neighborhood) {
          return res.status(404).json({ error: 'Neighborhood not found' });
        }
        
        // Create Place structured data for neighborhood
        structuredData = {
          "@context": "https://schema.org",
          "@type": "Place",
          "name": neighborhood.name,
          "description": neighborhood.description,
          "image": neighborhood.image,
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 27.506, // Default Laredo coords if not available
            "longitude": -99.507
          }
        };
      } else if (type === 'company') {
        // Generate organization data
        structuredData = {
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          "name": "Ohana Realty",
          "url": `${req.protocol}://${req.get('host')}`,
          "logo": `${req.protocol}://${req.get('host')}/logo.png`,
          "description": "Ohana Realty offers premium real estate services in Laredo, TX with a focus on residential and commercial properties.",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "1300 Matamoros St",
            "addressLocality": "Laredo",
            "addressRegion": "TX",
            "postalCode": "78040",
            "addressCountry": "US"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 27.506,
            "longitude": -99.507
          },
          "telephone": "+19561234567",
          "sameAs": [
            "https://www.facebook.com/ohanarealty",
            "https://www.instagram.com/ohanarealty"
          ],
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "opens": "09:00",
              "closes": "18:00"
            },
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Saturday"],
              "opens": "10:00",
              "closes": "15:00"
            }
          ]
        };
      }
      
      if (!structuredData) {
        return res.status(400).json({ error: 'Invalid schema type or ID' });
      }
      
      res.setHeader('Content-Type', 'application/ld+json');
      res.send(JSON.stringify(structuredData));
    } catch (error) {
      console.error('Error generating structured data:', error);
      res.status(500).json({ error: 'Failed to generate structured data' });
    }
  });
  
  // Enhanced sitemap generator route
  app.get('/sitemap.xml', async (req, res) => {
    try {
      // Get all properties and neighborhoods
      const properties = await storage.getProperties();
      const neighborhoods = await storage.getNeighborhoods();
      const airbnbRentals = await storage.getAirbnbRentals();
      
      // Base URL of the website
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      
      // Generate XML sitemap
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
      xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n';
      xml += '        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n';
      
      // Add static pages with today's date
      const today = new Date().toISOString().split('T')[0];
      const staticPages = ['', 'properties', 'about', 'contact', 'neighborhoods', 'airbnb'];
      
      for (const page of staticPages) {
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/${page}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>1.0</priority>\n';
        xml += '  </url>\n';
      }
      
      // Add property detail pages
      for (const property of properties) {
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/properties/${property.id}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += '    <changefreq>daily</changefreq>\n';
        xml += '    <priority>0.8</priority>\n';
        
        // Add image tags if property has images
        if (property.images && property.images.length > 0) {
          for (const imageUrl of property.images) {
            xml += '    <image:image>\n';
            xml += `      <image:loc>${imageUrl}</image:loc>\n`;
            xml += `      <image:title>${property.address}</image:title>\n`;
            xml += `      <image:caption>Property at ${property.address}, ${property.city}, ${property.state}</image:caption>\n`;
            xml += '    </image:image>\n';
          }
        }
        
        xml += '  </url>\n';
      }
      
      // Add neighborhood detail pages
      for (const neighborhood of neighborhoods) {
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/neighborhoods/${neighborhood.id}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.7</priority>\n';
        
        // Add image tag for neighborhood image
        if (neighborhood.image) {
          xml += '    <image:image>\n';
          xml += `      <image:loc>${neighborhood.image}</image:loc>\n`;
          xml += `      <image:title>${neighborhood.name}</image:title>\n`;
          xml += `      <image:caption>${neighborhood.name} - ${neighborhood.description.substring(0, 100)}...</image:caption>\n`;
          xml += '    </image:image>\n';
        }
        
        xml += '  </url>\n';
      }
      
      // Add Airbnb rental pages
      for (const rental of airbnbRentals) {
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/airbnb/${rental.id}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += '    <changefreq>daily</changefreq>\n';
        xml += '    <priority>0.8</priority>\n';
        
        // Add image tags if rental has images
        if (rental.images && rental.images.length > 0) {
          for (const imageUrl of rental.images) {
            xml += '    <image:image>\n';
            xml += `      <image:loc>${imageUrl}</image:loc>\n`;
            xml += `      <image:title>${rental.title}</image:title>\n`;
            xml += `      <image:caption>${rental.title} - ${rental.description.substring(0, 100)}...</image:caption>\n`;
            xml += '    </image:image>\n';
          }
        }
        
        xml += '  </url>\n';
      }
      
      // Add video sitemap entry for home page video
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/</loc>\n`;
      xml += '    <video:video>\n';
      xml += '      <video:thumbnail_loc>https://ohanarealty.com/video-thumbnail.jpg</video:thumbnail_loc>\n';
      xml += '      <video:title>Discover Laredo Real Estate with Ohana Realty</video:title>\n';
      xml += '      <video:description>Tour the finest properties in Laredo with our immersive real estate video showcase.</video:description>\n';
      xml += '      <video:content_loc>https://ohanarealty.com/videos/showcase.mp4</video:content_loc>\n';
      xml += '      <video:duration>120</video:duration>\n';
      xml += '      <video:publication_date>2023-01-01T12:00:00+00:00</video:publication_date>\n';
      xml += '      <video:family_friendly>yes</video:family_friendly>\n';
      xml += '      <video:requires_subscription>no</video:requires_subscription>\n';
      xml += '    </video:video>\n';
      xml += '  </url>\n';
      
      xml += '</urlset>';
      
      // Send XML response
      res.setHeader('Content-Type', 'application/xml');
      res.send(xml);
    } catch (error) {
      console.error('Error generating sitemap:', error);
      res.status(500).send('Error generating sitemap');
    }
  });
  
  // Add dynamic robots.txt with sitemap reference
  app.get('/robots.txt', (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const robotsTxt = `# robots.txt for Ohana Realty

User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /private/

# Allow search engines to index images and media
Allow: /images/
Allow: /videos/
`;
    
    res.setHeader('Content-Type', 'text/plain');
    res.send(robotsTxt);
  });
  
  console.log('Enhanced SEO routes configured');
}
