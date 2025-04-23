import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Neighborhood } from "@shared/schema";
import { Helmet } from 'react-helmet';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Building, 
  Home, 
  MapPin, 
  ArrowLeft, 
  Award, 
  Calendar, 
  Car, 
  Leaf, 
  School, 
  ShoppingBag,
  Coffee,
  Utensils,
  Building2,
  BadgeCheck
} from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import northLaredoImg from "../assets/north-laredo-industrial-park.png";
import downtownLaredoImg from "../assets/downtown-laredo.png";
import delMarImg from "../assets/del-mar.png";
import southLaredoImg from "../assets/south-laredo.png";
import SEOHead from "@/components/SEOHead";
import StaticMap from "@/components/maps/StaticPropertyMap";
import APIFallback from "@/components/APIFallback";
import { Property } from "@shared/schema";
import PropertyCard from "@/components/properties/PropertyCard";

// Helper function to get the right icon for a feature
function getFeatureIcon(feature: string) {
  const iconMap: Record<string, React.ReactNode> = {
    "Family-friendly": <Home className="h-4 w-4" />,
    "Top schools": <School className="h-4 w-4" />,
    "Shopping centers": <ShoppingBag className="h-4 w-4" />,
    "Parks and recreation": <Leaf className="h-4 w-4" />,
    "Modern developments": <Building2 className="h-4 w-4" />,
    "Historic architecture": <Building className="h-4 w-4" />,
    "Cultural attractions": <Award className="h-4 w-4" />,
    "Business district": <Building className="h-4 w-4" />,
    "Rio Grande views": <Leaf className="h-4 w-4" />,
    "Emerging nightlife": <Coffee className="h-4 w-4" />,
    "Character homes": <Home className="h-4 w-4" />,
    "Near university": <School className="h-4 w-4" />,
    "Easy commute": <Car className="h-4 w-4" />,
    "Established neighborhood": <BadgeCheck className="h-4 w-4" />,
    "Affordable housing": <Home className="h-4 w-4" />,
    "International trade": <ShoppingBag className="h-4 w-4" />,
    "Commercial opportunities": <Building className="h-4 w-4" />,
    "Economic growth": <Award className="h-4 w-4" />,
    "Residential developments": <Building2 className="h-4 w-4" />,
    "Restaurants": <Utensils className="h-4 w-4" />
  };

  return iconMap[feature] || <MapPin className="h-4 w-4" />;
}

// Helper function to get the neighborhood image based on name
function getNeighborhoodImage(name: string, imageUrl?: string) {
  if (name === "North Laredo") return northLaredoImg;
  if (name === "Downtown Laredo") return downtownLaredoImg;
  if (name === "Del Mar") return delMarImg;
  if (name === "South Laredo") return southLaredoImg;
  return imageUrl || "https://placehold.co/600x400/slate/white?text=Ohana+Realty";
}

// Helper to get more neighborhood-specific content based on name
function getNeighborhoodContent(name: string) {
  const contentMap: Record<string, { history: string, amenities: string, lifestyle: string }> = {
    "North Laredo": {
      history: "North Laredo has seen significant growth in the last two decades, transforming from open land to a thriving residential and commercial area. Its development has been carefully planned to provide residents with modern amenities while maintaining green spaces.",
      amenities: "The area boasts multiple shopping centers, including the Mall del Norte, numerous parks and recreational facilities, top-rated schools, and easy access to major highways.",
      lifestyle: "Residents enjoy a suburban lifestyle with all the conveniences of urban living. The neighborhood attracts families, professionals, and retirees who appreciate the balanced pace of life, safety, and community atmosphere."
    },
    "Downtown Laredo": {
      history: "Downtown Laredo is the historic heart of the city, with roots dating back to the city's founding in 1755. The area features beautiful Spanish colonial architecture, historic landmarks, and buildings that tell the story of Laredo's rich cultural heritage.",
      amenities: "The downtown area offers a mix of government offices, local businesses, cultural attractions including museums and theaters, riverside parks along the Rio Grande, and a growing number of restaurants and entertainment venues.",
      lifestyle: "Downtown living appeals to those who appreciate history, culture, and a more urban lifestyle. The area is experiencing revitalization with new businesses and residential options attracting a diverse population."
    },
    "Del Mar": {
      history: "Del Mar developed as one of Laredo's premier neighborhoods in the mid-20th century. Its tree-lined streets and distinctive homes represent some of the city's finest residential architecture from that era, with many homes lovingly maintained or restored.",
      amenities: "Residents enjoy proximity to Del Mar Park, excellent schools, convenient shopping, and dining options. The neighborhood's central location makes it easy to access other parts of the city while maintaining a quiet residential atmosphere.",
      lifestyle: "Del Mar offers a established, peaceful residential environment that appeals to families and professionals who value its character, mature landscaping, and sense of community. The neighborhood strikes a perfect balance between accessibility and tranquility."
    },
    "South Laredo": {
      history: "South Laredo has a rich history tied to international trade and commerce due to its proximity to the border. The area has transformed over decades from primarily industrial to a mix of residential, commercial, and industrial zones.",
      amenities: "The neighborhood provides affordable housing options, community centers, local markets, and parks. Its proximity to international bridges makes it particularly valuable for those involved in cross-border business.",
      lifestyle: "South Laredo has a vibrant, multicultural atmosphere with strong ties to Mexican culture. The area offers authentic cultural experiences, family-oriented communities, and growing economic opportunities."
    }
  };

  return contentMap[name] || {
    history: "This neighborhood has its own unique history within Laredo, contributing to the city's diverse character and development over time.",
    amenities: "The area offers residents a variety of amenities and conveniences that cater to modern living while maintaining its distinctive character.",
    lifestyle: "Residents enjoy a lifestyle that balances the unique characteristics of this neighborhood with the broader benefits of living in Laredo."
  };
}

interface NeighborhoodDetailsProps {
  id: number;
}

export default function NeighborhoodDetails({ id }: NeighborhoodDetailsProps) {
  const [, navigate] = useLocation();
  
  // Fetch all neighborhoods
  const { data: neighborhoods, isLoading: isLoadingNeighborhoods, error: neighborhoodsError } = useQuery<Neighborhood[]>({
    queryKey: ["/api/neighborhoods"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Find the specific neighborhood
  const neighborhood = neighborhoods?.find(n => n.id === id);
  
  // Fetch properties to show matching properties in this neighborhood
  const { data: properties, isLoading: isLoadingProperties } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Map zipCodes to neighborhoods
  const neighborhoodZipCodes: Record<string, string[]> = {
    "North Laredo": ["78041", "78045"],
    "Downtown Laredo": ["78040"],
    "Del Mar": ["78041"],
    "South Laredo": ["78046"]
  };
  
  // Filter properties that might be in this neighborhood (based on address, city, or zipCode match)
  const neighborhoodProperties = properties?.filter(property => 
    property.address.includes(neighborhood?.name || '') || 
    property.city.includes(neighborhood?.name || '') ||
    (neighborhoodZipCodes[neighborhood?.name || ''] && 
     neighborhoodZipCodes[neighborhood?.name || ''].includes(property.zipCode))
  ) || [];
  
  // Get additional content based on neighborhood name
  const additionalContent = neighborhood ? getNeighborhoodContent(neighborhood.name) : null;
  
  if (isLoadingNeighborhoods) {
    return <APIFallback isLoading={true} />;
  }
  
  if (neighborhoodsError || !neighborhoods) {
    return <APIFallback isError={true} error={neighborhoodsError as Error} queryKey="/api/neighborhoods" />;
  }
  
  if (!neighborhood) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Neighborhood Not Found</h1>
          <p className="mb-6">The neighborhood you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/neighborhoods')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Neighborhoods
          </Button>
        </div>
      </div>
    );
  }
  
  const neighborhoodImage = getNeighborhoodImage(neighborhood.name, neighborhood.image);
  
  return (
    <>
      <SEOHead
        title={`${neighborhood.name} - Neighborhood Guide | Ohana Realty`}
        description={`Explore ${neighborhood.name} in Laredo, TX. Learn about the area's amenities, lifestyle, history, and available properties.`}
      />
      
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Place",
            "name": neighborhood.name,
            "description": neighborhood.description,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Laredo",
              "addressRegion": "TX",
              "addressCountry": "US"
            },
            "image": neighborhoodImage,
            "amenityFeature": neighborhood.features?.map(feature => ({
              "@type": "LocationFeatureSpecification",
              "name": feature,
              "value": true
            }))
          })}
        </script>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb navigation */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-muted-foreground">/</span>
                  <Link href="/neighborhoods" className="text-sm text-muted-foreground hover:text-primary">
                    Neighborhoods
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="mx-2 text-muted-foreground">/</span>
                  <span className="text-sm font-medium text-primary truncate max-w-[150px] sm:max-w-xs">
                    {neighborhood.name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        
        {/* Hero section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="order-2 lg:order-1">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">{neighborhood.name}</h1>
            <p className="text-lg text-muted-foreground mb-6">{neighborhood.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {neighborhood.features?.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-center bg-primary/10 text-primary rounded-full px-3 py-1"
                >
                  {getFeatureIcon(feature)}
                  <span className="ml-1.5 text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
            <Button 
              onClick={() => {
                const formattedAddress = encodeURIComponent(`${neighborhood.name}, Laredo, TX`);
                window.open(`https://www.google.com/maps/search/?api=1&query=${formattedAddress}`, '_blank');
              }}
              variant="outline"
              className="gap-2"
            >
              <MapPin className="h-4 w-4" />
              View on Map
            </Button>
          </div>
          
          <div className="order-1 lg:order-2 rounded-lg overflow-hidden shadow-lg">
            <AspectRatio ratio={16/9}>
              <img 
                src={neighborhoodImage} 
                alt={neighborhood.name} 
                className="object-cover w-full h-full"
              />
            </AspectRatio>
          </div>
        </div>
        
        {/* Neighborhood details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-serif font-semibold mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              History & Development
            </h2>
            <p className="text-muted-foreground">{additionalContent?.history}</p>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-serif font-semibold mb-4 flex items-center">
              <BadgeCheck className="h-5 w-5 mr-2 text-primary" />
              Amenities & Features
            </h2>
            <p className="text-muted-foreground">{additionalContent?.amenities}</p>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-serif font-semibold mb-4 flex items-center">
              <Home className="h-5 w-5 mr-2 text-primary" />
              Lifestyle & Community
            </h2>
            <p className="text-muted-foreground">{additionalContent?.lifestyle}</p>
          </div>
        </div>
        
        {/* Properties in this neighborhood */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-semibold mb-6">Properties in {neighborhood.name}</h2>
          
          {neighborhoodProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {neighborhoodProperties.slice(0, 3).map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-lg p-6 text-center">
              <p className="text-muted-foreground mb-4">No properties currently available in this neighborhood.</p>
              <Button 
                onClick={() => navigate('/properties')} 
                variant="outline"
                className="gap-2"
              >
                <i className='bx bx-search mr-1'></i> Browse All Properties
              </Button>
            </div>
          )}
          
          {neighborhoodProperties.length > 0 && (
            <div className="text-center mt-8">
              <Button 
                onClick={() => navigate('/properties')} 
                variant="outline"
                className="gap-2"
              >
                <i className='bx bx-building-house mr-1'></i> View All Properties
              </Button>
            </div>
          )}
        </div>
        
        {/* Explore other neighborhoods */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-semibold mb-6">Explore Other Neighborhoods</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {neighborhoods
              .filter(n => n.id !== neighborhood.id)
              .slice(0, 4)
              .map(n => (
                <div 
                  key={n.id} 
                  className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    // Navigate to the new neighborhood and scroll to top
                    navigate(`/neighborhoods/${n.id}`);
                    window.scrollTo(0, 0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(`/neighborhoods/${n.id}`);
                      window.scrollTo(0, 0);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View details about ${n.name} neighborhood`}
                >
                  <div className="h-32 overflow-hidden">
                    <img 
                      src={getNeighborhoodImage(n.name, n.image)} 
                      alt={n.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1">{n.name}</h3>
                    {n.features && n.features[0] && (
                      <div className="text-xs text-muted-foreground">
                        {n.features[0]}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
        
        <div className="text-center">
          <Button 
            onClick={() => {
              navigate('/neighborhoods');
              window.scrollTo(0, 0);
            }} 
            variant="outline" 
            className="gap-2 px-6 py-2 h-auto"
            size="lg"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Neighborhoods
          </Button>
        </div>
      </div>
    </>
  );
}