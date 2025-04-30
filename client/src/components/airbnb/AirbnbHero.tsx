import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import { Link } from 'wouter';
import { VideoPlayer } from '@/components/ui/video-player';

// Debug function to check if video exists
const checkVideoExists = (videoUrl: string) => {
  console.log(`Checking if video exists at: ${videoUrl}`);
  
  fetch(videoUrl, { method: 'HEAD' })
    .then(response => {
      if (response.ok) {
        console.log(`✅ Video exists at: ${videoUrl}`);
        console.log(`Content-Type: ${response.headers.get('content-type')}`);
        console.log(`Content-Length: ${response.headers.get('content-length')}`);
      } else {
        console.error(`❌ Video not found at: ${videoUrl}, status: ${response.status}`);
      }
    })
    .catch(error => {
      console.error(`❌ Error checking video: ${error}`);
    });
};

export function AirbnbHero() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  // Check if device is likely mobile based on screen width
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on mount
    checkMobile();
    
    // Check on resize
    window.addEventListener('resize', checkMobile);
    
    // Debug: Check if video exists at specified path
    checkVideoExists('/videos/property-showcase.mp4');
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return (
    <section className="relative w-full">
      {/* Video Background */}
      <div className="w-full h-[60vh] md:h-[80vh] overflow-hidden relative">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/30 to-black/80 pointer-events-none"></div>
        
        <VideoPlayer
          src="/videos/property-showcase.mp4"
          autoPlay={!isMobile}
          muted={true}
          loop={true}
          controls={false}
          className="w-full h-full object-cover"
          onLoadedData={() => setVideoLoaded(true)}
        />
        
        {/* Content overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center p-4 md:p-8">
          <div className="max-w-4xl">
            <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 drop-shadow-lg font-serif">
              Find Your Perfect Vacation Rental
            </h1>
            <p className="text-white/90 text-base md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto drop-shadow-md">
              Experience Laredo like a local with our premium vacation rentals. From cozy condos to spacious family homes, we have the perfect space for your stay.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/airbnb">
                <Button size="lg" className="gap-2 min-w-[200px]">
                  Browse Rentals <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 hover:text-white min-w-[200px]">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats section below video */}
      <div className="bg-primary/90 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-bold">100%</span>
            <span className="text-sm md:text-base mt-1">Satisfaction Rate</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-bold">20+</span>
            <span className="text-sm md:text-base mt-1">Premium Properties</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-bold">4.9</span>
            <span className="text-sm md:text-base mt-1">Average Rating</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-bold">24/7</span>
            <span className="text-sm md:text-base mt-1">Customer Support</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AirbnbHero;