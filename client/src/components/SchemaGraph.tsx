import React from 'react';
import { Helmet } from 'react-helmet';

interface EntityReference {
  "@id": string;
}

interface SchemaEntity {
  "@id": string;
  "@type": string;
  [key: string]: any;
}

interface SchemaGraphProps {
  /**
   * The base URL of the website
   */
  baseUrl: string;
  
  /**
   * Schema.org entities to include in the graph
   */
  entities: SchemaEntity[];
  
  /**
   * Whether to enable debug mode (logs to console)
   */
  debug?: boolean;
}

/**
 * Schema Graph - Enterprise-Grade Knowledge Graph Implementation
 * 
 * This component implements a holistic knowledge graph approach using Schema.org
 * by connecting multiple entities with proper references to create a complete
 * semantic graph of the website's content. This helps search engines understand
 * the relationships between different entities (business, properties, people, etc.)
 * 
 * Features:
 * - Entity referencing with @id
 * - Knowledge graph-like structure similar to Google's Knowledge Graph
 * - Entity relationships with proper linking
 * - Multi-entity context for better semantic understanding
 */
export default function SchemaGraph({ 
  baseUrl,
  entities,
  debug = false
}: SchemaGraphProps) {
  
  // Process entities to ensure they have proper @id attributes
  const processedEntities = entities.map(entity => {
    // Ensure the entity has an @id if not already present
    if (!entity["@id"] && entity["@type"]) {
      entity["@id"] = `${baseUrl}/#${entity["@type"].toLowerCase()}`;
    }
    
    return entity;
  });
  
  // Create the knowledge graph wrapper
  const graphData = {
    "@context": "https://schema.org",
    "@graph": processedEntities
  };
  
  if (debug) {
    console.log('Schema Graph Data:', graphData);
  }
  
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(graphData)}
      </script>
    </Helmet>
  );
}

/**
 * Helper function to create a reference to an entity
 * @param id The ID of the entity to reference
 * @returns An entity reference object
 */
export function createEntityReference(id: string): EntityReference {
  return { "@id": id };
}

/**
 * Create a real estate business entity
 */
export function createRealEstateBusinessEntity(
  id: string,
  name: string,
  url: string,
  logo: string,
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  },
  telephone?: string,
  email?: string,
  description?: string,
  geo?: {
    latitude: number;
    longitude: number;
  },
  sameAs?: string[],
  founder?: {
    name: string;
    jobTitle?: string;
    image?: string;
  }
): SchemaEntity {
  return {
    "@id": id,
    "@type": "RealEstateAgent",
    "name": name,
    "url": url,
    "logo": {
      "@type": "ImageObject",
      "url": logo,
      "width": 180,
      "height": 60
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address.streetAddress,
      "addressLocality": address.addressLocality,
      "addressRegion": address.addressRegion,
      "postalCode": address.postalCode,
      "addressCountry": address.addressCountry
    },
    ...(telephone && { "telephone": telephone }),
    ...(email && { "email": email }),
    ...(description && { "description": description }),
    ...(geo && {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": geo.latitude,
        "longitude": geo.longitude
      }
    }),
    ...(sameAs && { "sameAs": sameAs }),
    ...(founder && {
      "founder": {
        "@type": "Person",
        "name": founder.name,
        ...(founder.jobTitle && { "jobTitle": founder.jobTitle }),
        ...(founder.image && { "image": founder.image })
      }
    })
  };
}

/**
 * Create a real estate property entity
 */
export function createPropertyEntity(
  id: string,
  name: string,
  url: string,
  description: string,
  price: number,
  priceCurrency: string,
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  },
  images: string[],
  numberOfBedrooms?: number,
  numberOfBathrooms?: number,
  floorSize?: number,
  floorSizeUnit?: string,
  propertyType?: string,
  features?: string[],
  geo?: {
    latitude: number;
    longitude: number;
  },
  offeredBy?: string // ID reference to the agent/broker
): SchemaEntity {
  return {
    "@id": id,
    "@type": "RealEstateListing",
    "name": name,
    "url": url,
    "description": description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address.streetAddress,
      "addressLocality": address.addressLocality,
      "addressRegion": address.addressRegion,
      "postalCode": address.postalCode,
      "addressCountry": address.addressCountry
    },
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": priceCurrency,
      ...(offeredBy && { "offeredBy": { "@id": offeredBy } })
    },
    "image": images.map(img => ({
      "@type": "ImageObject",
      "url": img
    })),
    ...(numberOfBedrooms !== undefined && { "numberOfBedrooms": numberOfBedrooms }),
    ...(numberOfBathrooms !== undefined && { "numberOfBathroomsTotal": numberOfBathrooms }),
    ...(floorSize && {
      "floorSize": {
        "@type": "QuantitativeValue",
        "value": floorSize,
        "unitCode": floorSizeUnit || "FTK" // Square feet
      }
    }),
    ...(propertyType && { "propertyType": propertyType }),
    ...(features && { 
      "amenityFeature": features.map(feature => ({
        "@type": "LocationFeatureSpecification",
        "name": feature,
        "value": true
      }))
    }),
    ...(geo && {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": geo.latitude,
        "longitude": geo.longitude
      }
    })
  };
}

/**
 * Create a place entity (neighborhood, city, etc.)
 */
export function createPlaceEntity(
  id: string,
  name: string,
  url: string,
  description: string,
  image?: string,
  geo?: {
    latitude: number;
    longitude: number;
  },
  containsPlace?: string[],  // ID references to places contained within this place
  containedInPlace?: string, // ID reference to the place containing this place
  properties?: string[]      // ID references to properties in this place
): SchemaEntity {
  return {
    "@id": id,
    "@type": "Place",
    "name": name,
    "url": url,
    "description": description,
    ...(image && { "image": image }),
    ...(geo && {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": geo.latitude,
        "longitude": geo.longitude
      }
    }),
    ...(containsPlace && containsPlace.length > 0 && { 
      "containsPlace": containsPlace.map(place => ({ "@id": place }))
    }),
    ...(containedInPlace && { "containedInPlace": { "@id": containedInPlace } }),
    ...(properties && properties.length > 0 && {
      "subjectOf": properties.map(property => ({ "@id": property }))
    })
  };
}

/**
 * Create a person entity
 */
export function createPersonEntity(
  id: string,
  name: string,
  jobTitle?: string,
  image?: string,
  url?: string,
  description?: string,
  telephone?: string,
  email?: string,
  sameAs?: string[],
  worksFor?: string,  // ID reference to organization
  affiliation?: string[], // ID references to organizations
  award?: string[],
  knowsLanguage?: string[]
): SchemaEntity {
  return {
    "@id": id,
    "@type": "Person",
    "name": name,
    ...(jobTitle && { "jobTitle": jobTitle }),
    ...(image && { "image": image }),
    ...(url && { "url": url }),
    ...(description && { "description": description }),
    ...(telephone && { "telephone": telephone }),
    ...(email && { "email": email }),
    ...(sameAs && { "sameAs": sameAs }),
    ...(worksFor && { "worksFor": { "@id": worksFor } }),
    ...(affiliation && affiliation.length > 0 && { 
      "affiliation": affiliation.map(org => ({ "@id": org }))
    }),
    ...(award && award.length > 0 && { "award": award }),
    ...(knowsLanguage && knowsLanguage.length > 0 && { "knowsLanguage": knowsLanguage })
  };
}

/**
 * Create a website entity
 */
export function createWebsiteEntity(
  id: string,
  name: string,
  url: string,
  description: string,
  publisher?: string,  // ID reference to the organization
  inLanguage?: string[],
  keywords?: string[],
  copyrightYear?: number,
  license?: string
): SchemaEntity {
  return {
    "@id": id,
    "@type": "WebSite",
    "name": name,
    "url": url,
    "description": description,
    ...(publisher && { "publisher": { "@id": publisher } }),
    ...(inLanguage && inLanguage.length > 0 && { "inLanguage": inLanguage }),
    ...(keywords && keywords.length > 0 && { "keywords": keywords.join(", ") }),
    ...(copyrightYear && { "copyrightYear": copyrightYear }),
    ...(license && { "license": license }),
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${url}/properties?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}

/**
 * Create a breadcrumb list entity
 */
export function createBreadcrumbEntity(
  id: string,
  items: Array<{
    name: string;
    url: string;
    position: number;
  }>
): SchemaEntity {
  return {
    "@id": id,
    "@type": "BreadcrumbList",
    "itemListElement": items.map(item => ({
      "@type": "ListItem",
      "position": item.position,
      "name": item.name,
      "item": item.url
    }))
  };
}

/**
 * Create a FAQ entity
 */
export function createFAQEntity(
  id: string,
  questions: Array<{
    question: string;
    answer: string;
  }>
): SchemaEntity {
  return {
    "@id": id,
    "@type": "FAQPage",
    "mainEntity": questions.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
}