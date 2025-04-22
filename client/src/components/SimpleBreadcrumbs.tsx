import React from 'react';
import { Link } from 'wouter';
import { ChevronRight, Home } from 'lucide-react';

interface SimpleBreadcrumbsProps {
  items: Array<{
    label: string;
    path: string;
  }>;
  includeHome?: boolean;
  className?: string;
}

/**
 * A simple breadcrumbs component that displays the navigation path
 * and includes proper semantic markup for accessibility and SEO
 */
export default function SimpleBreadcrumbs({ 
  items, 
  includeHome = true,
  className = ''
}: SimpleBreadcrumbsProps) {
  // Build the list of all breadcrumb items including the home page if requested
  const allItems = includeHome 
    ? [{ label: 'Home', path: '/' }, ...items]
    : items;

  // Generate structured data for breadcrumbs
  const generateBreadcrumbStructuredData = () => {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": allItems.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.label,
        "item": item.path.startsWith('http') ? item.path : `${window.location.origin}${item.path}`
      }))
    };
  };

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`text-sm py-3 ${className}`}
    >
      <script type="application/ld+json">
        {JSON.stringify(generateBreadcrumbStructuredData())}
      </script>
      
      <ol className="flex flex-wrap items-center space-x-1 text-neutral-500">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 mx-1 text-neutral-400" aria-hidden="true" />
              )}
              
              {isLast ? (
                <span 
                  className="font-medium text-primary" 
                  aria-current="page"
                >
                  {index === 0 && includeHome ? (
                    <Home className="h-4 w-4 inline-block -mt-0.5" aria-hidden="true" />
                  ) : (
                    item.label
                  )}
                </span>
              ) : (
                <Link 
                  href={item.path}
                  className="hover:text-primary transition-colors"
                >
                  {index === 0 && includeHome ? (
                    <Home className="h-4 w-4 inline-block -mt-0.5" aria-hidden="true" />
                  ) : (
                    item.label
                  )}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}