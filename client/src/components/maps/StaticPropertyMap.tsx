import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Property } from '@shared/schema';

interface StaticPropertyMapProps {
  property: Property;
  height?: string;
  className?: string;
}

export default function StaticPropertyMap({ 
  property, 
  height = '300px', 
  className = '' 
}: StaticPropertyMapProps) {
  // Function to open Google Maps directions to the property
  const openDirectionsToProperty = () => {
    // Use property's address if coordinates aren't available
    const address = `${property.address}, ${property.city}, ${property.state} ${property.zipCode}`;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  // Function to open property location in Google Maps
  const openPropertyLocationMap = () => {
    // Use property's address if coordinates aren't available
    const address = `${property.address}, ${property.city}, ${property.state} ${property.zipCode}`;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  // Choose which map image to use
  const mapImageSrc = Math.random() > 0.5 ? 
    '/images/maps/laredo-map.png' : 
    '/images/maps/laredo-satellite.png';

  return (
    <div className={`static-property-map ${className}`}>
      <div 
        className="relative rounded-lg overflow-hidden shadow-md"
        style={{ height }}
      >
        {/* Static Map Background Image */}
        <div className="absolute inset-0 z-0 bg-slate-200 dark:bg-slate-800">
          <img 
            src={mapImageSrc}
            alt={`Map location of ${property.address}`}
            className="w-full h-full object-cover opacity-70 dark:opacity-50"
          />
        </div>

        {/* Map Overlay with Property Pin - Enhanced with animations */}
        <div 
          className="absolute inset-0 cursor-pointer group"
          onClick={openPropertyLocationMap}
          role="button"
          tabIndex={0}
          aria-label={`View ${property.address} on Google Maps`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openPropertyLocationMap();
            }
          }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Pulsing animation ring around pin */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping opacity-75 scale-150"></div>
              <div className="bg-white dark:bg-slate-800 rounded-full p-2 shadow-lg mb-2 transform transition-transform duration-300 group-hover:scale-110 relative z-10">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="bg-white/90 dark:bg-slate-800/90 p-3 rounded-lg backdrop-blur-sm max-w-[80%] shadow-lg transform transition-all duration-300 group-hover:scale-105">
              <h3 className="text-sm font-bold mb-1 text-center group-hover:text-primary transition-colors duration-300">{property.address}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 text-center">
                Click to view on Google Maps
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Action Button with hover animation */}
        <div className="absolute bottom-3 right-3 transform transition-transform duration-300 hover:scale-105">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              openDirectionsToProperty();
            }}
            className="shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:bg-primary hover:text-white transition-colors duration-300 relative overflow-hidden group"
          >
            <span className="absolute inset-0 w-full h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
            <Navigation className="w-4 h-4 mr-2 relative z-10 group-hover:animate-pulse" /> 
            <span className="relative z-10">Get Directions</span>
          </Button>
        </div>
      </div>
    </div>
  );
}