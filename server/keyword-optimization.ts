/**
 * Keyword Optimization System
 * Provides advanced SEO optimization capabilities for real estate listings
 */

// Primary real estate keywords for Laredo, TX
export const PRIMARY_KEYWORDS = [
  'homes for sale in laredo',
  'houses for sale in laredo',
  'houses for rent in laredo',
  'condos for rent in laredo',
  'laredo real estate',
  'laredo real estate agents',
  'laredo property search',
  'buy house in laredo',
  'laredo homes',
  'laredo houses',
  'real estate listings laredo',
];

// Long-tail keywords with higher conversion potential
export const LONG_TAIL_KEYWORDS = [
  'affordable homes in laredo texas',
  'luxury homes for sale laredo',
  'new construction homes laredo tx',
  'waterfront properties laredo',
  'gated community homes laredo',
  'laredo houses with pool',
  'laredo houses with large yard',
  'best neighborhoods to live in laredo',
  'laredo homes near schools',
  'laredo homes under 200k',
  'townhomes for sale in laredo',
  'investment properties laredo',
  'airbnb rentals laredo',
];

// Neighborhood-specific keywords
export const NEIGHBORHOOD_KEYWORDS = [
  'del mar hills laredo homes',
  'alexander estates laredo houses',
  'la bota ranch homes',
  'lakeside laredo real estate',
  'casa bella laredo homes for sale',
  'north central laredo homes',
  'san isidro northeast laredo houses',
  'cielito lindo laredo real estate',
  'plantation homes laredo',
  'united heights laredo homes',
  'fremont homes for sale laredo',
];

// Competitor-focused keywords
export const COMPETITOR_KEYWORDS = [
  'better than coldwell banker laredo',
  'alternative to remax laredo',
  'better than zillow laredo',
  'top laredo real estate company',
  'best real estate agency laredo',
  'top rated realtors laredo',
  'trusted real estate agents laredo',
  'highest rated real estate laredo',
];

// Market condition keywords
export const MARKET_KEYWORDS = [
  'laredo housing market',
  'laredo real estate market trends',
  'laredo home values',
  'property appreciation laredo',
  'laredo housing forecast',
  'laredo real estate investment',
  'is laredo a good place to buy property',
];

// Property feature keywords
export const FEATURE_KEYWORDS = [
  'houses with pool laredo',
  'laredo houses with garage',
  'laredo homes with large yard',
  'open floor plan homes laredo',
  'smart homes laredo',
  'energy efficient homes laredo',
  'newly renovated houses laredo',
  'modern houses in laredo',
  'homes with office laredo',
];

/**
 * Generates optimized SEO meta tags for different page types
 * @param pageType - Type of page (home, property, neighborhood, etc.)
 * @param specificData - Data specific to the page
 * @returns SEO meta tags object
 */
export function generateSEOMetaTags(pageType: string, specificData?: any) {
  // Base values
  let title = 'Ohana Realty | Premier Real Estate in Laredo, TX';
  let description = 'Find your dream home in Laredo with Ohana Realty. Browse exclusive listings, neighborhoods, and expert real estate services to buy, sell, or rent properties in Laredo, Texas.';
  let keywords = PRIMARY_KEYWORDS.join(', ');
  let ogTitle = title;
  let ogDescription = description;
  let ogImage = 'https://ohanarealty.com/images/og-default.jpg';
  let ogUrl = 'https://ohanarealty.com';
  let canonical = 'https://ohanarealty.com';
  let twitterCard = 'summary_large_image';
  let twitterTitle = title;
  let twitterDescription = description;
  let twitterImage = ogImage;
  
  // Customize based on page type
  switch(pageType) {
    case 'home':
      // Homepage is already covered by default values
      canonical = 'https://ohanarealty.com';
      ogUrl = canonical;
      break;
      
    case 'property':
      if (specificData) {
        const { address, city, state, price, bedrooms, bathrooms, squareFeet, type, features } = specificData;
        const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
        
        // Create optimized title with primary features
        title = `${bedrooms} Bed, ${bathrooms} Bath ${type} for Sale | ${address}, ${city} | Ohana Realty`;
        description = `Explore this beautiful ${squareFeet} sq ft ${type.toLowerCase()} at ${address}, ${city}, ${state}. Features include ${bedrooms} bedrooms, ${bathrooms} bathrooms, and ${features ? Array.isArray(features) && features.length > 0 ? features.slice(0, 3).join(', ') : 'modern amenities' : 'modern amenities'}. Priced at ${formattedPrice}.`;
        
        // Generate relevant keywords
        const propertyKeywords = [
          `${bedrooms} bedroom house ${city}`,
          `${type.toLowerCase()} for sale ${city}`,
          `homes in ${city}`,
          `${city} real estate`,
          `houses for sale in ${city}`,
          `${squareFeet} square foot home ${city}`,
          `${formattedPrice.replace('$', '').replace(',', '')} house ${city}`
        ];
        keywords = propertyKeywords.join(', ');
        
        // Social media optimizations
        ogTitle = `${bedrooms} Bed ${type} for Sale in ${city} | ${formattedPrice}`;
        ogDescription = description;
        ogImage = specificData.images && specificData.images.length > 0 ? specificData.images[0] : ogImage;
        ogUrl = `https://ohanarealty.com/properties/${specificData.id}`;
        canonical = ogUrl;
        twitterTitle = ogTitle;
        twitterDescription = ogDescription;
        twitterImage = ogImage;
      }
      break;
      
    case 'neighborhood':
      if (specificData) {
        const { name, city, state, features, amenities } = specificData;
        
        title = `${name} Neighborhood | Homes for Sale in ${city}, ${state} | Ohana Realty`;
        description = `Discover ${name}, a premier neighborhood in ${city}, ${state}. View homes for sale, community amenities, and neighborhood information. ${amenities ? Array.isArray(amenities) && amenities.length > 0 ? 'Amenities include ' + amenities.slice(0, 3).join(', ') + '.' : '' : ''}`;
        
        const neighborhoodKeywords = [
          `${name} ${city}`,
          `${name} homes for sale`,
          `${name} real estate`,
          `${name} ${city} houses`,
          `${name} neighborhood ${city}`,
          `living in ${name} ${city}`,
          `${name} community ${city}`
        ];
        keywords = neighborhoodKeywords.join(', ');
        
        ogTitle = `${name} - Exclusive Neighborhood in ${city}, ${state}`;
        ogDescription = description;
        ogImage = specificData.image || ogImage;
        ogUrl = `https://ohanarealty.com/neighborhoods/${specificData.id}`;
        canonical = ogUrl;
        twitterTitle = ogTitle;
        twitterDescription = ogDescription;
        twitterImage = ogImage;
      }
      break;

    case 'airbnb':
      if (specificData) {
        const { title: rentalTitle, address, city, state, price, bedrooms, bathrooms, maxGuests, amenities } = specificData;
        const nightlyRate = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
        
        title = `${rentalTitle} | Vacation Rental in ${city}, ${state} | Ohana Realty`;
        description = `Stay at this beautiful ${bedrooms} bedroom vacation rental in ${city}, ${state}. Accommodates up to ${maxGuests} guests with ${bathrooms} bathrooms. ${amenities ? Array.isArray(amenities) && amenities.length > 0 ? 'Amenities include ' + amenities.slice(0, 3).join(', ') + '.' : '' : ''} ${nightlyRate} per night.`;
        
        const rentalKeywords = [
          `vacation rental ${city}`,
          `airbnb ${city}`,
          `${bedrooms} bedroom rental ${city}`,
          `${city} vacation home`,
          `rental for ${maxGuests} people ${city}`,
          `short term rental ${city}`,
          `luxury vacation rental ${city}`
        ];
        keywords = rentalKeywords.join(', ');
        
        ogTitle = `${rentalTitle} - ${nightlyRate}/night in ${city}`;
        ogDescription = description;
        ogImage = specificData.images && specificData.images.length > 0 ? specificData.images[0] : ogImage;
        ogUrl = `https://ohanarealty.com/rentals/${specificData.id}`;
        canonical = ogUrl;
        twitterTitle = ogTitle;
        twitterDescription = ogDescription;
        twitterImage = ogImage;
      }
      break;
    
    case 'blog':
      if (specificData) {
        const { title: blogTitle, excerpt, category, image } = specificData;
        
        title = `${blogTitle} | Ohana Realty Blog`;
        description = excerpt || `Read our insights on ${blogTitle} in the Ohana Realty blog.`;
        
        const blogKeywords = [
          `${category?.toLowerCase()} laredo`,
          `laredo real estate ${category?.toLowerCase()}`,
          `laredo ${category?.toLowerCase()} advice`,
          `${category?.toLowerCase()} tips laredo`,
          `laredo homes ${category?.toLowerCase()}`
        ];
        keywords = blogKeywords.join(', ');
        
        ogTitle = blogTitle;
        ogDescription = description;
        ogImage = image || ogImage;
        ogUrl = `https://ohanarealty.com/blog/${specificData.slug}`;
        canonical = ogUrl;
        twitterTitle = ogTitle;
        twitterDescription = ogDescription;
        twitterImage = ogImage;
      } else {
        title = 'Real Estate Blog | Laredo TX Property Insights | Ohana Realty';
        description = 'Explore the latest real estate insights, market trends, and home buying tips for Laredo, TX in the Ohana Realty blog.';
        canonical = 'https://ohanarealty.com/blog';
        ogUrl = canonical;
      }
      break;
      
    case 'contact':
      title = 'Contact Ohana Realty | Premier Laredo Real Estate Agents';
      description = 'Connect with Ohana Realty\'s expert team of real estate professionals in Laredo, TX. We\'re here to help with all your property needs.';
      keywords = 'laredo real estate agents, contact real estate agent laredo, ohana realty contact, laredo realtor contact, real estate help laredo';
      ogTitle = title;
      ogDescription = description;
      ogUrl = 'https://ohanarealty.com/contact';
      canonical = ogUrl;
      twitterTitle = ogTitle;
      twitterDescription = ogDescription;
      break;
      
    case 'about':
      title = 'About Ohana Realty | Leading Real Estate Company in Laredo, TX';
      description = 'Learn about Ohana Realty, the premier real estate company in Laredo. Meet our team of expert agents dedicated to helping you find your perfect home.';
      keywords = 'about ohana realty, laredo real estate company, top realtors laredo, best real estate agents laredo, laredo property experts';
      ogTitle = title;
      ogDescription = description;
      ogUrl = 'https://ohanarealty.com/about';
      canonical = ogUrl;
      twitterTitle = ogTitle;
      twitterDescription = ogDescription;
      break;
  }
  
  return {
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    canonical,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage
  };
}

/**
 * Generates structured data for different page types
 * Implements JSON-LD for rich search results
 * @param pageType - Type of page (home, property, neighborhood, etc.)
 * @param data - Data specific to the page
 * @returns JSON-LD structured data
 */
export function generateStructuredData(pageType: string, data?: any) {
  // Base organization structured data
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Ohana Realty",
    "logo": "https://ohanarealty.com/images/logo.png",
    "url": "https://ohanarealty.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "5214 San Bernardo Ave",
      "addressLocality": "Laredo",
      "addressRegion": "TX",
      "postalCode": "78041",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 27.5305,
      "longitude": -99.5039
    },
    "telephone": "+19561234567",
    "email": "info@ohanarealty.com",
    "sameAs": [
      "https://www.facebook.com/ohanarealty",
      "https://www.instagram.com/ohanarealty",
      "https://www.linkedin.com/company/ohanarealty"
    ],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "10:00",
        "closes": "16:00"
      }
    ]
  };
  
  // Customize based on page type
  switch(pageType) {
    case 'home':
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Ohana Realty",
        "url": "https://ohanarealty.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://ohanarealty.com/properties?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      };
      
    case 'property':
      if (data) {
        const { id, address, city, state, zipCode, price, bedrooms, bathrooms, squareFeet, description, type, images, status, yearBuilt, parkingSpaces, lat, lng } = data;
        
        return {
          "@context": "https://schema.org",
          "@type": "RealEstateListing",
          "url": `https://ohanarealty.com/properties/${id}`,
          "name": `${bedrooms} Bedroom ${type} in ${city}, ${state}`,
          "description": description,
          "image": images && images.length > 0 ? images : undefined,
          "offers": {
            "@type": "Offer",
            "price": price,
            "priceCurrency": "USD",
            "availability": status === 'active' ? "http://schema.org/InStock" : "http://schema.org/SoldOut"
          },
          "geo": lat && lng ? {
            "@type": "GeoCoordinates",
            "latitude": lat,
            "longitude": lng
          } : undefined,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": address,
            "addressLocality": city,
            "addressRegion": state,
            "postalCode": zipCode,
            "addressCountry": "US"
          },
          "numberOfRooms": bedrooms,
          "floorSize": {
            "@type": "QuantitativeValue",
            "value": squareFeet,
            "unitCode": "SQFT"
          },
          "numberOfBathroomsTotal": bathrooms,
          "yearBuilt": yearBuilt,
          "amenityFeature": [
            {
              "@type": "LocationFeatureSpecification",
              "name": "Bedrooms",
              "value": bedrooms
            },
            {
              "@type": "LocationFeatureSpecification",
              "name": "Bathrooms",
              "value": bathrooms
            },
            {
              "@type": "LocationFeatureSpecification",
              "name": "Square Feet",
              "value": squareFeet
            },
            parkingSpaces ? {
              "@type": "LocationFeatureSpecification",
              "name": "Parking Spaces",
              "value": parkingSpaces
            } : undefined
          ].filter(Boolean),
          "broker": organizationData
        };
      }
      return organizationData;
      
    case 'neighborhood':
      if (data) {
        const { id, name, description, city, state, zipCode, amenities, lat, lng, image } = data;
        
        return {
          "@context": "https://schema.org",
          "@type": "Place",
          "name": name,
          "description": description,
          "url": `https://ohanarealty.com/neighborhoods/${id}`,
          "image": image,
          "geo": lat && lng ? {
            "@type": "GeoCoordinates",
            "latitude": lat,
            "longitude": lng
          } : undefined,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": city,
            "addressRegion": state,
            "postalCode": zipCode,
            "addressCountry": "US"
          },
          "amenityFeature": amenities && Array.isArray(amenities) ? amenities.map((amenity: string) => ({
            "@type": "LocationFeatureSpecification",
            "name": amenity,
            "value": true
          })) : undefined
        };
      }
      return organizationData;

    case 'airbnb':
      if (data) {
        const { id, title, address, city, state, zipCode, price, bedrooms, bathrooms, maxGuests, description, amenities, images, lat, lng } = data;
        
        return {
          "@context": "https://schema.org",
          "@type": "LodgingBusiness",
          "name": title,
          "description": description,
          "url": `https://ohanarealty.com/rentals/${id}`,
          "image": images && Array.isArray(images) && images.length > 0 ? images : undefined,
          "priceRange": `$${price} per night`,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": address,
            "addressLocality": city,
            "addressRegion": state,
            "postalCode": zipCode,
            "addressCountry": "US"
          },
          "geo": lat && lng ? {
            "@type": "GeoCoordinates",
            "latitude": lat,
            "longitude": lng
          } : undefined,
          "amenityFeature": amenities && Array.isArray(amenities) ? amenities.map((amenity: string) => ({
            "@type": "LocationFeatureSpecification",
            "name": amenity,
            "value": true
          })) : [],
          "numberOfRooms": bedrooms,
          "petsAllowed": amenities && Array.isArray(amenities) ? amenities.some((a: string) => a.toLowerCase().includes('pet') || a.toLowerCase().includes('dog') || a.toLowerCase().includes('cat')) : false,
          "maximumAttendeeCapacity": maxGuests
        };
      }
      return organizationData;
      
    case 'blog':
      if (data) {
        const { title, content, author, publishDate, updateDate, image, slug, category } = data;
        
        return {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": title,
          "name": title,
          "description": content && typeof content === 'string' ? content.substring(0, 150) + '...' : '',
          "datePublished": publishDate,
          "dateModified": updateDate || publishDate,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://ohanarealty.com/blog/${slug}`
          },
          "image": image,
          "author": author ? {
            "@type": "Person",
            "name": author.name,
            "url": author.url
          } : undefined,
          "publisher": organizationData,
          "keywords": category
        };
      }
      return {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "Ohana Realty Blog",
        "url": "https://ohanarealty.com/blog",
        "description": "Real estate insights, market trends, and home buying tips for Laredo, TX",
        "publisher": organizationData
      };
    
    case 'contact':
      return {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact Ohana Realty",
        "url": "https://ohanarealty.com/contact",
        "description": "Contact our team of real estate professionals in Laredo, TX",
        "mainEntity": organizationData
      };
      
    case 'about':
      return {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "About Ohana Realty",
        "url": "https://ohanarealty.com/about",
        "description": "Learn about Ohana Realty, the premier real estate company in Laredo",
        "mainEntity": organizationData
      };
      
    default:
      return organizationData;
  }
}

/**
 * Optimizes content based on primary and secondary keywords
 * @param content - Original content
 * @param primaryKeyword - Main target keyword
 * @param secondaryKeywords - Additional target keywords
 * @returns Optimized content
 */
export function optimizeContent(content: string, primaryKeyword: string, secondaryKeywords: string[] = []) {
  let optimizedContent = content;
  
  // Ensure primary keyword appears in the first paragraph
  // This is important for SEO as Google places more weight on early content
  const paragraphs = optimizedContent.split('\n\n');
  if (paragraphs.length > 0 && !paragraphs[0].toLowerCase().includes(primaryKeyword.toLowerCase())) {
    // If not already present, try to naturally insert it
    const firstParagraph = paragraphs[0];
    if (firstParagraph.length > 200) {
      // For longer paragraphs, try to insert in the second sentence
      const sentences = firstParagraph.split('. ');
      if (sentences.length > 1) {
        // Insert into second sentence if possible
        const modifiedSentence = sentences[1].replace(
          /^((?:\w+\s){0,3}\w+)/, // Match first few words
          `$1 ${primaryKeyword} `
        );
        sentences[1] = modifiedSentence;
        paragraphs[0] = sentences.join('. ');
      }
    } else {
      // For shorter paragraphs, append to the end
      paragraphs[0] = `${firstParagraph}. This is ideal for those looking for ${primaryKeyword}.`;
    }
    optimizedContent = paragraphs.join('\n\n');
  }
  
  // Ensure secondary keywords are distributed throughout the content
  // with a natural keyword density
  if (secondaryKeywords.length > 0) {
    let remaining = [...secondaryKeywords];
    
    // Try to place one keyword per paragraph where appropriate
    for (let i = 1; i < paragraphs.length && remaining.length > 0; i++) {
      // Skip paragraphs that are too short
      if (paragraphs[i].length < 80) continue;
      
      // Check if paragraph already contains any of the keywords
      const alreadyContains = remaining.some(kw => paragraphs[i].toLowerCase().includes(kw.toLowerCase()));
      if (!alreadyContains) {
        const keyword = remaining.shift();
        if (keyword) {
          // Try to insert naturally
          const sentences = paragraphs[i].split('. ');
          if (sentences.length > 1) {
            // Pick a random sentence after the first one
            const sentenceIndex = Math.floor(Math.random() * (sentences.length - 1)) + 1;
            sentences[sentenceIndex] = sentences[sentenceIndex].replace(
              /\.$/, // End of sentence
              `, which is perfect for ${keyword}.`
            );
            paragraphs[i] = sentences.join('. ');
          } else {
            // Append to the paragraph
            paragraphs[i] = `${paragraphs[i]} This area is known for ${keyword}.`;
          }
        }
      }
    }
    
    optimizedContent = paragraphs.join('\n\n');
  }
  
  return optimizedContent;
}

/**
 * Generates an optimized page title with primary keyword focus
 * @param baseTitle - Basic title to optimize
 * @param primaryKeyword - Main target keyword
 * @returns SEO-optimized title
 */
export function generateOptimizedTitle(baseTitle: string, primaryKeyword: string) {
  // If the keyword is already in the title, return as is
  if (baseTitle.toLowerCase().includes(primaryKeyword.toLowerCase())) {
    return baseTitle;
  }
  
  // If the title is short, append the keyword
  if (baseTitle.length < 40) {
    return `${baseTitle} | ${primaryKeyword.charAt(0).toUpperCase() + primaryKeyword.slice(1)}`;
  }
  
  // If the title is longer, try to insert naturally
  const titleParts = baseTitle.split(' | ');
  if (titleParts.length > 1) {
    // Insert before the brand name
    titleParts.splice(titleParts.length - 1, 0, primaryKeyword.charAt(0).toUpperCase() + primaryKeyword.slice(1));
    return titleParts.join(' | ');
  }
  
  // Default fallback
  return `${baseTitle} - ${primaryKeyword.charAt(0).toUpperCase() + primaryKeyword.slice(1)}`;
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
  const lowerContent = content.toLowerCase();
  const contentLength = content.length;
  const wordCount = content.split(/\s+/).length;
  
  // Check if content is substantial enough
  if (wordCount < 300) {
    score += 5; // Minimal score for short content
  } else if (wordCount >= 300 && wordCount < 600) {
    score += 15;
  } else if (wordCount >= 600 && wordCount < 1000) {
    score += 25;
  } else {
    score += 30; // Maximum score for content length
  }
  
  // Check primary keyword presence and density
  const primaryMatches = (lowerContent.match(new RegExp(primaryKeyword.toLowerCase(), 'g')) || []).length;
  const primaryDensity = (primaryMatches / wordCount) * 100;
  
  if (primaryMatches === 0) {
    // No primary keyword
    score += 0;
  } else if (primaryDensity < 0.5) {
    // Too low density
    score += 10;
  } else if (primaryDensity >= 0.5 && primaryDensity <= 2.5) {
    // Optimal density
    score += 25;
  } else if (primaryDensity > 2.5 && primaryDensity <= 4) {
    // Slightly overstuffed
    score += 15;
  } else {
    // Keyword stuffing
    score += 5;
  }
  
  // Check if primary keyword is in the first paragraph
  const firstParagraph = content.split('\n\n')[0].toLowerCase();
  if (firstParagraph.includes(primaryKeyword.toLowerCase())) {
    score += 15;
  }
  
  // Check secondary keywords presence
  let secondaryMatches = 0;
  secondaryKeywords.forEach(keyword => {
    if (lowerContent.includes(keyword.toLowerCase())) {
      secondaryMatches++;
    }
  });
  
  const secondaryMatchPercentage = secondaryKeywords.length > 0 ? 
    (secondaryMatches / secondaryKeywords.length) * 100 : 0;
  
  if (secondaryMatchPercentage >= 80) {
    score += 20;
  } else if (secondaryMatchPercentage >= 50) {
    score += 15;
  } else if (secondaryMatchPercentage >= 30) {
    score += 10;
  } else if (secondaryMatchPercentage > 0) {
    score += 5;
  }
  
  // Check for header tags usage
  const h1Count = (content.match(/<h1/g) || []).length;
  const h2Count = (content.match(/<h2/g) || []).length;
  const h3Count = (content.match(/<h3/g) || []).length;
  
  if (h1Count === 1 && h2Count >= 2 && h3Count >= 2) {
    score += 10; // Optimal heading structure
  } else if (h1Count === 1 && (h2Count >= 1 || h3Count >= 1)) {
    score += 5; // Decent heading structure
  }
  
  return Math.min(100, score); // Cap at 100
}
