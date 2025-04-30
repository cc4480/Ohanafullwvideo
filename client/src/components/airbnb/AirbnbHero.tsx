import { useState, useEffect } from 'react';
import { VideoPlayer } from '@/components/ui/video-player';

// Debug function to check if video exists
const checkVideoExists = (videoUrl: string) => {
  console.log(`Checking if video exists at: ${videoUrl}`);
  
  fetch(videoUrl, { method: 'HEAD' })
    .then(response => {
      if (response.ok) {
        console.log(`✅ Video exists at: ${videoUrl}`);
        console.log(`Content-Type: ${response.headers.get('content-type')}`);
        console.log(`Content-Length: ${response.headers.get('content-length')}`);
      } else {
        console.error(`❌ Video not found at: ${videoUrl}, status: ${response.status}`);
      }
    })
    .catch(error => {
      console.error(`❌ Error checking video: ${error}`);
    });
};

export function AirbnbHero() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  
  useEffect(() => {
    // Debug: Check if video exists at specified path
    checkVideoExists('/videos/property-showcase.mp4');
  }, []);

  // Create a backup image URL (fallback)
  const fallbackImageUrl = '/images/backgrounds/real-estate-bg.jpg';
  
  return (
    <section className="relative w-full">
      {/* Video Background - Full screen with debug info */}
      <div className="w-full h-[80vh] overflow-hidden relative rounded-lg">
        {videoError ? (
          // Fallback to static image if video errors
          <div className="absolute inset-0 bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${fallbackImageUrl})` }}>
            <div className="bg-black/70 p-4 rounded-lg text-white">
              <h3 className="text-xl font-bold">Video Error</h3>
              <p>Using fallback image</p>
            </div>
          </div>
        ) : (
          // Try to load video with visible controls for debugging
          <VideoPlayer
            src="/videos/property-showcase.mp4"
            autoPlay={true}
            muted={true}
            loop={true}
            controls={true}
            className="w-full h-full object-cover"
            onLoadedData={() => {
              console.log("Video loaded in AirbnbHero");
              setVideoLoaded(true);
            }}
            onError={() => {
              console.error("Video failed to load in AirbnbHero");
              setVideoError(true);
            }}
          />
        )}
        
        {/* Video Status Indicator */}
        <div className="absolute top-4 right-4 z-30 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
          {videoLoaded ? "Video Loaded ✓" : videoError ? "Video Error ✗" : "Loading..."}
        </div>
      </div>
    </section>
  );
}

export default AirbnbHero;