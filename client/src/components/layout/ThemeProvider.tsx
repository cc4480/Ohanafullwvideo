import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "dark";

interface ThemeContextType {
  theme: Theme;
  // These methods are kept for compatibility but will no longer change the theme
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Always use dark mode
  const [theme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Only run once the component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true);
    
    // Always set dark mode
    document.documentElement.classList.add("dark");
    
    // Store preference in localStorage
    localStorage.setItem("theme", "dark");
  }, []);

  // These methods are kept for compatibility but no longer change the theme
  const setTheme = (_newTheme: Theme) => {
    // Do nothing, always dark mode
  };

  const toggleTheme = () => {
    // Do nothing, always dark mode
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