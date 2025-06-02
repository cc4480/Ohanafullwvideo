import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";

export function useProperties() {
  return useQuery<Property[]>({
    queryKey: ['/api/properties'],
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
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