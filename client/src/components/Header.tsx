import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";

// Load the provided logo image
import logoImg from "@assets/OIP.jfif";

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
        <Link href="/" className="flex items-center relative group animate-fade-in">
          <div className={`w-40 h-16 overflow-hidden ${location === "/" && !scrolled ? "bg-transparent" : "bg-white"} rounded-md transition-all duration-300`}>
            <img src={logoImg} alt="Ohana Realty Logo" className="w-full h-full object-contain" />
          </div>
          {/* Subtle decoration */}
          <div className="absolute -bottom-2 -right-2 h-4 w-4 bg-secondary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
          <ThemeToggle />
          
{/* Desktop Contact button removed completely as requested */}
          
          <button 
            className={`md:hidden focus:outline-none ${scrolled || location !== "/" ? 'text-foreground' : 'text-white'}`}
            id="menuButton"
            onClick={toggleMobileMenu}
          >
            <i className={`bx ${mobileMenuOpen ? 'bx-x' : 'bx-menu'} text-3xl`}></i>
          </button>
        </div>
      </div>
      
      {/* Mobile menu - Hidden but can be toggled when menu button is clicked */}
      {mobileMenuOpen && (
        <div 
          id="mobileMenu" 
          className="fixed top-[64px] left-0 right-0 bg-background/98 backdrop-blur-lg py-4 px-4 md:hidden shadow-xl border-t border-border/10 z-50 transform-gpu"
          style={{
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            perspective: '1000px',
            transformStyle: 'preserve-3d',
            animation: 'slideDown 0.3s ease-out forwards'
          }}
        >
          <div className="flex flex-col space-y-2 max-h-[70vh] overflow-y-auto">
            {[
              { path: '/', label: 'Home', icon: 'bx-home' },
              { path: '/properties', label: 'Properties', icon: 'bx-building-house' },
              { path: '/#about', label: 'About', icon: 'bx-user' }
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
          </div>
        </div>
      )}
    </header>
  );
}
