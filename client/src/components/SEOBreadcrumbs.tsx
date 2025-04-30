import React from 'react';
import { Link } from 'wouter';
import { BreadcrumbStructuredData } from './StructuredData';
import { ChevronRight } from 'lucide-react';

interface Breadcrumb {
  /**
   * The label to display for the breadcrumb
   */
  label?: string;
  
  /**
   * Alternative to label - The name to display for the breadcrumb
   */
  name?: string;
  
  /**
   * The URL path for the breadcrumb
   */
  path?: string;
  
  /**
   * Alternative to path - The href for the breadcrumb
   */
  href?: string;
  
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
  // Helper to normalize breadcrumb items and ensure required properties
  const normalizeItem = (item: Breadcrumb): { label: string; path: string; icon?: React.ReactNode } => {
    return {
      label: item.label || item.name || 'Link',
      path: item.path || item.href || '/',
      icon: item.icon
    };
  };
  
  // Prepend home if requested
  const homeItem = { label: homeText, path: '/', icon: homeIcon };
  const normalizedItems = items.map(normalizeItem);
  const allItems = includeHome 
    ? [homeItem, ...normalizedItems]
    : normalizedItems;
    
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
            // Ensure path is always a string
            const itemPath = item.path || item.href || '/';
            const itemLabel = item.label || item.name || 'Link';
            
            return (
              <li 
                key={`breadcrumb-${index}`} 
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
                    {itemLabel}
                  </span>
                ) : (
                  <>
                    <Link 
                      href={itemPath}
                      className="text-primary hover:text-primary/80 flex items-center" 
                      itemProp="item"
                    >
                      {item.icon && <span className="mr-1">{item.icon}</span>}
                      <span itemProp="name">{itemLabel}</span>
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
      {includeStructuredData && (
        <BreadcrumbStructuredData 
          items={structuredDataItems.map(item => ({
            name: item.name || 'Link',
            item: item.item
          }))} 
        />
      )}
    </>
  );
}