import React from 'react';
import { Helmet } from 'react-helmet';

interface BusinessLocation {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

interface BusinessHours {
  dayOfWeek: string; // 'Monday', 'Tuesday', etc.
  opens: string; // '09:00'
  closes: string; // '17:00'
}

interface LocalBusinessSchemaProps {
  /**
   * Business name
   */
  name: string;
  
  /**
   * Business description
   */
  description: string;
  
  /**
   * Business type (specific Schema.org business type)
   */
  businessType?: 'RealEstateAgent' | 'RealEstateBusiness' | 'ProfessionalService' | 'LocalBusiness';
  
  /**
   * Business location information
   */
  location: BusinessLocation;
  
  /**
   * Website URL
   */
  url: string;
  
  /**
   * Logo URL
   */
  logo: string;
  
  /**
   * Main image URL
   */
  image?: string;
  
  /**
   * Phone number with country code (e.g., +12125551234)
   */
  telephone: string;
  
  /**
   * Email address
   */
  email: string;
  
  /**
   * Price range ($, $$, $$$, or $$$$)
   */
  priceRange?: string;
  
  /**
   * Overall rating (1-5)
   */
  rating?: number;
  
  /**
   * Business hours
   */
  hours?: BusinessHours[];
  
  /**
   * Areas served
   */
  areasServed?: string[];
  
  /**
   * Services offered
   */
  services?: string[];
  
  /**
   * Year established
   */
  yearEstablished?: number;
  
  /**
   * Social media profiles
   */
  socialLinks?: string[];
}

/**
 * Comprehensive Schema.org LocalBusiness structured data component 
 * for enhanced local SEO performance
 */
export default function LocalBusinessSchema({
  name,
  description,
  businessType = 'RealEstateAgent',
  location,
  url,
  logo,
  image,
  telephone,
  email,
  priceRange = '$$$',
  rating,
  hours = [],
  areasServed = [],
  services = [],
  yearEstablished,
  socialLinks = []
}: LocalBusinessSchemaProps) {
  
  // Format opening hours for structured data
  const formatOpeningHours = (hours: BusinessHours[]) => {
    return hours.map(hour => {
      // First 2 letters of day + capitalizing
      const dayCode = hour.dayOfWeek.substring(0, 2).toUpperCase();
      return `${dayCode} ${hour.opens}-${hour.closes}`;
    });
  };
  
  // Create the structured data object
  const structuredData = {
    "@context": "https://schema.org",
    "@type": businessType,
    "@id": `${url}#business`,
    "name": name,
    "description": description,
    "url": url,
    "logo": {
      "@type": "ImageObject",
      "url": logo
    },
    "image": image || logo,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": location.streetAddress,
      "addressLocality": location.city,
      "addressRegion": location.state,
      "postalCode": location.zipCode,
      "addressCountry": "US"
    },
    "geo": location.latitude && location.longitude ? {
      "@type": "GeoCoordinates",
      "latitude": location.latitude,
      "longitude": location.longitude
    } : undefined,
    "telephone": telephone,
    "email": email,
    "priceRange": priceRange,
    "sameAs": socialLinks,
    "openingHoursSpecification": hours.map(hour => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": `https://schema.org/${hour.dayOfWeek}`,
      "opens": hour.opens,
      "closes": hour.closes
    })),
    "areaServed": areasServed.map(area => ({
      "@type": "City",
      "name": area
    })),
    "hasOfferCatalog": services.length > 0 ? {
      "@type": "OfferCatalog",
      "name": `${name} Services`,
      "itemListElement": services.map((service, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": service
        },
        "position": index + 1
      }))
    } : undefined,
    "foundingDate": yearEstablished ? `${yearEstablished}-01-01` : undefined,
    "aggregateRating": rating ? {
      "@type": "AggregateRating",
      "ratingValue": rating,
      "bestRating": 5,
      "worstRating": 1,
      "ratingCount": 27 // Example value, should be replaced with actual count
    } : undefined,
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": `${url}/properties?search={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    ]
  };
  
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}