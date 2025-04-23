import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  
  // Enhanced parallax effect on scroll using GSAP ScrollTrigger
  useEffect(() => {
    if (!sectionRef.current) return;
    
    // Create main parallax effect for the hero section
    const parallaxEffect = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
        markers: false
      }
    });
    
    // Add parallax movement to background images
    document.querySelectorAll(".parallax-bg").forEach(bg => {
      parallaxEffect.to(bg, {
        y: 100,
        scale: 1.1,
        ease: "none"
      }, 0);
    });
    
    // Add subtle scale effect to the hero section
    parallaxEffect.to(sectionRef.current, {
      scale: 0.98,
      ease: "none"
    }, 0);
    
    // Create smoother content movement effect
    if (contentRef.current) {
      parallaxEffect.to(contentRef.current, {
        y: -50,
        opacity: 0.8,
        ease: "power1.inOut"
      }, 0);
    }
    
    // No floating logo effect since it's been removed
    
    return () => {
      // Clean up all ScrollTrigger instances when component unmounts
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  // Enhanced hover effects for the Hero section
  useEffect(() => {
    if (!sectionRef.current) return;
    
    // Enhanced hover zoom effect for the entire hero section
    const handleMouseEnter = () => {
      // Add subtle scale to the hero section
      gsap.to(sectionRef.current, { 
        scale: 1.03, 
        duration: 0.7, 
        ease: "power2.out" 
      });
      
      // Add parallax effect to background images on hover
      document.querySelectorAll(".parallax-bg").forEach(bg => {
        gsap.to(bg, {
          scale: 1.08,
          duration: 1.5,
          ease: "power1.out"
        });
      });
      
      // Add glow effect to decorative elements
      document.querySelectorAll(".bg-secondary\\/10, .bg-primary\\/10").forEach(element => {
        gsap.to(element, {
          boxShadow: "0 0 30px rgba(255, 255, 255, 0.3)",
          filter: "blur(35px)",
          duration: 1,
          ease: "power2.out"
        });
      });
      
      // Enhance content visibility
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          y: -10,
          duration: 0.8,
          ease: "power2.out"
        });
      }
    };
    
    // Reset all effects on mouse leave
    const handleMouseLeave = () => {
      gsap.to(sectionRef.current, { 
        scale: 1, 
        duration: 0.7, 
        ease: "power2.out" 
      });
      
      document.querySelectorAll(".parallax-bg").forEach(bg => {
        gsap.to(bg, {
          scale: 1,
          duration: 1.5,
          ease: "power1.out"
        });
      });
      
      document.querySelectorAll(".bg-secondary\\/10, .bg-primary\\/10").forEach(element => {
        gsap.to(element, {
          boxShadow: "none",
          filter: "blur(30px)",
          duration: 1,
          ease: "power2.out"
        });
      });
      
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          y: 0,
          duration: 0.8,
          ease: "power2.out"
        });
      }
    };
    
    // Add mouse move parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position as percentage of viewport
      const mouseX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const mouseY = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
      
      // Apply subtle parallax to background images
      document.querySelectorAll(".parallax-bg").forEach(bg => {
        gsap.to(bg, {
          x: mouseX * 20,
          y: mouseY * 20,
          duration: 1,
          ease: "power1.out",
          overwrite: "auto"
        });
      });
      
      // Move decorative elements in opposite direction
      document.querySelectorAll(".bg-secondary\\/10").forEach(element => {
        gsap.to(element, {
          x: -mouseX * 30,
          y: -mouseY * 30,
          duration: 1.2,
          ease: "power1.out",
          overwrite: "auto"
        });
      });
      
      document.querySelectorAll(".bg-primary\\/10").forEach(element => {
        gsap.to(element, {
          x: -mouseX * 40,
          y: -mouseY * 40,
          duration: 1.2,
          ease: "power1.out",
          overwrite: "auto"
        });
      });
    };
    
    // Add event listeners
    sectionRef.current.addEventListener('mouseenter', handleMouseEnter);
    sectionRef.current.addEventListener('mouseleave', handleMouseLeave);
    sectionRef.current.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup
    return () => {
      if (sectionRef.current) {
        sectionRef.current.removeEventListener('mouseenter', handleMouseEnter);
        sectionRef.current.removeEventListener('mouseleave', handleMouseLeave);
        sectionRef.current.removeEventListener('mousemove', handleMouseMove);
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
      
      {/* Decorative elements with hardware acceleration - improved positioning for mobile */}
      <div 
        className="absolute top-32 right-16 w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-secondary/10 blur-3xl animate-float hidden sm:block"
        style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      ></div>
      <div 
        className="absolute bottom-24 left-16 w-32 sm:w-48 h-32 sm:h-48 rounded-full bg-primary/10 blur-3xl animate-float hidden sm:block" 
        style={{ animationDelay: "2s", willChange: 'transform', transform: 'translateZ(0)' }}
      ></div>
      
      {/* Mobile-specific smaller decorative elements */}
      <div 
        className="absolute top-20 right-8 w-16 h-16 rounded-full bg-secondary/5 blur-2xl animate-float sm:hidden opacity-30"
        style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      ></div>
      <div 
        className="absolute bottom-32 left-4 w-20 h-20 rounded-full bg-primary/5 blur-2xl animate-float sm:hidden opacity-30" 
        style={{ animationDelay: "1.5s", willChange: 'transform', transform: 'translateZ(0)' }}
      ></div>
      
      {/* Removed background logo */}
      
      {/* Content - completely rebuilt for mobile */}
      <div className="container mx-auto px-4 relative z-20 py-2 md:py-8" ref={contentRef}>
        <div className="max-w-3xl mt-12 sm:mt-0">
          <div className="mb-4 opacity-90">
            <span className="inline-block px-4 py-1 bg-secondary/90 text-white rounded-full text-sm tracking-wide font-semibold shadow-lg animate-slide-down backdrop-blur-sm">
              OHANA REALTY - ESTABLISHED IN LAREDO
            </span>
          </div>
          
          <h1 
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6 animate-slide-up text-shadow"
            style={{ willChange: 'transform, opacity' }}
          >
            Find Your Dream Property in Laredo with <span className="text-secondary block sm:inline">Ohana Realty</span>
          </h1>
          
          <p 
            className="text-white/90 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl animate-slide-up" 
            style={{ animationDelay: "0.2s", willChange: 'transform, opacity' }}
          >
            Expert guidance from Valentin Cuellar to make your real estate journey seamless and successful.
          </p>
          
          <div 
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-slide-up w-full sm:w-auto" 
            style={{ animationDelay: "0.4s", willChange: 'transform, opacity' }}
          >
            <Link href="/properties" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-base font-medium bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/80 hover:to-secondary text-white shadow-lg hover:shadow-xl transition-all duration-300 group transform-gpu"
                onClick={() => window.scrollTo(0, 0)}
              >
                <span>Explore Listings</span>
                <i className='bx bx-right-arrow-alt ml-2 transform transition-transform duration-300 group-hover:translate-x-1'></i>
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white bg-transparent hover:bg-white/10 text-white hover:text-white w-full sm:w-auto text-base font-medium backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform-gpu"
                onClick={() => window.scrollTo(0, 0)}
              >
                <span className="hidden sm:inline">Contact Valentin Cuellar</span>
                <span className="sm:hidden">Contact Us</span>
              </Button>
            </Link>
          </div>
          
          {/* Stats or badges - completely redesigned for mobile */}
          <div 
            className="mt-6 sm:mt-8 md:mt-10 animate-slide-up" 
            style={{ animationDelay: "0.6s", willChange: 'transform, opacity' }}
          >
            {/* Grid layout for mobile, flex for desktop */}
            <div className="grid grid-cols-3 sm:flex sm:flex-wrap sm:justify-start gap-2 sm:gap-3 md:gap-6">
              {/* Each stat box with fixed width and proper spacing */}
              <div className="bg-white/10 backdrop-blur-sm p-2 md:p-3 rounded-lg transform-gpu hover:translate-y-[-2px] transition-transform duration-300 w-[90px] sm:min-w-[100px] text-center">
                <p className="text-secondary font-bold text-lg sm:text-xl md:text-2xl">27+</p>
                <p className="text-white text-xs md:text-sm whitespace-nowrap">Years Exp.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-2 md:p-3 rounded-lg transform-gpu hover:translate-y-[-2px] transition-transform duration-300 w-[90px] sm:min-w-[100px] text-center">
                <p className="text-secondary font-bold text-lg sm:text-xl md:text-2xl">150+</p>
                <p className="text-white text-xs md:text-sm whitespace-nowrap">Properties</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-2 md:p-3 rounded-lg transform-gpu hover:translate-y-[-2px] transition-transform duration-300 w-[90px] sm:min-w-[100px] text-center">
                <p className="text-secondary font-bold text-lg sm:text-xl md:text-2xl">100%</p>
                <p className="text-white text-xs md:text-sm whitespace-nowrap">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator removed as requested */}
    </section>
  );
}
