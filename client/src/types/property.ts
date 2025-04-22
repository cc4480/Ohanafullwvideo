import { Property } from "@shared/schema";

export function getPropertyLatitude(property: Property): number | undefined {
  if (property.lat === null) return undefined;
  return property.lat;
}

export function getPropertyLongitude(property: Property): number | undefined {
  if (property.lng === null) return undefined;
  return property.lng;
}

export function getPropertyBedrooms(property: Property): number | undefined {
  if (property.bedrooms === null) return undefined;
  return property.bedrooms;
}

export function getPropertyBathrooms(property: Property): number | undefined {
  if (property.bathrooms === null) return undefined;
  return property.bathrooms;
}