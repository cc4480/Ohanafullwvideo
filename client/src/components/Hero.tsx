import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative bg-neutral-900 min-h-screen flex items-center mt-[-4rem]">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/30 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop" 
          alt="Luxury home exterior" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="container mx-auto px-4 relative z-20 pt-28 md:pt-32 pb-16">
        <div className="max-w-3xl mt-12">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Find Your Dream Property in Laredo with Ohana Realty
          </h1>
          <p className="text-white text-lg md:text-xl mb-8 max-w-2xl">
            Expert guidance from Valentin Cuellar to make your real estate journey seamless and successful.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/properties">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base font-medium">
                Explore Listings
              </Button>
            </Link>
            <Link href="/#contact">
              <Button size="lg" variant="outline" className="border-2 border-white bg-transparent hover:bg-white/10 text-white hover:text-white w-full sm:w-auto text-base font-medium">
                Contact Valentin Cuellar
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20 animate-bounce">
        <a href="#featured-properties" className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
