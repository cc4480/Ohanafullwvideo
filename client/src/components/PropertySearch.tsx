import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function PropertySearch() {
  const [propertyType, setPropertyType] = useState<string>("All");
  const [priceRange, setPriceRange] = useState<string>("Any");
  const [locationSearch, setLocationSearch] = useState<string>("");
  const [, setLocation] = useLocation();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query string for filtering
    const params = new URLSearchParams();
    if (propertyType !== "All") params.append("type", propertyType);
    if (priceRange !== "Any") params.append("price", priceRange);
    if (locationSearch) params.append("location", locationSearch);
    
    // Navigate to properties page with filters
    setLocation(`/properties?${params.toString()}`);
  };
  
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 -mt-24 relative z-20">
          <h2 className="text-2xl font-serif font-bold text-neutral-800 mb-6">Find Your Perfect Property</h2>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleSearch}>
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-1">Property Type</label>
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
              <label className="block text-sm font-medium text-neutral-600 mb-1">Price Range</label>
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
              <label className="block text-sm font-medium text-neutral-600 mb-1">Location</label>
              <Input
                type="text"
                placeholder="Enter neighborhood or address"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="md:col-span-3">
              <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">
                Search Properties
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
