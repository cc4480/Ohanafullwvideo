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

// Force dark mode always
const initializeTheme = () => {
  // Always set dark mode regardless of user preferences or stored settings
  try {
    // Set dark mode explicitly
    document.documentElement.classList.add("dark");
    
    // Store the theme setting in localStorage for consistency
    localStorage.setItem("theme", "dark");
  } catch (e) {
    // Fallback in case localStorage is unavailable
    console.warn("Theme initialization encountered an error:", e);
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
  
  // Add global styles from external sources with preload
  const fontLink = document.createElement('link');
  fontLink.setAttribute('rel', 'preload');
  fontLink.setAttribute('as', 'style');
  fontLink.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
  
  // Type assertion to handle the event properly
  (fontLink as any).onload = function(this: HTMLLinkElement) {
    this.onload = null;
    this.rel = 'stylesheet';
  };
  document.head.appendChild(fontLink);
  
  const boxiconsLink = document.createElement('link');
  boxiconsLink.setAttribute('rel', 'preload');
  boxiconsLink.setAttribute('as', 'style');
  boxiconsLink.setAttribute('href', 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css');
  
  // Type assertion to handle the event properly
  (boxiconsLink as any).onload = function(this: HTMLLinkElement) {
    this.onload = null;
    this.rel = 'stylesheet';
  };
  document.head.appendChild(boxiconsLink);
  
  // Enable cooperative scheduling with main thread
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
    });
  }
};

// Call the initialization functions
initializeTheme();
applyPerformanceOptimizations();

// Create root with optimized rendering settings
const root = createRoot(document.getElementById("root")!, {
  // Use concurrent features for improved performance
  onRecoverableError: (error) => {
    console.warn('Recoverable rendering error:', error);
  },
});

// Mount the app
root.render(<App />);
