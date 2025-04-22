import React, { ReactNode, useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import BackgroundAnimation from './BackgroundAnimation';

interface LayoutProps {
  children: ReactNode;
  transparentHeader?: boolean; // Option for transparent header on certain pages
}

/**
 * Layout component that creates a consistent structure for all pages
 * with subtle background animations that enhance the user experience
 * and handles proper scroll position management across all devices
 */
export default function Layout({ children, transparentHeader = false }: LayoutProps) {
  const [location] = useLocation();
  const [colorTheme, setColorTheme] = useState<'blue' | 'teal' | 'purple' | 'default'>('default');
  const mainRef = useRef<HTMLElement>(null);
  
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
    
    // Handle scroll position reset - especially for mobile browsers
    const enforceScrollTop = () => {
      if (typeof window !== 'undefined') {
        // Force scroll to top
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        
        // Ensure mobile Safari and Chrome reset properly
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile && mainRef.current) {
          mainRef.current.scrollTop = 0;
          
          // On iOS specifically, this trick helps reset scroll position
          document.body.style.overflow = 'hidden';
          setTimeout(() => {
            document.body.style.overflow = '';
          }, 10);
        }
      }
    };
    
    // Execute immediately
    enforceScrollTop();
    
    // And again with a slight delay to ensure it works across browsers
    const timeoutId = setTimeout(enforceScrollTop, 50);
    
    return () => clearTimeout(timeoutId);
  }, [location]);
  
  return (
    <div className="min-h-screen flex flex-col bg-transparent overflow-x-hidden">
      {/* Professional subtle background animation */}
      <BackgroundAnimation 
        colorTheme={colorTheme} 
        intensity={0.4} 
        includeBeams={true} 
      />
      
      {/* Main content that scrolls over the animated background */}
      <main 
        ref={mainRef}
        className="flex-grow relative z-1 bg-transparent"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'none' // Prevents bounce effects on some browsers
        }}
      >
        {/* Content container with improved mobile scroll handling */}
        <div 
          className="overlay-content"
          style={{ transform: 'translateZ(0)' }} // Enable hardware acceleration
        >
          {children}
        </div>
      </main>
    </div>
  );
}