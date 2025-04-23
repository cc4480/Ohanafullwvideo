import React from 'react';
import { Helmet } from 'react-helmet';
import { MapPin, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface SEOLocationMapProps {
  /**
   * The address of the property
   */
  address: string;
  
  /**
   * The city of the property
   */
  city: string;
  
  /**
   * The state of the property
   */
  state: string;
  
  /**
   * The zip code of the property
   */
  zipCode: string;
  
  /**
   * Optional latitude coordinate
   */
  latitude?: number | null;
  
  /**
   * Optional longitude coordinate
   */
  longitude?: number | null;
  
  /**
   * Optional neighborhood name
   */
  neighborhood?: string;
  
  /**
   * Optional additional CSS class for the container
   */
  className?: string;
  
  /**
   * Optional map width (default: 100%)
   */
  width?: string;
  
  /**
   * Optional map height (default: 300px)
   */
  height?: string;
}

/**
 * SEO-optimized map component that includes location structured data
 * and proper Google Maps integration with deep linking
 */
export default function SEOLocationMap({
  address,
  city,
  state,
  zipCode,
  latitude,
  longitude,
  neighborhood,
  className = '',
  width = '100%',
  height = '300px'
}: SEOLocationMapProps) {
  // Format the address for Google Maps URL
  const formattedAddress = encodeURIComponent(`${address}, ${city}, ${state} ${zipCode}`);
  
  // Create Google Maps URL with property image support
  const getMapsUrl = () => {
    // If we have coordinates, use them for more precise location and to enable property image display
    if (latitude && longitude) {
      // This special format encourages Google Maps to show property images when available
      const simpleAddress = encodeURIComponent(address);
      return `https://www.google.com/maps/place/${simpleAddress}/@${latitude},${longitude},14z/data=!4m5!3m4!1s0x0:0x0!8m2!3d${latitude}!4d${longitude}`;
    }
    
    // Otherwise use the address
    return `https://www.google.com/maps/search/?api=1&query=${formattedAddress}`;
  };
  
  // Create Maps directions URL with better property linking
  const getDirectionsUrl = () => {
    if (latitude && longitude) {
      // Use coordinates for more precise directions and include parameters
      // to encourage Google Maps to show property images and details
      return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving&dir_action=navigate`;
    }
    
    return `https://www.google.com/maps/dir/?api=1&destination=${formattedAddress}`;
  };
  
  // Static map URL (for preview)
  const getStaticMapUrl = () => {
    // Determine center for the static map
    let center;
    let zoom = 15;
    
    if (latitude && longitude) {
      center = `${latitude},${longitude}`;
    } else {
      center = formattedAddress;
      zoom = 14; // Slightly zoomed out when using address
    }
    
    // Check if GOOGLE_MAPS_API_KEY environment variable is available
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (apiKey) {
      return `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=${zoom}&size=600x300&maptype=roadmap&markers=color:red%7C${center}&key=${apiKey}`;
    } else {
      // Return null if API key is not available
      return null;
    }
  };
  
  // Get a styled static/fallback map with a marker using OpenStreetMap (no API key required)
  const getFallbackMapUrl = () => {
    const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
    
    if (apiKey) {
      return `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=300&center=lonlat:${longitude || -99.5},${latitude || 27.5}&zoom=15&marker=lonlat:${longitude || -99.5},${latitude || 27.5};color:%23ff0000;size:medium&apiKey=${apiKey}`;
    } else {
      // If no API key is available, return null
      return null;
    }
  };
  
  // Create a placeholder for the map using styling instead of an actual image
  const Placeholder = () => (
    <div 
      className="relative bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden flex items-center justify-center"
      style={{ width, height }}
    >
      <div className="absolute inset-0 bg-opacity-50 flex flex-col items-center justify-center p-4 text-center">
        <MapPin className="w-8 h-8 mb-2 text-primary" />
        <h3 className="text-lg font-bold mb-1">{address}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{city}, {state} {zipCode}</p>
        {neighborhood && (
          <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">Neighborhood: {neighborhood}</p>
        )}
      </div>
      
      <div className="absolute bottom-2 right-2">
        <Button 
          variant="secondary" 
          size="sm"
          className="bg-white/90 hover:bg-white shadow text-xs"
          onClick={() => window.open(getMapsUrl(), '_blank')}
        >
          <ExternalLink className="w-3 h-3 mr-1" /> View on Google Maps
        </Button>
      </div>
    </div>
  );
  
  // Create Place structured data
  const placeStructuredData = {
    "@context": "https://schema.org",
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address,
      "addressLocality": city,
      "addressRegion": state,
      "postalCode": zipCode,
      "addressCountry": "US"
    },
    "name": address,
    "description": `Property located at ${address}, ${city}, ${state} ${zipCode}${neighborhood ? ` in the ${neighborhood} neighborhood` : ''}`,
    "hasMap": getMapsUrl(),
    "geo": latitude && longitude ? {
      "@type": "GeoCoordinates",
      "latitude": latitude,
      "longitude": longitude
    } : undefined,
    "telephone": "",
    "url": getDirectionsUrl()
  };
  
  // Check if any API keys are available for static maps
  const hasGoogleMapsApiKey = Boolean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
  const hasGeoapifyApiKey = Boolean(import.meta.env.VITE_GEOAPIFY_API_KEY);

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(placeStructuredData)}
        </script>
      </Helmet>
      
      <div className={`seo-location-map ${className}`}>
        <Placeholder />
        
        {!hasGoogleMapsApiKey && !hasGeoapifyApiKey && (
          <div className="mt-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-md">
            Note: For map integration, add the VITE_GOOGLE_MAPS_API_KEY or VITE_GEOAPIFY_API_KEY environment variable.
          </div>
        )}
        
        <div className="mt-2 flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => window.open(getMapsUrl(), '_blank')}
          >
            <MapPin className="w-3 h-3 mr-1" /> View Map
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => window.open(getDirectionsUrl(), '_blank')}
          >
            <ExternalLink className="w-3 h-3 mr-1" /> Get Directions
          </Button>
        </div>
      </div>
    </>
  );
}