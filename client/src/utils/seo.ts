/**
 * SEO Utility Functions for Ohana Realty
 * Provides structured data and metadata optimization for search engines
 */

// Company information constants - always use these for consistency
export const COMPANY_DATA = {
  name: "Ohana Realty",
  address: {
    street: "505 Shiloh Dr. #201",
    city: "Laredo",
    state: "TX",
    zipCode: "78045",
    country: "USA"
  },
  phone: "956-324-6714",
  email: "info@ohanarealty.com",
  coordinates: {
    latitude: 27.5909,
    longitude: -99.4972
  },
  socialMedia: {
    facebook: "https://facebook.com/ohanarealty",
    instagram: "https://instagram.com/ohanarealty",
    twitter: "https://twitter.com/ohanarealty"
  },
  founded: "2019",
  businessHours: {
    monday: "9:00 AM - 5:00 PM",
    tuesday: "9:00 AM - 5:00 PM",
    wednesday: "9:00 AM - 5:00 PM",
    thursday: "9:00 AM - 5:00 PM",
    friday: "9:00 AM - 5:00 PM",
    saturday: "10:00 AM - 2:00 PM",
    sunday: "Closed"
  }
};

// Structured data generation for real estate business
export function generateBusinessStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": COMPANY_DATA.name,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": COMPANY_DATA.address.street,
      "addressLocality": COMPANY_DATA.address.city,
      "addressRegion": COMPANY_DATA.address.state,
      "postalCode": COMPANY_DATA.address.zipCode,
      "addressCountry": COMPANY_DATA.address.country
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": COMPANY_DATA.coordinates.latitude,
      "longitude": COMPANY_DATA.coordinates.longitude
    },
    "telephone": COMPANY_DATA.phone,
    "email": COMPANY_DATA.email,
    "url": window.location.origin,
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Monday",
        "opens": "09:00",
        "closes": "17:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Tuesday",
        "opens": "09:00",
        "closes": "17:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Wednesday",
        "opens": "09:00",
        "closes": "17:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Thursday",
        "opens": "09:00",
        "closes": "17:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Friday",
        "opens": "09:00",
        "closes": "17:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "10:00",
        "closes": "14:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "00:00",
        "closes": "00:00"
      }
    ],
    "sameAs": [
      COMPANY_DATA.socialMedia.facebook,
      COMPANY_DATA.socialMedia.instagram,
      COMPANY_DATA.socialMedia.twitter
    ],
    "priceRange": "$$",
    "areaServed": {
      "@type": "City",
      "name": "Laredo",
      "@id": "https://en.wikipedia.org/wiki/Laredo,_Texas"
    }
  };

  return structuredData;
}

// Generate structured data for property listings
export function generatePropertyStructuredData(property: any) {
  return {
    "@context": "https://schema.org",
    "@type": property.type === "RESIDENTIAL" ? "Residence" : "CommercialProperty",
    "name": `${property.address}, ${property.city}, ${property.state}`,
    "description": property.description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": property.address,
      "addressLocality": property.city,
      "addressRegion": property.state,
      "postalCode": property.zipCode,
      "addressCountry": "USA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": property.lat,
      "longitude": property.lng
    },
    "numberOfRooms": property.bedrooms,
    "numberOfBathroomsTotal": property.bathrooms,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.squareFeet,
      "unitCode": "FTK"
    },
    "price": property.price,
    "priceCurrency": "USD",
    "yearBuilt": property.yearBuilt,
    "image": property.images,
    "amenities": property.features,
    "offerCount": 1,
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": "USD",
      "availability": property.status === "ACTIVE" ? "InStock" : "SoldOut"
    }
  };
}

// Generate meta tags for specific pages
export function generateMetaTags(page: string, data?: any) {
  const baseTitle = "Ohana Realty";
  const baseDesc = "Discover exceptional properties in Laredo, TX with Ohana Realty - your trusted local real estate experts.";
  
  switch (page) {
    case 'home':
      return {
        title: `${baseTitle} - Laredo, TX Real Estate Experts`,
        description: baseDesc,
        keywords: "real estate, Laredo, Texas, homes for sale, commercial properties, property listings, real estate agents",
        canonical: window.location.origin
      };
    case 'about':
      return {
        title: `About ${baseTitle} - Our Story & Mission`,
        description: "Learn about Ohana Realty's commitment to excellence in Laredo real estate. Meet our team of dedicated professionals.",
        keywords: "about Ohana Realty, real estate team, Laredo realtors, real estate mission, real estate values",
        canonical: `${window.location.origin}/about`
      };
    case 'contact':
      return {
        title: `Contact ${baseTitle} - Reach Our Laredo Office`,
        description: `Contact Ohana Realty at 956-324-6714 or visit us at 505 Shiloh Dr. #201, Laredo, TX 78045 for all your real estate needs.`,
        keywords: "contact Ohana Realty, Laredo real estate office, real estate consultation, property inquiries",
        canonical: `${window.location.origin}/contact`
      };
    case 'property':
      if (!data) return null;
      return {
        title: `${data.address}, ${data.city}, ${data.state} - ${baseTitle}`,
        description: data.description?.substring(0, 160) || baseDesc,
        keywords: `${data.address}, ${data.type.toLowerCase()} property, ${data.city} real estate, ${data.bedrooms ? data.bedrooms + ' bedroom' : ''}, ${data.bathrooms ? data.bathrooms + ' bathroom' : ''}, ${data.squareFeet ? data.squareFeet + ' square feet' : ''}`,
        canonical: `${window.location.origin}/properties/${data.id}`
      };
    default:
      return {
        title: baseTitle,
        description: baseDesc,
        keywords: "real estate, Laredo, Texas, homes, properties",
        canonical: window.location.origin
      };
  }
}

// Utility to apply meta tags to document head
export function applyMetaTags(tags: {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
}) {
  document.title = tags.title;
  
  // Find or create meta tags
  const metaDesc = document.querySelector('meta[name="description"]') || document.createElement('meta');
  const metaKeywords = document.querySelector('meta[name="keywords"]') || document.createElement('meta');
  const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
  
  // Set attributes
  metaDesc.setAttribute('name', 'description');
  metaDesc.setAttribute('content', tags.description);
  
  metaKeywords.setAttribute('name', 'keywords');
  metaKeywords.setAttribute('content', tags.keywords);
  
  canonical.setAttribute('rel', 'canonical');
  canonical.setAttribute('href', tags.canonical);
  
  // Add to head if needed
  if (!document.querySelector('meta[name="description"]')) {
    document.head.appendChild(metaDesc);
  }
  
  if (!document.querySelector('meta[name="keywords"]')) {
    document.head.appendChild(metaKeywords);
  }
  
  if (!document.querySelector('link[rel="canonical"]')) {
    document.head.appendChild(canonical);
  }
}

// Apply structured data to the page
export function applyStructuredData(data: any) {
  // Remove any existing structured data scripts
  const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
  existingScripts.forEach(script => script.remove());
  
  // Create and add new script
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
}
