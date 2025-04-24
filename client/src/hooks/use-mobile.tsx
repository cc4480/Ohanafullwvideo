import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook that provides mobile detection, orientation information,
 * and optimizations for mobile experience
 */
export const useMobile = () => {
  // Initialize states for mobile detection and orientation
  const [isMobile, setIsMobile] = useState(false);
  const [isPortrait, setIsPortrait] = useState(true);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [viewportHeight, setViewportHeight] = useState<number>(0);
  const [safeAreaInsets, setSafeAreaInsets] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  });
  
  // Detect if device is mobile based on screen size and user agent
  const detectMobile = useCallback(() => {
    // Check viewport width as primary indicator
    const isMobileViewport = window.innerWidth < 768;
    
    // Use navigator userAgent as secondary indicator
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent);
    
    // Check if device has touch capabilities as tertiary indicator
    const hasTouchCapability = 'ontouchstart' in window || 
                             navigator.maxTouchPoints > 0 || 
                             (navigator as any).msMaxTouchPoints > 0;
    
    setIsMobile(isMobileViewport || isMobileUserAgent);
    setIsTouchDevice(hasTouchCapability);
    
    // Set orientation
    setIsPortrait(window.innerHeight > window.innerWidth);
    
    // Update viewport height (addresses iOS Safari issues)
    setViewportHeight(window.innerHeight);
    
    // Detect safe area insets for notched devices
    const computedStyle = getComputedStyle(document.documentElement);
    const extractSafeAreaValue = (prop: string): number => {
      const value = computedStyle.getPropertyValue(prop);
      return value ? parseInt(value.replace('px', ''), 10) : 0;
    };
    
    setSafeAreaInsets({
      top: extractSafeAreaValue('--sat') || 0,
      right: extractSafeAreaValue('--sar') || 0,
      bottom: extractSafeAreaValue('--sab') || 0,
      left: extractSafeAreaValue('--sal') || 0
    });
  }, []);
  
  // Function to apply mobile-specific optimizations
  const applyMobileOptimizations = useCallback(() => {
    if (isMobile) {
      // Add mobile class to body for CSS targeting
      document.body.classList.add('is-mobile');
      
      if (isTouchDevice) {
        document.body.classList.add('is-touch-device');
        
        // Apply touch-specific optimizations
        const touchTargets = document.querySelectorAll('button, a, input, select, [role="button"]');
        touchTargets.forEach(element => {
          if (element instanceof HTMLElement) {
            // Ensure appropriate touch target size
            const computedStyle = window.getComputedStyle(element);
            const height = parseInt(computedStyle.height, 10);
            const width = parseInt(computedStyle.width, 10);
            
            // Only modify if the element is too small for touch
            if (height < 44 || width < 44) {
              // Apply appropriate sizing based on element type
              if (element.tagName === 'BUTTON' || element.getAttribute('role') === 'button') {
                element.style.minHeight = '44px';
                element.style.minWidth = '44px';
              } else if (element.tagName === 'A') {
                // For inline links, increase padding instead
                element.style.padding = '8px';
                element.style.display = 'inline-block';
              }
            }
            
            // Improve touch feedback
            element.style.setProperty('webkit-tap-highlight-color', 'transparent');
            element.style.touchAction = 'manipulation';
          }
        });
        
        // Fix 100vh issue on mobile browsers
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
      }
      
      if (!isPortrait) {
        document.body.classList.add('is-landscape');
      } else {
        document.body.classList.remove('is-landscape');
      }
      
      // Optimize font rendering for mobile
      document.body.style.textRendering = 'optimizeSpeed';
      document.body.style.setProperty('-webkit-font-smoothing', 'antialiased');
      
      // Prevent overscroll/bounce
      document.body.style.overscrollBehavior = 'none';
      
      // Apply safe area insets as CSS variables
      document.documentElement.style.setProperty('--safe-area-top', `${safeAreaInsets.top}px`);
      document.documentElement.style.setProperty('--safe-area-right', `${safeAreaInsets.right}px`);
      document.documentElement.style.setProperty('--safe-area-bottom', `${safeAreaInsets.bottom}px`);
      document.documentElement.style.setProperty('--safe-area-left', `${safeAreaInsets.left}px`);
    } else {
      document.body.classList.remove('is-mobile', 'is-touch-device', 'is-landscape');
    }
  }, [isMobile, isTouchDevice, isPortrait, safeAreaInsets]);
  
  // Run detection on mount and window resize
  useEffect(() => {
    detectMobile();
    
    const handleResize = () => {
      detectMobile();
    };
    
    const handleOrientationChange = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
      setViewportHeight(window.innerHeight);
      
      // Fix 100vh issue on orientation change
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    
    // Apply mobile optimizations initially
    applyMobileOptimizations();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Detect safe area insets (for iOS notches, etc.)
    if (CSS.supports('padding-top: env(safe-area-inset-top)')) {
      document.documentElement.style.setProperty('--sat', 'env(safe-area-inset-top)');
      document.documentElement.style.setProperty('--sar', 'env(safe-area-inset-right)');
      document.documentElement.style.setProperty('--sab', 'env(safe-area-inset-bottom)');
      document.documentElement.style.setProperty('--sal', 'env(safe-area-inset-left)');
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [detectMobile, applyMobileOptimizations]);
  
  // Apply mobile optimizations whenever relevant states change
  useEffect(() => {
    applyMobileOptimizations();
    
    // Enhanced mobile performance optimizations
    if (isMobile) {
      // Add mobile-optimized class to body for comprehensive CSS targeting
      document.body.classList.add('mobile-optimized');
      document.body.classList.add('hardware-accelerated');
      document.body.classList.add('transform-gpu');
      
      // Force hardware acceleration for all animations and transitions with maximum performance gains
      document.documentElement.style.willChange = 'transform';
      document.documentElement.style.transform = 'translate3d(0,0,0)';
      document.documentElement.style.backfaceVisibility = 'hidden';
      document.documentElement.style.perspective = '1000px';
      (document.documentElement.style as any)['-webkit-transform'] = 'translate3d(0,0,0)';
      (document.documentElement.style as any)['-webkit-backface-visibility'] = 'hidden';
      (document.documentElement.style as any)['-webkit-perspective'] = '1000';
      
      // Apply additional touch specific enhancements
      document.querySelectorAll('button, a[role="button"], [role="button"], .btn').forEach(button => {
        if (button instanceof HTMLElement) {
          // Add active state class for improved touch feedback
          button.classList.add('button-press-feedback');
          
          // Ensure all buttons have proper touch target size
          if (button.offsetHeight < 44 || button.offsetWidth < 44) {
            button.style.minHeight = '44px';
            button.style.minWidth = '44px';
          }
          
          // Add proper touch event handling
          button.addEventListener('touchstart', function() {
            this.classList.add('active');
          });
          
          button.addEventListener('touchend', function() {
            this.classList.remove('active');
            // Delay to ensure visual feedback is seen
            setTimeout(() => {
              if (this.classList.contains('active')) {
                this.classList.remove('active');
              }
            }, 300);
          });
        }
      });
      
      // Optimize images for mobile loading
      document.querySelectorAll('img:not(.critical-image)').forEach(img => {
        if (img instanceof HTMLImageElement && !img.hasAttribute('loading')) {
          img.loading = 'lazy';
          img.decoding = 'async';
        }
      });
      
      // Add delay to non-critical resource loading
      setTimeout(() => {
        // Load non-critical stylesheets
        document.querySelectorAll('link[rel="stylesheet"][data-critical="false"]').forEach(link => {
          if (link instanceof HTMLLinkElement) {
            link.disabled = false;
          }
        });
      }, 1000);
    } else {
      document.body.classList.remove('mobile-optimized');
      
      // Keep hardware acceleration but with lighter settings for desktop
      document.documentElement.style.willChange = 'auto';
      document.documentElement.style.transform = 'translateZ(0)';
      document.documentElement.style.backfaceVisibility = 'hidden';
      document.documentElement.style.perspective = 'none';
      
      // Apply only essential hardware acceleration to desktop
      document.querySelectorAll('.animate-element, .parallax-element').forEach(el => {
        if (el instanceof HTMLElement) {
          el.classList.add('hardware-accelerated');
        }
      });
    }
  }, [isMobile, isTouchDevice, isPortrait, applyMobileOptimizations]);
  
  // Helper functions to get proper viewport heights
  const vh = (percentage: number) => `calc(var(--vh, 1vh) * ${percentage})`;
  
  // Add a function to check if current device is a high-end mobile device
  const isHighEndMobile = () => {
    const highEndBrowsers = [
      'chrome/[7-9][0-9]', 'chrome/[1-9][0-9][0-9]',
      'safari/[1-9][5-9]', 'safari/[6-9][0-9]',
      'firefox/[7-9][0-9]', 'firefox/[1-9][0-9][0-9]'
    ];
    
    const userAgent = navigator.userAgent.toLowerCase();
    return isMobile && highEndBrowsers.some(browser => {
      const regex = new RegExp(browser);
      return regex.test(userAgent);
    });
  };
  
  return {
    isMobile,
    isPortrait,
    isTouchDevice,
    viewportHeight,
    safeAreaInsets,
    vh, // Helper function for viewport height calculations
    isHighEndMobile: isHighEndMobile() // Check for high-end mobile device
  };
};