import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Find Your Dream Property?
        </h2>
        <p className="text-neutral-100 max-w-2xl mx-auto mb-8">
          Let Valentin Cuellar guide you through the Laredo real estate market and help you find the perfect property that meets all your needs.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/properties">
            <Button variant="outline" className="bg-white hover:bg-neutral-100 text-primary w-full sm:w-auto">
              Explore Properties
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="secondary" className="w-full sm:w-auto">
              Contact Valentin
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
