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
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
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
  if ('visualViewport' in window) {
    window.visualViewport.addEventListener('resize', () => {
      document.documentElement.style.height = `${window.visualViewport.height}px`;
    });
  }
  
  // Add global styles from external sources with preload
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.as = 'style';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap';
  fontLink.onload = function() { this.onload = null; this.rel = 'stylesheet'; };
  document.head.appendChild(fontLink);
  
  const boxiconsLink = document.createElement('link');
  boxiconsLink.rel = 'preload';
  boxiconsLink.as = 'style';
  boxiconsLink.href = 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css';
  boxiconsLink.onload = function() { this.onload = null; this.rel = 'stylesheet'; };
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
        link.rel = 'prefetch';
        link.href = href;
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
