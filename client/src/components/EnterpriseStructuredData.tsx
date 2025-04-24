import React from 'react';
import { Helmet } from 'react-helmet';

interface RealEstateListingData {
  id: number;
  name: string;
  description: string;
  url: string;
  price: number;
  priceCurrency?: string;
  images: string[];
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry?: string;
  };
  hasMap?: string;
  floorSize?: {
    value: number;
    unitCode: string;
  };
  numberOfRooms?: number;
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  propertyType?: string;
  yearBuilt?: number;
  amenities?: string[];
  features?: string[];
  publicTransport?: string;
  schoolDistrict?: string;
  geo?: {
    latitude: number;
    longitude: number;
  };
  broker?: {
    name: string;
    image: string;
    email?: string;
    telephone?: string;
    url?: string;
  };
  dateListed?: string;
  dateModified?: string;
  ownershipType?: 'lease' | 'sale';
}

interface LocalBusinessData {
  name: string;
  description: string;
  url: string;
  telephone: string;
  image: string;
  logo: string;
  priceRange?: string;
  email?: string;
  foundingDate?: string;
  founders?: Array<{
    name: string;
    url?: string;
  }>;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: string[];
  paymentAccepted?: string[];
  areaServed?: string[];
  sameAs?: string[];
}

interface FAQData {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

interface BreadcrumbData {
  items: Array<{
    name: string;
    url: string;
    position: number;
  }>;
}

interface ReviewData {
  author: string;
  reviewBody: string;
  reviewRating: number;
  datePublished: string;
  itemReviewed?: {
    name: string;
    image?: string;
  };
}

interface EnterpriseStructuredDataProps {
  /**
   * Type of structured data to generate
   */
  type: 'RealEstateListing' | 'LocalBusiness' | 'FAQ' | 'Breadcrumb' | 'Review' | 'WebSite' | 'Organization' | 'Person' | 'Event' | 'Article' | 'VideoObject' | 'Product';
  
  /**
   * Data for real estate listing
   */
  realEstateListing?: RealEstateListingData;
  
  /**
   * Data for local business
   */
  localBusiness?: LocalBusinessData;
  
  /**
   * Data for FAQ
   */
  faq?: FAQData;
  
  /**
   * Data for breadcrumb
   */
  breadcrumb?: BreadcrumbData;
  
  /**
   * Data for review
   */
  review?: ReviewData;
  
  /**
   * Custom structured data (for advanced use cases)
   */
  customData?: Record<string, any>;
  
  /**
   * Debug mode to output data to console
   */
  debug?: boolean;
}

/**
 * Enterprise Structured Data Generator
 * 
 * This component creates advanced schema.org structured data for
 * rich snippets in search results and other enhanced search features.
 * It supports multiple structured data formats and combines them when appropriate.
 */
export default function EnterpriseStructuredData({ 
  type,
  realEstateListing,
  localBusiness,
  faq,
  breadcrumb,
  review,
  customData,
  debug = false
}: EnterpriseStructuredDataProps) {
  
  /**
   * Generate structured data markup based on the selected type
   */
  const generateStructuredData = () => {
    switch (type) {
      case 'RealEstateListing':
        return generateRealEstateListingSchema();
      case 'LocalBusiness':
        return generateLocalBusinessSchema();
      case 'FAQ':
        return generateFAQSchema();
      case 'Breadcrumb':
        return generateBreadcrumbSchema();
      case 'Review':
        return generateReviewSchema();
      default:
        // If custom data provided, use that
        if (customData) {
          return JSON.stringify(customData);
        }
        return '';
    }
  };
  
  /**
   * Generate schema for real estate listing
   */
  const generateRealEstateListingSchema = () => {
    if (!realEstateListing) return '';
    
    const data = {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      "@id": `${realEstateListing.url}#listing`,
      "name": realEstateListing.name,
      "description": realEstateListing.description,
      "url": realEstateListing.url,
      "datePosted": realEstateListing.dateListed || new Date().toISOString(),
      ...(realEstateListing.dateModified && { "dateModified": realEstateListing.dateModified }),
      
      // Property details
      "address": {
        "@type": "PostalAddress",
        "streetAddress": realEstateListing.address.streetAddress,
        "addressLocality": realEstateListing.address.addressLocality,
        "addressRegion": realEstateListing.address.addressRegion,
        "postalCode": realEstateListing.address.postalCode,
        "addressCountry": realEstateListing.address.addressCountry || "US"
      },
      
      // Price information
      "offers": {
        "@type": "Offer",
        "price": realEstateListing.price,
        "priceCurrency": realEstateListing.priceCurrency || "USD",
        "offeredBy": realEstateListing.broker ? {
          "@type": "RealEstateAgent",
          "name": realEstateListing.broker.name,
          "image": realEstateListing.broker.image,
          ...(realEstateListing.broker.url && { "url": realEstateListing.broker.url }),
          ...(realEstateListing.broker.email && { "email": realEstateListing.broker.email }),
          ...(realEstateListing.broker.telephone && { "telephone": realEstateListing.broker.telephone })
        } : undefined
      },
      
      // Property details
      ...(realEstateListing.floorSize && {
        "floorSize": {
          "@type": "QuantitativeValue",
          "value": realEstateListing.floorSize.value,
          "unitCode": realEstateListing.floorSize.unitCode
        }
      }),
      ...(realEstateListing.numberOfRooms !== undefined && { "numberOfRooms": realEstateListing.numberOfRooms }),
      ...(realEstateListing.numberOfBedrooms !== undefined && { "numberOfBedrooms": realEstateListing.numberOfBedrooms }),
      ...(realEstateListing.numberOfBathrooms !== undefined && { "numberOfBathroomsTotal": realEstateListing.numberOfBathrooms }),
      ...(realEstateListing.yearBuilt && { "yearBuilt": realEstateListing.yearBuilt }),
      ...(realEstateListing.propertyType && { "propertyType": realEstateListing.propertyType }),
      
      // Location information
      ...(realEstateListing.geo && {
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": realEstateListing.geo.latitude,
          "longitude": realEstateListing.geo.longitude
        }
      }),
      ...(realEstateListing.hasMap && { "hasMap": realEstateListing.hasMap }),
      
      // Property features
      ...(realEstateListing.amenities && { "amenityFeature": realEstateListing.amenities.map(amenity => ({
        "@type": "LocationFeatureSpecification",
        "name": amenity,
        "value": true
      }))}),
      
      // Images
      "image": realEstateListing.images.map(img => ({
        "@type": "ImageObject",
        "url": img.startsWith('http') ? img : `https://example.com${img}`,
        "width": 1200,
        "height": 800
      })),
      
      // Additional information
      ...(realEstateListing.publicTransport && { "publicTransport": realEstateListing.publicTransport }),
      ...(realEstateListing.schoolDistrict && { "schoolDistrict": realEstateListing.schoolDistrict }),
      
      // Main entity reference
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": realEstateListing.url
      },
    };
    
    if (debug) {
      console.log('Real Estate Listing Schema:', data);
    }
    
    return JSON.stringify(data);
  };
  
  /**
   * Generate schema for local business
   */
  const generateLocalBusinessSchema = () => {
    if (!localBusiness) return '';
    
    const data = {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "@id": `${localBusiness.url}#business`,
      "name": localBusiness.name,
      "description": localBusiness.description,
      "url": localBusiness.url,
      "telephone": localBusiness.telephone,
      
      // Logo and image
      "logo": {
        "@type": "ImageObject",
        "url": localBusiness.logo,
        "width": 180,
        "height": 60
      },
      "image": localBusiness.image,
      
      // Address
      "address": {
        "@type": "PostalAddress",
        "streetAddress": localBusiness.address.streetAddress,
        "addressLocality": localBusiness.address.addressLocality,
        "addressRegion": localBusiness.address.addressRegion,
        "postalCode": localBusiness.address.postalCode,
        "addressCountry": localBusiness.address.addressCountry
      },
      
      // Additional information
      ...(localBusiness.geo && {
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": localBusiness.geo.latitude,
          "longitude": localBusiness.geo.longitude
        }
      }),
      ...(localBusiness.priceRange && { "priceRange": localBusiness.priceRange }),
      ...(localBusiness.email && { "email": localBusiness.email }),
      ...(localBusiness.foundingDate && { "foundingDate": localBusiness.foundingDate }),
      
      // Founders
      ...(localBusiness.founders && { "founder": localBusiness.founders.map(founder => ({
        "@type": "Person",
        "name": founder.name,
        ...(founder.url && { "url": founder.url })
      }))}),
      
      // Opening hours
      ...(localBusiness.openingHours && { "openingHoursSpecification": localBusiness.openingHours.map(hours => {
        const [day, time] = hours.split(' ');
        const [opens, closes] = time.split('-');
        
        return {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": day,
          "opens": opens,
          "closes": closes
        };
      })}),
      
      // Additional business details
      ...(localBusiness.paymentAccepted && { "paymentAccepted": localBusiness.paymentAccepted.join(', ') }),
      ...(localBusiness.areaServed && { "areaServed": localBusiness.areaServed.map(area => ({
        "@type": "City",
        "name": area
      }))}),
      
      // Social profiles
      ...(localBusiness.sameAs && { "sameAs": localBusiness.sameAs }),
    };
    
    if (debug) {
      console.log('Local Business Schema:', data);
    }
    
    return JSON.stringify(data);
  };
  
  /**
   * Generate schema for FAQ
   */
  const generateFAQSchema = () => {
    if (!faq) return '';
    
    const data = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faq.questions.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };
    
    if (debug) {
      console.log('FAQ Schema:', data);
    }
    
    return JSON.stringify(data);
  };
  
  /**
   * Generate schema for breadcrumb
   */
  const generateBreadcrumbSchema = () => {
    if (!breadcrumb) return '';
    
    const data = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumb.items.map(item => ({
        "@type": "ListItem",
        "position": item.position,
        "name": item.name,
        "item": item.url
      }))
    };
    
    if (debug) {
      console.log('Breadcrumb Schema:', data);
    }
    
    return JSON.stringify(data);
  };
  
  /**
   * Generate schema for review
   */
  const generateReviewSchema = () => {
    if (!review) return '';
    
    const data = {
      "@context": "https://schema.org",
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "reviewBody": review.reviewBody,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.reviewRating,
        "bestRating": 5,
        "worstRating": 1
      },
      "datePublished": review.datePublished,
      ...(review.itemReviewed && {
        "itemReviewed": {
          "@type": "RealEstateListing",
          "name": review.itemReviewed.name,
          ...(review.itemReviewed.image && { "image": review.itemReviewed.image })
        }
      })
    };
    
    if (debug) {
      console.log('Review Schema:', data);
    }
    
    return JSON.stringify(data);
  };
  
  const structuredData = generateStructuredData();
  
  if (!structuredData) return null;
  
  return (
    <Helmet>
      <script type="application/ld+json">
        {structuredData}
      </script>
    </Helmet>
  );
}