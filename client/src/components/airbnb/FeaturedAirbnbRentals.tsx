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
  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3">{title}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
      </div>

      <div className="w-full max-w-5xl mx-auto h-[60vh] overflow-hidden relative rounded-lg bg-gray-100">
        {/* Featured Image */}
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/images/backgrounds/luxury-interior.jpg')",
            backgroundRepeat: "no-repeat"
          }}
        ></div>
        
        {/* Overlay with content */}
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-6 text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-center">Luxury Vacation Experience</h3>
          <p className="text-center max-w-xl mb-6">
            Our premium vacation rentals offer the perfect blend of comfort, convenience and luxury for your stay in Laredo.
          </p>
          <a 
            href="/airbnb" 
            className="px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            View Vacation Rentals
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {/* Feature 1 */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-primary mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Prime Locations</h3>
          <p className="text-gray-600">
            All our rentals are situated in the most desirable neighborhoods of Laredo, with easy access to attractions.
          </p>
        </div>
        
        {/* Feature 2 */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-primary mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
              <line x1="12" x2="12" y1="8" y2="16"></line>
              <line x1="8" x2="16" y1="12" y2="12"></line>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Premium Amenities</h3>
          <p className="text-gray-600">
            Enjoy high-speed WiFi, fully-equipped kitchens, luxury linens, and premium entertainment systems.
          </p>
        </div>
        
        {/* Feature 3 */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-primary mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Concierge Service</h3>
          <p className="text-gray-600">
            Our dedicated team is available 24/7 to assist with anything you need during your stay.
          </p>
        </div>
      </div>
    </section>
  );
}

export default FeaturedAirbnbRentals;