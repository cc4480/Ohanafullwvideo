import React from 'react';

export function AirbnbHero() {
  return (
    <section className="relative w-full">
      <div className="w-full h-[80vh] overflow-hidden relative">
        <div className="absolute inset-0 w-full h-full">
          <video controls autoPlay width="100%">
            <source src="/videos/OHANAVIDEOMASTER.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
}

export default AirbnbHero;