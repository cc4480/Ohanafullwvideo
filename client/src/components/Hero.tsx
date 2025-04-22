import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative bg-neutral-900 min-h-screen flex items-center mt-[-5rem]">
      {/* Background image and overlays */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Enhanced gradient overlay with multiple layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-black/40 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent z-10 mix-blend-overlay"></div>
        
        {/* Animated grain texture */}
        <div className="absolute inset-0 opacity-30 z-10 bg-noise"></div>
        
        {/* Heroic background image */}
        <img 
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop" 
          alt="Luxury home exterior" 
          className="w-full h-full object-cover scale-[1.02] animate-slow-zoom"
        />
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-32 right-16 w-32 h-32 rounded-full bg-secondary/10 blur-3xl animate-float"></div>
      <div className="absolute bottom-24 left-16 w-48 h-48 rounded-full bg-primary/10 blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 pt-32 md:pt-36 pb-16">
        <div className="max-w-3xl mt-12">
          <div className="mb-4 opacity-90">
            <span className="inline-block px-4 py-1 bg-secondary/90 text-white rounded-full text-sm tracking-wide font-semibold shadow-lg animate-slide-down backdrop-blur-sm">
              OHANA REALTY - ESTABLISHED IN LAREDO
            </span>
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-slide-up text-shadow">
            Find Your Dream Property in Laredo with <span className="text-secondary">Ohana Realty</span>
          </h1>
          
          <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Expert guidance from Valentin Cuellar to make your real estate journey seamless and successful.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <Link href="/properties">
              <Button size="lg" className="w-full sm:w-auto text-base font-medium bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/80 hover:to-secondary text-white shadow-lg hover:shadow-xl transition-all duration-300 group">
                <span>Explore Listings</span>
                <i className='bx bx-right-arrow-alt ml-2 transform transition-transform duration-300 group-hover:translate-x-1'></i>
              </Button>
            </Link>
            <Link href="/#contact">
              <Button size="lg" variant="outline" className="border-2 border-white bg-transparent hover:bg-white/10 text-white hover:text-white w-full sm:w-auto text-base font-medium backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                Contact Valentin Cuellar
              </Button>
            </Link>
          </div>
          
          {/* Stats or badges */}
          <div className="mt-10 flex gap-6 animate-slide-up" style={{ animationDelay: "0.6s" }}>
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
              <p className="text-secondary font-bold text-2xl">10+</p>
              <p className="text-white text-sm">Years Experience</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
              <p className="text-secondary font-bold text-2xl">150+</p>
              <p className="text-white text-sm">Properties Sold</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
              <p className="text-secondary font-bold text-2xl">100%</p>
              <p className="text-white text-sm">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20 animate-bounce">
        <a href="#featured-properties" className="text-white bg-white/10 backdrop-blur-sm p-2 rounded-full hover:bg-white/20 transition-all duration-300 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
