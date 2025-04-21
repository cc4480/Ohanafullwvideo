import { Moon, Sun } from "lucide-react";
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
    }, 400);
  };

  return (
    <div className="relative group">
      <Button
        variant="outline"
        size="icon"
        onClick={handleToggle}
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        className={`
          rounded-full overflow-hidden transition-all duration-300 relative
          ${isHome 
            ? isDarkMode 
              ? 'bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700/90 border-slate-700' 
              : 'bg-white/30 backdrop-blur-sm hover:bg-white/40 border-white/40'
            : isDarkMode 
              ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' 
              : 'bg-white hover:bg-secondary/10 border-gray-200 shadow-sm'
          }
          h-9 w-9 p-0
          ${isTransitioning ? 'scale-90' : 'scale-100'}
        `}
      >
        <span className="sr-only">{isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}</span>
        
        {/* Sun icon with rays animation */}
        <span 
          className={`
            absolute inset-0 flex items-center justify-center transition-transform duration-500
            ${isDarkMode ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}
          `}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500" />
          {/* Sun rays */}
          <span className={`
            absolute inset-0 flex items-center justify-center
            ${isTransitioning && !isDarkMode ? 'animate-ping opacity-0' : ''}
          `}>
            <span className="absolute h-full w-[2px] bg-yellow-500/60 animate-sunray-pulse"></span>
            <span className="absolute h-[2px] w-full bg-yellow-500/60 animate-sunray-pulse delay-75"></span>
            <span className="absolute h-full w-[2px] bg-yellow-500/60 rotate-45 animate-sunray-pulse delay-150"></span>
            <span className="absolute h-[2px] w-full bg-yellow-500/60 rotate-45 animate-sunray-pulse delay-200"></span>
          </span>
        </span>
        
        {/* Moon icon with stars animation */}
        <span 
          className={`
            absolute inset-0 flex items-center justify-center transition-transform duration-500
            ${isDarkMode ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'}
          `}
        >
          <Moon className="h-[1.2rem] w-[1.2rem] text-white" />
          {/* Stars */}
          <span className={`
            absolute top-[3px] right-[5px] h-[3px] w-[3px] rounded-full bg-white animate-stars-pulse
            ${isDarkMode ? 'opacity-100' : 'opacity-0'}
          `}></span>
          <span className={`
            absolute bottom-[6px] left-[7px] h-[2px] w-[2px] rounded-full bg-white animate-stars-pulse delay-300
            ${isDarkMode ? 'opacity-100' : 'opacity-0'}
          `}></span>
          <span className={`
            absolute top-[10px] left-[5px] h-[4px] w-[4px] rounded-full bg-white animate-stars-pulse delay-700
            ${isDarkMode ? 'opacity-100' : 'opacity-0'}
          `}></span>
        </span>
      </Button>
      
      <div className={`
        absolute top-full left-1/2 transform -translate-x-1/2 mt-2 
        bg-black/80 dark:bg-white/90 text-white dark:text-slate-900 
        text-xs px-2 py-1 rounded shadow-lg pointer-events-none
        opacity-0 group-hover:opacity-100 transition-opacity duration-200
        hidden md:block whitespace-nowrap z-50
      `}>
        {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </div>
    </div>
  );
}