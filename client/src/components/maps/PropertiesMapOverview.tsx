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
    
    // If there's only one property with coordinates, open that specific location with its image
    if (propertiesWithCoords.length === 1) {
      const property = propertiesWithCoords[0];
      
      // If the property has images, create a more detailed maps URL
      if (property.images && Array.isArray(property.images) && property.images.length > 0) {
        const simpleAddress = encodeURIComponent(property.address);
        window.open(`https://www.google.com/maps/place/${simpleAddress}/@${property.lat},${property.lng},14z/data=!4m5!3m4!1s0x0:0x0!8m2!3d${property.lat}!4d${property.lng}`, '_blank', 'noopener,noreferrer');
      } else {
        // Fallback to standard search
        const formattedAddress = encodeURIComponent(`${property.address}, ${property.city}, ${property.state} ${property.zipCode}`);
        window.open(`https://www.google.com/maps/search/?api=1&query=${formattedAddress}`, '_blank', 'noopener,noreferrer');
      }
      return;
    }
    
    // For multiple properties, create a dynamic map centered around the first one
    // This creates URLs that will show photos and info about the properties
    const centerLat = propertiesWithCoords[0].lat;
    const centerLng = propertiesWithCoords[0].lng;
    
    // Create a more complex URL that will show the properties with their images
    const mapUrl = `https://www.google.com/maps/search/property+for+sale/@${centerLat},${centerLng},13z`;
    window.open(mapUrl, '_blank', 'noopener,noreferrer');
  };
  
  // Function to open directions to a specific property
  const openDirectionsToProperty = (property: Property) => {
    // Create the destination URL with property images if available
    if (property.images && Array.isArray(property.images) && property.images.length > 0) {
      // Use a more specific maps URL to incorporate images
      const simpleAddress = encodeURIComponent(property.address);
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${property.lat},${property.lng}&travelmode=driving`, '_blank', 'noopener,noreferrer');
    } else {
      // Fallback to standard directions
      const formattedAddress = encodeURIComponent(`${property.address}, ${property.city}, ${property.state} ${property.zipCode}`);
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${formattedAddress}`, '_blank', 'noopener,noreferrer');
    }
  };
  
  return (
    <div className={`properties-map-overview ${className}`}>
      <div 
        className="relative rounded-lg overflow-hidden"
        style={{ height }}
      >
        {/* Enhanced Static Map Background Image with subtle zoom animation */}
        <div className="absolute inset-0 z-0 bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <img 
            src="/images/maps/laredo-map.png" 
            alt="Map of Laredo properties" 
            className="w-full h-full object-cover opacity-60 dark:opacity-40 transition-transform duration-10000 ease-in-out transform hover:scale-110"
          />
          {/* Subtle pulsing overlay for visual interest */}
          <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 animate-pulse opacity-0 hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
        </div>
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
            {/* Pulsing map pin with hover effect */}
            <div className="relative transform hover:scale-110 transition-transform duration-300 mb-3">
              <div className="animate-ping absolute -inset-1 bg-primary/20 rounded-full opacity-75"></div>
              <div className="bg-white dark:bg-slate-700 rounded-full p-3 shadow-lg relative z-10">
                <MapPin className="w-8 h-8 text-primary animate-pulse" />
              </div>
            </div>
            <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg backdrop-blur-sm shadow-lg transform hover:scale-105 transition-all duration-300">
              <h3 className="text-lg font-bold mb-1 text-foreground dark:text-white">Interactive Property Map</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">View all properties on Google Maps</p>
              <p className="text-primary text-sm font-medium">Click to open Google Maps</p>
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
                      className="h-7 w-7 p-0 hover:bg-primary/10 hover:text-primary transition-colors duration-300 relative group"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDirectionsToProperty(property);
                      }}
                      aria-label={`Get directions to ${property.address}`}
                    >
                      <div className="absolute inset-0 rounded-full bg-primary/10 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                      <Navigation className="h-4 w-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
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
              className="hover:bg-primary/10 hover:border-primary transition-colors duration-300 relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-primary/5 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
              <Navigation className="w-4 h-4 mr-2 group-hover:text-primary transition-colors duration-300 group-hover:animate-pulse" /> 
              <span className="group-hover:text-primary transition-colors duration-300">Get Directions</span>
            </Button>
            <Link href={`/properties/${selectedProperty.id}`}>
              <Button className="bg-primary hover:bg-primary/90 transition-colors duration-300 shadow-md hover:shadow-lg relative overflow-hidden group">
                <span className="absolute inset-0 w-full h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
                <span className="relative z-10">View Property</span>
                <i className="bx bx-right-arrow-alt ml-2 transform-gpu transition-transform duration-300 group-hover:translate-x-1 relative z-10"></i>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}