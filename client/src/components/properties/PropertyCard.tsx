import { Link } from "wouter";
import { useState, useEffect } from "react";
import { Property } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  // Simple theme detection as fallback
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  
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
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.id);
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  return (
    <div className={`property-card ${isDarkMode ? 'bg-slate-800' : 'bg-card'} rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 card-hover-effect border border-border/30 mobile-optimized group w-full hover:-translate-y-1`}>
      <Link href={`/properties/${property.id}`} onClick={() => {
        console.log("Resetting scroll position for property navigation");
        
        // Exhaustive scroll reset function for maximum reliability
        const resetScroll = () => {
          // Apply all known scroll reset techniques
          window.scrollTo(0, 0);
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
          
          // Reset all scrollable elements
          const scrollableElements = document.querySelectorAll('main, section, .scrollable, .overflow-auto, .overflow-y-auto');
          scrollableElements.forEach(el => {
            if (el instanceof HTMLElement) {
              el.scrollTop = 0;
            }
          });
          
          // Mobile-specific handling
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
        
        // Apply multiple approaches for maximum reliability
        resetScroll();
        setTimeout(resetScroll, 0);
        requestAnimationFrame(() => {
          requestAnimationFrame(resetScroll);
        });
      }}>
        <div className="relative overflow-hidden h-52 sm:h-52 bg-slate-100 dark:bg-slate-700 transform-gpu">
          {property.images && Array.isArray(property.images) && property.images.length > 0 ? (
            <img 
              src={property.images[0]} 
              alt={property.address} 
              className="property-card-img w-full h-full object-cover transform-gpu transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              onError={(e) => {
                // Fallback for failed images
                (e.target as HTMLImageElement).src = "https://placehold.co/600x400/slate/white?text=Ohana+Realty";
                (e.target as HTMLImageElement).alt = "Image not available";
              }}
              style={{
                willChange: 'transform',
                backfaceVisibility: 'hidden'
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-muted-foreground">No image available</span>
            </div>
          )}
          
          {/* Enhanced overlay gradient with shimmering effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/5 after:to-transparent after:translate-x-[-100%] group-hover:after:translate-x-[100%] after:transition-transform after:duration-1000 after:ease-in-out overflow-hidden"></div>
          
          {/* Property type badge - slides in from top, larger touch target on mobile */}
          <div className="absolute top-4 left-4 z-10 transition-transform duration-500 transform-gpu translate-y-0 group-hover:-translate-y-1">
            <span className={`text-white text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm ${
              property.type === "RESIDENTIAL" ? "bg-secondary" : "bg-primary"
            }`}>
              {property.type === "RESIDENTIAL" ? "Residential" : 
               property.type === "COMMERCIAL" ? "Commercial" : "Land"}
            </span>
          </div>
          
          {/* Favorite button - bounces slightly on hover, larger touch target on mobile */}
          <div className="absolute bottom-4 right-4 z-10 transition-transform duration-300 transform-gpu group-hover:scale-110">
            <button 
              type="button"
              className={`${
                isFavorite(property.id) 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-background/80 text-primary backdrop-blur-sm'
              } p-2.5 sm:p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(property.id);
              }}
              aria-label={isFavorite(property.id) ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`h-5 w-5 ${isFavorite(property.id) ? 'fill-current' : ''}`} />
            </button>
          </div>
          
          {/* Price tag - slides in from bottom, more visible on mobile */}
          <div className="absolute bottom-4 left-4 z-10 transition-transform duration-500 transform-gpu translate-y-0 group-hover:-translate-y-1">
            <div className="bg-primary/90 text-white font-bold px-3 py-1.5 rounded-md shadow-lg backdrop-blur-sm text-sm sm:text-base">
              {formatPrice(property.price)}
            </div>
          </div>
          
          {/* View details overlay - appears on hover (hidden on mobile touch) */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-5 pointer-events-none">
            <div className="bg-primary/90 text-white px-4 py-2 rounded-md shadow-lg transform-gpu translate-y-4 group-hover:translate-y-0 transition-transform duration-500 font-medium flex items-center">
              <span>View Details</span>
              <i className='bx bx-right-arrow-alt ml-2'></i>
            </div>
          </div>
          
          {/* Mobile-specific touch indicator - always visible on small screens */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 sm:hidden flex items-end justify-center pb-12">
            <div className="bg-primary/80 text-white px-3 py-1 rounded-full text-xs shadow-lg backdrop-blur-sm flex items-center animate-pulse">
              <span>Tap to view details</span>
            </div>
          </div>
        </div>
      </Link>
      <div className="p-4 sm:p-6 relative transform-gpu">
        {/* Animated corner decoration */}
        <div className="absolute top-0 right-0 w-10 sm:w-12 h-10 sm:h-12 overflow-hidden">
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-primary/10 rotate-45 transform-gpu origin-bottom-left group-hover:bg-primary/20 transition-colors duration-500"></div>
        </div>
        
        <div className="flex flex-col mb-2">
          <h3 className={`font-serif text-base sm:text-lg md:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-foreground'} group-hover:text-primary transition-colors duration-300 line-clamp-1`}>
            {property.address}
          </h3>
          <p className={`text-xs sm:text-sm md:text-base ${isDarkMode ? 'text-slate-300' : 'text-muted-foreground'} transition-colors duration-300`}>
            {property.city}, {property.state} {property.zipCode}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 text-xs sm:text-sm md:text-base">
          {property.type === "RESIDENTIAL" && property.bedrooms && (
            <div className={`flex items-center ${isDarkMode ? 'text-white' : 'text-foreground'} transition-transform duration-500 transform-gpu group-hover:scale-105`}>
              <span className="bg-primary/10 p-1 sm:p-1.5 rounded-full mr-1 sm:mr-2 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-500">
                <i className='bx bx-bed text-primary text-sm sm:text-base md:text-lg'></i>
              </span>
              <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
            </div>
          )}
          {property.type === "RESIDENTIAL" && property.bathrooms && (
            <div className={`flex items-center ${isDarkMode ? 'text-white' : 'text-foreground'} transition-transform duration-500 transform-gpu group-hover:scale-105 group-hover:delay-75`}>
              <span className="bg-primary/10 p-1 sm:p-1.5 rounded-full mr-1 sm:mr-2 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-500">
                <i className='bx bx-bath text-primary text-sm sm:text-base md:text-lg'></i>
              </span>
              <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
          )}
          {property.squareFeet && (
            <div className={`flex items-center ${isDarkMode ? 'text-white' : 'text-foreground'} transition-transform duration-500 transform-gpu group-hover:scale-105 group-hover:delay-100`}>
              <span className="bg-primary/10 p-1 sm:p-1.5 rounded-full mr-1 sm:mr-2 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-500">
                <i className='bx bx-area text-primary text-sm sm:text-base md:text-lg'></i>
              </span>
              <span>{property.squareFeet.toLocaleString()} sq. ft.</span>
            </div>
          )}
          {property.type === "COMMERCIAL" && (
            <div className={`flex items-center ${isDarkMode ? 'text-white' : 'text-foreground'} transition-transform duration-500 transform-gpu group-hover:scale-105`}>
              <span className="bg-primary/10 p-1 sm:p-1.5 rounded-full mr-1 sm:mr-2 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-500">
                <i className='bx bx-building text-primary text-sm sm:text-base md:text-lg'></i>
              </span>
              <span>Commercial</span>
            </div>
          )}
        </div>
        <Link href={`/properties/${property.id}`} className="block w-full" onClick={() => {
          console.log("Resetting scroll position for property details button");
          
          // Exhaustive scroll reset function
          const resetScroll = () => {
            window.scrollTo(0, 0);
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            
            // Reset all scrollable elements
            const scrollableElements = document.querySelectorAll('main, section, .scrollable, .overflow-auto, .overflow-y-auto');
            scrollableElements.forEach(el => {
              if (el instanceof HTMLElement) {
                el.scrollTop = 0;
              }
            });
            
            // Mobile-specific handling
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
          
          // Apply multiple approaches for maximum reliability
          resetScroll();
          setTimeout(resetScroll, 0);
          requestAnimationFrame(() => {
            requestAnimationFrame(resetScroll);
          });
        }}>
          <Button 
            className="w-full h-12 sm:h-10 md:h-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-500 shadow-md hover:shadow-lg group-hover:shadow-lg mobile-optimized overflow-hidden relative"
            style={{ touchAction: 'manipulation' }}
          >
            <div className="absolute inset-0 w-full h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
            <span className="text-sm sm:text-base relative z-10">View Details</span>
            <i className='bx bx-right-arrow-alt ml-2 transform-gpu transition-transform duration-500 group-hover:translate-x-2 relative z-10'></i>
          </Button>
        </Link>
      </div>
    </div>
  );
}
