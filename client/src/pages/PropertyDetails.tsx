import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Property } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import ContactSection from "@/components/ContactSection";
import { useEffect, useState } from "react";
import valentinCuellarImg from "../assets/valentin-realtor.png";
import { Calendar, MapPin, Phone, Mail, Check, Home, Building, Bath, Ruler } from "lucide-react";

export default function PropertyDetails({ id }: { id: number }) {
  const [, navigate] = useLocation();
  const [activeImage, setActiveImage] = useState<string>("");
  
  const { data: property, isLoading, error } = useQuery<Property>({
    queryKey: [`/api/properties/${id}`],
  });
  
  useEffect(() => {
    if (property && property.images && property.images.length > 0) {
      setActiveImage(property.images[0]);
    }
  }, [property]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
            </div>
            <div>
              <div className="h-40 bg-gray-200 rounded mb-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl text-red-500 font-bold mb-4">Error Loading Property</h2>
        <p className="mb-6">We couldn't find the property you're looking for.</p>
        <Link href="/properties">
          <Button>
            <i className="bx bx-arrow-back mr-2"></i>
            Return to Properties
          </Button>
        </Link>
      </div>
    );
  }
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  return (
    <div className="min-h-screen">
      {/* Property Header */}
      <div className="bg-primary text-white py-8 sm:py-12 mobile-optimized">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 line-clamp-2">{property.address}</h1>
              <p className="text-base sm:text-lg">{property.city}, {property.state} {property.zipCode}</p>
            </div>
            <div className="mt-3 md:mt-0 flex flex-row md:flex-col items-baseline md:items-end justify-between">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-secondary transform-gpu">
                {formatPrice(property.price)}
              </div>
              <p className="text-xs sm:text-sm text-neutral-200 md:text-right">
                {property.type === "RESIDENTIAL" 
                  ? `${property.bedrooms} bed • ${property.bathrooms} bath • ${property.squareFeet} sq. ft.`
                  : `${property.squareFeet} sq. ft.`}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Property Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {/* Photo Gallery */}
            <div className="mb-6 sm:mb-8 mobile-optimized">
              <div className="rounded-lg overflow-hidden mb-3 sm:mb-4 shadow-md">
                <img 
                  src={activeImage} 
                  alt={property.address} 
                  className="w-full h-[250px] sm:h-[350px] md:h-[400px] object-cover transform-gpu"
                  style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
                />
              </div>
              
              {property.images.length > 1 && (
                <div className="grid grid-cols-4 gap-1 sm:gap-2 transform-gpu">
                  {property.images.map((image, index) => (
                    <div 
                      key={index}
                      className={`cursor-pointer rounded-md overflow-hidden border-2 ${
                        activeImage === image ? 'border-primary' : 'border-transparent'
                      } active:scale-95 transition-transform transform-gpu`}
                      onClick={() => setActiveImage(image)}
                      style={{ touchAction: 'manipulation' }}
                    >
                      <img 
                        src={image} 
                        alt={`${property.address} - ${index + 1}`} 
                        className="w-full h-14 sm:h-20 object-cover transform-gpu"
                        style={{ backfaceVisibility: 'hidden' }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Property Details Tabs */}
            <Tabs defaultValue="overview" className="mt-6 sm:mt-8 mobile-optimized">
              <TabsList className="w-full mb-3 sm:mb-4 h-10 sm:h-auto">
                <TabsTrigger value="overview" className="flex-1 text-xs sm:text-sm">Overview</TabsTrigger>
                <TabsTrigger value="features" className="flex-1 text-xs sm:text-sm">Features</TabsTrigger>
                <TabsTrigger value="location" className="flex-1 text-xs sm:text-sm">Location</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="pt-3 sm:pt-4">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-800 dark:text-white mb-3 sm:mb-4">Property Overview</h2>
                <p className="text-neutral-600 dark:text-neutral-300 mb-5 sm:mb-6 text-sm sm:text-base">{property.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-5 sm:mb-6 mobile-optimized">
                  {property.type === "RESIDENTIAL" && (
                    <>
                      <div className="bg-card dark:bg-slate-800 p-3 sm:p-4 rounded-md shadow-sm transform-gpu">
                        <div className="flex flex-col items-center text-center">
                          <div className="bg-primary/10 dark:bg-primary/20 p-2 sm:p-3 rounded-full mb-1.5 sm:mb-2">
                            <Home className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">Bedrooms</p>
                          <p className="font-bold text-foreground dark:text-white text-lg sm:text-xl">{property.bedrooms}</p>
                        </div>
                      </div>
                      <div className="bg-card dark:bg-slate-800 p-3 sm:p-4 rounded-md shadow-sm transform-gpu">
                        <div className="flex flex-col items-center text-center">
                          <div className="bg-primary/10 dark:bg-primary/20 p-2 sm:p-3 rounded-full mb-1.5 sm:mb-2">
                            <Bath className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">Bathrooms</p>
                          <p className="font-bold text-foreground dark:text-white text-lg sm:text-xl">{property.bathrooms}</p>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="bg-card dark:bg-slate-800 p-3 sm:p-4 rounded-md shadow-sm transform-gpu">
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-primary/10 dark:bg-primary/20 p-2 sm:p-3 rounded-full mb-1.5 sm:mb-2">
                        <Ruler className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Square Feet</p>
                      <p className="font-bold text-foreground dark:text-white text-lg sm:text-xl">{property.squareFeet?.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="bg-card dark:bg-slate-800 p-3 sm:p-4 rounded-md shadow-sm transform-gpu">
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-primary/10 dark:bg-primary/20 p-2 sm:p-3 rounded-full mb-1.5 sm:mb-2">
                        {property.type === "RESIDENTIAL" ? (
                          <Home className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        ) : property.type === "COMMERCIAL" ? (
                          <Building className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        ) : (
                          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Property Type</p>
                      <p className="font-bold text-foreground dark:text-white text-lg sm:text-xl">
                        {property.type === "RESIDENTIAL" ? "Residential" : 
                         property.type === "COMMERCIAL" ? "Commercial" : "Land"}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="pt-3 sm:pt-4">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-800 dark:text-white mb-3 sm:mb-4">Property Features</h2>
                
                {property.features && property.features.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-5 sm:mb-6 mobile-optimized">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center bg-card dark:bg-slate-800 p-2.5 sm:p-3 rounded-md shadow-sm transform-gpu">
                        <div className="bg-primary/10 dark:bg-primary/20 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3">
                          <Check className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                        </div>
                        <span className="text-foreground dark:text-white text-sm sm:text-base">{feature}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground bg-card dark:bg-slate-800 p-3 sm:p-4 rounded-md shadow-sm text-sm sm:text-base">
                    No additional features listed for this property.
                  </p>
                )}
              </TabsContent>
              
              <TabsContent value="location" className="pt-3 sm:pt-4">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-800 dark:text-white mb-3 sm:mb-4">Location</h2>
                <p className="text-neutral-600 dark:text-neutral-300 mb-3 sm:mb-4 text-sm sm:text-base">
                  {property.address}, {property.city}, {property.state} {property.zipCode}
                </p>
                
                <div 
                  className="h-60 sm:h-80 bg-card dark:bg-slate-800 rounded-md mb-3 sm:mb-4 overflow-hidden shadow-sm mobile-optimized relative cursor-pointer"
                  onClick={() => {
                    if (property.lat && property.lng) {
                      const url = `https://www.google.com/maps/search/?api=1&query=${property.lat},${property.lng}&query_place_id=${encodeURIComponent(property.address)}`;
                      window.open(url, '_blank');
                    }
                  }}
                >
                  {property.lat && property.lng ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-10 flex flex-col items-center justify-center">
                        <div className="bg-white rounded-full p-3 shadow-lg mb-3 transform-gpu hover:scale-105 transition-transform">
                          <MapPin className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-white font-medium text-sm sm:text-base">Click to view in Google Maps</p>
                      </div>
                      <div className="absolute inset-0 z-0 flex items-center justify-center bg-slate-200">
                        <div className="text-center px-6">
                          <i className='bx bxs-map text-6xl text-primary/30 mb-4'></i>
                          <h3 className="text-xl font-medium text-slate-500 mb-2">Interactive Map</h3>
                          <p className="text-slate-400 text-sm">Click to open this location in Google Maps</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <MapPin className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground/50 mb-2" />
                      <p className="text-muted-foreground text-sm sm:text-base">Map location not available</p>
                    </div>
                  )}
                </div>
                
                <div className="bg-card dark:bg-slate-800 p-3 sm:p-4 rounded-md shadow-sm transform-gpu">
                  <h3 className="text-sm sm:text-md font-medium mb-1.5 sm:mb-2 flex items-center text-foreground dark:text-white">
                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-primary" />
                    Neighborhood Information
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    This property is located in {property.city}, TX.
                    {property.type === "RESIDENTIAL" 
                      ? " Perfect for families and individuals looking for a comfortable living space in Laredo."
                      : property.type === "COMMERCIAL"
                      ? " Ideal for businesses looking for a prime commercial location in Laredo."
                      : " Great opportunity for development in Laredo."}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div>
            <div className="bg-card dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-md mb-5 sm:mb-6 mobile-optimized">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground dark:text-white mb-3 sm:mb-4">Interested in this property?</h3>
              <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                Contact Valentin Cuellar for more information or to schedule a viewing of this {property.type.toLowerCase()} property.
              </p>
              
              <div className="space-y-3 sm:space-y-4">
                <a href="tel:+19567123000">
                  <Button className="w-full h-9 sm:h-10 transform-gpu active:scale-95 transition-transform" style={{ touchAction: 'manipulation' }}>
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                    <span className="text-sm sm:text-base">Call: 956-712-3000</span>
                  </Button>
                </a>
                <a href="mailto:valentin@ohanarealty.com?subject=Inquiry about {property.address}">
                  <Button variant="outline" className="w-full h-9 sm:h-10 transform-gpu active:scale-95 transition-transform" style={{ touchAction: 'manipulation' }}>
                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                    <span className="text-sm sm:text-base">Email Agent</span>
                  </Button>
                </a>
                <a href="#contact" className="block">
                  <Button variant="secondary" className="w-full h-9 sm:h-10 transform-gpu active:scale-95 transition-transform" style={{ touchAction: 'manipulation' }}>
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                    <span className="text-sm sm:text-base">Schedule a Viewing</span>
                  </Button>
                </a>
              </div>
            </div>
            
            <div className="bg-primary p-4 sm:p-6 rounded-lg text-white mobile-optimized transform-gpu">
              <div className="mb-4 sm:mb-5">
                {/* Enhanced agent image with better background and styling */}
                <div className="flex justify-center mb-3 sm:mb-4">
                  <img 
                    src={valentinCuellarImg} 
                    alt="Valentin Cuellar" 
                    width={120}
                    height={120}
                    className="rounded-lg border-2 border-white shadow-lg transform-gpu sm:w-[150px] sm:h-[150px] w-[120px] h-[120px]"
                    style={{ objectFit: 'cover', backfaceVisibility: 'hidden' }}
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-lg sm:text-xl">Valentin Cuellar</h3>
                  <p className="text-xs sm:text-sm text-white/90">Ohana Realty</p>
                  <div className="mt-1.5 sm:mt-2 flex justify-center">
                    <p className="text-[10px] sm:text-xs bg-secondary text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full inline-block">
                      Licensed Broker
                    </p>
                  </div>
                </div>
              </div>
              <Separator className="bg-white/20 my-3 sm:my-4" />
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <p className="flex items-center">
                  <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-secondary" />
                  <span className="truncate">valentin@ohanarealty.com</span>
                </p>
                <p className="flex items-center">
                  <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-secondary" />
                  Office: 956-712-3000
                </p>
                <p className="flex items-center">
                  <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-secondary" />
                  Mobile: 956-324-6714
                </p>
                <p className="flex items-center">
                  <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-secondary" />
                  <span className="truncate">505 Shiloh Dr, Apt 201, Laredo, TX</span>
                </p>
              </div>
              
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/20">
                <p className="text-xs sm:text-sm mb-1.5 sm:mb-2">Areas of Expertise:</p>
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
                  <div className="flex items-center">
                    <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 text-secondary" />
                    <span>Residential</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 text-secondary" />
                    <span>Commercial</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 text-secondary" />
                    <span>Investments</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 text-secondary" />
                    <span>Laredo Market</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Similar Properties - Would add in a full implementation */}
        
        <Separator className="my-12" />
      </div>
      
      {/* Contact Section */}
      <div id="contact">
        <ContactSection hideTitle={true} propertyInquiry={property.address} />
      </div>
    </div>
  );
}
