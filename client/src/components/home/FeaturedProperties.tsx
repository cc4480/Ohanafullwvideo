import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/properties/PropertyCard";
import { useFeaturedProperties } from "@/hooks/useProperties";

export default function FeaturedProperties() {
  const { data: properties, isLoading, error, refetch } = useFeaturedProperties(4);
  
  // Create placeholder data for loading state
  const loadingPlaceholders = Array(4).fill(0).map((_, index) => ({
    id: index,
    isLoading: true
  }));
  
  return (
    <section id="featured-properties" className="py-10 sm:py-16 bg-background relative overflow-hidden">
      {/* Decorative background elements for mobile and desktop */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 opacity-60"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs sm:text-sm tracking-wider font-medium mb-3">
            EXCEPTIONAL PROPERTIES
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 animate-slide-up">
            Featured Properties
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Discover our exclusive selection of premium properties in Laredo, Texas, 
            handpicked by Valentin Cuellar.
          </p>
        </div>
        
        {/* Enhanced responsive grid with smooth animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          {error ? (
            <div className="col-span-full text-center py-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                <i className="bx bx-error text-2xl text-red-500"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Database Connection Issue
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                The database is currently sleeping. This happens after 5 minutes of inactivity.
              </p>
              <button
                onClick={() => refetch()}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Wake Up Database
              </button>
            </div>
          ) : isLoading ? (
            loadingPlaceholders.map((placeholder, index) => (
              <div 
                key={placeholder.id} 
                className="bg-card rounded-lg shadow-md p-3 sm:p-4 h-[440px] sm:h-[460px] animate-pulse transform-gpu transition-all duration-500"
                style={{ animationDelay: `${index * 0.1}s` }}
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
          ) : (
            properties?.slice(0, 4).map((property, index) => (
              <div 
                key={property.id} 
                className="transform-gpu transition-all duration-500 animate-slide-up hover:translate-y-[-5px]"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <PropertyCard property={property} />
              </div>
            ))
          )}
        </div>
        
        {/* Enhanced CTA for all devices */}
        <div className="mt-10 sm:mt-12 text-center animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <Link href="/properties">
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-500 group relative overflow-hidden"
              onClick={() => window.scrollTo(0, 0)}
            >
              {/* Animated shine effect for both desktop and mobile */}
              <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              <span className="relative z-10">View All Properties</span>
              <i className='bx bx-right-arrow-alt ml-2 relative z-10 transform group-hover:translate-x-1 transition-transform duration-300'></i>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
