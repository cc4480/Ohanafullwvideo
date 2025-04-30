import React from 'react';

export function AirbnbHero() {
  return (
    <section className="relative w-full">
      <div className="w-full h-[80vh] overflow-hidden relative">
        <div className="absolute inset-0 w-full h-full">
          <video
            src="/OHANAVIDEOMASTER.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export default AirbnbHero;