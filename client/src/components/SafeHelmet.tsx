import React, { useEffect } from 'react';

interface SafeHelmetProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  imageUrl?: string;
  meta?: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
  link?: Array<{
    rel: string;
    href: string;
    as?: string;
    type?: string;
  }>;
  script?: Array<{
    type: string;
    innerHTML?: string;
  }>;
}

/**
 * A safer alternative to React Helmet that doesn't use symbols
 * This helps avoid "Cannot convert a Symbol value to a string" errors
 */
export default function SafeHelmet({ 
  title, 
  description, 
  canonicalPath, 
  imageUrl, 
  meta = [], 
  link = [], 
  script 
}: SafeHelmetProps) {
  useEffect(() => {
    // Only run on the client side
    if (typeof window === 'undefined') return;

    // Update page title
    if (title) {
      document.title = title;
    }

    // Prepare additional meta and link tags from the simplified props
    const additionalMeta: Array<{name?: string; property?: string; content: string}> = [];
    const additionalLink: Array<{rel: string; href: string; as?: string; type?: string}> = [];
    
    // Add description meta if provided
    if (description) {
      additionalMeta.push({ name: 'description', content: description });
      additionalMeta.push({ property: 'og:description', content: description });
    }
    
    // Add image meta if provided
    if (imageUrl) {
      additionalMeta.push({ property: 'og:image', content: imageUrl });
      additionalMeta.push({ name: 'twitter:image', content: imageUrl });
    }
    
    // Add canonical link if provided
    if (canonicalPath) {
      const baseUrl = window.location.origin;
      const fullUrl = `${baseUrl}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;
      additionalLink.push({ rel: 'canonical', href: fullUrl });
    }
    
    // Combine additional meta tags with provided meta tags
    const allMeta = [...meta, ...additionalMeta];
    
    // Add meta tags
    if (allMeta.length > 0) {
      allMeta.forEach(metaItem => {
        const metaTag = document.createElement('meta');
        
        if (metaItem.name) {
          metaTag.setAttribute('name', metaItem.name);
        }
        
        if (metaItem.property) {
          metaTag.setAttribute('property', metaItem.property);
        }
        
        metaTag.setAttribute('content', metaItem.content);
        
        // Add a data attribute to identify our tags for cleanup
        metaTag.setAttribute('data-safe-helmet', 'true');
        
        document.head.appendChild(metaTag);
      });
    }
    
    // Combine additional link tags with provided link tags
    const allLink = [...link, ...additionalLink];

    // Add link tags
    if (allLink.length > 0) {
      allLink.forEach(linkItem => {
        const linkTag = document.createElement('link');
        linkTag.setAttribute('rel', linkItem.rel);
        linkTag.setAttribute('href', linkItem.href);
        
        if (linkItem.as) {
          linkTag.setAttribute('as', linkItem.as);
        }
        
        if (linkItem.type) {
          linkTag.setAttribute('type', linkItem.type);
        }
        
        // Add a data attribute to identify our tags for cleanup
        linkTag.setAttribute('data-safe-helmet', 'true');
        
        document.head.appendChild(linkTag);
      });
    }

    // Add script tags
    if (script && script.length > 0) {
      script.forEach(scriptItem => {
        const scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', scriptItem.type);
        
        if (scriptItem.innerHTML) {
          scriptTag.innerHTML = scriptItem.innerHTML;
        }
        
        // Add a data attribute to identify our tags for cleanup
        scriptTag.setAttribute('data-safe-helmet', 'true');
        
        document.head.appendChild(scriptTag);
      });
    }

    // Cleanup function to remove tags when component unmounts
    return () => {
      const tags = document.querySelectorAll('[data-safe-helmet="true"]');
      tags.forEach(tag => {
        tag.parentNode?.removeChild(tag);
      });
    };
  }, [title, description, canonicalPath, imageUrl, meta, link, script]);

  return null;
}