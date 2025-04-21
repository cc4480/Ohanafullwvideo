import { Moon, MoonStar, Sun, SunMoon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [location] = useLocation();
  const isHome = location === "/";

  // Update state when document class changes
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
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

  // Handle toggle manually by adding/removing dark class
  const handleToggle = () => {
    setIsTransitioning(true);
    const newIsDarkMode = !isDarkMode;
    
    if (newIsDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    setIsDarkMode(newIsDarkMode);
    
    // Reset the transition state after animation
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="relative group">
      <Button
        variant={isHome ? "outline" : "ghost"}
        size="icon"
        onClick={handleToggle}
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        className={`
          rounded-full p-2 transition-all duration-300
          ${isHome 
            ? 'bg-white/20 backdrop-blur-sm hover:bg-white/30 border-white/50' 
            : isDarkMode 
              ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' 
              : 'bg-white hover:bg-secondary/10 shadow-sm'}
          ${isTransitioning ? 'scale-90' : 'scale-100'}
        `}
      >
        {isTransitioning ? (
          <SunMoon className={`h-5 w-5 transition-all ${isDarkMode ? 'text-yellow-300' : 'text-primary'}`} />
        ) : isDarkMode ? (
          <MoonStar className="h-5 w-5 text-yellow-300" />
        ) : (
          <Sun className="h-5 w-5 text-primary" />
        )}
      </Button>
      
      <div className={`
        absolute top-full left-1/2 transform -translate-x-1/2 mt-2 
        bg-black/80 dark:bg-white/90 text-white dark:text-slate-900 
        text-xs px-2 py-1 rounded shadow-lg pointer-events-none
        opacity-0 group-hover:opacity-100 transition-opacity duration-200
        hidden md:block
      `}>
        {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </div>
    </div>
  );
}