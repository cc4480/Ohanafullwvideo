import { useEffect, useState } from 'react';
import { Property, Neighborhood } from '@shared/schema';

interface SiteMapURL {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

interface SiteMapGeneratorProps {
  properties: Property[];
  neighborhoods: Neighborhood[];
  baseUrl: string;
  onGenerateComplete?: (xmlContent: string) => void;
}

/**
 * Advanced sitemap generator component for real estate websites
 * This component will generate an XML sitemap in memory with proper prioritization
 * and change frequency settings optimized for search engines
 */
export default function SiteMapGenerator({
  properties,
  neighborhoods,
  baseUrl,
  onGenerateComplete
}: SiteMapGeneratorProps) {
  const [xmlContent, setXmlContent] = useState<string>('');
  
  useEffect(() => {
    const generateSitemap = () => {
      // Define all URLs for the sitemap
      const urls: SiteMapURL[] = [];
      
      // Add main pages with high priority
      urls.push({ 
        url: baseUrl, 
        changefreq: 'weekly', 
        priority: 1.0 
      });
      
      urls.push({ 
        url: `${baseUrl}/properties`, 
        changefreq: 'daily', 
        priority: 0.9 
      });
      
      urls.push({ 
        url: `${baseUrl}/neighborhoods`, 
        changefreq: 'weekly', 
        priority: 0.8 
      });
      
      urls.push({ 
        url: `${baseUrl}/about`, 
        changefreq: 'monthly', 
        priority: 0.7 
      });
      
      urls.push({ 
        url: `${baseUrl}/contact`, 
        changefreq: 'monthly', 
        priority: 0.7 
      });
      
      // Add property detail pages
      properties.forEach(property => {
        // Property details have high priority to ensure listing pages are crawled first
        urls.push({
          url: `${baseUrl}/properties/${property.id}`,
          lastmod: new Date().toISOString(), // Use current date since updatedAt doesn't exist
          changefreq: 'weekly',
          priority: 0.8
        });
      });
      
      // Add neighborhood pages
      neighborhoods.forEach(neighborhood => {
        // Neighborhood pages have moderate priority
        urls.push({
          url: `${baseUrl}/neighborhoods/${neighborhood.id}`,
          changefreq: 'weekly',
          priority: 0.7
        });
      });
      
      // Filter properties by type for specialized property pages
      const residentialProperties = properties.filter(p => p.type === 'RESIDENTIAL');
      const commercialProperties = properties.filter(p => p.type === 'COMMERCIAL');
      const landProperties = properties.filter(p => p.type === 'LAND');
      
      // Add filter pages
      if(residentialProperties.length > 0) {
        urls.push({
          url: `${baseUrl}/properties?type=residential`,
          changefreq: 'daily',
          priority: 0.7
        });
      }
      
      if(commercialProperties.length > 0) {
        urls.push({
          url: `${baseUrl}/properties?type=commercial`,
          changefreq: 'daily',
          priority: 0.7
        });
      }
      
      if(landProperties.length > 0) {
        urls.push({
          url: `${baseUrl}/properties?type=land`,
          changefreq: 'daily',
          priority: 0.7
        });
      }
      
      // Get unique cities from properties for city-based filter pages
      const citySet = new Set<string>();
      properties.forEach(p => p.city && citySet.add(p.city));
      const cities = Array.from(citySet);
      
      cities.forEach(city => {
        if (city) {
          urls.push({
            url: `${baseUrl}/properties?city=${encodeURIComponent(city)}`,
            changefreq: 'weekly',
            priority: 0.6
          });
        }
      });

      // Generate XML content
      const xml = generateXML(urls);
      setXmlContent(xml);
      
      // Call the completion handler if provided
      if (onGenerateComplete) {
        onGenerateComplete(xml);
      }
    };
    
    // Generate the sitemap when the component mounts or when properties/neighborhoods change
    generateSitemap();
  }, [properties, neighborhoods, baseUrl, onGenerateComplete]);
  
  // Function to generate the XML content for the sitemap
  const generateXML = (urls: SiteMapURL[]): string => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    urls.forEach(item => {
      xml += '  <url>\n';
      xml += `    <loc>${item.url}</loc>\n`;
      
      if (item.lastmod) {
        xml += `    <lastmod>${item.lastmod}</lastmod>\n`;
      }
      
      if (item.changefreq) {
        xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
      }
      
      if (item.priority !== undefined) {
        xml += `    <priority>${item.priority.toFixed(1)}</priority>\n`;
      }
      
      xml += '  </url>\n';
    });
    
    xml += '</urlset>';
    return xml;
  };
  
  // This component doesn't render anything visible
  return null;
}

/**
 * Additional function for generating an XML sitemap string directly
 * This can be used in an API endpoint to serve a dynamic sitemap
 */
export function generateSitemapXML(props: SiteMapGeneratorProps): string {
  const urls: SiteMapURL[] = [];
  const { properties, neighborhoods, baseUrl } = props;
  
  // Add main pages with high priority
  urls.push({ 
    url: baseUrl, 
    changefreq: 'weekly', 
    priority: 1.0 
  });
  
  urls.push({ 
    url: `${baseUrl}/properties`, 
    changefreq: 'daily', 
    priority: 0.9 
  });
  
  urls.push({ 
    url: `${baseUrl}/neighborhoods`, 
    changefreq: 'weekly', 
    priority: 0.8 
  });
  
  urls.push({ 
    url: `${baseUrl}/about`, 
    changefreq: 'monthly', 
    priority: 0.7 
  });
  
  urls.push({ 
    url: `${baseUrl}/contact`, 
    changefreq: 'monthly', 
    priority: 0.7 
  });
  
  // Add property detail pages
  properties.forEach(property => {
    // Property details have high priority to ensure listing pages are crawled first
    urls.push({
      url: `${baseUrl}/properties/${property.id}`,
      lastmod: new Date().toISOString(), // Use current date since updatedAt doesn't exist
      changefreq: 'weekly',
      priority: 0.8
    });
  });
  
  // Add neighborhood pages
  neighborhoods.forEach(neighborhood => {
    // Neighborhood pages have moderate priority
    urls.push({
      url: `${baseUrl}/neighborhoods/${neighborhood.id}`,
      changefreq: 'weekly',
      priority: 0.7
    });
  });
  
  // Generate XML content
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
  
  urls.forEach(item => {
    xml += '  <url>\n';
    xml += `    <loc>${item.url}</loc>\n`;
    
    if (item.lastmod) {
      xml += `    <lastmod>${item.lastmod}</lastmod>\n`;
    }
    
    if (item.changefreq) {
      xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
    }
    
    if (item.priority !== undefined) {
      xml += `    <priority>${item.priority.toFixed(1)}</priority>\n`;
    }
    
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  return xml;
}