import React, { useState, useEffect } from "react";
import OhanaVideoPlayer from "../ui/OhanaVideoPlayer";

interface FeaturedAirbnbRentalsProps {
  title?: string;
  subtitle?: string;
}

export function FeaturedAirbnbRentals({
  title = "Experience Laredo Luxury Living",
  subtitle = "Take a virtual tour of our exclusive properties"
}: FeaturedAirbnbRentalsProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  // Add scroll reveal effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    
    const section = document.getElementById('browse-rentals');
    if (section) observer.observe(section);
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <section 
      id="browse-rentals" 
      className="py-16 px-4 md:px-8 relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-black"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black to-transparent opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent opacity-70"></div>
      <div className="absolute -top-40 -right-40 w-[40vw] h-[40vw] rounded-full bg-indigo-900/10 blur-3xl animate-pulse-slow"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl font-bold mb-4 text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-200">{title}</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">{subtitle}</p>
        </div>

        <div className={`w-full max-w-5xl mx-auto relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {/* Video container with subtle animations and glow effect */}
          <div className="relative rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(59,130,246,0.3)] h-[70vh] transform transition-transform duration-700 hover:scale-[1.01]">
            {/* Animated border */}
            <div className="absolute inset-0 z-0 bg-gradient-to-tr from-blue-600/30 via-indigo-500/20 to-purple-600/30 rounded-2xl animate-pulse-slow"></div>
            
            {/* Corners decoration */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-blue-400/50 rounded-tl-2xl"></div>
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-indigo-400/50 rounded-tr-2xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-blue-400/50 rounded-bl-2xl"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-indigo-400/50 rounded-br-2xl"></div>
            
            <OhanaVideoPlayer 
              src="/api/video/ohana" 
              poster="/shiloh-primary.jpg"
              autoPlay={true}
              muted={false}
              loop={true}
              className="w-full h-full object-contain bg-black/90 z-10 relative"
            />
          </div>
          
          {/* Removed floating particles */}
        </div>
        
        {/* CTA button */}
        <div className={`mt-10 text-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <a 
            href="/contact" 
            className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium transition-all duration-300 hover:from-blue-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-1"
          >
            Contact Us About This Property
            <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

export default FeaturedAirbnbRentals;