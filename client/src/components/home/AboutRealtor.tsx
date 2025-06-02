import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import valentinCuellarImg from "../../assets/valentin-realtor.png";
import ohanLogo from "../../assets/logo.png";
import { Phone, Mail, Award, Star, MapPin, Clock } from "lucide-react";
import { useDarkMode } from "@/hooks/use-dark-mode";

export default function AboutRealtor() {
  const isDarkMode = useDarkMode();

  return (
    <section id="about" className={`py-20 ${isDarkMode ? 'bg-background text-foreground' : 'bg-slate-50/70'} relative overflow-hidden`}>
      {/* Decorative elements */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none"></div>
      
      {/* Decorative shapes */}
      <div className="absolute top-40 left-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-20 right-0 w-80 h-80 rounded-full bg-secondary/5 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm tracking-wide font-medium mb-4 animate-fade-in">OUR STORY</span>
          <div className="flex justify-center mb-6 animate-fade-in">
            <div className="w-52 h-28 p-2 hover:shadow-lg transition-all duration-300">
              <img 
                src={ohanLogo} 
                alt="Ohana Realty Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
          </div>
          <h2 className={`font-serif text-3xl md:text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-foreground'} mb-6 animate-slide-up`}>
            About <span className="text-primary">Ohana</span> Realty
          </h2>
          <p className={`${isDarkMode ? 'text-slate-300' : 'text-muted-foreground'} max-w-3xl mx-auto text-lg animate-fade-in`} style={{ animationDelay: "0.2s" }}>
            Ohana Realty is committed to providing exceptional real estate services to the Laredo community. 
            Our team of experienced professionals is dedicated to making your real estate experience seamless and successful.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <div className="order-2 lg:order-1 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="bg-gradient-to-r from-primary/20 to-transparent w-24 h-1 rounded-full mb-4"></div>
            <span className="text-sm font-medium text-secondary uppercase tracking-wider">Meet Your Realtor</span>
            <h2 className={`font-serif text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-foreground'} mt-2 mb-6`}>
              Valentin Cuellar
            </h2>
            <p className={`${isDarkMode ? 'text-slate-300' : 'text-muted-foreground'} mb-6 leading-relaxed`}>
              With 27+ years of experience in the Laredo real estate market, Valentin Cuellar delivers exceptional service
              to clients looking to buy, sell, or invest in properties. His in-depth knowledge of local neighborhoods and market trends
              allows him to provide valuable insights and guidance throughout every transaction.
            </p>
            
            {/* Feature list with enhanced styling */}
            <div className="space-y-5 mb-10">
              {[
                { icon: <Award className="h-5 w-5 text-secondary" />, text: "Licensed Texas Real Estate Broker" },
                { icon: <MapPin className="h-5 w-5 text-secondary" />, text: "Specializing in Laredo residential and commercial properties" },
                { icon: <Clock className="h-5 w-5 text-secondary" />, text: "27+ years of real estate experience" }
              ].map((feature, index) => (
                <div className="flex items-center group" key={index}>
                  <div className={`${isDarkMode ? 'bg-primary/20' : 'bg-white'} p-3 rounded-full mr-4 shadow-sm group-hover:shadow-md transition-all duration-300 border border-primary/10`}>
                    {feature.icon}
                  </div>
                  <p className={`${isDarkMode ? 'text-slate-200' : 'text-foreground'} group-hover:translate-x-1 transition-transform duration-300`}>{feature.text}</p>
                </div>
              ))}
            </div>
            
            {/* Call-to-action buttons with enhanced styling */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link href="/#contact">
                <Button className="w-full sm:w-auto shadow-lg hover:shadow-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-300 group">
                  <span>Contact Valentin</span>
                  <Mail className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <a href="tel:+19563246714">
                <Button variant="outline" className="border-primary w-full sm:w-auto hover:bg-primary/5 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <Phone className="h-4 w-4 mr-2 text-primary" />
                  <span>Call: 956-324-6714</span>
                </Button>
              </a>
            </div>

            {/* Info cards with enhanced styling */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: <MapPin className="h-5 w-5 text-secondary" />,
                  title: "Office Location",
                  content: "505 Shiloh Dr, Apt 201\nLaredo, TX 78045"
                },
                {
                  icon: <Phone className="h-5 w-5 text-secondary" />,
                  title: "Contact Info",
                  content: "Contact: 956-324-6714"
                }
              ].map((card, index) => (
                <div 
                  key={index}
                  className={`p-5 rounded-lg ${isDarkMode ? 'bg-slate-800/70' : 'bg-white'} shadow-lg border border-primary/10 hover:shadow-xl transition-all duration-300 card-hover-effect`}
                >
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-full bg-primary/10 mr-3">
                      {card.icon}
                    </div>
                    <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-foreground'}`}>{card.title}</h3>
                  </div>
                  <p className={`${isDarkMode ? 'text-slate-300' : 'text-muted-foreground'} whitespace-pre-line`}>
                    {card.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right column - Image */}
          <div className="order-1 lg:order-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="relative">
              {/* Background decorations */}
              <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full border-2 border-dashed border-primary/20 -z-10"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full border-2 border-dashed border-secondary/30 -z-10"></div>
              
              {/* Main image with clear styling - no blur effects */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-primary/10 group" style={{ minHeight: '100px', maxHeight: '150px', maxWidth: '200px' }}>
                <img 
                  src={valentinCuellarImg} 
                  alt="Valentin Cuellar - Ohana Realty" 
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  width={100}
                  height={125}
                  style={{ 
                    imageRendering: 'crisp-edges',
                    objectPosition: 'center top'
                  }}
                />
              </div>
              
              {/* Name tag below image */}
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-1 h-6 bg-secondary mr-2 rounded-full"></div>
                  <div>
                    <p className={`${isDarkMode ? 'text-slate-400' : 'text-muted-foreground'} text-xs`}>Your Trusted Realtor</p>
                    <h3 className={`${isDarkMode ? 'text-white' : 'text-foreground'} text-sm font-serif font-bold`}>Valentin Cuellar</h3>
                  </div>
                </div>
              </div>
              
              {/* Rating card with enhanced styling */}
              <div className={`absolute -bottom-8 -right-8 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} p-5 rounded-lg shadow-xl border border-primary/10 animate-fade-in`} style={{ animationDelay: "0.6s" }}>
                <div className="flex items-center mb-1">
                  <div className="flex gap-1 text-secondary">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < 4 ? 'fill-secondary' : ''} text-secondary`} strokeWidth={1} />
                    ))}
                  </div>
                  <p className={`ml-2 ${isDarkMode ? 'text-white' : 'text-foreground'} font-medium`}>4.9/5</p>
                </div>
                <p className={`${isDarkMode ? 'text-slate-300' : 'text-muted-foreground'} text-sm`}>
                  Top-rated Laredo Realtor
                </p>
                <div className="mt-2 pt-2 border-t border-primary/10">
                  <p className="text-xs text-secondary">Based on 150+ client reviews</p>
                </div>
              </div>
              
              {/* Experience badge */}
              <div className="absolute -top-5 -left-5 bg-secondary text-white p-3 rounded-full shadow-lg animate-float">
                <div className="text-center w-16 h-16 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold">27+</span>
                  <span className="text-xs">Years Exp.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
