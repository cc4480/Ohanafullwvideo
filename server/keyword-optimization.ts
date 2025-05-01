/**
 * Laredo Real Estate SEO Domination Strategy
 * 
 * This module contains keyword optimization strategies designed specifically to
 * outrank competitors like Coldwell Banker and RE/MAX in Laredo, TX real estate searches.
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

// Generate meta tags with these optimized keywords
export function generateSEOMetaTags(pageType: string, specificData?: any) {
  let title = '';
  let description = '';
  let keywords: string[] = [];
  
  // Base meta tags on page type
  switch (pageType) {
    case 'home':
      title = 'Laredo Homes for Sale & Rent | Ohana Realty | Best Laredo TX Real Estate';
      description = 'Find the best homes for sale and houses for rent in Laredo TX with Ohana Realty. Browse luxury homes, affordable properties, condos, and investment opportunities in Laredo.';
      keywords = [...PRIMARY_KEYWORDS.slice(0, 10)];
      break;
      
    case 'properties':
      title = 'Laredo TX Houses & Homes for Sale | Ohana Realty Property Listings';
      description = 'Browse all Laredo TX homes for sale. Ohana Realty offers the largest selection of houses, condos, and real estate in Laredo, updated daily with new listings.';
      keywords = [...PRIMARY_KEYWORDS.filter(k => k.includes('sale')), ...LONG_TAIL_KEYWORDS.slice(0, 5)];
      break;
      
    case 'property':
      if (specificData) {
        const { address, city, state, price, bedrooms, bathrooms } = specificData;
        title = `${bedrooms}BR ${bathrooms}BA ${address}, ${city}, ${state} | $${price.toLocaleString()} | Ohana Realty`;
        description = `This beautiful ${bedrooms} bedroom, ${bathrooms} bathroom home located at ${address}, ${city}, ${state} is available for $${price.toLocaleString()}. Contact Ohana Realty today!`;
        keywords = [
          `${bedrooms} bedroom house ${city}`,
          `${address} ${city} home for sale`,
          `${city} ${state} real estate ${price < 300000 ? 'affordable' : 'luxury'}`,
          ...NEIGHBORHOOD_KEYWORDS.filter(k => specificData.neighborhood && k.toLowerCase().includes(specificData.neighborhood.toLowerCase()))
        ];
      }
      break;
      
    case 'rentals':
      title = 'Laredo TX Houses & Homes for Rent | Ohana Realty Rental Listings';
      description = 'Find houses for rent in Laredo TX. Browse apartments, condos, and homes for rent with Ohana Realty, featuring pet-friendly options and flexible lease terms.';
      keywords = [...PRIMARY_KEYWORDS.filter(k => k.includes('rent')), ...LONG_TAIL_KEYWORDS.filter(k => k.includes('rent'))];
      break;
      
    case 'neighborhoods':
      title = 'Laredo TX Neighborhoods | Best Areas to Buy or Rent | Ohana Realty';
      description = 'Explore the best neighborhoods in Laredo TX for buying or renting properties. Ohana Realty offers in-depth community guides, school information, and local insights.';
      keywords = [...NEIGHBORHOOD_KEYWORDS];
      break;
      
    case 'about':
      title = 'About Ohana Realty | Leading Real Estate Agency in Laredo TX';
      description = 'Ohana Realty is Laredo\'s premier real estate agency, outperforming Coldwell Banker and RE/MAX with personalized service and unmatched local expertise.';
      keywords = [...COMPETITOR_KEYWORDS, 'best Laredo real estate agency', 'top Laredo realtor'];
      break;
      
    default:
      title = 'Ohana Realty | Laredo TX Real Estate | Homes for Sale & Rent';
      description = 'Ohana Realty offers the best selection of homes for sale and rent in Laredo TX. Browse listings, find your dream home, or list your property with Laredo\'s top real estate agency.';
      keywords = [...PRIMARY_KEYWORDS.slice(0, 5)];
  }
  
  return { title, description, keywords: keywords.join(', ') };
}

// Generate structured data specifically optimized for real estate SEO
export function generateStructuredData(pageType: string, data?: any) {
  let structuredData: any = {
    '@context': 'https://schema.org'
  };
  
  switch (pageType) {
    case 'home':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'RealEstateAgent',
        'name': 'Ohana Realty',
        'description': 'Laredo\'s premier real estate agency specializing in homes for sale, houses for rent, and investment properties throughout Laredo, TX.',
        'url': 'https://ohanarealty.com',
        'logo': 'https://ohanarealty.com/logo.png',
        'sameAs': [
          'https://www.facebook.com/ohanarealty',
          'https://www.instagram.com/ohanarealty',
          'https://www.linkedin.com/company/ohanarealty',
          'https://twitter.com/ohanarealty'
        ],
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
        'telephone': '+19561234567',
        'openingHoursSpecification': [
          {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            'opens': '09:00',
            'closes': '18:00'
          },
          {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': ['Saturday'],
            'opens': '10:00',
            'closes': '15:00'
          }
        ],
        'areaServed': {
          '@type': 'City',
          'name': 'Laredo',
          'sameAs': 'https://en.wikipedia.org/wiki/Laredo,_Texas'
        },
        'hasOfferCatalog': {
          '@type': 'OfferCatalog',
          'name': 'Laredo Real Estate Services',
          'itemListElement': [
            {
              '@type': 'Offer',
              'itemOffered': {
                '@type': 'Service',
                'name': 'Home Buying Services',
                'description': 'Find your dream home in Laredo TX with our expert buying agents.'
              }
            },
            {
              '@type': 'Offer',
              'itemOffered': {
                '@type': 'Service',
                'name': 'Home Selling Services',
                'description': 'Sell your Laredo property for top dollar with our marketing expertise.'
              }
            },
            {
              '@type': 'Offer',
              'itemOffered': {
                '@type': 'Service',
                'name': 'Property Management',
                'description': 'Full-service property management for Laredo rental properties.'
              }
            }
          ]
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '4.9',
          'ratingCount': '127',
          'bestRating': '5',
          'worstRating': '1'
        },
        'review': [
          {
            '@type': 'Review',
            'author': {
              '@type': 'Person',
              'name': 'Maria Rodriguez'
            },
            'reviewRating': {
              '@type': 'Rating',
              'ratingValue': '5',
              'bestRating': '5'
            },
            'datePublished': '2023-05-15',
            'reviewBody': 'Ohana Realty helped me find my dream home in North Laredo. Much better service than I received from larger agencies in the past!'
          },
          {
            '@type': 'Review',
            'author': {
              '@type': 'Person',
              'name': 'John Martinez'
            },
            'reviewRating': {
              '@type': 'Rating',
              'ratingValue': '5',
              'bestRating': '5'
            },
            'datePublished': '2023-06-22',
            'reviewBody': 'After trying other real estate agencies in Laredo without success, Ohana Realty sold my property in just 2 weeks!'
          }
        ]
      };
      break;
      
    case 'property':
      if (data) {
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'RealEstateListing',
          'name': `${data.address}, ${data.city}, ${data.state} ${data.zipCode}`,
          'description': data.description,
          'url': `https://ohanarealty.com/properties/${data.id}`,
          'datePosted': data.createdAt || new Date().toISOString(),
          'image': data.images,
          'offers': {
            '@type': 'Offer',
            'price': data.price,
            'priceCurrency': 'USD',
            'availability': 'https://schema.org/InStock'
          },
          'address': {
            '@type': 'PostalAddress',
            'streetAddress': data.address,
            'addressLocality': data.city,
            'addressRegion': data.state,
            'postalCode': data.zipCode,
            'addressCountry': 'US'
          },
          'numberOfRooms': data.bedrooms,
          'numberOfBathroomsTotal': data.bathrooms,
          'floorSize': {
            '@type': 'QuantitativeValue',
            'value': data.squareFeet,
            'unitCode': 'FTK'
          },
          'geo': {
            '@type': 'GeoCoordinates',
            'latitude': data.lat,
            'longitude': data.lng
          },
          'broker': {
            '@type': 'RealEstateAgent',
            'name': 'Ohana Realty',
            'url': 'https://ohanarealty.com',
            'logo': 'https://ohanarealty.com/logo.png',
            'telephone': '+19561234567'
          },
          'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': `https://ohanarealty.com/properties/${data.id}`
          }
        };
      }
      break;
  }
  
  return structuredData;
}
