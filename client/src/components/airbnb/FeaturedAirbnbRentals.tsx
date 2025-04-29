import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import AirbnbRentalCard from "./AirbnbRentalCard";
import APIFallback from "@/components/APIFallback";
import type { AirbnbRental } from "@shared/schema";

interface FeaturedAirbnbRentalsProps {
  limit?: number;
  title?: string;
  subtitle?: string;
  showViewAllButton?: boolean;
}

export function FeaturedAirbnbRentals({
  limit = 4,
  title = "Featured Vacation Rentals",
  subtitle = "Experience luxury and comfort in our hand-picked vacation rentals",
  showViewAllButton = true,
}: FeaturedAirbnbRentalsProps) {
  // Fetch featured airbnb rentals
  const {
    data: featuredRentals,
    isLoading,
    isError,
    error,
  } = useQuery<AirbnbRental[]>({
    queryKey: ['/api/airbnb/featured', limit],
    queryFn: async ({ queryKey }) => {
      const [_path, _limit] = queryKey;
      const response = await fetch(`/api/airbnb/featured?limit=${limit}`);
      if (!response.ok) {
        throw new Error("Failed to fetch featured rentals");
      }
      return response.json();
    },
  });

  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3">{title}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
      </div>

      <APIFallback
        isLoading={isLoading}
        isError={isError}
        error={error as Error}
        queryKey="/api/airbnb/featured"
        isEmpty={!featuredRentals || featuredRentals.length === 0}
        emptyMessage="Explore our available vacation rentals below."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredRentals?.map((rental) => (
            <AirbnbRentalCard key={rental.id} rental={rental} featured />
          ))}
        </div>
      </APIFallback>

      {showViewAllButton && (
        <div className="mt-10 text-center">
          <Link href="/airbnb">
            <Button variant="default" className="gap-2">
              View All Rentals <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
}

export default FeaturedAirbnbRentals;