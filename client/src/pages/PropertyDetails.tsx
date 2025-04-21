import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Property } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import ContactSection from "@/components/ContactSection";
import { useEffect, useState } from "react";
import valentinCuellarImg from "@assets/image_1745276882398.png";
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
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">{property.address}</h1>
              <p className="text-lg">{property.city}, {property.state} {property.zipCode}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="text-2xl md:text-3xl font-bold text-secondary">
                {formatPrice(property.price)}
              </div>
              <p className="text-sm text-neutral-200">
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
            <div className="mb-8">
              <div className="rounded-lg overflow-hidden mb-4">
                <img 
                  src={activeImage} 
                  alt={property.address} 
                  className="w-full h-[400px] object-cover"
                />
              </div>
              
              {property.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {property.images.map((image, index) => (
                    <div 
                      key={index}
                      className={`cursor-pointer rounded-md overflow-hidden border-2 ${
                        activeImage === image ? 'border-primary' : 'border-transparent'
                      }`}
                      onClick={() => setActiveImage(image)}
                    >
                      <img 
                        src={image} 
                        alt={`${property.address} - ${index + 1}`} 
                        className="w-full h-20 object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Property Details Tabs */}
            <Tabs defaultValue="overview" className="mt-8">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                <TabsTrigger value="features" className="flex-1">Features</TabsTrigger>
                <TabsTrigger value="location" className="flex-1">Location</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="pt-4">
                <h2 className="font-serif text-2xl font-bold text-neutral-800 mb-4">Property Overview</h2>
                <p className="text-neutral-600 mb-6">{property.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {property.type === "RESIDENTIAL" && (
                    <>
                      <div className="bg-card dark:bg-slate-800 p-4 rounded-md shadow-sm">
                        <div className="flex flex-col items-center text-center">
                          <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full mb-2">
                            <Home className="h-5 w-5 text-primary" />
                          </div>
                          <p className="text-sm text-muted-foreground">Bedrooms</p>
                          <p className="font-bold text-foreground text-xl">{property.bedrooms}</p>
                        </div>
                      </div>
                      <div className="bg-card dark:bg-slate-800 p-4 rounded-md shadow-sm">
                        <div className="flex flex-col items-center text-center">
                          <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full mb-2">
                            <Bath className="h-5 w-5 text-primary" />
                          </div>
                          <p className="text-sm text-muted-foreground">Bathrooms</p>
                          <p className="font-bold text-foreground text-xl">{property.bathrooms}</p>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="bg-card dark:bg-slate-800 p-4 rounded-md shadow-sm">
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full mb-2">
                        <Ruler className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">Square Feet</p>
                      <p className="font-bold text-foreground text-xl">{property.squareFeet?.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="bg-card dark:bg-slate-800 p-4 rounded-md shadow-sm">
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full mb-2">
                        {property.type === "RESIDENTIAL" ? (
                          <Home className="h-5 w-5 text-primary" />
                        ) : property.type === "COMMERCIAL" ? (
                          <Building className="h-5 w-5 text-primary" />
                        ) : (
                          <MapPin className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">Property Type</p>
                      <p className="font-bold text-foreground text-xl">
                        {property.type === "RESIDENTIAL" ? "Residential" : 
                         property.type === "COMMERCIAL" ? "Commercial" : "Land"}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="pt-4">
                <h2 className="font-serif text-2xl font-bold text-neutral-800 mb-4">Property Features</h2>
                
                {property.features && property.features.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center bg-card dark:bg-slate-800 p-3 rounded-md shadow-sm">
                        <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-full mr-3">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground bg-card dark:bg-slate-800 p-4 rounded-md shadow-sm">
                    No additional features listed for this property.
                  </p>
                )}
              </TabsContent>
              
              <TabsContent value="location" className="pt-4">
                <h2 className="font-serif text-2xl font-bold text-neutral-800 mb-4">Location</h2>
                <p className="text-neutral-600 mb-4">
                  {property.address}, {property.city}, {property.state} {property.zipCode}
                </p>
                
                <div className="h-80 bg-card dark:bg-slate-800 rounded-md mb-4 overflow-hidden shadow-sm">
                  {property.lat && property.lng ? (
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyD_5wX6LM0b-L0M3VEIpDe3QAfllQ72YuE&q=${property.lat},${property.lng}`}
                    ></iframe>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <MapPin className="h-12 w-12 text-muted-foreground/50 mb-2" />
                      <p className="text-muted-foreground">Map location not available</p>
                    </div>
                  )}
                </div>
                
                <div className="bg-card dark:bg-slate-800 p-4 rounded-md shadow-sm">
                  <h3 className="text-md font-medium mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    Neighborhood Information
                  </h3>
                  <p className="text-muted-foreground">
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
            <div className="bg-card dark:bg-slate-800 p-6 rounded-lg shadow-md mb-6">
              <h3 className="font-serif text-xl font-bold text-foreground mb-4">Interested in this property?</h3>
              <p className="text-muted-foreground mb-4">
                Contact Valentin Cuellar for more information or to schedule a viewing of this {property.type.toLowerCase()} property.
              </p>
              
              <div className="space-y-4">
                <a href="tel:+19567123000">
                  <Button className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Call: 956-712-3000
                  </Button>
                </a>
                <a href="mailto:valentin@ohanarealty.com?subject=Inquiry about {property.address}">
                  <Button variant="outline" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Agent
                  </Button>
                </a>
                <a href="#contact" className="block">
                  <Button variant="secondary" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule a Viewing
                  </Button>
                </a>
              </div>
            </div>
            
            <div className="bg-primary p-6 rounded-lg text-white">
              <div className="mb-5">
                {/* Enhanced agent image with better background and styling */}
                <div className="flex justify-center mb-4">
                  <div className="relative overflow-hidden w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white">
                    <img 
                      src={valentinCuellarImg} 
                      alt="Valentin Cuellar" 
                      className="w-full h-full object-cover object-top"
                      style={{ imageRendering: 'crisp-edges' }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-xl">Valentin Cuellar</h3>
                  <p className="text-sm text-white/90">Ohana Realty</p>
                  <div className="mt-2 flex justify-center">
                    <p className="text-xs bg-secondary text-white px-3 py-1 rounded-full inline-block">
                      Licensed Broker
                    </p>
                  </div>
                </div>
              </div>
              <Separator className="bg-white/20 my-4" />
              <div className="space-y-3 text-sm">
                <p className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-secondary" />
                  valentin@ohanarealty.com
                </p>
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-secondary" />
                  Office: 956-712-3000
                </p>
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-secondary" />
                  Mobile: 956-324-6714
                </p>
                <p className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-secondary" />
                  505 Shiloh Dr, Apt 201, Laredo, TX
                </p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-sm mb-2">Areas of Expertise:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center">
                    <Check className="h-3 w-3 mr-1 text-secondary" />
                    <span>Residential</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-3 w-3 mr-1 text-secondary" />
                    <span>Commercial</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-3 w-3 mr-1 text-secondary" />
                    <span>Investments</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-3 w-3 mr-1 text-secondary" />
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
