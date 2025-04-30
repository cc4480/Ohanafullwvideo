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
      
      {/* Hero section with the ONLY video player */}
      <AirbnbHero />
      
      {/* Additional information section */}
      <div className="max-w-5xl mx-auto w-full px-4 py-8">
        <div className="bg-slate-50 p-8 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-4">About Our Rentals</h3>
          <p className="text-gray-700 mb-4">
            Ohana Realty offers the most luxurious vacation rental properties in Laredo. Each property 
            is carefully selected and maintained to provide an exceptional experience for our guests.
          </p>
          <p className="text-gray-700">
            Whether you're visiting for business or pleasure, our rentals provide all the amenities and
            comfort you need during your stay in Laredo. From high-end kitchens to premium entertainment 
            systems, our properties are equipped with everything you need to enjoy your stay.
          </p>
        </div>
      </div>
    </div>
  );
}