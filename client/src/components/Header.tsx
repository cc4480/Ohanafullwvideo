import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
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
  
  return (
    <header className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-md">
            <i className='bx bxs-home text-white text-2xl'></i>
          </div>
          <span className="font-serif text-2xl font-bold text-primary">Ohana Realty</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className={`hover:text-primary font-medium ${location === '/' ? 'text-primary' : 'text-neutral-700'}`}>
            Home
          </Link>
          <Link href="/properties" className={`hover:text-primary font-medium ${location === '/properties' ? 'text-primary' : 'text-neutral-700'}`}>
            Properties
          </Link>
          <Link href="/#about" className="text-neutral-700 hover:text-primary font-medium">
            About
          </Link>
          <Link href="/#contact" className="text-neutral-700 hover:text-primary font-medium">
            Contact
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link href="/#contact">
            <Button variant="secondary" className="hidden md:inline-block">
              Contact Valentin
            </Button>
          </Link>
          <button 
            className="md:hidden text-neutral-700 focus:outline-none" 
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
        className={`bg-white py-4 px-4 md:hidden shadow-lg ${mobileMenuOpen ? 'block' : 'hidden'}`}
      >
        <div className="flex flex-col space-y-4">
          <Link href="/" className="text-neutral-700 hover:text-primary font-medium py-2">
            Home
          </Link>
          <Link href="/properties" className="text-neutral-700 hover:text-primary font-medium py-2">
            Properties
          </Link>
          <Link href="/#about" className="text-neutral-700 hover:text-primary font-medium py-2">
            About
          </Link>
          <Link href="/#contact" className="text-neutral-700 hover:text-primary font-medium py-2">
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
