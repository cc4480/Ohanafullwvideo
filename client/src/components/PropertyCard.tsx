import { Link } from "wouter";
import { useState, useEffect } from "react";
import { Property } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  // Simple theme detection as fallback
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  
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
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Create a descriptive summary for screen readers
  const propertyTypeLabel = property.type === "RESIDENTIAL" ? "Residential" : 
                         property.type === "COMMERCIAL" ? "Commercial" : "Land";
  
  const bedroomsLabel = property.bedrooms 
    ? `${property.bedrooms} ${property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}` 
    : '';
  
  const bathroomsLabel = property.bathrooms 
    ? `${property.bathrooms} ${property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}` 
    : '';
  
  const sizeLabel = property.squareFeet 
    ? `${property.squareFeet.toLocaleString()} square feet` 
    : '';
  
  const features = [propertyTypeLabel, bedroomsLabel, bathroomsLabel, sizeLabel].filter(Boolean).join(', ');
  
  const accessibleDescription = `${property.address}, ${property.city}, ${property.state} ${property.zipCode}. ${features}. Priced at ${formatPrice(property.price)}.`;
  
  return (
    <article 
      className={`property-card ${isDarkMode ? 'bg-slate-800' : 'bg-card'} rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 card-hover-effect border border-border/30`}
      aria-labelledby={`property-${property.id}-title`}
    >
      <Link href={`/properties/${property.id}`} aria-describedby={`property-${property.id}-description`}>
        <div className="relative overflow-hidden h-48 bg-slate-100 dark:bg-slate-700">
          {property.images && property.images.length > 0 ? (
            <img 
              src={property.images[0]} 
              alt={`Property at ${property.address}`} 
              className="property-card-img w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                // Fallback for failed images
                (e.target as HTMLImageElement).src = "https://placehold.co/600x400/slate/white?text=Ohana+Realty";
                (e.target as HTMLImageElement).alt = "Property image not available";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" 
                 aria-label="No property image available">
              <span className="text-muted-foreground">No image available</span>
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" aria-hidden="true"></div>
          
          <div className="absolute top-4 left-4 z-10">
            <span 
              className={`text-white text-sm font-medium px-3 py-1 rounded-full shadow-md backdrop-blur-sm ${
                property.type === "RESIDENTIAL" ? "bg-secondary" : "bg-primary"
              }`}
              role="text" 
              aria-label={`${propertyTypeLabel} property`}
            >
              {propertyTypeLabel}
            </span>
          </div>
          
          <div className="absolute bottom-4 right-4 z-10">
            <button 
              className={`${
                isFavorited 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-background/80 text-primary backdrop-blur-sm'
              } p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg`}
              onClick={toggleFavorite}
              aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              aria-pressed={isFavorited}
            >
              <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} aria-hidden="true" />
            </button>
          </div>
          
          {/* Price tag */}
          <div className="absolute bottom-4 left-4 z-10">
            <div 
              className="bg-primary/90 text-white font-bold px-3 py-1.5 rounded-md shadow-lg backdrop-blur-sm"
              aria-label={`Price: ${formatPrice(property.price)}`}
            >
              {formatPrice(property.price)}
            </div>
          </div>
        </div>
      </Link>
      <div className="p-6 relative">
        {/* Subtle corner decoration - hide from screen readers */}
        <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-primary/10 rotate-45 transform origin-bottom-left"></div>
        </div>
        
        <div className="flex flex-col mb-2">
          <h3 
            id={`property-${property.id}-title`}
            className={`font-serif text-xl font-bold ${isDarkMode ? 'text-white' : 'text-foreground'} hover:text-primary transition-colors duration-300`}
          >
            {property.address}
          </h3>
          <p className={`${isDarkMode ? 'text-slate-300' : 'text-muted-foreground'}`}>
            {property.city}, {property.state} {property.zipCode}
          </p>
        </div>
        
        {/* Hidden but accessible complete description for screen readers */}
        <div className="sr-only" id={`property-${property.id}-description`}>
          {accessibleDescription}
        </div>
        
        <div className="flex flex-wrap gap-4 mb-4" aria-label="Property features">
          {property.type === "RESIDENTIAL" && property.bedrooms && (
            <div 
              className={`flex items-center ${isDarkMode ? 'text-white' : 'text-foreground'}`}
              aria-label={`${property.bedrooms} ${property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}`}
            >
              <span className="bg-primary/10 p-1.5 rounded-full mr-2 flex items-center justify-center" aria-hidden="true">
                <i className='bx bx-bed text-primary text-lg'></i>
              </span>
              <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
            </div>
          )}
          {property.type === "RESIDENTIAL" && property.bathrooms && (
            <div 
              className={`flex items-center ${isDarkMode ? 'text-white' : 'text-foreground'}`}
              aria-label={`${property.bathrooms} ${property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}`}
            >
              <span className="bg-primary/10 p-1.5 rounded-full mr-2 flex items-center justify-center" aria-hidden="true">
                <i className='bx bx-bath text-primary text-lg'></i>
              </span>
              <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
          )}
          {property.squareFeet && (
            <div 
              className={`flex items-center ${isDarkMode ? 'text-white' : 'text-foreground'}`}
              aria-label={`${property.squareFeet.toLocaleString()} square feet`}
            >
              <span className="bg-primary/10 p-1.5 rounded-full mr-2 flex items-center justify-center" aria-hidden="true">
                <i className='bx bx-area text-primary text-lg'></i>
              </span>
              <span>{property.squareFeet.toLocaleString()} sq. ft.</span>
            </div>
          )}
          {property.type === "COMMERCIAL" && (
            <div 
              className={`flex items-center ${isDarkMode ? 'text-white' : 'text-foreground'}`}
              aria-label="Commercial property"
            >
              <span className="bg-primary/10 p-1.5 rounded-full mr-2 flex items-center justify-center" aria-hidden="true">
                <i className='bx bx-building text-primary text-lg'></i>
              </span>
              <span>Commercial</span>
            </div>
          )}
        </div>
        <Link 
          href={`/properties/${property.id}`}
          aria-label={`View details for property at ${property.address}`}
        >
          <Button className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-300 shadow-md hover:shadow-lg group">
            <span>View Details</span>
            <i className='bx bx-right-arrow-alt ml-2 transform transition-transform duration-300 group-hover:translate-x-1' aria-hidden="true"></i>
          </Button>
        </Link>
      </div>
    </article>
  );
}
