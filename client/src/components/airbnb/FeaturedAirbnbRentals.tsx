import React, { useRef } from "react";

interface FeaturedAirbnbRentalsProps {
  title?: string;
  subtitle?: string;
}

export function FeaturedAirbnbRentals({
  title = "Featured Vacation Rentals",
  subtitle = "Experience luxury and comfort in our hand-picked vacation rentals",
}: FeaturedAirbnbRentalsProps) {
  // Create a direct link to the video file for download
  const videoUrl = "/property-video.mp4";
  
  // Reference to the video element
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3">{title}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
      </div>

      <div className="w-full max-w-5xl mx-auto h-[60vh] overflow-hidden relative rounded-lg bg-gray-100">
        {/* Directly show the video with autoplay */}
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay={true}
          muted={true}
          loop={true}
          playsInline
          className="w-full h-full object-cover"
          controls={false}
          onLoadedData={() => {
            console.log("Video loaded in FeaturedAirbnbRentals");
          }}
          onError={(e) => {
            console.error("Error loading video:", e);
          }}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* No modal needed since we're showing the video directly */}

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