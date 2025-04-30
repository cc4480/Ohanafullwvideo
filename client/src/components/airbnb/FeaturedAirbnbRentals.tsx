import React from "react";

interface FeaturedAirbnbRentalsProps {
  title?: string;
  subtitle?: string;
  limit?: number;
}

export function FeaturedAirbnbRentals({
  title = "Featured Vacation Rentals",
  subtitle = "Experience luxury and comfort in our hand-picked vacation rentals",
  limit
}: FeaturedAirbnbRentalsProps) {
  return null;
}

export default FeaturedAirbnbRentals;