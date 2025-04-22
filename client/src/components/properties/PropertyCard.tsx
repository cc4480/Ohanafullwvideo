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
    <div className={`property-card ${isDarkMode ? 'bg-slate-800' : 'bg-card'} rounded-lg overflow-hidden shadow-lg transition-all duration-500 card-hover-effect card-accent-top border border-border/30 mobile-optimized group`}
      style={{
        boxShadow: 'var(--card-shadow)',
      }}>
      <Link href={`/properties/${property.id}`} onClick={() => window.scrollTo(0, 0)}>
        <div className="relative overflow-hidden h-48 sm:h-52 bg-slate-100 dark:bg-slate-700 transform-gpu">
          {property.images && property.images.length > 0 ? (
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
          
          {/* Enhanced overlay gradient with smoother transition */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60 group-hover:opacity-75 transition-opacity duration-500"></div>
          
          {/* Property type badge - enhanced with premium effect */}
          <div className="absolute top-4 left-4 z-10 transition-all duration-500 transform-gpu translate-y-0 group-hover:-translate-y-1 group-hover:scale-105">
            <span className={`text-white text-sm font-medium px-3 py-1 rounded-full shadow-lg backdrop-blur-sm highlight-pulse ${
              property.type === "RESIDENTIAL" ? "bg-secondary" : "bg-primary"
            }`}>
              {property.type === "RESIDENTIAL" ? "Residential" : 
               property.type === "COMMERCIAL" ? "Commercial" : "Land"}
            </span>
          </div>
          
          {/* Favorite button - enhanced with premium effect */}
          <div className="absolute bottom-4 right-4 z-10 transition-all duration-300 transform-gpu group-hover:scale-110">
            <button 
              type="button"
              className={`${
                isFavorite(property.id) 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-background/80 text-primary backdrop-blur-sm'
              } p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg button-premium`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(property.id);
              }}
              aria-label={isFavorite(property.id) ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`h-5 w-5 ${isFavorite(property.id) ? 'fill-current' : ''} ${isFavorite(property.id) ? 'animate-pulse' : ''}`} />
            </button>
          </div>
          
          {/* Price tag - enhanced with premium effect */}
          <div className="absolute bottom-4 left-4 z-10 transition-all duration-500 transform-gpu translate-y-0 group-hover:-translate-y-1 group-hover:scale-105">
            <div className="bg-primary/90 text-white font-bold px-3 py-1.5 rounded-md shadow-lg backdrop-blur-sm glass-effect">
              {formatPrice(property.price)}
            </div>
          </div>
          
          {/* Enhanced view details overlay with better visual effect */}
          <div className="absolute inset-0 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-5 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-transparent">
            <div className="bg-primary/90 text-white px-4 py-2 rounded-md shadow-lg transform-gpu translate-y-4 group-hover:translate-y-0 transition-transform duration-500 font-medium flex items-center button-premium">
              <span>View Details</span>
              <i className='bx bx-right-arrow-alt ml-2 group-hover:animate-pulse'></i>
            </div>
          </div>
        </div>
      </Link>
      <div className="p-4 sm:p-6 relative transform-gpu">
        {/* Enhanced corner decoration with better visual effect */}
        <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rotate-45 transform-gpu origin-bottom-left group-hover:from-primary/30 group-hover:to-primary/10 transition-colors duration-500"></div>
        </div>
        
        <div className="flex flex-col mb-3">
          <h3 className={`font-serif text-lg sm:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-foreground'} group-hover:text-primary transition-colors duration-300 line-clamp-1 gradient-text`}>
            {property.address}
          </h3>
          <p className={`text-sm sm:text-base ${isDarkMode ? 'text-slate-300' : 'text-muted-foreground'} transition-colors duration-300`}>
            {property.city}, {property.state} {property.zipCode}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 text-sm sm:text-base">
          {property.type === "RESIDENTIAL" && property.bedrooms && (
            <div className={`flex items-center ${isDarkMode ? 'text-white' : 'text-foreground'} transition-all duration-500 transform-gpu group-hover:scale-105 group-hover:translate-x-1`}>
              <span className="bg-primary/10 p-1 sm:p-1.5 rounded-full mr-1 sm:mr-2 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-500">
                <i className='bx bx-bed text-primary text-base sm:text-lg'></i>
              </span>
              <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
            </div>
          )}
          {property.type === "RESIDENTIAL" && property.bathrooms && (
            <div className={`flex items-center ${isDarkMode ? 'text-white' : 'text-foreground'} transition-all duration-500 transform-gpu group-hover:scale-105 group-hover:translate-x-1 group-hover:delay-75`}>
              <span className="bg-primary/10 p-1 sm:p-1.5 rounded-full mr-1 sm:mr-2 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-500">
                <i className='bx bx-bath text-primary text-base sm:text-lg'></i>
              </span>
              <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
          )}
          {property.squareFeet && (
            <div className={`flex items-center ${isDarkMode ? 'text-white' : 'text-foreground'} transition-all duration-500 transform-gpu group-hover:scale-105 group-hover:translate-x-1 group-hover:delay-100`}>
              <span className="bg-primary/10 p-1 sm:p-1.5 rounded-full mr-1 sm:mr-2 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-500">
                <i className='bx bx-area text-primary text-base sm:text-lg'></i>
              </span>
              <span>{property.squareFeet.toLocaleString()} sq. ft.</span>
            </div>
          )}
          {property.type === "COMMERCIAL" && (
            <div className={`flex items-center ${isDarkMode ? 'text-white' : 'text-foreground'} transition-all duration-500 transform-gpu group-hover:scale-105 group-hover:translate-x-1`}>
              <span className="bg-primary/10 p-1 sm:p-1.5 rounded-full mr-1 sm:mr-2 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-500">
                <i className='bx bx-building text-primary text-base sm:text-lg'></i>
              </span>
              <span>Commercial</span>
            </div>
          )}
        </div>
        <Link href={`/properties/${property.id}`} className="block w-full" onClick={() => window.scrollTo(0, 0)}>
          <Button 
            className="w-full h-10 md:h-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-500 shadow-md hover:shadow-lg button-premium transform-gpu mobile-optimized overflow-hidden relative"
            style={{ touchAction: 'manipulation' }}
          >
            <span className="text-sm sm:text-base relative z-10">View Details</span>
            <i className='bx bx-right-arrow-alt ml-2 transform-gpu transition-transform duration-500 group-hover:translate-x-2 relative z-10'></i>
          </Button>
        </Link>
      </div>
    </div>
  );
}
