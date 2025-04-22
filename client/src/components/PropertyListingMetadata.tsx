import React from 'react';
import { Helmet } from 'react-helmet';
import { PropertyStructuredData } from './StructuredData';
import SocialShareMetadata from './SocialShareMetadata';
import CanonicalURLs from './CanonicalURLs';
import { Property } from '@shared/schema';

interface PropertyListingMetadataProps {
  /**
   * The property data object
   */
  property: Property;
  
  /**
   * The base URL of the website
   */
  baseUrl: string;
  
  /**
   * Optional broker/agent information
   */
  broker?: {
    name: string;
    url?: string;
    image?: string;
    telephone?: string;
    email?: string;
  };
  
  /**
   * Optional virtual tour video URL
   */
  virtualTourUrl?: string;
  
  /**
   * Optional reviews for the property
   */
  reviews?: Array<{
    author: string;
    datePublished: string;
    reviewBody: string;
    reviewRating: {
      ratingValue: number;
      bestRating?: number;
    };
  }>;
  
  /**
   * Optional alternative language versions
   */
  alternateLocales?: Array<{
    locale: string;
    url: string;
  }>;
}

/**
 * Comprehensive SEO metadata component specifically for real estate property listings
 * Includes all necessary structured data, meta tags, open graph, twitter cards,
 * and semantic HTML attributes for optimal search engine and social media visibility
 */
export default function PropertyListingMetadata({
  property,
  baseUrl,
  broker,
  virtualTourUrl,
  reviews = [],
  alternateLocales = []
}: PropertyListingMetadataProps) {
  // Format price for display - add thousands separators
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(property.price);
  
  // Create the page title with SEO-optimized format
  const title = `${property.bedrooms ? `${property.bedrooms} Bed, ` : ''}${property.bathrooms ? `${property.bathrooms} Bath ` : ''}${property.type} For Sale at ${property.address} | ${formattedPrice}`;
  
  // Create optimized meta description
  const descriptionText = typeof property.description === 'string' ? property.description : '';
  const description = `${property.type} located at ${property.address}, ${property.city}, ${property.state} ${property.zipCode} for ${formattedPrice}. ${descriptionText.slice(0, 120)}${descriptionText.length > 120 ? '...' : ''}`;
  
  // Property URL
  const url = `${baseUrl}/properties/${property.id}`;
  
  // Main image for the property
  const mainImage = property.images && Array.isArray(property.images) && property.images.length > 0 
    ? property.images[0] 
    : `${baseUrl}/placeholder-property.jpg`;
    
  // Calculate property age if year built is available (year built not in current schema)
  const currentYear = new Date().getFullYear();
  
  // Get published and updated dates
  const publishedDate = new Date().toISOString();
  const modifiedDate = new Date().toISOString();
  
  // Keywords based on property features
  const keywords = [
    `${property.type} for sale`,
    `${property.city} real estate`,
    `${property.bedrooms} bedroom house`,
    `${property.bathrooms} bathroom home`,
    `${property.address}`,
    `${property.zipCode} properties`
  ];
  
  return (
    <>
      {/* Basic metadata */}
      <SafeHelmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords.join(', ')} />
        
        {/* Geo metadata for local search */}
        {property.lat && property.lng && (
          <>
            <meta name="geo.position" content={`${property.lat};${property.lng}`} />
            <meta name="geo.placename" content={`${property.city}, ${property.state}`} />
            <meta name="geo.region" content={`US-${property.state}`} />
          </>
        )}
        
        {/* Real estate specific metadata */}
        <meta name="listing:price" content={property.price.toString()} />
        <meta name="listing:availability" content="for_sale" />
        <meta name="listing:type" content={property.type} />
        <meta name="listing:bedrooms" content={property.bedrooms?.toString() || '0'} />
        <meta name="listing:bathrooms" content={property.bathrooms?.toString() || '0'} />
        <meta name="listing:sqft" content={property.squareFeet?.toString() || '0'} />
        <meta name="listing:address" content={property.address} />
        <meta name="listing:city" content={property.city} />
        <meta name="listing:state" content={property.state} />
        <meta name="listing:zipcode" content={property.zipCode} />
        
        {/* NewsArticle compatibility for Google Discover */}
        <meta name="article:published_time" content={publishedDate} />
        <meta name="article:modified_time" content={modifiedDate} />
      </SafeHelmet>
      
      {/* Canonical URL to prevent duplicate content */}
      <CanonicalURLs 
        baseUrl={baseUrl}
        alternateUrls={alternateLocales.reduce((acc, locale) => ({ 
          ...acc, 
          [locale.locale]: locale.url 
        }), {})}
      />
      
      {/* Social sharing metadata */}
      <SocialShareMetadata
        title={title}
        description={description}
        url={url}
        image={mainImage}
        imageAlt={`Property at ${property.address}`}
        type="product"
        price={property.price.toString()}
        currency="USD"
        availability="in stock"
        siteName="Ohana Realty"
        publishedTime={publishedDate}
        modifiedTime={modifiedDate}
        tags={keywords}
      />
      
      {/* Schema.org Structured Data */}
      <PropertyStructuredData
        name={title}
        description={descriptionText}
        url={url}
        image={Array.isArray(property.images) ? property.images : [mainImage]}
        price={property.price}
        priceCurrency="USD"
        addressLocality={property.city}
        addressRegion={property.state}
        postalCode={property.zipCode}
        streetAddress={property.address}
        latitude={property.lat || undefined}
        longitude={property.lng || undefined}
        propertyType={property.type}
        numberOfRooms={property.bedrooms || undefined}
        numberOfBathrooms={property.bathrooms || undefined}
        floorSize={property.squareFeet ? {
          value: property.squareFeet,
          unitCode: "SQFT"
        } : undefined}
        // Property doesn't have yearBuilt in the current schema
        // yearBuilt={property.yearBuilt}
        amenities={Array.isArray(property.features) ? property.features : []}
        broker={broker}
        datePosted={publishedDate}
        dateModified={modifiedDate}
        video={virtualTourUrl}
        reviews={reviews}
      />
    </>
  );
}