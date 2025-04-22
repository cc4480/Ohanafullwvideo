import React, { useEffect, useRef } from 'react';
import logoImg from "@assets/OIP.jfif";
import { gsap } from "gsap";

/**
 * BackgroundLogo component that displays the logo as a background on all pages
 * with floating animation and effects
 */
export default function BackgroundLogo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  
  // Add effect for subtle mouse movement
  useEffect(() => {
    if (!logoRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const mouseY = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
      
      gsap.to(logoRef.current, {
        x: mouseX * 20,
        y: mouseY * 20,
        rotation: mouseX * 2,
        duration: 1.5,
        ease: "power1.out",
        overwrite: "auto"
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]"
    >
      {/* Main centered logo */}
      <div 
        ref={logoRef}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px]"
        style={{
          opacity: 0.08,
          willChange: 'transform, opacity, rotation',
          animation: 'floatSlow 15s infinite ease-in-out'
        }}
      >
        <img 
          src={logoImg} 
          alt="Ohana Realty Logo Background" 
          className="w-full h-full object-contain transform-gpu"
          style={{ 
            filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.3))',
          }}
        />
      </div>
      
      {/* Secondary logo for additional depth - rotated slightly */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rotate-[10deg]"
        style={{
          opacity: 0.04,
          willChange: 'transform, opacity',
          animation: 'floatSlow 20s infinite ease-in-out reverse'
        }}
      >
        <img 
          src={logoImg} 
          alt="Ohana Realty Logo Background Secondary" 
          className="w-full h-full object-contain transform-gpu"
          style={{ 
            filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.2))',
          }}
        />
      </div>
      
      {/* Third logo for additional depth - smaller and rotated differently */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rotate-[-5deg]"
        style={{
          opacity: 0.03,
          willChange: 'transform, opacity',
          animation: 'floatSlow 25s infinite ease-in-out'
        }}
      >
        <img 
          src={logoImg} 
          alt="Ohana Realty Logo Background Tertiary" 
          className="w-full h-full object-contain transform-gpu"
          style={{ 
            filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.15))',
          }}
        />
      </div>
    </div>
  );
}