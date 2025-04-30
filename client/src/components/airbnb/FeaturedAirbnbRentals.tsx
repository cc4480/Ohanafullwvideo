import React, { useState, useEffect, useRef } from "react";

interface FeaturedAirbnbRentalsProps {
  title?: string;
  subtitle?: string;
}

export function FeaturedAirbnbRentals({
  title = "Featured Vacation Rentals",
  subtitle = "Experience luxury and comfort in our hand-picked vacation rentals",
}: FeaturedAirbnbRentalsProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Lazy load the video when component is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVideoLoaded(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  // Function to handle play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(error => {
          console.error("Error playing video:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Manage memory by using preload="metadata" and loading the video only when needed
  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3">{title}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
      </div>

      <div className="w-full max-w-5xl mx-auto h-[60vh] overflow-hidden relative rounded-lg bg-gray-100">
        {!videoLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <button 
              onClick={() => setVideoLoaded(true)}
              className="bg-primary text-white px-6 py-3 rounded-lg shadow-lg hover:bg-primary/90 transition-colors"
            >
              Click to Load Video
            </button>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
              preload="metadata"
              poster="/shiloh-primary.webp"
              onClick={togglePlayPause}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src="/api/video/property" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <button 
                onClick={togglePlayPause}
                className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
              >
                {isPlaying ? "⏸️" : "▶️"}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default FeaturedAirbnbRentals;