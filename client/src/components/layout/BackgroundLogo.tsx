import React, { useEffect, useState } from 'react';
import logoImg from "../../assets/logo.svg";

/**
 * BackgroundLogo component that creates a semi-transparent overlay
 * to ensure content is visible over the fixed background image
 */
export default function BackgroundLogo() {
  // State to track if the logo has loaded
  const [logoLoaded, setLogoLoaded] = useState(false);

  // Log when component mounts
  useEffect(() => {
    console.log("BackgroundLogo component mounted");
    // Verify logo path
    console.log("Logo path:", logoImg);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-20 flex items-center justify-center">
      {/* Semi-transparent dark overlay to ensure content visibility */}
      <div className="absolute inset-0 bg-black opacity-70 z-0" />
      
      {/* Logo on top of the overlay - static, not animated */}
      <img 
        src={logoImg}
        alt="Ohana Realty Logo" 
        className="fixed z-[21]"
        onLoad={() => {
          console.log("Logo image loaded successfully");
          setLogoLoaded(true);
        }}
        onError={(e) => {
          console.error("Error loading logo image:", e);
        }}
        style={{
          width: '800px',
          height: 'auto', 
          opacity: 0.6,
          objectFit: 'contain',
          filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.6))',
          pointerEvents: 'none',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          display: 'block', // Ensure display is set to block
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />
      
      {/* Fallback logo - use direct SVG if the image fails */}
      {!logoLoaded && (
        <div 
          className="fixed z-[21]"
          style={{
            width: '800px',
            height: '800px',
            opacity: 0.6,
            pointerEvents: 'none',
            backfaceVisibility: 'hidden',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="#0E7F7F" />
            <circle cx="50" cy="50" r="40" fill="#FFFFFF" />
            <circle cx="50" cy="50" r="35" fill="#0E7F7F" />
            <path d="M30,40 L70,40 L50,20 Z" fill="#FDAF00" />
            <path d="M35,50 L65,50 L50,70 Z" fill="#FDAF00" />
            <text x="50" y="53" fontFamily="Arial" fontSize="12" textAnchor="middle" fill="#FFFFFF">OHANA</text>
          </svg>
        </div>
      )}
    </div>
  );
}