import { Link } from "wouter";
import logo from "@assets/OIP.jfif";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#0A2342] to-[#061A34] text-primary-foreground pt-12 sm:pt-16 pb-8 relative">
      {/* Decorative elements */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-secondary/80 to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black/10 to-transparent"></div>
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none"></div>
      
      {/* Decorative shapes - adjusted for mobile */}
      <div className="absolute top-12 right-4 sm:right-12 w-32 sm:w-48 h-32 sm:h-48 rounded-full bg-secondary/5 blur-3xl"></div>
      <div className="absolute bottom-24 left-4 sm:left-12 w-40 sm:w-64 h-40 sm:h-64 rounded-full bg-accent/5 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Company Info */}
          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center mb-6">
              <div className="w-full sm:w-48 h-16 max-w-[200px] overflow-hidden bg-white rounded-md shadow-2xl border border-white/20 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all duration-500 transform hover:scale-105">
                <img 
                  src={logo} 
                  alt="Ohana Realty Logo" 
                  className="w-full h-full object-contain p-1" 
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                />
              </div>
            </div>
            <p className="mb-4 leading-relaxed opacity-90 text-white">Your trusted partner for real estate services in Laredo, Texas. Specializing in residential and commercial properties.</p>
            <div className="text-sm p-3 rounded-lg bg-primary-foreground/10 backdrop-blur-sm inline-block">
              <p className="flex items-center">
                <i className='bx bx-map text-secondary text-lg mr-2'></i>
                505 Shiloh Dr, Apt 201<br />
                <span className="ml-6">Laredo, TX 78045</span>
              </p>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { path: '/', label: 'Home', icon: 'bx-home' },
                { path: '/properties', label: 'Properties', icon: 'bx-building-house' },
                { path: '/#about', label: 'About', icon: 'bx-user' },
                { path: '/#contact', label: 'Contact', icon: 'bx-envelope' },
                { path: '#', label: 'Privacy Policy', icon: 'bx-shield' }
              ].map((item, index) => (
                <li key={item.path} className="group">
                  <Link href={item.path} className="flex items-center hover:text-white text-white/80 transition-all duration-300">
                    <i className={`bx ${item.icon} mr-2 text-secondary`}></i>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Property Types */}
          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Property Types</h3>
            <ul className="space-y-3">
              {[
                { label: 'Residential Homes', icon: 'bx-home-heart' },
                { label: 'Commercial Properties', icon: 'bx-store' },
                { label: 'Land/Development', icon: 'bx-landscape' },
                { label: 'New Construction', icon: 'bx-building' },
                { label: 'Featured Listings', icon: 'bx-star' }
              ].map((item, index) => (
                <li key={item.label} className="group">
                  <Link href="/properties" className="flex items-center hover:text-white text-white/80 transition-all duration-300">
                    <i className={`bx ${item.icon} mr-2 text-secondary`}></i>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Contact</h3>
            <ul className="space-y-4 mb-6">
              <li className="flex items-center group">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3 group-hover:bg-secondary/20 transition-colors duration-300">
                  <i className='bx bx-phone text-secondary'></i>
                </div>
                <a href="tel:+19567123000" className="hover:text-white text-white/90 transition-colors duration-300">956-712-3000</a>
              </li>
              <li className="flex items-center group">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3 group-hover:bg-secondary/20 transition-colors duration-300">
                  <i className='bx bx-mobile text-secondary'></i>
                </div>
                <a href="tel:+19563246714" className="hover:text-white text-white/90 transition-colors duration-300">956-324-6714</a>
              </li>
              <li className="flex items-start group">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3 mt-0.5 group-hover:bg-secondary/20 transition-colors duration-300">
                  <i className='bx bx-envelope text-secondary'></i>
                </div>
                <a href="mailto:valentin_cuellar@hotmail.com" className="hover:text-white text-white/90 transition-colors duration-300">valentin_cuellar@hotmail.com</a>
              </li>
            </ul>
            <div className="flex space-x-4 mt-4">
              {[
                { icon: 'bxl-facebook', url: 'https://www.facebook.com/valentincrealtor', label: 'Facebook' },
                { icon: 'bxl-instagram', url: 'https://www.instagram.com/valentincrealtor', label: 'Instagram' },
                { icon: 'bxl-linkedin', url: 'https://www.linkedin.com/in/valentin-cuellar-5827b4123', label: 'LinkedIn' },
                { icon: 'bxl-twitter', url: 'https://twitter.com/valentinrealtor', label: 'Twitter' }
              ].map((item, index) => (
                <a 
                  key={item.icon}
                  href={item.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${item.label} page`}
                  className="w-12 h-12 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center text-secondary hover:bg-secondary hover:text-white transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                  style={{ 
                    WebkitTapHighlightColor: 'transparent', 
                    touchAction: 'manipulation'
                  }}
                >
                  <i className={`bx ${item.icon} text-2xl sm:text-xl`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Enhanced Copyright with better mobile spacing */}
        <div className="border-t border-white/10 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-white/70 space-y-3 md:space-y-0">
            <p className="text-sm text-center md:text-left">&copy; {new Date().getFullYear()} Ohana Realty. All rights reserved.</p>
            <p className="text-sm flex items-center justify-center md:justify-start flex-wrap">
              <span className="flex items-center">
                Website designed and developed with 
                <span className="text-secondary mx-1 animate-pulse">❤️</span>
              </span>
              <span className="ml-0 md:ml-1">for Valentin Cuellar</span>
            </p>
          </div>
          <div className="text-center text-white/40 text-xs mt-4 pt-2 pb-safe">
            <p>Safe Harbor Statement: All information deemed reliable but not guaranteed.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
