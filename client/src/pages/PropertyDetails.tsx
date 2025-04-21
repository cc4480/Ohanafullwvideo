import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Property } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import ContactSection from "@/components/ContactSection";
import { useEffect, useState } from "react";

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
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {property.type === "RESIDENTIAL" && (
                    <>
                      <div className="bg-neutral-50 p-4 rounded-md">
                        <div className="flex items-center">
                          <i className='bx bx-bed text-primary text-xl mr-2'></i>
                          <div>
                            <p className="text-sm text-neutral-600">Bedrooms</p>
                            <p className="font-bold">{property.bedrooms}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-neutral-50 p-4 rounded-md">
                        <div className="flex items-center">
                          <i className='bx bx-bath text-primary text-xl mr-2'></i>
                          <div>
                            <p className="text-sm text-neutral-600">Bathrooms</p>
                            <p className="font-bold">{property.bathrooms}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="bg-neutral-50 p-4 rounded-md">
                    <div className="flex items-center">
                      <i className='bx bx-area text-primary text-xl mr-2'></i>
                      <div>
                        <p className="text-sm text-neutral-600">Square Feet</p>
                        <p className="font-bold">{property.squareFeet?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded-md">
                    <div className="flex items-center">
                      <i className='bx bx-building-house text-primary text-xl mr-2'></i>
                      <div>
                        <p className="text-sm text-neutral-600">Property Type</p>
                        <p className="font-bold">
                          {property.type === "RESIDENTIAL" ? "Residential" : 
                           property.type === "COMMERCIAL" ? "Commercial" : "Land"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="pt-4">
                <h2 className="font-serif text-2xl font-bold text-neutral-800 mb-4">Property Features</h2>
                
                {property.features && property.features.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <div className="bg-primary-light bg-opacity-10 p-2 rounded-full mr-3">
                          <i className='bx bx-check text-primary'></i>
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-600">No additional features listed for this property.</p>
                )}
              </TabsContent>
              
              <TabsContent value="location" className="pt-4">
                <h2 className="font-serif text-2xl font-bold text-neutral-800 mb-4">Location</h2>
                <p className="text-neutral-600 mb-4">
                  {property.address}, {property.city}, {property.state} {property.zipCode}
                </p>
                
                <div className="h-80 bg-neutral-200 rounded-md mb-4 flex items-center justify-center">
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
                    <div className="text-center">
                      <i className='bx bx-map text-5xl text-neutral-400'></i>
                      <p className="mt-2 text-neutral-600">Map location not available</p>
                    </div>
                  )}
                </div>
                
                <p className="text-neutral-600">
                  This property is located in {property.city}, TX. 
                  {property.type === "RESIDENTIAL" 
                    ? " Perfect for families and individuals looking for a comfortable living space in Laredo."
                    : property.type === "COMMERCIAL"
                    ? " Ideal for businesses looking for a prime commercial location in Laredo."
                    : " Great opportunity for development in Laredo."}
                </p>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div>
            <div className="bg-neutral-50 p-6 rounded-lg shadow-sm mb-6">
              <h3 className="font-serif text-xl font-bold text-neutral-800 mb-4">Interested in this property?</h3>
              <p className="text-neutral-600 mb-4">
                Contact Valentin Cuellar for more information or to schedule a viewing.
              </p>
              
              <div className="space-y-4">
                <Button className="w-full">
                  <i className='bx bx-phone mr-2'></i>
                  Call: 956-712-3000
                </Button>
                <Button variant="outline" className="w-full">
                  <i className='bx bx-envelope mr-2'></i>
                  Email Agent
                </Button>
                <a href="#contact" className="block">
                  <Button variant="secondary" className="w-full">
                    <i className='bx bx-calendar mr-2'></i>
                    Schedule a Viewing
                  </Button>
                </a>
              </div>
            </div>
            
            <div className="bg-primary p-6 rounded-lg text-white">
              <div className="flex items-center mb-4">
                <div className="bg-white rounded-full p-2 mr-3">
                  <i className='bx bx-user text-primary text-xl'></i>
                </div>
                <div>
                  <h3 className="font-bold">Valentin Cuellar</h3>
                  <p className="text-sm">Ohana Realty</p>
                </div>
              </div>
              <Separator className="bg-white/20 my-4" />
              <div className="space-y-2 text-sm">
                <p className="flex items-center">
                  <i className='bx bx-envelope mr-2'></i>
                  info@ohanarealty.com
                </p>
                <p className="flex items-center">
                  <i className='bx bx-phone mr-2'></i>
                  956-712-3000
                </p>
                <p className="flex items-center">
                  <i className='bx bx-mobile mr-2'></i>
                  956-324-6714
                </p>
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
