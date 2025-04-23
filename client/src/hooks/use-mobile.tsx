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
  }, [isMobile, isTouchDevice, isPortrait, applyMobileOptimizations]);
  
  // Helper functions to get proper viewport heights
  const vh = (percentage: number) => `calc(var(--vh, 1vh) * ${percentage})`;
  
  return {
    isMobile,
    isPortrait,
    isTouchDevice,
    viewportHeight,
    safeAreaInsets,
    vh // Helper function for viewport height calculations
  };
};