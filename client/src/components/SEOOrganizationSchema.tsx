import { Helmet } from 'react-helmet';

/**
 * Comprehensive Organization Schema for a Real Estate business
 * This component adds JSON-LD structured data to the homepage to establish 
 * the business entity in search engines and enhance local SEO performance.
 */
export default function SEOOrganizationSchema() {
  // Company details - these should be updated with actual company info
  const companyName = "Ohana Realty";
  const companyLogo = "https://ohanarealty.com/logo.png"; // Update with actual logo URL
  const companyUrl = "https://ohanarealty.com";
  const companyDescription = "Premier real estate agency specializing in residential and commercial properties in Laredo, Texas.";
  
  // Physical location - update with actual address
  const streetAddress = "1314 Iturbide St";
  const addressLocality = "Laredo";
  const addressRegion = "TX";
  const postalCode = "78040";
  const telephone = "+1-555-123-4567"; // Update with actual phone
  const email = "info@ohanarealty.com"; // Update with actual email
  
  // Geographical coordinates
  const latitude = 27.506726;
  const longitude = -99.502636;
  
  // Social profiles
  const socialProfiles = [
    "https://www.facebook.com/OhanaRealty",
    "https://twitter.com/OhanaRealty",
    "https://www.instagram.com/OhanaRealty",
    "https://www.linkedin.com/company/ohana-realty"
  ];
  
  // Company founding information
  const foundingDate = "2015-01-01";
  const founders = [
    {
      name: "John Doe",
      jobTitle: "Founder & CEO",
      image: "https://ohanarealty.com/team/john-doe.jpg"
    }
  ];
  
  // Areas served
  const areasServed = [
    "Laredo", 
    "Webb County", 
    "South Texas"
  ];
  
  // Opening hours
  const openingHours = [
    "Mo-Fr 09:00-17:00", 
    "Sa 10:00-14:00"
  ];
  
  // Services offered
  const services = [
    {
      name: "Residential Property Sales",
      description: "Full-service residential property sales in Laredo and surrounding areas.",
      url: "https://ohanarealty.com/services/residential"
    },
    {
      name: "Commercial Property Sales",
      description: "Commercial property sales and leasing for businesses of all sizes.",
      url: "https://ohanarealty.com/services/commercial"
    },
    {
      name: "Property Management",
      description: "Comprehensive property management services for landlords and investors.",
      url: "https://ohanarealty.com/services/property-management"
    }
  ];
  
  // Create the structured data object
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${companyUrl}#organization`,
    "name": companyName,
    "url": companyUrl,
    "logo": {
      "@type": "ImageObject",
      "url": companyLogo,
      "width": 600,
      "height": 60
    },
    "image": [companyLogo],
    "description": companyDescription,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": streetAddress,
      "addressLocality": addressLocality,
      "addressRegion": addressRegion,
      "postalCode": postalCode,
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": latitude,
      "longitude": longitude
    },
    "hasMap": `https://www.google.com/maps?q=${latitude},${longitude}`,
    "openingHoursSpecification": openingHours.map(hours => {
      const parts = hours.split(" ");
      const dayOfWeek = parts[0];
      const times = parts[1].split("-");
      
      return {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": dayOfWeek,
        "opens": times[0],
        "closes": times[1]
      };
    }),
    "telephone": telephone,
    "email": email,
    "foundingDate": foundingDate,
    "founder": founders.map(founder => ({
      "@type": "Person",
      "name": founder.name,
      "jobTitle": founder.jobTitle,
      "image": founder.image
    })),
    "areaServed": areasServed.map(area => ({
      "@type": "City",
      "name": area
    })),
    "sameAs": socialProfiles,
    "makesOffer": services.map(service => ({
      "@type": "Offer",
      "name": service.name,
      "description": service.description,
      "url": service.url
    })),
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": `${companyUrl}/properties?search={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": telephone,
        "contactType": "customer service",
        "availableLanguage": ["English", "Spanish"]
      },
      {
        "@type": "ContactPoint",
        "telephone": telephone,
        "contactType": "sales",
        "availableLanguage": ["English", "Spanish"]
      }
    ],
    "knowsLanguage": ["English", "Spanish"],
    "priceRange": "$$$"
  };
  
  // Add business-defining website entity relationship with WebSite schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${companyUrl}#website`,
    "url": companyUrl,
    "name": companyName,
    "description": companyDescription,
    "publisher": {
      "@id": `${companyUrl}#organization`
    },
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${companyUrl}/properties?search={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    ]
  };
  
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
    </Helmet>
  );
}