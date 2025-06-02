import { Neighborhood } from "@shared/schema";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import northLaredoImg from "../../assets/north-laredo-industrial-park.png";
import downtownLaredoImg from "../../assets/downtown-laredo.png";
import delMarImg from "../../assets/del-mar.png";
import southLaredoImg from "../../assets/south-laredo.png";

interface NeighborhoodCardProps {
  neighborhood: Neighborhood;
}

export default function NeighborhoodCard({ neighborhood }: NeighborhoodCardProps) {
  // Simple theme detection as fallback
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [, navigate] = useLocation();
  
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
    <div 
      className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg overflow-hidden shadow-md group mobile-optimized transform-gpu cursor-pointer`} 
      style={{ backfaceVisibility: 'hidden' }}
      onClick={() => {
        // Reset scroll position before navigation (most reliable way)
        const resetScroll = () => {
          console.log("Forcing scroll reset before neighborhood navigation");
          // Force all scrollable elements to top
          window.scrollTo(0, 0);
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
          
          // Reset position of any scrollable containers
          const scrollableElements = document.querySelectorAll('.scrollable, main, section, .overflow-auto, .overflow-y-auto');
          scrollableElements.forEach(el => {
            if (el instanceof HTMLElement) {
              el.scrollTop = 0;
            }
          });
          
          // Mobile-specific fixes
          if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            setTimeout(() => {
              document.body.style.overflow = '';
              document.documentElement.style.overflow = '';
              window.scrollTo(0, 0);
            }, 5);
          }
        };
        
        // Apply scroll reset before navigation
        resetScroll();
        
        // Add multiple attempts with various timing approaches
        setTimeout(resetScroll, 0);
        requestAnimationFrame(() => {
          requestAnimationFrame(resetScroll);
        });
        
        // Then navigate
        navigate(`/neighborhoods/${neighborhood.id}`);
      }}
    >
      <div className="h-40 sm:h-48 overflow-hidden relative bg-slate-100 dark:bg-slate-700">
        {neighborhood.name === "North Laredo" ? (
          <img 
            src={northLaredoImg} 
            alt={neighborhood.name} 
            className="w-full h-full object-contain bg-white p-2 group-hover:scale-105 transition duration-500 transform-gpu"
            loading="lazy"
            style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
          />
        ) : neighborhood.name === "Downtown Laredo" ? (
          <img 
            src={downtownLaredoImg} 
            alt={neighborhood.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500 transform-gpu"
            loading="lazy"
            style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
            onError={(e) => {
              // Fallback for downtown Laredo image
              (e.target as HTMLImageElement).src = "https://placehold.co/600x400/8B5A2B/white?text=Downtown+Laredo";
              (e.target as HTMLImageElement).alt = "Downtown Laredo - Historic District";
            }}
          />
        ) : neighborhood.name === "Del Mar" ? (
          <img 
            src={delMarImg} 
            alt={neighborhood.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500 transform-gpu"
            loading="lazy"
            style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
          />
        ) : neighborhood.name === "South Laredo" ? (
          <img 
            src={southLaredoImg} 
            alt={neighborhood.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500 transform-gpu"
            loading="lazy"
            style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
          />
        ) : neighborhood.image ? (
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
        <div 
          className="flex items-center text-primary font-medium hover:text-primary-dark active:scale-95 transition-transform transform-gpu"
          style={{ touchAction: 'manipulation' }}
        >
          <span className="text-sm sm:text-base">Learn More</span>
          <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
        </div>
      </div>
    </div>
  );
}
