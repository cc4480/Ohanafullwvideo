import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'wouter';

/**
 * Super-enhanced ScrollToTop component with maximum cross-browser compatibility
 * 
 * This component has been upgraded with multiple redundant techniques to ensure
 * the scroll position resets to the top when navigating between pages,
 * even in the most problematic browser environments and mobile devices.
 * 
 * IMPORTANT: This component works in tandem with the global route change detection
 * in App.tsx for maximum reliability.
 */
export default function ScrollToTop() {
  const [location] = useLocation();
  const prevLocationRef = useRef(location);
  const scrollAttemptsRef = useRef(0);
  const maxScrollAttempts = 4; // Reduced maximum number of attempts to prevent excessive logging
  
  // DOM mutation observer to detect when content is actually loaded
  useEffect(() => {
    if (location !== prevLocationRef.current) {
      // Reset the counter when location changes
      scrollAttemptsRef.current = 0;
      
      // Create a mutation observer to detect DOM changes (content loading)
      const observer = new MutationObserver((mutations) => {
        if (scrollAttemptsRef.current < maxScrollAttempts) {
          // If we haven't exceeded max attempts, force scroll reset when DOM changes
          forceScrollReset(true);
          scrollAttemptsRef.current++;
        } else {
          observer.disconnect(); // Stop observing after max attempts
        }
      });
      
      // Watch for any changes to the main content areas
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
      });
      
      // Update reference for next comparison
      prevLocationRef.current = location;
      
      // Clean up observer
      return () => observer.disconnect();
    }
  }, [location]);
  
  // Use useLayoutEffect for synchronous execution before browser paints
  useLayoutEffect(() => {
    if (scrollAttemptsRef.current < maxScrollAttempts) {
      forceScrollReset();
      scrollAttemptsRef.current++; // Track attempts
    }
    
    // Reduced number of attempts to avoid excessive console logging
    // while still ensuring scroll reset works properly
    const timers = [
      setTimeout(() => {
        if (scrollAttemptsRef.current < maxScrollAttempts) {
          forceScrollReset(true);
          scrollAttemptsRef.current++;
        }
      }, 0),
      setTimeout(() => {
        if (scrollAttemptsRef.current < maxScrollAttempts) {
          forceScrollReset(true);
          scrollAttemptsRef.current++;
        }
      }, 50),
      setTimeout(() => {
        if (scrollAttemptsRef.current < maxScrollAttempts) {
          forceScrollReset(true);
          scrollAttemptsRef.current++;
        }
      }, 200),
      setTimeout(() => {
        if (scrollAttemptsRef.current < maxScrollAttempts) {
          forceScrollReset(true);
          scrollAttemptsRef.current++;
        }
      }, 500),
      setTimeout(() => {
        if (scrollAttemptsRef.current < maxScrollAttempts) {
          forceScrollReset(true);
          scrollAttemptsRef.current++;
        }
      }, 750),
      setTimeout(() => {
        if (scrollAttemptsRef.current < maxScrollAttempts) {
          forceScrollReset(true);
          scrollAttemptsRef.current++;
        }
      }, 1000) // Final attempt after 1 second
    ];
    
    // Add special handling for document ready state
    const loadHandler = () => {
      if (scrollAttemptsRef.current < maxScrollAttempts) {
        forceScrollReset(true);
        scrollAttemptsRef.current++;
      }
    };
    
    if (document.readyState !== 'complete') {
      window.addEventListener('load', loadHandler, { once: true });
    }
    
    // Add special handling for lazy-loaded images which can affect layout
    const imgLoadHandler = () => {
      if (scrollAttemptsRef.current < maxScrollAttempts) {
        forceScrollReset();
        scrollAttemptsRef.current++;
      }
    };
    
    // Listen for image loads which might affect layout
    document.querySelectorAll('img').forEach(img => {
      if (!img.complete) {
        img.addEventListener('load', imgLoadHandler, { once: true });
      }
    });
    
    // Use requestAnimationFrame for best timing with browser paint cycle
    const rafHandler = () => {
      if (scrollAttemptsRef.current < maxScrollAttempts) {
        requestAnimationFrame(() => {
          forceScrollReset(true);
          scrollAttemptsRef.current++;
        });
      }
    };
    requestAnimationFrame(rafHandler);
    
    return () => {
      // Cleanup all timers
      timers.forEach(id => clearTimeout(id));
      
      // Remove event listeners
      if (document.readyState !== 'complete') {
        window.removeEventListener('load', loadHandler);
      }
      
      document.querySelectorAll('img').forEach(img => {
        img.removeEventListener('load', imgLoadHandler);
      });
    };
  }, [location]); // Re-run when location changes
  
  // Define the nuclear scroll reset function
  function forceScrollReset(withConsoleLog = false) {
    if (withConsoleLog) {
      console.log("EXTREME SCROLL RESET (attempt #" + scrollAttemptsRef.current + ") for:", location);
    }
    
    try {
      // Try to stop any ongoing animations or scrolling
      if ('cancelAnimationFrame' in window) {
        const scrollAnimationId = (window as any)._currentScrollAnimationId;
        if (scrollAnimationId) {
          cancelAnimationFrame(scrollAnimationId);
        }
      }
      
      if ('cancelScroll' in window) {
        (window as any).cancelScroll();
      }
    } catch (e) {
      // Ignore any errors from experimental APIs
    }
    
    // LEVEL 1: Basic scroll reset
    try {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    } catch (e) {
      console.error("Basic scroll reset failed:", e);
    }
    
    // LEVEL 2: Enhanced scroll reset - all possible scrollable elements
    try {
      // Force all scrollable containers to reset
      const scrollableElements = document.querySelectorAll('*');
      scrollableElements.forEach(el => {
        if (el instanceof HTMLElement && (
          el.scrollHeight > el.clientHeight || 
          window.getComputedStyle(el).overflowY === 'scroll' ||
          window.getComputedStyle(el).overflowY === 'auto' ||
          el.classList.contains('scrollable') ||
          el.classList.contains('overflow-auto') ||
          el.classList.contains('overflow-y-auto')
        )) {
          el.scrollTop = 0;
        }
      });
    } catch (e) {
      console.error("Enhanced scroll reset failed:", e);
    }
    
    // LEVEL 3: Platform-specific techniques
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      // Extreme mode for mobile devices
      if (isMobile) {
        // Set scroll behavior to instant
        document.documentElement.style.scrollBehavior = 'auto';
        document.body.style.scrollBehavior = 'auto';
        
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        
        // Special iOS handling - the most problematic platform
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          // Force reflow with overflow blocking
          document.body.style.overflow = 'hidden';
          document.documentElement.style.overflow = 'hidden';
          
          // Force browser to recognize changes
          void document.body.offsetHeight;
          void document.body.offsetWidth;
          
          // Create a tiny delay then restore scrolling at top
          setTimeout(() => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            window.scrollTo(0, 0);
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
          }, 10);
        }
        
        // Restore scroll behavior
        setTimeout(() => {
          document.documentElement.style.scrollBehavior = '';
          document.body.style.scrollBehavior = '';
        }, 50);
      }
    } catch (e) {
      console.error("Platform-specific scroll reset failed:", e);
    }
    
    // LEVEL 4: Nuclear option - For extreme cases
    try {
      // Create a marker element at the top
      const scrollMarker = document.createElement('div');
      scrollMarker.id = '_temp_scroll_marker';
      scrollMarker.style.position = 'absolute';
      scrollMarker.style.top = '0';
      scrollMarker.style.height = '1px';
      scrollMarker.style.width = '1px';
      scrollMarker.style.pointerEvents = 'none';
      scrollMarker.style.opacity = '0';
      scrollMarker.style.zIndex = '-1';
      
      // Insert at the top of the body
      if (document.body.firstChild) {
        document.body.insertBefore(scrollMarker, document.body.firstChild);
      } else {
        document.body.appendChild(scrollMarker);
      }
      
      // Scroll to this marker
      scrollMarker.scrollIntoView({ behavior: 'auto', block: 'start' });
      
      // Clean up after a delay
      setTimeout(() => {
        if (scrollMarker.parentNode) {
          scrollMarker.parentNode.removeChild(scrollMarker);
        }
      }, 100);
    } catch (e) {
      console.error("Nuclear scroll reset failed:", e);
    }
  }
  
  // This is a behavior component, no UI needed
  return null;
}