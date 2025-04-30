import React from "react";
import OhanaVideoPlayer from "../ui/OhanaVideoPlayer";

interface FeaturedAirbnbRentalsProps {
  title?: string;
  subtitle?: string;
}

export function FeaturedAirbnbRentals({
  title = "Experience Laredo Luxury Living",
  subtitle = "Take a virtual tour of our exclusive properties"
}: FeaturedAirbnbRentalsProps) {
  return (
    <section id="browse-rentals" className="py-12 px-4 md:px-8 max-w-7xl mx-auto bg-black">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3 text-white">{title}</h2>
        <p className="text-gray-300 max-w-2xl mx-auto">{subtitle}</p>
      </div>

      <div className="w-full max-w-5xl mx-auto h-[70vh] rounded-lg overflow-hidden">
        <OhanaVideoPlayer 
          src="/api/video/ohana" 
          poster="/shiloh-primary.jpg"
          autoPlay={true}
          muted={false}
          loop={true}
          className="w-full h-full object-contain bg-black"
        />
      </div>
    </section>
  );
}

export default FeaturedAirbnbRentals;