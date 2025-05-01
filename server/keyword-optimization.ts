/**
 * Enterprise-grade SEO Keyword Optimization System
 * Drives traffic to outrank all competitors for Laredo real estate search terms
 */

// Primary keywords (high search volume, high competition)
export const PRIMARY_KEYWORDS = [
  'homes for sale in Laredo TX',
  'houses for sale in Laredo',
  'Laredo real estate',
  'Laredo homes for sale',
  'houses for sale Laredo TX',
  'condos for sale in Laredo',
  'Laredo houses for sale',
  'real estate Laredo TX',
  'Laredo houses for rent',
  'homes for rent in Laredo'
];

// Long-tail keywords (lower volume, higher conversion)
export const LONG_TAIL_KEYWORDS = [
  'affordable homes for sale in Laredo TX',
  'houses for sale in Laredo under 200k',
  'luxury houses for sale in Laredo TX',
  'Laredo homes for sale with pool',
  'downtown Laredo condos for sale',
  'Laredo houses for rent pet friendly'
];

// Neighborhood-specific keywords
export const NEIGHBORHOOD_KEYWORDS = [
  'Downtown Laredo real estate',
  'North Laredo homes for sale',
  'South Laredo houses',
  'East Laredo properties',
  'West Laredo homes for rent'
];

// Competitor-targeted keywords
export const COMPETITOR_KEYWORDS = [
  'better than Coldwell Banker Laredo',
  'Laredo real estate alternatives to RE/MAX',
  'why choose Ohana Realty over Coldwell Banker',
  'Ohana Realty vs RE/MAX Laredo',
  'best real estate agency in Laredo TX',
  'top rated Laredo realtors'
];

// Market-specific keywords
export const MARKET_KEYWORDS = [
  'Laredo TX housing market',
  'Laredo real estate market trends',
  'Laredo home values',
  'Laredo property appreciation',
  'buying a house in Laredo',
  'selling a home in Laredo TX',
  'Laredo investment properties'
];

// Property feature keywords
export const FEATURE_KEYWORDS = [
  'Laredo homes with big yards',
  'houses with swimming pools Laredo',
  'Laredo homes with garage',
  'new construction homes in Laredo',
  'open floor plan houses Laredo',
  'Laredo houses with guest house',
  'smart homes Laredo TX'
];

/**
 * Generates optimized SEO meta tags for different page types
 * @param pageType - Type of page (home, property, neighborhood, etc.)
 * @param specificData - Data specific to the page
 * @returns SEO meta tags object
 */
export function generateSEOMetaTags(pageType: string, specificData?: any) {
  const baseTags = {
    title: 'Ohana Realty | Premier Real Estate in Laredo, TX',
    description: 'Find your dream home in Laredo with Ohana Realty. Browse exclusive listings of homes, condos, and investment properties in Laredo, TX.',
    keywords: PRIMARY_KEYWORDS.join(', '),
    canonical: 'https://ohanarealty.com',
    ogTitle: 'Ohana Realty | Premier Real Estate in Laredo, TX',
    ogDescription: 'Find your dream home in Laredo with Ohana Realty. Browse exclusive listings of homes, condos, and investment properties in Laredo, TX.',
    ogImage: 'https://ohanarealty.com/images/social-share.jpg',
    ogUrl: 'https://ohanarealty.com',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Ohana Realty | Premier Real Estate in Laredo, TX',
    twitterDescription: 'Find your dream home in Laredo with Ohana Realty. Browse exclusive listings of homes, condos, and investment properties in Laredo, TX.',
    twitterImage: 'https://ohanarealty.com/images/social-share.jpg'
  };

  if (pageType === 'home') {
    // Home page gets the most competitive keywords
    return {
      ...baseTags,
      title: 'Ohana Realty | #1 Real Estate Agency in Laredo, TX',
      description: 'Find your dream home in Laredo with the #1 rated real estate agency. Browse exclusive listings of homes, houses, condos, and investment properties in Laredo, TX.',
      keywords: [...PRIMARY_KEYWORDS, ...COMPETITOR_KEYWORDS.slice(0, 3)].join(', '),
      ogTitle: 'Ohana Realty | #1 Real Estate Agency in Laredo, TX',
      ogDescription: 'Find your dream home in Laredo with the #1 rated real estate agency. Browse exclusive listings of homes, houses, condos, and investment properties in Laredo, TX.',
      twitterTitle: 'Ohana Realty | #1 Real Estate Agency in Laredo, TX',
      twitterDescription: 'Find your dream home in Laredo with the #1 rated real estate agency. Browse exclusive listings of homes, houses, condos, and investment properties in Laredo, TX.'
    };
  }

  if (pageType === 'property' && specificData) {
    const { type, bedrooms, bathrooms, address, city, state } = specificData;
    const propertyTitle = `${bedrooms} Bed, ${bathrooms} Bath ${type} for Sale | ${address}, ${city}, ${state}`;
    const propertyDescription = `Beautiful ${bedrooms} bedroom, ${bathrooms} bathroom ${type.toLowerCase()} for sale at ${address}, ${city}, ${state}. Contact Ohana Realty today!`;
    const propertyKeywords = [`${bedrooms} bedroom homes in Laredo`, `${type} for sale in Laredo`, `homes for sale in ${city}`, `Laredo ${type} with ${bedrooms} bedrooms`];
    
    return {
      ...baseTags,
      title: propertyTitle,
      description: propertyDescription,
      keywords: [...propertyKeywords, ...PRIMARY_KEYWORDS.slice(0, 3)].join(', '),
      canonical: `https://ohanarealty.com/properties/${specificData.id}`,
      ogTitle: propertyTitle,
      ogDescription: propertyDescription,
      ogUrl: `https://ohanarealty.com/properties/${specificData.id}`,
      twitterTitle: propertyTitle,
      twitterDescription: propertyDescription
    };
  }

  if (pageType === 'neighborhood' && specificData) {
    const { name, city, state, description } = specificData;
    const shortDesc = description.substring(0, 160);
    const neighborhoodTitle = `${name} Real Estate & Homes For Sale | ${city}, ${state}`;
    const neighborhoodDescription = `Explore ${name} real estate in ${city}, ${state}. ${shortDesc}`;
    const neighborhoodKeywords = [`${name} homes for sale`, `${name} real estate`, `${name} houses ${city}`, `${name} ${city} properties`];
    
    return {
      ...baseTags,
      title: neighborhoodTitle,
      description: neighborhoodDescription,
      keywords: [...neighborhoodKeywords, ...NEIGHBORHOOD_KEYWORDS.slice(0, 2)].join(', '),
      canonical: `https://ohanarealty.com/neighborhoods/${specificData.id}`,
      ogTitle: neighborhoodTitle,
      ogDescription: neighborhoodDescription,
      ogUrl: `https://ohanarealty.com/neighborhoods/${specificData.id}`,
      twitterTitle: neighborhoodTitle,
      twitterDescription: neighborhoodDescription
    };
  }

  if (pageType === 'airbnb' && specificData) {
    const { title, bedrooms, bathrooms, city, state } = specificData;
    const rentalTitle = `${title} | ${bedrooms} Bed, ${bathrooms} Bath Vacation Rental in ${city}, ${state}`;
    const rentalDescription = `Book this beautiful ${bedrooms} bedroom, ${bathrooms} bathroom vacation rental in ${city}, ${state}. Perfect for your stay in Laredo!`;
    const rentalKeywords = [`vacation rentals in Laredo`, `Laredo Airbnb`, `short term rental ${city}`, `${bedrooms} bedroom rental Laredo`];
    
    return {
      ...baseTags,
      title: rentalTitle,
      description: rentalDescription,
      keywords: rentalKeywords.join(', '),
      canonical: `https://ohanarealty.com/rentals/${specificData.id}`,
      ogTitle: rentalTitle,
      ogDescription: rentalDescription,
      ogUrl: `https://ohanarealty.com/rentals/${specificData.id}`,
      twitterTitle: rentalTitle,
      twitterDescription: rentalDescription
    };
  }

  // Return base tags for other page types
  return baseTags;
}

/**
 * Generates structured data for different page types
 * Implements JSON-LD for rich search results
 * @param pageType - Type of page (home, property, neighborhood, etc.)
 * @param data - Data specific to the page
 * @returns JSON-LD structured data
 */
export function generateStructuredData(pageType: string, data?: any) {
  const baseData = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgency",
    "name": "Ohana Realty",
    "url": "https://ohanarealty.com",
    "logo": "https://ohanarealty.com/images/logo.png",
    "sameAs": [
      "https://www.facebook.com/ohanarealty",
      "https://www.instagram.com/ohanarealty",
      "https://twitter.com/ohanarealty"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "9901 McPherson Rd, Suite 202",
      "addressLocality": "Laredo",
      "addressRegion": "TX",
      "postalCode": "78045",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 27.5514,
      "longitude": -99.5044
    },
    "telephone": "+12105551234",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "10:00",
        "closes": "15:00"
      }
    ],
    "priceRange": "$$"
  };

  if (pageType === 'home') {
    return baseData;
  }

  if (pageType === 'property' && data) {
    return {
      "@context": "https://schema.org",
      "@type": "Residence",
      "name": `${data.bedrooms} Bed, ${data.bathrooms} Bath ${data.type} in ${data.city}`,
      "description": data.description,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": data.address,
        "addressLocality": data.city,
        "addressRegion": data.state,
        "postalCode": data.zipCode,
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": data.lat,
        "longitude": data.lng
      },
      "numberOfRooms": data.bedrooms,
      "floorSize": {
        "@type": "QuantitativeValue",
        "value": data.squareFeet,
        "unitCode": "SQFT"
      },
      "offers": {
        "@type": "Offer",
        "price": data.price,
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "image": data.images ? data.images[0] : null,
      "url": `https://ohanarealty.com/properties/${data.id}`
    };
  }

  if (pageType === 'neighborhood' && data) {
    return {
      "@context": "https://schema.org",
      "@type": "Place",
      "name": `${data.name} Neighborhood in ${data.city}`,
      "description": data.description,
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": data.lat,
        "longitude": data.lng
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": data.city,
        "addressRegion": data.state,
        "postalCode": data.zipCode,
        "addressCountry": "US"
      },
      "image": data.image,
      "url": `https://ohanarealty.com/neighborhoods/${data.id}`
    };
  }

  return baseData;
}

/**
 * Optimizes page content based on primary and secondary keywords
 * @param content - Original content
 * @param primaryKeyword - Main target keyword
 * @param secondaryKeywords - Additional target keywords
 * @returns Optimized content
 */
export function optimizeContent(content: string, primaryKeyword: string, secondaryKeywords: string[] = []) {
  // Ensure primary keyword is in the first 100 characters
  let optimizedContent = content;
  const firstSection = content.substring(0, 100);
  
  if (!firstSection.toLowerCase().includes(primaryKeyword.toLowerCase())) {
    // Add primary keyword to the beginning if not present
    optimizedContent = `${primaryKeyword} - ${content}`;
  }
  
  // Check for secondary keywords and add if missing
  secondaryKeywords.forEach(keyword => {
    if (!optimizedContent.toLowerCase().includes(keyword.toLowerCase())) {
      // Add secondary keyword naturally within the content
      const sentences = optimizedContent.split('. ');
      if (sentences.length > 3) {
        const insertPosition = Math.floor(sentences.length / 2);
        sentences[insertPosition] = `${sentences[insertPosition]} including ${keyword}`;
        optimizedContent = sentences.join('. ');
      } else {
        optimizedContent = `${optimizedContent} Find out more about ${keyword}.`;
      }
    }
  });
  
  return optimizedContent;
}

/**
 * Generates an optimized page title with primary keyword focus
 * @param baseTitle - Basic title to optimize
 * @param primaryKeyword - Main target keyword
 * @returns SEO-optimized title
 */
export function generateOptimizedTitle(baseTitle: string, primaryKeyword: string) {
  if (baseTitle.toLowerCase().includes(primaryKeyword.toLowerCase())) {
    return baseTitle;
  }
  
  // Ensure title includes primary keyword
  return `${baseTitle} | ${primaryKeyword}`;
}

/**
 * Calculates SEO score for content based on keyword density and placement
 * @param content - Content to analyze
 * @param primaryKeyword - Main target keyword
 * @param secondaryKeywords - Additional target keywords
 * @returns SEO score (0-100)
 */
export function calculateSEOScore(content: string, primaryKeyword: string, secondaryKeywords: string[] = []) {
  let score = 0;
  const contentLower = content.toLowerCase();
  const primaryLower = primaryKeyword.toLowerCase();
  
  // Primary keyword checks (up to 50 points)
  if (contentLower.includes(primaryLower)) {
    score += 20; // Primary keyword exists
    
    // Primary keyword in first 100 chars (high value)
    if (contentLower.substring(0, 100).includes(primaryLower)) {
      score += 15;
    }
    
    // Primary keyword repeated 2-4 times (optimal density)
    const primaryMatches = contentLower.split(primaryLower).length - 1;
    if (primaryMatches >= 2 && primaryMatches <= 4) {
      score += 15;
    } else if (primaryMatches > 4) {
      score += 5; // Over-optimization penalty
    }
  }
  
  // Secondary keywords checks (up to 30 points)
  let secondaryScore = 0;
  secondaryKeywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    if (contentLower.includes(keywordLower)) {
      secondaryScore += 10;
      
      // Bonus for keyword in ideal positions (headings, first/last paragraphs)
      if (contentLower.substring(0, 200).includes(keywordLower) || 
          contentLower.substring(contentLower.length - 200).includes(keywordLower)) {
        secondaryScore += 5;
      }
    }
  });
  
  // Cap secondary score at 30
  score += Math.min(secondaryScore, 30);
  
  // Content length analysis (up to 20 points)
  const wordCount = content.split(/\s+/).length;
  if (wordCount >= 300 && wordCount <= 1000) {
    score += 20;
  } else if (wordCount > 1000) {
    score += 15;
  } else if (wordCount >= 100) {
    score += 10;
  } else {
    score += 5;
  }
  
  return Math.min(score, 100); // Cap at 100
}
