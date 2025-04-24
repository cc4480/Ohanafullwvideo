import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

// Import logo from assets
import logoImg from "@assets/logo.png";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const [isDark, setIsDark] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Check immediately
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Detect dark mode from document class
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    // Check immediately
    checkDarkMode();
    
    // Set up observer to monitor class changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === 'class' &&
          mutation.target === document.documentElement
        ) {
          checkDarkMode();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);
  
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    // Initial check
    handleScroll();
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const mobileMenu = document.getElementById("mobileMenu");
      const menuButton = document.getElementById("menuButton");
      
      if (
        mobileMenuOpen && 
        mobileMenu && 
        menuButton && 
        !mobileMenu.contains(target) && 
        !menuButton.contains(target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [mobileMenuOpen]);
  
  // Close mobile menu on location change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Dynamic header styles based on scroll position - more transparent on mobile
  const headerClasses = scrolled
    ? isMobile 
      ? "bg-background/70 backdrop-blur-sm shadow-md border-b border-border/5" 
      : "bg-background/95 backdrop-blur-md shadow-lg border-b border-border/10" 
    : location === "/"
      ? "bg-transparent"  // Completely transparent on homepage when not scrolled
      : isMobile 
        ? "bg-background/50 backdrop-blur-sm" 
        : "bg-background/95 backdrop-blur-md";
        
  // Force scroll to top on navigation
  const handleLinkClick = () => {
    // Immediately scroll to top
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };
      
  // Add glow for home page logo when not scrolled
  const logoGlowClass = (!scrolled && location === "/") 
    ? "filter drop-shadow(0 0 8px rgba(255,255,255,0.5))" 
    : "";
      
  const textClasses = (isActive: boolean) => {
    if (scrolled) {
      return `hover:text-primary font-medium transition-all duration-300 relative
        ${isActive ? 'text-primary after:absolute after:bottom-[-4px] after:left-0 after:h-[3px] after:w-full after:bg-primary after:rounded-full' : 'text-foreground'}`;
    }
    
    if (location === "/" && !scrolled) {
      return `hover:text-white hover:brightness-125 font-medium transition-all duration-300 
        ${isActive ? 'text-secondary font-bold after:absolute after:bottom-[-4px] after:left-0 after:h-[3px] after:w-full after:bg-secondary after:rounded-full' : 'text-white'}`;
    }
    
    return `hover:text-primary font-medium transition-all duration-300 relative
      ${isActive ? 'text-primary after:absolute after:bottom-[-4px] after:left-0 after:h-[3px] after:w-full after:bg-primary after:rounded-full' : 'text-foreground'}`;
  };
  
  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${headerClasses}`}>
      <div className={`container mx-auto px-3 sm:px-4 ${isMobile ? 'py-0.5' : 'py-3'} flex items-center justify-between`}>
        {/* Logo with improved styling for both mobile and desktop */}
        <Link href="/" className="flex items-center relative group" onClick={handleLinkClick}>
          <div className={`${isMobile ? 'p-0' : 'p-1'} rounded-md transform-gpu transition-all duration-300 hover:shadow-md`}>
            {/* Enhanced image with better mobile optimization - smaller on mobile */}
            {isMobile ? (
              <img 
                src={logoImg}
                alt="Ohana Realty Logo"
                style={{
                  width: '60px',
                  height: 'auto',
                  maxHeight: '24px',
                  objectFit: 'contain',
                  display: 'block'
                }}
                className={`transform-gpu mobile-optimized ${logoGlowClass}`}
              />
            ) : (
              <img 
                src={logoImg}
                alt="Ohana Realty Logo"
                style={{
                  width: '140px',
                  height: 'auto',
                  objectFit: 'contain',
                  display: 'block'
                }}
                className={`transform-gpu ${logoGlowClass}`}
              />
            )}
          </div>
          {/* Subtle decoration - now visible on hover without animation */}
          <div className="absolute -bottom-2 -right-2 h-1 w-1 sm:h-4 sm:w-4 bg-secondary rounded-full opacity-30 sm:opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8 animate-slide-down">
          {[
            { path: '/', label: 'Home' },
            { path: '/properties', label: 'Properties' },
            { path: '/neighborhoods', label: 'Neighborhoods' },
            { path: '/favorites', label: 'Favorites' },
            { path: '/about', label: 'About' },
            { path: '/contact', label: 'Contact' }
          ].map((item, index) => (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`${textClasses(location === item.path)} relative group overflow-hidden`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={handleLinkClick}
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-1 sm:gap-4 animate-fade-in">
          {/* Desktop contact button shown only on larger screens */}
          <Link href="/contact" onClick={handleLinkClick}>
            <Button 
              variant="secondary" 
              className="hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/80 hover:to-secondary text-white transition-all duration-300 shadow-md hover:shadow-lg animate-slide-up"
            >
              <span>Contact Valentin</span>
              <i className='bx bx-envelope'></i>
            </Button>
          </Link>
          
          {/* Enhanced mobile menu button with animated effects - smaller on mobile */}
          <button 
            className={`md:hidden focus:outline-none ${isMobile ? 'h-6 w-6' : 'h-9 w-9'} flex items-center justify-center rounded-full ${
              scrolled || location !== "/" 
                ? 'text-foreground bg-background/70 backdrop-blur-sm' 
                : 'text-white bg-black/20 backdrop-blur-sm border border-white/10'
            } transition-all duration-300 button-press-feedback transform-gpu active:scale-95`}
            id="menuButton"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <i className={`bx ${mobileMenuOpen ? 'bx-x' : 'bx-menu'} ${isMobile ? 'text-xs' : 'text-sm'} transform-gpu transition-transform duration-300 ${mobileMenuOpen ? 'rotate-90' : 'rotate-0'}`}></i>
          </button>
        </div>
      </div>
      
      {/* Enhanced mobile menu with smoother transitions - adjusted for smaller header */}
      <div 
        id="mobileMenu" 
        className={`bg-background/95 backdrop-blur-md py-3 px-3 md:hidden shadow-xl border-t border-border/10 transition-all duration-500 ${
          mobileMenuOpen 
            ? 'opacity-100 translate-y-0 max-h-[calc(100vh-38px)] overflow-auto' 
            : 'opacity-0 -translate-y-4 pointer-events-none max-h-0 overflow-hidden'
        }`}
        style={{ transformOrigin: 'top center' }}
      >
        <div className="flex flex-col space-y-2">
          {[
            { path: '/', label: 'Home', icon: 'bx-home' },
            { path: '/properties', label: 'Properties', icon: 'bx-building-house' },
            { path: '/neighborhoods', label: 'Neighborhoods', icon: 'bx-map-alt' },
            { path: '/favorites', label: 'Favorites', icon: 'bx-heart' },
            { path: '/about', label: 'About', icon: 'bx-user' },
            { path: '/contact', label: 'Contact', icon: 'bx-envelope' }
          ].map((item, index) => (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`group flex items-center gap-2 text-foreground hover:text-primary font-medium py-2.5 px-2.5 rounded-lg hover:bg-primary/5 transition-all duration-300 ${
                location === item.path ? 'bg-primary/10 text-primary' : ''
              } transform-gpu ${mobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'} button-press-feedback active:bg-primary/10`}
              style={{ 
                transitionDelay: `${index * 50}ms`,
                animationDelay: `${index * 0.1}s`,
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
              onClick={() => {
                handleLinkClick();
                setMobileMenuOpen(false); // Close mobile menu when a link is clicked
              }}
            >
              <i className={`bx ${item.icon} text-lg ${location === item.path ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`}></i>
              <span className="text-sm">{item.label}</span>
              {location === item.path && (
                <div className="ml-auto w-1 h-6 bg-primary rounded-full"></div>
              )}
            </Link>
          ))}
          
          <div className="pt-2 transform-gpu transition-all duration-300" style={{ transitionDelay: '300ms' }}>
            <Link 
              href="/contact" 
              onClick={() => {
                handleLinkClick();
                setMobileMenuOpen(false); // Close mobile menu when the contact button is clicked
              }}
            >
              <Button 
                variant="secondary" 
                className="w-full h-10 bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/80 hover:to-secondary text-white shadow-md hover:shadow-lg transition-all duration-300 mt-1 flex items-center justify-center gap-2 text-sm button-press-feedback"
              >
                <i className='bx bx-envelope-open text-base'></i>
                <span>Contact Valentin</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}