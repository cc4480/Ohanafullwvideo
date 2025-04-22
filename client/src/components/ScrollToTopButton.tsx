import { useState, useEffect } from 'react';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if the user is on a mobile device and set visibility threshold accordingly
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    
    checkMobile();
    
    // Show button when user scrolls down (lower threshold on mobile)
    const toggleVisibility = () => {
      const scrollThreshold = isMobile ? 200 : 300;
      
      if (window.pageYOffset > scrollThreshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    // Initial check
    toggleVisibility();
    
    window.addEventListener('scroll', toggleVisibility);
    
    // Clean up the event listener
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [isMobile]);
  
  // Enhanced scroll to top function with better reliability for mobile
  const scrollToTop = () => {
    // First attempt with smooth scroll
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Second approach for iOS Safari (immediate after animation)
    setTimeout(() => {
      if (window.pageYOffset > 0) {
        // Force scroll reset on stubborn mobile browsers
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        
        // For iOS specifically
        if (isMobile) {
          // Force layout recalculation which helps in some mobile browsers
          document.body.style.display = 'none';
          void document.body.offsetHeight;
          document.body.style.display = '';
          
          // Final scroll attempt
          window.scrollTo(0, 0);
        }
      }
    }, 1000); // After animation likely completes
  };
  
  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 sm:w-12 sm:h-12 
        bg-gradient-to-br from-primary to-primary/90 
        text-primary-foreground flex items-center justify-center 
        shadow-lg transform-gpu transition-all duration-300
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}
        ${isMobile ? 'active:scale-95' : 'hover:scale-110'}`}
      aria-label="Scroll to top"
      style={{
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        minHeight: isMobile ? '56px' : '48px',
        minWidth: isMobile ? '56px' : '48px'
      }}
    >
      <div className="relative">
        {/* Arrow icon */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="feather feather-chevron-up"
        >
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
        
        {/* Visual pulse effect */}
        <span className="absolute inset-0 rounded-full animate-ping bg-secondary/20 -z-10"></span>
      </div>
    </button>
  );
}