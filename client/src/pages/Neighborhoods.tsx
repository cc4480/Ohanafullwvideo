import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Neighborhood } from "@shared/schema";
import NeighborhoodCard from "@/components/features/NeighborhoodCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbStructuredData, FAQStructuredData } from "@/components/StructuredData";

export default function Neighborhoods() {
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const { data: neighborhoods, isLoading } = useQuery<Neighborhood[]>({
    queryKey: ["/api/neighborhoods"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!neighborhoods || neighborhoods.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-serif font-bold mb-4">Neighborhoods</h1>
        <p>No neighborhoods found. Please check back later.</p>
      </div>
    );
  }

  // Get unique features across all neighborhoods
  const allFeatures = neighborhoods.flatMap(n => n.features || []);
  const uniqueFeatures = Array.from(new Set(allFeatures));

  const websiteUrl = "https://ohanarealty.com";

  // Create neighborhood FAQs dynamically based on the data
  const neighborhoodFAQs = neighborhoods.slice(0, 3).map(neighborhood => ({
    question: `What makes ${neighborhood.name} special?`,
    answer: neighborhood.description
  }));

  // Add more general FAQs
  const generalFAQs = [
    {
      question: "What are the most popular neighborhoods in Laredo?",
      answer: "The most popular neighborhoods in Laredo include North Laredo, which is known for its upscale amenities and newer developments; Del Mar, which offers family-friendly suburbs; and The Heights, which is popular for its proximity to shopping and entertainment."
    },
    {
      question: "Which Laredo neighborhoods are best for families?",
      answer: "Families in Laredo often prefer neighborhoods like Alexander area for its excellent schools, San Isidro for its parks and recreational facilities, and Plantation for its safe streets and community amenities."
    },
    {
      question: "What neighborhoods in Laredo offer the best value for investment?",
      answer: "Investors looking for value in Laredo should consider emerging neighborhoods like South Laredo for its development potential, The Loop area for its growing commercial activity, and Las Lomas for its affordable property values with appreciation potential."
    },
    {
      question: "How do I choose the right Laredo neighborhood for my lifestyle?",
      answer: "To choose the right Laredo neighborhood, consider your priorities: proximity to work, school quality, budget, desired amenities, and preferred home style. Valentin Cuellar at Ohana Realty can help match your lifestyle needs with the perfect neighborhood."
    }
  ];

  return (
    <>
      <SEOHead 
        title="Laredo TX Neighborhoods Guide | Explore Areas & Communities | Ohana Realty"
        description="Explore Laredo's diverse neighborhoods and find your perfect community. Detailed guides to North Laredo, South Laredo, Del Mar, The Heights, and more with amenities, school information, and local features to help you choose the ideal location."
        canonicalUrl="/neighborhoods"
        ogImage={`${websiteUrl}/og-image-neighborhoods.jpg`}
      />
      
      {/* Breadcrumb Structured Data */}
      <BreadcrumbStructuredData
        items={[
          {
            name: "Home",
            item: websiteUrl
          },
          {
            name: "Neighborhoods",
            item: `${websiteUrl}/neighborhoods`
          }
        ]}
      />
      
      {/* FAQ Structured Data */}
      <FAQStructuredData
        questions={[...neighborhoodFAQs, ...generalFAQs]}
      />
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Explore Laredo Neighborhoods</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the unique characteristics and charm of Laredo's diverse neighborhoods. 
            Each area offers its own culture, amenities, and lifestyle opportunities.
          </p>
        </div>

        <div className="mb-8">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="all">All Neighborhoods</TabsTrigger>
                {uniqueFeatures.slice(0, 4).map(feature => (
                  <TabsTrigger key={feature} value={feature}>{feature}</TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {neighborhoods.map(neighborhood => (
                  <NeighborhoodCard key={neighborhood.id} neighborhood={neighborhood} />
                ))}
              </div>
            </TabsContent>
            
            {uniqueFeatures.slice(0, 4).map(feature => (
              <TabsContent key={feature} value={feature}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {neighborhoods
                    .filter(n => n.features && n.features.includes(feature))
                    .map(neighborhood => (
                      <NeighborhoodCard key={neighborhood.id} neighborhood={neighborhood} />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="mt-16 bg-card rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-serif font-semibold mb-6">Popular Features in Laredo Neighborhoods</h2>
          <div className="flex flex-wrap gap-2">
            {uniqueFeatures.map(feature => (
              <Badge 
                key={feature} 
                variant={activeTab === feature ? "default" : "outline"}
                className="cursor-pointer text-sm py-1.5"
                onClick={() => setActiveTab(feature)}
              >
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-serif font-semibold mb-6">Why Choose Laredo?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h3 className="font-serif text-xl font-medium mb-3">Strong Community</h3>
              <p className="text-muted-foreground">
                Laredo is known for its close-knit communities and rich cultural heritage. Residents enjoy a strong sense 
                of belonging and numerous community events throughout the year.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h3 className="font-serif text-xl font-medium mb-3">Economic Opportunity</h3>
              <p className="text-muted-foreground">
                As one of the largest inland ports in the United States, Laredo offers excellent career opportunities 
                in international trade, healthcare, education, and retail.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h3 className="font-serif text-xl font-medium mb-3">Cultural Richness</h3>
              <p className="text-muted-foreground">
                Experience a unique blend of American and Mexican cultures, with vibrant festivals, delicious cuisine, 
                and historic attractions that celebrate the region's heritage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}