import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

// Load Valentin Cuellar's profile image
import profileImg from "@assets/thprofile_autox145.jpg";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const [isDark, setIsDark] = useState(false);
  
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
    <header className={`sticky top-0 z-50 transition-all duration-500 ${headerClasses}`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center group animate-fade-in">
          <div className="flex items-center gap-3 hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 overflow-hidden rounded-full border-2 border-secondary shadow-lg transition-all duration-300">
              <img 
                src={profileImg} 
                alt="Valentin Cuellar - Ohana Realty" 
                className="w-full h-full object-cover transform-gpu transition-transform" 
              />
            </div>
            <div className="flex flex-col">
              <span className={`font-serif font-bold text-lg ${location === "/" && !scrolled ? "text-white" : "text-primary"}`}>
                Valentin Cuellar
              </span>
              <span className={`text-xs ${location === "/" && !scrolled ? "text-white/90" : "text-muted-foreground"}`}>
                Ohana Realty
              </span>
            </div>
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8 animate-slide-down">
          {[
            { path: '/', label: 'Home' },
            { path: '/properties', label: 'Properties' },
            { path: '/#about', label: 'About' }
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
        
        <div className="flex items-center gap-4 animate-fade-in">
{/* Desktop Contact button removed completely as requested */}
          
          <button 
            className={`md:hidden focus:outline-none ${scrolled || location !== "/" ? 'text-foreground' : 'text-white'} p-2`}
            id="menuButton"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            style={{ 
              WebkitTapHighlightColor: 'transparent', 
              touchAction: 'manipulation',
              minHeight: '44px',
              minWidth: '44px'
            }}
          >
            <i className={`bx ${mobileMenuOpen ? 'bx-x' : 'bx-menu'} text-3xl`}></i>
          </button>
        </div>
      </div>
      
      {/* Mobile menu with improved mobile UX */}
      <div 
        id="mobileMenu" 
        className={`fixed top-[64px] left-0 right-0 bg-background/98 backdrop-blur-lg py-4 px-4 md:hidden shadow-xl border-t border-border/10 z-50 transform-gpu transition-all duration-300 ${
          mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-[-100%] opacity-0 pointer-events-none'
        }`}
        style={{
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
          perspective: '1000px',
          transformStyle: 'preserve-3d',
          maxHeight: 'calc(100vh - 64px)',
          overflowY: 'auto'
        }}
      >
        <div className="flex flex-col space-y-3">
          {[
            { path: '/', label: 'Home', icon: 'bx-home' },
            { path: '/properties', label: 'Properties', icon: 'bx-building-house' },
            { path: '/neighborhoods', label: 'Neighborhoods', icon: 'bx-map-alt' },
            { path: '/#about', label: 'About', icon: 'bx-user' },
            { path: '/contact', label: 'Contact', icon: 'bx-envelope' }
          ].map((item, index) => (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`group flex items-center gap-3 text-foreground hover:text-primary font-medium py-4 px-3 rounded-xl hover:bg-primary/5 active:bg-primary/10 transition-colors ${
                location === item.path ? 'bg-primary/10 text-primary' : ''
              }`}
              onClick={toggleMobileMenu}
              style={{ 
                transform: 'translateZ(0)',
                animationDelay: `${index * 0.05}s` 
              }}
            >
              <i className={`bx ${item.icon} text-2xl ${location === item.path ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`}></i>
              <span className="text-base">{item.label}</span>
              {location === item.path && (
                <div className="ml-auto w-1.5 h-6 bg-primary rounded-full"></div>
              )}
            </Link>
          ))}
          
          {/* Mobile-specific bottom actions for enhanced UX */}
          <div className="mt-4 pt-4 border-t border-border/30">
            <Link href="/contact">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-xl shadow-md">
                <i className='bx bx-phone-call mr-2 text-xl'></i>
                Contact Valentin
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
