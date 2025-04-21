import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";
import { useLocation } from "wouter";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";
  const [location] = useLocation();
  const isHome = location === "/";

  return (
    <Button
      variant={isDarkMode ? "default" : "secondary"}
      size="icon"
      onClick={toggleTheme}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      className={`rounded-full transition-all ${isHome ? 'bg-white/20 backdrop-blur-sm hover:bg-white/30' : ''}`}
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5 text-secondary" />
      ) : (
        <Moon className="h-5 w-5 text-primary-foreground" />
      )}
    </Button>
  );
}