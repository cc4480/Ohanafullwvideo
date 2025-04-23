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

        {/* Map Overlay with Property Pin */}
        <div 
          className="absolute inset-0 cursor-pointer"
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
            <div className="bg-white dark:bg-slate-800 rounded-full p-2 shadow-lg mb-2">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div className="bg-white/90 dark:bg-slate-800/90 p-3 rounded-lg backdrop-blur-sm max-w-[80%]">
              <h3 className="text-sm font-bold mb-1 text-center">{property.address}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 text-center">
                Click to view on Google Maps
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="absolute bottom-3 right-3">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              openDirectionsToProperty();
            }}
            className="shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm"
          >
            <Navigation className="w-4 h-4 mr-2" /> Get Directions
          </Button>
        </div>
      </div>
    </div>
  );
}