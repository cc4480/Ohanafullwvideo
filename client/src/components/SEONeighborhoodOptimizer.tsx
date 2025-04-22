import React from 'react';
import { Helmet } from 'react-helmet';

interface Neighborhood {
  id: number;
  name: string;
  description: string;
  city: string;
  state: string;
  image?: string;
  amenities?: string[];
  schools?: string[];
  stats?: {
    medianHomePrice?: number;
    population?: number;
    walkScore?: number;
  };
}

interface SEONeighborhoodOptimizerProps {
  /**
   * Neighborhood data
   */
  neighborhood: Neighborhood;
  
  /**
   * Base website URL
   */
  baseUrl: string;
  
  /**
   * Additional keywords to target for this neighborhood
   */
  additionalKeywords?: string[];
  
  /**
   * Whether to include structured data
   */
  includeStructuredData?: boolean;
}

/**
 * Specialized SEO component for neighborhood pages that implements
 * location-based keyword optimization and structured data to boost
 * local search rankings.
 */
export default function SEONeighborhoodOptimizer({
  neighborhood,
  baseUrl,
  additionalKeywords = [],
  includeStructuredData = true
}: SEONeighborhoodOptimizerProps) {
  
  // Generate location-based keywords and phrases
  const generateLocationKeywords = () => {
    const { name, city, state } = neighborhood;
    
    // Basic location keywords
    const keywords = [
      name,
      `${name} ${city}`,
      `${name} ${city} ${state}`,
      `${name} neighborhood`,
      `${name} real estate`,
      `${name} homes for sale`,
      `${name} properties`,
      `living in ${name}`,
      `${name} home values`,
      `${name} schools`,
      `${name} amenities`
    ];
    
    // Add variations with city
    keywords.push(`${city} ${name} neighborhood`);
    keywords.push(`${city} ${name} real estate`);
    keywords.push(`${city} ${name} homes`);
    
    // Add amenity-based keywords if available
    if (neighborhood.amenities && neighborhood.amenities.length > 0) {
      neighborhood.amenities.forEach(amenity => {
        keywords.push(`${name} ${amenity}`);
        keywords.push(`${name} near ${amenity}`);
      });
    }
    
    // Add school-based keywords if available
    if (neighborhood.schools && neighborhood.schools.length > 0) {
      neighborhood.schools.forEach(school => {
        keywords.push(`${name} near ${school}`);
        keywords.push(`${school} ${name}`);
      });
    }
    
    // Add pricing related keywords if median price available
    if (neighborhood.stats?.medianHomePrice) {
      const priceK = Math.round(neighborhood.stats.medianHomePrice / 1000);
      keywords.push(`${name} ${priceK}k homes`);
      keywords.push(`${name} home prices`);
    }
    
    // Add additional provided keywords
    keywords.push(...additionalKeywords);
    
    // Return unique keywords
    return Array.from(new Set(keywords));
  };
  
  // Create a rich meta description optimized for the neighborhood
  const generateMetaDescription = () => {
    const { name, city, state, description } = neighborhood;
    
    let meta = `Explore ${name} in ${city}, ${state}. `;
    
    // Add snippet of description if available
    if (description) {
      const shortDescription = description.length > 100 
        ? `${description.substring(0, 100)}...` 
        : description;
      meta += shortDescription + ' ';
    }
    
    // Add amenities if available
    if (neighborhood.amenities && neighborhood.amenities.length > 0) {
      meta += `Featuring ${neighborhood.amenities.slice(0, 3).join(', ')}. `;
    }
    
    // Add pricing if available
    if (neighborhood.stats?.medianHomePrice) {
      meta += `Homes from ${new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        maximumFractionDigits: 0 
      }).format(neighborhood.stats.medianHomePrice)}. `;
    }
    
    meta += 'Find your perfect home with Ohana Realty today.';
    
    return meta;
  };
  
  // Create neighborhood structured data
  const createStructuredData = () => {
    if (!includeStructuredData) return null;
    
    return {
      "@context": "https://schema.org",
      "@type": "Place",
      "name": neighborhood.name,
      "description": neighborhood.description,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": neighborhood.city,
        "addressRegion": neighborhood.state
      },
      "photo": neighborhood.image ? neighborhood.image : undefined,
      "url": `${baseUrl}/neighborhoods/${neighborhood.id}`,
      "containedInPlace": {
        "@type": "City",
        "name": neighborhood.city,
        "containedInPlace": {
          "@type": "State",
          "name": neighborhood.state
        }
      }
    };
  };
  
  const locationKeywords = generateLocationKeywords();
  const metaDescription = generateMetaDescription();
  const structuredData = createStructuredData();
  
  return (
    <Helmet>
      {/* Specialized meta tags for local search optimization */}
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={locationKeywords.join(', ')} />
      
      {/* Place-specific meta tags */}
      <meta property="place:location:latitude" content="27.5306" />
      <meta property="place:location:longitude" content="-99.4803" />
      <meta property="place:neighborhood" content={neighborhood.name} />
      <meta property="place:locality" content={neighborhood.city} />
      <meta property="place:region" content={neighborhood.state} />
      
      {/* Structured data for rich results */}
      {includeStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}