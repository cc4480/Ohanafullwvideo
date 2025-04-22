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
          rounded-full overflow-hidden transition-all duration-500 relative
          ${isHome 
            ? isDarkMode 
              ? 'bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700/90 border-slate-700 shadow-lg shadow-slate-900/20' 
              : 'bg-white/30 backdrop-blur-sm hover:bg-white/40 border-white/40 shadow-lg shadow-black/10'
            : isDarkMode 
              ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 shadow-lg shadow-slate-900/20' 
              : 'bg-white hover:bg-secondary/10 border-gray-200 shadow-lg'
          }
          h-10 w-10 p-0
          ${isTransitioning ? 'scale-90 rotate-180' : 'scale-100 rotate-0'}
          hover:shadow-xl
        `}
      >
        <span className="sr-only">{isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}</span>
        
        {/* Background gradient */}
        <span className={`absolute inset-0 opacity-50 ${isDarkMode ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20' : 'bg-gradient-to-br from-yellow-200/20 to-orange-300/20'}`}></span>
        
        {/* Sun icon with enhanced rays animation */}
        <span 
          className={`
            absolute inset-0 flex items-center justify-center transition-all duration-700
            ${isDarkMode ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}
          `}
        >
          <Sun className="h-[1.3rem] w-[1.3rem] text-secondary z-10" />
          
          {/* Sun rays with better animation */}
          <span className={`
            absolute inset-0 flex items-center justify-center
            ${isTransitioning && !isDarkMode ? 'animate-ping opacity-0' : ''}
          `}>
            <span className="absolute h-full w-[1.5px] bg-secondary/60 animate-sunray-pulse"></span>
            <span className="absolute h-[1.5px] w-full bg-secondary/60 animate-sunray-pulse delay-75"></span>
            <span className="absolute h-full w-[1.5px] bg-secondary/60 rotate-45 animate-sunray-pulse delay-150"></span>
            <span className="absolute h-[1.5px] w-full bg-secondary/60 rotate-45 animate-sunray-pulse delay-200"></span>
            <span className="absolute h-full w-[1.5px] bg-secondary/60 rotate-[22.5deg] animate-sunray-pulse delay-100"></span>
            <span className="absolute h-[1.5px] w-full bg-secondary/60 rotate-[22.5deg] animate-sunray-pulse delay-250"></span>
            <span className="absolute h-full w-[1.5px] bg-secondary/60 rotate-[67.5deg] animate-sunray-pulse delay-175"></span>
            <span className="absolute h-[1.5px] w-full bg-secondary/60 rotate-[67.5deg] animate-sunray-pulse delay-225"></span>
            
            {/* Outer glow */}
            <span className="absolute inset-0 rounded-full bg-yellow-400/10 animate-pulse"></span>
          </span>
        </span>
        
        {/* Moon icon with enhanced stars animation */}
        <span 
          className={`
            absolute inset-0 flex items-center justify-center transition-all duration-700
            ${isDarkMode ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'}
          `}
        >
          {/* Moon shadow for 3D effect */}
          <span className="absolute w-[1.1rem] h-[1.1rem] rounded-full bg-primary/90 -translate-x-[2px] translate-y-[2px]"></span>
          <Moon className="h-[1.3rem] w-[1.3rem] text-white relative z-10" />
          
          {/* Stars with better animation */}
          <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => (
              <span 
                key={i}
                className="absolute rounded-full bg-white animate-stars-pulse"
                style={{
                  width: `${Math.random() * 3 + 1}px`,
                  height: `${Math.random() * 3 + 1}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  opacity: isDarkMode ? (Math.random() * 0.5 + 0.5) : 0
                }}
              ></span>
            ))}
          </div>
        </span>
        
        {/* Reflection effect */}
        <span className="absolute top-0 left-0 right-0 h-[4px] bg-white/10 rounded-t-full"></span>
      </Button>
      
      {/* Tooltip with animation */}
      <div className={`
        absolute top-full left-1/2 transform -translate-x-1/2 mt-2 
        bg-black/80 dark:bg-white/90 text-white dark:text-slate-900 
        text-xs px-3 py-1.5 rounded-md shadow-xl pointer-events-none
        opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100
        transition-all duration-200 backdrop-blur-sm
        hidden md:block whitespace-nowrap z-50 border border-white/10 dark:border-black/10
      `}>
        <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-inherit transform rotate-45"></span>
        {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </div>
    </div>
  );
}