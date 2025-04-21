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

function Router() {
  // Scroll to top on route change
  const useScrollToTop = () => {
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

    return null;
  };

  return (
    <>
      <Header />
      <Switch>
        <Route path="/">
          {() => {
            useScrollToTop();
            return <Home />;
          }}
        </Route>
        <Route path="/properties">
          {() => {
            useScrollToTop();
            return <Properties />;
          }}
        </Route>
        <Route path="/properties/:id">
          {(params) => {
            useScrollToTop();
            return <PropertyDetails id={parseInt(params.id)} />;
          }}
        </Route>
        <Route>
          {() => {
            useScrollToTop();
            return <NotFound />;
          }}
        </Route>
      </Switch>
      <Footer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
