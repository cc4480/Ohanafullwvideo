import React from 'react';
import { Property } from '@shared/schema';

interface SimplePropertyStructuredDataProps {
  property: Property;
  baseUrl: string;
  agent?: {
    name: string;
    image?: string;
    telephone?: string;
    email?: string;
    url?: string;
  };
}

/**
 * Creates structured data JSON-LD for a real estate property listing
 * that follows Schema.org standards for optimal search engine visibility
 */
export function generatePropertyStructuredData(props: SimplePropertyStructuredDataProps) {
  const { property, baseUrl, agent } = props;
  
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

/**
 * Component that generates Schema.org structured data for real estate property listings
 */
export default function SimplePropertyStructuredData(props: SimplePropertyStructuredDataProps) {
  // This component doesn't render any visible UI
  return null;
}