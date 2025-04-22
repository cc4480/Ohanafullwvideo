import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface FloatingLogoProps {
  /**
   * URL to the logo image
   */
  logoUrl: string;
  
  /**
   * CSS class for additional styling
   */
  className?: string;
  
  /**
   * Alternative text for the logo
   */
  alt?: string;
  
  /**
   * Animation intensity (0-1), defaults to 0.5
   */
  intensity?: number;
  
  /**
   * Should the animation play in dark mode
   */
  darkModeEnabled?: boolean;
}

/**
 * Floating logo component with smooth animation
 * Uses GSAP for premium quality effects
 */
export default function FloatingLogo({
  logoUrl,
  className = '',
  alt = 'Ohana Realty logo',
  intensity = 0.5,
  darkModeEnabled = true
}: FloatingLogoProps) {
  const logoRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  
  // Scale the animation intensity (0-1) to reasonable movement values
  const moveAmount = 15 * intensity;
  const rotateAmount = 2 * intensity;
  
  useEffect(() => {
    const logo = logoRef.current;
    
    if (!logo) return;
    
    // Initialize GSAP animation
    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });
    
    // Create smooth floating animation
    tl.to(logo, {
      y: moveAmount,
      x: moveAmount / 2,
      rotation: rotateAmount,
      duration: 6,
      ease: "sine.inOut"
    })
    .to(logo, {
      y: -moveAmount,
      x: -moveAmount / 2,
      rotation: -rotateAmount,
      duration: 6,
      ease: "sine.inOut"
    });
    
    // Store timeline reference for cleanup
    animationRef.current = tl;
    
    // Cleanup animation on component unmount
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [moveAmount, rotateAmount]);
  
  // Add mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!logoRef.current) return;
      
      // Calculate mouse position as percentage of viewport
      const mouseX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const mouseY = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
      
      // Apply subtle parallax movement based on mouse position
      gsap.to(logoRef.current, {
        x: mouseX * (moveAmount * 0.5),
        y: mouseY * (moveAmount * 0.5),
        duration: 1,
        ease: "power1.out",
        overwrite: "auto"
      });
    };
    
    // Add mouse move listener
    window.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [moveAmount]);
  
  return (
    <div 
      ref={logoRef}
      className={`absolute z-1 opacity-10 transform-gpu will-change-transform ${className}`}
      style={{
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      <img 
        src={logoUrl} 
        alt={alt}
        className="w-full h-full object-contain transform-gpu"
        style={{
          filter: 'brightness(1.2) contrast(0.9)',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      />
    </div>
  );
}