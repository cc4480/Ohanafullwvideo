import { Link } from "wouter";
import { useState } from "react";
import { Property } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  
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
  
  return (
    <div className="property-card bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 card-hover-effect border border-border/30">
      <Link href={`/properties/${property.id}`}>
        <div className="relative overflow-hidden">
          <img 
            src={property.images[0]} 
            alt={property.address} 
            className="property-card-img w-full"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
          
          <div className="absolute top-4 left-4 z-10">
            <span className={`text-white text-sm font-medium px-3 py-1 rounded-full shadow-md backdrop-blur-sm ${
              property.type === "RESIDENTIAL" ? "bg-secondary" : "bg-primary"
            } animate-fade-in`}>
              {property.type === "RESIDENTIAL" ? "Residential" : 
               property.type === "COMMERCIAL" ? "Commercial" : "Land"}
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
            >
              <i className={`bx ${isFavorited ? 'bxs-heart' : 'bx-heart'} text-xl ${isFavorited ? 'animate-scale-in' : ''}`}></i>
            </button>
          </div>
          
          {/* Price tag */}
          <div className="absolute bottom-4 left-4 z-10">
            <div className="bg-primary/90 text-white font-bold px-3 py-1.5 rounded-md shadow-lg backdrop-blur-sm">
              {formatPrice(property.price)}
            </div>
          </div>
        </div>
      </Link>
      <div className="p-6 relative">
        {/* Subtle corner decoration */}
        <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-primary/10 rotate-45 transform origin-bottom-left"></div>
        </div>
        
        <div className="flex flex-col mb-2">
          <h3 className="font-serif text-xl font-bold text-foreground hover:text-primary transition-colors duration-300">
            {property.address}
          </h3>
          <p className="text-muted-foreground">
            {property.city}, {property.state} {property.zipCode}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 mb-4">
          {property.type === "RESIDENTIAL" && property.bedrooms && (
            <div className="flex items-center text-foreground">
              <i className='bx bx-bed text-primary text-xl mr-2'></i>
              <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
            </div>
          )}
          {property.type === "RESIDENTIAL" && property.bathrooms && (
            <div className="flex items-center text-foreground">
              <i className='bx bx-bath text-primary text-xl mr-2'></i>
              <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
          )}
          {property.squareFeet && (
            <div className="flex items-center text-foreground">
              <i className='bx bx-area text-primary text-xl mr-2'></i>
              <span>{property.squareFeet.toLocaleString()} sq. ft.</span>
            </div>
          )}
          {property.type === "COMMERCIAL" && (
            <div className="flex items-center text-foreground">
              <i className='bx bx-building text-primary text-xl mr-2'></i>
              <span>Commercial</span>
            </div>
          )}
        </div>
        <Link href={`/properties/${property.id}`}>
          <Button className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-300 shadow-md hover:shadow-lg group">
            <span>View Details</span>
            <i className='bx bx-right-arrow-alt ml-2 transform transition-transform duration-300 group-hover:translate-x-1'></i>
          </Button>
        </Link>
      </div>
    </div>
  );
}
