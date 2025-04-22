import { useEffect, useState } from "react";
// Simple component that replaces the Google Maps API loader
// We're using direct Google Maps links instead of embedding the map

interface GoogleMapsLoaderProps {
  children: React.ReactNode;
}

export default function GoogleMapsLoader({ children }: GoogleMapsLoaderProps) {
  const [loaded, setLoaded] = useState<boolean>(true); // Always true since we don't load the API
  
  useEffect(() => {
    // No API to load - we use direct links to Google Maps instead
    setLoaded(true);
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
