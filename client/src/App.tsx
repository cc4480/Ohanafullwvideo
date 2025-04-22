import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Properties from "@/pages/Properties";
import PropertyDetails from "@/pages/PropertyDetails";
import Neighborhoods from "@/pages/Neighborhoods";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Favorites from "@/pages/Favorites";
import NotFound from "@/pages/not-found";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import { FavoritesProvider } from "@/contexts/FavoritesContext";

// ScrollToTop component that watches for route changes
const ScrollToTop = () => {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]); // Dependency on location means this runs on every route change
  
  return null;
};

function App() {
  // Main App component with fixed background parallax effects

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <ErrorBoundary>
            <FavoritesProvider>
              {/* Global header */}
              <Header />
              
              {/* Main content with layout wrapper */}
              <Layout>
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
              </Layout>
              
              {/* Global footer */}
              <Footer />
            </FavoritesProvider>
          </ErrorBoundary>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
