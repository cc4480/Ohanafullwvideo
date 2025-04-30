import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

/**
 * Performance optimizations for smoother loading and animations
 */

// Apply hardware acceleration to the entire page
document.documentElement.style.transform = "translate3d(0,0,0)";
document.documentElement.style.backfaceVisibility = "hidden";
document.documentElement.style.perspective = "1000px";

// Initialize dark mode based on localStorage or system preference before render
const initializeTheme = () => {
  // Fast synchronous theme application to avoid flash of incorrect theme
  try {
    // Set dark mode explicitly for this app - always use dark mode
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } catch (e) {
    // Fallback in case localStorage is unavailable
    console.warn("Theme initialization encountered an error:", e);
  }
};

// Unregister all service workers to fix ERR_BLOCKED_BY_RESPONSE issues
const unregisterServiceWorkers = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        // Unregister all service workers
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let registration of registrations) {
          await registration.unregister();
          console.log('Service Worker unregistered successfully');
        }
        console.log('All service workers have been removed');
      } catch (error) {
        console.error('Error unregistering service workers:', error);
      }
    });
  }
};

// Apply critical performance optimizations
const applyPerformanceOptimizations = () => {
  // Optimize image rendering
  document.body.style.imageRendering = "high-quality";
  
  // Enable smooth scrolling for browsers that support it
  document.documentElement.style.scrollBehavior = "smooth";
  
  // Setup visual viewport optimizations for mobile
  if ('visualViewport' in window && window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
      document.documentElement.style.height = `${window.visualViewport?.height}px`;
    });
  }
  
  // Optimize font loading with resource hints for better performance
  const fontLink = document.createElement('link');
  fontLink.setAttribute('rel', 'preconnect');
  fontLink.setAttribute('href', 'https://fonts.googleapis.com');
  document.head.appendChild(fontLink);
  
  const fontGstaticLink = document.createElement('link');
  fontGstaticLink.setAttribute('rel', 'preconnect');
  fontGstaticLink.setAttribute('href', 'https://fonts.gstatic.com');
  fontGstaticLink.setAttribute('crossorigin', 'anonymous');
  document.head.appendChild(fontGstaticLink);
  
  // Load fonts with optimized strategy
  const fontStyleLink = document.createElement('link');
  fontStyleLink.setAttribute('rel', 'stylesheet');
  fontStyleLink.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
  fontStyleLink.setAttribute('media', 'print');
  fontStyleLink.setAttribute('onload', "this.media='all'");
  document.head.appendChild(fontStyleLink);
  
  // Preconnect to boxicons CDN for faster loading
  const boxiconsPreconnect = document.createElement('link');
  boxiconsPreconnect.setAttribute('rel', 'preconnect');
  boxiconsPreconnect.setAttribute('href', 'https://unpkg.com');
  document.head.appendChild(boxiconsPreconnect);
  
  // Load boxicons with optimized strategy
  const boxiconsLink = document.createElement('link');
  boxiconsLink.setAttribute('rel', 'stylesheet');
  boxiconsLink.setAttribute('href', 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css');
  boxiconsLink.setAttribute('media', 'print');
  boxiconsLink.setAttribute('onload', "this.media='all'");
  document.head.appendChild(boxiconsLink);
  
  // Add critical resource hints for faster loading
  // Preconnect to API server
  const apiServerPreconnect = document.createElement('link');
  apiServerPreconnect.setAttribute('rel', 'preconnect');
  apiServerPreconnect.setAttribute('href', window.location.origin);
  document.head.appendChild(apiServerPreconnect);
  
  // Enable cooperative scheduling with main thread for better perf
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      // Preload critical pages for faster navigation
      const links = [
        '/properties',
        '/#contact',
      ];
      
      links.forEach(href => {
        const link = document.createElement('link');
        link.setAttribute('rel', 'prefetch');
        link.setAttribute('href', href);
        document.head.appendChild(link);
      });
      
      // Preload API data for common routes
      void fetch('/api/properties').catch(() => {});
      void fetch('/api/neighborhoods').catch(() => {});
    });
  }
};

// Call the initialization functions
initializeTheme();
applyPerformanceOptimizations();
unregisterServiceWorkers();

// Create root with optimized rendering settings
const root = createRoot(document.getElementById("root")!, {
  // Use concurrent features for improved performance
  onRecoverableError: (error) => {
    console.warn('Recoverable rendering error:', error);
  },
});

// Mount the app
root.render(<App />);
