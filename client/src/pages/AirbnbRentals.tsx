import React from "react";
import SafeHelmet from "@/components/SafeHelmet";
import ScrollToTop from "@/components/ScrollToTop";
import AirbnbHero from "@/components/airbnb/AirbnbHero";
import FeaturedAirbnbRentals from "@/components/airbnb/FeaturedAirbnbRentals";

export default function AirbnbRentals() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      
      <SafeHelmet
        title="Vacation Rentals | Ohana Realty"
        description="Experience luxury and comfort in our vacation rentals"
        canonicalPath="/airbnb"
      />
      
      {/* Hero section with the enhanced video player */}
      <AirbnbHero />
      
      {/* Featured rentals section (now showing actual rental listings) */}
      <FeaturedAirbnbRentals />
      
      {/* Additional information section */}
      <div className="max-w-5xl mx-auto w-full px-4 py-12">
        <div className="bg-gray-900/90 p-8 rounded-xl shadow-2xl border border-blue-500/30 backdrop-blur-sm relative overflow-hidden transition-all duration-500 hover:shadow-blue-500/20 hover:border-blue-400/40 group">  
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/15 transition-all duration-700"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/15 transition-all duration-700"></div>
          <h3 className="text-2xl font-semibold mb-4 text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-300 inline-block">About Our Luxury Rentals</h3>
          <p className="text-gray-300 mb-6 leading-relaxed relative z-10">
            Ohana Realty offers the most luxurious vacation rental properties in Laredo. Each property 
            is carefully selected and maintained to provide an exceptional experience for our guests.
            <span className="block h-0.5 w-16 bg-blue-500/50 mt-4"></span>
          </p>
          <p className="text-blue-100/90 relative z-10 backdrop-blur-sm bg-blue-900/10 p-4 rounded-lg border-l-2 border-blue-500/50 leading-relaxed">
            Whether you're visiting for business or pleasure, our rentals provide all the amenities and
            comfort you need during your stay in Laredo. From high-end kitchens to premium entertainment 
            systems, our properties are equipped with everything you need to enjoy your stay.
          </p>
        </div>
      </div>
    </div>
  );
}