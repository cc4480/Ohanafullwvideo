import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import { useEffect, useState } from "react";

export default function PropertyMap() {
  const [isDark, setIsDark] = useState(false);
  
  // Detect dark mode from document class
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    // Check immediately
    checkDarkMode();
    
    // Set up observer to monitor class changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === 'class' &&
          mutation.target === document.documentElement
        ) {
          checkDarkMode();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);
  
  const { data: properties } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });
  
  return (
    <section className={`py-16 ${isDark ? 'bg-background text-foreground' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={`font-serif text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-neutral-800'} mb-4`}>
            Explore Laredo Properties
          </h2>
          <p className={`${isDark ? 'text-slate-300' : 'text-neutral-600'} max-w-2xl mx-auto`}>
            Discover properties throughout Laredo with our curated property listings.
          </p>
        </div>
        
        {/* Map placeholder with property cards instead */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {properties?.map(property => (
            <div 
              key={property.id}
              className={`overflow-hidden rounded-lg shadow-md ${isDark ? 'bg-slate-800' : 'bg-white'} transition-all hover:shadow-lg`}
            >
              {property.images && property.images.length > 0 && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={property.images[0]} 
                    alt={property.address} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              )}
              
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{property.address}</h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      {property.city}, {property.state} {property.zipCode}
                    </p>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded ${
                    property.type === "RESIDENTIAL" 
                      ? 'bg-secondary text-secondary-foreground' 
                      : 'bg-primary text-primary-foreground'
                  }`}>
                    {property.type === "RESIDENTIAL" ? "Residential" : "Commercial"}
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <p className="font-bold text-lg text-secondary">${property.price.toLocaleString()}</p>
                  <a 
                    href={`/properties/${property.id}`}
                    className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-md ${isDark ? 'bg-slate-800' : 'bg-neutral-100'}`}>
            <div className="flex items-center">
              <div className="bg-secondary h-4 w-4 rounded-full mr-2"></div>
              <p className={isDark ? 'text-slate-200' : 'text-neutral-700'}>Residential Properties</p>
            </div>
          </div>
          <div className={`p-4 rounded-md ${isDark ? 'bg-slate-800' : 'bg-neutral-100'}`}>
            <div className="flex items-center">
              <div className="bg-primary h-4 w-4 rounded-full mr-2"></div>
              <p className={isDark ? 'text-slate-200' : 'text-neutral-700'}>Commercial Properties</p>
            </div>
          </div>
          <div className={`p-4 rounded-md ${isDark ? 'bg-slate-800' : 'bg-neutral-100'}`}>
            <div className="flex items-center">
              <div className="bg-neutral-600 h-4 w-4 rounded-full mr-2"></div>
              <p className={isDark ? 'text-slate-200' : 'text-neutral-700'}>Land/Development</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
