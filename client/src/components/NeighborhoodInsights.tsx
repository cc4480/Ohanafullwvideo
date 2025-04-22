import { useQuery } from "@tanstack/react-query";
import { Neighborhood } from "@shared/schema";
import NeighborhoodCard from "./NeighborhoodCard";
import { useState, useEffect } from "react";

export default function NeighborhoodInsights() {
  // Simple theme detection as fallback
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Check for dark mode preference
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setIsDarkMode(isDark);
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);
  
  const { data: neighborhoods, isLoading } = useQuery<Neighborhood[]>({
    queryKey: ['/api/neighborhoods'],
  });
  
  // Create placeholder data for loading state
  const loadingPlaceholders = Array(3).fill(0).map((_, index) => ({
    id: index,
    isLoading: true
  }));
  
  return (
    <section className={`py-16 ${isDarkMode ? 'bg-background text-foreground' : 'bg-slate-50'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={`font-serif text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-foreground'} mb-4`}>
            Laredo Neighborhood Insights
          </h2>
          <p className={`${isDarkMode ? 'text-slate-300' : 'text-muted-foreground'} max-w-2xl mx-auto`}>
            Discover the unique character and amenities of Laredo's most desirable neighborhoods.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            loadingPlaceholders.map((placeholder) => (
              <div 
                key={placeholder.id} 
                className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-md p-4 h-80 animate-pulse`}
              >
                <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'} h-48 rounded-md mb-4`}></div>
                <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'} h-6 rounded-md w-1/2 mb-2`}></div>
                <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'} h-4 rounded-md w-3/4 mb-4`}></div>
                <div className="flex gap-2">
                  <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'} h-6 rounded-full w-20`}></div>
                  <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'} h-6 rounded-full w-16`}></div>
                </div>
              </div>
            ))
          ) : (
            neighborhoods?.map((neighborhood) => (
              <NeighborhoodCard key={neighborhood.id} neighborhood={neighborhood} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
