import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "sunray-pulse": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "0.2" },
        },
        "stars-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.8)" },
        },
        "theme-fade": {
          "0%": { opacity: "0", transform: "scale(0.8) rotate(-10deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(0deg)" },
        },
        "gentle-pulse": {
          "0%, 100%": {
            transform: "scale(1)",
            boxShadow: "0 10px 15px -5px rgba(0, 123, 175, 0.5)",
          },
          "50%": {
            transform: "scale(1.05)",
            boxShadow: "0 15px 20px -5px rgba(0, 123, 175, 0.7)",
          },
        },
        "float": {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        "slide-up": {
          "0%": {
            transform: "translateY(20px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        "slide-down": {
          "0%": {
            transform: "translateY(-20px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        "scale-in": {
          "0%": {
            transform: "scale(0.9)",
            opacity: "0",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "sunray-pulse": "sunray-pulse 2s ease-in-out infinite",
        "stars-pulse": "stars-pulse 3s ease-in-out infinite",
        "theme-fade": "theme-fade 0.3s ease-out",
        "gentle-pulse": "gentle-pulse 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 3s linear infinite",
        "slide-up": "slide-up 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both",
        "slide-down": "slide-down 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both",
        "scale-in": "scale-in 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both",
        "fade-in": "fade-in 0.5s ease-out",
        "slow-zoom": "slow-zoom 20s ease-in-out infinite alternate",
        "noise": "noise 1s steps(10) infinite",
      },
      
      backgroundImage: {
        "noise": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='a' x='0' y='0'%3E%3CfeTurbulence baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
