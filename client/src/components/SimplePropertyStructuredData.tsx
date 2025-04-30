import React from 'react';
import { Property } from '@shared/schema';

interface SimplePropertyStructuredDataProps {
  // Original property-based interface
  property?: Property;
  baseUrl?: string;
  agent?: {
    name: string;
    image?: string;
    telephone?: string;
    email?: string;
    url?: string;
  };
  
  // New direct property data interface
  name?: string;
  description?: string;
  price?: number;
  priceUnit?: string;
  priceValidUntil?: string;
  imageUrls?: string[];
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  numberOfRooms?: number;
  petsAllowed?: boolean;
  latitude?: number | null;
  longitude?: number | null;
}

/**
 * Creates structured data JSON-LD for a real estate property listing
 * that follows Schema.org standards for optimal search engine visibility
 */
export function generatePropertyStructuredData(props: SimplePropertyStructuredDataProps) {
  return generateStructuredData(props);
}

export function generateStructuredData(props: SimplePropertyStructuredDataProps) {
  // Handle property-based data (original implementation)
  if (props.property) {
    const { property, baseUrl = 'https://ohanarealty.com', agent } = props;
    // Since we checked props.property exists, we can safely use it
    
    // Property URL
    const url = `${baseUrl}/properties/${property.id}`;
    
    // Format the main image URLs
    const images = Array.isArray(property.images) 
      ? property.images 
      : [];
    
    // Basic property type
    const propertyType = property.type === "RESIDENTIAL" 
      ? "SingleFamilyResidence" 
      : property.type === "COMMERCIAL" 
        ? "CommercialProperty" 
        : "LandLot";

    // Define the structured data object
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      "@id": `${url}#listing`,
      "url": url,
      "name": `${property.bedrooms ? `${property.bedrooms} Bedroom ` : ''}${property.type} For Sale: ${property.address}`,
      "description": property.description || `${property.type} property located at ${property.address}, ${property.city}, ${property.state} ${property.zipCode}.`,
      "image": images.length > 0 ? images : undefined,
      "offers": {
        "@type": "Offer",
        "price": property.price,
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "validFrom": new Date().toISOString().split('T')[0]
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": property.address,
        "addressLocality": property.city,
        "addressRegion": property.state,
        "postalCode": property.zipCode,
        "addressCountry": "US"
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url
      },
      "datePosted": new Date().toISOString().split('T')[0]
    };
    
    // Add geographic coordinates if available
    if (property.lat && property.lng) {
      Object.assign(structuredData, {
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": property.lat,
          "longitude": property.lng
        }
      });
    }
    
    // Add specific residential property details if applicable
    if (property.type === "RESIDENTIAL") {
      Object.assign(structuredData, {
        "numberOfRooms": property.bedrooms,
        "numberOfBathrooms": property.bathrooms
      });
    }
    
    // Add floor size if available
    if (property.squareFeet) {
      Object.assign(structuredData, {
        "floorSize": {
          "@type": "QuantitativeValue",
          "value": property.squareFeet,
          "unitCode": "SqFt"
        }
      });
    }
    
    // Add agent/broker information if available
    if (agent) {
      Object.assign(structuredData, {
        "broker": {
          "@type": "RealEstateAgent",
          "name": agent.name,
          "image": agent.image,
          "telephone": agent.telephone,
          "email": agent.email,
          "url": agent.url
        }
      });
    }
    
    // Add property features if available
    if (Array.isArray(property.features) && property.features.length > 0) {
      Object.assign(structuredData, {
        "amenityFeature": property.features.map(feature => ({
          "@type": "LocationFeatureSpecification",
          "name": feature
        }))
      });
    }
    
    return structuredData;
  }
  
  // Handle direct property data (new implementation)
  const {
    name,
    description,
    price,
    priceUnit = "USD",
    priceValidUntil,
    imageUrls = [],
    address,
    numberOfRooms,
    petsAllowed,
    latitude,
    longitude,
    baseUrl = 'https://ohanarealty.com',
    agent
  } = props;
  
  // Calculate a URL based on name or use defaults
  const url = name 
    ? `${baseUrl}/rentals/${encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'))}`
    : `${baseUrl}/rentals`;
  
  // Basic structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    "@id": `${url}#listing`,
    "url": url,
    "name": name,
    "description": description,
    "image": imageUrls.length > 0 ? imageUrls : undefined,
  };
  
  // Add price information if available
  if (price !== undefined) {
    Object.assign(structuredData, {
      "offers": {
        "@type": "Offer",
        "price": price,
        "priceCurrency": priceUnit,
        "availability": "https://schema.org/InStock",
        "validFrom": new Date().toISOString().split('T')[0],
        ...(priceValidUntil && { "priceValidUntil": priceValidUntil })
      }
    });
  }
  
  // Add address if available
  if (address) {
    Object.assign(structuredData, {
      "address": {
        "@type": "PostalAddress",
        "streetAddress": address.streetAddress,
        "addressLocality": address.addressLocality,
        "addressRegion": address.addressRegion,
        "postalCode": address.postalCode,
        "addressCountry": address.addressCountry
      }
    });
  }
  
  // Add geographic coordinates if available
  if (latitude && longitude) {
    Object.assign(structuredData, {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": latitude,
        "longitude": longitude
      }
    });
  }
  
  // Add specific property details if applicable
  if (numberOfRooms !== undefined) {
    Object.assign(structuredData, {
      "numberOfRooms": numberOfRooms
    });
  }
  
  // Add pet information if specified
  if (petsAllowed !== undefined) {
    Object.assign(structuredData, {
      "petsAllowed": petsAllowed
    });
  }
  
  // Add agent/broker information if available
  if (agent) {
    Object.assign(structuredData, {
      "provider": {
        "@type": "RealEstateAgent",
        "name": agent.name,
        "image": agent.image,
        "telephone": agent.telephone,
        "email": agent.email,
        "url": agent.url
      }
    });
  }
  
  return structuredData;
}

/**
 * Component that generates Schema.org structured data for real estate property listings
 */
export default function SimplePropertyStructuredData(props: SimplePropertyStructuredDataProps) {
  // This component doesn't render any visible UI, just add the structured data to the page
  const structuredData = generateStructuredData(props);
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}