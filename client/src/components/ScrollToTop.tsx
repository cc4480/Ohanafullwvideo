import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * Enhanced ScrollToTop component with comprehensive browser support
 * 
 * This component ensures that when navigating between pages,
 * the scroll position is always reset to the top of the page,
 * with special handling for mobile devices and problematic browsers.
 * It employs multiple techniques to guarantee scroll restoration works
 * in all browser environments.
 */
export default function ScrollToTop() {
  const [location] = useLocation();
  
  // Use useLayoutEffect for synchronous execution before browser paints
  useLayoutEffect(() => {
    // Create a more aggressive scroll reset function
    const resetScrollPosition = () => {
      console.log("Resetting scroll position for navigation to:", location);
      
      // Immediately stop any ongoing scrolling
      if ('cancelScroll' in window) {
        (window as any).cancelScroll();
      }
      
      // Force scroll to top with highest priority
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      
      // Force all scrollable elements to top position
      const scrollableElements = document.querySelectorAll('.scrollable, [data-scrollable], main, section, .overflow-auto, .overflow-y-auto');
      scrollableElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.scrollTop = 0;
        }
      });
      
      // Special handling for mobile browsers
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        // Reset scroll position with different technique
        document.documentElement.style.scrollBehavior = 'auto';
        document.body.style.scrollBehavior = 'auto';
        window.scrollTo(0, 0);
        
        // iOS Safari specific fixes
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          // Force layout recalculation with scroll blocking
          document.body.style.overflow = 'hidden';
          document.documentElement.style.overflow = 'hidden';
          void document.body.offsetHeight;
          
          // After a tiny delay, restore scrolling and ensure we're at top
          setTimeout(() => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            window.scrollTo(0, 0);
          }, 5);
        }
      }
    };
    
    // Run immediately with high priority
    resetScrollPosition();
    
    // Add multiple attempts with increasing delays for reliability
    const timers = [
      setTimeout(resetScrollPosition, 0),  // Immediate queue
      setTimeout(resetScrollPosition, 10), // Very quick follow-up
      setTimeout(resetScrollPosition, 50), // Short delay
      setTimeout(resetScrollPosition, 100), // Medium delay
      setTimeout(resetScrollPosition, 300), // Longer delay for slower devices
      setTimeout(resetScrollPosition, 500)  // Final attempt
    ];
    
    // Add special handling for document ready state
    if (document.readyState !== 'complete') {
      window.addEventListener('load', resetScrollPosition, { once: true });
    }
    
    // Add RAF for best timing with browser paint cycle
    requestAnimationFrame(() => {
      requestAnimationFrame(resetScrollPosition);
    });
    
    return () => {
      // Cleanup all timers
      timers.forEach(id => clearTimeout(id));
      
      // Only remove event listener if we added it
      if (document.readyState !== 'complete') {
        window.removeEventListener('load', resetScrollPosition);
      }
    };
  }, [location]); // Re-run when location changes
  
  return null; // This is a behavior component, no UI needed
}