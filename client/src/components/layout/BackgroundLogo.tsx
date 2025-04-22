import React from 'react';

/**
 * BackgroundLogo component that creates a fixed background parallax effect
 * where the logo stays completely static while content scrolls over it
 */
export default function BackgroundLogo() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[-1] flex items-center justify-center">
      {/* Dark overlay first (lower z-index) */}
      <div className="absolute inset-0 bg-black opacity-90 z-[-1]" />
      
      {/* Image on top of the overlay */}
      <img 
        src="/assets/profile.jpg"
        alt="Background Logo" 
        className="fixed"
        style={{
          width: '500px',
          height: 'auto',
          opacity: 0.15,
          objectFit: 'contain',
          filter: 'grayscale(50%)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}