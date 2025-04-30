import { useRef } from 'react';

export function AirbnbHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Simple video file
  const videoUrl = "/property-video.mp4";

  // Title overlay content
  const title = "Vacation Rentals in Laredo";
  const subtitle = "Experience luxury and comfort in our hand-picked properties";

  return (
    <section className="relative w-full">
      {/* Video Background - Full screen with autoplay */}
      <div className="w-full h-[80vh] overflow-hidden relative rounded-lg">
        {/* Video container */}
        <div className="absolute inset-0">
          {/* Direct video embed with autoplay */}
          <video
            ref={videoRef}
            src={videoUrl}
            autoPlay={true}
            muted={true}
            loop={true}
            playsInline
            controls={false}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Text overlay - Centered with dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 flex flex-col items-center justify-center text-white p-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-center mb-4 drop-shadow-md">{title}</h1>
          <p className="text-xl md:text-2xl text-center max-w-2xl mx-auto drop-shadow-md">{subtitle}</p>
        </div>
        
        {/* Bottom video controls indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <div className="h-full w-full bg-primary/50 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}

export default AirbnbHero;