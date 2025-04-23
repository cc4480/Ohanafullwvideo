import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function PropertySearch() {
  const [propertyType, setPropertyType] = useState<string>("All");
  const [priceRange, setPriceRange] = useState<string>("Any");
  const [locationQuery, setLocationQuery] = useState<string>("");
  const [searchPath, setSearchPath] = useState<string>("/properties");
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Check for dark mode preference
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setIsDarkMode(isDark);
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query string for filtering
    const params = new URLSearchParams();
    if (propertyType !== "All") params.append("type", propertyType);
    if (priceRange !== "Any") params.append("price", priceRange);
    if (locationQuery) params.append("location", locationQuery);
    
    // Set the path for the Link component to use
    const queryString = params.toString();
    setSearchPath(queryString ? `/properties?${queryString}` : "/properties");
  };
  
  return (
    <section className={`py-12 pt-32 mt-8 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        {/* Added extra top margin specifically on mobile to prevent overlap with stats */}
        <div className={`max-w-4xl mx-auto ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'} rounded-lg shadow-2xl p-6 mt-8 sm:mt-4 relative z-20 hardware-accelerated`}>
          <h2 className={`text-2xl font-serif font-bold ${isDarkMode ? 'text-white' : 'text-neutral-800'} mb-4`}>Find Your Perfect Property</h2>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleSearch}>
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-neutral-600'} mb-1`}>Property Type</label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Properties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Properties</SelectItem>
                  <SelectItem value="RESIDENTIAL">Residential</SelectItem>
                  <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                  <SelectItem value="LAND">Land</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-neutral-600'} mb-1`}>Price Range</label>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Any Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any">Any Price</SelectItem>
                  <SelectItem value="100000-200000">$100k - $200k</SelectItem>
                  <SelectItem value="200000-300000">$200k - $300k</SelectItem>
                  <SelectItem value="300000-500000">$300k - $500k</SelectItem>
                  <SelectItem value="500000+">$500k+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-neutral-600'} mb-1`}>Location</label>
              <Input
                type="text"
                placeholder="Enter neighborhood or address"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
              />
            </div>
            <div className="md:col-span-3">
              <Link href={searchPath}>
                <Button type="submit" className="w-full bg-primary hover:bg-primary-dark active-state">
                  Search Properties
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}