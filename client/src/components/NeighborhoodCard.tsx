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
      className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg overflow-hidden shadow-md group will-change-transform orange-glow-border`}
    >
      <div 
        ref={imageContainerRef}
        className="h-48 overflow-hidden relative bg-slate-100 dark:bg-slate-700"
      >
        {neighborhood.image ? (
          <img 
            src={neighborhood.image} 
            alt={neighborhood.name} 
            className="w-full h-full object-cover transform-gpu will-change-transform"
            style={{ transformOrigin: 'center center' }}
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
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-16"></div>
        <div 
          ref={tagRef}
          className="absolute bottom-2 left-2 will-change-transform"
          style={{ transformOrigin: 'center center' }}
        >
          <span className={`bg-primary text-white text-xs px-2 py-1 rounded-sm`}>
            {neighborhood.features?.[0] || "Laredo"}
          </span>
        </div>
      </div>
      <div ref={contentRef} className="p-6">
        <h3 
          ref={titleRef}
          className={`font-serif text-xl font-bold ${isDarkMode ? 'text-white' : 'text-foreground'} mb-2 transition-colors`}
        >
          {neighborhood.name}
        </h3>
        <p className={`${isDarkMode ? 'text-slate-300' : 'text-muted-foreground'} mb-4`}>
          {neighborhood.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {neighborhood.features?.map((feature, index) => (
            <span 
              key={index} 
              className={`${isDarkMode 
                ? 'bg-slate-700 text-slate-200' 
                : 'bg-neutral-100 text-neutral-700'} 
                text-sm px-3 py-1 rounded-full transition-all duration-300`}
            >
              {feature}
            </span>
          ))}
        </div>
        <a 
          ref={linkRef}
          href="#" 
          className="flex items-center text-primary font-medium hover:text-primary-dark will-change-transform"
          style={{ transformOrigin: 'left center' }}
        >
          Learn More
          <ArrowRight className="h-4 w-4 ml-1 will-change-transform" />
        </a>
      </div>
    </div>
  );
}
