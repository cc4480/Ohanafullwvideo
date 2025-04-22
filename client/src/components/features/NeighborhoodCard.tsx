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
    <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg overflow-hidden shadow-md group mobile-optimized transform-gpu`} style={{ backfaceVisibility: 'hidden' }}>
      <div className="h-40 sm:h-48 overflow-hidden relative bg-slate-100 dark:bg-slate-700">
        {neighborhood.image ? (
          <img 
            src={neighborhood.image} 
            alt={neighborhood.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500 transform-gpu"
            loading="lazy"
            style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
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
      <div className="p-4 sm:p-6">
        <h3 className={`font-serif text-lg sm:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-foreground'} mb-1 sm:mb-2 line-clamp-1`}>
          {neighborhood.name}
        </h3>
        <p className={`${isDarkMode ? 'text-slate-300' : 'text-muted-foreground'} mb-3 sm:mb-4 text-sm sm:text-base line-clamp-2`}>
          {neighborhood.description}
        </p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          {neighborhood.features?.map((feature, index) => (
            <span 
              key={index} 
              className={`${isDarkMode 
                ? 'bg-slate-700 text-slate-200' 
                : 'bg-neutral-100 text-neutral-700'} 
                text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full`}
            >
              {feature}
            </span>
          ))}
        </div>
        <a 
          href="#" 
          className="flex items-center text-primary font-medium hover:text-primary-dark active:scale-95 transition-transform transform-gpu"
          style={{ touchAction: 'manipulation' }}
        >
          <span className="text-sm sm:text-base">Learn More</span>
          <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
        </a>
      </div>
    </div>
  );
}
