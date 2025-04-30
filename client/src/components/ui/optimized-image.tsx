import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

/**
 * Utility function to normalize image paths
 * Handles paths that might be prefixed with /attached_assets/ or other patterns
 */
function normalizeImagePath(src: string): string {
  // CRITICAL BUGFIX: Leave all paths as they are - don't manipulate any paths
  // The server handles paths with leading slashes correctly
  return src;
}

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * Source URL of the image
   */
  src: string;
  
  /**
   * Alternative text for the image
   */
  alt: string;
  
  /**
   * Optional blur hash or placeholder URL for progressive loading
   */
  placeholder?: string;
  
  /**
   * Whether this is a critical image that should load with priority
   */
  priority?: boolean;
  
  /**
   * Optional background color while image loads
   */
  backgroundColor?: string;
  
  /**
   * Optional fade-in duration for smoother loading experience
   */
  fadeInDuration?: number;
  
  /**
   * Optional aspect ratio to prevent layout shift
   * Format: "16/9", "4/3", "1/1", etc.
   */
  aspectRatio?: string;
  
  /**
   * Allow for passing Tailwind or other CSS classes
   */
  className?: string;
  
  /**
   * Controlled loading state (useful for testing or storybook)
   */
  forceLoading?: boolean;
}

/**
 * OptimizedImage component for improved image loading performance
 * Implements:
 * - Progressive loading with placeholders
 * - Lazy loading with IntersectionObserver
 * - Smooth fade-in transitions
 * - Aspect ratio preservation to prevent layout shifts
 */
export function OptimizedImage({
  src,
  alt,
  placeholder,
  priority = false,
  backgroundColor = '#f3f4f6', // Default light gray background
  fadeInDuration = 500,
  aspectRatio,
  className,
  forceLoading,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [error, setError] = useState(false);
  
  // Setup intersection observer to detect when image enters viewport
  useEffect(() => {
    // Skip for priority images, they load immediately
    if (priority) return;
    
    const normalizedSrc = normalizeImagePath(src);
    const element = document.getElementById(`optimized-img-${normalizedSrc.replace(/[^a-zA-Z0-9]/g, '-')}`);
    
    if (!element) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start loading when image is 200px from viewport
    );
    
    observer.observe(element);
    
    return () => {
      observer.disconnect();
    };
  }, [src, priority]);
  
  // Compute style for image container
  const containerStyle: React.CSSProperties = {
    backgroundColor,
    position: 'relative',
    overflow: 'hidden',
    ...(aspectRatio && { aspectRatio }),
  };
  
  // Compute style for image
  const imageStyle: React.CSSProperties = {
    opacity: isLoaded ? 1 : 0,
    transition: `opacity ${fadeInDuration}ms ease-in-out`,
    objectFit: 'cover',
    width: '100%',
    height: '100%',
  };
  
  // Placeholder image style
  const placeholderStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'blur(10px)',
    opacity: isLoaded ? 0 : 1,
    transition: `opacity ${fadeInDuration}ms ease-in-out`,
  };
  
  // Handler for image load success
  const handleImageLoad = () => {
    setIsLoaded(true);
  };
  
  // Handler for image load error
  const handleImageError = () => {
    setError(true);
    const normalizedSrc = normalizeImagePath(src);
    console.error(`Failed to load image: ${src}`);
    // Log more details to help with debugging
    console.log(`Image details:
      - Original src: ${src}
      - Full path: ${window.location.origin}${src.startsWith('/') ? src : `/${src}`}
    `);
  };
  
  // Generate unique ID for this image based on source URL
  const id = `optimized-img-${normalizeImagePath(src).replace(/[^a-zA-Z0-9]/g, '-')}`;
  
  return (
    <div 
      id={id}
      className={cn("optimized-image-container", className)} 
      style={containerStyle}
      data-loaded={isLoaded}
      role="img"
      aria-label={alt}
    >
      {/* Show placeholder while loading */}
      {placeholder && !isLoaded && !error && (
        <img 
          src={normalizeImagePath(placeholder)} 
          alt={`${alt} placeholder`}
          style={placeholderStyle}
          aria-hidden="true"
        />
      )}
      
      {/* Main image, only load src when in viewport */}
      {(isInView || priority) && (
        <picture>
          {/* WebP format support */}
          <source 
            srcSet={normalizeImagePath(src.replace(/\.(jpg|jpeg|png)$/i, '.webp'))} 
            type="image/webp" 
          />
          {/* Fallback to original format */}
          <img
            src={normalizeImagePath(src)}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={imageStyle}
            {...props}
          />
        </picture>
      )}
      
      {/* Error fallback */}
      {error && (
        <div className="error-fallback" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          color: '#6b7280',
          backgroundColor: '#f9fafb',
          padding: '1rem',
          textAlign: 'center',
        }}>
          <span>Image could not be loaded</span>
        </div>
      )}
    </div>
  );
}

export default OptimizedImage;