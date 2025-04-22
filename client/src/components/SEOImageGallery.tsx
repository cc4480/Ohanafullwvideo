import React from 'react';
import { Helmet } from 'react-helmet';
import SEOImage from './SEOImage';

interface SEOImageGalleryProps {
  /**
   * Array of image URLs
   */
  images: string[];
  
  /**
   * The URL of the page where the gallery is located
   */
  pageUrl: string;
  
  /**
   * The title of the gallery, typically the property address
   */
  title: string;
  
  /**
   * Additional description about the images
   */
  description?: string;
  
  /**
   * The owner or copyright holder of the images
   */
  author?: string;
  
  /**
   * Gallery container className
   */
  className?: string;
  
  /**
   * Individual image className
   */
  imageClassName?: string;
  
  /**
   * Handler for when an image is clicked
   */
  onImageClick?: (imageUrl: string, index: number) => void;
}

/**
 * SEO-optimized image gallery component with structured data
 * that enhances search engine indexing of property images
 */
export default function SEOImageGallery({
  images,
  pageUrl,
  title,
  description = '',
  author = 'Ohana Realty',
  className = '',
  imageClassName = '',
  onImageClick
}: SEOImageGalleryProps) {
  
  // Create ImageGallery structured data for rich results
  const imageGalleryStructuredData = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": `${title} - Image Gallery`,
    "description": description || `Images of ${title}`,
    "url": pageUrl,
    "author": {
      "@type": "Organization",
      "name": author
    },
    "thumbnailUrl": images.length > 0 ? images[0] : '',
    "image": images.map(img => ({
      "@type": "ImageObject",
      "contentUrl": img
    }))
  };
  
  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(imageGalleryStructuredData)}
        </script>
      </Helmet>
      
      <div className={`seo-image-gallery ${className}`}>
        {images.map((image, index) => (
          <SEOImage
            key={`gallery-img-${index}`}
            src={image}
            alt={`${title} - Image ${index + 1}`}
            className={imageClassName}
            width={800}
            height={600}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            isMainImage={index === 0}
            structuredData={{
              "@context": "https://schema.org",
              "@type": "ImageObject",
              "contentUrl": image,
              "name": `${title} - Image ${index + 1}`,
              "description": description || `Image ${index + 1} of ${title}`,
              "representativeOfPage": index === 0
            }}
            onClick={onImageClick ? () => onImageClick(image, index) : undefined}
          />
        ))}
      </div>
    </>
  );
}