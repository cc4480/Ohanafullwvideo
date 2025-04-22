import React, { useState, useEffect, useRef } from 'react';

interface SEOImageProps {
  /**
   * Primary image source URL
   */
  src: string;
  
  /**
   * Alternative text for the image (required for accessibility and SEO)
   */
  alt: string;
  
  /**
   * Optional CSS class name
   */
  className?: string;
  
  /**
   * Indicates if the image is the main content image
   * When true, adds appropriate itemprop attributes for structured data
   */
  isMainImage?: boolean;
  
  /**
   * Indicates if this is a decorative image (not meaningful to the content)
   * When true, decorative images will be empty alt="" but still have ARIA label
   */
  isDecorative?: boolean;
  
  /**
   * Width of the image in pixels
   */
  width?: number;
  
  /**
   * Height of the image in pixels
   */
  height?: number;
  
  /**
   * Loading strategy: "lazy" (default) or "eager"
   * Use "eager" for above-the-fold images critical to the page
   */
  loading?: 'lazy' | 'eager';
  
  /**
   * Decoding strategy: "async" (default), "sync", or "auto"
   */
  decoding?: 'async' | 'sync' | 'auto';
  
  /**
   * Sources for responsive images in different sizes
   * Format: Array of { media: string, srcSet: string }
   */
  sources?: Array<{
    media: string;
    srcSet: string;
  }>;
  
  /**
   * Fetch priority hint for the browser
   * Use "high" for LCP (Largest Contentful Paint) images
   */
  fetchPriority?: 'high' | 'low' | 'auto';
  
  /**
   * LQIP (Low Quality Image Placeholder) for faster perceived loading
   */
  placeholderSrc?: string;
  
  /**
   * Optional copyright or attribution text
   */
  attribution?: string;
  
  /**
   * Optional structured data JSON-LD for the image
   * (Will be transformed to a JSON string)
   */
  structuredData?: Record<string, any>;
  
  /**
   * Function called when image successfully loads
   */
  onLoad?: () => void;
  
  /**
   * Function called when image fails to load
   */
  onError?: () => void;
}

/**
 * SEO-optimized image component that handles:
 * - Proper lazy loading
 * - Alt text for accessibility and SEO
 * - Responsive image techniques
 * - Core Web Vitals optimization (CLS, LCP)
 * - Structured data support
 * - Low-quality image placeholders for perceived performance
 */
export default function SEOImage({
  src,
  alt,
  className = '',
  isMainImage = false,
  isDecorative = false,
  width,
  height,
  loading = 'lazy',
  decoding = 'async',
  sources = [],
  fetchPriority = 'auto',
  placeholderSrc,
  attribution,
  structuredData,
  onLoad,
  onError
}: SEOImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Determine the effective alt text based on props
  const effectiveAlt = isDecorative ? '' : alt;
  
  // Handle image load success
  const handleLoad = () => {
    setLoaded(true);
    if (onLoad) onLoad();
  };
  
  // Handle image load error
  const handleError = () => {
    setError(true);
    if (onError) onError();
  };
  
  // Add image to performance metrics
  useEffect(() => {
    if (imageRef.current && fetchPriority === 'high') {
      // Try to report the image as an LCP candidate for browsers that support it
      if ('LargestContentfulPaint' in window) {
        try {
          // @ts-ignore - This API might not be typed yet
          new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach((entry) => {
              // @ts-ignore - element property exists on LargestContentfulPaint entries
              if (entry.element === imageRef.current) {
                console.log('Image is the LCP element', entry.startTime);
              }
            });
          }).observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (e) {
          // Silently fail if the browser doesn't support this
        }
      }
    }
  }, [fetchPriority]);
  
  // Base image props for both picture and img elements
  const imageProps = {
    src,
    alt: effectiveAlt,
    className: `${className} ${loaded ? 'loaded' : 'loading'} ${error ? 'error' : ''}`,
    loading,
    decoding,
    width,
    height,
    fetchPriority,
    onLoad: handleLoad,
    onError: handleError,
    ref: imageRef,
    // Add schema.org markup if this is a main content image
    ...(isMainImage ? { itemprop: 'image' } : {}),
    // Keep an accessible name even for decorative images
    'aria-label': isDecorative ? alt : undefined,
    style: { 
      // Prevent content layout shift by setting dimensions
      aspectRatio: width && height ? `${width}/${height}` : undefined,
      // Use placeholder if provided and not yet loaded
      backgroundImage: placeholderSrc && !loaded ? `url(${placeholderSrc})` : undefined,
      backgroundSize: placeholderSrc ? 'cover' : undefined
    }
  };
  
  return (
    <>
      {sources.length > 0 ? (
        <picture>
          {sources.map((source, index) => (
            <source key={index} media={source.media} srcSet={source.srcSet} />
          ))}
          <img {...imageProps} />
        </picture>
      ) : (
        <img {...imageProps} />
      )}
      
      {/* Include image attribution if provided */}
      {attribution && <small className="image-attribution">{attribution}</small>}
      
      {/* Include structured data if provided */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </>
  );
}