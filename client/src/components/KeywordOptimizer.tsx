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
 * Generates exhaustive combinations of keywords with locations for
 * comprehensive long-tail coverage across all possible search intents
 */
function generateKeywordCombinations(
  keywords: string[],
  locations: string[] = []
): string[] {
  const combinations: string[] = [];
  
  // Basic modifiers that can be applied to keywords
  const modifiers = [
    'best', 'top', 'affordable', 'luxury', 'premier', 'trusted', 'reliable',
    'experienced', 'leading', 'professional', 'local', 'licensed', 'certified',
    'award-winning', 'top-rated', 'highest-rated', 'recommended', 'preferred',
    'expert', 'specializing in', 'quality', 'personalized', 'custom', 'new',
    'modern', 'updated', 'renovated', 'move-in ready'
  ];
  
  // Question-based long-tail keywords
  const questions = [
    'how to find', 'where to find', 'who sells', 'who buys',
    'how much is', 'how to buy', 'how to sell', 'when to buy',
    'when to sell', 'why use', 'what is the best', 'which is better'
  ];
  
  // Action-intent modifiers
  const actions = [
    'for sale', 'for rent', 'to buy', 'to sell', 'to invest in', 
    'for investment', 'near me', 'in my area', 'close by', 'listings',
    'deals', 'specials', 'open houses', 'virtual tours'
  ];
  
  // Create keyword + location combinations
  keywords.forEach(keyword => {
    // Basic keyword variations
    combinations.push(keyword);
    combinations.push(`${keyword}s`); // Plurals
    
    // Keyword + action intent
    actions.forEach(action => {
      combinations.push(`${keyword} ${action}`);
    });
    
    // Modified keywords
    modifiers.forEach(modifier => {
      combinations.push(`${modifier} ${keyword}`);
    });
    
    // Question-based keywords
    questions.forEach(question => {
      combinations.push(`${question} ${keyword}`);
    });
    
    // Location-based combinations
    locations.forEach(location => {
      // Basic location combinations
      combinations.push(`${keyword} in ${location}`);
      combinations.push(`${keyword} ${location}`);
      combinations.push(`${location} ${keyword}`);
      combinations.push(`${location} area ${keyword}`);
      
      // Modified location combinations
      modifiers.forEach(modifier => {
        combinations.push(`${modifier} ${keyword} in ${location}`);
        combinations.push(`${modifier} ${location} ${keyword}`);
      });
      
      // Action intent with location
      actions.forEach(action => {
        combinations.push(`${keyword} ${action} in ${location}`);
        combinations.push(`${location} ${keyword} ${action}`);
      });
      
      // Year-specific location keywords
      const currentYear = new Date().getFullYear();
      combinations.push(`${keyword} in ${location} ${currentYear}`);
      combinations.push(`${location} ${keyword} ${currentYear}`);
      
      // Question-based with location
      questions.forEach(question => {
        combinations.push(`${question} ${keyword} in ${location}`);
      });
    });
    
    // Special localized combinations for real estate
    if (locations.length > 0) {
      combinations.push(`${keyword} for sale by owner in ${locations[0]}`);
      combinations.push(`${keyword} with pool in ${locations[0]}`);
      combinations.push(`${keyword} with garage in ${locations[0]}`);
      combinations.push(`${keyword} with view in ${locations[0]}`);
      combinations.push(`waterfront ${keyword} in ${locations[0]}`);
      combinations.push(`gated community ${keyword} in ${locations[0]}`);
      combinations.push(`${keyword} near downtown ${locations[0]}`);
      combinations.push(`${keyword} near schools in ${locations[0]}`);
      combinations.push(`${keyword} near shopping in ${locations[0]}`);
      combinations.push(`${keyword} with acreage in ${locations[0]}`);
      combinations.push(`historic ${keyword} in ${locations[0]}`);
      combinations.push(`new construction ${keyword} in ${locations[0]}`);
    }
    
    // Intent-based keywords
    combinations.push(`find ${keyword}`);
    combinations.push(`search for ${keyword}`);
    combinations.push(`looking for ${keyword}`);
    combinations.push(`need ${keyword}`);
    combinations.push(`want to buy ${keyword}`);
    combinations.push(`want to sell ${keyword}`);
    combinations.push(`${keyword} website`);
    combinations.push(`${keyword} online`);
    combinations.push(`${keyword} app`);
    combinations.push(`${keyword} search`);
    combinations.push(`${keyword} estimate`);
    combinations.push(`${keyword} valuation`);
    combinations.push(`${keyword} comparison`);
    combinations.push(`${keyword} reviews`);
    combinations.push(`${keyword} ratings`);
    combinations.push(`${keyword} testimonials`);
  });
  
  // Return all unique combinations
  return Array.from(new Set(combinations));
}

/**
 * Generate optimized LSI keywords based on primary keywords
 * LSI keywords are semantically related terms that search engines
 * use to determine the content's context and relevance
 */
function generateLSIKeywords(keywords: string[]): string[] {
  const lsiMapping: {[key: string]: string[]} = {
    // Real estate general terms - expanded
    'real estate': [
      'property', 'home', 'house', 'realty', 'real property', 'housing', 'real estate market', 
      'property market', 'real estate listings', 'real estate properties', 'real estate for sale',
      'real estate agent', 'real estate broker', 'property for sale', 'realty listings', 
      'real estate website', 'property website', 'property search', 'find real estate',
      'local real estate', 'online real estate', 'affordable real estate', 'luxury real estate',
      'real estate company', 'realty company', 'real estate agency', 'real estate search',
      'real estate help', 'real estate experts', 'real estate professionals', 'property experts'
    ],
    
    'house': [
      'home', 'property', 'residence', 'dwelling', 'building', 'structure', 'family home', 
      'single-family home', 'house for sale', 'home for sale', 'houses near me', 'homes near me',
      'residential house', 'single family house', 'new house', 'existing house', 'resale house',
      'house listings', 'home listings', 'houses listed', 'homes listed', 'open house',
      'houses in', 'homes in', 'detached house', 'attached house', 'modern house',
      'contemporary house', 'renovated house', 'updated house', 'move-in ready house',
      'dream home', 'forever home', 'starter home', 'family house', 'perfect house',
      'beautiful home', 'gorgeous house', 'stunning home', 'house tour', 'house viewing',
      'house showing', 'custom home', 'custom built house', 'model home', 'spec house'
    ],
    
    'property': [
      'real estate', 'land', 'lot', 'home', 'house', 'building', 'property for sale',
      'property listings', 'available property', 'listed property', 'new property',
      'property search', 'find property', 'residential property', 'commercial property',
      'investment property', 'rental property', 'affordable property', 'luxury property',
      'waterfront property', 'beachfront property', 'lakefront property', 'riverfront property',
      'golf course property', 'mountain view property', 'downtown property', 'suburban property',
      'rural property', 'urban property', 'property management', 'property taxes',
      'property value', 'property appraisal', 'property assessment', 'property inspection',
      'property development', 'property investment'
    ],
    
    'home': [
      'house', 'property', 'residence', 'dwelling', 'living space', 'family home',
      'dream home', 'starter home', 'forever home', 'perfect home', 'new home',
      'existing home', 'resale home', 'home buyers', 'home sellers', 'home buying',
      'home selling', 'buying a home', 'selling a home', 'home ownership',
      'home search', 'find a home', 'buy a home', 'sell a home', 'home inspection',
      'home appraisal', 'home value', 'home equity', 'home loan', 'home mortgage',
      'home financing', 'home insurance', 'home warranty', 'home improvements',
      'home renovations', 'home upgrades', 'home remodeling', 'custom home',
      'luxury home', 'affordable home', 'model home', 'spec home', 'home tours',
      'home listings', 'virtual home tour', 'open house', 'home showings'
    ],
    
    // Property types - expanded
    'residential': [
      'homes', 'houses', 'family home', 'living', 'domestic', 'residential property',
      'residential real estate', 'residential listing', 'residential home', 'residential house',
      'residential lot', 'residential land', 'residential neighborhood', 'residential community',
      'residential development', 'residential builder', 'residential construction',
      'residential for sale', 'residential purchase', 'residential investment',
      'residential mortgage', 'residential loan', 'residential market', 'residential area'
    ],
    
    'commercial': [
      'business', 'office', 'retail', 'industrial', 'investment', 'commercial property',
      'commercial real estate', 'commercial listing', 'commercial building', 'commercial space',
      'commercial lot', 'commercial land', 'commercial lease', 'commercial rent',
      'commercial for sale', 'commercial for lease', 'commercial development',
      'commercial investment', 'office space', 'retail space', 'warehouse space',
      'industrial space', 'commercial mortgage', 'commercial loan', 'business property'
    ],
    
    'apartment': [
      'condo', 'flat', 'unit', 'suite', 'condominium', 'apartment for rent',
      'apartment for sale', 'apartment building', 'apartment complex', 'apartment community',
      'apartment homes', 'high-rise apartment', 'garden apartment', 'luxury apartment',
      'affordable apartment', 'studio apartment', 'one-bedroom apartment',
      'two-bedroom apartment', 'three-bedroom apartment', 'apartment living',
      'apartment lease', 'apartment rental', 'furnished apartment', 'unfurnished apartment'
    ],
    
    'condo': [
      'condominium', 'apartment', 'suite', 'unit', 'loft', 'condo for sale',
      'condo for rent', 'condo building', 'condo complex', 'condo community',
      'condo living', 'condo lifestyle', 'condo association', 'condo fees',
      'luxury condo', 'affordable condo', 'waterfront condo', 'beachfront condo',
      'lakefront condo', 'riverfront condo', 'downtown condo', 'high-rise condo',
      'garden condo', 'townhouse-style condo', 'studio condo', 'one-bedroom condo',
      'two-bedroom condo', 'three-bedroom condo', 'penthouse condo'
    ],
    
    'townhouse': [
      'townhome', 'row house', 'attached home', 'duplex', 'townhouse for sale',
      'townhouse for rent', 'townhouse community', 'townhouse complex',
      'townhouse living', 'townhouse lifestyle', 'townhouse association',
      'townhouse fees', 'luxury townhouse', 'affordable townhouse',
      'end-unit townhouse', 'interior-unit townhouse', 'two-story townhouse',
      'three-story townhouse', 'urban townhouse', 'suburban townhouse'
    ],
    
    'land': [
      'lot', 'acreage', 'property', 'parcel', 'plot', 'land for sale',
      'vacant land', 'undeveloped land', 'raw land', 'buildable lot',
      'building lot', 'development land', 'investment land', 'residential lot',
      'commercial lot', 'agricultural land', 'farm land', 'ranch land',
      'hunting land', 'waterfront lot', 'beachfront lot', 'lakefront lot',
      'riverfront lot', 'mountain land', 'rural land', 'urban land',
      'suburban land', 'wooded lot', 'cleared lot', 'corner lot',
      'oversized lot', 'subdivided lot', 'surveyed land', 'zoning',
      'land use', 'lot size', 'acreage for sale', 'land development'
    ],
    
    // Laredo-specific terms - expanded for local SEO
    'Laredo': [
      'Webb County', 'South Texas', 'Texas border', 'Rio Grande', 'Laredo TX',
      'Laredo Texas', 'Laredo real estate', 'Laredo homes', 'Laredo houses',
      'Laredo properties', 'Laredo homes for sale', 'Laredo houses for sale',
      'Laredo property for sale', 'Laredo realtors', 'Laredo real estate agents',
      'Laredo real estate brokers', 'Laredo real estate agencies',
      'buying a home in Laredo', 'buying a house in Laredo',
      'selling a home in Laredo', 'selling a house in Laredo',
      'Laredo residential', 'Laredo commercial', 'Laredo land',
      'Laredo lots', 'Laredo neighborhoods', 'Laredo communities',
      'Laredo school districts', 'North Laredo', 'South Laredo',
      'East Laredo', 'West Laredo', 'Downtown Laredo', 'Del Mar',
      'Laredo Heights', 'Mines Road', 'Las Lomas', 'Alexander area',
      'Laredo housing market', 'Laredo property values',
      'Laredo home prices', 'Laredo real estate market trends',
      'Laredo luxury homes', 'Laredo affordable homes',
      'Laredo new construction', 'Laredo new homes',
      'Laredo waterfront property', 'Laredo investment property',
      'Laredo real estate investment', 'Laredo property management',
      'living in Laredo', 'moving to Laredo', 'relocating to Laredo',
      'Laredo cost of living', 'Laredo home buyers', 'Laredo home sellers',
      'Laredo home inspection', 'Laredo mortgage', 'Laredo home loans',
      'Laredo real estate listings', 'Laredo MLS', 'Laredo virtual tours',
      'Laredo open houses', 'Laredo real estate photos',
      'Laredo real estate videos', 'Laredo drone photography',
      'Laredo 3D tours', 'Laredo real estate website',
      'Laredo property search', 'Laredo house search', 'Laredo home search',
      'real estate agent in Laredo', 'realtor in Laredo',
      'best real estate agent in Laredo', 'top realtor in Laredo',
      'experienced real estate agent in Laredo',
      'trusted realtor in Laredo', 'award-winning realtor in Laredo',
      'multi-lingual real estate agent in Laredo',
      'English speaking realtor in Laredo',
      'Spanish speaking realtor in Laredo',
      'sell my house in Laredo', 'sell my home in Laredo',
      'list my property in Laredo', 'how much is my house worth in Laredo',
      'Laredo home valuation', 'Laredo property assessment',
      'Laredo real estate taxes', 'Laredo property taxes'
    ],
    
    // More Laredo neighborhoods for hyper-local SEO
    'North Laredo': [
      'North Laredo homes', 'North Laredo houses', 'North Laredo real estate',
      'North Laredo properties', 'homes for sale in North Laredo',
      'houses for sale in North Laredo', 'North Laredo neighborhoods',
      'North Laredo schools', 'North Laredo shopping', 'North Laredo restaurants',
      'living in North Laredo', 'moving to North Laredo', 'North Laredo luxury homes',
      'North Laredo new construction', 'North Laredo custom homes',
      'North Laredo builders', 'North Laredo developments',
      'North Laredo master-planned communities', 'North Laredo gated communities'
    ],
    
    'South Laredo': [
      'South Laredo homes', 'South Laredo houses', 'South Laredo real estate',
      'South Laredo properties', 'homes for sale in South Laredo',
      'houses for sale in South Laredo', 'South Laredo neighborhoods',
      'South Laredo schools', 'South Laredo shopping', 'South Laredo restaurants',
      'living in South Laredo', 'moving to South Laredo', 'South Laredo affordable homes',
      'South Laredo new construction', 'South Laredo developments',
      'South Laredo communities'
    ],
    
    'Downtown Laredo': [
      'Downtown Laredo homes', 'Downtown Laredo real estate',
      'Downtown Laredo properties', 'homes for sale in Downtown Laredo',
      'Downtown Laredo condos', 'Downtown Laredo lofts',
      'Downtown Laredo apartments', 'Downtown Laredo historic homes',
      'living in Downtown Laredo', 'Downtown Laredo lifestyle',
      'Downtown Laredo restaurants', 'Downtown Laredo shopping',
      'Downtown Laredo entertainment', 'Downtown Laredo nightlife',
      'Downtown Laredo events', 'Downtown Laredo culture'
    ],
    
    'Del Mar': [
      'Del Mar Laredo', 'Del Mar homes', 'Del Mar houses', 'Del Mar real estate',
      'Del Mar properties', 'homes for sale in Del Mar',
      'houses for sale in Del Mar', 'Del Mar neighborhood',
      'Del Mar schools', 'Del Mar shopping', 'Del Mar restaurants',
      'living in Del Mar', 'moving to Del Mar', 'Del Mar luxury homes',
      'Del Mar custom homes', 'Del Mar builders', 'Del Mar developments',
      'Del Mar community'
    ]
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
 * Generate advanced NLP optimizations for better semantic understanding
 * by search engines using entities, relationships, and intent-based signals.
 * This implementation follows enterprise-grade SEO best practices for
 * comprehensive search engine coverage and semantic relevance.
 */
function generateNLPOptimizations(
  keywords: string[],
  pageType: string
): Array<{name: string, content: string}> {
  const nlpTags: Array<{name: string, content: string}> = [];
  const currentYear = new Date().getFullYear();
  
  // Add current date signals for temporal relevance
  nlpTags.push({
    name: 'entity:temporal:relevance',
    content: `${currentYear} current updated information`
  });
  
  // Define NLP semantic structures based on page type
  switch(pageType) {
    case 'property-detail':
      // Property entity and classification
      nlpTags.push({
        name: 'entity:housing',
        content: keywords.join(', ')
      });
      nlpTags.push({
        name: 'entity:realestate:property',
        content: 'for-sale residential property'
      });
      
      // Property semantic relationships
      nlpTags.push({
        name: 'entity:relationship:located_in',
        content: 'Laredo, Texas, United States'
      });
      nlpTags.push({
        name: 'entity:properties:features',
        content: 'bedrooms, bathrooms, square footage, amenities, floor plan'
      });
      nlpTags.push({
        name: 'entity:transaction:type',
        content: 'for sale, real estate listing, available property'
      });
      
      // Search intent signals
      nlpTags.push({
        name: 'search:intent:transactional',
        content: 'buy property, purchase home, view listing, schedule showing'
      });
      nlpTags.push({
        name: 'search:intent:informational',
        content: 'property details, home specifications, neighborhood information'
      });
      
      // Mobile specific signals
      nlpTags.push({
        name: 'device:mobile:action',
        content: 'call agent, get directions, save listing'
      });
      break;
      
    case 'neighborhood':
      // Neighborhood entity and classification
      nlpTags.push({
        name: 'entity:location',
        content: keywords.join(', ')
      });
      nlpTags.push({
        name: 'entity:realestate:neighborhood',
        content: 'residential neighborhood area'
      });
      
      // Neighborhood semantic relationships
      nlpTags.push({
        name: 'entity:relationship:part_of',
        content: 'Laredo, Texas, United States'
      });
      nlpTags.push({
        name: 'entity:location:features',
        content: 'schools, parks, shopping, dining, entertainment, amenities'
      });
      nlpTags.push({
        name: 'entity:relationship:contains',
        content: 'homes, houses, properties, streets, landmarks'
      });
      
      // Search intent signals
      nlpTags.push({
        name: 'search:intent:informational',
        content: 'neighborhood information, area details, community insights'
      });
      nlpTags.push({
        name: 'search:intent:navigational',
        content: 'find properties in neighborhood, explore area, locate schools'
      });
      
      // Local signals
      nlpTags.push({
        name: 'local:community:insights',
        content: 'lifestyle, demographics, development, market trends'
      });
      break;
      
    case 'property-listing':
      // Property listings entity and classification
      nlpTags.push({
        name: 'entity:collection',
        content: 'property listings, real estate inventory, available homes'
      });
      nlpTags.push({
        name: 'entity:realestate:listings',
        content: 'searchable property database, real estate collection'
      });
      
      // Listings semantic relationships
      nlpTags.push({
        name: 'entity:relationship:filters',
        content: 'price, bedrooms, bathrooms, location, type, features'
      });
      nlpTags.push({
        name: 'entity:relationship:sorted_by',
        content: 'newest, price ascending, price descending, popularity'
      });
      
      // Search intent signals
      nlpTags.push({
        name: 'search:intent:transactional',
        content: 'find property, search homes, filter listings, compare properties'
      });
      nlpTags.push({
        name: 'search:intent:navigational',
        content: 'browse real estate, explore properties, view listings'
      });
      break;
      
    case 'homepage':
      // Agency entity and classification
      nlpTags.push({
        name: 'entity:business',
        content: 'real estate agency, realty company, property brokerage'
      });
      nlpTags.push({
        name: 'entity:realestate:service',
        content: 'property sales, property listings, real estate consultation'
      });
      
      // Business semantic relationships
      nlpTags.push({
        name: 'entity:relationship:provides',
        content: 'real estate services, property listings, market expertise'
      });
      nlpTags.push({
        name: 'entity:relationship:serves',
        content: 'home buyers, home sellers, property investors, relocating families'
      });
      
      // Search intent signals
      nlpTags.push({
        name: 'search:intent:navigational',
        content: 'real estate agency, realtor website, property company'
      });
      nlpTags.push({
        name: 'search:intent:informational',
        content: 'real estate services, property help, realty information'
      });
      
      // Brand signals
      nlpTags.push({
        name: 'brand:identity:values',
        content: 'trusted, experienced, professional, client-focused'
      });
      break;
      
    case 'contact':
      // Contact entity and classification
      nlpTags.push({
        name: 'entity:localbusiness',
        content: 'real estate agency office, realtor contact information'
      });
      nlpTags.push({
        name: 'entity:realestate:contact',
        content: 'agent contact, property inquiry, real estate consultation'
      });
      
      // Contact semantic relationships
      nlpTags.push({
        name: 'entity:relationship:method',
        content: 'phone, email, form, visit, appointment, consultation'
      });
      
      // Search intent signals
      nlpTags.push({
        name: 'search:intent:transactional',
        content: 'contact realtor, schedule appointment, request information'
      });
      
      // Local signals
      nlpTags.push({
        name: 'local:business:contact',
        content: 'address, phone number, business hours, directions'
      });
      break;
      
    case 'about':
      // About entity and classification
      nlpTags.push({
        name: 'entity:business:information',
        content: 'company history, team details, mission statement, values'
      });
      nlpTags.push({
        name: 'entity:realestate:agency',
        content: 'real estate company background, realtor information'
      });
      
      // About semantic relationships
      nlpTags.push({
        name: 'entity:relationship:consists_of',
        content: 'agents, brokers, team members, staff, professionals'
      });
      
      // Search intent signals
      nlpTags.push({
        name: 'search:intent:informational',
        content: 'about real estate agency, realtor background, agent experience'
      });
      
      // Trust signals
      nlpTags.push({
        name: 'trust:indicators:experience',
        content: 'years in business, transaction volume, client satisfaction'
      });
      break;
  }
  
  // Add universal service/action related NLP tags
  nlpTags.push({
    name: 'entity:service:realestate',
    content: 'finding, buying, and selling properties, real estate services'
  });
  
  // Add universal local business signals
  nlpTags.push({
    name: 'local:business:service_area',
    content: 'Laredo, Webb County, South Texas, Texas border region'
  });
  
  // Add universal mobile optimization signals
  nlpTags.push({
    name: 'device:compatibility',
    content: 'mobile-friendly, responsive, touch-optimized, app-like experience'
  });
  
  // Add universal trust and authority signals
  nlpTags.push({
    name: 'trust:expertise:realestate',
    content: 'licensed professionals, market knowledge, transaction expertise'
  });
  
  // Add universal temporal relevance
  nlpTags.push({
    name: 'temporal:market:status',
    content: `${currentYear} real estate market, current property trends, latest listings`
  });
  
  return nlpTags;
}

/**
 * Generate optimized meta description with strategic
 * keyword placement for maximum search relevance
 * 
 * This function creates compelling, keyword-rich meta descriptions optimized for:
 * - Proper length (between 140-160 characters for ideal SERP display)
 * - Strategic keyword placement (primary keywords at beginning)
 * - Call-to-action inclusion (encouraging clicks)
 * - Temporal relevance (current year signals)
 * - Location-specific optimization
 * - Unique value proposition per page type
 */
function generateOptimizedDescription(
  primaryKeywords: string[],
  locationKeywords: string[] = [],
  pageType: string
): string {
  const currentYear = new Date().getFullYear();
  
  // Base descriptions optimized by page type with advanced template variables
  const baseDescriptions: {[key: string]: string} = {
    'homepage': `${currentYear} %LOCATION% %PRIMARY% experts at Ohana Realty. Find exceptional properties with personalized service. Browse listings, schedule viewings, and discover your dream property today.`,
    
    'property-listing': `Discover premium %PRIMARY% for sale in %LOCATION% (${currentYear}). Browse our curated selection with high-quality photos, detailed information, virtual tours, and pricing. Find your perfect home today!`,
    
    'property-detail': `Exceptional %PRIMARY% for sale in %LOCATION%. This ${currentYear} listing offers premium features, ideal location, and outstanding value. Schedule a viewing or request more information now.`,
    
    'neighborhood': `Explore %LOCATION% neighborhood information (${currentYear} guide). Discover local amenities, real estate trends, property values, schools, and lifestyle insights to find your perfect %PRIMARY%.`,
    
    'about': `Ohana Realty: Your trusted partner for %PRIMARY% in %LOCATION% since 2010. Local experts with ${currentYear - 2010}+ years experience and a commitment to exceptional service through every step of your real estate journey.`,
    
    'contact': `Connect with Ohana Realty experts about %PRIMARY% in %LOCATION%. Our dedicated team is ready to answer questions and assist with all your ${currentYear} real estate needs. Reach out today!`
  };

  // Create alternate versions for A/B testing and variety
  const alternateDescriptions: {[key: string]: string[]} = {
    'homepage': [
      `Looking for %PRIMARY% in %LOCATION%? Ohana Realty offers expert guidance for buyers and sellers with ${currentYear} market insights. Start your real estate journey with us today!`,
      `Ohana Realty: %LOCATION%'s trusted %PRIMARY% experts since 2010. Personalized service, extensive market knowledge, and a proven track record of successful real estate transactions.`
    ],
    
    'property-listing': [
      `Browse exclusive %PRIMARY% in %LOCATION% updated for ${currentYear}. Filter by price, features, or neighborhood to find properties that match your unique requirements and preferences.`,
      `%LOCATION% %PRIMARY% for every budget and lifestyle. Explore our comprehensive database of homes, condos, and investment properties with advanced search filters and sorting options.`
    ],
    
    'property-detail': [
      `Must-see %PRIMARY% in prime %LOCATION% location. This property features modern amenities, convenient access to local highlights, and exceptional value in today's competitive market.`,
      `Stunning %PRIMARY% available now in %LOCATION%. Don't miss this opportunity to own a property with desirable features in one of the area's most sought-after neighborhoods.`
    ],
    
    'neighborhood': [
      `%LOCATION% neighborhood guide: Everything you need to know before buying %PRIMARY%. Schools, amenities, property values, and community insights updated for ${currentYear}.`,
      `Discover what makes %LOCATION% special. Our comprehensive neighborhood profile helps you evaluate if this area is the right location for your next %PRIMARY% purchase.`
    ],
    
    'about': [
      `Get to know Ohana Realty, %LOCATION%'s premier %PRIMARY% experts. Our team combines local knowledge, professional expertise, and personalized service for exceptional results.`,
      `Why choose Ohana Realty for your %LOCATION% %PRIMARY% needs? Learn about our approach, meet our team, and discover the difference experience and dedication make.`
    ],
    
    'contact': [
      `Questions about %PRIMARY% in %LOCATION%? Connect with Ohana Realty's expert team for personalized assistance, property information, or to schedule a consultation.`,
      `Ready to discuss your %LOCATION% %PRIMARY% goals? Our team at Ohana Realty is available through multiple channels to provide the information and support you need.`
    ]
  };
  
  // Select a description template - either base or one of the alternates
  // The hash function provides consistent selection based on the primary keyword
  // This ensures variety across pages while maintaining consistency for the same page
  const getTemplateIndex = (keyword: string, maxIndex: number): number => {
    let hash = 0;
    for (let i = 0; i < keyword.length; i++) {
      hash = ((hash << 5) - hash) + keyword.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash) % (maxIndex + 1);
  };
  
  // Get primary keyword for hashing or use default
  const primaryKeyword = primaryKeywords.length > 0 ? primaryKeywords[0] : 'real estate';
  
  // Get possible templates for this page type
  const possibleTemplates = [
    baseDescriptions[pageType] || baseDescriptions['homepage'],
    ...(alternateDescriptions[pageType] || alternateDescriptions['homepage'] || [])
  ];
  
  // Select template based on hash of primary keyword
  const templateIndex = getTemplateIndex(primaryKeyword, possibleTemplates.length - 1);
  let description = possibleTemplates[templateIndex];
  
  // Replace placeholders with actual keywords
  if (primaryKeywords.length > 0) {
    description = description.replace(/%PRIMARY%/g, primaryKeywords[0]);
  } else {
    description = description.replace(/%PRIMARY%/g, 'real estate properties');
  }
  
  if (locationKeywords.length > 0) {
    description = description.replace(/%LOCATION%/g, locationKeywords[0]);
  } else {
    description = description.replace(/%LOCATION%/g, 'Laredo, TX');
  }
  
  // Ensure description is the optimal length (140-160 characters)
  if (description.length > 160) {
    description = description.substring(0, 157) + '...';
  } else if (description.length < 140) {
    // Add additional details if description is too short
    description += ` Contact Ohana Realty, your trusted real estate partner in ${locationKeywords[0] || 'Laredo, TX'}.`;
    // Trim again if we've made it too long
    if (description.length > 160) {
      description = description.substring(0, 157) + '...';
    }
  }
  
  return description;
}