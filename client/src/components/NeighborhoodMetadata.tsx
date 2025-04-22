import React from 'react';
import { Helmet } from 'react-helmet';
import SocialShareMetadata from './SocialShareMetadata';
import CanonicalURLs from './CanonicalURLs';
import { Neighborhood } from '@shared/schema';

interface NeighborhoodMetadataProps {
  /**
   * The neighborhood data object
   */
  neighborhood: Neighborhood;
  
  /**
   * The base URL of the website
   */
  baseUrl: string;
  
  /**
   * Optional geographic coordinates
   */
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  
  /**
   * Optional array of amenities or POIs in the neighborhood
   */
  amenities?: Array<{
    name: string;
    type: string;
    description?: string;
  }>;
  
  /**
   * Optional statistics about the neighborhood
   */
  statistics?: {
    populationCount?: number;
    crimeRate?: string;
    walkScore?: number;
    transitScore?: number;
    bikeScore?: number;
    medianHomeValue?: number;
    medianRent?: number;
  };
  
  /**
   * Optional array of schools in the neighborhood
   */
  schools?: Array<{
    name: string;
    type: 'Elementary' | 'Middle' | 'High' | 'Private' | 'Charter';
    rating?: number;
    grades?: string;
    address?: string;
  }>;
}

/**
 * Comprehensive SEO metadata component for neighborhood/region pages
 * Includes specialized schema.org Place structured data along with
 * geo-specific metadata and social sharing optimizations
 */
export default function NeighborhoodMetadata({
  neighborhood,
  baseUrl,
  coordinates,
  amenities = [],
  statistics = {},
  schools = []
}: NeighborhoodMetadataProps) {
  // Create SEO-optimized page title
  const title = `${neighborhood.name} Neighborhood Guide | Ohana Realty`;
  
  // Create optimized meta description
  const description = `Explore ${neighborhood.name}, one of the best neighborhoods in the area. ${neighborhood.description.slice(0, 120)}${neighborhood.description.length > 120 ? '...' : ''}`;
  
  // Neighborhood URL
  const url = `${baseUrl}/neighborhoods/${neighborhood.id}`;
  
  // Main image for the neighborhood
  const mainImage = neighborhood.image || `${baseUrl}/placeholder-neighborhood.jpg`;
  
  // Generate keywords
  const keywords = [
    `${neighborhood.name}`,
    `${neighborhood.name} real estate`,
    `homes for sale in ${neighborhood.name}`,
    `${neighborhood.name} neighborhood`,
    `${neighborhood.name} community`,
    `living in ${neighborhood.name}`
  ];
  
  // Current date for timestamps
  const currentDate = new Date().toISOString();
  
  // Structured data for the neighborhood as a Place
  const placeStructuredData = {
    "@context": "https://schema.org",
    "@type": "Place",
    "@id": `${url}#place`,
    "name": neighborhood.name,
    "description": neighborhood.description,
    "url": url,
    "image": mainImage,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    ...(coordinates && {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": coordinates.latitude,
        "longitude": coordinates.longitude
      }
    }),
    "publicAccess": true,
    "amenityFeature": amenities.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity.name,
      "value": true
    }))
  };
  
  // Structured data for schools in the neighborhood
  const schoolsStructuredData = schools.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": schools.map((school, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "EducationalOrganization",
        "name": school.name,
        "description": `${school.type} School${school.grades ? ` serving grades ${school.grades}` : ''}`,
        ...(school.rating && { "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": school.rating,
          "bestRating": 10
        }}),
        ...(school.address && { "address": {
          "@type": "PostalAddress",
          "streetAddress": school.address
        }})
      }
    }))
  } : null;
  
  // Structured data for neighborhood statistics
  const statsStructuredData = Object.keys(statistics).length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": Object.entries(statistics).map(([key, value], index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "PropertyValue",
        "name": key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        "value": value
      }
    }))
  } : null;
  
  return (
    <>
      {/* Basic metadata */}
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords.join(', ')} />
        
        {/* News Article compatibility for Google Discover */}
        <meta name="article:published_time" content={currentDate} />
        <meta name="article:modified_time" content={currentDate} />
        
        {/* Geo metadata for local search */}
        {coordinates && (
          <>
            <meta name="geo.position" content={`${coordinates.latitude};${coordinates.longitude}`} />
            <meta name="geo.placename" content={neighborhood.name} />
            <meta name="geo.region" content="US-TX" />
          </>
        )}
        
        {/* Structured data JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(placeStructuredData)}
        </script>
        
        {schoolsStructuredData && (
          <script type="application/ld+json">
            {JSON.stringify(schoolsStructuredData)}
          </script>
        )}
        
        {statsStructuredData && (
          <script type="application/ld+json">
            {JSON.stringify(statsStructuredData)}
          </script>
        )}
      </Helmet>
      
      {/* Canonical URL */}
      <CanonicalURLs baseUrl={baseUrl} />
      
      {/* Social sharing metadata */}
      <SocialShareMetadata
        title={title}
        description={description}
        url={url}
        image={mainImage}
        imageAlt={`${neighborhood.name} Neighborhood`}
        type="article"
        siteName="Ohana Realty"
        publishedTime={currentDate}
        modifiedTime={currentDate}
        tags={keywords}
        section="Neighborhoods"
      />
    </>
  );
}