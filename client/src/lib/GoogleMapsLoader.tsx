import { useEffect, useState, createContext, useContext } from "react";

// Type definition for Google Maps to resolve TypeScript errors
declare global {
  interface Window {
    google?: {
      maps: any;
    };
  }
}

// Create a context to provide Google Maps resources across components
type GoogleMapsContextType = {
  isLoaded: boolean;
  error: Error | null;
};

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  error: null
});

// Hook to use the Google Maps context
export const useGoogleMaps = () => useContext(GoogleMapsContext);

interface GoogleMapsLoaderProps {
  children: React.ReactNode;
}

export default function GoogleMapsLoader({ children }: GoogleMapsLoaderProps) {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Since we're using a direct link approach instead of the actual Maps API,
    // we'll just set isLoaded to true immediately
    setIsLoaded(true);
  }, []);
  
  return (
    <GoogleMapsContext.Provider value={{ isLoaded, error }}>
      {!isLoaded ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <i className='bx bx-map text-5xl text-neutral-400'></i>
            <p className="mt-2 text-neutral-600">Loading map...</p>
          </div>
        </div>
      ) : children}
    </GoogleMapsContext.Provider>
  );
}
