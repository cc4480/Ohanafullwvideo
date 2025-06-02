import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";

export function useProperties() {
  return useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });
}

export function useProperty(id: number) {
  return useQuery<Property>({
    queryKey: [`/api/properties/${id}`],
    enabled: !!id,
  });
}

export function usePropertiesByType(type: string) {
  return useQuery<Property[]>({
    queryKey: [`/api/propertiesByType/${type}`],
    enabled: !!type,
  });
}

export function useFeaturedProperties(limit?: number) {
  return useQuery<Property[]>({
    queryKey: ['/api/properties/featured', limit],
  });
}
