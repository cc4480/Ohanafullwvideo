
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarIcon, BedDoubleIcon, BathIcon, UsersIcon, ChevronsRightIcon, ImageIcon } from "lucide-react";
import { type AirbnbRental } from "@shared/schema";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";

interface AirbnbRentalCardProps {
  rental: AirbnbRental;
  featured?: boolean;
}

export function AirbnbRentalCard({ rental, featured = false }: AirbnbRentalCardProps) {
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const [images, setImages] = useState<string[]>([]);

  // Process image paths
  useEffect(() => {
    if (!rental.images || rental.images.length === 0) {
      // If no images, use a fallback
      setImages(['/assets/fallback-image.svg']);
      return;
    }

    // Process images to make sure they have the correct path
    const processedImages = rental.images.map(img => {
      // If it's already a URL, use it as is
      if (img.startsWith('http')) return img;
      
      // If it has a leading slash, remove it (from /assets/... to assets/...)
      if (img.startsWith('/')) {
        return img.substring(1);
      }
      
      return img;
    });
    
    setImages(processedImages);
    console.log('AirbnbRentalCard - Processed images for', rental.title, ':', processedImages);
  }, [rental.images]);

  // Format price with commas
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(rental.price);

  // Check if a specific image has an error
  const hasImageError = (src: string) => imageError[src] === true;

  // Handle image error
  const handleImageError = (src: string) => {
    console.log('AirbnbRentalCard - Image failed to load:', src);
    setImageError(prev => ({ ...prev, [src]: true }));
  };

  // Get working images (filter out broken ones)
  const workingImages = images.filter(img => !hasImageError(img));
  const displayImages = workingImages.length > 0 ? workingImages : ['/assets/fallback-image.svg'];

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 border-gray-700 bg-gray-800/90 backdrop-blur-sm">
      <div className="relative">
        <AspectRatio ratio={16 / 10}>
          {displayImages.length > 1 ? (
            <Carousel className="w-full h-full">
              <CarouselContent>
                {displayImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative w-full h-full">
                      <img
                        src={image}
                        alt={`${rental.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={() => handleImageError(image)}
                        loading="lazy"
                      />
                      {hasImageError(image) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                          <ImageIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {displayImages.length > 1 && (
                <>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </>
              )}
            </Carousel>
          ) : (
            <div className="relative w-full h-full">
              <img
                src={displayImages[0]}
                alt={rental.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => handleImageError(displayImages[0])}
                loading="lazy"
              />
              {hasImageError(displayImages[0]) && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
          )}
        </AspectRatio>
        
        {featured && (
          <Badge className="absolute top-2 left-2 bg-blue-600 hover:bg-blue-700">
            Featured
          </Badge>
        )}
        
        {rental.rating && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded text-xs">
            <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{rental.rating}</span>
            {rental.reviewCount && <span>({rental.reviewCount})</span>}
          </div>
        )}
      </div>
      
      <CardContent className="p-4 text-white">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
          {rental.title}
        </h3>
        
        <p className="text-sm text-gray-300 mb-3 line-clamp-2">
          {rental.address}, {rental.city}, {rental.state}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="text-xs flex items-center gap-1 text-gray-300 border-gray-600">
            <UsersIcon className="h-3 w-3" /> {rental.guests} {rental.guests === 1 ? 'guest' : 'guests'}
          </Badge>
          <Badge variant="outline" className="text-xs flex items-center gap-1 text-gray-300 border-gray-600">
            <BedDoubleIcon className="h-3 w-3" /> {rental.beds} {rental.beds === 1 ? 'bed' : 'beds'}
          </Badge>
          <Badge variant="outline" className="text-xs flex items-center gap-1 text-gray-300 border-gray-600">
            <BathIcon className="h-3 w-3" /> {rental.bathrooms} {rental.bathrooms === 1 ? 'bath' : 'baths'}
          </Badge>
        </div>
        
        {rental.highlights && rental.highlights.length > 0 && (
          <div className="mb-3">
            <ul className="text-xs space-y-1">
              {rental.highlights.slice(0, 2).map((highlight, index) => (
                <li key={index} className="flex items-start text-gray-300">
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
          
          <div className="flex gap-2">
            {rental.airbnbUrl && (
              <a href={rental.airbnbUrl} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="bg-[#FF5A5F] hover:bg-[#E04348] text-white text-xs px-2">
                  Book
                </Button>
              </a>
            )}
            <Link href={`/airbnb/${rental.id}`}>
              <Button size="sm" variant="outline" className="text-xs px-2 border-gray-600 text-gray-300 hover:bg-gray-700">
                Details
                <ChevronsRightIcon className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AirbnbRentalCard;
