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
    <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <Link href={`/properties/${property.id}`}>
        <div className="relative">
          <img 
            src={property.images[0]} 
            alt={property.address} 
            className="property-card-img w-full"
          />
          <div className="absolute top-4 left-4">
            <span className={`text-white text-sm font-medium px-3 py-1 rounded-full ${
              property.type === "RESIDENTIAL" ? "bg-secondary" : "bg-primary"
            }`}>
              {property.type === "RESIDENTIAL" ? "Residential" : 
               property.type === "COMMERCIAL" ? "Commercial" : "Land"}
            </span>
          </div>
          <div className="absolute bottom-4 right-4">
            <button 
              className={`${
                isFavorited 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-background text-primary'
              } p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition`}
              onClick={toggleFavorite}
              aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <i className={`bx ${isFavorited ? 'bxs-heart' : 'bx-heart'} text-xl`}></i>
            </button>
          </div>
        </div>
      </Link>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif text-xl font-bold text-foreground">
            {property.address}
          </h3>
          <p className="text-secondary font-bold">
            {formatPrice(property.price)}
          </p>
        </div>
        <p className="text-muted-foreground mb-4">
          {property.city}, {property.state} {property.zipCode}
        </p>
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
          <Button className="w-full">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
}
