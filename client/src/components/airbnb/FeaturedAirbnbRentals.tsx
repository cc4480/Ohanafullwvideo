
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarIcon, ArrowRightIcon, HomeIcon, MapPinIcon, SparklesIcon } from "lucide-react";
import { Link } from "wouter";
import AirbnbRentalCard from "./AirbnbRentalCard";
import APIFallback from "@/components/APIFallback";
import type { AirbnbRental } from "@shared/schema";

interface FeaturedAirbnbRentalsProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  showViewAllButton?: boolean;
}

export default function FeaturedAirbnbRentals({
  title = "Featured Luxury Rentals",
  subtitle = "Handpicked premium accommodations for your perfect stay",
  limit = 4,
  showViewAllButton = true,
}: FeaturedAirbnbRentalsProps) {
  const {
    data: rentals,
    isLoading,
    isError,
    error,
  } = useQuery<AirbnbRental[]>({
    queryKey: [`/api/airbnb/featured?limit=${limit}`],
    queryFn: async ({ queryKey }) => {
      const path = queryKey[0];
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error("Failed to fetch featured rentals");
      }
      return response.json();
    },
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-100/50 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-100/50 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-50/30 to-purple-50/30 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <SparklesIcon className="w-4 h-4 mr-2" />
            Premium Collection
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
            {title}
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>

          {/* Decorative elements */}
          <div className="flex justify-center items-center mt-6 gap-2">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-blue-500"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="w-8 h-0.5 bg-blue-500"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-purple-500"></div>
          </div>
        </motion.div>

        {/* Content */}
        <APIFallback
          isLoading={isLoading}
          isError={isError}
          error={error as Error}
          queryKey={`/api/airbnb/featured?limit=${limit}`}
        >
          {rentals && rentals.length > 0 ? (
            <>
              {/* Rentals Grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-12"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {rentals.map((rental) => (
                  <motion.div
                    key={rental.id}
                    variants={itemVariants}
                    className="group"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="h-full transform transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/10">
                      <AirbnbRentalCard rental={rental} featured />
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Features Section */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {[
                  {
                    icon: <HomeIcon className="h-8 w-8" />,
                    title: "Luxury Amenities",
                    description: "Premium furnishings, high-end appliances, and thoughtful touches throughout."
                  },
                  {
                    icon: <MapPinIcon className="h-8 w-8" />,
                    title: "Prime Locations",
                    description: "Strategically located near Laredo's best attractions and business districts."
                  },
                  {
                    icon: <StarIcon className="h-8 w-8" />,
                    title: "5-Star Service",
                    description: "24/7 support and concierge services to ensure your perfect stay."
                  }
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="text-center p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 group hover:bg-white"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </motion.div>

              {/* CTA Section */}
              {showViewAllButton && (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <Link href="/airbnb">
                    <Button
                      size="lg"
                      className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 group"
                    >
                      View All Rentals
                      <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <HomeIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">
                No Featured Rentals Available
              </h3>
              <p className="text-gray-500">
                Check back soon for our latest luxury accommodations.
              </p>
            </motion.div>
          )}
        </APIFallback>
      </div>
    </section>
  );
}
