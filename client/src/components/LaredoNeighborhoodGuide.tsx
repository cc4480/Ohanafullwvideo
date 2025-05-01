import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Building2, MapPin, School, Car, ShoppingBag, Star, Clock, Landmark, Heart, LucideIcon, HomeIcon, BadgePercent, HandCoins, Leaf, AlertTriangle, Check, Shield } from "lucide-react";

// This could come from your database
const LAREDO_NEIGHBORHOODS = [
  {
    id: 1,
    name: "North Laredo",
    description: "Upscale residential area with newer developments, shopping centers, and excellent schools. Popular for families and professionals.",
    image: "/images/neighborhoods/north-laredo.jpg",
    price_range: "$$$-$$$$",
    safety_score: 85,
    school_rating: 9.2,
    commute_score: 8.5,
    amenities_score: 9.0,
    popular_for: ["Families", "Professionals", "Luxury homes"],
    key_attractions: ["Mall Del Norte", "North Central Park", "Laredo Country Club"],
    sub_areas: ["Del Mar", "San Isidro", "Winfield"],
    property_types: {"Single Family": 65, "Townhomes": 20, "Apartments": 15},
    avg_price_sqft: 130
  },
  {
    id: 2,
    name: "Downtown Laredo",
    description: "Historic district with rich cultural heritage, government buildings, and border commerce. Features historic architecture and vibrant Hispanic culture.",
    image: "/images/neighborhoods/downtown-laredo.jpg",
    price_range: "$-$$",
    safety_score: 60,
    school_rating: 6.5,
    commute_score: 8.0,
    amenities_score: 7.5,
    popular_for: ["Urban living", "Culture enthusiasts", "Affordability"],
    key_attractions: ["San Agustin Cathedral", "Laredo Center for the Arts", "Jarvis Plaza"],
    sub_areas: ["St. Peter's Historic District", "San Agustin", "CBD"],
    property_types: {"Historic Homes": 35, "Apartments": 40, "Mixed Use": 25},
    avg_price_sqft: 82
  },
  {
    id: 3,
    name: "San Isidro",
    description: "Prestigious master-planned community with luxury homes, golf courses, and exclusive amenities. One of Laredo's most affluent areas.",
    image: "/images/neighborhoods/san-isidro.jpg",
    price_range: "$$$$",
    safety_score: 95,
    school_rating: 9.8,
    commute_score: 7.0,
    amenities_score: 9.5,
    popular_for: ["Luxury living", "Golf enthusiasts", "High-end homes"],
    key_attractions: ["San Isidro Ranch Golf Club", "The Reserve at San Isidro", "Exclusive gated communities"],
    sub_areas: ["The Reserve", "San Isidro East", "San Isidro Ranch"],
    property_types: {"Luxury Estates": 75, "Custom Homes": 20, "Executive Residences": 5},
    avg_price_sqft: 185
  },
  {
    id: 4,
    name: "Del Mar",
    description: "Established neighborhood with mature trees, spacious lots, and a mix of mid-century and newer homes. Popular family-friendly area near shopping and schools.",
    image: "/images/neighborhoods/del-mar.jpg",
    price_range: "$$$",
    safety_score: 88,
    school_rating: 8.7,
    commute_score: 8.0,
    amenities_score: 8.5,
    popular_for: ["Families", "Established professionals", "Mid-range luxury"],
    key_attractions: ["Del Mar Park", "United Day School", "Alexander High School"],
    sub_areas: ["Del Mar Hills", "Del Mar West", "Alexander Area"],
    property_types: {"Single Family": 80, "Townhomes": 15, "Custom Builds": 5},
    avg_price_sqft: 145
  },
  {
    id: 5,
    name: "La Bota Ranch",
    description: "Master-planned community with various housing options from apartments to luxury homes. Features recreational facilities and a resort atmosphere.",
    image: "/images/neighborhoods/la-bota-ranch.jpg",
    price_range: "$$$-$$$$",
    safety_score: 90,
    school_rating: 9.0,
    commute_score: 7.5,
    amenities_score: 9.0,
    popular_for: ["Diverse housing", "Families", "Recreation focused"],
    key_attractions: ["La Bota Polo Fields", "Community pools and parks", "Hiking trails"],
    sub_areas: ["La Bota Polo Estates", "La Bota Campestre", "The Villas"],
    property_types: {"Single Family": 60, "Townhomes": 25, "Apartments": 15},
    avg_price_sqft: 138
  },
  {
    id: 6,
    name: "South Laredo",
    description: "Affordable residential area with strong Hispanic heritage. Offers more affordable housing options and a tight-knit community atmosphere.",
    image: "/images/neighborhoods/south-laredo.jpg",
    price_range: "$-$$",
    safety_score: 65,
    school_rating: 7.0,
    commute_score: 7.0,
    amenities_score: 6.5,
    popular_for: ["Affordability", "First-time buyers", "Hispanic culture"],
    key_attractions: ["Zacate Creek Park", "South Laredo Library", "Local Hispanic markets"],
    sub_areas: ["Las Lomas", "Santo Niño", "Cheyenne"],
    property_types: {"Single Family": 75, "Duplexes": 15, "Apartments": 10},
    avg_price_sqft: 85
  },
  {
    id: 7,
    name: "Plantation",
    description: "Established upscale neighborhood with character and mature landscaping. Features large lots and custom homes in a prime location.",
    image: "/images/neighborhoods/plantation.jpg",
    price_range: "$$$-$$$$",
    safety_score: 92,
    school_rating: 9.5,
    commute_score: 8.0,
    amenities_score: 8.5,
    popular_for: ["Luxury homes", "Established families", "Privacy"],
    key_attractions: ["Large estate lots", "Custom architectural styles", "Proximity to Country Club"],
    sub_areas: ["Plantation East", "Plantation West", "The Reserves"],
    property_types: {"Estate Homes": 90, "Custom Builds": 10},
    avg_price_sqft: 155
  },
  {
    id: 8,
    name: "United/Killam Airport",
    description: "Growing area near United ISD campuses and Laredo International Airport. Features newer developments catering to airport employees and education professionals.",
    image: "/images/neighborhoods/united-killam.jpg",
    price_range: "$$-$$$",
    safety_score: 82,
    school_rating: 8.5,
    commute_score: 7.0,
    amenities_score: 7.5,
    popular_for: ["Education professionals", "Airport employees", "Mid-range homes"],
    key_attractions: ["United High School", "Sports Complex", "Independence Hills Park"],
    sub_areas: ["Airport Area", "Independence Hills", "United East"],
    property_types: {"Single Family": 70, "Starter Homes": 20, "Apartments": 10},
    avg_price_sqft: 120
  }
];

interface NeighborhoodScoreBoxProps {
  score: number;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const NeighborhoodScoreBox: React.FC<NeighborhoodScoreBoxProps> = ({ score, label, icon, color }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-md p-3 shadow-sm border">
      <div className={`mb-1 ${color}`}>{icon}</div>
      <div className="text-2xl font-bold">{score}</div>
      <div className="text-xs text-gray-500 text-center">{label}</div>
    </div>
  );
};

interface NeighborhoodCardProps {
  neighborhood: any;
  onClick?: () => void;
}

const NeighborhoodCard: React.FC<NeighborhoodCardProps> = ({ neighborhood, onClick }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <div className="relative">
        <AspectRatio ratio={16/9}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 z-10"></div>
          <div 
            className="w-full h-full bg-cover bg-center" 
            style={{ 
              backgroundImage: neighborhood.image ? 
                `url(${neighborhood.image})` : 
                'url(/images/neighborhoods/default.jpg)' 
            }}
          ></div>
        </AspectRatio>
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
          <h3 className="text-xl font-semibold text-white">{neighborhood.name}</h3>
          <div className="flex items-center mt-1">
            <MapPin className="h-4 w-4 text-white mr-1" />
            <span className="text-sm text-white">Laredo, TX</span>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <Badge variant="outline" className="text-xs">{neighborhood.price_range}</Badge>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium">{((neighborhood.safety_score + neighborhood.school_rating + neighborhood.commute_score + neighborhood.amenities_score) / 4).toFixed(1)}/10</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 line-clamp-3">{neighborhood.description}</p>
      </CardContent>
      <CardFooter className="px-4 py-3 bg-gray-50 border-t flex justify-between">
        <div className="flex space-x-3">
          {neighborhood.popular_for.slice(0, 2).map((tag: string, i: number) => (
            <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
          {neighborhood.popular_for.length > 2 && (
            <Badge variant="secondary" className="text-xs">+{neighborhood.popular_for.length - 2}</Badge>
          )}
        </div>
        <span className="text-xs text-gray-500">${neighborhood.avg_price_sqft}/ft²</span>
      </CardFooter>
    </Card>
  );
};

const NeighborhoodDetail: React.FC<{ neighborhood: any }> = ({ neighborhood }) => {
  return (
    <div className="space-y-6">
      <div className="relative rounded-lg overflow-hidden">
        <AspectRatio ratio={21/9}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/70 z-10"></div>
          <div 
            className="w-full h-full bg-cover bg-center" 
            style={{ 
              backgroundImage: neighborhood.image ? 
                `url(${neighborhood.image})` : 
                'url(/images/neighborhoods/default.jpg)' 
            }}
          ></div>
        </AspectRatio>
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
          <h2 className="text-3xl font-bold text-white mb-2">{neighborhood.name}</h2>
          <div className="flex items-center text-white">
            <MapPin className="h-5 w-5 mr-2" />
            <span>Laredo, TX</span>
            <Badge className="ml-4 bg-white/20 text-white border-none">{neighborhood.price_range}</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-3">About {neighborhood.name}</h3>
          <p className="text-gray-700">{neighborhood.description}</p>
          
          <h4 className="text-lg font-medium mt-6 mb-3">Neighborhood Highlights</h4>
          <div className="grid grid-cols-2 gap-3">
            {neighborhood.key_attractions.map((attraction: string, i: number) => (
              <div key={i} className="flex items-start">
                <Landmark className="h-5 w-5 text-blue-500 mt-0.5 mr-2 shrink-0" />
                <span>{attraction}</span>
              </div>
            ))}
          </div>

          <h4 className="text-lg font-medium mt-6 mb-3">Sub-Areas</h4>
          <div className="flex flex-wrap gap-2">
            {neighborhood.sub_areas.map((area: string, i: number) => (
              <Badge key={i} variant="outline" className="text-sm py-1">{area}</Badge>
            ))}
          </div>

          <h4 className="text-lg font-medium mt-6 mb-3">Popular With</h4>
          <div className="flex flex-wrap gap-2">
            {neighborhood.popular_for.map((type: string, i: number) => (
              <Badge key={i} className="text-sm py-1">{type}</Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Neighborhood Ratings</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <NeighborhoodScoreBox 
              score={neighborhood.safety_score / 10} 
              label="Safety Score" 
              icon={<Shield className="h-6 w-6" />} 
              color="text-green-500" 
            />
            <NeighborhoodScoreBox 
              score={neighborhood.school_rating} 
              label="School Rating" 
              icon={<School className="h-6 w-6" />} 
              color="text-blue-500" 
            />
            <NeighborhoodScoreBox 
              score={neighborhood.commute_score} 
              label="Commute Score" 
              icon={<Car className="h-6 w-6" />} 
              color="text-purple-500" 
            />
            <NeighborhoodScoreBox 
              score={neighborhood.amenities_score} 
              label="Amenities Score" 
              icon={<ShoppingBag className="h-6 w-6" />} 
              color="text-amber-500" 
            />
          </div>

          <h4 className="text-lg font-medium mb-3">Property Types</h4>
          <div className="space-y-3">
            {Object.entries(neighborhood.property_types).map(([type, percentage]: [string, any], i: number) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">{type}</span>
                  <span className="text-sm font-medium">{percentage}%</span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Button className="w-full">
              <Heart className="mr-2 h-4 w-4" />
              View Properties in {neighborhood.name}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NeighborhoodGuideContent: React.FC = () => {
  const [activeNeighborhood, setActiveNeighborhood] = React.useState<number | null>(null);
  const [activeTab, setActiveTab] = React.useState('all');
  
  const filteredNeighborhoods = React.useMemo(() => {
    if (activeTab === 'all') return LAREDO_NEIGHBORHOODS;
    if (activeTab === 'luxury') {
      return LAREDO_NEIGHBORHOODS.filter(n => 
        n.price_range.includes('$$$$') || 
        (n.avg_price_sqft > 150)
      );
    }
    if (activeTab === 'family') {
      return LAREDO_NEIGHBORHOODS.filter(n => 
        n.popular_for.some((tag: string) => tag.toLowerCase().includes('famil')) && 
        n.school_rating > 8.0 && 
        n.safety_score > 80
      );
    }
    if (activeTab === 'affordable') {
      return LAREDO_NEIGHBORHOODS.filter(n => 
        n.price_range.includes('$') && 
        !n.price_range.includes('$$$$') && 
        (n.avg_price_sqft < 100)
      );
    }
    return LAREDO_NEIGHBORHOODS;
  }, [activeTab]);
  
  const selectedNeighborhood = React.useMemo(() => {
    if (activeNeighborhood === null) return null;
    return LAREDO_NEIGHBORHOODS.find(n => n.id === activeNeighborhood);
  }, [activeNeighborhood]);

  return (
    <div className="space-y-6">
      {selectedNeighborhood ? (
        <div>
          <Button 
            variant="outline" 
            onClick={() => setActiveNeighborhood(null)} 
            className="mb-4"
          >
            ← Back to All Neighborhoods
          </Button>
          <NeighborhoodDetail neighborhood={selectedNeighborhood} />
        </div>
      ) : (
        <>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Areas</TabsTrigger>
              <TabsTrigger value="luxury">Luxury</TabsTrigger>
              <TabsTrigger value="family">Family-Friendly</TabsTrigger>
              <TabsTrigger value="affordable">Affordable</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNeighborhoods.map((neighborhood) => (
              <NeighborhoodCard 
                key={neighborhood.id} 
                neighborhood={neighborhood} 
                onClick={() => setActiveNeighborhood(neighborhood.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const NeighborhoodFAQ: React.FC = () => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is the best neighborhood in Laredo for families?</AccordionTrigger>
        <AccordionContent>
          <p className="mb-2">For families, the top neighborhoods in Laredo are:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>North Laredo</strong> - Excellent schools, newer developments, and family-oriented amenities</li>
            <li><strong>San Isidro</strong> - Premium master-planned community with top-rated schools and safety</li>
            <li><strong>Del Mar</strong> - Established neighborhood with mature trees and proximity to quality schools</li>
          </ul>
          <p className="mt-2">These areas offer the best combination of school quality, safety, family amenities, and appropriate housing options for families of various sizes.</p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger>Where can I find luxury homes in Laredo?</AccordionTrigger>
        <AccordionContent>
          <p className="mb-2">Laredo's luxury home market is concentrated in these premium neighborhoods:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>San Isidro</strong> - Laredo's most prestigious area with estates often exceeding $1M</li>
            <li><strong>Plantation</strong> - Established luxury neighborhood with custom homes on large lots</li>
            <li><strong>La Bota Ranch</strong> - Master-planned community with high-end homes, particularly in La Bota Polo Estates</li>
            <li><strong>Del Mar Hills</strong> - Upscale section of Del Mar with executive homes</li>
          </ul>
          <p className="mt-2">These neighborhoods feature architectural diversity, premium amenities, and often exclusive access to country clubs, golf courses, or gated communities.</p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionTrigger>What are the most affordable neighborhoods in Laredo?</AccordionTrigger>
        <AccordionContent>
          <p className="mb-2">Laredo offers several affordable neighborhoods with good value:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>South Laredo</strong> - Most affordable area with strong Hispanic heritage and tight-knit community</li>
            <li><strong>Downtown Laredo</strong> - Historic district with more affordable options and urban character</li>
            <li><strong>Las Lomas</strong> - Neighborhood in South Laredo with particularly good housing values</li>
          </ul>
          <p className="mt-2">These areas typically offer homes in the $100K-$200K range, making them ideal for first-time homebuyers or investors. While they may have slightly lower school ratings or amenity scores, they offer authentic Laredo character and strong community ties.</p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-4">
        <AccordionTrigger>Which Laredo neighborhoods have the best schools?</AccordionTrigger>
        <AccordionContent>
          <p className="mb-2">For top educational opportunities, consider these neighborhoods:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>San Isidro</strong> - Access to highest-rated public and private schools (9.8/10 rating)</li>
            <li><strong>Plantation</strong> - Excellent school zone with top-performing campuses (9.5/10 rating)</li>
            <li><strong>North Laredo</strong> - Strong public schools and proximity to United ISD campuses (9.2/10 rating)</li>
          </ul>
          <p className="mt-2">These areas are served by a combination of United ISD and Laredo ISD schools, with access to high-performing campuses at all levels from elementary through high school. Many families specifically choose these neighborhoods for educational opportunities.</p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-5">
        <AccordionTrigger>What are the safest neighborhoods in Laredo?</AccordionTrigger>
        <AccordionContent>
          <p className="mb-2">Safety is a priority for many homebuyers. These Laredo neighborhoods have the highest safety ratings:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>San Isidro</strong> - Premier gated communities with 24/7 security (95/100 safety score)</li>
            <li><strong>Plantation</strong> - Established upscale area with low crime rates (92/100 safety score)</li>
            <li><strong>La Bota Ranch</strong> - Controlled-access community with excellent security (90/100 safety score)</li>
          </ul>
          <p className="mt-2">These neighborhoods typically feature gated entrances, neighborhood watch programs, private security, or increased police presence, contributing to their high safety ratings. Crime rates in these areas are significantly below the Laredo average.</p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-6">
        <AccordionTrigger>Where are the newest developments in Laredo?</AccordionTrigger>
        <AccordionContent>
          <p className="mb-2">Laredo continues to grow with these areas seeing the most new construction:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>North Laredo</strong> - Ongoing new subdivisions and planned communities</li>
            <li><strong>San Isidro Northeast</strong> - Expansion area with luxury new construction</li>
            <li><strong>United/Killam Airport Area</strong> - Growing residential corridor with new developments</li>
          </ul>
          <p className="mt-2">These areas feature the latest home designs, modern amenities, and new infrastructure. New construction homes in these neighborhoods typically range from the high $200Ks to over $1M depending on the specific location and features.</p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-7">
        <AccordionTrigger>Which neighborhoods have the best investment potential?</AccordionTrigger>
        <AccordionContent>
          <p className="mb-2">For real estate investors, these Laredo areas show promising return potential:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>United/Killam Airport Area</strong> - Growing region with appreciating values</li>
            <li><strong>Downtown Laredo</strong> - Urban revival potential with historic properties</li>
            <li><strong>North Laredo</strong> - Stable growth and strong rental market near medical and retail centers</li>
          </ul>
          <p className="mt-2">These areas offer different investment strategies from appreciation potential to rental income. The United/Killam area is showing consistent growth as the city expands northward, while Downtown offers unique opportunities for those interested in historic renovation and potential revitalization incentives.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export const LaredoNeighborhoodStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <HomeIcon className="h-4 w-4 mr-2 text-blue-500" />
            Average Home Price
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">$245,800</div>
          <p className="text-sm text-gray-500 mt-1">City of Laredo average</p>
          <div className="mt-3 text-sm grid grid-cols-2 gap-2">
            <div>
              <span className="text-gray-500">North Laredo:</span>
              <div className="font-medium">$380,500</div>
            </div>
            <div>
              <span className="text-gray-500">South Laredo:</span>
              <div className="font-medium">$165,200</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <BadgePercent className="h-4 w-4 mr-2 text-green-500" />
            Appreciation Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">5.8%</div>
          <p className="text-sm text-gray-500 mt-1">Annual average (last 3 years)</p>
          <div className="mt-3 text-sm">
            <div className="flex items-center justify-between mb-1">
              <span>San Isidro</span>
              <span className="font-medium">7.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Downtown</span>
              <span className="font-medium">3.4%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <HandCoins className="h-4 w-4 mr-2 text-amber-500" />
            Avg. Price per Sq.Ft.
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">$119</div>
          <p className="text-sm text-gray-500 mt-1">City average per sq.ft.</p>
          <div className="mt-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Range:</span>
              <span className="font-medium">$82 - $185</span>
            </div>
            <div className="flex items-center justify-between">
              <span>New Construction:</span>
              <span className="font-medium">$145+</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Clock className="h-4 w-4 mr-2 text-purple-500" />
            Days on Market
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">32</div>
          <p className="text-sm text-gray-500 mt-1">Average days to sell</p>
          <div className="mt-3 text-sm">
            <div className="flex items-center justify-between mb-1">
              <span>Luxury Homes:</span>
              <span className="font-medium">65 days</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Mid-range:</span>
              <span className="font-medium">28 days</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const NeighborhoodAmenityScore: React.FC<{
  name: string;
  icon: React.ReactNode;
  score: number;
}> = ({ name, icon, score }) => {
  return (
    <div className="flex items-center">
      <div className="mr-3">{icon}</div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">{name}</span>
          <span className="text-sm">{score}/10</span>
        </div>
        <Progress value={score * 10} className="h-2" />
      </div>
    </div>
  );
};

const NeighborhoodComparison: React.FC = () => {
  return (
    <div>
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-3">North Laredo vs. South Laredo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">North Laredo</CardTitle>
                <CardDescription>Upscale area with newer developments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="text-sm py-1">$$$-$$$$</Badge>
                  <span className="text-sm font-medium">$380,500 avg.</span>
                </div>
                <div className="space-y-3">
                  <NeighborhoodAmenityScore name="Schools" icon={<School className="h-5 w-5 text-blue-500" />} score={9.2} />
                  <NeighborhoodAmenityScore name="Safety" icon={<AlertTriangle className="h-5 w-5 text-green-500" />} score={8.5} />
                  <NeighborhoodAmenityScore name="Shopping" icon={<ShoppingBag className="h-5 w-5 text-purple-500" />} score={9.0} />
                  <NeighborhoodAmenityScore name="Parks" icon={<Leaf className="h-5 w-5 text-amber-500" />} score={8.5} />
                </div>
                <div className="pt-2">
                  <span className="text-sm font-medium">Best for:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">Families</Badge>
                    <Badge variant="secondary" className="text-xs">Professionals</Badge>
                    <Badge variant="secondary" className="text-xs">Luxury</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">South Laredo</CardTitle>
                <CardDescription>Affordable area with cultural heritage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="text-sm py-1">$-$$</Badge>
                  <span className="text-sm font-medium">$165,200 avg.</span>
                </div>
                <div className="space-y-3">
                  <NeighborhoodAmenityScore name="Schools" icon={<School className="h-5 w-5 text-blue-500" />} score={7.0} />
                  <NeighborhoodAmenityScore name="Safety" icon={<AlertTriangle className="h-5 w-5 text-green-500" />} score={6.5} />
                  <NeighborhoodAmenityScore name="Shopping" icon={<ShoppingBag className="h-5 w-5 text-purple-500" />} score={6.0} />
                  <NeighborhoodAmenityScore name="Parks" icon={<Leaf className="h-5 w-5 text-amber-500" />} score={6.5} />
                </div>
                <div className="pt-2">
                  <span className="text-sm font-medium">Best for:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">Affordability</Badge>
                    <Badge variant="secondary" className="text-xs">First-time buyers</Badge>
                    <Badge variant="secondary" className="text-xs">Hispanic culture</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">San Isidro vs. Downtown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">San Isidro</CardTitle>
                <CardDescription>Prestigious master-planned community</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="text-sm py-1">$$$$</Badge>
                  <span className="text-sm font-medium">$520,000+ avg.</span>
                </div>
                <div className="space-y-3">
                  <NeighborhoodAmenityScore name="Schools" icon={<School className="h-5 w-5 text-blue-500" />} score={9.8} />
                  <NeighborhoodAmenityScore name="Safety" icon={<AlertTriangle className="h-5 w-5 text-green-500" />} score={9.5} />
                  <NeighborhoodAmenityScore name="Shopping" icon={<ShoppingBag className="h-5 w-5 text-purple-500" />} score={8.0} />
                  <NeighborhoodAmenityScore name="Parks" icon={<Leaf className="h-5 w-5 text-amber-500" />} score={9.5} />
                </div>
                <div className="pt-2">
                  <span className="text-sm font-medium">Best for:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">Luxury</Badge>
                    <Badge variant="secondary" className="text-xs">Golf enthusiasts</Badge>
                    <Badge variant="secondary" className="text-xs">Executives</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Downtown Laredo</CardTitle>
                <CardDescription>Historic district with cultural heritage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="text-sm py-1">$-$$</Badge>
                  <span className="text-sm font-medium">$145,000 avg.</span>
                </div>
                <div className="space-y-3">
                  <NeighborhoodAmenityScore name="Schools" icon={<School className="h-5 w-5 text-blue-500" />} score={6.5} />
                  <NeighborhoodAmenityScore name="Safety" icon={<AlertTriangle className="h-5 w-5 text-green-500" />} score={6.0} />
                  <NeighborhoodAmenityScore name="Shopping" icon={<ShoppingBag className="h-5 w-5 text-purple-500" />} score={7.5} />
                  <NeighborhoodAmenityScore name="Parks" icon={<Leaf className="h-5 w-5 text-amber-500" />} score={5.5} />
                </div>
                <div className="pt-2">
                  <span className="text-sm font-medium">Best for:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">Urban living</Badge>
                    <Badge variant="secondary" className="text-xs">Historic character</Badge>
                    <Badge variant="secondary" className="text-xs">Cultural experiences</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const SchoolsInfo: React.FC = () => {
  const topSchools = [
    { name: "United High School", type: "Public (9-12)", rating: 9.2, district: "United ISD", neighborhood: "United/Killam Airport" },
    { name: "Alexander High School", type: "Public (9-12)", rating: 9.0, district: "United ISD", neighborhood: "Del Mar" },
    { name: "United Day School", type: "Private (K-8)", rating: 9.8, district: "Private", neighborhood: "Del Mar" },
    { name: "San Isidro Elementary", type: "Public (K-5)", rating: 9.5, district: "United ISD", neighborhood: "San Isidro" },
    { name: "Trautmann Middle School", type: "Public (6-8)", rating: 8.8, district: "United ISD", neighborhood: "North Laredo" },
    { name: "St. Augustine School", type: "Private (K-12)", rating: 9.3, district: "Private", neighborhood: "Central Laredo" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Top Schools in Laredo</h3>
        <div className="rounded-md border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Neighborhood</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topSchools.map((school, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{school.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={school.type.includes('Private') ? 'outline' : 'secondary'} className="text-xs">
                      {school.type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="font-semibold">{school.rating}</span>
                      <span className="text-gray-400">/10</span>
                      <Star className="h-4 w-4 text-yellow-500 ml-1" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{school.district}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{school.neighborhood}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">School Districts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-medium">United Independent School District (United ISD)</h4>
              <p className="text-sm text-gray-700">Serves northern, eastern and southern parts of Laredo and most new developments. Generally higher rated with newer facilities.</p>
              <div className="flex items-center mt-1">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm font-medium">8.8/10</span>
                <span className="text-xs text-gray-500 ml-2">District Rating</span>
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium">Laredo Independent School District (LISD)</h4>
              <p className="text-sm text-gray-700">Serves central and older parts of Laredo including downtown and established neighborhoods. Has some magnet programs for advanced students.</p>
              <div className="flex items-center mt-1">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm font-medium">7.2/10</span>
                <span className="text-xs text-gray-500 ml-2">District Rating</span>
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium">Private Schools</h4>
              <p className="text-sm text-gray-700">Several quality private options including St. Augustine, United Day School, and Laredo Christian Academy. Typically higher rated but with tuition costs.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">School Considerations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                Best Neighborhoods for Education
              </h4>
              <ul className="ml-7 mt-1 list-disc text-sm space-y-1">
                <li><strong>San Isidro</strong> - Highest rated schools in Laredo</li>
                <li><strong>Del Mar</strong> - Access to both top public and private options</li>
                <li><strong>North Laredo</strong> - Excellent United ISD schools</li>
              </ul>
            </div>
          
            <div>
              <h4 className="font-medium flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                Bilingual Education
              </h4>
              <p className="text-sm text-gray-700 ml-7">Many Laredo schools offer strong bilingual programs recognizing the border city's bicultural nature. This is valuable for families seeking bilingual education.</p>
            </div>

            <div>
              <h4 className="font-medium flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                Higher Education
              </h4>
              <p className="text-sm text-gray-700 ml-7">Laredo is home to Texas A&M International University and Laredo College, providing higher education options within the city.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const LaredoNeighborhoodGuide: React.FC = () => {
  return (
    <Card className="w-full max-w-6xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Laredo Neighborhood Guide</CardTitle>
        <CardDescription className="text-lg">
          Explore Laredo's diverse neighborhoods and find your perfect home
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="neighborhoods">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="neighborhoods">Neighborhoods</TabsTrigger>
            <TabsTrigger value="comparison">Comparisons</TabsTrigger>
            <TabsTrigger value="stats">Market Stats</TabsTrigger>
            <TabsTrigger value="schools">Schools</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>
          <div className="mt-6">
            <TabsContent value="neighborhoods">
              <NeighborhoodGuideContent />
            </TabsContent>
            <TabsContent value="comparison">
              <NeighborhoodComparison />
            </TabsContent>
            <TabsContent value="stats">
              <div className="space-y-8">
                <h3 className="text-xl font-semibold">Laredo Real Estate Market Statistics</h3>
                <LaredoNeighborhoodStats />
                
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h4 className="text-lg font-medium text-blue-800 mb-2">Laredo Market Insights</h4>
                  <p className="text-blue-700">
                    The Laredo real estate market has shown consistent growth with an average appreciation rate of 5.8% annually over the past three years. Northern areas are seeing the most development, while downtown and south Laredo offer the most affordable options. The market varies significantly by neighborhood, with a 2.5x price difference between luxury and affordable areas.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Property Types</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Single Family</span>
                        <span className="text-sm font-medium">68%</span>
                      </div>
                      <Progress value={68} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Townhomes/Condos</span>
                        <span className="text-sm font-medium">14%</span>
                      </div>
                      <Progress value={14} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Apartments</span>
                        <span className="text-sm font-medium">12%</span>
                      </div>
                      <Progress value={12} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Other</span>
                        <span className="text-sm font-medium">6%</span>
                      </div>
                      <Progress value={6} className="h-2" />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Price Ranges</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Under $200K</span>
                        <span className="text-sm font-medium">35%</span>
                      </div>
                      <Progress value={35} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">$200K - $300K</span>
                        <span className="text-sm font-medium">30%</span>
                      </div>
                      <Progress value={30} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">$300K - $500K</span>
                        <span className="text-sm font-medium">25%</span>
                      </div>
                      <Progress value={25} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">$500K+</span>
                        <span className="text-sm font-medium">10%</span>
                      </div>
                      <Progress value={10} className="h-2" />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Area Growth</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">North Laredo</span>
                        <span className="text-sm font-medium">+12.5%</span>
                      </div>
                      <Progress value={12.5 * 5} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">San Isidro</span>
                        <span className="text-sm font-medium">+10.2%</span>
                      </div>
                      <Progress value={10.2 * 5} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">United/Killam</span>
                        <span className="text-sm font-medium">+8.7%</span>
                      </div>
                      <Progress value={8.7 * 5} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Downtown</span>
                        <span className="text-sm font-medium">+3.1%</span>
                      </div>
                      <Progress value={3.1 * 5} className="h-2" />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="schools">
              <SchoolsInfo />
            </TabsContent>
            <TabsContent value="faq">
              <NeighborhoodFAQ />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LaredoNeighborhoodGuide;
