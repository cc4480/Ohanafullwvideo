import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useSearch } from "wouter";
import { 
  FilterIcon, 
  MapPinIcon, 
  BedDoubleIcon, 
  BathIcon, 
  UsersIcon, 
  SlidersHorizontalIcon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import APIFallback from "@/components/APIFallback";
import AirbnbRentalCard from "@/components/airbnb/AirbnbRentalCard";
import AirbnbHero from "@/components/airbnb/AirbnbHero";
import SafeHelmet from "@/components/SafeHelmet";
import SEOBreadcrumbs from "@/components/SEOBreadcrumbs";
import SimpleBreadcrumbs from "@/components/SimpleBreadcrumbs";
import ScrollToTop from "@/components/ScrollToTop";
import type { AirbnbRental } from "@shared/schema";

interface AirbnbSearchResponse {
  rentals: AirbnbRental[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export default function AirbnbRentals() {
  // URL params
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(useSearch());
  
  // State for filters
  const [filters, setFilters] = useState({
    minPrice: params.get("minPrice") ? Number(params.get("minPrice")) : 0,
    maxPrice: params.get("maxPrice") ? Number(params.get("maxPrice")) : 500,
    minBeds: params.get("minBeds") ? Number(params.get("minBeds")) : 0,
    minBaths: params.get("minBaths") ? Number(params.get("minBaths")) : 0,
    guests: params.get("guests") ? Number(params.get("guests")) : 0,
    city: params.get("city") || "",
    sortBy: params.get("sortBy") || "rating",
    order: params.get("order") || "desc",
  });
  
  // Set price range
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minPrice, 
    filters.maxPrice
  ]);
  
  // Active filters count
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "sortBy" || key === "order") return false;
    if (key === "minPrice" && value === 0) return false;
    if (key === "maxPrice" && value === 500) return false;
    if (typeof value === "number" && value === 0) return false;
    if (typeof value === "string" && value === "") return false;
    return true;
  }).length;
  
  // Handle search with all filters
  const applyFilters = () => {
    const searchParams = new URLSearchParams();
    
    // Add all non-default filters to URL
    if (filters.minPrice > 0) searchParams.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice < 500) searchParams.set("maxPrice", filters.maxPrice.toString());
    if (filters.minBeds > 0) searchParams.set("minBeds", filters.minBeds.toString());
    if (filters.minBaths > 0) searchParams.set("minBaths", filters.minBaths.toString());
    if (filters.guests > 0) searchParams.set("guests", filters.guests.toString());
    if (filters.city) searchParams.set("city", filters.city);
    if (filters.sortBy !== "rating") searchParams.set("sortBy", filters.sortBy);
    if (filters.order !== "desc") searchParams.set("order", filters.order);
    
    // Update URL
    setLocation(`/airbnb${searchParams.toString() ? '?' + searchParams.toString() : ''}`);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 500,
      minBeds: 0,
      minBaths: 0,
      guests: 0,
      city: "",
      sortBy: "rating",
      order: "desc",
    });
    setPriceRange([0, 500]);
    setLocation('/airbnb');
  };
  
  // Fetch rentals with filters
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<AirbnbSearchResponse>({
    queryKey: [`/api/airbnb/search`, useSearch()],
    queryFn: async ({ queryKey }) => {
      const [_path, search] = queryKey;
      const apiUrl = `/api/airbnb/search${search}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch rentals");
      }
      return response.json();
    },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      
      <SafeHelmet
        title="Vacation Rentals | Ohana Realty"
        description="Discover our selection of vacation rentals in Laredo, TX. Find the perfect home away from home for your next trip."
        canonicalPath="/airbnb"
      />
      
      {/* Video Hero Section */}
      <AirbnbHero />
      
      <div className="max-w-7xl mx-auto px-4 py-8 w-full">
        <SimpleBreadcrumbs
          items={[
            { label: "Vacation Rentals", path: "/airbnb" }
          ]}
          includeHome={true}
        />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">Vacation Rentals</h1>
          <p className="text-muted-foreground">Find the perfect place to stay in Laredo</p>
        </div>
      
      {/* Filters section */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <FilterIcon className="h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Find your perfect vacation rental
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-6 space-y-6">
                  {/* Price range */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Price Range</h3>
                    <div className="mb-4">
                      <Slider
                        value={priceRange}
                        min={0}
                        max={500}
                        step={10}
                        onValueChange={(value) => {
                          setPriceRange(value as [number, number]);
                          setFilters({
                            ...filters,
                            minPrice: value[0],
                            maxPrice: value[1],
                          });
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Min: ${priceRange[0]}</Label>
                      </div>
                      <div>
                        <Label>Max: ${priceRange[1]}</Label>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Beds */}
                  <div>
                    <Label className="text-sm font-medium mb-3">Minimum Beds</Label>
                    <Select
                      value={filters.minBeds.toString()}
                      onValueChange={(value) => setFilters({ ...filters, minBeds: Number(value) })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Any</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Baths */}
                  <div>
                    <Label className="text-sm font-medium mb-3">Minimum Baths</Label>
                    <Select
                      value={filters.minBaths.toString()}
                      onValueChange={(value) => setFilters({ ...filters, minBaths: Number(value) })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Any</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Guests */}
                  <div>
                    <Label className="text-sm font-medium mb-3">Minimum Guests</Label>
                    <Select
                      value={filters.guests.toString()}
                      onValueChange={(value) => setFilters({ ...filters, guests: Number(value) })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Any</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                        <SelectItem value="6">6+</SelectItem>
                        <SelectItem value="8">8+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  {/* Location */}
                  <div>
                    <Label className="text-sm font-medium mb-3">City</Label>
                    <div className="flex gap-2 mt-2">
                      <div className="relative flex-1">
                        <MapPinIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Enter city name"
                          className="pl-9"
                          value={filters.city}
                          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <SheetFooter className="mt-6 flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    Clear All
                  </Button>
                  <SheetClose asChild>
                    <Button 
                      className="w-full"
                      onClick={applyFilters}
                    >
                      Show Results
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            
            {/* Feature badges */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <BedDoubleIcon className="h-4 w-4" />
                  Beds: {filters.minBeds > 0 ? `${filters.minBeds}+` : 'Any'}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[200px]">
                <div className="pt-6">
                  <Label className="text-sm font-medium mb-3">Minimum Beds</Label>
                  <div className="flex items-center justify-between mt-4 gap-2">
                    {[0, 1, 2, 3, 4].map((num) => (
                      <Button
                        key={num}
                        variant={filters.minBeds === num ? "default" : "outline"}
                        onClick={() => {
                          setFilters({ ...filters, minBeds: num });
                        }}
                        className="flex-1"
                      >
                        {num === 0 ? 'Any' : `${num}+`}
                      </Button>
                    ))}
                  </div>
                </div>
                <SheetFooter className="mt-6">
                  <SheetClose asChild>
                    <Button onClick={applyFilters}>Apply</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <BathIcon className="h-4 w-4" />
                  Baths: {filters.minBaths > 0 ? `${filters.minBaths}+` : 'Any'}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[200px]">
                <div className="pt-6">
                  <Label className="text-sm font-medium mb-3">Minimum Bathrooms</Label>
                  <div className="flex items-center justify-between mt-4 gap-2">
                    {[0, 1, 2, 3, 4].map((num) => (
                      <Button
                        key={num}
                        variant={filters.minBaths === num ? "default" : "outline"}
                        onClick={() => {
                          setFilters({ ...filters, minBaths: num });
                        }}
                        className="flex-1"
                      >
                        {num === 0 ? 'Any' : `${num}+`}
                      </Button>
                    ))}
                  </div>
                </div>
                <SheetFooter className="mt-6">
                  <SheetClose asChild>
                    <Button onClick={applyFilters}>Apply</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <UsersIcon className="h-4 w-4" />
                  Guests: {filters.guests > 0 ? `${filters.guests}+` : 'Any'}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[200px]">
                <div className="pt-6">
                  <Label className="text-sm font-medium mb-3">Minimum Guests</Label>
                  <div className="flex items-center justify-between mt-4 gap-2">
                    {[0, 1, 2, 4, 6, 8].map((num) => (
                      <Button
                        key={num}
                        variant={filters.guests === num ? "default" : "outline"}
                        onClick={() => {
                          setFilters({ ...filters, guests: num });
                        }}
                        className="flex-1"
                      >
                        {num === 0 ? 'Any' : `${num}+`}
                      </Button>
                    ))}
                  </div>
                </div>
                <SheetFooter className="mt-6">
                  <SheetClose asChild>
                    <Button onClick={applyFilters}>Apply</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <SlidersHorizontalIcon className="h-4 w-4" />
                  Price: ${priceRange[0]} - ${priceRange[1]}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[220px]">
                <div className="pt-6">
                  <Label className="text-sm font-medium mb-3">Price Range (per night)</Label>
                  <div className="mt-6 px-4">
                    <Slider
                      value={priceRange}
                      min={0}
                      max={500}
                      step={10}
                      onValueChange={(value) => {
                        setPriceRange(value as [number, number]);
                        setFilters({
                          ...filters,
                          minPrice: value[0],
                          maxPrice: value[1],
                        });
                      }}
                    />
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <span className="text-sm font-medium">Min: ${priceRange[0]}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Max: ${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <SheetFooter className="mt-6">
                  <SheetClose asChild>
                    <Button onClick={applyFilters}>Apply</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            
            {/* Only show clear filters if there are active filters */}
            {activeFiltersCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearFilters}
                className="gap-1"
              >
                <XIcon className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>
          
          {/* Sorting */}
          <div className="flex items-center gap-2">
            <Label className="hidden sm:inline-block">Sort by:</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => {
                setFilters({ ...filters, sortBy: value });
                
                // Update URL on sort change
                const searchParams = new URLSearchParams(window.location.search);
                searchParams.set("sortBy", value);
                if (filters.order !== "desc") searchParams.set("order", filters.order);
                setLocation(`/airbnb?${searchParams.toString()}`);
              }}
            >
              <SelectTrigger className="min-w-[120px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="bedrooms">Bedrooms</SelectItem>
                <SelectItem value="bathrooms">Bathrooms</SelectItem>
                <SelectItem value="guests">Guests</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={filters.order}
              onValueChange={(value) => {
                setFilters({ ...filters, order: value });
                
                // Update URL on order change
                const searchParams = new URLSearchParams(window.location.search);
                searchParams.set("order", value);
                if (filters.sortBy !== "rating") searchParams.set("sortBy", filters.sortBy);
                setLocation(`/airbnb?${searchParams.toString()}`);
              }}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Desc</SelectItem>
                <SelectItem value="asc">Asc</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Results */}
      <APIFallback
        isLoading={isLoading}
        isError={isError}
        error={error as Error}
        queryKey="/api/airbnb/search"
        isEmpty={!data?.rentals || data.rentals.length === 0}
        emptyMessage="Browse our available Laredo vacation rentals."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data?.rentals?.map((rental) => (
            <AirbnbRentalCard key={rental.id} rental={rental} />
          ))}
        </div>
      </APIFallback>
      </div>
    </div>
  );
}