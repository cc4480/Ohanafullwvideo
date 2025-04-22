import { useEffect, useState } from 'react';

interface PerformanceOptimizerProps {
  /**
   * Debug mode to log optimization decisions to console
   */
  debug?: boolean;
}

/**
 * Global performance optimizer component that applies advanced hardware acceleration
 * and rendering optimizations based on the device capabilities.
 * 
 * This component should be included once at the top level of your application.
 */
export default function PerformanceOptimizer({ debug = false }: PerformanceOptimizerProps) {
  const [deviceType, setDeviceType] = useState<'high-end' | 'mid-range' | 'low-end'>('mid-range');
  
  useEffect(() => {
    // Detect device capabilities for optimal performance settings
    const detectDeviceCapabilities = () => {
      // Check for mobile/tablet
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
        window.innerWidth <= 768;
      
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Use hardware concurrency and device memory to estimate device capability
      const cores = navigator.hardwareConcurrency || 2;
      const memory = (navigator as any).deviceMemory || (isMobile ? 2 : 4);
      
      // Simple heuristic to categorize device capability
      let deviceCapability: 'high-end' | 'mid-range' | 'low-end';
      
      if (cores >= 6 && memory >= 4) {
        deviceCapability = 'high-end';
      } else if (cores >= 4 && memory >= 2) {
        deviceCapability = 'mid-range';
      } else {
        deviceCapability = 'low-end';
      }
      
      // Further downgrade if reduced motion is preferred
      if (prefersReducedMotion && deviceCapability !== 'low-end') {
        deviceCapability = deviceCapability === 'high-end' ? 'mid-range' : 'low-end';
      }
      
      setDeviceType(deviceCapability);
      
      if (debug) {
        console.log(`Device detected as: ${deviceCapability}`);
        console.log(`Hardware details: Cores: ${cores}, Memory: ${memory}GB`);
        console.log(`Mobile: ${isMobile}, Prefers reduced motion: ${prefersReducedMotion}`);
      }
      
      return { deviceCapability, isMobile, prefersReducedMotion };
    };
    
    const { deviceCapability, isMobile, prefersReducedMotion } = detectDeviceCapabilities();
    
    // Apply global performance optimizations based on device capabilities
    const applyOptimizations = () => {
      const html = document.documentElement;
      const body = document.body;
      
      // Base optimizations for all devices
      html.style.setProperty('text-rendering', 'optimizeSpeed');
      html.style.setProperty('image-rendering', 'optimizeSpeed');
      html.style.setProperty('scroll-behavior', prefersReducedMotion ? 'auto' : 'smooth');
      html.classList.add('hardware-accelerated');
      
      // Advanced hardware acceleration technique - use transform to force GPU rendering
      body.style.setProperty('transform', 'translateZ(0)');
      body.style.setProperty('-webkit-transform', 'translateZ(0)');
      body.style.setProperty('backface-visibility', 'hidden');
      body.style.setProperty('-webkit-backface-visibility', 'hidden');
      body.style.setProperty('perspective', '1000px');
      body.style.setProperty('-webkit-perspective', '1000px');
      
      // Enable force GPU rasterization in Chrome
      body.style.setProperty('transform', 'translateZ(0)');
      html.style.setProperty('will-change', 'transform');
      
      // Smoother animations and interactions
      body.style.setProperty('touch-action', 'manipulation');
      body.style.setProperty('-webkit-touch-callout', 'none');
      body.style.setProperty('-webkit-tap-highlight-color', 'rgba(0,0,0,0)');
      
      // Font smoothing
      body.style.setProperty('-webkit-font-smoothing', 'antialiased');
      body.style.setProperty('-moz-osx-font-smoothing', 'grayscale');
      
      // Apply class for capability-specific CSS optimizations
      html.classList.add(`device-${deviceCapability}`);
      if (isMobile) html.classList.add('is-mobile-device');
      
      // For lower-end devices, apply additional optimizations
      if (deviceCapability === 'low-end' || prefersReducedMotion) {
        // Disable some expensive animations
        html.classList.add('reduce-animations');
        
        // Reduce filter effects
        html.style.setProperty('--filter-blur-factor', '0.5');
        
        // Custom property for JS components to respect
        html.style.setProperty('--animation-speed-factor', '0.7');
        
        // Reduce shadow complexities
        html.style.setProperty('--shadow-intensity', '0.7');
        
        // Minimize parallax effects
        html.style.setProperty('--parallax-factor', '0.3');
      } else if (deviceCapability === 'mid-range') {
        // Mid-range optimizations
        html.style.setProperty('--filter-blur-factor', '0.8');
        html.style.setProperty('--animation-speed-factor', '0.9');
        html.style.setProperty('--shadow-intensity', '0.9');
        html.style.setProperty('--parallax-factor', '0.7');
      } else {
        // High-end devices get full effects
        html.style.setProperty('--filter-blur-factor', '1');
        html.style.setProperty('--animation-speed-factor', '1');
        html.style.setProperty('--shadow-intensity', '1');
        html.style.setProperty('--parallax-factor', '1');
      }
      
      // For mobile devices, add specific mobile optimizations
      if (isMobile) {
        // Further optimizations for mobile
        html.classList.add('optimize-mobile');
        
        // Viewport optimization to handle virtual keyboard issues
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          viewport.setAttribute('content', 
            'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover, user-scalable=no');
        }
        
        // Prevent unnecessary reflows from fixing position:fixed on iOS
        const fixIOSPositionFixed = () => {
          // Only on iOS Safari
          const ua = navigator.userAgent;
          const iOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
          
          if (iOS) {
            document.addEventListener('touchmove', (e) => {
              if (e.touches.length > 1) {
                e.preventDefault(); // Prevent pinch zoom
              }
            }, { passive: false });
          }
        };
        
        fixIOSPositionFixed();
      }
      
      // Debug logging
      if (debug) {
        console.log('Performance optimizations applied for device type:', deviceCapability);
        console.log('Mobile-specific optimizations:', isMobile);
      }
    };
    
    applyOptimizations();
    
    // Apply advanced GPU optimizations for scrolling
    const optimizeScrolling = () => {
      // Create a simple passive scroll listener to hint browser to use compositor
      window.addEventListener('scroll', () => {}, { passive: true });
      
      // For smoother scrolling, add some minimal scroll markers that hint to the browser
      // that hardware acceleration would be beneficial during scrolling
      const scrollMarkers = document.querySelectorAll('.scroll-marker');
      if (scrollMarkers.length === 0) {
        const createScrollMarkers = () => {
          // Create invisible elements throughout the page to help with scroll acceleration
          const body = document.body;
          const pageHeight = Math.max(
            body.scrollHeight,
            body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
          );
          
          // Create a marker every 500px
          const markerCount = Math.floor(pageHeight / 500);
          
          for (let i = 0; i < markerCount; i++) {
            const marker = document.createElement('div');
            marker.className = 'scroll-marker';
            marker.style.position = 'absolute';
            marker.style.top = `${i * 500}px`;
            marker.style.left = '0';
            marker.style.width = '1px';
            marker.style.height = '1px';
            marker.style.pointerEvents = 'none';
            marker.style.opacity = '0';
            marker.style.transform = 'translateZ(0)';
            marker.style.willChange = 'transform';
            marker.setAttribute('aria-hidden', 'true');
            body.appendChild(marker);
          }
        };
        
        // Only create these if we don't have them already
        if (deviceCapability !== 'low-end') {
          createScrollMarkers();
        }
      }
    };
    
    // Don't run this on low-end devices as it adds some overhead
    if (deviceCapability !== 'low-end') {
      optimizeScrolling();
    }
    
    // Listen for orientation change or resize to re-apply optimizations if needed
    const handleViewportChange = () => {
      detectDeviceCapabilities();
    };
    
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('orientationchange', handleViewportChange);
    
    return () => {
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('orientationchange', handleViewportChange);
    };
  }, [debug]);

  // This component doesn't render anything visual
  return null;
}