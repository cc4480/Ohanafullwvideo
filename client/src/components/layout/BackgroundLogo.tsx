import React from 'react';

/**
 * BackgroundLogo component that creates a fixed background parallax effect
 * where the logo stays completely static while content scrolls over it
 */
export default function BackgroundLogo() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[-1]">
      {/* First, create the background image div */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/assets/profile.jpg')`,
          backgroundSize: '500px',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          opacity: 0.15
        }}
      />
      
      {/* Then add an overlay to ensure content is visible */}
      <div className="absolute inset-0 bg-black bg-opacity-90" />
    </div>
  );
}