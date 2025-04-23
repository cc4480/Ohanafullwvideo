import { Helmet } from 'react-helmet';

interface EnterpriseGradeSEOProps {
  /**
   * Current page title
   */
  title: string;
  
  /**
   * Page description (keep between 120-160 characters)
   */
  description: string;
  
  /**
   * Primary image URL for social sharing
   */
  imageUrl?: string;
  
  /**
   * Canonical URL (full URL including domain)
   */
  canonicalUrl: string;
  
  /**
   * Page type - important for schema.org markup
   */
  pageType: 'homepage' | 'propertyListing' | 'propertyDetail' | 'about' | 'contact' | 'neighborhood' | 'blog';
  
  /**
   * Primary keywords to target
   */
  primaryKeywords: string[];
  
  /**
   * Secondary keywords to target
   */
  secondaryKeywords?: string[];
  
  /**
   * Local SEO city terms
   */
  localSEOTerms?: string[];
  
  /**
   * Whether this is a multilingual site
   */
  multiLingual?: boolean;
  
  /**
   * Alternate language versions of this page
   * Format: { 'es': 'https://example.com/es/page', 'fr': 'https://example.com/fr/page' }
   */
  alternateLanguages?: Record<string, string>;
  
  /**
   * Facebook App ID (if available)
   */
  facebookAppId?: string;
  
  /**
   * Twitter username (without @)
   */
  twitterUsername?: string;
  
  /**
   * Organization information for schema.org markup
   */
  organization?: {
    name: string;
    logo: string;
    address?: string;
    phone?: string;
    email?: string;
    sameAs?: string[];
  };
  
  /**
   * Publication date (for articles/blogs)
   */
  publishDate?: string;
  
  /**
   * Last modified date
   */
  modifiedDate?: string;
  
  /**
   * Breadcrumb items for schema.org markup
   */
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
  
  /**
   * Article author (for blogs/articles)
   */
  author?: {
    name: string;
    url?: string;
  };
  
  /**
   * Video information (if page contains featured video)
   */
  video?: {
    name: string;
    description: string;
    thumbnailUrl: string;
    uploadDate: string;
    contentUrl: string;
    embedUrl?: string;
    duration?: string;
  };
  
  /**
   * Advanced indexing directives
   */
  robotsDirectives?: {
    noindex?: boolean;
    nofollow?: boolean;
    noarchive?: boolean;
    noimageindex?: boolean;
    maxSnippet?: number;
    maxImagePreview?: 'none' | 'standard' | 'large';
    maxVideoPreview?: number;
    unavailableAfter?: string;
  };
  
  /**
   * Enable dynamic title optimization
   */
  enableDynamicTitleOptimization?: boolean;
}

/**
 * Enterprise-grade SEO component that implements comprehensive on-page optimization,
 * structured data, and advanced meta tags for maximum search engine visibility.
 */
export default function EnterpriseGradeSEO({
  title,
  description,
  imageUrl,
  canonicalUrl,
  pageType,
  primaryKeywords,
  secondaryKeywords = [],
  localSEOTerms = [],
  multiLingual = false,
  alternateLanguages = {},
  facebookAppId,
  twitterUsername,
  organization,
  publishDate,
  modifiedDate,
  breadcrumbs,
  author,
  video,
  robotsDirectives,
  enableDynamicTitleOptimization = true
}: EnterpriseGradeSEOProps) {
  // Combine all keywords for advanced optimization
  const allKeywords = [...primaryKeywords, ...secondaryKeywords, ...localSEOTerms];
  
  // Construct optimized title for maximum SEO impact
  let optimizedTitle = title;
  
  // Implement dynamic title optimization based on page type
  if (enableDynamicTitleOptimization) {
    const brandName = organization?.name || 'Ohana Realty';
    
    // Apply title optimization patterns based on page type
    if (pageType === 'homepage') {
      optimizedTitle = `${brandName} - ${primaryKeywords[0] || 'Laredo Real Estate'} | ${primaryKeywords[1] || 'Homes for Sale'}`;
    } else if (pageType === 'propertyListing') {
      optimizedTitle = `${primaryKeywords[0] || 'Properties'} in ${localSEOTerms[0] || 'Laredo'} | ${brandName}`;
    } else if (pageType === 'propertyDetail') {
      // Property detail pages already have specific titles
      optimizedTitle = `${title} | ${brandName}`;
    } else if (pageType === 'neighborhood') {
      optimizedTitle = `${primaryKeywords[0] || title} | Real Estate Guide | ${brandName}`;
    } else if (pageType === 'blog') {
      // Keep blog titles close to original but add brand
      optimizedTitle = `${title} | ${brandName} Blog`;
    } else {
      // Default format for other pages
      optimizedTitle = `${title} | ${brandName}`;
    }
  }
  
  // Construct meta keywords with proper formatting
  const metaKeywords = allKeywords.join(', ');
  
  // Generate JSON-LD schema markup based on page type
  const generateSchemaMarkup = () => {
    const schemas = [];
    
    // Add organization schema for all pages
    if (organization) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'RealEstateAgent',
        '@id': `${canonicalUrl.split('/')[0]}//#organization`,
        name: organization.name,
        url: canonicalUrl.split('/').slice(0, 3).join('/'), // Base URL
        logo: {
          '@type': 'ImageObject',
          url: organization.logo
        },
        ...(organization.address && { address: organization.address }),
        ...(organization.phone && { telephone: organization.phone }),
        ...(organization.email && { email: organization.email }),
        ...(organization.sameAs && { sameAs: organization.sameAs })
      });
    }
    
    // Add breadcrumbs schema if available
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@id': crumb.url,
            name: crumb.name
          }
        }))
      });
    }
    
    // Add specific schema based on page type
    switch (pageType) {
      case 'homepage':
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': `${canonicalUrl}#website`,
          url: canonicalUrl,
          name: title,
          description: description,
          publisher: {
            '@id': `${canonicalUrl.split('/')[0]}//#organization`
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: `${canonicalUrl.split('/').slice(0, 3).join('/')}/properties?search={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        });
        break;
        
      case 'propertyListing':
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': `${canonicalUrl}#collectionpage`,
          url: canonicalUrl,
          name: title,
          description: description,
          isPartOf: {
            '@id': `${canonicalUrl.split('/').slice(0, 3).join('/')}/#website`
          },
          about: {
            '@type': 'RealEstateAgent',
            '@id': `${canonicalUrl.split('/')[0]}//#organization`
          }
        });
        break;
        
      case 'propertyDetail':
        // Property detail has its own schema in component
        break;
        
      case 'blog':
        if (author && publishDate) {
          schemas.push({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            '@id': `${canonicalUrl}#article`,
            headline: title,
            description: description,
            image: imageUrl,
            author: {
              '@type': 'Person',
              name: author.name,
              ...(author.url && { url: author.url })
            },
            publisher: {
              '@id': `${canonicalUrl.split('/')[0]}//#organization`
            },
            datePublished: publishDate,
            dateModified: modifiedDate || publishDate,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': canonicalUrl
            }
          });
        }
        break;
        
      default:
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': `${canonicalUrl}#webpage`,
          url: canonicalUrl,
          name: title,
          description: description,
          isPartOf: {
            '@id': `${canonicalUrl.split('/').slice(0, 3).join('/')}/#website`
          }
        });
    }
    
    // Add video schema if available
    if (video) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: video.name,
        description: video.description,
        thumbnailUrl: video.thumbnailUrl,
        uploadDate: video.uploadDate,
        contentUrl: video.contentUrl,
        ...(video.embedUrl && { embedUrl: video.embedUrl }),
        ...(video.duration && { duration: video.duration })
      });
    }
    
    return schemas.map(schema => JSON.stringify(schema));
  };
  
  // Generate robots directives
  const generateRobotsDirectives = () => {
    if (!robotsDirectives) return null;
    
    const directives = [];
    
    if (robotsDirectives.noindex) directives.push('noindex');
    else directives.push('index');
    
    if (robotsDirectives.nofollow) directives.push('nofollow');
    else directives.push('follow');
    
    if (robotsDirectives.noarchive) directives.push('noarchive');
    if (robotsDirectives.noimageindex) directives.push('noimageindex');
    
    if (robotsDirectives.maxSnippet !== undefined) {
      directives.push(`max-snippet:${robotsDirectives.maxSnippet}`);
    }
    
    if (robotsDirectives.maxImagePreview) {
      directives.push(`max-image-preview:${robotsDirectives.maxImagePreview}`);
    }
    
    if (robotsDirectives.maxVideoPreview !== undefined) {
      directives.push(`max-video-preview:${robotsDirectives.maxVideoPreview}`);
    }
    
    if (robotsDirectives.unavailableAfter) {
      directives.push(`unavailable_after:${robotsDirectives.unavailableAfter}`);
    }
    
    return directives.join(', ');
  };
  
  const schemaMarkup = generateSchemaMarkup();
  const robotsContent = generateRobotsDirectives();
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{optimizedTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={metaKeywords} />
      
      {/* Canonical URL for avoiding duplicate content issues */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Language Alternates for Multilingual Support */}
      {multiLingual && Object.entries(alternateLanguages).map(([lang, url]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
      {multiLingual && <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />}
      
      {/* Open Graph Meta Tags for Social Sharing */}
      <meta property="og:title" content={optimizedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={pageType === 'blog' ? 'article' : 'website'} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      {imageUrl && <meta property="og:image:alt" content={title} />}
      {facebookAppId && <meta property="fb:app_id" content={facebookAppId} />}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={imageUrl ? 'summary_large_image' : 'summary'} />
      {twitterUsername && <meta name="twitter:site" content={`@${twitterUsername}`} />}
      <meta name="twitter:title" content={optimizedTitle} />
      <meta name="twitter:description" content={description} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
      
      {/* Article Specific Meta Tags */}
      {pageType === 'blog' && publishDate && (
        <>
          <meta property="article:published_time" content={publishDate} />
          {modifiedDate && <meta property="article:modified_time" content={modifiedDate} />}
          {author && <meta property="article:author" content={author.name} />}
          {primaryKeywords.map((keyword, index) => (
            <meta key={`keyword-${index}`} property="article:tag" content={keyword} />
          ))}
        </>
      )}
      
      {/* Robots Directives for Indexing Control */}
      {robotsContent && <meta name="robots" content={robotsContent} />}
      
      {/* Schema.org JSON-LD Structured Data */}
      {schemaMarkup.map((schema, index) => (
        <script key={`schema-${index}`} type="application/ld+json">
          {schema}
        </script>
      ))}
      
      {/* Additional SEO Meta Tags for Enterprise-Level Optimization */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#0A2342" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Enhanced Viewport Control */}
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    </Helmet>
  );
}