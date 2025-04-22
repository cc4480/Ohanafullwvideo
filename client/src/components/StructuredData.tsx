import { Helmet } from 'react-helmet';

interface LocalBusinessStructuredDataProps {
  name: string;
  description: string;
  url: string;
  logo: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  telephone: string;
  email: string;
  priceRange: string;
  latitude?: number;
  longitude?: number;
  openingHours?: string[];
  sameAs?: string[];
  foundingDate?: string;
  founders?: Array<{
    name: string;
    jobTitle: string;
    image?: string;
    sameAs?: string[];
  }>;
  areaServed?: string[];
  knowsLanguage?: string[];
  award?: string[];
  hasCredential?: string[];
  slogan?: string;
  numberOfEmployees?: number;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
  };
  makesOffer?: Array<{
    name: string;
    description: string;
    price?: string;
    priceCurrency?: string;
    url?: string;
  }>;
  potentialAction?: Array<{
    "@type": string;
    target: string;
    name?: string;
    urlTemplate?: string;
    query?: string;
  }>;
  contactPoint?: Array<{
    "@type": string;
    telephone: string;
    contactType: string;
    areaServed?: string[];
    availableLanguage?: string[];
    contactOption?: string[];
  }>;
}

export function LocalBusinessStructuredData({
  name,
  description,
  url,
  logo,
  streetAddress,
  addressLocality,
  addressRegion,
  postalCode,
  telephone,
  email,
  priceRange,
  latitude,
  longitude,
  openingHours = ["Mo-Fr 09:00-17:00", "Sa 10:00-14:00"],
  sameAs = [],
  foundingDate,
  founders = [],
  areaServed = [],
  knowsLanguage = ["English", "Spanish"],
  award = [],
  hasCredential = [],
  slogan,
  numberOfEmployees,
  aggregateRating,
  makesOffer = [],
  potentialAction = [],
  contactPoint = []
}: LocalBusinessStructuredDataProps) {
  const structuredData: any = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${url}#organization`,
    "name": name,
    "description": description,
    "url": url,
    "logo": {
      "@type": "ImageObject",
      "url": logo,
      "width": 600,
      "height": 60
    },
    "image": [
      logo
    ],
    "email": email,
    "telephone": telephone,
    "priceRange": priceRange,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": streetAddress,
      "addressLocality": addressLocality,
      "addressRegion": addressRegion,
      "postalCode": postalCode,
      "addressCountry": "US"
    },
    "sameAs": sameAs
  };

  // Add geo coordinates if available
  if (latitude && longitude) {
    structuredData.geo = {
      "@type": "GeoCoordinates",
      "latitude": latitude,
      "longitude": longitude
    };
    
    // Also add hasMap with Google Maps URL
    structuredData.hasMap = `https://www.google.com/maps?q=${latitude},${longitude}`;
  }

  // Add opening hours if available
  if (openingHours && openingHours.length > 0) {
    structuredData.openingHoursSpecification = openingHours.map(hours => {
      const parts = hours.split(" ");
      const dayOfWeek = parts[0];
      const times = parts[1].split("-");
      
      return {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": dayOfWeek,
        "opens": times[0],
        "closes": times[1]
      };
    });
  }
  
  // Add founding date
  if (foundingDate) {
    structuredData.foundingDate = foundingDate;
  }
  
  // Add founders
  if (founders && founders.length > 0) {
    structuredData.founder = founders.map(founder => ({
      "@type": "Person",
      "name": founder.name,
      "jobTitle": founder.jobTitle,
      ...(founder.image ? { "image": founder.image } : {}),
      ...(founder.sameAs ? { "sameAs": founder.sameAs } : {})
    }));
  }
  
  // Add areas served
  if (areaServed && areaServed.length > 0) {
    structuredData.areaServed = areaServed.map(area => ({
      "@type": "City",
      "name": area
    }));
  }
  
  // Add languages known
  if (knowsLanguage && knowsLanguage.length > 0) {
    structuredData.knowsLanguage = knowsLanguage;
  }
  
  // Add awards
  if (award && award.length > 0) {
    structuredData.award = award;
  }
  
  // Add credentials
  if (hasCredential && hasCredential.length > 0) {
    structuredData.hasCredential = hasCredential.map(credential => ({
      "@type": "EducationalOccupationalCredential",
      "name": credential
    }));
  }
  
  // Add slogan
  if (slogan) {
    structuredData.slogan = slogan;
  }
  
  // Add number of employees
  if (numberOfEmployees) {
    structuredData.numberOfEmployees = {
      "@type": "QuantitativeValue",
      "value": numberOfEmployees
    };
  }
  
  // Add aggregate rating
  if (aggregateRating) {
    structuredData.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": aggregateRating.ratingValue,
      "reviewCount": aggregateRating.reviewCount,
      "bestRating": aggregateRating.bestRating || 5
    };
  }
  
  // Add offers
  if (makesOffer && makesOffer.length > 0) {
    structuredData.makesOffer = makesOffer.map(offer => ({
      "@type": "Offer",
      "name": offer.name,
      "description": offer.description,
      ...(offer.price && offer.priceCurrency ? {
        "price": offer.price,
        "priceCurrency": offer.priceCurrency
      } : {}),
      ...(offer.url ? { "url": offer.url } : {})
    }));
  }
  
  // Add potential actions
  if (potentialAction && potentialAction.length > 0) {
    structuredData.potentialAction = potentialAction.map(action => ({
      "@type": action["@type"],
      "target": action.target,
      ...(action.name ? { "name": action.name } : {}),
      ...(action.urlTemplate ? { "urlTemplate": action.urlTemplate } : {}),
      ...(action.query ? { "query-input": action.query } : {})
    }));
  }
  
  // Add contact points
  if (contactPoint && contactPoint.length > 0) {
    structuredData.contactPoint = contactPoint.map(point => ({
      "@type": point["@type"] || "ContactPoint",
      "telephone": point.telephone,
      "contactType": point.contactType,
      ...(point.areaServed ? { "areaServed": point.areaServed } : {}),
      ...(point.availableLanguage ? { "availableLanguage": point.availableLanguage } : {}),
      ...(point.contactOption ? { "contactOption": point.contactOption } : {})
    }));
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}

interface PropertyStructuredDataProps {
  name: string;
  description: string;
  url: string;
  image: string[];
  price: number;
  priceCurrency: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  streetAddress: string;
  latitude?: number;
  longitude?: number;
  propertyType: string;
  numberOfRooms?: number;
  numberOfBathrooms?: number;
  floorSize?: {
    value: number;
    unitCode: string;
  };
  yearBuilt?: number;
  lotSize?: {
    value: number;
    unitCode: string;
  };
  amenities?: string[];
  broker?: {
    name: string;
    url?: string;
    image?: string;
    telephone?: string;
    email?: string;
  };
  datePosted?: string;
  dateModified?: string;
  availability?: string;
  energyRating?: {
    type: string;
    value: string;
  };
  heating?: string;
  cooling?: string;
  parkingSpaces?: number;
  petsAllowed?: boolean;
  tourAvailability?: {
    dateFrom: string;
    dateTo: string;
    byAppointmentOnly?: boolean;
  }[];
  video?: string;
  additionalProperty?: Array<{
    name: string;
    value: string | number | boolean;
  }>;
  reviews?: Array<{
    author: string;
    datePublished: string;
    reviewBody: string;
    reviewRating: {
      ratingValue: number;
      bestRating?: number;
    };
  }>;
}

export function PropertyStructuredData({
  name,
  description,
  url,
  image,
  price,
  priceCurrency,
  addressLocality,
  addressRegion,
  postalCode,
  streetAddress,
  latitude,
  longitude,
  propertyType,
  numberOfRooms,
  numberOfBathrooms,
  floorSize,
  yearBuilt,
  lotSize,
  amenities = [],
  broker,
  datePosted,
  dateModified,
  availability = "https://schema.org/InStock",
  energyRating,
  heating,
  cooling,
  parkingSpaces,
  petsAllowed,
  tourAvailability = [],
  video,
  additionalProperty = [],
  reviews = []
}: PropertyStructuredDataProps) {
  
  // Create the main structured data object
  const structuredData: any = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${url}#listing`,
    "url": url,
    "name": name,
    "description": description,
    "image": image,
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": priceCurrency,
      "availability": availability,
      ...(datePosted ? { "validFrom": datePosted } : {})
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": addressLocality,
      "addressRegion": addressRegion,
      "postalCode": postalCode,
      "streetAddress": streetAddress,
      "addressCountry": "US"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };
  
  // Add timestamps if available
  if (datePosted) {
    structuredData.datePosted = datePosted;
  }
  
  if (dateModified) {
    structuredData.dateModified = dateModified;
  }
  
  // Add geo coordinates if available
  if (latitude && longitude) {
    structuredData.geo = {
      "@type": "GeoCoordinates",
      "latitude": latitude,
      "longitude": longitude
    };
    
    // Also add hasMap with Google Maps URL
    structuredData.hasMap = `https://www.google.com/maps?q=${latitude},${longitude}`;
  }
  
  // Add property details
  structuredData.accommodationCategory = propertyType;
  
  if (numberOfRooms) {
    structuredData.numberOfRooms = numberOfRooms;
  }
  
  if (numberOfBathrooms) {
    structuredData.numberOfBathrooms = numberOfBathrooms;
  }
  
  if (floorSize) {
    structuredData.floorSize = {
      "@type": "QuantitativeValue",
      "value": floorSize.value,
      "unitCode": floorSize.unitCode
    };
  }
  
  // Add year built if available
  if (yearBuilt) {
    structuredData.yearBuilt = yearBuilt;
  }
  
  // Add lot size if available
  if (lotSize) {
    structuredData.lotSize = {
      "@type": "QuantitativeValue",
      "value": lotSize.value,
      "unitCode": lotSize.unitCode
    };
  }
  
  // Add amenities if available
  if (amenities.length > 0) {
    structuredData.amenityFeature = amenities.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity,
      "value": true
    }));
  }
  
  // Add broker/agent information if available
  if (broker) {
    structuredData.broker = {
      "@type": "RealEstateAgent",
      "name": broker.name,
      ...(broker.url ? { "url": broker.url } : {}),
      ...(broker.image ? { "image": broker.image } : {}),
      ...(broker.telephone ? { "telephone": broker.telephone } : {}),
      ...(broker.email ? { "email": broker.email } : {})
    };
  }
  
  // Add energy rating if available
  if (energyRating) {
    structuredData.energyRating = {
      "@type": energyRating.type,
      "value": energyRating.value
    };
  }
  
  // Add heating type if available
  if (heating) {
    structuredData.heating = {
      "@type": "PropertyValue",
      "name": "Heating",
      "value": heating
    };
  }
  
  // Add cooling type if available
  if (cooling) {
    structuredData.cooling = {
      "@type": "PropertyValue",
      "name": "Cooling",
      "value": cooling
    };
  }
  
  // Add parking information if available
  if (parkingSpaces !== undefined) {
    structuredData.amenityFeature.push({
      "@type": "LocationFeatureSpecification",
      "name": "Parking",
      "value": `${parkingSpaces} space${parkingSpaces !== 1 ? 's' : ''}`
    });
  }
  
  // Add pets allowed information if available
  if (petsAllowed !== undefined) {
    structuredData.petsAllowed = petsAllowed;
  }
  
  // Add tour availability if available
  if (tourAvailability.length > 0) {
    structuredData.tourBookingPage = `${url}#schedule-viewing`;
    structuredData.availableAtOrFrom = tourAvailability.map(tour => ({
      "@type": "OpeningHoursSpecification",
      "validFrom": tour.dateFrom,
      "validThrough": tour.dateTo,
      ...(tour.byAppointmentOnly ? { "byAppointmentOnly": true } : {})
    }));
  }
  
  // Add video if available
  if (video) {
    structuredData.video = {
      "@type": "VideoObject",
      "contentUrl": video,
      "name": `Video tour of ${name}`,
      "description": `Virtual tour video of ${name} in ${addressLocality}, ${addressRegion}`,
      "thumbnailUrl": image[0]
    };
  }
  
  // Add additional properties if available
  if (additionalProperty.length > 0) {
    if (!structuredData.additionalProperty) {
      structuredData.additionalProperty = [];
    }
    
    structuredData.additionalProperty = [
      ...structuredData.additionalProperty,
      ...additionalProperty.map(prop => ({
        "@type": "PropertyValue",
        "name": prop.name,
        "value": prop.value
      }))
    ];
  }
  
  // Add reviews if available
  if (reviews.length > 0) {
    structuredData.review = reviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "datePublished": review.datePublished,
      "reviewBody": review.reviewBody,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.reviewRating.ratingValue,
        "bestRating": review.reviewRating.bestRating || 5
      }
    }));
    
    // Calculate aggregate rating if reviews are available
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.reviewRating.ratingValue, 0);
      const averageRating = totalRating / reviews.length;
      
      structuredData.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": parseFloat(averageRating.toFixed(1)),
        "reviewCount": reviews.length,
        "bestRating": reviews[0].reviewRating.bestRating || 5
      };
    }
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}

interface BreadcrumbStructuredDataProps {
  items: {
    name: string;
    item: string;
  }[];
}

export function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}

interface FAQStructuredDataProps {
  questions: {
    question: string;
    answer: string;
  }[];
}

export function FAQStructuredData({ questions }: FAQStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}

interface ArticleStructuredDataProps {
  headline: string;
  description: string;
  url: string;
  image: string;
  authorName: string;
  authorUrl?: string;
  authorImage?: string;
  publisherName: string;
  publisherLogo: string;
  datePublished: string;
  dateModified?: string;
  keywords?: string[];
  articleSection?: string;
  wordCount?: number;
  articleBody?: string;
  isAccessibleForFree?: boolean;
  alternativeHeadline?: string;
  commentCount?: number;
  editors?: Array<{
    name: string;
    url?: string;
  }>;
  speakable?: {
    cssSelector: string;
  };
  mentions?: Array<{
    name: string;
    url?: string;
    type?: string;
  }>;
  video?: {
    name: string;
    description: string;
    thumbnailUrl: string;
    uploadDate: string;
    duration?: string; // Format: PT1H30M (ISO 8601 duration format)
    contentUrl?: string;
    embedUrl?: string;
  };
}

/**
 * Advanced Article structured data component with comprehensive SEO attributes
 * Follows Google's Article schema guidelines with additional SEO enhancements
 */
export function ArticleStructuredData({
  headline,
  description,
  url,
  image,
  authorName,
  authorUrl,
  authorImage,
  publisherName,
  publisherLogo,
  datePublished,
  dateModified,
  keywords = [],
  articleSection,
  wordCount,
  articleBody,
  isAccessibleForFree = true,
  alternativeHeadline,
  commentCount,
  editors = [],
  speakable,
  mentions = [],
  video
}: ArticleStructuredDataProps) {
  // Prevent headline truncation in search results (Google limits to ~110 chars)
  const optimizedHeadline = headline.length > 105 ? headline.substring(0, 102) + '...' : headline;
  
  const structuredData: any = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "headline": optimizedHeadline,
    "description": description,
    "image": {
      "@type": "ImageObject",
      "url": image,
      "width": 1200,
      "height": 630
    },
    "author": {
      "@type": "Person",
      "name": authorName,
      ...(authorUrl ? { "url": authorUrl } : {}),
      ...(authorImage ? { "image": authorImage } : {})
    },
    "publisher": {
      "@type": "Organization",
      "name": publisherName,
      "logo": {
        "@type": "ImageObject",
        "url": publisherLogo,
        "width": 600,
        "height": 60
      }
    },
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished
  };
  
  // Add optional properties if available
  if (keywords.length > 0) {
    structuredData.keywords = keywords.join(", ");
  }
  
  if (articleSection) {
    structuredData.articleSection = articleSection;
  }
  
  if (wordCount) {
    structuredData.wordCount = wordCount;
  }
  
  if (articleBody) {
    structuredData.articleBody = articleBody.substring(0, 500) + (articleBody.length > 500 ? '...' : '');
  }
  
  if (isAccessibleForFree !== undefined) {
    structuredData.isAccessibleForFree = isAccessibleForFree;
  }
  
  if (alternativeHeadline) {
    structuredData.alternativeHeadline = alternativeHeadline;
  }
  
  if (commentCount !== undefined) {
    structuredData.commentCount = commentCount;
  }
  
  if (editors.length > 0) {
    structuredData.editor = editors.map(editor => ({
      "@type": "Person",
      "name": editor.name,
      ...(editor.url ? { "url": editor.url } : {})
    }));
  }
  
  if (speakable) {
    structuredData.speakable = {
      "@type": "SpeakableSpecification",
      "cssSelector": speakable.cssSelector
    };
  }
  
  if (mentions.length > 0) {
    structuredData.mentions = mentions.map(mention => ({
      "@type": mention.type || "Thing",
      "name": mention.name,
      ...(mention.url ? { "url": mention.url } : {})
    }));
  }
  
  if (video) {
    structuredData.video = {
      "@type": "VideoObject",
      "name": video.name,
      "description": video.description,
      "thumbnailUrl": video.thumbnailUrl,
      "uploadDate": video.uploadDate,
      ...(video.duration ? { "duration": video.duration } : {}),
      ...(video.contentUrl ? { "contentUrl": video.contentUrl } : {}),
      ...(video.embedUrl ? { "embedUrl": video.embedUrl } : {})
    };
  }
  
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}