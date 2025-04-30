import React from 'react';
import OhanaVideoPlayer from '../ui/OhanaVideoPlayer';

export function AirbnbHero() {
  return (
    <section className="relative w-full">
      <div className="w-full h-[80vh] overflow-hidden relative">
        <div className="absolute inset-0 w-full h-full">
          <OhanaVideoPlayer
            src="/api/video/ohana"
            autoPlay={true}
            muted={true}
            loop={true}
            className="w-full h-full"
            onError={(error) => console.error("Video error:", error)}
          />
        </div>
      </div>
    </section>
  );
}

export default AirbnbHero;