import { Neighborhood } from "@shared/schema";
import { ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

interface NeighborhoodCardProps {
  neighborhood: Neighborhood;
}

export default function NeighborhoodCard({ neighborhood }: NeighborhoodCardProps) {
  // Simple theme detection as fallback
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Refs for animation targets
  const cardRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  
  // Setup animations
  useEffect(() => {
    const card = cardRef.current;
    const imageContainer = imageContainerRef.current;
    const title = titleRef.current;
    const tag = tagRef.current;
    const link = linkRef.current;
    
    if (!card || !imageContainer || !title || !tag || !link) return;
    
    // Create subtle hover animations
    const handleMouseEnter = () => {
      // Card lift and glow effect
      gsap.to(card, {
        y: -8,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        duration: 0.4,
        ease: 'power2.out'
      });
      
      // Image scale effect (already handled by Tailwind, but we can enhance it)
      gsap.to(imageContainer.querySelector('img'), {
        scale: 1.08,
        duration: 0.8,
        ease: 'power1.out'
      });
      
      // Title color shift
      gsap.to(title, {
        color: 'var(--primary)',
        duration: 0.3
      });
      
      // Tag animation
      gsap.to(tag, {
        y: -4,
        scale: 1.05,
        duration: 0.3,
        ease: 'back.out'
      });
      
      // Link animation
      gsap.to(link, {
        x: 5,
        fontWeight: 700,
        duration: 0.3,
        ease: 'power1.out'
      });
      
      // Arrow animation
      gsap.to(link.querySelector('svg'), {
        x: 3,
        duration: 0.3,
        ease: 'power1.out'
      });
    };
    
    // Reset animations on mouse leave
    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        duration: 0.4,
        ease: 'power2.out'
      });
      
      gsap.to(imageContainer.querySelector('img'), {
        scale: 1,
        duration: 0.5,
        ease: 'power1.out'
      });
      
      gsap.to(title, {
        color: isDarkMode ? 'white' : 'var(--foreground)',
        duration: 0.3
      });
      
      gsap.to(tag, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power1.inOut'
      });
      
      gsap.to(link, {
        x: 0,
        fontWeight: 500,
        duration: 0.3,
        ease: 'power1.inOut'
      });
      
      gsap.to(link.querySelector('svg'), {
        x: 0,
        duration: 0.3,
        ease: 'power1.inOut'
      });
    };
    
    // Add event listeners
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    // Clean up event listeners on unmount
    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDarkMode]);
  
  useEffect(() => {
    // Check for dark mode preference
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setIsDarkMode(isDark);
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div 
      ref={cardRef}
      className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg overflow-hidden shadow-md group card-hover-effect card-accent-top transform-gpu`}
      style={{
        boxShadow: 'var(--card-shadow)',
      }}
    >
      <div 
        ref={imageContainerRef}
        className="h-48 overflow-hidden relative bg-slate-100 dark:bg-slate-700"
      >
        {neighborhood.image ? (
          <img 
            src={neighborhood.image} 
            alt={neighborhood.name} 
            className="w-full h-full object-cover transform-gpu will-change-transform transition-transform duration-700 group-hover:scale-110"
            style={{ 
              transformOrigin: 'center center',
              backfaceVisibility: 'hidden'
            }}
            loading="lazy"
            onError={(e) => {
              // Fallback for failed images
              (e.target as HTMLImageElement).src = "https://placehold.co/600x400/slate/white?text=Ohana+Realty";
              (e.target as HTMLImageElement).alt = "Image not available";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-700">
            <span className="text-muted-foreground">No image available</span>
          </div>
        )}
        {/* Enhanced gradient overlay with smoother transition */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-60 group-hover:opacity-75 transition-opacity duration-500"></div>
        
        {/* Neighborhood tag with premium effect */}
        <div 
          ref={tagRef}
          className="absolute bottom-3 left-3 will-change-transform transition-all duration-500 transform-gpu translate-y-0 group-hover:-translate-y-1 group-hover:scale-105 z-10"
        >
          <span className={`bg-primary text-white text-xs px-3 py-1.5 rounded-md shadow-lg backdrop-blur-sm highlight-pulse`}>
            {neighborhood.features?.[0] || "Laredo"}
          </span>
        </div>
        
        {/* New badge in top-right corner */}
        <div className="absolute top-3 right-3 transition-all duration-500 transform-gpu scale-90 group-hover:scale-100 z-10">
          <div className="bg-secondary/90 text-white text-xs px-2 py-1 rounded-full shadow-lg backdrop-blur-sm rotate-3 transform-gpu">
            Featured
          </div>
        </div>
      </div>
      <div ref={contentRef} className="p-6 relative">
        {/* Corner decoration for visual interest */}
        <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden pointer-events-none">
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rotate-45 transform-gpu origin-bottom-left group-hover:from-primary/30 group-hover:to-primary/10 transition-colors duration-500"></div>
        </div>
        
        <h3 
          ref={titleRef}
          className={`font-serif text-xl font-bold ${isDarkMode ? 'text-white' : 'text-foreground'} mb-2 transition-colors gradient-text`}
        >
          {neighborhood.name}
        </h3>
        <p className={`${isDarkMode ? 'text-slate-300' : 'text-muted-foreground'} mb-4 line-clamp-2`}>
          {neighborhood.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {neighborhood.features?.map((feature, index) => (
            <span 
              key={index} 
              className={`${isDarkMode 
                ? 'bg-slate-700 text-slate-200' 
                : 'bg-neutral-100 text-neutral-700'} 
                text-sm px-3 py-1 rounded-full transition-all duration-300 transform-gpu
                hover:scale-105 hover:shadow-md group-hover:translate-x-1 group-hover:delay-${index * 100}`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {feature}
            </span>
          ))}
        </div>
        <a 
          ref={linkRef}
          href="#" 
          className="flex items-center text-primary font-medium hover:text-primary-dark will-change-transform button-premium inline-block py-1.5 px-3 rounded-md transition-all duration-300 transform-gpu group-hover:shadow-md"
          style={{ transformOrigin: 'left center' }}
        >
          <span className="mr-1.5">Learn More</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-500 transform-gpu group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
}
