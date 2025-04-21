import { useQuery } from "@tanstack/react-query";
import { Neighborhood } from "@shared/schema";
import NeighborhoodCard from "./NeighborhoodCard";

export default function NeighborhoodInsights() {
  const { data: neighborhoods, isLoading } = useQuery<Neighborhood[]>({
    queryKey: ['/api/neighborhoods'],
  });
  
  // Create placeholder data for loading state
  const loadingPlaceholders = Array(3).fill(0).map((_, index) => ({
    id: index,
    isLoading: true
  }));
  
  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
            Laredo Neighborhood Insights
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Discover the unique character and amenities of Laredo's most desirable neighborhoods.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            loadingPlaceholders.map((placeholder) => (
              <div key={placeholder.id} className="bg-white rounded-lg shadow-md p-4 h-80 animate-pulse">
                <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
                <div className="bg-gray-200 h-6 rounded-md w-1/2 mb-2"></div>
                <div className="bg-gray-200 h-4 rounded-md w-3/4 mb-4"></div>
                <div className="flex gap-2">
                  <div className="bg-gray-200 h-6 rounded-full w-20"></div>
                  <div className="bg-gray-200 h-6 rounded-full w-16"></div>
                </div>
              </div>
            ))
          ) : (
            neighborhoods?.map((neighborhood) => (
              <NeighborhoodCard key={neighborhood.id} neighborhood={neighborhood} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
