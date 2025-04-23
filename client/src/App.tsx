import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense, useEffect, useRef } from "react";
import { queryClient } from "./lib/queryClient";
import { useLocation } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Properties from "@/pages/Properties";
import PropertyDetails from "@/pages/PropertyDetails";
import Neighborhoods from "@/pages/Neighborhoods";
import NeighborhoodDetails from "@/pages/NeighborhoodDetails";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Favorites from "@/pages/Favorites";
import NotFound from "@/pages/not-found";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { useMobile } from "@/hooks/use-mobile";

// Import our newly created optimization components
import PerformanceOptimizer from "@/components/PerformanceOptimizer";
import EnterpriseGradeSEO from "@/components/EnterpriseGradeSEO";
import SiteMapGenerator from "@/components/SiteMapGenerator";

function App() {
  // Main App component with advanced optimizations and enterprise-grade SEO
  
  // Get current location for route change detection
  const [location] = useLocation();
  const prevLocationRef = useRef(location);
  
  // Initialize the mobile experience hook for mobile optimizations
  const { isMobile, isTouchDevice } = useMobile();
  
  // Base URL for the website - used for SEO components and sitemap generation
  const websiteUrl = "https://ohanarealty.com";
  
  // Force scroll to top on all route changes
  useEffect(() => {
    if (location !== prevLocationRef.current) {
      console.log("GLOBAL ROUTE CHANGE DETECTED - FORCING SCROLL RESET");
      
      // Define an aggressive scroll reset function
      const forceScrollToTop = () => {
        console.log("Executing global scroll reset");
        
        // Use all known techniques to reset scroll
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        
        // Forcefully reset scroll on all scrollable elements
        document.querySelectorAll('main, section, article, div, .scrollable, .overflow-auto, .overflow-y-auto').forEach(el => {
          if (el instanceof HTMLElement) {
            el.scrollTop = 0;
          }
        });
        
        // Special hack for stubborn mobile browsers
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
          // Temporarily disable scrolling to force position
          document.body.style.overflow = 'hidden';
          document.documentElement.style.overflow = 'hidden';
          
          // Force browser to recognize the change
          void document.body.offsetHeight;
          
          // After a short delay, restore scrolling at the top position
          setTimeout(() => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            window.scrollTo(0, 0);
          }, 10);
        }
      };
      
      // Execute immediately
      forceScrollToTop();
      
      // Then multiple times with different timing approaches
      setTimeout(forceScrollToTop, 0);
      setTimeout(forceScrollToTop, 50);
      setTimeout(forceScrollToTop, 100);
      setTimeout(forceScrollToTop, 300);
      
      // Also use requestAnimationFrame for precise timing with render cycle
      requestAnimationFrame(() => {
        requestAnimationFrame(forceScrollToTop);
      });
      
      // Update the reference to current location
      prevLocationRef.current = location;
    }
  }, [location]);
  
  // Apply native lazy loading to images once mounted
  useEffect(() => {
    // Set native lazy loading on non-critical images
    const images = document.querySelectorAll('img:not(.critical-image):not([loading])');
    images.forEach(img => {
      if (img instanceof HTMLImageElement) {
        img.loading = 'lazy';
      }
    });
    
    // Add viewport height fix for mobile browsers (particularly iOS Safari)
    function setViewportHeight() {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
    
    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      {/* Enterprise-level SEO and performance will be added incrementally to prevent errors */}
      
      {/* Generate comprehensive sitemaps */}
      <SiteMapGenerator 
        baseUrl={websiteUrl}
        enableXml={true}
        enableRss={true}
        enableHTML={true}
        priorityMap={{
          home: 1.0,
          properties: 0.9,
          propertyDetail: 0.8,
          neighborhoods: 0.8,
          neighborhoodDetail: 0.7,
          about: 0.6,
          contact: 0.5
        }}
        changeFreqMap={{
          home: 'weekly',
          properties: 'daily',
          propertyDetail: 'weekly',
          neighborhoods: 'weekly',
          neighborhoodDetail: 'monthly',
          about: 'monthly',
          contact: 'monthly'
        }}
      />
      
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <ErrorBoundary>
            <FavoritesProvider>
              {/* Global header */}
              <Header />
              
              {/* Main content with layout wrapper */}
              <Layout>
                {/* Use Suspense for route-based code splitting */}
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center transform-gpu">
                  <div className="animate-pulse text-primary">Loading...</div>
                </div>}>
                  <Switch>
                    <Route path="/">
                      {() => {
                        return (
                          <>
                            <ScrollToTop />
                            <ErrorBoundary>
                              <Home />
                            </ErrorBoundary>
                          </>
                        );
                      }}
                    </Route>
                    <Route path="/properties">
                      {() => {
                        return (
                          <>
                            <ScrollToTop />
                            <ErrorBoundary>
                              <Properties />
                            </ErrorBoundary>
                          </>
                        );
                      }}
                    </Route>
                    <Route path="/properties/:id">
                      {(params) => {
                        return (
                          <>
                            <ScrollToTop />
                            <ErrorBoundary>
                              <PropertyDetails id={parseInt(params.id)} />
                            </ErrorBoundary>
                          </>
                        );
                      }}
                    </Route>
                    <Route path="/neighborhoods">
                      {() => {
                        return (
                          <>
                            <ScrollToTop />
                            <ErrorBoundary>
                              <Neighborhoods />
                            </ErrorBoundary>
                          </>
                        );
                      }}
                    </Route>
                    <Route path="/neighborhoods/:id">
                      {(params) => {
                        return (
                          <>
                            <ScrollToTop />
                            <ErrorBoundary>
                              <NeighborhoodDetails id={parseInt(params.id)} />
                            </ErrorBoundary>
                          </>
                        );
                      }}
                    </Route>
                    <Route path="/about">
                      {() => {
                        return (
                          <>
                            <ScrollToTop />
                            <ErrorBoundary>
                              <About />
                            </ErrorBoundary>
                          </>
                        );
                      }}
                    </Route>
                    <Route path="/contact">
                      {() => {
                        return (
                          <>
                            <ScrollToTop />
                            <ErrorBoundary>
                              <Contact />
                            </ErrorBoundary>
                          </>
                        );
                      }}
                    </Route>
                    <Route path="/favorites">
                      {() => {
                        return (
                          <>
                            <ScrollToTop />
                            <ErrorBoundary>
                              <Favorites />
                            </ErrorBoundary>
                          </>
                        );
                      }}
                    </Route>
                    <Route>
                      {() => {
                        return (
                          <>
                            <ScrollToTop />
                            <ErrorBoundary>
                              <NotFound />
                            </ErrorBoundary>
                          </>
                        );
                      }}
                    </Route>
                </Switch>
                </Suspense>
              </Layout>
              
              {/* Global footer */}
              <Footer />
              
              {/* Floating scroll to top button - always accessible on mobile */}
              <ScrollToTopButton />
            </FavoritesProvider>
          </ErrorBoundary>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
