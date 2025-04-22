import { Helmet } from 'react-helmet';

interface OrganizationProps {
  name: string;
  url: string;
  logo: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  phone: string;
  email: string;
  socialLinks?: string[];
}

/**
 * Organization Schema for a Real Estate business
 * Adds JSON-LD structured data to establish the business entity
 */
export default function SEOOrganizationSchema(props: OrganizationProps) {
  const {
    name,
    url,
    logo,
    description,
    address,
    phone,
    email,
    socialLinks = []
  } = props;
  
  // Create the structured data object for organization
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${url}#organization`,
    "name": name,
    "url": url,
    "logo": logo,
    "image": logo,
    "description": description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address.street,
      "addressLocality": address.city,
      "addressRegion": address.state,
      "postalCode": address.zip,
      "addressCountry": address.country
    },
    "telephone": phone,
    "email": email,
    "sameAs": socialLinks,
    "priceRange": "$$$"
  };

  // Website schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}#website`,
    "url": url,
    "name": name,
    "description": description,
    "publisher": {
      "@id": `${url}#organization`
    },
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": `${url}/properties?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    ]
  };
  
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(orgSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
    </Helmet>
  );
}