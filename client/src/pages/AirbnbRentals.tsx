import React from "react";
import SafeHelmet from "@/components/SafeHelmet";
import ScrollToTop from "@/components/ScrollToTop";
import AirbnbHero from "@/components/airbnb/AirbnbHero";

export default function AirbnbRentals() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      
      <SafeHelmet
        title="Vacation Rentals | Ohana Realty"
        description="Experience luxury and comfort in our vacation rentals"
        canonicalPath="/airbnb"
      />
      
      {/* Just the hero section with video */}
      <AirbnbHero />
      
      {/* Page content */}
      <div className="max-w-5xl mx-auto w-full px-4 py-8">
        <h2 className="text-3xl font-bold mb-4 text-center">Luxury Vacation Rentals in Laredo</h2>
        <p className="text-center text-gray-600 mb-8">
          Experience the perfect blend of comfort and style in our handpicked vacation properties.
        </p>
        
        <div className="bg-slate-50 p-8 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-4">About Our Rentals</h3>
          <p className="text-gray-700 mb-4">
            Ohana Realty offers the most luxurious vacation rental properties in Laredo. Each property 
            is carefully selected and maintained to provide an exceptional experience for our guests.
          </p>
          <p className="text-gray-700">
            Whether you're visiting for business or pleasure, our rentals provide all the amenities and
            comfort you need during your stay in Laredo.
          </p>
        </div>
      </div>
    </div>
  );
}