import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Only run once the component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true);
    
    // Initialize theme based on localStorage or system preference
    const storedTheme = localStorage.getItem("theme") as Theme;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      setThemeState("dark");
      document.documentElement.classList.add("dark");
    } else {
      setThemeState("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Enhanced function to set theme with smooth transitions
  const setTheme = (newTheme: Theme) => {
    // Add transition class before theme change for smoother transition
    document.documentElement.classList.add('theme-transition');
    
    // Small delay to ensure transition class is applied before theme change
    setTimeout(() => {
      setThemeState(newTheme);
      
      // Update localStorage
      localStorage.setItem("theme", newTheme);
      
      // Update DOM with smoother transition
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      
      // Remove transition class after theme change is complete
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transition');
      }, 300); // Match this with your CSS transition duration
    }, 10);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  // Avoid rendering anything until mounted to prevent hydration issues
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}