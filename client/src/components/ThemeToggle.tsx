import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);
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
    const newIsDarkMode = !isDarkMode;
    
    if (newIsDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    setIsDarkMode(newIsDarkMode);
    console.log("Theme toggled to:", newIsDarkMode ? "dark" : "light");
  };

  return (
    <Button
      variant={isHome ? "outline" : (isDarkMode ? "outline" : "secondary")}
      size="sm"
      onClick={handleToggle}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      className={`rounded-full transition-all ${
        isHome 
          ? 'bg-white/20 backdrop-blur-sm hover:bg-white/30 border-white/50' 
          : isDarkMode 
            ? 'border-secondary hover:border-secondary/80' 
            : ''
      }`}
    >
      {isDarkMode ? (
        <div className="flex items-center gap-2">
          <Sun className="h-4 w-4 text-secondary" />
          <span className="text-xs hidden sm:inline">Light Mode</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Moon className="h-4 w-4 text-primary-foreground" />
          <span className="text-xs hidden sm:inline">Dark Mode</span>
        </div>
      )}
    </Button>
  );
}