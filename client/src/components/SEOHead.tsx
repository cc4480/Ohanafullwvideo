import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  keywords?: string[];
  imageAlt?: string;
  location?: {
    locality: string;
    region: string;
    postalCode?: string;
    addressCountry?: string;
  };
  publishedAt?: string;
  modifiedAt?: string;
  author?: string;
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
  noIndex?: boolean;
  language?: string;
  prevPageUrl?: string;
  nextPageUrl?: string;
  twitterHandle?: string;
  facebookAppId?: string;
  organizationName?: string;
  organizationLogo?: string;
  alternateUrls?: Record<string, string>;
}

export default function SEOHead({ 
  title, 
  description,
  canonicalUrl,
  ogImage = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=630&fit=crop',
  ogType = 'website',
  keywords = [],
  imageAlt = '',
  location = {
    locality: 'Laredo',
    region: 'TX',
    postalCode: '78040',
    addressCountry: 'USA'
  },
  publishedAt,
  modifiedAt,
  author = 'Valentin Cuellar',
  breadcrumbs = [],
  noIndex = false,
  language = 'en-US',
  prevPageUrl,
  nextPageUrl,
  twitterHandle = '@OhanaRealty',
  facebookAppId = '',
  organizationName = 'Ohana Realty',
  organizationLogo = '/images/ohana-realty-logo.png',
  alternateUrls = {}
}: SEOHeadProps) {
  // Base URL - replace with actual domain in production
  const baseUrl = 'https://ohanarealty.com';
  const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl;
  
  // Format the title to include the site name with limited length for SEO
  const formattedTitle = `${title} | Ohana Realty - Laredo, TX`;
  const truncatedTitle = formattedTitle.length > 60 ? formattedTitle.substring(0, 57) + '...' : formattedTitle;
  
  // Format description for optimal length (between 140-160 characters)
  const optimizedDescription = description.length > 160 ? description.substring(0, 157) + '...' : description;
  
  // Extend keywords with main real estate terms for better SEO relevance
  const enhancedKeywords = [
    ...keywords,
    'real estate', 'homes for sale', 'Laredo properties', 'Texas real estate',
    'home buying', 'property listings', 'realtors', 'residential properties',
    'commercial properties', 'land for sale', 'Ohana Realty'
  ].filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
  
  // Generate JSON-LD for organization
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": organizationName,
    "url": baseUrl,
    "logo": `${baseUrl}${organizationLogo}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": location.locality,
      "addressRegion": location.region,
      "postalCode": location.postalCode,
      "addressCountry": location.addressCountry
    },
    "sameAs": [
      "https://www.facebook.com/valentincrealtor",
      "https://twitter.com/valentinrealtor",
      "https://www.instagram.com/valentincrealtor",
      "https://www.linkedin.com/in/valentin-cuellar-5827b4123"
    ]
  };
  
  // Generate JSON-LD for webpage
  const webpageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "url": fullCanonicalUrl,
    "name": truncatedTitle,
    "description": optimizedDescription,
    "inLanguage": language,
    "datePublished": publishedAt,
    "dateModified": modifiedAt || publishedAt,
    "publisher": {
      "@type": "Organization",
      "name": organizationName,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}${organizationLogo}`
      }
    }
  };
  
  // Generate JSON-LD for breadcrumb
  const breadcrumbJsonLd = breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${baseUrl}${crumb.url}`
    }))
  } : null;
  
  // Client-side performance optimizations
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    // Preload critical resources on client-side
    if (ogImage && window.matchMedia && window.matchMedia('(min-width: 768px)').matches) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = ogImage;
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [ogImage]);
  
  return (
    <Helmet
      htmlAttributes={{
        lang: language,
      }}
    >
      {/* Primary Meta Tags */}
      <title>{truncatedTitle}</title>
      <meta name="title" content={truncatedTitle} />
      <meta name="description" content={optimizedDescription} />
      <meta name="author" content={author} />
      <meta name="keywords" content={enhancedKeywords.join(', ')} />
      <meta name="application-name" content="Ohana Realty" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#1E40AF" /> {/* Match primary brand color */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      
      {/* Canonical and Alternate Links */}
      <link rel="canonical" href={fullCanonicalUrl} />
      {Object.entries(alternateUrls).map(([lang, url]) => (
        <link rel="alternate" href={url} hrefLang={lang} key={lang} />
      ))}
      {prevPageUrl && <link rel="prev" href={`${baseUrl}${prevPageUrl}`} />}
      {nextPageUrl && <link rel="next" href={`${baseUrl}${nextPageUrl}`} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:locale" content={language} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={truncatedTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={imageAlt || title} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Ohana Realty" />
      {publishedAt && <meta property="article:published_time" content={publishedAt} />}
      {modifiedAt && <meta property="article:modified_time" content={modifiedAt} />}
      {facebookAppId && <meta property="fb:app_id" content={facebookAppId} />}
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullCanonicalUrl} />
      <meta property="twitter:title" content={truncatedTitle} />
      <meta property="twitter:description" content={optimizedDescription} />
      <meta property="twitter:image" content={ogImage} />
      <meta property="twitter:image:alt" content={imageAlt || title} />
      <meta property="twitter:site" content={twitterHandle} />
      <meta property="twitter:creator" content={twitterHandle} />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationJsonLd)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(webpageJsonLd)}
      </script>
      {breadcrumbJsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbJsonLd)}
        </script>
      )}
      
      {/* DNS Prefetch for Critical Third-Parties */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      
      {/* Preconnect to critical origins */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Mobile and PWA optimizations */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Ohana Realty" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
    </Helmet>
  );
}