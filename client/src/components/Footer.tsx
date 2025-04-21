import { Link } from "wouter";
import logo from "../assets/logo.svg";

export default function Footer() {
  return (
    <footer className="bg-primary/90 text-primary-foreground pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 overflow-hidden rounded-md bg-white">
                <img src={logo} alt="Ohana Realty Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-serif text-2xl font-bold text-white">Ohana Realty</span>
            </div>
            <p className="mb-4">Your trusted partner for real estate services in Laredo, Texas. Specializing in residential and commercial properties.</p>
            <p className="text-sm">
              505 Shiloh Dr, Apt 201<br />
              Laredo, TX 78045
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-white transition">
                  Properties
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-white transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Property Types */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Property Types</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/properties" className="hover:text-white transition">
                  Residential Homes
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-white transition">
                  Commercial Properties
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-white transition">
                  Land/Development
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-white transition">
                  New Construction
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-white transition">
                  Featured Listings
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <i className='bx bx-phone mr-2'></i>
                <a href="tel:+19567123000" className="hover:text-white transition">956-712-3000</a>
              </li>
              <li className="flex items-center">
                <i className='bx bx-mobile mr-2'></i>
                <a href="tel:+19563246714" className="hover:text-white transition">956-324-6714</a>
              </li>
              <li className="flex items-start">
                <i className='bx bx-envelope mt-1 mr-2'></i>
                <a href="mailto:info@ohanarealty.com" className="hover:text-white transition">info@ohanarealty.com</a>
              </li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-secondary hover:text-white transition-colors">
                <i className='bx bxl-facebook text-xl'></i>
              </a>
              <a href="#" className="text-secondary hover:text-white transition-colors">
                <i className='bx bxl-instagram text-xl'></i>
              </a>
              <a href="#" className="text-secondary hover:text-white transition-colors">
                <i className='bx bxl-linkedin text-xl'></i>
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-white/20 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">&copy; {new Date().getFullYear()} Ohana Realty. All rights reserved.</p>
            <p className="text-sm mt-2 md:mt-0">Website designed and developed with <span className="text-secondary">❤️</span></p>
          </div>
        </div>
      </div>
    </footer>
  );
}
