import { useEffect, useState, createContext, useContext } from "react";
import { Loader } from "@googlemaps/js-api-loader";

// Create a context to provide Google Maps resources across components
type GoogleMapsContextType = {
  isLoaded: boolean;
  googleMaps: typeof google.maps | null;
  error: Error | null;
};

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  googleMaps: null,
  error: null
});

// Hook to use the Google Maps context
export const useGoogleMaps = () => useContext(GoogleMapsContext);

interface GoogleMapsLoaderProps {
  children: React.ReactNode;
  apiKey?: string;
}

export default function GoogleMapsLoader({ children, apiKey }: GoogleMapsLoaderProps) {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [googleMaps, setGoogleMaps] = useState<typeof google.maps | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!apiKey) {
      // If no API key is provided, we'll just use direct links to Google Maps
      // This allows the app to function without the actual maps API
      setIsLoaded(true);
      return;
    }

    const loader = new Loader({
      apiKey,
      version: "weekly",
      libraries: ["places"]
    });

    loader.load()
      .then((google) => {
        setGoogleMaps(google.maps);
        setIsLoaded(true);
      })
      .catch((err) => {
        console.error("Error loading Google Maps API:", err);
        setError(err);
        // Still set loaded to true so the app can fallback to static maps
        setIsLoaded(true);
      });
  }, [apiKey]);
  
  return (
    <GoogleMapsContext.Provider value={{ isLoaded, googleMaps, error }}>
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
