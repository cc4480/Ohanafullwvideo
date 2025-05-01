import { useEffect } from 'react';
// Define keywords directly to avoid import issues
const PRIMARY_KEYWORDS = [
  'homes for sale in Laredo TX',
  'houses for sale in Laredo',
  'Laredo real estate',
  'Laredo homes for sale',
  'houses for sale Laredo TX',
  'condos for sale in Laredo',
  'Laredo houses for sale',
  'real estate Laredo TX',
  'Laredo houses for rent',
  'homes for rent in Laredo',
  'Laredo rental properties',
  'Laredo property management',
  'Laredo real estate listings',
  'buy home in Laredo',
  'Laredo investment properties'
];

const NEIGHBORHOOD_KEYWORDS = [
  'Downtown Laredo real estate',
  'North Laredo homes for sale',
  'South Laredo houses',
  'East Laredo properties',
  'West Laredo homes for rent',
  'Del Mar homes Laredo',
  'San Isidro homes for sale'
];

const LONG_TAIL_KEYWORDS = [
  'affordable homes for sale in Laredo TX',
  'houses for sale in Laredo under 200k',
  'luxury houses for sale in Laredo TX',
  'Laredo homes for sale with pool',
  'downtown Laredo condos for sale',
  'Laredo houses for rent pet friendly'
];

/**
 * SEO Domination Hook
 * This hook aggressively injects SEO-optimized metadata into all pages
 * to outrank competitors like Coldwell Banker and RE/MAX
 */
interface SEODominationProps {
  title: string;
  description: string;
  keywords?: string[];
  locationTerm?: string; // e.g., "Laredo", "Laredo TX", etc.
  propertyType?: string; // e.g., "homes", "houses", "condos", etc.
  listingType?: 'sale' | 'rent' | 'both';
  neighborhoodFocus?: string;
  isLocalBusiness?: boolean;
  pageType?: 'home' | 'listings' | 'detail' | 'neighborhood' | 'contact' | 'about';
}

export default function useSEODomination({
  title,
  description,
  keywords = [],
  locationTerm = 'Laredo TX',
  propertyType = 'homes',
  listingType = 'both',
  neighborhoodFocus,
  isLocalBusiness = true,
  pageType = 'home'
}: SEODominationProps) {
  
  useEffect(() => {
    // Clear any existing meta tags
    const existingMetaTags = document.querySelectorAll('meta[data-seo-injected="true"]');
    existingMetaTags.forEach(tag => tag.remove());
    
    // Function to create and append meta tags
    const injectMetaTag = (name: string, content: string) => {
      const meta = document.createElement('meta');
      meta.setAttribute('data-seo-injected', 'true');
      
      if (name.startsWith('og:') || name.startsWith('twitter:')) {
        meta.setAttribute('property', name);
      } else {
        meta.setAttribute('name', name);
      }
      
      meta.setAttribute('content', content);
      document.head.appendChild(meta);
    };
    
    // Set title with keyword optimization
    document.title = title;
    
    // Set standard meta tags
    injectMetaTag('description', description);
    
    // Generate optimized keywords combining user-provided and SEO targets
    let keywordSet = new Set<string>(keywords);
    
    // Add primary keywords based on listing type
    if (listingType === 'sale' || listingType === 'both') {
      PRIMARY_KEYWORDS.filter(k => k.includes('sale') || k.includes('real estate')).forEach(k => keywordSet.add(k));
    }
    
    if (listingType === 'rent' || listingType === 'both') {
      PRIMARY_KEYWORDS.filter(k => k.includes('rent')).forEach(k => keywordSet.add(k));
    }
    
    // Add neighborhood keywords if specified
    if (neighborhoodFocus) {
      NEIGHBORHOOD_KEYWORDS.filter(k => k.toLowerCase().includes(neighborhoodFocus.toLowerCase()))
        .forEach(k => keywordSet.add(k));
    }
    
    // Add property type specific keywords
    const propertyTypeKeywords = PRIMARY_KEYWORDS.filter(k => 
      k.includes(propertyType) || (propertyType === 'homes' && k.includes('house'))
    );
    propertyTypeKeywords.forEach(k => keywordSet.add(k));
    
    // Set the keywords meta tag
    injectMetaTag('keywords', Array.from(keywordSet).join(', '));
    
    // OpenGraph tags for social sharing
    injectMetaTag('og:title', title);
    injectMetaTag('og:description', description);
    injectMetaTag('og:type', isLocalBusiness ? 'business.business' : 'website');
    injectMetaTag('og:locale', 'en_US');
    
    // Twitter card tags
    injectMetaTag('twitter:card', 'summary_large_image');
    injectMetaTag('twitter:title', title);
    injectMetaTag('twitter:description', description);
    
    // Location-specific tags for local SEO
    injectMetaTag('geo.region', 'US-TX');
    injectMetaTag('geo.placename', 'Laredo');
    injectMetaTag('geo.position', '27.506;-99.507'); // Laredo coordinates
    injectMetaTag('ICBM', '27.506, -99.507');
    
    // Add structured data for SEO
    const insertStructuredData = (data: any) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(data);
      script.setAttribute('data-seo-injected', 'true');
      document.head.appendChild(script);
    };

    // Local business structured data for home and about pages
    if (isLocalBusiness && (pageType === 'home' || pageType === 'about')) {
      const localBusinessData = {
        '@context': 'https://schema.org',
        '@type': 'RealEstateAgent',
        'name': 'Ohana Realty',
        'description': 'Leading real estate agency in Laredo TX specializing in homes and properties for sale and rent.',
        'url': window.location.origin,
        'logo': `${window.location.origin}/logo.png`,
        'image': `${window.location.origin}/building.jpg`,
        'priceRange': '$$',
        'telephone': '+19561234567',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': '1300 Matamoros St',
          'addressLocality': 'Laredo',
          'addressRegion': 'TX',
          'postalCode': '78040',
          'addressCountry': 'US'
        },
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': 27.506,
          'longitude': -99.507
        },
        'sameAs': [
          'https://www.facebook.com/ohanarealty',
          'https://www.instagram.com/ohanarealty'
        ],
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '4.9',
          'reviewCount': '127'
        }
      };
      
      insertStructuredData(localBusinessData);
    }
    
    // Add BreadcrumbList structured data for all pages
    const breadcrumbData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': window.location.origin
        }
      ]
    };
    
    // Add additional breadcrumb items based on page type
    if (pageType === 'listings') {
      breadcrumbData.itemListElement.push({
        '@type': 'ListItem',
        'position': 2,
        'name': listingType === 'rent' ? 'Rentals' : 'Properties For Sale',
        'item': `${window.location.origin}/${listingType === 'rent' ? 'rentals' : 'properties'}`
      });
    } else if (pageType === 'detail') {
      breadcrumbData.itemListElement.push(
        {
          '@type': 'ListItem',
          'position': 2,
          'name': listingType === 'rent' ? 'Rentals' : 'Properties For Sale',
          'item': `${window.location.origin}/${listingType === 'rent' ? 'rentals' : 'properties'}`
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': title.split('|')[0].trim(),
          'item': window.location.href
        }
      );
    } else if (pageType !== 'home') {
      breadcrumbData.itemListElement.push({
        '@type': 'ListItem',
        'position': 2,
        'name': pageType.charAt(0).toUpperCase() + pageType.slice(1),
        'item': window.location.href
      });
    }
    
    insertStructuredData(breadcrumbData);
    
    // Cleanup function to remove all injected tags when component unmounts
    return () => {
      document.querySelectorAll('[data-seo-injected="true"]').forEach(el => el.remove());
    };
  }, [title, description, keywords, locationTerm, propertyType, listingType, neighborhoodFocus, isLocalBusiness, pageType]);

  // No need to return anything as this hook only performs side effects
  return null;
}
