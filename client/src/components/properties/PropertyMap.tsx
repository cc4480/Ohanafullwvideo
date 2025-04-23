import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Helmet } from 'react-helmet';
import { MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import PropertiesMapOverview from "@/components/maps/PropertiesMapOverview";

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
  
  // Function to open Google Maps with the property location and formatted address
  const openInGoogleMaps = (lat: number | null, lng: number | null, property: Property) => {
    if (lat && lng) {
      // Format the full address for the map search
      const formattedAddress = encodeURIComponent(`${property.address}, ${property.city}, ${property.state} ${property.zipCode}`);
      const url = `https://www.google.com/maps/search/?api=1&query=${formattedAddress}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };
  
  // Create Schema.org structured data for the map with properties
  const createMapStructuredData = () => {
    if (!properties || properties.length === 0) return null;
    
    // Main map schema
    const mapSchema = {
      "@context": "https://schema.org",
      "@type": "Map",
      "name": "Ohana Realty Laredo Properties Map",
      "description": "Interactive map of properties for sale in Laredo, TX including residential homes, commercial properties, and land.",
      "url": "https://ohanarealty.com/properties#map",
      "hasMap": "https://www.google.com/maps/search/?api=1&query=Laredo+TX+real+estate",
      "provider": {
        "@type": "RealEstateAgent",
        "name": "Ohana Realty",
        "url": "https://ohanarealty.com"
      },
      "about": "Laredo, TX Real Estate"
    };
    
    // Create location structured data for each property
    const propertyLocations = properties.map(property => {
      const hasCoordinates = property.lat && property.lng;
      
      return {
        "@context": "https://schema.org",
        "@type": "Place",
        "name": property.address,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": property.address,
          "addressLocality": property.city,
          "addressRegion": property.state,
          "postalCode": property.zipCode,
          "addressCountry": "US"
        },
        "geo": hasCoordinates ? {
          "@type": "GeoCoordinates",
          "latitude": property.lat,
          "longitude": property.lng
        } : undefined,
        "url": `https://ohanarealty.com/properties/${property.id}`,
        "hasMap": hasCoordinates ? `https://www.google.com/maps?q=${property.lat},${property.lng}` :
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${property.address}, ${property.city}, ${property.state} ${property.zipCode}`)}`
      };
    });
    
    return [mapSchema, ...propertyLocations];
  };
  
  return (
    <section className={`py-16 ${isDark ? 'bg-background text-foreground' : 'bg-white'}`} id="map">
      {/* Structured data for map and property locations */}
      <Helmet>
        {properties && properties.length > 0 && createMapStructuredData()?.map((schema, index) => (
          <script key={`map-schema-${index}`} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        ))}
      </Helmet>
      
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
          {isLoading ? (
            <div className="h-[500px] bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <i className='bx bx-map text-5xl text-primary mb-4'></i>
                <p className="text-lg font-medium">Loading properties map...</p>
              </div>
            </div>
          ) : properties && properties.length > 0 ? (
            <PropertiesMapOverview properties={properties} height="500px" />
          ) : (
            <div className="h-[500px] bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <i className='bx bx-map-alt text-5xl text-primary mb-4'></i>
                <p className="text-lg font-medium">No properties available to display on map</p>
              </div>
            </div>
          )}
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
                
                {/* Price display */}
                <div className="mt-4">
                  <p className="font-bold text-lg text-secondary">${property.price.toLocaleString()}</p>
                </div>
                
                {/* Buttons stacked for better mobile display */}
                <div className="mt-3 grid grid-cols-1 gap-2 sm:flex sm:justify-between">
                  <Link href={`/properties/${property.id}`} className="w-full sm:w-auto">
                    <Button 
                      size="sm"
                      variant="default"
                      className="w-full text-sm font-medium"
                      aria-label={`View details of ${property.address}`}
                    >
                      View Details
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => property.lat && property.lng ? openInGoogleMaps(property.lat, property.lng, property) : null}
                    className="text-xs flex items-center justify-center gap-1"
                    aria-label={`View ${property.address} on Google Maps`}
                  >
                    <MapPin className="h-3 w-3" /> Map
                  </Button>
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
