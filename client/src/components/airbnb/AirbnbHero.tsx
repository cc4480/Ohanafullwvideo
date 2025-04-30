import React from 'react';

export function AirbnbHero() {
  // Title overlay content
  const title = "Vacation Rentals in Laredo";
  const subtitle = "Experience luxury and comfort in our hand-picked properties";

  return (
    <section className="relative w-full">
      {/* Image-based Hero Section */}
      <div className="w-full h-[80vh] overflow-hidden relative rounded-lg">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: "url('/images/backgrounds/real-estate-bg.jpg')",
            backgroundRepeat: "no-repeat"
          }}
        ></div>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-40"></div>
        
        {/* Text overlay - Centered with dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 flex flex-col items-center justify-center text-white p-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-center mb-4 drop-shadow-md">{title}</h1>
          <p className="text-xl md:text-2xl text-center max-w-2xl mx-auto drop-shadow-md">{subtitle}</p>
          
          {/* Call to action button */}
          <a 
            href="/properties" 
            className="mt-8 inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 md:py-4 md:text-lg md:px-10 transition-all"
          >
            Browse Properties
          </a>
        </div>
      </div>
    </section>
  );
}

export default AirbnbHero;