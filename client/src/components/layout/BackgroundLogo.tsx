import React from 'react';
import logoImg from "@assets/OIP.jfif";

/**
 * BackgroundLogo component that creates a fixed background parallax effect
 * where the logo stays completely static while content scrolls over it
 */
export default function BackgroundLogo() {
  return (
    <div 
      className="fixed inset-0 w-full h-full pointer-events-none z-[-1]"
      style={{
        backgroundImage: `url(${logoImg})`,
        backgroundSize: '80%',  // Adjust size as needed
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',  // This is the key property for the parallax effect
        opacity: 0.06  // Subtle background that doesn't interfere with content
      }}
      aria-hidden="true"
    />
  );
}