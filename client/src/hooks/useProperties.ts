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
    queryKey: [`/api/properties/type/${type}`],
    enabled: !!type,
  });
}
