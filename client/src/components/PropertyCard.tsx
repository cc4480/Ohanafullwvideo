import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import { Property } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { gsap } from "gsap";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  // Simple theme detection as fallback
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  
  // Refs for animation targets
  const cardRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  
  // Setup animations
  useEffect(() => {
    const card = cardRef.current;
    const image = imageRef.current;
    const button = buttonRef.current;
    
    if (!card || !image || !button) return;
    
    // Create subtle hover animation
    const handleMouseEnter = () => {
      // Card lift effect
      gsap.to(card, {
        y: -8,
        scale: 1.01,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        duration: 0.4,
        ease: 'power2.out'
      });
      
      // Image subtle zoom
      gsap.to(image?.querySelector('img'), {
        scale: 1.08,
        duration: 0.6,
        ease: 'power1.out'
      });
      
      // Button glow effect
      gsap.to(button, {
        boxShadow: '0 0 15px rgba(var(--primary), 0.5)',
        duration: 0.4
      });
      
      // Price tag scale up
      if (priceRef.current) {
        gsap.to(priceRef.current, {
          scale: 1.08,
          duration: 0.3,
          ease: 'back.out'
        });
      }
      
      // Type badge animation
      if (typeRef.current) {
        gsap.to(typeRef.current, {
          y: -3,
          scale: 1.05,
          duration: 0.3,
          ease: 'power1.out'
        });
      }
      
      // Title color shift
      if (titleRef.current) {
        gsap.to(titleRef.current, {
          color: 'var(--primary)',
          duration: 0.3
        });
      }
    };
    
    // Reset animations on mouse leave
    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        duration: 0.4,
        ease: 'power2.out'
      });
      
      gsap.to(image?.querySelector('img'), {
        scale: 1,
        duration: 0.6,
        ease: 'power1.out'
      });
      
      gsap.to(button, {
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        duration: 0.4
      });
      
      if (priceRef.current) {
        gsap.to(priceRef.current, {
          scale: 1,
          duration: 0.3,
          ease: 'power1.inOut'
        });
      }
      
      if (typeRef.current) {
        gsap.to(typeRef.current, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power1.inOut'
        });
      }
      
      if (titleRef.current) {
        gsap.to(titleRef.current, {
          color: isDarkMode ? 'white' : 'var(--foreground)',
          duration: 0.3
        });
      }
    };
    
    // Add event listeners
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    // Clean up event listeners on unmount
    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDarkMode]);
  
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
      ref={cardRef}
      className={`property-card ${isDarkMode ? 'bg-slate-800' : 'bg-card'} rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 card-hover-effect border border-border/30`}
      aria-labelledby={`property-${property.id}-title`}
    >
      <Link href={`/properties/${property.id}`} aria-describedby={`property-${property.id}-description`}>
        <div 
          ref={imageRef}
          className="relative overflow-hidden h-48 bg-slate-100 dark:bg-slate-700"
        >
          {property.images && property.images.length > 0 ? (
            <img 
              src={property.images[0]} 
              alt={`Property at ${property.address}`} 
              className="property-card-img w-full h-full object-cover transform-gpu will-change-transform"
              loading="lazy"
              onError={(e) => {
                // Fallback for failed images
                (e.target as HTMLImageElement).src = "https://placehold.co/600x400/slate/white?text=Ohana+Realty";
                (e.target as HTMLImageElement).alt = "Property image not available";
              }}
              style={{ transformOrigin: 'center center' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" 
                 aria-label="No property image available">
              <span className="text-muted-foreground">No image available</span>
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" aria-hidden="true"></div>
          
          <div 
            ref={typeRef}
            className="absolute top-4 left-4 z-10"
          >
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
          <div 
            ref={priceRef}
            className="absolute bottom-4 left-4 z-10"
          >
            <div 
              className="bg-primary/90 text-white font-bold px-3 py-1.5 rounded-md shadow-lg backdrop-blur-sm will-change-transform"
              aria-label={`Price: ${formatPrice(property.price)}`}
              style={{ transformOrigin: 'center center' }}
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
            ref={titleRef}
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
        <div ref={buttonRef}>
          <Link 
            href={`/properties/${property.id}`}
            aria-label={`View details for property at ${property.address}`}
          >
            <Button className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-300 shadow-md hover:shadow-lg group will-change-transform">
              <span>View Details</span>
              <i className='bx bx-right-arrow-alt ml-2 transform transition-transform duration-300 group-hover:translate-x-1' aria-hidden="true"></i>
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
