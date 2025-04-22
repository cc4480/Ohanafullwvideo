import { Helmet } from 'react-helmet';

interface SocialShareMetadataProps {
  /**
   * Page title to display in share previews
   */
  title: string;
  
  /**
   * Page description to display in share previews
   */
  description: string;
  
  /**
   * URL of the page for share links
   */
  url: string;
  
  /**
   * URL of the primary image to display in share previews
   */
  image: string;
  
  /**
   * Alternative text for the image
   */
  imageAlt?: string;
  
  /**
   * The type of content being shared (article, website, etc.)
   */
  type?: 'website' | 'article' | 'product' | 'profile';
  
  /**
   * Twitter username (without @) for site attribution
   */
  twitterSite?: string;
  
  /**
   * Twitter username (without @) for content creator attribution
   */
  twitterCreator?: string;
  
  /**
   * The card type for Twitter
   */
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  
  /**
   * Twitter card configuration object
   */
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    site?: string;
    creator?: string;
  };
  
  /**
   * The name of the app or site
   */
  siteName?: string;
  
  /**
   * Video URL to include in the share (for video content)
   */
  videoUrl?: string;
  
  /**
   * Facebook app ID for analytics
   */
  facebookAppId?: string;
  
  /**
   * Locale for the content (e.g., en_US)
   */
  locale?: string;
  
  /**
   * Array of alternate language versions of the page
   * Format: [{ locale: 'es_ES', url: 'https://example.com/es/page' }]
   */
  alternateLocales?: Array<{
    locale: string;
    url: string;
  }>;
  
  /**
   * Author name for article content
   */
  author?: string;
  
  /**
   * Published date/time for article content (ISO format)
   */
  publishedTime?: string;
  
  /**
   * Modified date/time for article content (ISO format)
   */
  modifiedTime?: string;
  
  /**
   * Section for article content (e.g., Technology, Real Estate)
   */
  section?: string;
  
  /**
   * Tags/keywords for article content
   */
  tags?: string[];
  
  /**
   * For product pages, the price
   */
  price?: string;
  
  /**
   * For product pages, the currency
   */
  currency?: string;
  
  /**
   * For product pages, the availability status
   */
  availability?: 'in stock' | 'out of stock' | 'pending';
}

/**
 * Comprehensive social media metadata component for maximizing
 * share appearance across platforms (Facebook, Twitter, LinkedIn, etc.)
 * 
 * Implements a superset of Open Graph protocol, Twitter Cards,
 * and other platform-specific metadata for rich sharing experiences.
 */
export default function SocialShareMetadata({
  title,
  description,
  url,
  image,
  imageAlt,
  type = 'website',
  twitterSite,
  twitterCreator,
  twitterCard = 'summary_large_image',
  siteName = 'Ohana Realty',
  videoUrl,
  facebookAppId,
  locale = 'en_US',
  alternateLocales = [],
  author,
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  price,
  currency,
  availability
}: SocialShareMetadataProps) {
  // Truncate description for optimal display
  const truncatedDescription = description.length > 160 
    ? description.substring(0, 157) + '...' 
    : description;
    
  // Ensure image is an absolute URL
  const absoluteImage = image.startsWith('http') 
    ? image 
    : `https://ohanarealty.com${image.startsWith('/') ? '' : '/'}${image}`;
  
  return (
    <Helmet>
      {/* Basic OpenGraph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={truncatedDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={absoluteImage} />
      {imageAlt && <meta property="og:image:alt" content={imageAlt} />}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      
      {/* Alternate locales */}
      {alternateLocales.map(alt => (
        <meta 
          key={alt.locale} 
          property="og:locale:alternate" 
          content={alt.locale} 
        />
      ))}
      
      {/* Facebook app ID if available */}
      {facebookAppId && <meta property="fb:app_id" content={facebookAppId} />}
      
      {/* Video metadata if available */}
      {videoUrl && (
        <>
          <meta property="og:video" content={videoUrl} />
          <meta property="og:video:secure_url" content={videoUrl} />
          <meta property="og:video:type" content="video/mp4" />
          <meta property="og:video:width" content="1280" />
          <meta property="og:video:height" content="720" />
        </>
      )}
      
      {/* Article-specific metadata */}
      {type === 'article' && (
        <>
          {author && <meta property="article:author" content={author} />}
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Product-specific metadata */}
      {type === 'product' && (
        <>
          {price && currency && (
            <meta property="product:price:amount" content={price} />
          )}
          {currency && (
            <meta property="product:price:currency" content={currency} />
          )}
          {availability && (
            <meta property="product:availability" content={availability} />
          )}
        </>
      )}
      
      {/* Twitter Card metadata */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={truncatedDescription} />
      <meta name="twitter:image" content={absoluteImage} />
      {imageAlt && <meta name="twitter:image:alt" content={imageAlt} />}
      {twitterSite && <meta name="twitter:site" content={`@${twitterSite}`} />}
      {twitterCreator && <meta name="twitter:creator" content={`@${twitterCreator}`} />}
      
      {/* Additional social platforms */}
      <meta name="linkedin:title" content={title} />
      <meta name="linkedin:description" content={truncatedDescription} />
      <meta name="linkedin:image" content={absoluteImage} />
      
      {/* Pinterest optimization */}
      <meta name="pinterest" content="nohover" />
      {imageAlt && <meta name="pinterest:description" content={imageAlt} />}
      
      {/* WhatsApp preview */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:rich_attachment" content="true" />
    </Helmet>
  );
}