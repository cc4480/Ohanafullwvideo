import React from 'react';

export function AirbnbHero() {
  return (
    <section className="relative w-full">
      <div className="w-full h-[80vh] overflow-hidden relative">
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            controls
            width="100%"
            height="100%"
            style={{ objectFit: 'cover' }}
          >
            <source src="/OHANAVIDEOMASTER.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
}

export default AirbnbHero;