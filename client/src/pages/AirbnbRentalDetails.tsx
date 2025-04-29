import { useParams } from "wouter";
import AirbnbRentalDetailsComponent from "@/components/airbnb/AirbnbRentalDetails";
import FeaturedAirbnbRentals from "@/components/airbnb/FeaturedAirbnbRentals";
import ScrollToTop from "@/components/ScrollToTop";

export default function AirbnbRentalDetails() {
  // Get rental ID from URL params
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id);
  
  // Return 404 if ID is invalid
  if (isNaN(id)) {
    return <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Invalid Rental ID</h1>
      <p>The requested rental could not be found.</p>
    </div>;
  }
  
  return (
    <>
      <ScrollToTop />
      <AirbnbRentalDetailsComponent id={id} />
      
      <div className="mt-16">
        <FeaturedAirbnbRentals 
          title="More Vacation Rentals" 
          subtitle="Discover more amazing places to stay in Laredo"
          limit={4}
        />
      </div>
    </>
  );
}