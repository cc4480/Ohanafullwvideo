import { Neighborhood } from "@shared/schema";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

interface NeighborhoodCardProps {
  neighborhood: Neighborhood;
}

export default function NeighborhoodCard({ neighborhood }: NeighborhoodCardProps) {
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
  
  return (
    <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg overflow-hidden shadow-md group`}>
      <div className="h-48 overflow-hidden relative bg-slate-100 dark:bg-slate-700">
        {neighborhood.image ? (
          <img 
            src={neighborhood.image} 
            alt={neighborhood.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            loading="lazy"
            onError={(e) => {
              // Fallback for failed images
              (e.target as HTMLImageElement).src = "https://placehold.co/600x400/slate/white?text=Ohana+Realty";
              (e.target as HTMLImageElement).alt = "Image not available";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-700">
            <span className="text-muted-foreground">No image available</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-16"></div>
        <div className="absolute bottom-2 left-2">
          <span className={`bg-primary text-white text-xs px-2 py-1 rounded-sm`}>
            {neighborhood.features?.[0] || "Laredo"}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className={`font-serif text-xl font-bold ${isDarkMode ? 'text-white' : 'text-foreground'} mb-2`}>
          {neighborhood.name}
        </h3>
        <p className={`${isDarkMode ? 'text-slate-300' : 'text-muted-foreground'} mb-4`}>
          {neighborhood.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {neighborhood.features?.map((feature, index) => (
            <span 
              key={index} 
              className={`${isDarkMode 
                ? 'bg-slate-700 text-slate-200' 
                : 'bg-neutral-100 text-neutral-700'} 
                text-sm px-3 py-1 rounded-full`}
            >
              {feature}
            </span>
          ))}
        </div>
        <a href="#" className="flex items-center text-primary font-medium hover:text-primary-dark">
          Learn More
          <ArrowRight className="h-4 w-4 ml-1" />
        </a>
      </div>
    </div>
  );
}
