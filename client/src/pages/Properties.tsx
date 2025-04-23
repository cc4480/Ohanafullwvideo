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
import { BreadcrumbStructuredData, FAQStructuredData } from "@/components/StructuredData";

export default function Properties() {
  const [propertyType, setPropertyType] = useState<string>("All");
  const [priceRange, setPriceRange] = useState<string>("Any");
  const [searchText, setSearchText] = useState<string>("");
  const [bedrooms, setBedrooms] = useState<string>("Any");
  const [bathrooms, setBathrooms] = useState<string>("Any");
  
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
    
    // Filter by bedrooms
    if (bedrooms !== "Any" && property.bedrooms) {
      const minBeds = parseInt(bedrooms.replace(/\D/g, ''));
      if (property.bedrooms < minBeds) {
        return false;
      }
    }
    
    // Filter by bathrooms
    if (bathrooms !== "Any" && property.bathrooms) {
      const minBaths = parseInt(bathrooms.replace(/\D/g, ''));
      if (property.bathrooms < minBaths) {
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
  
  const websiteUrl = "https://ohanarealty.com";

  return (
    <>
      <SEOHead 
        title="Laredo TX Properties For Sale | Homes, Commercial, Land | Ohana Realty"
        description="Explore premium Laredo real estate listings. Find residential homes, commercial properties, and land for sale. Use our advanced search filters to find your ideal property in Laredo, Texas."
        canonicalUrl="/properties"
        ogImage={`${websiteUrl}/og-image-properties.jpg`}
      />
      
      {/* Breadcrumb Structured Data */}
      <BreadcrumbStructuredData
        items={[
          {
            name: "Home",
            item: websiteUrl
          },
          {
            name: "Properties",
            item: `${websiteUrl}/properties`
          }
        ]}
      />
      
      {/* FAQ Structured Data */}
      <FAQStructuredData
        questions={[
          {
            question: "What types of properties does Ohana Realty offer?",
            answer: "Ohana Realty offers a diverse portfolio of properties in Laredo including residential homes, commercial buildings, and vacant land. Our residential listings include single-family homes, townhouses, and luxury properties, while our commercial options range from retail spaces to office buildings."
          },
          {
            question: "How can I filter properties by my specific requirements?",
            answer: "Our website provides powerful filtering tools that allow you to search by property type (residential, commercial, or land), price range, and location. You can also enter specific keywords to find properties with particular features or in specific neighborhoods of Laredo."
          },
          {
            question: "Are virtual tours available for Ohana Realty properties?",
            answer: "Yes, many of our property listings feature high-quality images and virtual tours. For properties without virtual tours, you can easily schedule an in-person viewing by contacting Valentin Cuellar directly through our website or by calling (956) 712-3000."
          },
          {
            question: "How often are new properties added to the Ohana Realty listings?",
            answer: "We update our property listings regularly, often adding new properties weekly. We recommend checking back frequently or signing up for our property alerts to be notified when new properties matching your criteria become available."
          },
          {
            question: "What price ranges are available for Laredo properties?",
            answer: "Ohana Realty offers properties across various price points to accommodate different budgets. Our listings range from affordable starter homes under $200,000 to luxury properties over $500,000, with commercial properties and land available at various price points as well."
          }
        ]}
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
          <div 
            className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-5 sm:p-6 mb-6 sm:mb-8 -mt-8 sm:-mt-12 relative z-10 mobile-optimized"
            role="search"
            aria-labelledby="property-filter-heading"
          >
            <h2 id="property-filter-heading" className="text-xl sm:text-2xl font-serif font-bold text-neutral-800 dark:text-white mb-4 sm:mb-6">
              Find Your Perfect Property
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-6">
              <div>
                <label htmlFor="property-type-select" className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-1">
                  Property Type
                </label>
                <Select value={propertyType} onValueChange={setPropertyType} name="property-type">
                  <SelectTrigger id="property-type-select" className="w-full h-10 sm:h-auto">
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
                <label htmlFor="price-range-select" className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-1">
                  Price Range
                </label>
                <Select value={priceRange} onValueChange={setPriceRange} name="price-range">
                  <SelectTrigger id="price-range-select" className="w-full h-10 sm:h-auto">
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
                <label htmlFor="location-search" className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-1">
                  Location
                </label>
                <Input 
                  id="location-search"
                  type="text" 
                  placeholder="Enter neighborhood or address" 
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="h-10 sm:h-auto"
                  style={{ touchAction: 'manipulation' }}
                  aria-label="Search by location or address"
                />
              </div>
              <div>
                <label htmlFor="bedrooms-select" className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-1">
                  Bedrooms
                </label>
                <Select value={bedrooms} onValueChange={setBedrooms} name="bedrooms">
                  <SelectTrigger id="bedrooms-select" className="w-full h-10 sm:h-auto">
                    <SelectValue placeholder="Any Bedrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any">Any Bedrooms</SelectItem>
                    <SelectItem value="1+">1+ Bedrooms</SelectItem>
                    <SelectItem value="2+">2+ Bedrooms</SelectItem>
                    <SelectItem value="3+">3+ Bedrooms</SelectItem>
                    <SelectItem value="4+">4+ Bedrooms</SelectItem>
                    <SelectItem value="5+">5+ Bedrooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="bathrooms-select" className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-1">
                  Bathrooms
                </label>
                <Select value={bathrooms} onValueChange={setBathrooms} name="bathrooms">
                  <SelectTrigger id="bathrooms-select" className="w-full h-10 sm:h-auto">
                    <SelectValue placeholder="Any Bathrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any">Any Bathrooms</SelectItem>
                    <SelectItem value="1+">1+ Bathrooms</SelectItem>
                    <SelectItem value="2+">2+ Bathrooms</SelectItem>
                    <SelectItem value="3+">3+ Bathrooms</SelectItem>
                    <SelectItem value="4+">4+ Bathrooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  className="w-full h-10 sm:h-auto border-primary text-primary hover:bg-primary hover:text-white"
                  onClick={() => {
                    setPropertyType("All");
                    setPriceRange("Any");
                    setSearchText("");
                    setBedrooms("Any");
                    setBathrooms("Any");
                  }}
                >
                  <i className="bx bx-reset mr-2"></i>
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
          
          <Separator className="my-6 sm:my-8" />
          
          {/* Results */}
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <h2 
              id="properties-results-heading" 
              className="text-xl sm:text-2xl font-serif font-bold text-neutral-800 dark:text-white"
              aria-live="polite"
            >
              {isLoading ? 'Loading properties...' : 
                filteredProperties?.length 
                  ? `${filteredProperties.length} ${filteredProperties.length === 1 ? 'Property' : 'Properties'} Found` 
                  : 'No Properties Found'}
            </h2>
            <Link href="/">
              <Button 
                variant="outline" 
                className="h-9 sm:h-10 transform-gpu active:scale-95 transition-transform"
                aria-label="Back to home page"
                onClick={() => window.scrollTo(0, 0)}
              >
                <i className="bx bx-arrow-back mr-1 sm:mr-2" aria-hidden="true"></i>
                <span className="text-sm sm:text-base">Back to Home</span>
              </Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              aria-labelledby="properties-results-heading"
              role="status"
            >
              <div className="sr-only">Loading properties, please wait...</div>
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-5 sm:p-6 h-[340px] sm:h-96 animate-pulse mobile-optimized"
                  aria-hidden="true"
                >
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
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" 
              aria-labelledby="properties-results-heading"
              role="region"
            >
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div 
              className="text-center py-10 sm:py-16 mobile-optimized"
              aria-labelledby="properties-results-heading"
              role="region"
            >
              <i className="bx bx-search-alt text-5xl sm:text-6xl text-gray-300 dark:text-gray-600" aria-hidden="true"></i>
              <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 mt-4">No properties match your search criteria.</p>
              <p className="text-sm sm:text-base text-gray-400 dark:text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
              <Button 
                className="mt-6 h-10 transform-gpu bg-primary text-white hover:brightness-110 active:scale-95 transition-transform shadow-md" 
                onClick={() => {
                  setPropertyType("All");
                  setPriceRange("Any");
                  setSearchText("");
                  setBedrooms("Any");
                  setBathrooms("Any");
                }}
                aria-label="Reset all search filters"
              >
                <i className="bx bx-reset mr-2" aria-hidden="true"></i>
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}