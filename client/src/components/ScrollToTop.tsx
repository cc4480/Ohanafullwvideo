import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * ScrollToTop component with enhanced mobile support
 * 
 * This component ensures that when navigating between pages,
 * the scroll position is always reset to the top of the page,
 * with special handling for mobile devices and problematic browsers.
 * It works with wouter's useLocation hook to detect route changes.
 */
export default function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    const resetScrollPosition = () => {
      // Try multiple scrolling methods for maximum compatibility
      if (window.scrollTo) {
        // Standard method
        window.scrollTo(0, 0);
      }
      
      // Ensure scrolling works on Safari
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      
      // Additional mobile-specific handling
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        // Special handling for iOS Safari scrolling issues
        document.body.style.overflow = 'hidden';
        
        // Force layout recalculation
        void document.body.offsetHeight;
        
        // After a short delay, restore normal scrolling
        setTimeout(() => {
          document.body.style.overflow = '';
          
          // Scroll again to ensure position is reset
          window.scrollTo(0, 0);
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        }, 10);
      }
    };
    
    // Call once right away
    resetScrollPosition();
    
    // And once more after a slight delay for reliable results
    const timeoutId = setTimeout(resetScrollPosition, 50);
    
    return () => clearTimeout(timeoutId);
  }, [location]); // Re-run when location changes
  
  return null; // This is a behavior component, no UI needed
}