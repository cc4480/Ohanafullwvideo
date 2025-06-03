import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  BedDoubleIcon, 
  BathIcon, 
  UsersIcon, 
  StarIcon, 
  MapPinIcon, 
  ChevronDownIcon, 
  ChevronUpIcon,
  CheckIcon,
  CalendarIcon,
  AlertCircleIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import APIFallback from "@/components/APIFallback";
import type { AirbnbRental } from "@shared/schema";
import StaticPropertyMap from "@/components/maps/StaticPropertyMap";
import SafeHelmet from "@/components/SafeHelmet";
import SEOBreadcrumbs from "@/components/SEOBreadcrumbs";
import SimplePropertyStructuredData from "@/components/SimplePropertyStructuredData";

interface AirbnbRentalDetailsProps {
  id: number;
}

export function AirbnbRentalDetails({ id }: AirbnbRentalDetailsProps) {
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  // Check if a specific image has an error
  const hasImageError = (src: string) => imageError[src] === true;

  // Fetch rental details
  const {
    data: rental,
    isLoading,
    isError,
    error,
  } = useQuery<AirbnbRental>({
    queryKey: [`/api/airbnb/${id}`],
    queryFn: async ({ queryKey }) => {
      const path = `/api/airbnb/${id}`;
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error("Failed to fetch rental details");
      }
      return response.json();
    },
  });

  // Log image details for debugging
  useEffect(() => {
    if (rental?.images && rental.images.length > 0) {
      console.log('AirbnbRentalDetails images:', rental.images);
    }
  }, [rental?.images]);

  // Format price with commas
  const formattedPrice = rental ? new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(rental.price) : "$0";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <APIFallback
        isLoading={isLoading}
        isError={isError}
        error={error as Error}
        queryKey={`/api/airbnb/${id}`}
      >
        {rental && (
          <>
            <SafeHelmet
              title={`${rental.title} | Ohana Realty Airbnb Rentals`}
              description={`${rental.title} - ${rental.beds} bed, ${rental.bathrooms} bath vacation rental in ${rental.city}, ${rental.state}. Accommodates up to ${rental.guests} guests.`}
              canonicalPath={`/airbnb/${rental.id}`}
              imageUrl={rental.images[0]}
            />

            <SEOBreadcrumbs
              items={[
                { name: "Home", href: "/" },
                { name: "Vacation Rentals", href: "/airbnb" },
                { name: rental.title, href: `/airbnb/${rental.id}` },
              ]}
            />

            <SimplePropertyStructuredData
              name={rental.title}
              description={rental.description}
              price={rental.price}
              priceUnit="USD"
              priceValidUntil={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]}
              imageUrls={rental.images}
              address={{
                streetAddress: rental.address,
                addressLocality: rental.city,
                addressRegion: rental.state,
                postalCode: rental.zipCode,
                addressCountry: "US"
              }}
              numberOfRooms={rental.bedrooms}
              petsAllowed={false}
              latitude={rental.lat}
              longitude={rental.lng}
            />

            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{rental.title}</h1>
              <div className="flex items-center mb-2">
                {rental.rating && (
                  <div className="flex items-center mr-3">
                    <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="font-medium">{rental.rating}</span>
                    {rental.reviewCount && (
                      <span className="text-muted-foreground ml-1">({rental.reviewCount} reviews)</span>
                    )}
                  </div>
                )}
                <div className="flex items-center text-sm">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  <span>{rental.address}, {rental.city}, {rental.state}</span>
                </div>
              </div>

              {/* Quick Booking Banner */}
              <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl p-6 text-white mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Ready to Book Your Stay?</h3>
                    <p className="text-red-100">Reserve this beautiful property directly on Airbnb</p>
                  </div>
                  <Button 
                    size="lg"
                    className="bg-white text-red-600 hover:bg-red-50 font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => window.open(rental.airbnbUrl, '_blank')}
                  >
                    Book Now on Airbnb
                  </Button>
                </div>
              </div>
            </div>

            {/* Image gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="md:col-span-2">
                <AspectRatio ratio={16/9} className="overflow-hidden rounded-lg">
                  {!hasImageError(selectedImage || rental.images[0]) ? (
                    <OptimizedImage 
                      src={selectedImage || rental.images[0]} 
                      alt={rental.title}
                      className="w-full h-full object-cover" 
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                      onError={() => {
                        const img = selectedImage || rental.images[0];
                        console.log(`Error loading main image:`, img);
                        setImageError(prev => ({ ...prev, [img]: true }));
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                      <div className="text-center">
                        <AlertCircleIcon className="h-8 w-8 mx-auto mb-2" />
                        <p>Image could not be loaded</p>
                      </div>
                    </div>
                  )}
                </AspectRatio>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {rental.images.slice(0, 8).map((image, index) => (
                  <div 
                    key={index} 
                    className={`cursor-pointer overflow-hidden rounded-md border-2 transition-all ${selectedImage === image ? 'border-primary' : 'border-transparent'}`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <AspectRatio ratio={1/1}>
                      {!hasImageError(image) ? (
                        <OptimizedImage 
                          src={image} 
                          alt={`${rental.title} image ${index + 1}`}
                          className="w-full h-full object-cover" 
                          sizes="(max-width: 768px) 25vw, 10vw"
                          onError={() => {
                            console.log(`Error loading thumbnail image at ${index}:`, image);
                            setImageError(prev => ({ ...prev, [image]: true }));
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-xs">
                          <AlertCircleIcon className="h-4 w-4" />
                        </div>
                      )}
                    </AspectRatio>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* Key details */}
                <div className="mb-8">
                  <div className="flex flex-wrap gap-4 mb-6">
                    <Badge variant="secondary" className="text-sm py-1 px-3 flex items-center gap-1">
                      <UsersIcon className="h-4 w-4" /> {rental.guests} guests
                    </Badge>
                    <Badge variant="secondary" className="text-sm py-1 px-3 flex items-center gap-1">
                      <BedDoubleIcon className="h-4 w-4" /> {rental.beds} {rental.beds === 1 ? 'bed' : 'beds'}
                    </Badge>
                    <Badge variant="secondary" className="text-sm py-1 px-3 flex items-center gap-1">
                      <BedDoubleIcon className="h-4 w-4" /> {rental.bedrooms} {rental.bedrooms === 1 ? 'bedroom' : 'bedrooms'}
                    </Badge>
                    <Badge variant="secondary" className="text-sm py-1 px-3 flex items-center gap-1">
                      <BathIcon className="h-4 w-4" /> {rental.bathrooms} {rental.bathrooms === 1 ? 'bath' : 'baths'}
                    </Badge>
                  </div>

                  {rental.highlights && rental.highlights.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3">Highlights</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {rental.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start">
                            <CheckIcon className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Separator className="my-6" />

                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Description</h3>
                    <div className={`text-muted-foreground relative ${!expandedDescription ? 'max-h-24 overflow-hidden' : ''}`}>
                      <p>{rental.description}</p>
                      {!expandedDescription && (
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent"></div>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setExpandedDescription(!expandedDescription)}
                      className="mt-2 flex items-center gap-1"
                    >
                      {expandedDescription ? (
                        <>Show less <ChevronUpIcon className="h-4 w-4" /></>
                      ) : (
                        <>Show more <ChevronDownIcon className="h-4 w-4" /></>
                      )}
                    </Button>
                  </div>

                  <Separator className="my-6" />

                  {/* Amenities */}
                  {rental.amenities && rental.amenities.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {rental.amenities.map((amenity, index) => (
                          <li key={index} className="flex items-center">
                            <CheckIcon className="h-4 w-4 text-primary mr-2" />
                            <span>{amenity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Separator className="my-6" />

                  {/* Location */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Location</h3>
                    <p className="text-muted-foreground mb-4">{rental.address}, {rental.city}, {rental.state} {rental.zipCode}</p>

                    {rental.lat && rental.lng && (
                      <div className="h-[300px] rounded-lg overflow-hidden">
                        <StaticPropertyMap 
                          lat={rental.lat} 
                          lng={rental.lng} 
                          propertyTitle={rental.title}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Booking card */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <span className="text-2xl font-bold">{formattedPrice}</span>
                        <span className="text-muted-foreground"> / night</span>
                      </div>
                      {rental.rating && (
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="font-medium">{rental.rating}</span>
                        </div>
                      )}
                    </div>

                    <div className="mb-6 p-4 border rounded-lg">
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="border rounded-tl-lg p-3">
                          <div className="text-xs text-muted-foreground">CHECK-IN</div>
                          <div className="font-medium">Add date</div>
                        </div>
                        <div className="border rounded-tr-lg p-3">
                          <div className="text-xs text-muted-foreground">CHECKOUT</div>
                          <div className="font-medium">Add date</div>
                        </div>
                        <div className="border rounded-bl-lg rounded-br-lg p-3 col-span-2">
                          <div className="text-xs text-muted-foreground">GUESTS</div>
                          <div className="font-medium">{rental.guests} {rental.guests === 1 ? 'guest' : 'guests'} maximum</div>
                        </div>
                      </div>

                      {rental.airbnbUrl ? (
                        <a href={rental.airbnbUrl} target="_blank" rel="noopener noreferrer" className="block w-full mb-4">
                          <Button className="w-full bg-[#FF5A5F] hover:bg-[#E04348] text-white">
                            Book on Airbnb
                          </Button>
                        </a>
                      ) : (
                        <Button className="w-full mb-4">Check availability</Button>
                      )}
                    </div>

                    {rental.cancellationPolicy && (
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-start mb-2">
                          <CalendarIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                          <p>{rental.cancellationPolicy}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </APIFallback>
    </div>
  );
}

export default AirbnbRentalDetails;