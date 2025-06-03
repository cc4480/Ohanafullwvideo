
import React from "react";
import { motion } from "framer-motion";
import SafeHelmet from "@/components/SafeHelmet";
import ScrollToTop from "@/components/ScrollToTop";
import AirbnbHero from "@/components/airbnb/AirbnbHero";
import FeaturedAirbnbRentals from "@/components/airbnb/FeaturedAirbnbRentals";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ShieldCheckIcon, 
  WifiIcon, 
  CarIcon, 
  CoffeeIcon, 
  TvIcon, 
  AirVentIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  StarIcon,
  UsersIcon,
  ClockIcon,
  CameraIcon,
  KeyIcon,
  HeartIcon
} from "lucide-react";

export default function AirbnbRentals() {
  const amenities = [
    { icon: <WifiIcon className="h-6 w-6" />, name: "High-Speed WiFi", description: "Blazing fast internet perfect for work or streaming" },
    { icon: <CarIcon className="h-6 w-6" />, name: "Free Parking", description: "Dedicated parking spaces for all guests" },
    { icon: <TvIcon className="h-6 w-6" />, name: "Smart TV", description: "65\" 4K Smart TVs with streaming services" },
    { icon: <AirVentIcon className="h-6 w-6" />, name: "Climate Control", description: "Individual AC/heating units in every room" },
    { icon: <CoffeeIcon className="h-6 w-6" />, name: "Gourmet Kitchen", description: "Fully equipped with premium appliances" },
    { icon: <ShieldCheckIcon className="h-6 w-6" />, name: "24/7 Security", description: "Keyless entry and security monitoring" }
  ];

  const services = [
    { icon: <ClockIcon className="h-5 w-5" />, title: "24/7 Support", description: "Round-the-clock assistance for any needs" },
    { icon: <CameraIcon className="h-5 w-5" />, title: "Virtual Tours", description: "Explore properties before you book" },
    { icon: <KeyIcon className="h-5 w-5" />, title: "Keyless Entry", description: "Convenient self-check-in process" },
    { icon: <HeartIcon className="h-5 w-5" />, title: "Concierge Service", description: "Personalized recommendations and bookings" }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      
      <SafeHelmet
        title="Luxury Vacation Rentals | Ohana Realty Laredo"
        description="Experience unparalleled luxury in our premium vacation rentals in Laredo. Modern amenities, prime locations, and exceptional service."
        canonicalPath="/airbnb"
      />
      
      {/* Hero section */}
      <AirbnbHero />
      
      {/* Featured rentals section */}
      <FeaturedAirbnbRentals />
      
      {/* Amenities Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
              Premium Amenities
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Everything You Need & More
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our properties are equipped with luxury amenities and modern conveniences 
              to ensure your stay is comfortable, productive, and memorable.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {amenities.map((amenity, index) => (
              <motion.div
                key={index}
                className="group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg group-hover:shadow-green-500/10">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {amenity.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      {amenity.name}
                    </h3>
                    <p className="text-gray-600">
                      {amenity.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4 px-4 py-2 bg-white/20 text-white border-0 backdrop-blur-sm">
              The Ohana Difference
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Guests Choose Us
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Experience the perfect blend of luxury, convenience, and personal service 
              that makes Ohana Realty the premier choice for vacation rentals in Laredo.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl mb-4 group-hover:bg-white/30 transition-all duration-300">
                  {service.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {service.title}
                </h3>
                <p className="text-blue-200 text-sm">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {[
              { number: "500+", label: "Happy Guests", icon: <UsersIcon className="h-6 w-6" /> },
              { number: "4.9", label: "Average Rating", icon: <StarIcon className="h-6 w-6" /> },
              { number: "98%", label: "Return Rate", icon: <HeartIcon className="h-6 w-6" /> },
              { number: "24/7", label: "Support", icon: <ClockIcon className="h-6 w-6" /> }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-3 group-hover:bg-white/30 transition-all duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-1">
                  {stat.number}
                </div>
                <div className="text-blue-200 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Ready for Your Perfect Stay?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Book now or contact us for personalized recommendations and special requests.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button
                size="lg"
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Browse Available Dates
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
              >
                Contact Our Team
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-gray-600">
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-5 w-5" />
                <span>(956) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MailIcon className="h-5 w-5" />
                <span>rentals@ohanarealty.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5" />
                <span>Laredo, Texas</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
