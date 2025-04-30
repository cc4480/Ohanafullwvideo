import React from 'react';
import OhanaVideoPlayer from '@/components/ui/OhanaVideoPlayer';

export function AirbnbHero() {
  return (
    <section className="relative w-full">
      <div className="w-full h-[80vh] overflow-hidden relative bg-black">
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <OhanaVideoPlayer
            src="/api/video/ohana"
            autoPlay={true}
            muted={true}
            loop={true}
            className="w-full h-full max-w-[1600px] mx-auto"
          />
        </div>
        
        {/* Overlay text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 bg-black/40">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-center px-4 drop-shadow-lg">
            Luxury Vacation Rentals
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl text-center px-6 mb-8 drop-shadow-md">
            Experience the perfect blend of comfort and elegance in our premium Laredo properties
          </p>
          <a 
            href="#browse-rentals" 
            className="bg-white text-black hover:bg-gray-100 transition px-8 py-3 rounded-full font-semibold text-lg shadow-lg"
          >
            Browse Rentals
          </a>
        </div>
      </div>
    </section>
  );
}

export default AirbnbHero;