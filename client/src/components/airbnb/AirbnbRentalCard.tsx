import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarIcon, BedDoubleIcon, BathIcon, UsersIcon, ChevronsRightIcon } from "lucide-react";
import { type AirbnbRental } from "@shared/schema";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Badge } from "@/components/ui/badge";

interface AirbnbRentalCardProps {
  rental: AirbnbRental;
  featured?: boolean;
}

export function AirbnbRentalCard({ rental, featured = false }: AirbnbRentalCardProps) {
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  // Check if a specific image has an error
  const hasImageError = (src: string) => imageError[src] === true;
  
  // Debug image loading
  useEffect(() => {
    console.log('AirbnbRentalCard images:', rental.images);
    
    // Check if images can be loaded
    if (rental.images && rental.images.length > 0) {
      // Test first image loading
      const testImage = new Image();
      testImage.onload = () => console.log(`Test image loaded successfully: ${rental.images[0]}`);
      testImage.onerror = (e) => {
        console.error(`Test image failed to load: ${rental.images[0]}`, e);
        // Log additional information to help with debugging
        console.log(`Image path details:
          - Original path: ${rental.images[0]}
          - Relative path (no leading slash): ${rental.images[0].startsWith('/') ? rental.images[0].substring(1) : rental.images[0]}
          - Full URL: ${window.location.origin}${rental.images[0].startsWith('/') ? rental.images[0] : `/${rental.images[0]}`}
        `);
      };
      
      // Set crossOrigin to anonymous to handle potential CORS issues
      testImage.crossOrigin = "anonymous";
      testImage.src = rental.images[0];
    }
  }, [rental.images]);

  // Format price with commas
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(rental.price);

  return (
    <Card className={`overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl ${featured ? 'lg:h-full' : ''}`}>
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {rental.images.map((image, index) => (
              <CarouselItem key={index}>
                <AspectRatio ratio={4/3} className="bg-muted">
                  {!hasImageError(image) ? (
                    <OptimizedImage
                      src={image}
                      alt={`${rental.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover rounded-t-lg"
                      onError={() => {
                        console.log(`Error loading image at ${index}:`, image);
                        // Try to help with debugging the specific image path issue
                        const originalPath = image;
                        const strippedPath = image.startsWith('/') ? image.substring(1) : image;
                        console.log(`Image path details for failed load:
                          - Original path: ${originalPath}
                          - Path without leading slash: ${strippedPath}
                        `);
                        setImageError(prev => ({ ...prev, [image]: true }));
                      }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index === 0 && featured}
                      backgroundColor="#f5f5f5"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                      Image unavailable
                    </div>
                  )}
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
        
        {rental.rating && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center shadow-sm z-10">
            <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium">{rental.rating}</span>
            {rental.reviewCount && (
              <span className="text-xs text-muted-foreground ml-1">({rental.reviewCount})</span>
            )}
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold line-clamp-2 mb-1">{rental.title}</h3>
          <p className="text-sm text-muted-foreground mb-2">{rental.address}, {rental.city}, {rental.state}</p>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            <UsersIcon className="h-3 w-3" /> {rental.guests} guests
          </Badge>
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            <BedDoubleIcon className="h-3 w-3" /> {rental.beds} {rental.beds === 1 ? 'bed' : 'beds'}
          </Badge>
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            <BathIcon className="h-3 w-3" /> {rental.bathrooms} {rental.bathrooms === 1 ? 'bath' : 'baths'}
          </Badge>
        </div>
        
        {rental.highlights && rental.highlights.length > 0 && (
          <div className="mb-3">
            <ul className="text-xs space-y-1">
              {rental.highlights.slice(0, 2).map((highlight, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-4 text-primary mr-1">•</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-3">
          <div>
            <span className="text-lg font-bold">{formattedPrice}</span>
            <span className="text-sm text-muted-foreground"> / night</span>
          </div>
          
          <Link href={`/airbnb/${rental.id}`}>
            <Button variant="outline" size="sm" className="gap-1">
              View <ChevronsRightIcon className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default AirbnbRentalCard;