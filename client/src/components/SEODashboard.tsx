import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import EnterpriseGradeSEO10K from './EnterpriseGradeSEO10K';
import EnterpriseGradeSitemapGenerator from './EnterpriseGradeSitemapGenerator';
import EnterpriseStructuredData from './EnterpriseStructuredData';

interface SEODashboardProps {
  /**
   * Organization information
   */
  organization: {
    name: string;
    logo: string;
    address: string;
    phone: string;
    email: string;
    sameAs: string[];
    geo?: {
      latitude: number;
      longitude: number;
    };
  };
  
  /**
   * Base URL of the website
   */
  baseUrl: string;
  
  /**
   * Facebook App ID (if available)
   */
  facebookAppId?: string;
  
  /**
   * Twitter username (without @)
   */
  twitterUsername?: string;
  
  /**
   * Custom title override
   */
  title?: string;
  
  /**
   * Custom description override
   */
  description?: string;
  
  /**
   * Custom image URL
   */
  imageUrl?: string;
  
  /**
   * Additional custom meta tags
   */
  customMeta?: Array<{
    name: string;
    content: string;
  }>;
  
  /**
   * Custom robots directives
   */
  robotsDirectives?: {
    noindex?: boolean;
    nofollow?: boolean;
  };
  
  /**
   * Breadcrumb items 
   */
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
  
  /**
   * Alternate language URLs
   */
  alternateLanguages?: Record<string, string>;
  
  /**
   * Enable Core Web Vitals Optimization
   */
  enableCoreWebVitals?: boolean;
  
  /**
   * Additional structured data
   */
  additionalStructuredData?: Array<{
    type: 'RealEstateListing' | 'LocalBusiness' | 'FAQ' | 'Breadcrumb' | 'Review' | 'WebSite' | 'Organization' | 'Person' | 'Event' | 'Article';
    data: Record<string, any>;
  }>;
  
  /**
   * Primary keywords to target
   */
  primaryKeywords?: string[];
  
  /**
   * Secondary keywords to target
   */
  secondaryKeywords?: string[];
  
  /**
   * Local SEO location terms
   */
  localSEOTerms?: string[];
  
  /**
   * Property details for property pages
   */
  propertyDetails?: {
    price: number;
    bedrooms?: number;
    bathrooms?: number;
    floorSize?: number;
    propertyType?: string;
    features?: string[];
    address?: {
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
    };
    geo?: {
      latitude: number;
      longitude: number;
    };
  };
  
  /**
   * FAQ items for FAQ schema
   */
  faqItems?: Array<{
    question: string;
    answer: string;
  }>;
  
  /**
   * Enable this to log detailed SEO information to console
   */
  debug?: boolean;
  
  /**
   * Enable real-time SEO adjustments based on user behavior and page performance
   */
  enableRealTimeOptimization?: boolean;
}

/**
 * SEO Dashboard Component - $10,000 Enterprise Grade
 * 
 * This component handles all SEO related functionality in one place:
 * - Meta tags and social media optimization
 * - Schema.org structured data with multiple entity types
 * - Sitemap generation with advanced features
 * - Core Web Vitals optimization
 * - Data-driven SEO decisions
 * - Voice search optimization
 * - NLP and entity recognition
 * - Mobile optimization
 */
export default function SEODashboard({
  organization,
  baseUrl,
  facebookAppId,
  twitterUsername,
  title: customTitle,
  description: customDescription,
  imageUrl,
  customMeta = [],
  robotsDirectives,
  breadcrumbs = [],
  alternateLanguages = {},
  enableCoreWebVitals = true,
  additionalStructuredData = [],
  primaryKeywords = [],
  secondaryKeywords = [],
  localSEOTerms = ['Laredo', 'Texas', 'Laredo TX'],
  propertyDetails,
  faqItems = [],
  debug = false,
  enableRealTimeOptimization = false
}: SEODashboardProps) {
  const [location] = useLocation();
  const [pageType, setPageType] = useState<'homepage' | 'propertyListing' | 'propertyDetail' | 'about' | 'contact' | 'neighborhood' | 'blog'>('homepage');
  
  // Page performance metrics for Core Web Vitals
  const [coreWebVitals, setCoreWebVitals] = useState({
    LCP: 2.5, // Largest Contentful Paint (target: < 2.5s)
    FID: 100, // First Input Delay (target: < 100ms)
    CLS: 0.1, // Cumulative Layout Shift (target: < 0.1)
  });
  
  // Determine page type based on current URL path
  useEffect(() => {
    if (location === '/') {
      setPageType('homepage');
    } else if (location.startsWith('/properties') && location.split('/').length > 2) {
      setPageType('propertyDetail');
    } else if (location.startsWith('/properties')) {
      setPageType('propertyListing');
    } else if (location.startsWith('/neighborhoods') && location.split('/').length > 2) {
      setPageType('neighborhood');
    } else if (location.startsWith('/about')) {
      setPageType('about');
    } else if (location.startsWith('/contact')) {
      setPageType('contact');
    } else if (location.startsWith('/blog')) {
      setPageType('blog');
    }
  }, [location]);
  
  // Measure Core Web Vitals if enabled
  useEffect(() => {
    if (!enableCoreWebVitals) return;
    
    let startTime = performance.now();
    let lcpTime = 0;
    let fidTime = 0;
    let layoutShifts: number[] = [];
    
    // Observer for Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      lcpTime = lastEntry.startTime;
      
      // Update LCP value
      setCoreWebVitals(prev => ({
        ...prev,
        LCP: lcpTime / 1000 // convert to seconds
      }));
    });
    
    // Observer for First Input Delay
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      for (const entry of entries) {
        // @ts-ignore - TypeScript doesn't recognize processingStart
        fidTime = entry.processingStart - entry.startTime;
        
        // Update FID value
        setCoreWebVitals(prev => ({
          ...prev,
          FID: fidTime // in milliseconds
        }));
      }
    });
    
    // Observer for Layout Shifts
    const clsObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      for (const entry of entries) {
        // @ts-ignore - TypeScript doesn't recognize value
        layoutShifts.push(entry.value);
        
        // Calculate cumulative value
        const cumulativeLayoutShift = layoutShifts.reduce((sum, value) => sum + value, 0);
        
        // Update CLS value
        setCoreWebVitals(prev => ({
          ...prev,
          CLS: cumulativeLayoutShift
        }));
      }
    });
    
    try {
      // Start observing LCP
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      
      // Start observing FID
      fidObserver.observe({ type: 'first-input', buffered: true });
      
      // Start observing CLS
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      if (debug) {
        console.log('Performance API not fully supported in this browser');
      }
    }
    
    return () => {
      try {
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      } catch (e) {
        // Handle any errors during cleanup
      }
    };
  }, [enableCoreWebVitals, debug]);
  
  // Auto-detect primary and secondary keywords if not provided
  const detectKeywords = () => {
    let primaryKw = [...primaryKeywords];
    let secondaryKw = [...secondaryKeywords];
    
    // Auto-suggest keywords based on page type
    if (primaryKw.length === 0) {
      switch (pageType) {
        case 'homepage':
          primaryKw = ['real estate', 'homes for sale', 'laredo real estate'];
          break;
        case 'propertyListing':
          primaryKw = ['properties for sale', 'real estate listings', 'laredo homes'];
          break;
        case 'propertyDetail':
          if (propertyDetails) {
            primaryKw = [
              propertyDetails.propertyType || 'home',
              `${propertyDetails.bedrooms || ''} bedroom ${propertyDetails.propertyType || 'home'}`,
              propertyDetails.address?.streetAddress || 'property'
            ];
          }
          break;
        case 'about':
          primaryKw = ['about us', 'real estate agents', 'laredo realtors'];
          break;
        case 'contact':
          primaryKw = ['contact realtor', 'real estate agent', 'laredo real estate contact'];
          break;
        case 'neighborhood':
          primaryKw = ['laredo neighborhoods', 'community', 'neighborhood guide'];
          break;
      }
    }
    
    // Auto-suggest secondary keywords
    if (secondaryKw.length === 0) {
      secondaryKw = ['property search', 'real estate agent', 'buy a home', 'sell your house'];
    }
    
    return { primaryKw, secondaryKw };
  };
  
  // Generate page-specific title/description
  const getPageMetadata = () => {
    const { primaryKw } = detectKeywords();
    let title = customTitle || '';
    let description = customDescription || '';
    
    // Generate title if not provided
    if (!title) {
      switch (pageType) {
        case 'homepage':
          title = `Ohana Realty | Laredo's Premier Real Estate Agency`;
          break;
        case 'propertyListing':
          title = `Browse Properties in Laredo, TX | Ohana Realty`;
          break;
        case 'propertyDetail':
          if (propertyDetails) {
            const price = propertyDetails.price ? 
              new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(propertyDetails.price) : '';
              
            title = `${propertyDetails.address?.streetAddress || 'Property'} | ${price} | Ohana Realty`;
          } else {
            title = `Property Details | Ohana Realty`;
          }
          break;
        case 'about':
          title = `About Ohana Realty | Real Estate Experts in Laredo`;
          break;
        case 'contact':
          title = `Contact Us | Ohana Realty`;
          break;
        case 'neighborhood':
          title = `Laredo Neighborhoods | Community Guide | Ohana Realty`;
          break;
      }
    }
    
    // Generate description if not provided
    if (!description) {
      switch (pageType) {
        case 'homepage':
          description = `Ohana Realty offers expert real estate services in Laredo, TX. Browse residential, commercial properties and land for sale with personalized guidance from experienced agents.`;
          break;
        case 'propertyListing':
          description = `Explore our curated selection of properties in Laredo, TX. Filter by price, bedrooms, neighborhoods and more to find your perfect home, commercial property or land investment.`;
          break;
        case 'propertyDetail':
          if (propertyDetails) {
            description = `${propertyDetails.propertyType || 'Property'} at ${propertyDetails.address?.streetAddress || 'address'}, ${propertyDetails.address?.addressLocality || 'Laredo'}, TX. ${propertyDetails.bedrooms ? `${propertyDetails.bedrooms} bedrooms, ` : ''}${propertyDetails.bathrooms ? `${propertyDetails.bathrooms} bathrooms. ` : ''}Contact Ohana Realty today!`;
          } else {
            description = `Detailed property information, features, and photos. Schedule a viewing with Ohana Realty, your trusted Laredo real estate agency.`;
          }
          break;
        case 'about':
          description = `Learn about Ohana Realty's commitment to excellence in Laredo real estate. Our experienced team provides personalized service for buyers, sellers, and investors.`;
          break;
        case 'contact':
          description = `Get in touch with Ohana Realty's expert team. Contact us for all your Laredo real estate needs including property buying, selling, and investment opportunities.`;
          break;
        case 'neighborhood':
          description = `Explore Laredo neighborhoods with our comprehensive guide. Community information, amenities, schools, and available properties in each area.`;
          break;
      }
    }
    
    return { title, description };
  };
  
  // Get NLP entity optimization data
  const getEntityOptimization = () => {
    const entityOptimization = {
      mainEntities: ['real estate', 'property', 'Ohana Realty'],
      locations: localSEOTerms,
      persons: ['Valentin Cuellar'],
    };
    
    // Add page-specific entities
    switch (pageType) {
      case 'propertyDetail':
        if (propertyDetails) {
          entityOptimization.mainEntities.push(propertyDetails.propertyType || 'home');
          if (propertyDetails.features) {
            entityOptimization.mainEntities.push(...propertyDetails.features.slice(0, 3));
          }
        }
        break;
      case 'neighborhood':
        entityOptimization.mainEntities.push('neighborhood', 'community', 'schools', 'amenities');
        break;
    }
    
    return entityOptimization;
  };
  
  // Handle speakable content for voice search
  const getSpeakableContent = () => {
    if (pageType === 'propertyDetail') {
      return {
        cssSelector: '.property-description, .property-features, .property-details, h1'
      };
    }
    
    return {
      cssSelector: 'h1, .main-content p, .featured-section p'
    };
  };
  
  // Dynamically generate critical resource preloads
  const getCriticalPreloads = () => {
    const preloads = [
      { href: '/fonts/main-font.woff2', as: 'font', type: 'font/woff2', crossOrigin: true },
      { href: '/css/critical.css', as: 'style' }
    ] as Array<{
      href: string;
      as: 'image' | 'style' | 'font' | 'script' | 'document';
      type?: string;
      crossOrigin?: boolean;
    }>;
    
    // Add page-specific critical resources
    if (imageUrl) {
      preloads.push({ href: imageUrl, as: 'image' });
    }
    
    return preloads;
  };
  
  // Get the canonical URL
  const getCanonicalUrl = () => {
    // Strip any tracking parameters
    const cleanPath = location.split('?')[0];
    return `${baseUrl}${cleanPath}`;
  };
  
  const { title, description } = getPageMetadata();
  const { primaryKw, secondaryKw } = detectKeywords();
  const canonicalUrl = getCanonicalUrl();
  
  return (
    <>
      {/* Main SEO Component with Enhanced Features */}
      <EnterpriseGradeSEO10K
        title={title}
        description={description}
        imageUrl={imageUrl}
        canonicalUrl={canonicalUrl}
        pageType={pageType}
        primaryKeywords={primaryKw}
        secondaryKeywords={secondaryKw}
        localSEOTerms={localSEOTerms}
        multiLingual={Object.keys(alternateLanguages).length > 0}
        alternateLanguages={alternateLanguages}
        facebookAppId={facebookAppId}
        twitterUsername={twitterUsername}
        organization={organization}
        breadcrumbs={breadcrumbs}
        robotsDirectives={robotsDirectives}
        enableDynamicTitleOptimization={true}
        propertyDetails={propertyDetails}
        faqItems={faqItems}
        entityOptimization={getEntityOptimization()}
        coreWebVitals={enableCoreWebVitals ? coreWebVitals : undefined}
        speakableContent={getSpeakableContent()}
        enableRealTimeOptimization={enableRealTimeOptimization}
        criticalPreloads={getCriticalPreloads()}
      />
      
      {/* Sitemap Generator */}
      <EnterpriseGradeSitemapGenerator
        baseUrl={baseUrl}
        generateHtmlSitemap={true}
        generateRssFeed={true}
        includeImageSitemap={true}
        alternateLanguages={Object.keys(alternateLanguages)}
        pingSearchEngines={false}
      />
      
      {/* Additional Structured Data */}
      {pageType === 'propertyDetail' && propertyDetails && (
        <EnterpriseStructuredData
          type="RealEstateListing"
          realEstateListing={{
            id: 1, // This should be the actual property ID
            name: title,
            description,
            url: canonicalUrl,
            price: propertyDetails.price,
            images: [imageUrl || '/images/property-default.jpg'],
            address: {
              streetAddress: propertyDetails.address?.streetAddress || '',
              addressLocality: propertyDetails.address?.addressLocality || 'Laredo',
              addressRegion: propertyDetails.address?.addressRegion || 'TX',
              postalCode: propertyDetails.address?.postalCode || '78040',
              addressCountry: 'US'
            },
            floorSize: propertyDetails.floorSize ? {
              value: propertyDetails.floorSize,
              unitCode: 'FTK' // Square feet
            } : undefined,
            numberOfBedrooms: propertyDetails.bedrooms,
            numberOfBathrooms: propertyDetails.bathrooms,
            propertyType: propertyDetails.propertyType,
            features: propertyDetails.features,
            geo: propertyDetails.geo,
            broker: {
              name: organization.name,
              image: organization.logo,
              email: organization.email,
              telephone: organization.phone
            }
          }}
          debug={debug}
        />
      )}
      
      {/* FAQ Schema */}
      {faqItems.length > 0 && (
        <EnterpriseStructuredData
          type="FAQ"
          faq={{ questions: faqItems }}
          debug={debug}
        />
      )}
      
      {/* Breadcrumb Schema */}
      {breadcrumbs.length > 0 && (
        <EnterpriseStructuredData
          type="Breadcrumb"
          breadcrumb={{
            items: breadcrumbs.map((item, index) => ({
              ...item,
              position: index + 1
            }))
          }}
          debug={debug}
        />
      )}
    </>
  );
}