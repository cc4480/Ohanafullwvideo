import React from "react";
import { useQuery } from "@tanstack/react-query";
import { AirbnbRental } from "@shared/schema";
import AirbnbRentalCard from "./AirbnbRentalCard";

interface FeaturedAirbnbRentalsProps {
  title?: string;
  subtitle?: string;
  limit?: number;
}

export function FeaturedAirbnbRentals({
  title = "Featured Vacation Rentals",
  subtitle = "Experience luxury and comfort in our hand-picked vacation rentals",
  limit = 4
}: FeaturedAirbnbRentalsProps) {
  // Fetch featured rentals
  const { data: rentals, isLoading, error } = useQuery<AirbnbRental[]>({
    queryKey: ['/api/airbnb/featured', limit],
    queryFn: () => fetch(`/api/airbnb/featured?limit=${limit}`).then(res => res.json()),
  });

  return (
    <section id="browse-rentals" className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3">{title}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">
          Failed to load rental properties. Please try again.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rentals?.map(rental => (
            <AirbnbRentalCard key={rental.id} rental={rental} />
          ))}
        </div>
      )}
    </section>
  );
}

export default FeaturedAirbnbRentals;