import { useState, useEffect, useRef } from 'react';

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
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    // Debug: Check if video exists at specified path
    checkVideoExists('/videos/property-showcase.mp4');
  }, []);
  
  // Add event listeners to update UI when video state changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Create a backup image URL (fallback)
  const fallbackImageUrl = '/images/backgrounds/real-estate-bg.jpg';
  
  // Function to play/pause video on click
  const togglePlayback = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => {
          console.error("Error playing video:", err);
        });
      }
    }
  };
  
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
          // Try to load video with clickable overlay
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src="/videos/property-showcase.mp4"
              autoPlay={true}
              muted={true}
              loop={true}
              playsInline
              className="w-full h-full object-cover"
              onLoadedData={() => {
                console.log("Video loaded in AirbnbHero");
                setVideoLoaded(true);
                setIsPlaying(true);
                
                // Make sure video plays automatically
                if (videoRef.current) {
                  videoRef.current.play().catch(err => {
                    console.error("Error autoplaying video:", err);
                  });
                }
              }}
              onError={() => {
                console.error("Video failed to load in AirbnbHero");
                setVideoError(true);
              }}
            >
              <source src="/videos/property-showcase.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* No play/pause overlay needed for autoplay */}
          </div>
        )}
        
        {/* Video Status Indicator */}
        <div className="absolute top-4 right-4 z-30 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
          {videoLoaded ? (isPlaying ? "Playing ▶" : "Paused ⏸") : videoError ? "Video Error ✗" : "Loading..."}
        </div>
        
        {/* No instructions needed for autoplay */}
      </div>
    </section>
  );
}

export default AirbnbHero;