import React from 'react';
import { Helmet } from 'react-helmet';

interface PropertyType {
  id: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: string;
  squareFeet: number;
  type: string;
  description: string;
  features?: string[];
  images?: string[];
  status?: string;
  yearBuilt?: number | null;
  lotsizeSquareFeet?: number | null;
  garageSpaces?: number | null;
  agent?: {
    name: string;
    email: string;
    phone: string;
    license?: string;
    image?: string;
  };
}

interface NeighborhoodType {
  id: number;
  name: string;
  city: string;
  state: string;
  description: string;
  image?: string;
  amenities?: string[];
  schools?: {
    name: string;
    type: string;
    rating?: number;
    distance?: string;
  }[];
  avgHomePrice?: number;
  crimeRate?: string;
}

interface AgencyType {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  logo?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  yearEstablished?: number;
  licenseNumber?: string;
  agents?: {
    name: string;
    title?: string;
    phone?: string;
    email?: string;
    image?: string;
    license?: string;
  }[];
}

interface LocalBusinessSchemaProps {
  agencyInfo: AgencyType;
}

interface PropertySchemaProps {
  property: PropertyType;
}

interface NeighborhoodSchemaProps {
  neighborhood: NeighborhoodType;
}

// Usage: <LocalBusinessSchema agencyInfo={agencyData} />
export const LocalBusinessSchema: React.FC<LocalBusinessSchemaProps> = ({ agencyInfo }) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": agencyInfo.name,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": agencyInfo.address,
      "addressLocality": agencyInfo.city,
      "addressRegion": agencyInfo.state,
      "postalCode": agencyInfo.zipCode,
      "addressCountry": "US"
    },
    "telephone": agencyInfo.phone,
    "email": agencyInfo.email,
    "url": agencyInfo.website,
    "description": agencyInfo.description,
    "logo": agencyInfo.logo,
    "sameAs": [
      agencyInfo.socialMedia?.facebook,
      agencyInfo.socialMedia?.twitter,
      agencyInfo.socialMedia?.instagram,
      agencyInfo.socialMedia?.linkedin
    ].filter(Boolean),
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "17:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "10:00",
        "closes": "15:00"
      }
    ],
    "areaServed": {
      "@type": "City",
      "name": "Laredo",
      "sameAs": "https://en.wikipedia.org/wiki/Laredo,_Texas"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Real Estate Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Home Buying Assistance",
            "description": "Expert guidance for homebuyers in the Laredo area."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Property Selling Services",
            "description": "Professional marketing and selling services for your Laredo property."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Property Management",
            "description": "Comprehensive property management services for landlords in Laredo."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Investment Property Consulting",
            "description": "Expert advice on real estate investments in the Laredo market."
          }
        }
      ]
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 27.5036,  // Laredo coordinates
      "longitude": -99.5078
    },
    "priceRange": "Varies by property",
    "knowsLanguage": ["English", "Spanish"],
    "keywords": [
      "Laredo real estate",
      "homes for sale in Laredo",
      "Laredo properties",
      "Laredo homes",
      "Laredo houses",
      "real estate agent Laredo",
      "buy house in Laredo",
      "sell house in Laredo",
      "Laredo Texas realty",
      "best real estate agent Laredo"
    ].join(", ")
  };

  // Add employees/agents if available
  if (agencyInfo.agents && agencyInfo.agents.length > 0) {
    schemaData.employee = agencyInfo.agents.map(agent => ({
      "@type": "RealEstateAgent",
      "name": agent.name,
      "jobTitle": agent.title,
      "telephone": agent.phone,
      "email": agent.email,
      "image": agent.image,
      "knowsLanguage": ["English", "Spanish"]
    }));
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

// Usage: <PropertySchema property={propertyData} />
export const PropertySchema: React.FC<PropertySchemaProps> = ({ property }) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": `${property.bedrooms} Bed ${property.type} for Sale in ${property.city}`,
    "description": property.description,
    "url": `https://ohanarealty.com/properties/${property.id}`,
    "datePosted": new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://ohanarealty.com/properties/${property.id}`
    },
    "image": property.images && property.images.length > 0 ? property.images : undefined,
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": "USD",
      "availability": property.status === 'Active' ? "https://schema.org/InStock" : "https://schema.org/SoldOut"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": property.address,
      "addressLocality": property.city,
      "addressRegion": property.state,
      "postalCode": property.zipCode,
      "addressCountry": "US"
    },
    "numberOfRooms": property.bedrooms,
    "numberOfBathroomsTotal": parseFloat(property.bathrooms),
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.squareFeet,
      "unitCode": "SqFt",
      "unitText": "Square Feet"
    }
  };

  // Add Optional Property Attributes
  if (property.lotSizeSquareFeet) {
    schemaData.lotSize = {
      "@type": "QuantitativeValue",
      "value": property.lotsizeSquareFeet,
      "unitCode": "SqFt",
      "unitText": "Square Feet"
    };
  }

  if (property.yearBuilt) {
    schemaData.yearBuilt = property.yearBuilt;
  }

  if (property.garageSpaces) {
    schemaData.amenityFeature = [
      {
        "@type": "PropertyValue",
        "name": "Garage",
        "value": `${property.garageSpaces} car garage`
      }
    ];
  }

  if (property.features && property.features.length > 0) {
    if (!schemaData.amenityFeature) {
      schemaData.amenityFeature = [];
    }
    
    property.features.forEach(feature => {
      schemaData.amenityFeature.push({
        "@type": "PropertyValue",
        "name": feature
      });
    });
  }

  // Add real estate agent if available
  if (property.agent) {
    schemaData.agent = {
      "@type": "RealEstateAgent",
      "name": property.agent.name,
      "telephone": property.agent.phone,
      "email": property.agent.email,
      "image": property.agent.image,
      "url": "https://ohanarealty.com/agents/" + property.agent.name.toLowerCase().replace(/\s+/g, '-')
    };
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

// Usage: <NeighborhoodSchema neighborhood={neighborhoodData} />
export const NeighborhoodSchema: React.FC<NeighborhoodSchemaProps> = ({ neighborhood }) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": `${neighborhood.name} - Laredo Neighborhood`,
    "description": neighborhood.description,
    "url": `https://ohanarealty.com/neighborhoods/${neighborhood.id}`,
    "image": neighborhood.image,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://ohanarealty.com/neighborhoods/${neighborhood.id}`
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": neighborhood.city,
      "addressRegion": neighborhood.state,
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 27.5036,  // Laredo default coordinates, should be replaced with actual neighborhood coords
      "longitude": -99.5078
    },
    "containedInPlace": {
      "@type": "City",
      "name": "Laredo",
      "sameAs": "https://en.wikipedia.org/wiki/Laredo,_Texas"
    }
  };

  // Add amenities if available
  if (neighborhood.amenities && neighborhood.amenities.length > 0) {
    schemaData.amenityFeature = neighborhood.amenities.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity
    }));
  }

  // Add schools if available
  if (neighborhood.schools && neighborhood.schools.length > 0) {
    schemaData.containsPlace = neighborhood.schools.map(school => ({
      "@type": "EducationalOrganization",
      "name": school.name,
      "description": `${school.type} school in the ${neighborhood.name} area of Laredo`,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": neighborhood.city,
        "addressRegion": neighborhood.state,
        "addressCountry": "US"
      }
    }));
  }

  // Add price range if available
  if (neighborhood.avgHomePrice) {
    schemaData.description += ` Average home prices in this area are around $${neighborhood.avgHomePrice.toLocaleString()}.`;
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

// Local Real Estate Market Knowledge Graph enhancement
export const LaredoRealEstateMarketSchema: React.FC = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Laredo Real Estate Market Insights",
    "description": "Comprehensive information about the Laredo, TX real estate market, neighborhoods, and housing trends.",
    "url": "https://ohanarealty.com/market-insights",
    "numberOfItems": 10,
    "itemListElement": [
      {
        "@type": "Article",
        "position": 1,
        "name": "Laredo Housing Market Analysis",
        "url": "https://ohanarealty.com/market-insights/housing-market-analysis",
        "description": "Current trends, prices, and forecasts for the Laredo housing market in 2025."
      },
      {
        "@type": "Article",
        "position": 2,
        "name": "Top Neighborhoods in Laredo",
        "url": "https://ohanarealty.com/market-insights/top-neighborhoods",
        "description": "Comprehensive guide to the best residential areas in Laredo, Texas."
      },
      {
        "@type": "Article",
        "position": 3,
        "name": "Investment Properties in Laredo",
        "url": "https://ohanarealty.com/market-insights/investment-properties",
        "description": "Guide to finding and purchasing profitable investment properties in Laredo."
      },
      {
        "@type": "Article",
        "position": 4,
        "name": "New Construction in Laredo",
        "url": "https://ohanarealty.com/market-insights/new-construction",
        "description": "Latest developments and new construction homes in the Laredo area."
      },
      {
        "@type": "Article",
        "position": 5,
        "name": "Laredo Schools and Education",
        "url": "https://ohanarealty.com/market-insights/schools-education",
        "description": "Information about schools, districts, and educational options in Laredo."
      },
      {
        "@type": "Article",
        "position": 6,
        "name": "Luxury Homes in Laredo",
        "url": "https://ohanarealty.com/market-insights/luxury-homes",
        "description": "Explore the premium and luxury housing market in Laredo, Texas."
      },
      {
        "@type": "Article",
        "position": 7,
        "name": "First-Time Homebuyer Guide for Laredo",
        "url": "https://ohanarealty.com/market-insights/first-time-homebuyers",
        "description": "Complete guide for first-time homebuyers in the Laredo market."
      },
      {
        "@type": "Article",
        "position": 8,
        "name": "Laredo Real Estate Market Forecast",
        "url": "https://ohanarealty.com/market-insights/market-forecast",
        "description": "Expert predictions for the Laredo real estate market in the coming years."
      },
      {
        "@type": "Article",
        "position": 9,
        "name": "Selling Your Home in Laredo",
        "url": "https://ohanarealty.com/market-insights/selling-guide",
        "description": "Tips and strategies for successfully selling your Laredo property."
      },
      {
        "@type": "Article",
        "position": 10,
        "name": "Laredo Neighborhoods Comparison",
        "url": "https://ohanarealty.com/market-insights/neighborhood-comparison",
        "description": "Side-by-side comparison of different Laredo neighborhoods and areas."
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

// Combine all schemas for the homepage
export const LaredoEnhancedSchema: React.FC<{
  agencyInfo?: AgencyType;
  featuredProperties?: PropertyType[];
  featuredNeighborhoods?: NeighborhoodType[];
}> = ({ 
  agencyInfo, 
  featuredProperties, 
  featuredNeighborhoods 
}) => {
  // Default agency info if not provided
  const defaultAgencyInfo = {
    name: "Ohana Realty",
    address: "123 Main St, Suite 100",
    city: "Laredo",
    state: "TX",
    zipCode: "78045",
    phone: "(956) 555-1234",
    email: "info@ohanarealty.com",
    website: "https://ohanarealty.com",
    description: "Ohana Realty is a premier real estate agency serving Laredo, TX and surrounding areas. Specializing in residential and commercial properties, our team of expert agents are dedicated to providing exceptional service to help you find your dream home or investment property.",
    logo: "https://ohanarealty.com/images/logo.png",
    socialMedia: {
      facebook: "https://facebook.com/ohanarealty",
      twitter: "https://twitter.com/ohanarealty",
      instagram: "https://instagram.com/ohanarealty",
      linkedin: "https://linkedin.com/company/ohanarealty"
    },
    yearEstablished: 2023,
    licenseNumber: "TX12345678",
    agents: [
      {
        name: "Jane Smith",
        title: "Broker/Owner",
        phone: "(956) 555-5678",
        email: "jane@ohanarealty.com",
        image: "https://ohanarealty.com/images/agents/jane-smith.jpg",
        license: "TX87654321"
      },
      {
        name: "John Rodriguez",
        title: "Senior Agent",
        phone: "(956) 555-9012",
        email: "john@ohanarealty.com",
        image: "https://ohanarealty.com/images/agents/john-rodriguez.jpg",
        license: "TX76543210"
      }
    ]
  };

  const agency = agencyInfo || defaultAgencyInfo;
  
  return (
    <>
      <LocalBusinessSchema agencyInfo={agency} />
      {featuredProperties && featuredProperties.length > 0 && (
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "name": "Featured Properties in Laredo, TX",
              "description": "Explore our featured real estate listings in Laredo, Texas.",
              "numberOfItems": featuredProperties.length,
              "itemListElement": featuredProperties.map((property, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "RealEstateListing",
                  "name": `${property.bedrooms} Bed ${property.type} in ${property.city}`,
                  "description": property.description.substring(0, 200) + (property.description.length > 200 ? '...' : ''),
                  "url": `https://ohanarealty.com/properties/${property.id}`,
                  "image": property.images && property.images.length > 0 ? property.images[0] : undefined,
                  "offers": {
                    "@type": "Offer",
                    "price": property.price,
                    "priceCurrency": "USD"
                  },
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": property.address,
                    "addressLocality": property.city,
                    "addressRegion": property.state,
                    "postalCode": property.zipCode,
                    "addressCountry": "US"
                  }
                }
              }))
            })}
          </script>
        </Helmet>
      )}
      {featuredNeighborhoods && featuredNeighborhoods.length > 0 && (
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "name": "Laredo, TX Neighborhoods",
              "description": "Explore the best neighborhoods in Laredo, Texas.",
              "numberOfItems": featuredNeighborhoods.length,
              "itemListElement": featuredNeighborhoods.map((neighborhood, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Place",
                  "name": neighborhood.name,
                  "description": neighborhood.description.substring(0, 200) + (neighborhood.description.length > 200 ? '...' : ''),
                  "url": `https://ohanarealty.com/neighborhoods/${neighborhood.id}`,
                  "image": neighborhood.image,
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": neighborhood.city,
                    "addressRegion": neighborhood.state,
                    "addressCountry": "US"
                  }
                }
              }))
            })}
          </script>
        </Helmet>
      )}
      <LaredoRealEstateMarketSchema />
    </>
  );
};

export default LaredoEnhancedSchema;
