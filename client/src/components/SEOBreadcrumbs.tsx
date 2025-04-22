import React from 'react';
import { Link } from 'wouter';
import { BreadcrumbStructuredData } from './StructuredData';
import { ChevronRight } from 'lucide-react';

interface Breadcrumb {
  /**
   * The label to display for the breadcrumb
   */
  label: string;
  
  /**
   * The URL path for the breadcrumb
   */
  path: string;
  
  /**
   * Optional icon component to display before the label
   */
  icon?: React.ReactNode;
}

interface SEOBreadcrumbsProps {
  /**
   * Array of breadcrumb items
   */
  items: Breadcrumb[];
  
  /**
   * Optional CSS class name for the container
   */
  className?: string;
  
  /**
   * Base URL for the website
   */
  baseUrl?: string;
  
  /**
   * Whether to include home as the first breadcrumb
   */
  includeHome?: boolean;
  
  /**
   * Whether to include structured data markup
   */
  includeStructuredData?: boolean;
  
  /**
   * The text to use for the home breadcrumb
   */
  homeText?: string;
  
  /**
   * The icon to use for the home breadcrumb
   */
  homeIcon?: React.ReactNode;
  
  /**
   * The separator icon or text between breadcrumbs
   */
  separator?: React.ReactNode;
}

/**
 * SEO-optimized breadcrumbs component that handles:
 * - Proper semantic markup using nav, ol and li elements
 * - Schema.org structured data for breadcrumbs
 * - Accessible navigation with proper ARIA attributes
 * - Microdata attributes for additional SEO benefits
 */
export default function SEOBreadcrumbs({
  items,
  className = '',
  baseUrl = 'https://ohanarealty.com',
  includeHome = true,
  includeStructuredData = true,
  homeText = 'Home',
  homeIcon = null,
  separator = <ChevronRight className="h-4 w-4 mx-2 opacity-50" />
}: SEOBreadcrumbsProps) {
  // Prepend home if requested
  const allItems = includeHome 
    ? [{ label: homeText, path: '/', icon: homeIcon }, ...items]
    : items;
    
  // Generate structured data
  const structuredDataItems = allItems.map(item => ({
    name: item.label,
    item: `${baseUrl}${item.path}`
  }));
  
  return (
    <>
      {/* Semantic breadcrumb navigation */}
      <nav 
        aria-label="Breadcrumb" 
        className={`breadcrumbs ${className}`}
        itemScope 
        itemType="https://schema.org/BreadcrumbList"
      >
        <ol className="flex items-center flex-wrap text-sm">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            
            return (
              <li 
                key={item.path} 
                className={`breadcrumb-item ${isLast ? 'font-semibold' : ''}`}
                itemProp="itemListElement" 
                itemScope
                itemType="https://schema.org/ListItem"
              >
                {/* Use span for current page, link for others */}
                {isLast ? (
                  <span 
                    className="text-gray-500 dark:text-gray-400 flex items-center" 
                    itemProp="name" 
                    aria-current="page"
                  >
                    {item.icon && <span className="mr-1">{item.icon}</span>}
                    {item.label}
                  </span>
                ) : (
                  <>
                    <Link 
                      href={item.path}
                      className="text-primary hover:text-primary/80 flex items-center" 
                      itemProp="item"
                    >
                      {item.icon && <span className="mr-1">{item.icon}</span>}
                      <span itemProp="name">{item.label}</span>
                    </Link>
                    {/* Render the separator except for the last item */}
                    {!isLast && separator}
                  </>
                )}
                
                {/* Position metadata */}
                <meta itemProp="position" content={String(index + 1)} />
              </li>
            );
          })}
        </ol>
      </nav>
      
      {/* Include JSON-LD structured data */}
      {includeStructuredData && <BreadcrumbStructuredData items={structuredDataItems} />}
    </>
  );
}