import React, { useRef, useState, useEffect } from "react";

interface FeaturedAirbnbRentalsProps {
  title?: string;
  subtitle?: string;
  limit?: number;
}

export function FeaturedAirbnbRentals({
  title = "Featured Vacation Rentals",
  subtitle = "Experience luxury and comfort in our hand-picked vacation rentals",
  limit
}: FeaturedAirbnbRentalsProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleCanPlay = () => {
      console.log('Featured video can play');
      setIsVideoLoaded(true);
    };
    
    const handlePlaying = () => {
      console.log('Featured video is playing');
      setIsPlaying(true);
    };
    
    const handlePause = () => {
      console.log('Featured video is paused');
      setIsPlaying(false);
    };
    
    // Add event listeners
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);
    
    // Cleanup
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
    };
  }, []);
  
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (video.paused) {
      video.play().catch(err => {
        console.error('Failed to play featured video:', err);
      });
    } else {
      video.pause();
    }
  };

  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3">{title}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
      </div>

      {/* Video component */}
      <div className="w-full max-w-4xl mx-auto h-[60vh] overflow-hidden relative rounded-lg">
        {/* Video element */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src="/OHANAVIDEOMASTER.mp4"
          muted
          loop
          playsInline
          onClick={togglePlay}
        />
        
        {/* Loading state */}
        {!isVideoLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
        
        {/* Play button overlay */}
        {isVideoLoaded && !isPlaying && (
          <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30"
            onClick={togglePlay}
          >
            <div className="bg-white/20 rounded-full p-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedAirbnbRentals;