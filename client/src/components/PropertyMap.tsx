import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import { Loader } from "@googlemaps/js-api-loader";

declare global {
  interface Window {
    initMap: () => void;
  }
}

export default function PropertyMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const { data: properties } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });
  
  // Load Google Maps script
  useEffect(() => {
    // Check if the Google Maps script is already loaded
    if (window.google?.maps) {
      setMapLoaded(true);
      return;
    }
    
    // Initialize the Google Maps loader
    const loader = new Loader({
      apiKey: "AIzaSyD_5wX6LM0b-L0M3VEIpDe3QAfllQ72YuE",
      version: "weekly",
    });
    
    // Load the Google Maps script
    loader.load().then(() => {
      setMapLoaded(true);
    }).catch(error => {
      console.error("Error loading Google Maps:", error);
    });
  }, []);
  
  // Initialize the map when the script and properties are loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !properties?.length) return;
    
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 27.52, lng: -99.50 }, // Laredo, TX center
      zoom: 12,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
    });
    
    // Create bounds to fit all markers
    const bounds = new google.maps.LatLngBounds();
    
    // Add markers for each property
    properties.forEach(property => {
      if (!property.lat || !property.lng) return;
      
      const position = { lat: property.lat, lng: property.lng };
      
      // Create marker
      const marker = new google.maps.Marker({
        position,
        map,
        title: property.address,
        icon: {
          url: property.type === "RESIDENTIAL" 
            ? "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png" 
            : "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
          scaledSize: new google.maps.Size(40, 40),
        },
      });
      
      // Create info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="max-width: 200px">
            <h3 style="font-weight: bold; margin-bottom: 4px">${property.address}</h3>
            <p style="margin-bottom: 4px">${property.city}, ${property.state} ${property.zipCode}</p>
            <p style="font-weight: bold; color: #F59E0B">$${property.price.toLocaleString()}</p>
            <a 
              href="/properties/${property.id}" 
              style="display: block; text-align: center; background-color: #134E4A; color: white; padding: 4px; margin-top: 8px; text-decoration: none; border-radius: 4px;"
            >
              View Details
            </a>
          </div>
        `,
      });
      
      // Add click listener to marker
      marker.addListener("click", () => {
        infoWindow.open({
          anchor: marker,
          map,
        });
      });
      
      // Extend bounds to include this marker
      bounds.extend(position);
    });
    
    // Fit the map to the bounds
    map.fitBounds(bounds);
    
    // Adjust zoom if there's only one marker
    if (properties.filter(p => p.lat && p.lng).length === 1) {
      map.setZoom(15);
    }
  }, [mapLoaded, properties]);
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Explore Laredo Properties</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">Discover properties throughout Laredo using our interactive map.</p>
        </div>
        
        <div className="bg-neutral-200 rounded-lg overflow-hidden map-container">
          {/* Google Maps will be loaded here */}
          <div 
            ref={mapRef} 
            className="w-full h-full"
            style={{ minHeight: "500px" }}
          >
            {!mapLoaded && (
              <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                <div className="text-center">
                  <i className='bx bx-map text-6xl text-neutral-400'></i>
                  <p className="text-neutral-600 mt-4">Interactive map loading...</p>
                  <p className="text-neutral-500 text-sm mt-2">Google Maps integration displays all property locations</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-neutral-100 p-4 rounded-md">
            <div className="flex items-center">
              <div className="bg-secondary h-4 w-4 rounded-full mr-2"></div>
              <p className="text-neutral-700">Residential Properties</p>
            </div>
          </div>
          <div className="bg-neutral-100 p-4 rounded-md">
            <div className="flex items-center">
              <div className="bg-primary h-4 w-4 rounded-full mr-2"></div>
              <p className="text-neutral-700">Commercial Properties</p>
            </div>
          </div>
          <div className="bg-neutral-100 p-4 rounded-md">
            <div className="flex items-center">
              <div className="bg-neutral-600 h-4 w-4 rounded-full mr-2"></div>
              <p className="text-neutral-700">Land/Development</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
