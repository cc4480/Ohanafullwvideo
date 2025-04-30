import React from 'react';

export function AirbnbHero() {
  return (
    <section className="relative w-full">
      <div className="w-full h-[80vh] overflow-hidden relative">
        <div 
          className="absolute inset-0 w-full h-full" 
          dangerouslySetInnerHTML={{
            __html: `
              <video
                style="width: 100%; height: 100%; object-fit: cover;"
                src="/OHANAVIDEOMASTER.mp4"
                muted
                autoplay
                loop
                playsinline
              ></video>
            `
          }} 
        />
      </div>
    </section>
  );
}

export default AirbnbHero;