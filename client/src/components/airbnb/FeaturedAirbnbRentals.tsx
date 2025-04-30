import { useState, useEffect } from "react";
import { VideoPlayer } from "@/components/ui/video-player";

interface FeaturedAirbnbRentalsProps {
  title?: string;
  subtitle?: string;
}

export function FeaturedAirbnbRentals({
  title = "Featured Vacation Rentals",
  subtitle = "Experience luxury and comfort in our hand-picked vacation rentals",
}: FeaturedAirbnbRentalsProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  
  // Check if video file exists
  useEffect(() => {
    console.log("Checking if video exists at: /videos/property-showcase.mp4");
    
    fetch("/videos/property-showcase.mp4", { method: "HEAD" })
      .then(response => {
        if (response.ok) {
          console.log("✅ Video exists at: /videos/property-showcase.mp4");
          console.log(`Content-Type: ${response.headers.get("content-type")}`);
          console.log(`Content-Length: ${response.headers.get("content-length")}`);
        } else {
          console.error(`❌ Video not found at: /videos/property-showcase.mp4, status: ${response.status}`);
        }
      })
      .catch(error => {
        console.error(`❌ Error checking video: ${error}`);
      });
  }, []);

  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3">{title}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
      </div>

      {/* Video only - no rental cards, no buttons */}
      <div className="w-full max-w-5xl mx-auto h-[60vh] overflow-hidden relative rounded-lg">
        {videoError ? (
          // Fallback when video fails
          <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
            <div className="text-center p-4">
              <p className="text-2xl font-bold text-red-500 mb-2">Video Error</p>
              <p>Unable to load the showcase video</p>
            </div>
          </div>
        ) : (
          // Main video player with direct video element for better compatibility
          <div className="w-full h-full">
            <video 
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              controls
              playsInline
              onLoadedData={() => {
                console.log("✅ Video loaded successfully");
                setVideoLoaded(true);
              }}
              onError={(e) => {
                console.error("❌ Video failed to load", e);
                setVideoError(true);
              }}
            >
              <source src="/videos/property-showcase.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
        
        {/* Status indicator */}
        <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-sm">
          {videoLoaded && !videoError ? (
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
              Video Loaded ✓
            </div>
          ) : videoError ? (
            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
              Video Error ✗
            </div>
          ) : (
            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
              Loading...
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default FeaturedAirbnbRentals;