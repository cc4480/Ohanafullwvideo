import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';

interface CanonicalURLProps {
  /**
   * The base URL of the website (e.g., https://ohanarealty.com)
   */
  baseUrl: string;
  
  /**
   * Optional path that overrides the current path
   * Use this when you want to set a specific canonical URL different from the current URL
   */
  overridePath?: string;
  
  /**
   * Query parameters to preserve in the canonical URL (all others will be stripped)
   * E.g., ['type', 'city'] would preserve ?type=residential&city=laredo
   */
  preserveQueryParams?: string[];
  
  /**
   * Alternate URLs for different languages/regions
   * Key is the language code, value is the full URL
   * E.g., { 'es': 'https://ohanarealty.com/es/properties', 'en-GB': 'https://ohanarealty.co.uk/properties' }
   */
  alternateUrls?: Record<string, string>;
  
  /**
   * The default language of the current page
   * E.g., 'en-US'
   */
  defaultLanguage?: string;
}

/**
 * Advanced canonical URL component for handling duplicate content
 * Issues canonical tags and alternate language links based on the current URL
 */
export default function CanonicalURLs({
  baseUrl,
  overridePath,
  preserveQueryParams = [],
  alternateUrls = {},
  defaultLanguage = 'en-US'
}: CanonicalURLProps) {
  const [location] = useLocation();
  
  // Get the current path or use the override if provided
  const currentPath = overridePath || location;
  
  // Clean trailing slash for consistency
  const cleanPath = currentPath.endsWith('/') && currentPath !== '/' 
    ? currentPath.slice(0, -1) 
    : currentPath;
  
  // Build the canonical URL base
  const canonicalBase = baseUrl + cleanPath;
  
  // Process query parameters if needed
  let canonicalUrl = canonicalBase;
  
  if (preserveQueryParams.length > 0 && typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    
    const filteredParams = new URLSearchParams();
    preserveQueryParams.forEach(param => {
      if (params.has(param)) {
        filteredParams.set(param, params.get(param)!);
      }
    });
    
    const queryString = filteredParams.toString();
    if (queryString) {
      canonicalUrl += '?' + queryString;
    }
  }
  
  return (
    <Helmet>
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Set default language */}
      <meta property="og:locale" content={defaultLanguage} />
      
      {/* Alternate language URLs */}
      {Object.entries(alternateUrls).map(([lang, url]) => (
        <link 
          key={lang} 
          rel="alternate" 
          hrefLang={lang} 
          href={url} 
        />
      ))}
      
      {/* Add x-default if there are alternate languages */}
      {Object.keys(alternateUrls).length > 0 && (
        <link 
          rel="alternate" 
          hrefLang="x-default" 
          href={canonicalUrl} 
        />
      )}
    </Helmet>
  );
}