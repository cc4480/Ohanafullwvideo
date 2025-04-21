import Hero from "@/components/Hero";
import PropertySearch from "@/components/PropertySearch";
import FeaturedProperties from "@/components/FeaturedProperties";
import PropertyMap from "@/components/PropertyMap";
import AIAssistant from "@/components/AIAssistant";
import AboutRealtor from "@/components/AboutRealtor";
import NeighborhoodInsights from "@/components/NeighborhoodInsights";
import ContactSection from "@/components/ContactSection";
import CallToAction from "@/components/CallToAction";

export default function Home() {
  return (
    <main>
      <Hero />
      <PropertySearch />
      <FeaturedProperties />
      <PropertyMap />
      <AIAssistant />
      <AboutRealtor />
      <NeighborhoodInsights />
      <ContactSection />
      <CallToAction />
    </main>
  );
}
