import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import { useEffect, useState } from "react";
import { Link } from "wouter";

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
  
  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });
  
  // Function to open Google Maps with the property location
  const openInGoogleMaps = (lat: number | null, lng: number | null, address: string) => {
    if (lat && lng) {
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(address)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };
  
  return (
    <section className={`py-16 ${isDark ? 'bg-background text-foreground' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={`font-serif text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-neutral-800'} mb-4`}>
            Explore Laredo Properties
          </h2>
          <p className={`${isDark ? 'text-slate-300' : 'text-neutral-600'} max-w-2xl mx-auto`}>
            Discover properties throughout Laredo with our interactive map and curated property listings.
          </p>
        </div>
        
        {/* Interactive map area */}
        <div className={`mb-12 p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-full md:w-2/3 h-[400px] bg-slate-200 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <i className='bx bxs-map text-6xl text-primary mb-4'></i>
                <h3 className="text-xl font-bold mb-2">Interactive Property Map</h3>
                <p className="mb-4 text-slate-600">View our properties on an interactive map of Laredo.</p>
                <p className="text-sm text-slate-500 mb-6">Select a property below to view its exact location.</p>
              </div>
            </div>
            
            <div className="w-full md:w-1/3 overflow-auto max-h-[400px] pr-2">
              <h3 className="text-lg font-bold mb-4">Select a Property</h3>
              
              {isLoading ? (
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-slate-300 rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {properties?.map(property => (
                    <div 
                      key={property.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white hover:bg-slate-50'} shadow-sm hover:shadow`}
                      onClick={() => property.lat && property.lng ? openInGoogleMaps(property.lat, property.lng, property.address) : null}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold">{property.address}</h4>
                          <p className="text-xs text-slate-500">{property.city}, {property.state}</p>
                        </div>
                        <div className="text-xs px-2 py-1 rounded bg-primary text-white">
                          View on Map
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Property cards listing */}
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => property.lat && property.lng ? openInGoogleMaps(property.lat, property.lng, property.address) : null}
                      className="px-2 py-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors text-sm flex items-center"
                    >
                      <i className='bx bx-map text-primary mr-1'></i> Map
                    </button>
                    <Link href={`/properties/${property.id}`}>
                      <a className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm">
                        Details
                      </a>
                    </Link>
                  </div>
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
