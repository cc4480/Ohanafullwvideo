import { useEffect } from 'react';
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
  
  useEffect(() => {
    // Create a more aggressive scroll reset function
    const resetScrollPosition = () => {
      // Use smooth scrolling for better UX
      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant' // Use 'instant' instead of 'smooth' to prevent scroll animation
        });
      } else {
        // Fallback for browsers without scrollBehavior support
        window.scrollTo(0, 0);
      }
      
      // Ensure scrolling works on all browsers including Safari
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      
      // Additional mobile-specific handling
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        // Force body to top
        document.body.style.scrollBehavior = 'auto';
        document.documentElement.style.scrollBehavior = 'auto';
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        
        // iOS Safari specific fixes
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          // Briefly pause scrolling to ensure position reset
          document.body.style.overflow = 'hidden';
          
          // Force layout recalculation
          void document.body.offsetHeight;
          
          // After a short delay, restore normal scrolling
          setTimeout(() => {
            document.body.style.overflow = '';
            window.scrollTo(0, 0);
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
          }, 10);
        }
      }
    };
    
    // Run immediately
    resetScrollPosition();
    
    // Multiple timers for extra reliability
    const timers = [
      setTimeout(resetScrollPosition, 0),
      setTimeout(resetScrollPosition, 50),
      setTimeout(resetScrollPosition, 100)
    ];
    
    // Also attach to window load event for additional insurance
    const handleLoad = () => resetScrollPosition();
    window.addEventListener('load', handleLoad);
    
    return () => {
      // Cleanup all timers and event listeners
      timers.forEach(id => clearTimeout(id));
      window.removeEventListener('load', handleLoad);
    };
  }, [location]); // Re-run when location changes
  
  return null; // This is a behavior component, no UI needed
}