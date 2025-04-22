import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Properties from "@/pages/Properties";
import PropertyDetails from "@/pages/PropertyDetails";
import NotFound from "@/pages/not-found";
import { ThemeProvider } from "@/components/ThemeProvider";
import AIAssistant from "@/components/AIAssistant";
import OhanaAssistantIcon from "@/components/OhanaAssistantIcon";

function App() {
  // Enhanced scroll to top with smooth behavior and page transition
  const ScrollToTop = () => {
    useEffect(() => {
      // Apply smooth scrolling with animation
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // Add transition class to body for smoother theme changes
      document.body.classList.add('theme-transition');
      
      return () => {
        document.body.classList.remove('theme-transition');
      };
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
                      <div className="animate-fade-in" style={{ animationDuration: '0.5s' }}>
                        <Home />
                      </div>
                    </>
                  );
                }}
              </Route>
              <Route path="/properties">
                {() => {
                  return (
                    <>
                      <ScrollToTop />
                      <div className="animate-fade-in" style={{ animationDuration: '0.5s' }}>
                        <Properties />
                      </div>
                    </>
                  );
                }}
              </Route>
              <Route path="/properties/:id">
                {(params) => {
                  return (
                    <>
                      <ScrollToTop />
                      <div className="animate-fade-in" style={{ animationDuration: '0.5s' }}>
                        <PropertyDetails id={parseInt(params.id)} />
                      </div>
                    </>
                  );
                }}
              </Route>
              <Route>
                {() => {
                  return (
                    <>
                      <ScrollToTop />
                      <div className="animate-fade-in" style={{ animationDuration: '0.5s' }}>
                        <NotFound />
                      </div>
                    </>
                  );
                }}
              </Route>
            </Switch>
            <Footer />
            <AIAssistant />
            <OhanaAssistantIcon />
          </>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
