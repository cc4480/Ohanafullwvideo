import React, { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import BackgroundAnimation from './BackgroundAnimation';

interface LayoutProps {
  children: ReactNode;
  transparentHeader?: boolean; // Option for transparent header on certain pages
}

/**
 * Layout component that creates a consistent structure for all pages
 * with subtle background animations that enhance the user experience
 */
export default function Layout({ children, transparentHeader = false }: LayoutProps) {
  const [location] = useLocation();
  const [colorTheme, setColorTheme] = useState<'blue' | 'teal' | 'purple' | 'default'>('default');
  
  // Adjust background animation based on the current route
  useEffect(() => {
    // Set different background themes based on the route
    if (location.includes('/properties')) {
      setColorTheme('blue');
    } else if (location.includes('/neighborhoods')) {
      setColorTheme('teal');
    } else if (location.includes('/about') || location.includes('/contact')) {
      setColorTheme('purple');
    } else {
      setColorTheme('default');
    }
  }, [location]);
  
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      {/* Professional subtle background animation */}
      <BackgroundAnimation 
        colorTheme={colorTheme} 
        intensity={0.4} 
        includeBeams={true} 
      />
      
      {/* Main content that scrolls over the animated background */}
      <main className="flex-grow relative z-1 bg-transparent">
        {/* Content container */}
        <div className="overlay-content">
          {children}
        </div>
      </main>
    </div>
  );
}