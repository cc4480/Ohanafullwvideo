import React, { useEffect, useRef } from 'react';
import OhanaVideoPlayer from '@/components/ui/OhanaVideoPlayer';

export function AirbnbHero() {
  const animatedBorderRef = useRef<HTMLDivElement>(null);
  
  // Create the animated border effect with BRIGHTER glow
  useEffect(() => {
    const borderElement = animatedBorderRef.current;
    if (!borderElement) return;
    
    // Create a more intense pulsing animation
    const pulseAnimation = () => {
      let opacity = 0.5; // Higher starting opacity
      let increasing = true;
      const interval = setInterval(() => {
        if (increasing) {
          opacity += 0.015; // Faster increase
          if (opacity >= 0.9) increasing = false; // Higher max opacity
        } else {
          opacity -= 0.015;
          if (opacity <= 0.5) increasing = true;
        }
        if (borderElement) {
          // Brighter, more intense glow with wider spread
          borderElement.style.boxShadow = `0 0 40px 10px rgba(59, 130, 246, ${opacity}), 0 0 80px 20px rgba(79, 70, 229, ${opacity * 0.6})`;
        }
      }, 40); // Slightly faster animation
      
      return () => clearInterval(interval);
    };
    
    const cleanup = pulseAnimation();
    return cleanup;
  }, []);
  
  return (
    <section className="relative w-full overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-20 -left-20 w-[30vw] h-[30vw] rounded-full bg-blue-500/10 blur-3xl animate-pulse-slow"></div>
      <div className="absolute -bottom-20 -right-20 w-[25vw] h-[25vw] rounded-full bg-indigo-500/10 blur-3xl animate-pulse-slow animation-delay-2000"></div>
      
      <div className="w-full min-h-[90vh] overflow-hidden relative bg-gradient-to-b from-black via-black to-gray-900 z-10">
        {/* Animated border - BRIGHTER */}
        <div 
          ref={animatedBorderRef}
          className="absolute m-4 inset-0 rounded-xl transition-all duration-500 opacity-90 z-0 ring-4 ring-blue-500/50"
        ></div>
        
        {/* Video container with subtle animations */}
        <div className="absolute inset-0 m-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] flex items-center justify-center rounded-xl overflow-hidden">
          <div className="w-full h-full relative rounded-xl overflow-hidden transform transition-transform duration-700 hover:scale-[1.01]">
            <OhanaVideoPlayer
              src="/api/video/ohana/highperf"
              autoPlay={true}
              muted={false}
              loop={true}
              className="w-full h-full object-contain bg-black/90 shadow-2xl"
            />
          </div>
        </div>
        
        {/* Removed floating particles effect */}
        
        {/* Enhanced scroll indicator */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20">
          <a 
            href="#browse-rentals" 
            className="bg-gradient-to-r from-blue-600/60 to-indigo-600/60 hover:from-blue-500 hover:to-indigo-500 backdrop-blur-md transition-all duration-300 rounded-full w-12 h-12 flex items-center justify-center shadow-lg shadow-blue-900/20 animate-bounce-slow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

export default AirbnbHero;