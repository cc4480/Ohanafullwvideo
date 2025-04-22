import Hero from "@/components/home/Hero";
import PropertySearch from "@/components/properties/PropertySearch";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import PropertyMap from "@/components/properties/PropertyMap";
import AboutRealtor from "@/components/home/AboutRealtor";
import NeighborhoodInsights from "@/components/features/NeighborhoodInsights";
import ContactSection from "@/components/features/ContactSection";
import CallToAction from "@/components/home/CallToAction";
import SEOHead from "@/components/SEOHead";

export default function Home() {
  return (
    <>
      <SEOHead 
        title="Home"
        description="Ohana Realty - Your trusted partner for buying, selling, and renting properties in Laredo, TX. Valentin Cuellar offers personalized real estate services with local expertise."
        canonicalUrl="/"
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
