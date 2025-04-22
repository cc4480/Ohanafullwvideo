import React, { useEffect, useState, useRef } from 'react';
import logoImg from "../../assets/logo.svg";

/**
 * Enhanced BackgroundLogo component with parallax effect and subtle animations
 * Creates a semi-transparent overlay with dynamic visual elements
 */
export default function BackgroundLogo() {
  // State to track if the logo has loaded
  const [logoLoaded, setLogoLoaded] = useState(false);
  // State for parallax effect
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  // Reference to the container
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Setup parallax effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate the offset based on mouse position
      // Using a subtle factor (0.02) for gentle movement
      const xOffset = (clientX - innerWidth / 2) * 0.02;
      const yOffset = (clientY - innerHeight / 2) * 0.02;
      
      setOffset({ x: xOffset, y: yOffset });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-20 flex items-center justify-center overflow-hidden"
    >
      {/* Dynamic background gradient with noise texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/95 z-0">
        {/* Subtle animated noise texture */}
        <div className="absolute inset-0 bg-noise opacity-5 animate-noise"></div>
      </div>
      
      {/* Dynamic decorative light beams */}
      <div className="absolute w-full h-full opacity-20 overflow-hidden">
        {/* Top-right light beam */}
        <div 
          className="absolute top-0 right-[20%] w-[300px] h-[600px] bg-gradient-to-b from-primary/50 to-transparent rotate-[30deg] blur-3xl"
          style={{ 
            transform: `rotate(30deg) translate(${offset.x * -1.5}px, ${offset.y * -1.5}px)`,
            opacity: 0.15 + Math.sin(Date.now() * 0.001) * 0.05
          }}
        ></div>
        
        {/* Bottom-left light beam */}
        <div 
          className="absolute bottom-0 left-[25%] w-[400px] h-[700px] bg-gradient-to-t from-secondary/40 to-transparent rotate-[210deg] blur-3xl"
          style={{ 
            transform: `rotate(210deg) translate(${offset.x * 1.5}px, ${offset.y * 1.5}px)`,
            opacity: 0.1 + Math.cos(Date.now() * 0.0008) * 0.05
          }}
        ></div>
      </div>
      
      {/* Floating particles for depth */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full animate-floatSlow bg-white/5"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 15}s`
            }}
          ></div>
        ))}
      </div>
      
      {/* Enhanced logo with subtle parallax effect */}
      <div 
        className="fixed z-[21] transform-gpu"
        style={{
          width: '800px',
          height: 'auto',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: `translate(calc(-50% + ${offset.x * 0.5}px), calc(-50% + ${offset.y * 0.5}px))`,
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          perspective: '1000px'
        }}
      >
        <img 
          src={logoImg}
          alt="Ohana Realty Logo" 
          className="w-full h-auto animate-pulse-slow"
          onLoad={() => {
            setLogoLoaded(true);
          }}
          onError={() => {
            console.warn("Logo image failed to load, using fallback");
          }}
          style={{
            opacity: 0.65,
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.6))',
            pointerEvents: 'none',
          }}
        />
      </div>
      
      {/* Fallback logo - enhanced SVG with animation if the image fails */}
      {!logoLoaded && (
        <div 
          className="fixed z-[21] transform-gpu animate-pulse-slow"
          style={{
            width: '800px',
            height: '800px',
            opacity: 0.6,
            pointerEvents: 'none',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: `translate(calc(-50% + ${offset.x * 0.5}px), calc(-50% + ${offset.y * 0.5}px))`,
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            perspective: '1000px'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100">
            <defs>
              <radialGradient id="logoGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="hsl(195 85% 40% / 1)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="hsl(195 85% 30% / 1)" stopOpacity="0.6" />
              </radialGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#logoGlow)" filter="url(#glow)" />
            <circle cx="50" cy="50" r="40" fill="#FFFFFF" opacity="0.9" />
            <circle cx="50" cy="50" r="35" fill="hsl(195 85% 40% / 1)" />
            <path d="M30,40 L70,40 L50,20 Z" fill="hsl(18 95% 60% / 1)" filter="url(#glow)" />
            <path d="M35,50 L65,50 L50,70 Z" fill="hsl(18 95% 60% / 1)" filter="url(#glow)" />
            <text x="50" y="53" fontFamily="Arial" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#FFFFFF" filter="url(#glow)">OHANA</text>
          </svg>
        </div>
      )}
      
      {/* Vignette effect around the edges */}
      <div className="absolute inset-0 pointer-events-none z-[22] bg-gradient-radial from-transparent to-black/30"></div>
    </div>
  );
}