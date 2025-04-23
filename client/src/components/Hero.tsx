import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { useMobile } from "@/hooks/use-mobile";

// Define carousel images with optimized sizes and loading
const carouselImages = [
  {
    url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=75&w=1280&auto=format&fit=crop",
    alt: "Luxury home exterior"
  },
  {
    url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=75&w=1280&auto=format&fit=crop",
    alt: "Modern residential house"
  },
  {
    url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=75&w=1280&auto=format&fit=crop",
    alt: "Elegant property with pool"
  },
  {
    url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=75&w=1280&auto=format&fit=crop",
    alt: "Contemporary home design"
  }
];

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Use mobile detection
  const { isMobile, isTouchDevice } = useMobile();
  
  // Setup carousel with hardware acceleration
  useEffect(() => {
    const nextImage = () => {
      setCurrentImage(prevImage => 
        prevImage === carouselImages.length - 1 ? 0 : prevImage + 1
      );
    };
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout for smooth transition
    timeoutRef.current = setTimeout(nextImage, 5000);
    
    // Cleanup on component unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentImage]);
  
  // Advanced touch swipe handling for mobile carousels
  useEffect(() => {
    if (!isTouchDevice || !carouselRef.current) return;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartXRef.current = e.touches[0].clientX;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartXRef.current === null) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const diffX = touchStartXRef.current - touchEndX;
      
      // Detect left/right swipe (with threshold)
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          // Swipe left (next image)
          setCurrentImage(prev => (prev === carouselImages.length - 1 ? 0 : prev + 1));
        } else {
          // Swipe right (previous image)
          setCurrentImage(prev => (prev === 0 ? carouselImages.length - 1 : prev - 1));
        }
      }
      
      touchStartXRef.current = null;
    };
    
    const carouselElement = carouselRef.current;
    carouselElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    carouselElement.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      carouselElement.removeEventListener('touchstart', handleTouchStart);
      carouselElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isTouchDevice, carouselRef.current]);
  
  return (
    <section className="relative bg-neutral-900 min-h-[100svh] flex items-center">
      {/* Background image carousel and overlays - Mobile optimized */}
      <div className="absolute inset-0 z-0 overflow-hidden transform-gpu">
        {/* Enhanced gradient overlay with multiple layers - fully transparent at top for seamless header blend */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black/40 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent z-10 mix-blend-overlay"></div>
        
        {/* Animated grain texture */}
        <div className="absolute inset-0 opacity-30 z-10 bg-noise"></div>
        
        {/* Optimized carousel container with hardware acceleration */}
        <div ref={carouselRef} className="absolute inset-0 transform-gpu">
          {/* Only render current and next images for better performance */}
          {[currentImage, (currentImage + 1) % carouselImages.length].map((imageIndex) => {
            const image = carouselImages[imageIndex];
            return (
              <div 
                key={imageIndex}
                className={`
                  absolute inset-0 transition-opacity will-change-opacity transform-gpu
                  ${imageIndex === currentImage ? 'opacity-100 z-5' : 'opacity-0 z-0'}
                `}
                style={{ 
                  transition: 'opacity 1000ms cubic-bezier(0.4, 0, 0.2, 1)',
                  willChange: 'opacity',
                  backfaceVisibility: 'hidden',
                  transform: 'translate3d(0,0,0)'
                }}
              >
                <img 
                  src={image.url} 
                  alt={image.alt} 
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover transform-gpu"
                  style={{ 
                    willChange: 'transform',
                    transform: 'translate3d(0,0,0)',
                    backfaceVisibility: 'hidden'
                  }}
                />
              </div>
            );
          })}
          
          {/* Preload remaining images */}
          <div className="hidden">
            {carouselImages
              .filter((_, idx) => idx !== currentImage && idx !== (currentImage + 1) % carouselImages.length)
              .map((image, idx) => (
                <img key={idx} src={image.url} alt="" loading="lazy" className="hidden" />
              ))}
          </div>
        </div>
        
        {/* Carousel indicators - Repositioned to top of carousel to avoid any overlap issues */}
        <div className="absolute top-20 left-0 right-0 z-20 flex justify-center gap-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 transform-gpu ${
                index === currentImage 
                  ? 'bg-white scale-125 w-6' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Decorative elements with hardware acceleration */}
      <div 
        className="absolute top-32 right-16 w-32 h-32 rounded-full bg-secondary/10 blur-3xl animate-float"
        style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      ></div>
      <div 
        className="absolute bottom-24 left-16 w-48 h-48 rounded-full bg-primary/10 blur-3xl animate-float" 
        style={{ animationDelay: "2s", willChange: 'transform', transform: 'translateZ(0)' }}
      ></div>
      
      {/* Content - Mobile optimized */}
      <div className="container mx-auto px-4 relative z-20 pt-24 md:pt-36 pb-16">
        <div className="max-w-3xl mt-8 md:mt-12">
          <div className="mb-4 opacity-90">
            <span className="inline-block px-3 py-1 md:px-4 md:py-1 bg-secondary/90 text-white rounded-full text-xs md:text-sm tracking-wide font-semibold shadow-lg animate-slide-down backdrop-blur-sm transform-gpu">
              OHANA REALTY - ESTABLISHED IN LAREDO
            </span>
          </div>
          
          <h1 
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 md:mb-6 animate-slide-up text-shadow"
            style={{ 
              willChange: 'transform, opacity',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden'
            }}
          >
            Find Your Dream Property in Laredo with <span className="text-secondary">Ohana Realty</span>
          </h1>
          
          <p 
            className="text-white/90 text-base sm:text-lg md:text-xl mb-6 md:mb-8 max-w-2xl animate-slide-up" 
            style={{ 
              animationDelay: "0.2s", 
              willChange: 'transform, opacity', 
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden' 
            }}
          >
            Expert guidance from Valentin Cuellar to make your real estate journey seamless and successful.
          </p>
          
          <div 
            className="flex flex-col sm:flex-row gap-3 md:gap-4 animate-slide-up" 
            style={{ 
              animationDelay: "0.4s", 
              willChange: 'transform, opacity',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden' 
            }}
          >
            <Link href="/properties" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full h-14 md:h-auto text-base font-medium bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/80 hover:to-secondary text-white shadow-lg hover:shadow-xl transition-all duration-300 group transform-gpu orange-glow-border-intense button-press-feedback min-h-[60px] sm:min-h-[48px]"
                style={{
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent',
                  willChange: 'transform, opacity',
                  transform: 'translateZ(0)'
                }}
              >
                <span>Explore Listings</span>
                <i className='bx bx-right-arrow-alt ml-2 transform transition-transform duration-300 group-hover:translate-x-1'></i>
              </Button>
            </Link>
            <Link href="/#contact" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full h-14 md:h-auto border-2 border-white bg-transparent hover:bg-white/10 text-white hover:text-white text-base font-medium backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform-gpu orange-glow-border-subtle button-press-feedback min-h-[60px] sm:min-h-[48px]"
                style={{
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent',
                  willChange: 'transform, opacity',
                  transform: 'translateZ(0)'
                }}
              >
                Contact Valentin
              </Button>
            </Link>
          </div>
          
          {/* Stats or badges - Mobile optimized with enhanced touch feedback */}
          <div 
            className="mt-12 mb-28 sm:mb-24 md:mb-20 grid grid-cols-3 gap-3 md:gap-6 animate-slide-up" 
            style={{ 
              animationDelay: "0.6s", 
              willChange: 'transform, opacity',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden' 
            }}
          >
            {/* Enhanced mobile stat cards with larger touch targets and feedback */}
            <div 
              className="bg-white/30 backdrop-blur-md p-3 md:p-4 rounded-lg transform-gpu hover:translate-y-[-2px] transition-transform duration-300 text-center orange-glow-border-intense shadow-xl button-press-feedback active:translate-y-0.5"
              style={{
                minHeight: isMobile ? '90px' : '70px',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
                willChange: 'transform, opacity',
                transform: 'translateZ(0)'
              }}
            >
              <p className="text-secondary font-bold text-xl md:text-2xl">27+</p>
              <p className="text-white text-xs md:text-sm font-semibold">Years Exp.</p>
            </div>
            <div 
              className="bg-white/30 backdrop-blur-md p-3 md:p-4 rounded-lg transform-gpu hover:translate-y-[-2px] transition-transform duration-300 text-center orange-glow-border-intense shadow-xl button-press-feedback active:translate-y-0.5"
              style={{
                minHeight: isMobile ? '90px' : '70px',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
                willChange: 'transform, opacity',
                transform: 'translateZ(0)'
              }}
            >
              <p className="text-secondary font-bold text-xl md:text-2xl">150+</p>
              <p className="text-white text-xs md:text-sm font-semibold">Properties</p>
            </div>
            <div 
              className="bg-white/30 backdrop-blur-md p-3 md:p-4 rounded-lg transform-gpu hover:translate-y-[-2px] transition-transform duration-300 text-center orange-glow-border-intense shadow-xl button-press-feedback active:translate-y-0.5"
              style={{
                minHeight: isMobile ? '90px' : '70px',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
                willChange: 'transform, opacity',
                transform: 'translateZ(0)'
              }}
            >
              <p className="text-secondary font-bold text-xl md:text-2xl">100%</p>
              <p className="text-white text-xs md:text-sm font-semibold">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced mobile-optimized scroll indicator with better visibility and feedback */}
      <div 
        className="absolute bottom-6 md:bottom-8 left-0 right-0 flex justify-center z-20 animate-bounce"
        style={{ 
          willChange: 'transform', 
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      >
        <a 
          href="#featured-properties" 
          className="text-white bg-secondary/70 backdrop-blur-sm p-3 md:p-4 rounded-full hover:bg-secondary/90 transition-all duration-300 shadow-lg active:scale-95 transform-gpu orange-glow-border-intense button-press-feedback"
          style={{
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
            minHeight: '50px',
            minWidth: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            willChange: 'transform, opacity',
            transform: 'translateZ(0)'
          }}
          aria-label="Scroll to featured properties"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
          {/* Visual label for mobile users - better UX */}
          {isMobile && (
            <span className="sr-only">Discover Featured Properties</span>
          )}
        </a>
      </div>
    </section>
  );
}
