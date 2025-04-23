import { Link } from "wouter";
import logo from "@assets/logo.png";

export default function Footer() {
  // Function to scroll to top with smooth animation
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-gradient-to-b from-[#0A2342] to-[#061A34] text-primary-foreground pt-12 sm:pt-16 pb-8 relative">
      {/* Decorative elements - enhanced for mobile */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-secondary/80 to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black/10 to-transparent"></div>
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none"></div>
      
      {/* Decorative shapes - responsive for all screens */}
      <div className="absolute top-12 right-6 sm:right-12 w-36 sm:w-48 h-36 sm:h-48 rounded-full bg-secondary/5 blur-3xl"></div>
      <div className="absolute bottom-24 left-6 sm:left-12 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-accent/5 blur-3xl"></div>
      
      {/* Scroll to top button - visible on mobile */}
      <button 
        onClick={scrollToTop}
        className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-secondary to-secondary/80 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-20"
        aria-label="Scroll to top"
      >
        <i className='bx bx-chevron-up text-xl'></i>
      </button>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Mobile-optimized grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info - Enhanced for mobile */}
          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-32 h-12 overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <img src={logo} alt="Ohana Realty Logo" className="w-full h-full object-contain" />
              </div>
            </div>
            <p className="mb-4 leading-relaxed opacity-90 text-white text-sm sm:text-base">Your trusted partner for real estate services in Laredo, Texas. Specializing in residential and commercial properties.</p>
            <div className="text-xs sm:text-sm p-3 rounded-lg bg-primary-foreground/10 backdrop-blur-sm inline-block hover:bg-primary-foreground/15 transition-colors duration-300">
              <p className="flex items-start">
                <i className='bx bx-map text-secondary text-lg mr-2 mt-0.5'></i>
                <span>
                  505 Shiloh Dr, Apt 201<br />
                  Laredo, TX 78045
                </span>
              </p>
            </div>
          </div>
          
          {/* Quick Links - Better mobile touch targets */}
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { path: '/', label: 'Home', icon: 'bx-home' },
                { path: '/properties', label: 'Properties', icon: 'bx-building-house' },
                { path: '/neighborhoods', label: 'Neighborhoods', icon: 'bx-map-alt' },
                { path: '/about', label: 'About', icon: 'bx-user' },
                { path: '/contact', label: 'Contact', icon: 'bx-envelope' }
              ].map((item, index) => (
                <li key={item.path} className="group">
                  <Link 
                    href={item.path}
                    className="flex items-center hover:text-white text-white/80 transition-all duration-300 py-1 sm:py-0.5"
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-3 group-hover:bg-secondary/20 transition-colors duration-300">
                      <i className={`bx ${item.icon} text-secondary`}></i>
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Property Types - Better mobile touch targets */}
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
                  <Link 
                    href="/properties" 
                    className="flex items-center hover:text-white text-white/80 transition-all duration-300 py-1 sm:py-0.5"
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-3 group-hover:bg-secondary/20 transition-colors duration-300">
                      <i className={`bx ${item.icon} text-secondary`}></i>
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info - Enhanced for mobile tapping */}
          <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Contact</h3>
            <ul className="space-y-4 mb-6">
              <li className="group">
                <a href="tel:+19567123000" className="flex items-center hover:text-white text-white/90 transition-colors duration-300 py-1 sm:py-0.5">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3 group-hover:bg-secondary/20 transition-colors duration-300">
                    <i className='bx bx-phone text-secondary text-xl'></i>
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">956-712-3000</span>
                </a>
              </li>
              <li className="group">
                <a href="tel:+19563246714" className="flex items-center hover:text-white text-white/90 transition-colors duration-300 py-1 sm:py-0.5">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3 group-hover:bg-secondary/20 transition-colors duration-300">
                    <i className='bx bx-mobile text-secondary text-xl'></i>
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">956-324-6714</span>
                </a>
              </li>
              <li className="group">
                <a href="mailto:valentin_cuellar@hotmail.com" className="flex items-start hover:text-white text-white/90 transition-colors duration-300 py-1 sm:py-0.5">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3 mt-0.5 group-hover:bg-secondary/20 transition-colors duration-300">
                    <i className='bx bx-envelope text-secondary text-xl'></i>
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">valentin_cuellar@hotmail.com</span>
                </a>
              </li>
            </ul>
            {/* Larger social icons for mobile - Updated with proper external links */}
            <div className="flex space-x-4 mt-6">
              {[
                { icon: 'bxl-facebook', url: 'https://www.facebook.com/ohanarealty', label: 'Facebook' },
                { icon: 'bxl-instagram', url: 'https://www.instagram.com/ohanarealty', label: 'Instagram' },
                { icon: 'bxl-linkedin', url: 'https://www.linkedin.com/company/ohana-realty', label: 'LinkedIn' },
                { icon: 'bxl-twitter', url: 'https://twitter.com/ohanarealty', label: 'Twitter' }
              ].map((item, index) => (
                <a
                  key={item.icon}
                  href={item.url}
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${item.label} page`}
                  className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-secondary hover:bg-secondary hover:text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                >
                  <i className={`bx ${item.icon} text-2xl`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Copyright - Enhanced for all screens */}
        <div className="border-t border-white/10 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-white/70">
            <p className="text-xs sm:text-sm">&copy; {new Date().getFullYear()} Ohana Realty. All rights reserved.</p>
            <p className="text-xs sm:text-sm mt-2 md:mt-0 flex items-center justify-center">
              <span className="hidden sm:inline">Laredo's Premier Real Estate Agency</span>
              <span className="sm:hidden">Premier Laredo Realty</span>
              <i className='bx bxs-star text-secondary ml-2'></i>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
