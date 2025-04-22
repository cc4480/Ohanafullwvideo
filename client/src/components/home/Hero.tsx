import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FloatingLogo from "./FloatingLogo";

// Import logo for background effect
import logoImg from "@assets/OIP.jfif";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Define carousel images with high quality settings - improved for crystal clear images
const carouselImages = [
  {
    url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=100&w=1920&auto=format&fit=crop",
    alt: "Luxury home exterior"
  },
  {
    url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=100&w=1920&auto=format&fit=crop",
    alt: "Modern residential house"
  },
  {
    url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=100&w=1920&auto=format&fit=crop",
    alt: "Elegant property with pool"
  },
  {
    url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=100&w=1920&auto=format&fit=crop",
    alt: "Contemporary home design"
  }
];

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
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
  
  // Setup parallax effect on scroll
  useEffect(() => {
    if (!sectionRef.current) return;
    
    // Create parallax effect for the hero section
    const parallaxEffect = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
    
    // Add parallax movement to various elements
    parallaxEffect.to(".parallax-bg", {
      y: 100,
      ease: "none"
    }, 0);
    
    // Add subtle scale effect to the hero section
    parallaxEffect.to(sectionRef.current, {
      scale: 0.95,
      ease: "none"
    }, 0);
    
    // Scale and fade content on scroll
    if (contentRef.current) {
      parallaxEffect.to(contentRef.current, {
        y: -30,
        opacity: 0.5,
        ease: "none"
      }, 0);
    }
    
    return () => {
      // Clean up ScrollTrigger when component unmounts
      if (parallaxEffect.scrollTrigger) {
        parallaxEffect.scrollTrigger.kill();
      }
    };
  }, []);
  
  // Setup hover effects
  useEffect(() => {
    if (!sectionRef.current) return;
    
    // The hover zoom effect for the whole hero section
    const handleMouseEnter = () => {
      gsap.to(sectionRef.current, { 
        scale: 1.02, 
        duration: 0.5, 
        ease: "power2.out" 
      });
    };
    
    const handleMouseLeave = () => {
      gsap.to(sectionRef.current, { 
        scale: 1, 
        duration: 0.5, 
        ease: "power2.out" 
      });
    };
    
    // Add event listeners
    sectionRef.current.addEventListener('mouseenter', handleMouseEnter);
    sectionRef.current.addEventListener('mouseleave', handleMouseLeave);
    
    // Cleanup
    return () => {
      if (sectionRef.current) {
        sectionRef.current.removeEventListener('mouseenter', handleMouseEnter);
        sectionRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);
  
  return (
    <section 
      ref={sectionRef}
      className="relative bg-neutral-900 h-screen flex items-center overflow-hidden transition-transform duration-500 ease-out"
      style={{ 
        transformOrigin: 'center center',
        willChange: 'transform, scale'
      }}>
      {/* Background image carousel with crystal clear images and minimal overlays */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Simplified overlay for better image clarity */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/20 z-10"></div>
        
        {/* Removed animated grain texture for crystal clear images */}
        
        {/* Optimized carousel container with hardware acceleration */}
        <div className="absolute inset-0 transform-gpu">
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
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden',
                  transform: 'translate3d(0,0,0)'
                }}
              >
                <img 
                  src={image.url} 
                  alt={image.alt} 
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover transform-gpu parallax-bg"
                  style={{ 
                    imageRendering: 'auto',
                    willChange: 'transform',
                    transform: 'translate3d(0,0,0)',
                    WebkitBackfaceVisibility: 'hidden',
                    backfaceVisibility: 'hidden',
                    filter: 'none'
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
        
        {/* Carousel indicators */}
        <div className="absolute bottom-20 left-0 right-0 z-20 flex justify-center gap-2">
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
      
      {/* Floating Logo in background */}
      <FloatingLogo 
        logoUrl={logoImg}
        className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 z-5"
        intensity={0.7}
      />
      
      {/* Content - completely rebuilt for mobile */}
      <div className="container mx-auto px-4 relative z-20 py-2 md:py-8" ref={contentRef}>
        <div className="max-w-3xl mt-12 sm:mt-0">
          <div className="mb-4 opacity-90">
            <span className="inline-block px-4 py-1 bg-secondary/90 text-white rounded-full text-sm tracking-wide font-semibold shadow-lg animate-slide-down backdrop-blur-sm">
              OHANA REALTY - ESTABLISHED IN LAREDO
            </span>
          </div>
          
          <h1 
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-slide-up text-shadow"
            style={{ willChange: 'transform, opacity' }}
          >
            Find Your Dream Property in Laredo with <span className="text-secondary">Ohana Realty</span>
          </h1>
          
          <p 
            className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl animate-slide-up" 
            style={{ animationDelay: "0.2s", willChange: 'transform, opacity' }}
          >
            Expert guidance from Valentin Cuellar to make your real estate journey seamless and successful.
          </p>
          
          <div 
            className="flex flex-col sm:flex-row gap-4 animate-slide-up" 
            style={{ animationDelay: "0.4s", willChange: 'transform, opacity' }}
          >
            <Link href="/properties">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-base font-medium bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/80 hover:to-secondary text-white shadow-lg hover:shadow-xl transition-all duration-300 group transform-gpu"
                onClick={() => window.scrollTo(0, 0)}
              >
                <span>Explore Listings</span>
                <i className='bx bx-right-arrow-alt ml-2 transform transition-transform duration-300 group-hover:translate-x-1'></i>
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white bg-transparent hover:bg-white/10 text-white hover:text-white w-full sm:w-auto text-base font-medium backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform-gpu"
                onClick={() => window.scrollTo(0, 0)}
              >
                Contact Valentin Cuellar
              </Button>
            </Link>
          </div>
          
          {/* Stats or badges - improved for mobile */}
          <div 
            className="mt-8 md:mt-10 flex flex-wrap gap-3 md:gap-6 animate-slide-up" 
            style={{ animationDelay: "0.6s", willChange: 'transform, opacity' }}
          >
            <div className="bg-white/10 backdrop-blur-sm p-2 md:p-3 rounded-lg transform-gpu hover:translate-y-[-2px] transition-transform duration-300">
              <p className="text-secondary font-bold text-xl md:text-2xl">27+</p>
              <p className="text-white text-xs md:text-sm">Years Experience</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-2 md:p-3 rounded-lg transform-gpu hover:translate-y-[-2px] transition-transform duration-300">
              <p className="text-secondary font-bold text-xl md:text-2xl">150+</p>
              <p className="text-white text-xs md:text-sm">Properties Sold</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-2 md:p-3 rounded-lg transform-gpu hover:translate-y-[-2px] transition-transform duration-300">
              <p className="text-secondary font-bold text-xl md:text-2xl">100%</p>
              <p className="text-white text-xs md:text-sm">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator with hardware acceleration */}
      <div 
        className="absolute bottom-8 left-0 right-0 flex justify-center z-20 animate-bounce"
        style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      >
        <button 
          onClick={() => {
            const featuredElement = document.getElementById('featured-properties');
            if (featuredElement) {
              featuredElement.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="text-white bg-white/10 backdrop-blur-sm p-2 rounded-full hover:bg-white/20 transition-all duration-300 shadow-lg transform-gpu"
          style={{ WebkitTapHighlightColor: 'transparent' }}
          aria-label="Scroll to featured properties"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
