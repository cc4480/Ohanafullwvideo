import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import valentinCuellarImg from "../assets/valentin-cuellar.png";
import { Phone, Mail, Award, Star, MapPin, Clock } from "lucide-react";

export default function AboutRealtor() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Detect dark mode from document class
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    // Check immediately
    checkDarkMode();
    
    // Set up observer to monitor class changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === 'class' &&
          mutation.target === document.documentElement
        ) {
          checkDarkMode();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className={`py-16 ${isDarkMode ? 'bg-background text-foreground' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={`font-serif text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-neutral-800'} mb-4`}>
            About Ohana Realty
          </h2>
          <p className={`${isDarkMode ? 'text-slate-300' : 'text-neutral-600'} max-w-3xl mx-auto`}>
            Ohana Realty is committed to providing exceptional real estate services to the Laredo community. 
            Our team of experienced professionals is dedicated to making your real estate experience seamless and successful.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Meet Your Realtor</span>
            <h2 className={`font-serif text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-neutral-800'} mt-2 mb-6`}>
              Valentin Cuellar
            </h2>
            <p className={`${isDarkMode ? 'text-slate-300' : 'text-neutral-600'} mb-6`}>
              With over 20 years of experience in the Laredo real estate market, Valentin Cuellar delivers exceptional service
              to clients looking to buy, sell, or invest in properties. His in-depth knowledge of local neighborhoods and market trends
              allows him to provide valuable insights and guidance throughout every transaction.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <div className={`${isDarkMode ? 'bg-primary/20' : 'bg-primary/10'} p-2 rounded-full mr-4`}>
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <p className={isDarkMode ? 'text-slate-200' : 'text-neutral-700'}>Licensed Texas Real Estate Broker</p>
              </div>
              <div className="flex items-center">
                <div className={`${isDarkMode ? 'bg-primary/20' : 'bg-primary/10'} p-2 rounded-full mr-4`}>
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <p className={isDarkMode ? 'text-slate-200' : 'text-neutral-700'}>Specializing in Laredo residential and commercial properties</p>
              </div>
              <div className="flex items-center">
                <div className={`${isDarkMode ? 'bg-primary/20' : 'bg-primary/10'} p-2 rounded-full mr-4`}>
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <p className={isDarkMode ? 'text-slate-200' : 'text-neutral-700'}>Over 20 years of real estate experience</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/#contact">
                <Button className="w-full sm:w-auto">
                  Contact Valentin
                </Button>
              </Link>
              <a href="tel:+19567123000">
                <Button variant="outline" className="border-primary w-full sm:w-auto">
                  <Phone className="h-4 w-4 mr-2" />
                  Call: 956-712-3000
                </Button>
              </a>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                <div className="flex items-center mb-2">
                  <MapPin className="h-5 w-5 text-primary mr-2" />
                  <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-neutral-800'}`}>Office Location</h3>
                </div>
                <p className={isDarkMode ? 'text-slate-300' : 'text-neutral-600'}>
                  505 Shiloh Dr, Apt 201<br />
                  Laredo, TX 78045
                </p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                <div className="flex items-center mb-2">
                  <Phone className="h-5 w-5 text-primary mr-2" />
                  <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-neutral-800'}`}>Contact Info</h3>
                </div>
                <p className={isDarkMode ? 'text-slate-300' : 'text-neutral-600'}>
                  Office: 956-712-3000<br />
                  Mobile: 956-324-6714
                </p>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="relative">
              <img 
                src={valentinCuellarImg} 
                alt="Valentin Cuellar - Ohana Realty" 
                className="rounded-lg shadow-lg w-full object-cover h-auto"
              />
              <div className={`absolute -bottom-6 -right-6 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} p-4 rounded-lg shadow-md`}>
                <div className="flex items-center">
                  <div className="flex gap-1 text-secondary">
                    <Star className="h-4 w-4 fill-secondary text-secondary" />
                    <Star className="h-4 w-4 fill-secondary text-secondary" />
                    <Star className="h-4 w-4 fill-secondary text-secondary" />
                    <Star className="h-4 w-4 fill-secondary text-secondary" />
                    <Star className="h-4 w-4 fill-secondary text-secondary" strokeWidth={1} />
                  </div>
                  <p className={`ml-2 ${isDarkMode ? 'text-white' : 'text-neutral-800'} font-medium`}>4.9/5</p>
                </div>
                <p className={`${isDarkMode ? 'text-slate-300' : 'text-neutral-600'} text-sm`}>Top-rated Laredo Realtor</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
