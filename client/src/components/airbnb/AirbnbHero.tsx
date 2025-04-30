import React from 'react';

export function AirbnbHero() {
  // Title overlay content
  const title = "Vacation Rentals in Laredo";
  const subtitle = "Experience luxury and comfort in our hand-picked properties";

  return (
    <section className="relative w-full">
      {/* Video Background - Full screen with autoplay */}
      <div className="w-full h-[80vh] overflow-hidden relative rounded-lg">
        {/* Using iframe to embed our custom video player */}
        <iframe 
          src="/plyr-video.html" 
          className="absolute inset-0 w-full h-full border-0" 
          title="Ohana Realty Video" 
          allow="autoplay; fullscreen"
        ></iframe>
        
        {/* Text overlay - Centered with dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 flex flex-col items-center justify-center text-white p-4 pointer-events-none">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-center mb-4 drop-shadow-md">{title}</h1>
          <p className="text-xl md:text-2xl text-center max-w-2xl mx-auto drop-shadow-md">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}

export default AirbnbHero;