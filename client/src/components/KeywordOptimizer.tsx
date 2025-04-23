import { Helmet } from 'react-helmet';
import React from 'react';

interface KeywordOptimizerProps {
  /**
   * Primary target keywords for this page
   */
  primaryKeywords: string[];
  
  /**
   * Secondary target keywords for this page
   */
  secondaryKeywords?: string[];
  
  /**
   * Long-tail keywords for this page
   */
  longTailKeywords?: string[];
  
  /**
   * Local geographical keywords
   */
  locationKeywords?: string[];
  
  /**
   * Semantic related keywords
   */
  semanticKeywords?: string[];
  
  /**
   * Include LSI (Latent Semantic Indexing) keywords
   */
  enableLSI?: boolean;
  
  /**
   * Page URL for canonical reference
   */
  pageUrl: string;
  
  /**
   * Page type (homepage, listing, etc)
   */
  pageType: 'homepage' | 'property-listing' | 'property-detail' | 'neighborhood' | 'about' | 'contact';
  
  /**
   * Enable advanced NLP optimization
   */
  advancedNLP?: boolean;
}

/**
 * Comprehensive keyword optimization component that implements:
 * - Strategic keyword placement
 * - LSI (Latent Semantic Indexing) optimization
 * - NLP (Natural Language Processing) optimized patterns
 * - Entity-based keyword optimization
 * - keyword proximity and density optimization
 * 
 * This enhances the semantic relevance of pages for target keywords
 * through structured meta tags that search engines reward with
 * higher rankings.
 */
export default function KeywordOptimizer({
  primaryKeywords = [],
  secondaryKeywords = [],
  longTailKeywords = [],
  locationKeywords = [],
  semanticKeywords = [],
  enableLSI = true,
  pageUrl,
  pageType,
  advancedNLP = true
}: KeywordOptimizerProps) {

  // Generate primary keyword combinations
  const keywordCombinations = generateKeywordCombinations(
    primaryKeywords, 
    locationKeywords
  );
  
  // Create semantic keyword mappings with LSI if enabled
  const enhancedKeywords = enableLSI 
    ? generateLSIKeywords([
        ...primaryKeywords,
        ...secondaryKeywords,
        ...locationKeywords
      ])
    : [...primaryKeywords, ...secondaryKeywords, ...locationKeywords];
  
  // Generate NLP enhancements for better semantic understanding
  const nlpEnhancements = advancedNLP 
    ? generateNLPOptimizations(primaryKeywords, pageType)
    : [];
  
  // Generate temporal relevance signals
  const temporalRelevance = [
    `${new Date().getFullYear()} ${primaryKeywords[0] || 'real estate'} guide`,
    `${locationKeywords[0] || 'Laredo'} property market ${new Date().getFullYear()}`,
    `current ${primaryKeywords[0] || 'real estate'} trends`
  ];
    
  // All keywords for meta tags, combined and deduplicated
  const allKeywords = Array.from(new Set([
    ...primaryKeywords,
    ...secondaryKeywords,
    ...longTailKeywords,
    ...locationKeywords,
    ...semanticKeywords,
    ...keywordCombinations,
    ...temporalRelevance,
    ...enhancedKeywords
  ]));
  
  // Meta description optimized for primary keywords
  const metaDescription = generateOptimizedDescription(
    primaryKeywords,
    locationKeywords,
    pageType
  );
  
  return (
    <Helmet>
      {/* Enhanced keyword meta tags */}
      <meta name="keywords" content={allKeywords.join(', ')} />
      
      {/* Primary keyword focus - helps search algorithms identify main topics */}
      {primaryKeywords.map(keyword => (
        <meta key={`primary-${keyword}`} name="keyword:primary" content={keyword} />
      ))}
      
      {/* Secondary keywords */}
      {secondaryKeywords.map(keyword => (
        <meta key={`secondary-${keyword}`} name="keyword:secondary" content={keyword} />
      ))}
      
      {/* Geographic relevance signals */}
      {locationKeywords.map(location => (
        <meta key={`location-${location}`} name="keyword:location" content={location} />
      ))}
      
      {/* Long-tail optimization */}
      {longTailKeywords.map(longTail => (
        <meta key={`longtail-${longTail}`} name="keyword:query" content={longTail} />
      ))}
      
      {/* Semantic topic mapping - helps with topic relevance */}
      {semanticKeywords.map(semantic => (
        <meta key={`semantic-${semantic}`} name="keyword:topic" content={semantic} />
      ))}
      
      {/* NLP optimizations when enabled */}
      {advancedNLP && nlpEnhancements.map(nlp => (
        <meta key={`nlp-${nlp.content.substring(0, 20)}`} name={nlp.name} content={nlp.content} />
      ))}
      
      {/* Enhanced search description */}
      <meta name="description" content={metaDescription} />
    </Helmet>
  );
}

/**
 * Generates combinations of keywords with locations for
 * comprehensive long-tail coverage
 */
function generateKeywordCombinations(
  keywords: string[],
  locations: string[] = []
): string[] {
  const combinations: string[] = [];
  
  // Create keyword + location combinations
  keywords.forEach(keyword => {
    locations.forEach(location => {
      combinations.push(`${keyword} in ${location}`);
      combinations.push(`${keyword} ${location}`);
      combinations.push(`${location} ${keyword}`);
      combinations.push(`best ${keyword} in ${location}`);
    });
    
    // Add common search modifiers
    combinations.push(`best ${keyword}`);
    combinations.push(`top ${keyword}`);
    combinations.push(`${keyword} for sale`);
    combinations.push(`${keyword} near me`);
  });
  
  return combinations;
}

/**
 * Generate optimized LSI keywords based on primary keywords
 * LSI keywords are semantically related terms that search engines
 * use to determine the content's context and relevance
 */
function generateLSIKeywords(keywords: string[]): string[] {
  const lsiMapping: {[key: string]: string[]} = {
    // Real estate general terms
    'real estate': ['property', 'home', 'house', 'realty', 'real property', 'housing'],
    'house': ['home', 'property', 'residence', 'dwelling', 'building', 'structure'],
    'property': ['real estate', 'land', 'lot', 'home', 'house', 'building'],
    'home': ['house', 'property', 'residence', 'dwelling', 'living space'],
    
    // Property types
    'residential': ['homes', 'houses', 'family home', 'living', 'domestic'],
    'commercial': ['business', 'office', 'retail', 'industrial', 'investment'],
    'apartment': ['condo', 'flat', 'unit', 'suite', 'condominium'],
    'condo': ['condominium', 'apartment', 'suite', 'unit', 'loft'],
    'townhouse': ['townhome', 'row house', 'attached home', 'duplex'],
    'land': ['lot', 'acreage', 'property', 'parcel', 'plot'],
    
    // Buying/selling terms
    'buy': ['purchase', 'acquire', 'invest in', 'own'],
    'sell': ['list', 'offer', 'market', 'put up for sale'],
    'for sale': ['on the market', 'available', 'listed', 'for purchase'],
    'price': ['cost', 'value', 'offer', 'asking price', 'listing price'],
    
    // Features
    'bedroom': ['bed', 'BR', 'sleeping room', 'master suite'],
    'bathroom': ['bath', 'BA', 'full bath', 'en suite'],
    'kitchen': ['culinary space', 'cooking area', 'food preparation'],
    'garage': ['car port', 'parking', 'auto storage', 'vehicle space'],
    
    // Locations
    'Laredo': ['Webb County', 'South Texas', 'Texas border', 'Rio Grande'],
    'downtown': ['city center', 'urban core', 'central business district'],
    'suburban': ['outskirts', 'residential area', 'subdivision'],
    'waterfront': ['riverside', 'lakefront', 'water view', 'shoreline'],
    
    // Real estate actions
    'buy a home': ['home purchase', 'acquire property', 'homebuying'],
    'sell a home': ['home sale', 'property listing', 'homeselling'],
    'invest in property': ['real estate investment', 'property investment'],
    'view homes': ['tour properties', 'see listings', 'property showings']
  };
  
  const lsiKeywords: string[] = [];
  
  // Generate LSI keywords based on mapping
  keywords.forEach(keyword => {
    const lowerKeyword = keyword.toLowerCase();
    
    // Check if we have LSI mappings for this keyword
    Object.keys(lsiMapping).forEach(key => {
      if (lowerKeyword.includes(key)) {
        lsiKeywords.push(...lsiMapping[key]);
      }
    });
  });
  
  // Return unique LSI keywords
  return Array.from(new Set(lsiKeywords));
}

/**
 * Generate NLP optimizations for better semantic understanding
 * by search engines using entities and relationships
 */
function generateNLPOptimizations(
  keywords: string[],
  pageType: string
): Array<{name: string, content: string}> {
  const nlpTags: Array<{name: string, content: string}> = [];
  
  // Define NLP semantic structures based on page type
  switch(pageType) {
    case 'property-detail':
      nlpTags.push({
        name: 'entity:housing',
        content: keywords.join(', ')
      });
      nlpTags.push({
        name: 'entity:realestate:property',
        content: 'for-sale residential property'
      });
      break;
      
    case 'neighborhood':
      nlpTags.push({
        name: 'entity:location',
        content: keywords.join(', ')
      });
      nlpTags.push({
        name: 'entity:realestate:neighborhood',
        content: 'residential neighborhood area'
      });
      break;
      
    case 'homepage':
      nlpTags.push({
        name: 'entity:business',
        content: 'real estate agency'
      });
      nlpTags.push({
        name: 'entity:realestate:service',
        content: 'property sales and listings'
      });
      break;
      
    case 'contact':
      nlpTags.push({
        name: 'entity:localbusiness',
        content: 'real estate agency office'
      });
      break;
  }
  
  // Add service/action related NLP tags
  nlpTags.push({
    name: 'entity:service:realestate',
    content: 'finding, buying, and selling properties'
  });
  
  return nlpTags;
}

/**
 * Generate optimized meta description with strategic
 * keyword placement for maximum search relevance
 */
function generateOptimizedDescription(
  primaryKeywords: string[],
  locationKeywords: string[] = [],
  pageType: string
): string {
  // Base descriptions optimized by page type
  const baseDescriptions: {[key: string]: string} = {
    'homepage': 'Find exceptional %PRIMARY% with Ohana Realty in %LOCATION%. Expert real estate services for buying, selling, and renting properties with personalized guidance throughout your journey.',
    
    'property-listing': 'Discover premium %PRIMARY% for sale in %LOCATION%. Browse our curated selection of properties with detailed information, high-quality photos, and comprehensive neighborhood insights.',
    
    'property-detail': 'Exceptional %PRIMARY% for sale in %LOCATION%. This remarkable property offers premium features, ideal location, and represents an outstanding opportunity for buyers seeking quality and value.',
    
    'neighborhood': 'Explore %LOCATION% neighborhood information including local amenities, real estate trends, property values, schools, and lifestyle insights to find your perfect %PRIMARY%.',
    
    'about': 'Ohana Realty is your trusted partner for %PRIMARY% in %LOCATION%, with years of local expertise and a commitment to exceptional client service through every step of your real estate journey.',
    
    'contact': 'Connect with Ohana Realty experts about %PRIMARY% in %LOCATION%. Our dedicated team is ready to assist with all your real estate needs and questions.'
  };
  
  // Get base description template for this page type
  let description = baseDescriptions[pageType] || baseDescriptions['homepage'];
  
  // Replace placeholders with actual keywords
  if (primaryKeywords.length > 0) {
    description = description.replace('%PRIMARY%', primaryKeywords[0]);
  }
  
  if (locationKeywords.length > 0) {
    description = description.replace('%LOCATION%', locationKeywords[0]);
  }
  
  return description;
}