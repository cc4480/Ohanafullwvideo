import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false); // Start with false for instant display
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Don't show loading state for instant UX
        const response = await fetch('/api/properties');
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch properties');
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return { properties, loading, error };
}

export function useProperty(id: number) {
  return useQuery<Property>({
    queryKey: [`/api/properties/${id}`],
    enabled: !!id,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
}

export function usePropertiesByType(type: string) {
  return useQuery<Property[]>({
    queryKey: [`/api/propertiesByType/${type}`],
    enabled: !!type,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
}

export function useFeaturedProperties(limit?: number) {
  return useQuery<Property[]>({
    queryKey: ['/api/properties/featured', limit],
    queryFn: async () => {
      const response = await fetch(`/api/properties/featured${limit ? `?limit=${limit}` : ''}`);
      if (!response.ok) {
        throw new Error('Failed to fetch featured properties');
      }
      return response.json();
    },
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}