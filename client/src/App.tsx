import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { queryClient } from "./lib/queryClient";
import { useLocation } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Layout from "@/components/layout/Layout";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { useMobile } from "@/hooks/use-mobile";
import AppLoading from "@/components/ui/app-loading";

// Use lazy loading for all pages to improve initial load performance
const Home = lazy(() => import("@/pages/Home"));
const Properties = lazy(() => import("@/pages/Properties"));
const PropertyDetails = lazy(() => import("@/pages/PropertyDetails"));
const Neighborhoods = lazy(() => import("@/pages/Neighborhoods"));
const NeighborhoodDetails = lazy(() => import("@/pages/NeighborhoodDetails"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Favorites = lazy(() => import("@/pages/Favorites"));
const AirbnbRentals = lazy(() => import("@/pages/AirbnbRentals"));
const AirbnbRentalDetails = lazy(() => import("@/pages/AirbnbRentalDetails"));
const VideoTest = lazy(() => import("@/pages/VideoTest"));
const VideoDebug = lazy(() => import("@/pages/VideoDebug"));
const SimpleVideo = lazy(() => import("@/pages/SimpleVideo"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Enhanced SEO Pages
const EnhancedNeighborhoodDemo = lazy(() => import("@/pages/EnhancedNeighborhoodDemo"));
const BacklinkManagement = lazy(() => import("@/pages/BacklinkManagement"));

// Import our $10,000 Enterprise-Grade SEO Solution
import SEODashboard from "@/components/SEODashboard";
import SchemaGraph from "@/components/SchemaGraph";
import { 
  createRealEstateBusinessEntity,
  createWebsiteEntity
} from "@/components/SchemaGraph";

// Logo - would be imported from your assets in a real implementation
const LOGO_URL = "https://ohanarealty.com/logo.png";

function App() {
  // Main App component with advanced optimizations and enterprise-grade SEO
  
  // Track app loading state to show loading screen
  const [isAppLoaded, setIsAppLoaded] = useState<boolean>(false);
  
  // Get current location for route change detection
  const [location] = useLocation();
  const prevLocationRef = useRef(location);
  
  // Initialize the mobile experience hook for mobile optimizations
  const { isMobile, isTouchDevice } = useMobile();
  
  // Base URL for the website - used for SEO components and sitemap generation
  const baseUrl = "https://ohanarealty.com";
  
  // Organization information for schema.org markup
  const organizationInfo = {
    name: "Ohana Realty",
    logo: LOGO_URL,
    address: "123 Main St, Laredo, TX 78040",
    phone: "+1 (956) 324-6714",
    email: "info@ohanarealty.com",
    sameAs: [
      "https://facebook.com/ohanarealty",
      "https://twitter.com/ohanarealty",
      "https://instagram.com/ohanarealty",
      "https://linkedin.com/company/ohanarealty"
    ],
    geo: {
      latitude: 27.5306,
      longitude: -99.4803
    }
  };
  
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
  
  // Add hardware acceleration CSS class to document root on mount
  // and initialize app loading state
  useEffect(() => {
    // Add hardware acceleration class to html and body elements for better performance
    document.documentElement.classList.add('hardware-accelerated');
    document.body.classList.add('hardware-accelerated');
    document.getElementById('root')?.classList.add('hardware-accelerated');
    
    // Set content-visibility for better paint performance and faster initial load
    const contentElements = document.querySelectorAll('main, section, article, footer');
    contentElements.forEach(element => {
      if (element instanceof HTMLElement) {
        element.style.contentVisibility = 'auto';
        element.style.containIntrinsicSize = 'auto';
      }
    });
    
    // Force hardware acceleration on key interactive elements
    const interactiveElements = document.querySelectorAll('button, a, .card, .property-card');
    interactiveElements.forEach(element => {
      if (element instanceof HTMLElement) {
        element.classList.add('transform-gpu');
      }
    });
    
    // Initialize app loading state
    const markAppAsLoaded = () => {
      // Wait for critical resources to load
      Promise.all([
        document.fonts.ready, 
        // Add a small delay for better UX
        new Promise(resolve => setTimeout(resolve, 800))
      ])
      .then(() => {
        // Mark app as loaded
        setIsAppLoaded(true);
      })
      .catch(error => {
        console.error('Error during app loading:', error);
        // Still mark as loaded if there's an error to prevent getting stuck
        setIsAppLoaded(true);
      });
    };
    
    // Start loading process
    if (document.readyState === 'complete') {
      markAppAsLoaded();
    } else {
      window.addEventListener('load', markAppAsLoaded);
    }
    
    return () => {
      // Cleanup if needed (though App component shouldn't unmount)
      document.documentElement.classList.remove('hardware-accelerated');
      document.body.classList.remove('hardware-accelerated');
      document.getElementById('root')?.classList.remove('hardware-accelerated');
      window.removeEventListener('load', markAppAsLoaded);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Show app loading screen while the app is initializing */}
      {!isAppLoaded && <AppLoading minimumDuration={1000} />}
      
      {/* $10,000 Enterprise-grade SEO Implementation */}
      {/* SEO Dashboard has been moved to a separate admin route */}
      
      {/* Sitemaps are now generated server-side */}
      
      {/* Schema Graph - Knowledge Graph Implementation */}
      <SchemaGraph
        baseUrl={baseUrl}
        entities={[
          // Website entity
          createWebsiteEntity(
            `${baseUrl}/#website`,
            "Ohana Realty",
            baseUrl,
            "Premier real estate agency in Laredo, Texas, offering residential and commercial properties.",
            `${baseUrl}/#organization`,
            ["en-US", "es-MX"],
            ["real estate", "homes", "properties", "Laredo", "Texas", "commercial", "residential"],
            new Date().getFullYear()
          ),
          
          // Organization entity
          createRealEstateBusinessEntity(
            `${baseUrl}/#organization`,
            organizationInfo.name,
            baseUrl,
            organizationInfo.logo,
            {
              streetAddress: "123 Main St",
              addressLocality: "Laredo",
              addressRegion: "TX",
              postalCode: "78040",
              addressCountry: "US"
            },
            organizationInfo.phone,
            organizationInfo.email,
            "Premier real estate agency in Laredo, Texas, offering personalized service for buying, selling, and investing in properties.",
            organizationInfo.geo,
            organizationInfo.sameAs,
            {
              name: "Valentin Cuellar",
              jobTitle: "Principal Broker",
              image: "/images/valentin-cuellar.jpg"
            }
          )
        ]}
      />
      
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <ErrorBoundary>
            <FavoritesProvider>
              {/* Global header */}
              <Header />
              
              {/* Main content with layout wrapper - add hardware acceleration */}
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
                    <Route path="/airbnb">
                      {() => {
                        return (
                          <>
                            <ScrollToTop />
                            <ErrorBoundary>
                              <AirbnbRentals />
                            </ErrorBoundary>
                          </>
                        );
                      }}
                    </Route>
                    <Route path="/airbnb/:id">
                      {(params) => {
                        return (
                          <>
                            <ScrollToTop />
                            <ErrorBoundary>
                              <AirbnbRentalDetails />
                            </ErrorBoundary>
                          </>
                        );
                      }}
                    </Route>
                    <Route path="/video-test">
                      {() => {
                        return (
                          <>
                            <ScrollToTop />
                            <ErrorBoundary>
                              <VideoTest />
                            </ErrorBoundary>
                          </>
                        );
                      }}
                    </Route>
                    <Route path="/video-debug">
                      {() => {
                        return (
                          <>
                            <ScrollToTop />
                            <ErrorBoundary>
                              <VideoDebug />
                            </ErrorBoundary>
                          </>
                        );
                      }}
                    </Route>
                    <Route path="/simple-video">
                      {() => {
                        return (
                          <>
                            <ScrollToTop />
                            <ErrorBoundary>
                              <SimpleVideo />
                            </ErrorBoundary>
                          </>
                        );
                      }}
                    </Route>
                    <Route path="/admin/seo">
                      {() => {
                        return (
                          <>
                            <ScrollToTop />
                            <ErrorBoundary>
                              <SEODashboard />
                            </ErrorBoundary>
                          </>
                        );
                      }}
                    </Route>
                    <Route path="/admin/backlinks">
                      {() => {
                        return (
                          <>
                            <ScrollToTop />
                            <ErrorBoundary>
                              <BacklinkManagement />
                            </ErrorBoundary>
                          </>
                        );
                      }}
                    </Route>
                    <Route path="/neighborhoods/enhanced-demo">
                      {() => {
                        return (
                          <>
                            <ScrollToTop />
                            <ErrorBoundary>
                              <EnhancedNeighborhoodDemo />
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
