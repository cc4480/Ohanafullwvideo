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
        
        {/* Professional background - replacing video */}
        <div className="absolute inset-0 m-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] flex items-center justify-center rounded-xl overflow-hidden bg-gradient-to-b from-black via-gray-900 to-blue-900/20 p-6">
          <div className="w-full h-full relative rounded-xl overflow-hidden transform transition-transform duration-700 hover:scale-[1.01] flex items-center justify-center">
            {/* Subtle glow effect */}
            <div className="absolute w-[90%] h-[70%] bg-blue-600/5 blur-[70px] rounded-full animate-pulse-slow"></div>
            
            {/* Main content container */}
            <div className="relative z-10 max-w-4xl p-8 md:p-10 rounded-xl">
              {/* Decorative elements - simple and elegant */}
              <div className="absolute top-0 left-0 w-20 h-1 bg-blue-600 rounded-full"></div>
              <div className="absolute top-0 right-0 w-1 h-20 bg-blue-600 rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-1 h-20 bg-blue-600 rounded-full"></div>
              <div className="absolute bottom-0 right-0 w-20 h-1 bg-blue-600 rounded-full"></div>
              
              {/* Clean, professional heading */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center text-shadow-lg">
                <span className="text-white">Experience <span className="text-blue-500">Laredo</span></span>
                <br />
                <span className="text-blue-400">Luxury Airbnb Rentals</span>
              </h1>
              
              {/* Refined caption */}
              <p className="mt-6 text-blue-100 text-center max-w-2xl mx-auto text-lg font-light tracking-wide">
                Premium vacation rentals for discerning travelers
              </p>
            </div>
          </div>
        </div>
        
        {/* Removed floating particles effect */}
        
        
      </div>
    </section>
  );
}

export default AirbnbHero;