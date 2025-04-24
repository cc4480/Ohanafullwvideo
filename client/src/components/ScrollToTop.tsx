import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * ScrollToTop component for resetting scroll position on navigation
 * 
 * This component resets the scroll position to the top of the page when 
 * navigating between routes. It uses a simplified approach that works
 * across standard browsers and mobile devices.
 */
export default function ScrollToTop() {
  const [location] = useLocation();
  
  // Use useEffect to run scroll reset after the component renders
  useEffect(() => {
    // Use the most compatible scroll-to-top approach
    if ('scrollBehavior' in document.documentElement.style) {
      // Modern browsers
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Use 'instant' to prevent animation
      });
    } else {
      // Fallback for older browsers
      window.scrollTo(0, 0);
    }
    
    // Add a backup for Safari and other browsers
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    // Reset scroll on main scrollable elements (if any)
    const mainScrollableElements = document.querySelectorAll('main, .scrollable');
    mainScrollableElements.forEach(el => {
      if (el instanceof HTMLElement) {
        el.scrollTop = 0;
      }
    });
    
    // Special handling for mobile devices
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      // Force instant scroll behavior
      const originalScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      
      // Apply scroll reset
      window.scrollTo(0, 0);
      
      // Restore original scroll behavior
      setTimeout(() => {
        document.documentElement.style.scrollBehavior = originalScrollBehavior;
      }, 20);
    }
  }, [location]); // Re-run whenever location changes
  
  // This is a behavior component, no UI needed
  return null;
}