/**
 * SEO Keywords Module
 * Contains optimized keyword sets to dominate Laredo real estate search results
 */

// Primary high-value real estate keywords for Laredo
export const PRIMARY_KEYWORDS = [
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
  'Laredo investment properties',
  'luxury homes Laredo',
  'Laredo apartments for rent',
  'Laredo real estate agent',
  'Laredo realtor',
  'best real estate in Laredo'
];

// Long-tail keywords for targeted traffic
export const LONG_TAIL_KEYWORDS = [
  'affordable homes for sale in Laredo TX',
  'houses for sale in Laredo under 200k',
  'luxury houses for sale in Laredo TX',
  'Laredo homes for sale with pool',
  'Laredo homes for sale with large yard',
  'new construction homes in Laredo',
  'downtown Laredo condos for sale',
  'Laredo houses for rent pet friendly',
  'commercial real estate in Laredo TX',
  'Laredo gated community homes',
  'foreclosure homes in Laredo TX',
  'Laredo waterfront properties',
  'best neighborhoods in Laredo to buy house',
  'Laredo TX homes for sale by owner',
  'Laredo houses with guesthouse',
  'homes for sale in Laredo with acreage',
  'Laredo real estate market trends',
  'Laredo TX school district best homes',
  'investment properties in Laredo TX',
  'Laredo first time home buyer programs'
];

// Location-specific keywords for neighborhood targeting
export const NEIGHBORHOOD_KEYWORDS = [
  'Downtown Laredo real estate',
  'North Laredo homes for sale',
  'South Laredo houses',
  'East Laredo properties',
  'West Laredo homes for rent',
  'Del Mar homes Laredo',
  'Plantation homes Laredo',
  'Heights area Laredo real estate',
  'San Isidro homes for sale',
  'Alexander area houses Laredo',
  'Los Presidentes Laredo homes',
  'Lakeside Laredo real estate',
  'La Bota Ranch homes for sale',
  'Lomas Del Sur properties',
  'Cielito Lindo Laredo homes'
];

// Competitor comparison keywords (targets people comparing services)
export const COMPETITOR_KEYWORDS = [
  'better than Coldwell Banker Laredo',
  'Laredo real estate alternatives to RE/MAX',
  'why choose Ohana Realty over Coldwell Banker',
  'Ohana Realty vs RE/MAX Laredo',
  'best real estate agency in Laredo TX',
  'top rated Laredo realtors',
  'Laredo TX real estate agency reviews',
  'Laredo real estate commission rates',
  'best real estate deals in Laredo',
  'highest rated real estate agent Laredo'
];

// Keywords focusing on Laredo real estate market conditions
export const MARKET_KEYWORDS = [
  'Laredo TX real estate market 2023',
  'Laredo housing market trends',
  'is it a good time to buy in Laredo',
  'Laredo property values',
  'Laredo home appreciation rates',
  'Laredo housing market forecast',
  'Laredo TX real estate investment return',
  'Laredo mortgage rates',
  'Laredo TX property taxes',
  'Laredo real estate market analysis'
];

// Feature-specific keywords
export const FEATURE_KEYWORDS = [
  'Laredo homes with swimming pool',
  'Laredo houses with large backyard', 
  'Laredo real estate with garage apartment',
  'Laredo homes with outdoor kitchen',
  'Laredo houses with home office',
  'Laredo properties with smart home features',
  'Laredo real estate with energy efficient features',
  'Laredo homes with master on main',
  'Laredo properties with RV parking',
  'Laredo houses with basement'
];

// Mobile-optimized keywords (specifically for mobile searches)
export const MOBILE_KEYWORDS = [
  'find Laredo homes',
  'Laredo houses near me',
  'Laredo property fast search',
  'quick home search Laredo',
  'Laredo homes app',
  'find houses Laredo TX',
  'Laredo real estate search',
  'Laredo open houses today',
  'Laredo homes for sale map',
  'nearby Laredo properties'
];

// Meta-description templates for different page types
export const META_DESCRIPTIONS = {
  home: 'Find the best selection of Laredo TX homes for sale and houses for rent with Ohana Realty. We outperform Coldwell Banker and RE/MAX with our exclusive listings and personalized service.',
  listings: 'Browse all Laredo TX real estate listings with detailed information, high-quality photos and videos. Find your perfect property with Ohana Realty, Laredo\'s premier real estate agency.',
  property: (address: string, price: number, beds: number, baths: number) => 
    `View this beautiful ${beds} bedroom, ${baths} bathroom home at ${address} for $${price.toLocaleString()}. Contact Ohana Realty for a tour and beat other buyers to this exceptional Laredo property.`,
  rentals: 'Discover the best houses for rent in Laredo TX. Ohana Realty offers apartments, condos, and homes with flexible rental terms, beating competitors with our exclusive rental inventory.',
  neighborhoods: 'Explore Laredo\'s top neighborhoods for buying or renting properties. Get insider information about schools, amenities, and property values from Laredo\'s real estate experts.',
  about: 'Ohana Realty is Laredo\'s highest-rated real estate agency. Learn why we consistently outperform Coldwell Banker, RE/MAX and other agencies with our local expertise and client-first approach.'
};

// Title templates optimized for search engines
export const TITLE_TEMPLATES = {
  home: 'Laredo TX Homes for Sale & Rent | #1 Real Estate Agency | Ohana Realty',
  listings: 'Laredo TX Houses & Properties for Sale | Best Real Estate Listings | Ohana Realty',
  property: (address: string, price: number, beds: number, baths: number) => 
    `${beds}BR/${baths}BA ${address} | $${price.toLocaleString()} | Top Laredo TX Real Estate`,
  rentals: 'Laredo TX Houses & Apartments for Rent | Top Rental Properties | Ohana Realty',
  neighborhoods: 'Best Laredo TX Neighborhoods | Local Real Estate Guide | Ohana Realty',
  about: 'About Ohana Realty | #1 Laredo TX Real Estate Agency | Better than Coldwell Banker'
};
