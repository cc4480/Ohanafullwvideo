import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/properties/PropertyCard";
import { Property } from "@shared/schema";

export default function FeaturedProperties() {
  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });
  
  // Create placeholder data for loading state
  const loadingPlaceholders = Array(3).fill(0).map((_, index) => ({
    id: index,
    isLoading: true
  }));
  
  return (
    <section id="featured-properties" className="py-16 bg-background" aria-labelledby="featured-properties-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 id="featured-properties-heading" className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Properties
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our exclusive selection of premium properties in Laredo, Texas, 
            handpicked by Valentin Cuellar.
          </p>
        </div>
        
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
          aria-label="Featured property listings"
          role="region"
        >
          {isLoading ? (
            loadingPlaceholders.map((placeholder) => (
              <div 
                key={placeholder.id} 
                className="bg-card rounded-lg shadow-md p-4 h-96 animate-pulse"
                aria-hidden="true"
                aria-label="Loading property information"
              >
                <div className="bg-muted h-48 rounded-md mb-4"></div>
                <div className="bg-muted h-6 rounded-md w-3/4 mb-2"></div>
                <div className="bg-muted h-4 rounded-md w-1/2 mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="bg-muted h-8 rounded-md w-12"></div>
                  <div className="bg-muted h-8 rounded-md w-12"></div>
                  <div className="bg-muted h-8 rounded-md w-12"></div>
                </div>
                <div className="bg-muted h-10 rounded-md"></div>
              </div>
            ))
          ) : properties && properties.length > 0 ? (
            properties.slice(0, 3).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No featured properties available at this time.</p>
            </div>
          )}
        </div>
        
        {/* Visually hidden message that announces when properties are loaded */}
        {!isLoading && properties && properties.length > 0 && (
          <div className="sr-only" aria-live="polite">
            {properties.length} featured properties loaded successfully
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Link href="/properties">
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary hover:text-white"
              aria-label="View all available properties"
            >
              View All Properties
              <i className='bx bx-right-arrow-alt ml-2' aria-hidden="true"></i>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
