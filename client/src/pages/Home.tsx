import Hero from "@/components/home/Hero";
import PropertySearch from "@/components/properties/PropertySearch";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import PropertyMap from "@/components/properties/PropertyMap";
import AboutRealtor from "@/components/home/AboutRealtor";
import NeighborhoodInsights from "@/components/features/NeighborhoodInsights";
import ContactSection from "@/components/features/ContactSection";
import CallToAction from "@/components/home/CallToAction";
// Enhanced SEO components
import SEOOrganizationSchema from "@/components/SEOOrganizationSchema";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import { Helmet } from 'react-helmet';
import SocialShareMetadata from "@/components/SocialShareMetadata";
import CanonicalURLs from "@/components/CanonicalURLs";
import { FAQStructuredData } from "@/components/StructuredData";
import KeywordOptimizer from "@/components/KeywordOptimizer";
import SEOHead from "@/components/SEOHead";

export default function Home() {
  const websiteUrl = "https://ohanarealty.com";
  
  return (
    <>
      {/* Enhanced SEO Organization Schema */}
      <SEOOrganizationSchema
        name="Ohana Realty"
        url={websiteUrl}
        logo={`${websiteUrl}/logo.png`}
        description="Premier real estate agency in Laredo, TX specializing in residential and commercial properties, with personalized service and expert local knowledge."
        address={{
          street: "5802 McPherson Rd",
          city: "Laredo", 
          state: "TX",
          zip: "78041",
          country: "US"
        }}
        phone="+19567123000"
        email="valentin_cuellar@hotmail.com"
        socialLinks={[
          "https://www.facebook.com/ohanarealty",
          "https://www.instagram.com/ohanarealty",
          "https://www.linkedin.com/company/ohana-realty"
        ]}
      />
      
      {/* Enhanced Local Business Schema for local SEO */}
      <LocalBusinessSchema
        name="Ohana Realty"
        description="Premier real estate agency in Laredo, TX specializing in residential and commercial properties, with personalized service and expert local market knowledge. We help buyers find their dream homes and sellers maximize their property value."
        businessType="RealEstateAgent"
        location={{
          streetAddress: "5802 McPherson Rd",
          city: "Laredo",
          state: "TX",
          zipCode: "78041",
          latitude: 27.5629,
          longitude: -99.4805
        }}
        url={websiteUrl}
        logo={`${websiteUrl}/logo.png`}
        image={`${websiteUrl}/office-exterior.jpg`}
        telephone="+19567123000"
        email="valentin_cuellar@hotmail.com"
        priceRange="$$$"
        rating={4.9}
        hours={[
          { dayOfWeek: "Monday", opens: "09:00", closes: "18:00" },
          { dayOfWeek: "Tuesday", opens: "09:00", closes: "18:00" },
          { dayOfWeek: "Wednesday", opens: "09:00", closes: "18:00" },
          { dayOfWeek: "Thursday", opens: "09:00", closes: "18:00" },
          { dayOfWeek: "Friday", opens: "09:00", closes: "18:00" },
          { dayOfWeek: "Saturday", opens: "10:00", closes: "16:00" }
        ]}
        areasServed={[
          "Laredo", 
          "Webb County", 
          "South Texas",
          "North Laredo",
          "Downtown Laredo"
        ]}
        services={[
          "Residential Property Sales",
          "Commercial Property Sales",
          "Property Management",
          "Investment Properties",
          "Land Sales",
          "Real Estate Consulting",
          "Property Valuation"
        ]}
        yearEstablished={2008}
        socialLinks={[
          "https://www.facebook.com/ohanarealty",
          "https://www.instagram.com/ohanarealty",
          "https://www.linkedin.com/company/ohana-realty"
        ]}
      />
      
      {/* Social Media Sharing Optimizations */}
      <SocialShareMetadata
        title="Ohana Realty | Laredo TX Real Estate | Homes For Sale"
        description="Discover premium properties in Laredo, TX with Ohana Realty. Expert real estate services for buying, selling, and renting residential and commercial properties. Valentin Cuellar offers unmatched local expertise for your real estate journey."
        url={websiteUrl}
        image={`${websiteUrl}/og-image-home.jpg`}
        imageAlt="Ohana Realty - Laredo, TX properties and homes"
        type="website"
        siteName="Ohana Realty"
        locale="en_US"
        twitter={{
          card: "summary_large_image",
          site: "@OhanaRealty",
          creator: "@ValentinCuellar"
        }}
      />
      
      {/* Canonical URL Management */}
      <CanonicalURLs
        baseUrl={websiteUrl}
        defaultLanguage="en-US"
        alternateUrls={{
          "es": `${websiteUrl}/es`,
          "en-GB": `${websiteUrl}/gb`
        }}
      />
      
      {/* Advanced Keyword Optimization */}
      <KeywordOptimizer
        primaryKeywords={[
          'real estate', 
          'homes for sale', 
          'property listings',
          'real estate agent',
          'Laredo realtor'
        ]}
        secondaryKeywords={[
          'houses for sale',
          'residential properties',
          'commercial properties',
          'real estate agency',
          'property search',
          'buy home'
        ]}
        longTailKeywords={[
          'best real estate agent in Laredo TX',
          'luxury homes for sale Laredo',
          'affordable houses in Laredo Texas',
          'downtown Laredo commercial properties',
          'Laredo TX waterfront properties',
          'how to buy a house in Laredo Texas',
          'property investment opportunities in Laredo'
        ]}
        locationKeywords={[
          'Laredo', 
          'Laredo TX', 
          'Laredo Texas',
          'Webb County',
          'South Texas',
          'North Laredo',
          'Downtown Laredo'
        ]}
        semanticKeywords={[
          'real estate listings',
          'property search',
          'mortgage',
          'home buyer',
          'home seller',
          'housing market',
          'property values',
          'real estate trends',
          'property investments'
        ]}
        pageUrl={websiteUrl}
        pageType="homepage"
        enableLSI={true}
        advancedNLP={true}
      />
      
      {/* FAQ Structured Data */}
      <FAQStructuredData
        questions={[
          {
            question: "What areas of Laredo does Ohana Realty service?",
            answer: "Ohana Realty services all neighborhoods in Laredo, TX including North Laredo, South Laredo, East Laredo, West Laredo, and surrounding communities. Our agents have extensive knowledge of all Laredo neighborhoods."
          },
          {
            question: "How can I schedule a property viewing?",
            answer: "You can schedule a property viewing by contacting Valentin Cuellar directly at (956) 712-3000, sending an email to valentin_cuellar@hotmail.com, or using the contact form on our website. We offer flexible viewing times to accommodate your schedule."
          },
          {
            question: "What types of properties does Ohana Realty offer?",
            answer: "Ohana Realty offers a wide range of properties including residential homes, commercial properties, vacant land, luxury estates, and investment properties throughout Laredo, TX."
          },
          {
            question: "Is Ohana Realty available for property management services?",
            answer: "Yes, Ohana Realty provides comprehensive property management services for owners of residential and commercial properties in the Laredo area. Our services include tenant screening, rent collection, property maintenance, and more."
          },
          {
            question: "How long has Ohana Realty been serving Laredo?",
            answer: "Ohana Realty has been serving the Laredo community for over 15 years, established as a trusted name in local real estate with a commitment to exceptional service and client satisfaction."
          }
        ]}
      />
      
      <main>
        <Hero />
        <PropertySearch />
        <FeaturedProperties />
        <PropertyMap />
        <AboutRealtor />
        <NeighborhoodInsights />
        <ContactSection />
        <CallToAction />
      </main>
    </>
  );
}
