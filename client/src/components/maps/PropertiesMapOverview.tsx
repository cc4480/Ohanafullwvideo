import { useState } from 'react';
import { Property } from "@shared/schema";
import { MapPin, Navigation } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface PropertiesMapOverviewProps {
  properties: Property[];
  className?: string;
  height?: string;
}

export default function PropertiesMapOverview({ 
  properties,
  className = "",
  height = "400px"
}: PropertiesMapOverviewProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // Function to open Google Maps with multiple locations
  const openMultipleLocationsMap = () => {
    // Get property locations with coordinates
    const propertiesWithCoords = properties.filter(p => p.lat && p.lng);
    
    if (propertiesWithCoords.length === 0) {
      // Fallback to Laredo, TX if no properties have coordinates
      window.open('https://www.google.com/maps/search/?api=1&query=Laredo+TX+Real+Estate', '_blank', 'noopener,noreferrer');
      return;
    }
    
    // If there's only one property with coordinates, open that specific location
    if (propertiesWithCoords.length === 1) {
      const property = propertiesWithCoords[0];
      const formattedAddress = encodeURIComponent(`${property.address}, ${property.city}, ${property.state} ${property.zipCode}`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${formattedAddress}`, '_blank', 'noopener,noreferrer');
      return;
    }
    
    // For multiple properties, open a map centered around the first one with a search for real estate
    const centerProperty = propertiesWithCoords[0];
    const centerAddress = encodeURIComponent(`${centerProperty.city}, ${centerProperty.state}`);
    window.open(`https://www.google.com/maps/search/real+estate/@${centerProperty.lat},${centerProperty.lng},12z`, '_blank', 'noopener,noreferrer');
  };
  
  // Function to open directions to a specific property
  const openDirectionsToProperty = (property: Property) => {
    const formattedAddress = encodeURIComponent(`${property.address}, ${property.city}, ${property.state} ${property.zipCode}`);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${formattedAddress}`, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <div className={`properties-map-overview ${className}`}>
      <div 
        className="relative bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden"
        style={{ height }}
      >
        {/* Map Interaction Area */}
        <div 
          className="absolute inset-0 cursor-pointer flex items-center justify-center"
          onClick={openMultipleLocationsMap}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openMultipleLocationsMap();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="View all properties on Google Maps"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white dark:bg-slate-700 rounded-full p-3 shadow-lg mb-3">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="text-lg font-bold mb-1">Interactive Property Map</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">View all properties on Google Maps</p>
              <p className="text-primary text-sm">Click to open Google Maps</p>
            </div>
          </div>
        </div>
        
        {/* Property List Overlay */}
        <div className="absolute top-4 right-4 bottom-4 w-64 bg-white/90 dark:bg-slate-800/90 rounded-lg shadow-lg backdrop-blur-sm overflow-y-auto">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-lg">Properties ({properties.length})</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Select a property to view details</p>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {properties.map(property => (
              <div 
                key={property.id}
                className={`p-3 cursor-pointer transition-all ${
                  selectedProperty?.id === property.id 
                    ? 'bg-primary/10 dark:bg-primary/20' 
                    : 'hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
                onClick={() => setSelectedProperty(property)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm">{property.address}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{property.city}, {property.state}</p>
                    <p className="text-primary font-bold text-sm mt-1">${property.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDirectionsToProperty(property);
                      }}
                      aria-label={`Get directions to ${property.address}`}
                    >
                      <Navigation className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Property Detail Panel */}
      {selectedProperty && (
        <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold">{selectedProperty.address}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{selectedProperty.city}, {selectedProperty.state} {selectedProperty.zipCode}</p>
            </div>
            <div className="text-xl font-bold text-primary">${selectedProperty.price.toLocaleString()}</div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-3">
            {selectedProperty.bedrooms && (
              <div className="text-center p-2 bg-gray-100 dark:bg-slate-700 rounded">
                <div className="font-bold">{selectedProperty.bedrooms}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Beds</div>
              </div>
            )}
            {selectedProperty.bathrooms && (
              <div className="text-center p-2 bg-gray-100 dark:bg-slate-700 rounded">
                <div className="font-bold">{selectedProperty.bathrooms}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Baths</div>
              </div>
            )}
            {selectedProperty.squareFeet && (
              <div className="text-center p-2 bg-gray-100 dark:bg-slate-700 rounded">
                <div className="font-bold">{selectedProperty.squareFeet.toLocaleString()}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Sq Ft</div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              onClick={() => openDirectionsToProperty(selectedProperty)}
            >
              <Navigation className="w-4 h-4 mr-2" /> Get Directions
            </Button>
            <Link href={`/properties/${selectedProperty.id}`}>
              <Button>View Property</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}