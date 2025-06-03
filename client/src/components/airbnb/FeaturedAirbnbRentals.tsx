
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AirbnbRentalCard } from "./AirbnbRentalCard";
import { type AirbnbRental } from "@shared/schema";

interface FeaturedAirbnbRentalsProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  showViewAllButton?: boolean;
}

export function FeaturedAirbnbRentals({
  title = "Featured Vacation Rentals",
  subtitle = "Discover our luxury properties in Laredo",
  limit = 4,
  showViewAllButton = false
}: FeaturedAirbnbRentalsProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Fetch featured Airbnb rentals
  const {
    data: rentals = [],
    isLoading,
    isError,
    error,
  } = useQuery<AirbnbRental[]>({
    queryKey: [`/api/airbnb/featured?limit=${limit}`],
    queryFn: async () => {
      const response = await fetch(`/api/airbnb/featured?limit=${limit}`);
      if (!response.ok) {
        throw new Error("Failed to fetch featured rentals");
      }
      return response.json();
    },
  });

  // Add scroll reveal effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('featured-rentals');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-gray-900 via-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white">{title}</h2>
            <p className="text-gray-300">{subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: limit }).map((_, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-gray-900 via-gray-900 to-black">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">{title}</h2>
          <p className="text-red-400">Failed to load rentals. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="featured-rentals" 
      className="py-16 px-4 md:px-8 relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-black"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black to-transparent opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent opacity-70"></div>
      <div className="absolute -top-40 -right-40 w-[40vw] h-[40vw] rounded-full bg-indigo-900/10 blur-3xl animate-pulse-slow"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl font-bold mb-4 text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-200">{title}</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">{subtitle}</p>
        </div>

        {/* Rental Cards Grid */}
        <div className={`grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {rentals.map((rental, index) => (
            <div
              key={rental.id}
              className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${300 + index * 150}ms` }}
            >
              <AirbnbRentalCard rental={rental} featured={true} />
            </div>
          ))}
        </div>

        {/* Show message if no rentals */}
        {rentals.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-white mb-4">No Rentals Available</h3>
            <p className="text-gray-400">Check back soon for new vacation rental listings.</p>
          </div>
        )}

        {/* CTA buttons */}
        <div className={`text-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/contact" 
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium transition-all duration-300 hover:from-blue-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-1"
            >
              Contact Us About Rentals
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>

            {showViewAllButton && (
              <a 
                href="/airbnb" 
                className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 text-white font-medium transition-all duration-300 hover:bg-white/20 hover:shadow-lg transform hover:-translate-y-1 border border-blue-400/30"
              >
                View All Rentals
                <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedAirbnbRentals;
