import React from 'react';
import logoImg from "@assets/OIP.jfif";

/**
 * BackgroundLogo component that displays the logo as a background on all pages
 * with floating animation and effects
 */
export default function BackgroundLogo() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px]"
        style={{
          opacity: 0.05,
          willChange: 'transform, opacity',
          animation: 'floatSlow 15s infinite ease-in-out'
        }}
      >
        <img 
          src={logoImg} 
          alt="Ohana Realty Logo Background" 
          className="w-full h-full object-contain transform-gpu"
          style={{ 
            filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.2))',
          }}
        />
      </div>
    </div>
  );
}