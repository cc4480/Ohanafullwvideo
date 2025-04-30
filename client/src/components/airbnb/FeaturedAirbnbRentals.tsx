import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

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
  // Create a direct link to the video file for download
  const videoUrl = "/property-video.mp4";
  const posterUrl = "/images/backgrounds/real-estate-bg.jpg";
  
  // Reference to the video element
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Handle play button click
  const handlePlayClick = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
          console.log("Video playing successfully");
        })
        .catch(err => {
          console.error("Error playing video:", err);
        });
    }
  };

  // Setup video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleCanPlay = () => {
      console.log("Video can play now in FeaturedAirbnbRentals");
      setVideoLoaded(true);
    };
    
    const handlePlay = () => {
      setIsPlaying(true);
    };
    
    const handlePause = () => {
      setIsPlaying(false);
    };
    
    const handleError = (e: Event) => {
      const target = e.target as HTMLVideoElement;
      const error = target.error;
      console.error("Video failed to load in FeaturedAirbnbRentals", error ? error.message : "Unknown error");
      console.error("Video error code:", error ? error.code : "None");
      console.error("Video URL:", videoUrl);
      setVideoError(true);
    };
    
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);
    
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
    };
  }, [videoUrl]);

  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3">{title}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
      </div>

      <div className="w-full max-w-5xl mx-auto h-[60vh] overflow-hidden relative rounded-lg bg-gray-100">
        {/* Directly show the video */}
        <div className="relative w-full h-full">
          {/* Video element with controls and error handling */}
          <video
            ref={videoRef}
            muted={true}
            loop={true}
            playsInline
            className="w-full h-full object-cover"
            controls={false} // Disable default controls, we'll use custom controls
            poster={posterUrl}
            preload="auto"
            onLoadedData={() => {
              console.log("Video loaded in FeaturedAirbnbRentals");
              setVideoLoaded(true);
            }}
            onError={(e) => {
              const target = e.target as HTMLVideoElement;
              const error = target.error;
              console.error("Video failed to load in FeaturedAirbnbRentals", error ? error.message : "Unknown error");
              console.error("Video error code:", error ? error.code : "None");
              console.error("Video URL:", videoUrl);
              setVideoError(true);
            }}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Play button overlay */}
          {!isPlaying && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
              onClick={handlePlayClick}
            >
              <div className="bg-white/80 rounded-full p-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
            </div>
          )}
          
          {/* Custom video controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-white/20 hover:bg-white/40 text-white border-none"
                onClick={handlePlayClick}
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                )}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              
              {/* Status indicator */}
              <div className="text-white text-sm">
                {videoError ? 'Error Loading Video' : 
                 videoLoaded ? 'Video Loaded' : 'Loading Video...'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <a 
          href={videoUrl} 
          download="property-tour.mp4"
          className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download Property Video
        </a>
      </div>
    </section>
  );
}

export default FeaturedAirbnbRentals;