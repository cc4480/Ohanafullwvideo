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
import { Helmet } from 'react-helmet';
import SocialShareMetadata from "@/components/SocialShareMetadata";
import CanonicalURLs from "@/components/CanonicalURLs";
import { FAQStructuredData } from "@/components/StructuredData";

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
        email="info@ohanarealty.com"
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
      
      {/* FAQ Structured Data */}
      <FAQStructuredData
        questions={[
          {
            question: "What areas of Laredo does Ohana Realty service?",
            answer: "Ohana Realty services all neighborhoods in Laredo, TX including North Laredo, South Laredo, East Laredo, West Laredo, and surrounding communities. Our agents have extensive knowledge of all Laredo neighborhoods."
          },
          {
            question: "How can I schedule a property viewing?",
            answer: "You can schedule a property viewing by contacting Valentin Cuellar directly at (956) 712-3000, sending an email to info@ohanarealty.com, or using the contact form on our website. We offer flexible viewing times to accommodate your schedule."
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
