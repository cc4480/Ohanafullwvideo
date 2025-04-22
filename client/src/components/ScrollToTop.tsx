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
    // Ensure the window exists (for SSR compatibility)
    if (typeof window !== 'undefined') {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      // Function to reset scroll position with multiple approaches
      const resetScrollPosition = () => {
        // Method 1: Basic scroll reset - most compatible
        window.scrollTo(0, 0);
        
        // Method 2: Force layout recalculation - helps with stubborn browsers
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        
        // Method 3: For iOS Safari specifically
        if (isMobile) {
          document.body.style.minHeight = '100vh';
          document.body.style.height = 'auto';
          
          // Force redraw
          document.body.style.display = 'none';
          // This triggers a reflow
          void document.body.offsetHeight;
          document.body.style.display = '';
          
          // Ensure we're at the top
          window.scrollTo(0, 0);
        }
      };
      
      // Immediate reset
      resetScrollPosition();
      
      // Secondary reset with slight delay (helps with certain mobile browsers)
      setTimeout(resetScrollPosition, 10);
      
      // Final cleanup for iOS Safari
      if (isMobile) {
        setTimeout(() => {
          document.body.style.minHeight = '';
          document.body.style.height = '';
        }, 50);
      }
    }
  }, [location]); // Only run when the location changes
  
  return null; // This component doesn't render anything
}