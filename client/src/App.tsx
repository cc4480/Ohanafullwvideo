import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
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
import PerformanceOptimizer from "@/components/common/PerformanceOptimizer";
import SiteMapGenerator from "@/components/SiteMapGenerator";
import ScrollToTop from "@/components/ScrollToTop"; // Import our enhanced ScrollToTop component
import ScrollToTopButton from "@/components/ScrollToTopButton"; // Import the floating scroll-to-top button

function App() {
  // Main App component with fixed background parallax effects and performance optimizations
  
  // Base URL for the website - used for SEO components and sitemap generation
  const websiteUrl = "https://ohanarealty.com";
  
  return (
    <QueryClientProvider client={queryClient}>
      {/* Apply performance optimizations globally */}
      <PerformanceOptimizer />
      
      {/* Enterprise-grade SEO: Sitemap Generator */}
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
