import React, { useEffect } from 'react';

interface SafeHelmetProps {
  title?: string;
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
export default function SafeHelmet({ title, meta, link, script }: SafeHelmetProps) {
  useEffect(() => {
    // Only run on the client side
    if (typeof window === 'undefined') return;

    // Update page title
    if (title) {
      document.title = title;
    }

    // Add meta tags
    if (meta && meta.length > 0) {
      meta.forEach(metaItem => {
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

    // Add link tags
    if (link && link.length > 0) {
      link.forEach(linkItem => {
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
  }, [title, meta, link, script]);

  return null;
}