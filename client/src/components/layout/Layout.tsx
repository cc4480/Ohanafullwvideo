import React, { ReactNode, useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import BackgroundAnimation from './BackgroundAnimation';

interface LayoutProps {
  children: ReactNode;
  transparentHeader?: boolean; // Option for transparent header on certain pages
}

/**
 * Layout component that creates a consistent structure for all pages
 * with subtle background animations that enhance the user experience
 * and handles proper scroll position management across all devices.
 * Enhanced with hardware acceleration and performance optimizations.
 */
export default function Layout({ children, transparentHeader = false }: LayoutProps) {
  const [location] = useLocation();
  const [colorTheme, setColorTheme] = useState<'blue' | 'teal' | 'purple' | 'default'>('default');
  const mainRef = useRef<HTMLElement>(null);
  const isMobileRef = useRef<boolean>(false);
  
  // Apply core performance optimizations on mount
  useEffect(() => {
    // Detect mobile devices
    isMobileRef.current = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Apply hardware acceleration to critical elements
    if (mainRef.current) {
      mainRef.current.classList.add('transform-gpu', 'hardware-accelerated');
      
      // Optimize main content rendering
      mainRef.current.style.willChange = 'transform';
      mainRef.current.style.backfaceVisibility = 'hidden';
      mainRef.current.style.perspective = '1000px';
      
      // Apply mobile-specific optimizations
      if (isMobileRef.current) {
        // Ensure smooth scrolling - using as any to handle vendor prefixes
        (mainRef.current.style as any)['-webkit-overflow-scrolling'] = 'touch';
        mainRef.current.style.overscrollBehavior = 'none';
        
        // Optimize for mobile GPU
        const contentElements = mainRef.current.querySelectorAll('section, article, .card, .property-card');
        contentElements.forEach(el => {
          if (el instanceof HTMLElement) {
            // Add hardware acceleration
            el.classList.add('transform-gpu');
            
            // Enhance rendering performance
            el.style.backfaceVisibility = 'hidden';
            
            // Tell browser to optimize for this content
            if ('contentVisibility' in el.style) {
              el.style.contentVisibility = 'auto';
              el.style.containIntrinsicSize = 'auto';
            }
          }
        });
      }
    }
    
    // Enhanced preloading of critical resources
    if (isMobileRef.current) {
      // On mobile, preload essential images
      const criticalImages = document.querySelectorAll('img.critical-image');
      criticalImages.forEach(img => {
        if (img instanceof HTMLImageElement) {
          const imgEl = new Image();
          imgEl.src = img.src;
        }
      });
    } else {
      // On desktop, also preload animations
      const animationElements = document.querySelectorAll('.animate-on-scroll');
      animationElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.classList.add('hardware-accelerated');
        }
      });
    }
    
    // Clean up function
    return () => {
      if (mainRef.current) {
        mainRef.current.style.willChange = 'auto';
      }
    };
  }, []);
  
  // Adjust background animation based on the current route
  useEffect(() => {
    // Set different background themes based on the route
    if (location.includes('/properties')) {
      setColorTheme('blue');
    } else if (location.includes('/neighborhoods')) {
      setColorTheme('teal');
    } else if (location.includes('/about') || location.includes('/contact')) {
      setColorTheme('purple');
    } else {
      setColorTheme('default');
    }
    
    // Handle scroll position reset - especially for mobile browsers
    const enforceScrollTop = () => {
      if (typeof window !== 'undefined') {
        // Force scroll to top with better performance
        window.scrollTo({top: 0, behavior: 'auto'});
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        
        // Enhanced mobile scroll reset
        if (isMobileRef.current && mainRef.current) {
          mainRef.current.scrollTop = 0;
          
          // On iOS specifically, use transform instead of overflow to avoid repaints
          document.body.style.transform = 'translateZ(0)';
          document.body.style.overflow = 'hidden';
          
          // Use requestAnimationFrame for better timing
          requestAnimationFrame(() => {
            setTimeout(() => {
              document.body.style.overflow = '';
              document.body.style.transform = '';
            }, 10);
          });
        }
      }
    };
    
    // Execute immediately using requestAnimationFrame for better timing
    requestAnimationFrame(enforceScrollTop);
    
    // And again with a slight delay to ensure it works across browsers
    const timeoutId = setTimeout(enforceScrollTop, 50);
    
    return () => clearTimeout(timeoutId);
  }, [location]);
  
  return (
    <div className="min-h-screen h-screen-safe flex flex-col bg-transparent overflow-x-hidden mobile-optimized hardware-accelerated transform-gpu">
      {/* Professional subtle background animation - hardware accelerated */}
      <BackgroundAnimation 
        colorTheme={colorTheme} 
        intensity={0.4} 
        includeBeams={true} 
      />
      
      {/* Main content that scrolls over the animated background - with enhanced performance */}
      <main 
        ref={mainRef}
        className="flex-grow relative z-1 bg-transparent hardware-accelerated transform-gpu"
        style={{ 
          overscrollBehavior: 'none', // Prevents bounce effects on some browsers
          backfaceVisibility: 'hidden',
          perspective: '1000px',
          contain: 'paint layout style', // Modern browsers only - helps performance
          willChange: 'transform',
          // Apply WebkitOverflowScrolling as a string property
          ...(isMobileRef.current ? { '-webkit-overflow-scrolling': 'touch' } as any : {})
        }}
      >
        {/* Content container with improved mobile scroll handling & hardware acceleration */}
        <div 
          className="overlay-content container-responsive hardware-accelerated transform-gpu"
          style={{
            backfaceVisibility: 'hidden',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale'
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}