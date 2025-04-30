import React, { useRef, useState, useEffect } from 'react';

export function AirbnbHero() {
  // Title overlay content
  const title = "Vacation Rentals in Laredo";
  const subtitle = "Experience luxury and comfort in our hand-picked properties";
  
  // Video reference
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  
  // Try to play video when component mounts
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleCanPlay = () => {
      console.log("Video can play");
      setVideoLoaded(true);
      
      // Try to play the video
      video.play().catch(err => {
        console.error("Error playing video on load:", err);
        // Don't set error state here, just log it - some browsers require user interaction
      });
    };
    
    const handleError = (e: Event) => {
      const target = e.target as HTMLVideoElement;
      console.error("Video error in AirbnbHero:", target.error);
      setVideoError(true);
    };
    
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <section className="relative w-full">
      {/* Video Background - Full screen with autoplay */}
      <div className="w-full h-[80vh] overflow-hidden relative rounded-lg">
        {/* Use direct video element instead of iframe */}
        <video
          ref={videoRef}
          muted={true}
          playsInline
          loop
          className="absolute inset-0 w-full h-full object-cover"
          poster="/images/backgrounds/real-estate-bg.jpg" // Fallback image while video loads
          onLoadedData={() => {
            console.log("Video loaded in AirbnbHero");
            setVideoLoaded(true);
          }}
          onError={(e) => {
            const target = e.target as HTMLVideoElement;
            console.error("Video error in AirbnbHero:", target.error);
            setVideoError(true);
          }}
        >
          <source src="/property-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Text overlay - Centered with dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 flex flex-col items-center justify-center text-white p-4 pointer-events-none">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-center mb-4 drop-shadow-md">{title}</h1>
          <p className="text-xl md:text-2xl text-center max-w-2xl mx-auto drop-shadow-md">{subtitle}</p>
        </div>
        
        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute bottom-4 right-4 z-30 bg-black/60 text-white px-3 py-1 rounded-md text-sm">
            Status: {videoError ? 'Error' : videoLoaded ? 'Loaded' : 'Loading'}
          </div>
        )}
      </div>
    </section>
  );
}

export default AirbnbHero;