import { Helmet } from 'react-helmet';

interface SocialShareMetadataProps {
  title: string;
  description: string;
  url: string;
  image: string;
  imageAlt?: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  twitterSite?: string;
  twitterCreator?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    site?: string;
    creator?: string;
  };
  siteName?: string;
  videoUrl?: string;
  facebookAppId?: string;
  locale?: string;
  alternateLocales?: Array<{
    locale: string;
    url: string;
  }>;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  price?: string;
  currency?: string;
  availability?: 'in stock' | 'out of stock' | 'pending';
}

export default function SocialShareMetadata(props: SocialShareMetadataProps) {
  try {
    // Set default values and ensure strings
    const {
      title = '',
      url = '',
      type = 'website',
      twitterCard = 'summary_large_image',
      siteName = 'Ohana Realty',
      locale = 'en_US',
      alternateLocales = [],
      tags = [],
    } = props;
    
    // Handle potentially problematic values with proper type checking
    const description = typeof props.description === 'string' ? props.description : '';
    const truncatedDescription = description.length > 160 
      ? description.substring(0, 157) + '...' 
      : description;
    
    const safeImage = typeof props.image === 'string' ? props.image : '';
    const imageIsURL = safeImage && typeof safeImage.startsWith === 'function' && safeImage.startsWith('http');
    
    const absoluteImage = imageIsURL 
      ? safeImage
      : `https://ohanarealty.com${safeImage && typeof safeImage.startsWith === 'function' && safeImage.startsWith('/') ? '' : '/'}${safeImage}`;
    
    return (
      <Helmet>
        {/* Basic OpenGraph tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={truncatedDescription} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={absoluteImage} />
        {props.imageAlt && <meta property="og:image:alt" content={props.imageAlt} />}
        <meta property="og:type" content={type} />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:locale" content={locale} />
        
        {/* Alternate locales */}
        {Array.isArray(alternateLocales) && alternateLocales.map(alt => {
          if (alt && typeof alt.locale === 'string') {
            return (
              <meta 
                key={alt.locale} 
                property="og:locale:alternate" 
                content={alt.locale} 
              />
            );
          }
          return null;
        })}
        
        {/* Facebook app ID if available */}
        {props.facebookAppId && <meta property="fb:app_id" content={props.facebookAppId} />}
        
        {/* Video metadata if available */}
        {props.videoUrl && (
          <>
            <meta property="og:video" content={props.videoUrl} />
            <meta property="og:video:secure_url" content={props.videoUrl} />
            <meta property="og:video:type" content="video/mp4" />
            <meta property="og:video:width" content="1280" />
            <meta property="og:video:height" content="720" />
          </>
        )}
        
        {/* Article-specific metadata */}
        {type === 'article' && (
          <>
            {props.author && <meta property="article:author" content={props.author} />}
            {props.publishedTime && <meta property="article:published_time" content={props.publishedTime} />}
            {props.modifiedTime && <meta property="article:modified_time" content={props.modifiedTime} />}
            {props.section && <meta property="article:section" content={props.section} />}
            {Array.isArray(tags) && tags.map(tag => {
              if (typeof tag === 'string') {
                return <meta key={tag} property="article:tag" content={tag} />;
              }
              return null;
            })}
          </>
        )}
        
        {/* Product-specific metadata */}
        {type === 'product' && (
          <>
            {props.price && props.currency && (
              <meta property="product:price:amount" content={props.price} />
            )}
            {props.currency && (
              <meta property="product:price:currency" content={props.currency} />
            )}
            {props.availability && (
              <meta property="product:availability" content={props.availability} />
            )}
          </>
        )}
        
        {/* Twitter Card metadata */}
        <meta name="twitter:card" content={props.twitter?.card || twitterCard} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={truncatedDescription} />
        <meta name="twitter:image" content={absoluteImage} />
        {props.imageAlt && <meta name="twitter:image:alt" content={props.imageAlt} />}
        {(props.twitter?.site || props.twitterSite) && 
          <meta name="twitter:site" content={`@${props.twitter?.site || props.twitterSite}`} />}
        {(props.twitter?.creator || props.twitterCreator) && 
          <meta name="twitter:creator" content={`@${props.twitter?.creator || props.twitterCreator}`} />}
        
        {/* LinkedIn metadata */}
        <meta name="linkedin:title" content={title} />
        <meta name="linkedin:description" content={truncatedDescription} />
        <meta name="linkedin:image" content={absoluteImage} />
        
        {/* Pinterest optimization */}
        <meta name="pinterest" content="nohover" />
        {props.imageAlt && <meta name="pinterest:description" content={props.imageAlt} />}
        
        {/* WhatsApp preview */}
        <meta property="og:site_name" content={siteName} />
        <meta property="og:rich_attachment" content="true" />
      </Helmet>
    );
  } catch (error) {
    console.error('Error in SocialShareMetadata component:', error);
    return null;
  }
}