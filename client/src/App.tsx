import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import Properties from "@/pages/Properties";
import PropertyDetails from "@/pages/PropertyDetails";
import NotFound from "@/pages/not-found";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import AIAssistant from "@/components/AIAssistant";
import OhanaAssistantIcon from "@/components/assistant/OhanaAssistantIcon";

function App() {
  // Scroll to top on route change
  const ScrollToTop = () => {
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

    return null;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <>
            <Header />
            <Switch>
              <Route path="/">
                {() => {
                  return (
                    <>
                      <ScrollToTop />
                      <Home />
                    </>
                  );
                }}
              </Route>
              <Route path="/properties">
                {() => {
                  return (
                    <>
                      <ScrollToTop />
                      <Properties />
                    </>
                  );
                }}
              </Route>
              <Route path="/properties/:id">
                {(params) => {
                  return (
                    <>
                      <ScrollToTop />
                      <PropertyDetails id={parseInt(params.id)} />
                    </>
                  );
                }}
              </Route>
              <Route>
                {() => {
                  return (
                    <>
                      <ScrollToTop />
                      <NotFound />
                    </>
                  );
                }}
              </Route>
            </Switch>
            <Footer />
            <AIAssistant />
            {/* Add always visible backup chat icon for mobile - CRITICAL COMPONENT */}
            <OhanaAssistantIcon />
          </>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
