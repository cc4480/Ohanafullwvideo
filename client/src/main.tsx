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

// Simple empty function to avoid any service worker issues
const unregisterServiceWorkers = () => {
  // Do nothing - avoid any service worker code that could cause crashes
  console.log('Service worker operations skipped');
};

// Apply basic performance optimizations (simplified to prevent app crashes)
const applyPerformanceOptimizations = () => {
  // Enable smooth scrolling for browsers that support it
  document.documentElement.style.scrollBehavior = "smooth";

  // Basic font optimization
  const fontLink = document.createElement('link');
  fontLink.setAttribute('rel', 'preconnect');
  fontLink.setAttribute('href', 'https://fonts.googleapis.com');
  document.head.appendChild(fontLink);

  // Just load the fonts directly to avoid any complicated loading strategies
  const fontStyleLink = document.createElement('link');
  fontStyleLink.setAttribute('rel', 'stylesheet');
  fontStyleLink.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
  document.head.appendChild(fontStyleLink);

  // Skip other optimizations that might be causing issues
};

// Call the initialization functions
initializeTheme();
applyPerformanceOptimizations();
unregisterServiceWorkers();

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found");
}

const root = createRoot(container);

// Render immediately
root.render(<App />);