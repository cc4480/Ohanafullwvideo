import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import PropertyCard from "@/components/properties/PropertyCard";
import { Property } from "@shared/schema";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import SEOHead from "@/components/SEOHead";

export default function Properties() {
  const [propertyType, setPropertyType] = useState<string>("All");
  const [priceRange, setPriceRange] = useState<string>("Any");
  const [searchText, setSearchText] = useState<string>("");
  
  // Ensure we scroll to the top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });
  
  // Filter properties based on selected filters
  const filteredProperties = properties?.filter(property => {
    // Filter by property type
    if (propertyType !== "All" && property.type !== propertyType) {
      return false;
    }
    
    // Filter by price range
    if (priceRange !== "Any") {
      const [min, max] = priceRange.split('-').map(p => parseInt(p.replace(/\D/g, '')));
      if (property.price < min || (max && property.price > max)) {
        return false;
      }
    }
    
    // Filter by search text
    if (searchText && !property.address.toLowerCase().includes(searchText.toLowerCase()) &&
        !property.city.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  return (
    <>
      <SEOHead 
        title="Properties"
        description="Browse our extensive collection of properties for sale in Laredo, TX. Find residential homes, commercial properties, and land with our easy-to-use search filters."
        canonicalUrl="/properties"
      />
      <div className="min-h-screen">
        <div className="bg-primary text-white py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 transform-gpu">
              Explore Our Properties
            </h1>
            <p className="text-neutral-100 text-base sm:text-lg max-w-3xl">
              Browse our exclusive selection of premium properties in Laredo, Texas. 
              Use the filters below to find your perfect match.
            </p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Filters */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8 -mt-10 sm:-mt-12 relative z-10 mobile-optimized">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-neutral-800 dark:text-white mb-4 sm:mb-6">Find Your Perfect Property</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-1">Property Type</label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="w-full h-10 sm:h-auto">
                    <SelectValue placeholder="All Properties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Properties</SelectItem>
                    <SelectItem value="RESIDENTIAL">Residential</SelectItem>
                    <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                    <SelectItem value="LAND">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-1">Price Range</label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="w-full h-10 sm:h-auto">
                    <SelectValue placeholder="Any Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any">Any Price</SelectItem>
                    <SelectItem value="100000-200000">$100k - $200k</SelectItem>
                    <SelectItem value="200000-300000">$200k - $300k</SelectItem>
                    <SelectItem value="300000-500000">$300k - $500k</SelectItem>
                    <SelectItem value="500000+">$500k+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-1">Location</label>
                <Input 
                  type="text" 
                  placeholder="Enter neighborhood or address" 
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="h-10 sm:h-auto"
                  style={{ touchAction: 'manipulation' }}
                />
              </div>
            </div>
          </div>
          
          <Separator className="my-6 sm:my-8" />
          
          {/* Results */}
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-neutral-800 dark:text-white">
              {isLoading ? 'Loading properties...' : 
                filteredProperties?.length 
                  ? `${filteredProperties.length} Properties Found` 
                  : 'No Properties Found'}
            </h2>
            <Link href="/">
              <Button variant="outline" className="h-9 sm:h-10 transform-gpu active:scale-95 transition-transform">
                <i className="bx bx-arrow-back mr-1 sm:mr-2"></i>
                <span className="text-sm sm:text-base">Back to Home</span>
              </Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 h-[340px] sm:h-96 animate-pulse mobile-optimized">
                  <div className="bg-gray-200 dark:bg-slate-700 h-40 sm:h-48 rounded-md mb-4"></div>
                  <div className="bg-gray-200 dark:bg-slate-700 h-5 sm:h-6 rounded-md w-3/4 mb-2"></div>
                  <div className="bg-gray-200 dark:bg-slate-700 h-4 rounded-md w-1/2 mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="bg-gray-200 dark:bg-slate-700 h-7 sm:h-8 rounded-md w-10 sm:w-12"></div>
                    <div className="bg-gray-200 dark:bg-slate-700 h-7 sm:h-8 rounded-md w-10 sm:w-12"></div>
                    <div className="bg-gray-200 dark:bg-slate-700 h-7 sm:h-8 rounded-md w-10 sm:w-12"></div>
                  </div>
                  <div className="bg-gray-200 dark:bg-slate-700 h-9 sm:h-10 rounded-md"></div>
                </div>
              ))}
            </div>
          ) : filteredProperties?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 sm:py-16 mobile-optimized">
              <i className="bx bx-search-alt text-5xl sm:text-6xl text-gray-300 dark:text-gray-600"></i>
              <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 mt-4">No properties match your search criteria.</p>
              <p className="text-sm sm:text-base text-gray-400 dark:text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
              <Button 
                className="mt-6 h-10 transform-gpu bg-primary text-white hover:brightness-110 active:scale-95 transition-transform shadow-md" 
                onClick={() => {
                  setPropertyType("All");
                  setPriceRange("Any");
                  setSearchText("");
                }}
              >
                <i className="bx bx-reset mr-2"></i>
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}