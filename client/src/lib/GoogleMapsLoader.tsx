import { useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

// Declare global type for Google Maps API
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface GoogleMapsLoaderProps {
  children: React.ReactNode;
}

export default function GoogleMapsLoader({ children }: GoogleMapsLoaderProps) {
  const [loaded, setLoaded] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google?.maps) {
      setLoaded(true);
      return;
    }
    
    // Initialize Google Maps loader
    const loader = new Loader({
      apiKey: "AIzaSyD_5wX6LM0b-L0M3VEIpDe3QAfllQ72YuE",
      version: "weekly",
    });
    
    // Load the Google Maps script
    loader.load().then(() => {
      setLoaded(true);
    }).catch(error => {
      console.error("Error loading Google Maps:", error);
    });
  }, []);
  
  return (
    <>
      {loaded ? children : (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <i className='bx bx-map text-5xl text-neutral-400'></i>
            <p className="mt-2 text-neutral-600">Loading map...</p>
          </div>
        </div>
      )}
    </>
  );
}
