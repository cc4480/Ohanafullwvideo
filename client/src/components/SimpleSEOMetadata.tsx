import React from 'react';
import SafeHelmet from './SafeHelmet';

interface SimpleSEOMetadataProps {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogType?: 'website' | 'article' | 'product' | 'profile';
  ogImage?: string;
  ogImageAlt?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  geoPosition?: { lat: number; lng: number };
  geoPlacename?: string;
  geoRegion?: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  structuredData?: Record<string, any>;
  locale?: string;
  siteName?: string;
}

/**
 * A simplified version of the SEO metadata component that avoids Symbol conversion errors
 * while still providing essential SEO capabilities for search engines and social sharing
 */
export default function SimpleSEOMetadata({
  title,
  description,
  keywords,
  canonicalUrl,
  ogType = 'website',
  ogImage,
  ogImageAlt,
  twitterCard = 'summary_large_image',
  twitterSite,
  geoPosition,
  geoPlacename,
  geoRegion,
  author,
  publishedDate,
  modifiedDate,
  structuredData,
  locale = 'en_US',
  siteName = 'Ohana Realty'
}: SimpleSEOMetadataProps) {
  // Safely convert keywords array to string
  const keywordsString = Array.isArray(keywords) ? keywords.join(', ') : '';
  
  // SafeStringify - Safely converts objects to JSON strings avoiding symbol errors
  const safeStringify = (obj: any): string => {
    try {
      // First create a safe copy without any non-serializable values
      const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key: string, value: any) => {
          // Return safe primitives as is
          if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null) {
            return value;
          }
          // Handle non-serializable values
          if (typeof value === 'symbol' || typeof value === 'function' || typeof value === 'undefined') {
            return undefined; // Skip symbols, functions, undefined
          }
          // Handle circular references
          if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
              return '[Circular]';
            }
            seen.add(value);
          }
          return value;
        };
      };
      return JSON.stringify(obj, getCircularReplacer());
    } catch (error) {
      console.error('Error stringifying structured data:', error);
      return '{}';
    }
  };

  // Build meta tags array
  const metaTags = [
    // Basic Meta Tags
    { name: "description", content: description },
    { name: "keywords", content: keywordsString },
    
    // Open Graph / Facebook
    { property: "og:type", content: ogType },
    { property: "og:url", content: canonicalUrl },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:site_name", content: siteName },
    { property: "og:locale", content: locale },
    
    // Twitter
    { name: "twitter:card", content: twitterCard },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];

  // Conditionally add meta tags
  if (ogImage) {
    metaTags.push({ property: "og:image", content: ogImage });
    metaTags.push({ name: "twitter:image", content: ogImage });
  }
  
  if (ogImageAlt) {
    metaTags.push({ property: "og:image:alt", content: ogImageAlt });
  }
  
  if (twitterSite) {
    metaTags.push({ name: "twitter:site", content: twitterSite });
  }
  
  // Geographic Metadata
  if (geoPosition) {
    metaTags.push({ name: "geo.position", content: `${geoPosition.lat};${geoPosition.lng}` });
    
    if (geoPlacename) {
      metaTags.push({ name: "geo.placename", content: geoPlacename });
    }
    
    if (geoRegion) {
      metaTags.push({ name: "geo.region", content: geoRegion });
    }
  }
  
  // Article specific metadata
  if (ogType === 'article') {
    if (author) {
      metaTags.push({ property: "article:author", content: author });
    }
    
    if (publishedDate) {
      metaTags.push({ property: "article:published_time", content: publishedDate });
    }
    
    if (modifiedDate) {
      metaTags.push({ property: "article:modified_time", content: modifiedDate });
    }
  }

  // Build link tags array
  const linkTags = [
    // Canonical URL
    { rel: "canonical", href: canonicalUrl }
  ];

  // Build script tags array
  const scriptTags = structuredData ? [
    // Structured Data / JSON-LD
    {
      type: "application/ld+json",
      innerHTML: safeStringify(structuredData)
    }
  ] : [];

  return (
    <SafeHelmet
      title={title}
      meta={metaTags}
      link={linkTags}
      script={scriptTags}
    />
  );
}