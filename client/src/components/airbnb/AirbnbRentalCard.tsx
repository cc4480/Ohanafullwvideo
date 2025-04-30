import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarIcon, BedDoubleIcon, BathIcon, UsersIcon, ChevronsRightIcon } from "lucide-react";
import { type AirbnbRental } from "@shared/schema";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";

interface AirbnbRentalCardProps {
  rental: AirbnbRental;
  featured?: boolean;
}

export function AirbnbRentalCard({ rental, featured = false }: AirbnbRentalCardProps) {
  // Format price with commas
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(rental.price);

  // Property images
  const fallbackImages = [
    "/shiloh-primary.webp", 
    "/shiloh-building1.jpg", 
    "/shiloh-building2.jpg"
  ];

  return (
    <Card className={`overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl ${featured ? 'lg:h-full' : ''}`}>
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {fallbackImages.map((image, index) => (
              <CarouselItem key={index}>
                <AspectRatio ratio={4/3} className="bg-muted">
                  <div className="w-full h-full bg-slate-200 rounded-t-lg relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                      <p>Property photo</p>
                    </div>
                    <img
                      src={image}
                      alt={`${rental.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover rounded-t-lg relative z-10"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
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