import { useEffect } from 'react';
import { Helmet } from 'react-helmet';

interface PerformanceOptimizerProps {
  /**
   * Whether to enable image lazy loading optimizations
   * Default: true
   */
  enableLazyLoading?: boolean;
  
  /**
   * Whether to enable hardware-accelerated animations
   * Default: true
   */
  enableHardwareAcceleration?: boolean;
  
  /**
   * Whether to prefetch critical assets
   * Default: true
   */
  prefetchCriticalAssets?: boolean;
  
  /**
   * Whether to defer non-critical CSS
   * Default: true
   */
  deferNonCriticalCSS?: boolean;
  
  /**
   * Whether to optimize for Core Web Vitals
   * Default: true
   */
  optimizeCoreWebVitals?: boolean;
  
  /**
   * Additional DNS domains to preconnect to
   */
  preconnectDomains?: string[];
  
  /**
   * URLs of critical assets to prefetch
   */
  criticalAssets?: string[];
}

/**
 * Advanced performance optimization component that implements best practices for
 * rendering optimization, hardware acceleration, and resource loading priorities.
 */
export default function PerformanceOptimizer({
  enableLazyLoading = true,
  enableHardwareAcceleration = true,
  prefetchCriticalAssets = true,
  deferNonCriticalCSS = true,
  optimizeCoreWebVitals = true,
  preconnectDomains = [],
  criticalAssets = []
}: PerformanceOptimizerProps) {
  
  // Apply hardware acceleration on mount
  useEffect(() => {
    if (enableHardwareAcceleration) {
      // Add hardware acceleration class to body
      document.body.classList.add('hardware-accelerated');
      
      // Apply hardware acceleration to critical animation elements
      const criticalAnimationElements = document.querySelectorAll(
        '.hero-animation, .property-card-img, .feature-icon, .parallax-element'
      );
      
      criticalAnimationElements.forEach(element => {
        if (element instanceof HTMLElement) {
          element.style.transform = 'translateZ(0)';
          element.style.backfaceVisibility = 'hidden';
          element.style.willChange = 'transform, opacity';
        }
      });
    }
    
    // Clean up on unmount
    return () => {
      if (enableHardwareAcceleration) {
        document.body.classList.remove('hardware-accelerated');
      }
    };
  }, [enableHardwareAcceleration]);
  
  // Apply lazy loading to images and iframes
  useEffect(() => {
    if (enableLazyLoading) {
      const lazyLoadElements = document.querySelectorAll('img:not([loading]), iframe:not([loading])');
      
      lazyLoadElements.forEach(element => {
        if (element instanceof HTMLImageElement || element instanceof HTMLIFrameElement) {
          // Skip critical above-the-fold images
          const rect = element.getBoundingClientRect();
          const isAboveTheFold = rect.top < window.innerHeight;
          
          if (!isAboveTheFold) {
            element.setAttribute('loading', 'lazy');
          }
        }
      });
      
      // Set fetchpriority for hero and above-the-fold images
      const priorityImages = document.querySelectorAll('.hero-image, .featured-image');
      priorityImages.forEach(element => {
        if (element instanceof HTMLImageElement) {
          element.setAttribute('fetchpriority', 'high');
        }
      });
    }
  }, [enableLazyLoading]);
  
  // Core Web Vitals optimizations
  useEffect(() => {
    if (optimizeCoreWebVitals) {
      // Optimize Largest Contentful Paint (LCP)
      const lcpElements = document.querySelectorAll('.hero-image, h1 img, .featured-image');
      lcpElements.forEach(element => {
        if (element instanceof HTMLImageElement) {
          element.setAttribute('fetchpriority', 'high');
          element.setAttribute('importance', 'high');
        }
      });
      
      // Optimize Cumulative Layout Shift (CLS)
      const potentialCLSElements = document.querySelectorAll('img:not([width]):not([height])');
      potentialCLSElements.forEach(element => {
        if (element instanceof HTMLImageElement) {
          if (element.src && !element.hasAttribute('width') && !element.hasAttribute('height')) {
            element.style.aspectRatio = '16/9';
          }
        }
      });
      
      // Optimize First Input Delay (FID) / Interaction to Next Paint (INP)
      const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
      interactiveElements.forEach(element => {
        if (element instanceof HTMLElement) {
          element.style.touchAction = 'manipulation';
        }
      });
    }
  }, [optimizeCoreWebVitals]);
  
  // Media optimization
  useEffect(() => {
    // Find video elements and optimize them
    const videoElements = document.querySelectorAll('video');
    videoElements.forEach(video => {
      // Prevent autoplay with sound
      if (video.hasAttribute('autoplay')) {
        video.muted = true;
      }
      
      // Add playsinline for mobile devices
      video.setAttribute('playsinline', '');
      
      // Set appropriate preload value
      const isVisible = video.getBoundingClientRect().top < window.innerHeight * 1.5;
      video.preload = isVisible ? 'metadata' : 'none';
    });
  }, []);
  
  return (
    <Helmet>
      {/* Preconnect to important domains for faster loading */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {preconnectDomains.map(domain => (
        <link key={domain} rel="preconnect" href={domain} crossOrigin="anonymous" />
      ))}
      
      {/* Prefetch critical assets */}
      {prefetchCriticalAssets && criticalAssets && criticalAssets.length > 0 && criticalAssets.map(asset => (
        <link key={asset} rel="prefetch" href={asset} />
      ))}
      
      {/* Critical CSS optimization */}
      {deferNonCriticalCSS && (
        <style type="text/css">{`
          /* The most critical styles inlined */
          .hardware-accelerated * {
            transform: translateZ(0);
            backface-visibility: hidden;
          }
          
          /* Optimize paint performance */
          .optimize-paint {
            will-change: transform;
            contain: layout style paint;
          }
          
          /* Mobile touch optimizations */
          @media (pointer: coarse) {
            button, a, input, select, textarea {
              min-height: 44px;
              min-width: 44px;
            }
          }
        `}</style>
      )}
      
      {/* Implement advanced resource hints */}
      <meta name="theme-color" content="#0A2342" />
      <meta httpEquiv="Accept-CH" content="DPR, Width, Viewport-Width" />
      <link rel="dns-prefetch" href="https://api.ohanarealty.com" />
      
      {/* Advanced performance-related meta tags */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      {optimizeCoreWebVitals && (
        <>
          <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
          <link rel="preload" href="/src/main.tsx" as="script" />
        </>
      )}
    </Helmet>
  );
}