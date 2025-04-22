import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

// Import logo from assets
import logoImg from "@assets/OIP.jfif";

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
  
  // Dynamic header styles based on scroll position
  const headerClasses = scrolled
    ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border/10" 
    : location === "/"
      ? "bg-transparent"  // Completely transparent on homepage when not scrolled
      : "bg-background/95 backdrop-blur-md";
      
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
    <header className={`sticky top-0 z-50 transition-all duration-300 ${headerClasses}`} style={{ maxHeight: '60px' }}>
      <div className="container mx-auto px-3 sm:px-4 py-1 sm:py-2 flex items-center justify-between">
        {/* Logo with reduced size on mobile */}
        <Link href="/" className="flex items-center relative group animate-fade-in">
          <div className={`p-1 rounded-md ${location === "/" && !scrolled ? "bg-transparent" : "bg-white/90"}`}>
            {/* Simple direct image approach for better cross-device compatibility */}
            {isMobile ? (
              <img 
                src={logoImg}
                alt="Ohana Realty Logo"
                style={{
                  width: '30px',
                  height: 'auto',
                  maxHeight: '20px',
                  objectFit: 'contain',
                  display: 'block'
                }}
                className="transform-gpu mobile-optimized"
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
                className="transform-gpu"
              />
            )}
          </div>
          {/* Subtle decoration */}
          <div className="absolute -bottom-2 -right-2 h-4 w-4 bg-secondary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-2 sm:gap-4 animate-fade-in">
          <Link href="/contact">
            <Button 
              variant="secondary" 
              className="hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/80 hover:to-secondary text-white transition-all duration-300 shadow-md hover:shadow-lg animate-slide-up"
            >
              <span>Contact Valentin</span>
              <i className='bx bx-envelope'></i>
            </Button>
          </Link>
          
          {/* Mobile contact button - ALWAYS VISIBLE ON MOBILE */}
          <Link href="/contact" className="md:hidden">
            <Button 
              variant="secondary" 
              size="icon"
              className="h-8 w-8 rounded-full bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/80 hover:to-secondary text-white flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg transform-gpu active:scale-95"
              style={{
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                willChange: 'transform'
              }}
            >
              <i className='bx bx-envelope text-sm'></i>
            </Button>
          </Link>
          
          <button 
            className={`md:hidden focus:outline-none ${scrolled || location !== "/" ? 'text-foreground' : 'text-white'}`}
            id="menuButton"
            onClick={toggleMobileMenu}
          >
            <i className={`bx ${mobileMenuOpen ? 'bx-x' : 'bx-menu'} text-2xl`}></i>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div 
        id="mobileMenu" 
        className={`bg-background/95 backdrop-blur-md py-4 px-4 md:hidden shadow-xl border-t border-border/10 transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex flex-col space-y-4">
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
              className={`group flex items-center gap-3 text-foreground hover:text-primary font-medium py-3 px-2 rounded-lg hover:bg-primary/5 transition-all duration-300 ${
                location === item.path ? 'bg-primary/10 text-primary' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <i className={`bx ${item.icon} text-xl ${location === item.path ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`}></i>
              <span>{item.label}</span>
              {location === item.path && (
                <div className="ml-auto w-1.5 h-6 bg-primary rounded-full"></div>
              )}
            </Link>
          ))}
          
          <div className="pt-2">
            <Link href="/contact">
              <Button 
                variant="secondary" 
                className="w-full bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/80 hover:to-secondary text-white shadow-md hover:shadow-lg transition-all duration-300 mt-2 flex items-center justify-center gap-2"
              >
                <i className='bx bx-envelope-open text-xl'></i>
                <span>Contact Valentin</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
