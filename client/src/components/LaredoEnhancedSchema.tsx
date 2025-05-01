import React from 'react';
import { Helmet } from 'react-helmet';

/**
 * Enhanced Laredo-specific Schema.org markup component
 * 
 * This component implements specialized structured data for Laredo neighborhoods
 * with rich local context to improve search visibility for Laredo real estate keywords.
 */

interface LaredoNeighborhoodSchemaProps {
  neighborhoodId: number;
  name: string;
  description: string;
  url: string;
  image?: string;
  city: string;
  state: string;
  zipCode: string;
  geo?: {
    latitude: number;
    longitude: number;
  };
  // Laredo-specific data points
  yearEstablished?: number;
  schoolDistrict?: string;
  schools?: string[];
  parks?: string[];
  shoppingCenters?: string[];
  diningOptions?: string[];
  landmarks?: string[];
  medianHomePrice?: number;
  averageRent?: number;
  walkScore?: number;
  transitOptions?: string[];
  neighboringAreas?: string[];
  history?: string;
  events?: Array<{
    name: string;
    description?: string;
    startDate?: string;
    location?: string;
  }>;
  // Local business connections
  localBusinesses?: Array<{
    name: string;
    type: string;
    url?: string;
    telephone?: string;
  }>;
  // SEO competitor tracking
  competitorUrls?: {
    coldwellBanker?: string;
    remax?: string;
    realtor?: string;
  };
}

export default function LaredoNeighborhoodSchema(props: LaredoNeighborhoodSchemaProps) {
  const {
    neighborhoodId,
    name,
    description,
    url,
    image,
    city,
    state,
    zipCode,
    geo,
    yearEstablished,
    schoolDistrict,
    schools,
    parks,
    shoppingCenters,
    diningOptions,
    landmarks,
    medianHomePrice,
    averageRent,
    walkScore,
    transitOptions,
    neighboringAreas,
    history,
    events,
    localBusinesses,
    competitorUrls
  } = props;

  // Base neighborhood Entity
  const neighborhoodEntity: any = {
    "@context": "https://schema.org",
    "@type": "Neighborhood",
    "@id": `${url}#neighborhood`,
    "name": `${name}, Laredo, TX`,
    "description": description,
    "url": url,
    "containedInPlace": {
      "@type": "City",
      "name": "Laredo",
      "alternateName": "Laredo TX",
      "sameAs": [
        "https://en.wikipedia.org/wiki/Laredo,_Texas",
        "https://www.cityoflaredo.com/"
      ],
      "containedInPlace": {
        "@type": "State",
        "name": "Texas"
      }
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "neighborhoodType",
        "value": "Residential"
      },
      {
        "@type": "PropertyValue",
        "name": "zipCode",
        "value": zipCode
      }
    ]
  };

  // Add geo coordinates if available
  if (geo) {
    neighborhoodEntity.geo = {
      "@type": "GeoCoordinates",
      "latitude": geo.latitude,
      "longitude": geo.longitude
    };
  }

  // Add image if available
  if (image) {
    neighborhoodEntity.image = image;
  }

  // Add historical data if available
  if (history) {
    neighborhoodEntity.additionalProperty.push({
      "@type": "PropertyValue",
      "name": "History",
      "value": history
    });
  }

  if (yearEstablished) {
    neighborhoodEntity.additionalProperty.push({
      "@type": "PropertyValue",
      "name": "YearEstablished",
      "value": yearEstablished
    });
  }

  // Add school information
  if (schoolDistrict || (schools && schools.length > 0)) {
    const educationEntity = {
      "@type": "Article",
      "@id": `${url}#education`,
      "headline": `Schools in ${name}`,
      "description": `Educational options available in the ${name} neighborhood of Laredo, TX`,
      "about": { "@id": `${url}#neighborhood` }
    };

    if (schoolDistrict) {
      educationEntity.mainEntity = {
        "@type": "SchoolDistrict",
        "name": schoolDistrict,
        "areaServed": { "@id": `${url}#neighborhood` }
      };
    }

    if (schools && schools.length > 0) {
      educationEntity.mentions = schools.map(school => ({
        "@type": "School",
        "name": school,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Laredo",
          "addressRegion": "TX"
        }
      }));
    }

    neighborhoodEntity.mainEntityOfPage = educationEntity;
  }

  // Add real estate market data
  if (medianHomePrice || averageRent) {
    const marketData = {
      "@type": "Dataset",
      "@id": `${url}#market-data`,
      "name": `${name} Real Estate Market Data`,
      "description": `Current real estate market statistics for ${name} in Laredo, TX`,
      "about": { "@id": `${url}#neighborhood` },
      "variableMeasured": []
    };

    if (medianHomePrice) {
      marketData.variableMeasured.push({
        "@type": "PropertyValue",
        "name": "MedianHomePrice",
        "value": medianHomePrice,
        "unitText": "USD"
      });
    }

    if (averageRent) {
      marketData.variableMeasured.push({
        "@type": "PropertyValue",
        "name": "AverageRent",
        "value": averageRent,
        "unitText": "USD"
      });
    }

    if (walkScore) {
      marketData.variableMeasured.push({
        "@type": "PropertyValue",
        "name": "WalkScore",
        "value": walkScore,
        "minValue": 0,
        "maxValue": 100
      });
    }

    neighborhoodEntity.subjectOf = marketData;
  }

  // Add local amenities (parks, shopping, dining)
  const amenities = [];

  if (parks && parks.length > 0) {
    amenities.push({
      "@type": "Article",
      "@id": `${url}#parks`,
      "headline": `Parks and Recreation in ${name}`,
      "description": `Parks and recreational areas in the ${name} neighborhood`,
      "mentions": parks.map(park => ({
        "@type": "Park",
        "name": park,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Laredo",
          "addressRegion": "TX"
        }
      }))
    });
  }

  if (shoppingCenters && shoppingCenters.length > 0) {
    amenities.push({
      "@type": "Article",
      "@id": `${url}#shopping`,
      "headline": `Shopping in ${name}`,
      "description": `Shopping centers and retail options in the ${name} neighborhood`,
      "mentions": shoppingCenters.map(center => ({
        "@type": "ShoppingCenter",
        "name": center,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Laredo",
          "addressRegion": "TX"
        }
      }))
    });
  }

  if (diningOptions && diningOptions.length > 0) {
    amenities.push({
      "@type": "Article",
      "@id": `${url}#dining`,
      "headline": `Dining in ${name}`,
      "description": `Restaurants and dining options in the ${name} neighborhood`,
      "mentions": diningOptions.map(restaurant => ({
        "@type": "Restaurant",
        "name": restaurant,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Laredo",
          "addressRegion": "TX"
        }
      }))
    });
  }

  if (landmarks && landmarks.length > 0) {
    amenities.push({
      "@type": "Article",
      "@id": `${url}#landmarks`,
      "headline": `Landmarks in ${name}`,
      "description": `Notable landmarks and points of interest in the ${name} neighborhood`,
      "mentions": landmarks.map(landmark => ({
        "@type": "LandmarksOrHistoricalBuildings",
        "name": landmark,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Laredo",
          "addressRegion": "TX"
        }
      }))
    });
  }

  // Add transportation options
  if (transitOptions && transitOptions.length > 0) {
    amenities.push({
      "@type": "Article",
      "@id": `${url}#transportation`,
      "headline": `Transportation in ${name}`,
      "description": `Transportation options in the ${name} neighborhood`,
      "mentions": transitOptions.map(option => ({
        "@type": "Service",
        "serviceType": "Transportation",
        "name": option,
        "areaServed": {
          "@type": "City",
          "name": "Laredo",
          "containsPlace": { "@id": `${url}#neighborhood` }
        }
      }))
    });
  }

  // Add neighboring areas for geographic context
  if (neighboringAreas && neighboringAreas.length > 0) {
    neighborhoodEntity.neighboringLocation = neighboringAreas.map(area => ({
      "@type": "Neighborhood",
      "name": `${area}, Laredo, TX`,
      "containedInPlace": {
        "@type": "City",
        "name": "Laredo",
        "addressRegion": "TX"
      }
    }));
  }

  // Add local events if available
  if (events && events.length > 0) {
    neighborhoodEntity.events = events.map(event => ({
      "@type": "Event",
      "name": event.name,
      ...(event.description && { "description": event.description }),
      ...(event.startDate && { "startDate": event.startDate }),
      "location": {
        "@type": "Place",
        "name": event.location || name,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Laredo",
          "addressRegion": "TX",
          "postalCode": zipCode
        }
      }
    }));
  }

  // Include local businesses to create a network of local entities
  if (localBusinesses && localBusinesses.length > 0) {
    neighborhoodEntity.containsPlace = localBusinesses.map(business => ({
      "@type": business.type,
      "name": business.name,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Laredo",
        "addressRegion": "TX"
      },
      ...(business.url && { "url": business.url }),
      ...(business.telephone && { "telephone": business.telephone })
    }));
  }

  // Include competitor tracking for SEO comparison
  if (competitorUrls) {
    neighborhoodEntity.sameAs = [];
    
    if (competitorUrls.coldwellBanker) {
      neighborhoodEntity.sameAs.push(competitorUrls.coldwellBanker);
    }
    
    if (competitorUrls.remax) {
      neighborhoodEntity.sameAs.push(competitorUrls.remax);
    }
    
    if (competitorUrls.realtor) {
      neighborhoodEntity.sameAs.push(competitorUrls.realtor);
    }
  }

  // Combine amenities with the neighborhood entity
  if (amenities.length > 0) {
    neighborhoodEntity.mainEntityOfPage = [
      ...(Array.isArray(neighborhoodEntity.mainEntityOfPage) ? 
         neighborhoodEntity.mainEntityOfPage : 
         (neighborhoodEntity.mainEntityOfPage ? [neighborhoodEntity.mainEntityOfPage] : [])),
      ...amenities
    ];
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(neighborhoodEntity)}
      </script>
    </Helmet>
  );
}
