import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative bg-neutral-900 h-[80vh] flex items-center">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop" 
          alt="Luxury home exterior" 
          className="w-full h-full object-cover opacity-60"
        />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            Find Your Dream Property in Laredo with Ohana Realty!
          </h1>
          <p className="text-neutral-100 text-lg md:text-xl mb-8">
            Expert guidance from Valentin Cuellar to make your real estate journey seamless.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/properties">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Explore Listings
              </Button>
            </Link>
            <Link href="/#contact">
              <Button size="lg" variant="outline" className="bg-white hover:bg-neutral-100 text-primary w-full sm:w-auto">
                Contact Valentin Cuellar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
