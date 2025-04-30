import React from 'react';
import OhanaVideoPlayer from '@/components/ui/OhanaVideoPlayer';

export function AirbnbHero() {
  return (
    <section className="relative w-full">
      <div className="w-full h-[90vh] overflow-hidden relative bg-black">
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <OhanaVideoPlayer
            src="/api/video/ohana"
            autoPlay={true}
            muted={false}
            loop={true}
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Small scroll indicator at bottom */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <a 
            href="#browse-rentals" 
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm transition rounded-full w-10 h-10 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

export default AirbnbHero;