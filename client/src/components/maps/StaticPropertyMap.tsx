import { MapPin, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Property } from "@shared/schema";

interface StaticPropertyMapProps {
  property: Property;
  height?: string;
  width?: string;
  className?: string;
}

export default function StaticPropertyMap({ 
  property, 
  height = "350px", 
  width = "100%", 
  className = "" 
}: StaticPropertyMapProps) {
  const { address, city, state, zipCode, lat, lng } = property;
  
  // Format the address for Google Maps URL
  const formattedAddress = encodeURIComponent(`${address}, ${city}, ${state} ${zipCode}`);
  
  // Generate Google Maps URL
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${formattedAddress}`;
  
  // Generate Google Maps Directions URL
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${formattedAddress}`;
  
  return (
    <div className={`static-property-map ${className}`} style={{ width, height }}>
      <div 
        className="relative bg-slate-200 dark:bg-slate-800 rounded-md overflow-hidden flex items-center justify-center w-full h-full"
        onClick={() => window.open(googleMapsUrl, '_blank', 'noopener,noreferrer')}
        style={{ cursor: 'pointer' }}
        role="button"
        tabIndex={0}
        aria-label={`View ${address} on Google Maps`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
          }
        }}
      >
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-white rounded-full p-3 shadow-lg mb-4">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-1">{address}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{city}, {state} {zipCode}</p>
            <p className="text-primary text-sm mt-2">Click to view on Google Maps</p>
          </div>
        </div>
      </div>
      
      <div className="mt-2 flex justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs"
          onClick={(e) => {
            e.stopPropagation();
            window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
          }}
        >
          <MapPin className="w-3 h-3 mr-1" /> View Map
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs"
          onClick={(e) => {
            e.stopPropagation();
            window.open(directionsUrl, '_blank', 'noopener,noreferrer');
          }}
        >
          <ExternalLink className="w-3 h-3 mr-1" /> Get Directions
        </Button>
      </div>
    </div>
  );
}