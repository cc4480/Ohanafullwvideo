import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import PropertyCard from "./PropertyCard";
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
    <section id="properties" className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Featured Properties</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Discover our exclusive selection of premium properties in Laredo, Texas, 
            handpicked by Valentin Cuellar.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            loadingPlaceholders.map((placeholder) => (
              <div key={placeholder.id} className="bg-white rounded-lg shadow-md p-4 h-96 animate-pulse">
                <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
                <div className="bg-gray-200 h-6 rounded-md w-3/4 mb-2"></div>
                <div className="bg-gray-200 h-4 rounded-md w-1/2 mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="bg-gray-200 h-8 rounded-md w-12"></div>
                  <div className="bg-gray-200 h-8 rounded-md w-12"></div>
                  <div className="bg-gray-200 h-8 rounded-md w-12"></div>
                </div>
                <div className="bg-gray-200 h-10 rounded-md"></div>
              </div>
            ))
          ) : (
            properties?.slice(0, 3).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          )}
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/properties">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              View All Properties
              <i className='bx bx-right-arrow-alt ml-2'></i>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
