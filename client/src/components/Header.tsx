import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";

// Import logo
import logo from "../assets/logo.svg";

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
    ? "bg-background shadow-md" 
    : location === "/"
      ? "bg-transparent bg-gradient-to-b from-black/30 to-transparent"
      : "bg-background";
      
  const textClasses = (isActive: boolean) => {
    if (scrolled) {
      return `hover:text-primary font-medium ${isActive ? 'text-primary' : 'text-foreground'}`;
    }
    
    if (location === "/" && !scrolled) {
      return `hover:text-white hover:brightness-125 font-medium transition-all ${isActive ? 'text-secondary font-bold' : 'text-white'}`;
    }
    
    return `hover:text-primary font-medium ${isActive ? 'text-primary' : 'text-foreground'}`;
  };
  
  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${headerClasses}`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-12 h-12 overflow-hidden">
            <img src={logo} alt="Ohana Realty Logo" className="w-full h-full object-contain" />
          </div>
          <span className={`font-serif text-2xl font-bold ${scrolled || location !== "/" ? 'text-primary' : 'text-white'}`}>
            Ohana Realty
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className={textClasses(location === '/')}>
            Home
          </Link>
          <Link href="/properties" className={textClasses(location === '/properties')}>
            Properties
          </Link>
          <Link href="/#about" className={textClasses(false)}>
            About
          </Link>
          <Link href="/#contact" className={textClasses(false)}>
            Contact
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <Link href="/#contact">
            <Button variant="secondary" className="hidden md:inline-block">
              Contact Valentin
            </Button>
          </Link>
          
          <button 
            className={`md:hidden focus:outline-none ${scrolled || location !== "/" ? 'text-foreground' : 'text-white'}`}
            id="menuButton"
            onClick={toggleMobileMenu}
          >
            <i className={`bx ${mobileMenuOpen ? 'bx-x' : 'bx-menu'} text-3xl`}></i>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div 
        id="mobileMenu" 
        className={`bg-background py-4 px-4 md:hidden shadow-lg ${mobileMenuOpen ? 'block' : 'hidden'}`}
      >
        <div className="flex flex-col space-y-4">
          <Link href="/" className="text-foreground hover:text-primary font-medium py-2">
            Home
          </Link>
          <Link href="/properties" className="text-foreground hover:text-primary font-medium py-2">
            Properties
          </Link>
          <Link href="/#about" className="text-foreground hover:text-primary font-medium py-2">
            About
          </Link>
          <Link href="/#contact" className="text-foreground hover:text-primary font-medium py-2">
            Contact
          </Link>
          <Link href="/#contact">
            <Button variant="secondary" className="w-full">
              Contact Valentin
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
