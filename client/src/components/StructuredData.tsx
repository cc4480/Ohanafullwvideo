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
  sameAs = []
}: LocalBusinessStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": url,
    name,
    description,
    url,
    logo,
    image: logo,
    priceRange,
    email,
    telephone,
    address: {
      "@type": "PostalAddress",
      streetAddress,
      addressLocality,
      addressRegion,
      postalCode,
      addressCountry: "US"
    },
    geo: latitude && longitude ? {
      "@type": "GeoCoordinates",
      latitude,
      longitude
    } : undefined,
    openingHours,
    sameAs
  };

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
  floorSize
}: PropertyStructuredDataProps) {
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    url,
    name,
    description,
    image,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency
    },
    address: {
      "@type": "PostalAddress",
      addressLocality,
      addressRegion,
      postalCode,
      streetAddress,
      addressCountry: "US"
    },
    geo: latitude && longitude ? {
      "@type": "GeoCoordinates",
      latitude,
      longitude
    } : undefined,
    accommodationCategory: propertyType,
    ...(numberOfRooms ? { numberOfRooms } : {}),
    ...(numberOfBathrooms ? { numberOfBathrooms } : {}),
    ...(floorSize ? { floorSize: {
      "@type": "QuantitativeValue",
      ...floorSize
    }} : {})
  };

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