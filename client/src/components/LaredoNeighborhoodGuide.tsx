import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import LaredoNeighborhoodSchema from './LaredoEnhancedSchema';

interface School {
  name: string;
  type: string;
  grades?: string;
  rating?: number;
  description?: string;
}

interface ShoppingVenue {
  name: string;
  type: string;
  description?: string;
  popular?: boolean;
}

interface DiningOption {
  name: string;
  cuisine: string;
  priceRange?: string;
  description?: string;
}

interface Recreation {
  name: string;
  type: string;
  description?: string;
  amenities?: string[];
}

interface Transportation {
  type: string;
  description: string;
  routes?: string[];
}

interface LocalBusiness {
  name: string;
  type: string;
  description?: string;
  url?: string;
  phone?: string;
}

interface Landmark {
  name: string;
  type: string;
  description: string;
  historicalSignificance?: string;
}

interface LaredoNeighborhoodData {
  id: number;
  name: string;
  slug: string;
  description: string;
  city: string;
  state: string;
  zipCode: string;
  image?: string;
  lat?: number;
  lng?: number;
  // Detailed neighborhood data
  introduction: string;
  history: string;
  yearEstablished?: number;
  realEstateOverview: string;
  medianHomePrice?: number;
  averageRent?: number;
  propertyTypes?: string[];
  architecturalStyles?: string[];
  schools: School[];
  schoolDistrict?: string;
  shopping: ShoppingVenue[];
  dining: DiningOption[];
  recreation: Recreation[];
  transportation: Transportation[];
  walkScore?: number;
  landmarks?: Landmark[];
  events?: {
    name: string;
    description?: string;
    date?: string;
    location?: string;
  }[];
  localBusinesses?: LocalBusiness[];
  neighboringAreas?: string[];
  competitorUrls?: {
    coldwellBanker?: string;
    remax?: string;
    realtor?: string;
  };
  faqs: {
    question: string;
    answer: string;
  }[];
}

export default function LaredoNeighborhoodGuide({ neighborhood }: { neighborhood: LaredoNeighborhoodData }) {
  const [_, navigate] = useLocation();
  const baseUrl = "https://ohanarealty.com";
  const neighborhoodUrl = `${baseUrl}/neighborhoods/${neighborhood.slug || neighborhood.id}`;
  
  // Prepare schema data
  const schemaData = {
    neighborhoodId: neighborhood.id,
    name: neighborhood.name,
    description: neighborhood.description,
    url: neighborhoodUrl,
    image: neighborhood.image,
    city: neighborhood.city,
    state: neighborhood.state,
    zipCode: neighborhood.zipCode,
    geo: neighborhood.lat && neighborhood.lng ? {
      latitude: neighborhood.lat,
      longitude: neighborhood.lng
    } : undefined,
    yearEstablished: neighborhood.yearEstablished,
    schoolDistrict: neighborhood.schoolDistrict,
    schools: neighborhood.schools.map(school => school.name),
    parks: neighborhood.recreation
      .filter(rec => rec.type.toLowerCase().includes('park'))
      .map(park => park.name),
    shoppingCenters: neighborhood.shopping.map(venue => venue.name),
    diningOptions: neighborhood.dining.map(option => option.name),
    landmarks: neighborhood.landmarks?.map(landmark => landmark.name),
    medianHomePrice: neighborhood.medianHomePrice,
    averageRent: neighborhood.averageRent,
    walkScore: neighborhood.walkScore,
    transitOptions: neighborhood.transportation.map(option => option.type),
    neighboringAreas: neighborhood.neighboringAreas,
    history: neighborhood.history,
    events: neighborhood.events,
    localBusinesses: neighborhood.localBusinesses?.map(business => ({
      name: business.name,
      type: business.type,
      url: business.url,
      telephone: business.phone
    })),
    competitorUrls: neighborhood.competitorUrls
  };

  return (
    <div className="w-full mx-auto max-w-6xl">
      {/* Add the enhanced Schema.org markup */}
      <LaredoNeighborhoodSchema {...schemaData} />
      
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{neighborhood.name}</h1>
        <p className="text-xl text-muted-foreground">{neighborhood.description}</p>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20">
            {neighborhood.zipCode}
          </Badge>
          {neighborhood.medianHomePrice && (
            <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20">
              Median Price: ${neighborhood.medianHomePrice.toLocaleString()}
            </Badge>
          )}
          {neighborhood.walkScore && (
            <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20">
              Walk Score: {neighborhood.walkScore}/100
            </Badge>
          )}
          {neighborhood.yearEstablished && (
            <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20">
              Established: {neighborhood.yearEstablished}
            </Badge>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full max-w-lg grid grid-cols-5 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="real-estate">Real Estate</TabsTrigger>
          <TabsTrigger value="amenities">Amenities</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>About {neighborhood.name}</CardTitle>
              <CardDescription>
                Everything you need to know about this Laredo neighborhood
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-2">Introduction</h3>
                <p className="text-muted-foreground">{neighborhood.introduction}</p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">History</h3>
                <p className="text-muted-foreground">{neighborhood.history}</p>
                {neighborhood.yearEstablished && (
                  <p className="mt-2 font-medium">Established: {neighborhood.yearEstablished}</p>
                )}
              </div>
              
              {neighborhood.landmarks && neighborhood.landmarks.length > 0 && (
                <div>
                  <h3 className="text-xl font-medium mb-2">Notable Landmarks</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {neighborhood.landmarks.map((landmark, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardHeader className="p-4">
                          <CardTitle className="text-lg">{landmark.name}</CardTitle>
                          <CardDescription>{landmark.type}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-sm">{landmark.description}</p>
                          {landmark.historicalSignificance && (
                            <p className="text-sm mt-2 text-muted-foreground">
                              <span className="font-medium">Historical Significance:</span>{" "}
                              {landmark.historicalSignificance}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              {neighborhood.neighboringAreas && neighborhood.neighboringAreas.length > 0 && (
                <div>
                  <h3 className="text-xl font-medium mb-2">Neighboring Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {neighborhood.neighboringAreas.map((area, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => {
                        // Would navigate to the neighboring area's page in a real implementation
                        // Using a placeholder navigation for now
                        window.scrollTo(0, 0);
                        navigate(`/neighborhoods`);
                      }}>
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Real Estate Tab */}
        <TabsContent value="real-estate" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Real Estate in {neighborhood.name}</CardTitle>
              <CardDescription>
                Housing market information and property insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-2">Market Overview</h3>
                <p className="text-muted-foreground">{neighborhood.realEstateOverview}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {neighborhood.medianHomePrice && (
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">Median Home Price</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-2xl font-bold">${neighborhood.medianHomePrice.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                )}
                
                {neighborhood.averageRent && (
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">Average Rent</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-2xl font-bold">${neighborhood.averageRent.toLocaleString()}/month</p>
                    </CardContent>
                  </Card>
                )}
                
                {neighborhood.walkScore && (
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">Walk Score</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-2xl font-bold">{neighborhood.walkScore}/100</p>
                      <p className="text-sm text-muted-foreground">
                        {neighborhood.walkScore >= 90 ? 'Walker\'s Paradise' :
                          neighborhood.walkScore >= 70 ? 'Very Walkable' :
                            neighborhood.walkScore >= 50 ? 'Somewhat Walkable' :
                              neighborhood.walkScore >= 25 ? 'Car-Dependent' : 'Car-Dependent'}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {neighborhood.propertyTypes && neighborhood.propertyTypes.length > 0 && (
                <div>
                  <h3 className="text-xl font-medium mb-2">Property Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {neighborhood.propertyTypes.map((type, index) => (
                      <Badge key={index} variant="outline">{type}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {neighborhood.architecturalStyles && neighborhood.architecturalStyles.length > 0 && (
                <div>
                  <h3 className="text-xl font-medium mb-2">Architectural Styles</h3>
                  <div className="flex flex-wrap gap-2">
                    {neighborhood.architecturalStyles.map((style, index) => (
                      <Badge key={index} variant="outline">{style}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-center mt-8">
                <Button className="mr-4" onClick={() => navigate('/properties')}>
                  Browse Properties
                </Button>
                <Button variant="outline" onClick={() => navigate('/contact')}>
                  Schedule a Tour
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Amenities Tab */}
        <TabsContent value="amenities" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Amenities in {neighborhood.name}</CardTitle>
              <CardDescription>
                Schools, shopping, dining, and recreation options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="schools" className="w-full">
                <TabsList className="w-full max-w-lg grid grid-cols-4 mb-4">
                  <TabsTrigger value="schools">Schools</TabsTrigger>
                  <TabsTrigger value="shopping">Shopping</TabsTrigger>
                  <TabsTrigger value="dining">Dining</TabsTrigger>
                  <TabsTrigger value="recreation">Recreation</TabsTrigger>
                </TabsList>
                
                {/* Schools Tab */}
                <TabsContent value="schools" className="space-y-4">
                  {neighborhood.schoolDistrict && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium">School District</h3>
                      <p>{neighborhood.schoolDistrict}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {neighborhood.schools.map((school, index) => (
                      <Card key={index}>
                        <CardHeader className="p-4">
                          <CardTitle className="text-lg">{school.name}</CardTitle>
                          <CardDescription>{school.type}{school.grades ? ` • Grades ${school.grades}` : ''}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          {school.rating && (
                            <div className="flex items-center mb-2">
                              <span className="font-medium mr-2">Rating:</span>
                              <Badge variant={school.rating >= 8 ? "default" : school.rating >= 6 ? "secondary" : "outline"}>
                                {school.rating}/10
                              </Badge>
                            </div>
                          )}
                          {school.description && <p className="text-sm text-muted-foreground">{school.description}</p>}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                {/* Shopping Tab */}
                <TabsContent value="shopping" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {neighborhood.shopping.map((venue, index) => (
                      <Card key={index}>
                        <CardHeader className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{venue.name}</CardTitle>
                              <CardDescription>{venue.type}</CardDescription>
                            </div>
                            {venue.popular && <Badge>Popular</Badge>}
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          {venue.description && <p className="text-sm text-muted-foreground">{venue.description}</p>}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                {/* Dining Tab */}
                <TabsContent value="dining" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {neighborhood.dining.map((option, index) => (
                      <Card key={index}>
                        <CardHeader className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{option.name}</CardTitle>
                              <CardDescription>{option.cuisine}</CardDescription>
                            </div>
                            {option.priceRange && (
                              <Badge variant="outline">
                                {option.priceRange}
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          {option.description && <p className="text-sm text-muted-foreground">{option.description}</p>}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                {/* Recreation Tab */}
                <TabsContent value="recreation" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {neighborhood.recreation.map((rec, index) => (
                      <Card key={index}>
                        <CardHeader className="p-4">
                          <CardTitle className="text-lg">{rec.name}</CardTitle>
                          <CardDescription>{rec.type}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          {rec.description && <p className="text-sm text-muted-foreground">{rec.description}</p>}
                          
                          {rec.amenities && rec.amenities.length > 0 && (
                            <div className="mt-2">
                              <h4 className="text-sm font-medium mb-1">Amenities</h4>
                              <div className="flex flex-wrap gap-1">
                                {rec.amenities.map((amenity, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">{amenity}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Community Tab */}
        <TabsContent value="community" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Community in {neighborhood.name}</CardTitle>
              <CardDescription>
                Transportation, local businesses, and community events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Transportation Section */}
              <div>
                <h3 className="text-xl font-medium mb-4">Transportation</h3>
                <div className="space-y-4">
                  {neighborhood.transportation.map((option, index) => (
                    <div key={index} className="p-4 bg-card border rounded-lg">
                      <h4 className="text-lg font-medium">{option.type}</h4>
                      <p className="text-muted-foreground mt-1">{option.description}</p>
                      
                      {option.routes && option.routes.length > 0 && (
                        <div className="mt-2">
                          <h5 className="text-sm font-medium mb-1">Routes/Options</h5>
                          <div className="flex flex-wrap gap-1">
                            {option.routes.map((route, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">{route}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Local Businesses Section */}
              {neighborhood.localBusinesses && neighborhood.localBusinesses.length > 0 && (
                <div>
                  <h3 className="text-xl font-medium mb-4">Local Businesses</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {neighborhood.localBusinesses.map((business, index) => (
                      <Card key={index}>
                        <CardHeader className="p-4">
                          <CardTitle className="text-lg">{business.name}</CardTitle>
                          <CardDescription>{business.type}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          {business.description && <p className="text-sm text-muted-foreground mb-2">{business.description}</p>}
                          
                          <div className="flex flex-wrap gap-2">
                            {business.url && (
                              <Button variant="outline" size="sm" className="h-8" onClick={() => window.open(business.url, '_blank')}>
                                Website
                              </Button>
                            )}
                            {business.phone && (
                              <Button variant="outline" size="sm" className="h-8" onClick={() => window.open(`tel:${business.phone}`, '_blank')}>
                                Call
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Community Events Section */}
              {neighborhood.events && neighborhood.events.length > 0 && (
                <div>
                  <h3 className="text-xl font-medium mb-4">Community Events</h3>
                  <div className="space-y-4">
                    {neighborhood.events.map((event, index) => (
                      <Card key={index}>
                        <CardHeader className="p-4">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{event.name}</CardTitle>
                            {event.date && <Badge variant="outline">{event.date}</Badge>}
                          </div>
                          {event.location && <CardDescription>{event.location}</CardDescription>}
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          {event.description && <p className="text-sm text-muted-foreground">{event.description}</p>}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* FAQs Tab */}
        <TabsContent value="faqs">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions About {neighborhood.name}</CardTitle>
              <CardDescription>
                Common questions about living and investing in this neighborhood
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {neighborhood.faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" onClick={() => navigate('/contact')}>
                Have More Questions? Contact Us
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
