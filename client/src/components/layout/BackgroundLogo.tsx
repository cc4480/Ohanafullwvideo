import React from 'react';

/**
 * BackgroundLogo component that creates a semi-transparent overlay
 * to ensure content is visible over the fixed background image
 */
export default function BackgroundLogo() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[-1] flex items-center justify-center">
      {/* Semi-transparent dark overlay to ensure content visibility */}
      <div className="absolute inset-0 bg-black opacity-50 z-[-1]" />
      
      {/* Logo on top of the overlay */}
      <img 
        src="/assets/profile.jpg"
        alt="Background Logo" 
        className="fixed transform-gpu"
        style={{
          width: '500px',
          height: 'auto',
          opacity: 0.15,
          objectFit: 'contain',
          filter: 'grayscale(50%)',
          pointerEvents: 'none',
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
      />
    </div>
  );
}