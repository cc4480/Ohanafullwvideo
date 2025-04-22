import { useEffect, useState } from "react";

/**
 * A simplified component that serves as a replacement for the Google Maps loader
 * Instead of embedding maps with the Google Maps API, we use direct links to Google Maps
 * which doesn't require an API key and is more lightweight
 */
interface GoogleMapsLoaderProps {
  children: React.ReactNode;
}

export default function GoogleMapsLoader({ children }: GoogleMapsLoaderProps) {
  const [loaded, setLoaded] = useState<boolean>(true);
  
  useEffect(() => {
    // Since we're using direct links to Google Maps instead of the API,
    // we just set loaded to true immediately
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
