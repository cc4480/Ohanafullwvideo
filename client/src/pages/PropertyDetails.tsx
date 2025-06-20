import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Property } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import ContactSection from "@/components/features/ContactSection";
import { useEffect, useState } from "react";
import valentinCuellarImg from "../assets/valentin-realtor.png";
import { Calendar, MapPin, Phone, Mail, Check, Home, Building, Bath, Ruler, HelpCircle, Maximize2, Heart } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import FavoriteButton from "@/components/FavoriteButton";

// Import our enterprise-grade SEO components
import SafeHelmet from "../components/SafeHelmet";
import SimpleBreadcrumbs from "../components/SimpleBreadcrumbs";
import { generateStructuredData as generatePropertyStructuredData } from "../components/SimplePropertyStructuredData";
import SEOLocationMap from "@/components/SEOLocationMap";
import { getPropertyLatitude, getPropertyLongitude, getPropertyBedrooms, getPropertyBathrooms } from "@/types/property";
import ScheduleViewingModal from "@/components/properties/ScheduleViewingModal";
import PropertyInquiryModal from "@/components/properties/PropertyInquiryModal";
import FullScreenImageViewer from "@/components/properties/FullScreenImageViewer";
import StaticPropertyMap from "@/components/maps/StaticPropertyMap";

export default function PropertyDetails({ id }: { id: number }) {
  const [, navigate] = useLocation();
  const [activeImage, setActiveImage] = useState<string>("");
  const [isFullScreenViewerOpen, setIsFullScreenViewerOpen] = useState<boolean>(false);
  const [fullScreenImageIndex, setFullScreenImageIndex] = useState<number>(0);
  const { toggleFavorite, isFavorite } = useFavorites();
  
  // Enhanced scroll-to-top when the component mounts
  useEffect(() => {
    // Use multiple methods for maximum compatibility
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Use 'instant' instead of 'smooth' to prevent scroll animation
      });
    } else {
      // Fallback for browsers without scrollBehavior support
      window.scrollTo(0, 0);
    }
    
    // Ensure scrolling works on all browsers including Safari
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    // Force multiple scroll attempts for extra reliability
    const timers = [
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }, 0),
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }, 50),
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }, 100)
    ];
    
    return () => {
      timers.forEach(id => clearTimeout(id));
    };
  }, [id]); // Also run when the property id changes
  
  const { data: property, isLoading, error } = useQuery<Property>({
    queryKey: [`/api/properties/${id}`],
  });
  
  useEffect(() => {
    if (property && Array.isArray(property.images) && property.images.length > 0) {
      setActiveImage(property.images[0]);
    }
  }, [property]);
  
  // Open full screen image viewer
  const openFullScreenViewer = (imageIndex: number) => {
    setFullScreenImageIndex(imageIndex);
    setIsFullScreenViewerOpen(true);
    // Prevent scrolling on the body when viewer is open
    document.body.style.overflow = 'hidden';
  };
  
  // Close full screen image viewer
  const closeFullScreenViewer = () => {
    setIsFullScreenViewerOpen(false);
    // Restore scrolling
    document.body.style.overflow = '';
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
            </div>
            <div>
              <div className="h-40 bg-gray-200 rounded mb-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl text-red-500 font-bold mb-4">Error Loading Property</h2>
        <p className="mb-6">We couldn't find the property you're looking for.</p>
        <Link href="/properties">
          <Button>
            <i className="bx bx-arrow-back mr-2"></i>
            Return to Properties
          </Button>
        </Link>
      </div>
    );
  }
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  const propertyTypeName = property.type === "RESIDENTIAL" ? "Residential Home" : 
                           property.type === "COMMERCIAL" ? "Commercial Property" : 
                           "Land Property";
  
  const propertyDescription = `${property.bedrooms ? `${property.bedrooms} bedroom ` : ''}${property.type === "RESIDENTIAL" ? "home" : "property"} located at ${property.address}, ${property.city}, ${property.state}. ${property.description?.substring(0, 100)}...`;
  
  const websiteUrl = "https://ohanarealty.com";

  return (
    <>
      {/* Enhanced SEO metadata using SafeHelmet to avoid Symbol conversion errors */}
      <SafeHelmet
        title={`${property.bedrooms ? `${property.bedrooms} Bed, ` : ''}${property.bathrooms ? `${property.bathrooms} Bath ` : ''}${property.type} For Sale at ${property.address} | ${formatPrice(property.price)}`}
        meta={[
          // Basic Meta Tags
          { name: "description", content: propertyDescription },
          { name: "keywords", content: [
            `${property.type.toLowerCase()} for sale`,
            `${property.city} real estate`,
            `${property.bedrooms} bedroom house`,
            `${property.bathrooms} bathroom home`,
            `${property.address}`,
            `${property.zipCode} properties`,
            `${property.city} ${property.state} real estate`,
            `homes for sale in ${property.city}`,
            property.features && Array.isArray(property.features) ? property.features.join(', ') : ''
          ].join(', ') },
          
          // Open Graph / Facebook
          { property: "og:type", content: "product" },
          { property: "og:url", content: `${websiteUrl}/properties/${property.id}` },
          { property: "og:title", content: `${property.bedrooms ? `${property.bedrooms} Bed, ` : ''}${property.bathrooms ? `${property.bathrooms} Bath ` : ''}${property.type} For Sale at ${property.address}` },
          { property: "og:description", content: propertyDescription },
          { property: "og:site_name", content: "Ohana Realty" },
          { property: "og:locale", content: "en_US" },
          
          // Only add image if available
          ...(property.images && Array.isArray(property.images) && property.images.length > 0 ? [
            { property: "og:image", content: property.images[0] },
            { property: "og:image:alt", content: `Property at ${property.address}` },
            { name: "twitter:image", content: property.images[0] }
          ] : []),
          
          // Twitter
          { name: "twitter:card", content: "summary_large_image" },
          { name: "twitter:title", content: `${property.bedrooms ? `${property.bedrooms} Bed, ` : ''}${property.type} at ${property.address}` },
          { name: "twitter:description", content: propertyDescription },
          { name: "twitter:site", content: "@ohanarealty" },
          
          // Geographic Metadata
          ...(property.lat && property.lng ? [
            { name: "geo.position", content: `${property.lat};${property.lng}` },
            { name: "geo.placename", content: `${property.city}, ${property.state}` },
            { name: "geo.region", content: `US-${property.state}` }
          ] : []),
          
          // Author and dates
          { property: "article:author", content: "Valentin Cuellar" },
          { property: "article:published_time", content: new Date().toISOString() },
          { property: "article:modified_time", content: new Date().toISOString() }
        ]}
        link={[
          // Canonical URL
          { rel: "canonical", href: `${websiteUrl}/properties/${property.id}` }
        ]}
        script={[
          // Structured Data / JSON-LD
          {
            type: "application/ld+json",
            innerHTML: JSON.stringify(generatePropertyStructuredData({
              property,
              baseUrl: websiteUrl,
              agent: {
                name: "Valentin Cuellar",
                url: `${websiteUrl}/realtors/valentin-cuellar`,
                image: valentinCuellarImg,
                telephone: "+1-956-324-6714",
                email: "valentin_cuellar@hotmail.com"
              }
            }))
          }
        ]}
      />
      
      {/* Enhanced breadcrumbs with schema markup */}
      <div className="container mx-auto px-4">
        <SimpleBreadcrumbs
          items={[
            { label: "Properties", path: "/properties" },
            { label: property.address, path: `/properties/${property.id}` }
          ]}
          includeHome={true}
        />
      </div>
      <div className="min-h-screen">
        {/* Property Header */}
        <div className="bg-gradient-to-b from-[#0A2342] to-[#061A34] text-white py-8 sm:py-12 mobile-optimized relative">
          {/* Decorative elements */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-secondary/80 to-transparent"></div>
          <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 line-clamp-2">{property.address}</h1>
                  <p className="text-base sm:text-lg">{property.city}, {property.state} {property.zipCode}</p>
                </div>
                <div className="hidden sm:block">
                  <FavoriteButton
                    propertyId={property.id}
                    isFavorite={isFavorite(property.id)}
                    onToggle={toggleFavorite}
                    size="lg"
                    variant="outline"
                    showText={true}
                    className="bg-white/10 hover:bg-white/20 border-white/30"
                  />
                </div>
              </div>
              <div className="mt-3 md:mt-0 flex flex-row md:flex-col items-baseline md:items-end justify-between">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-secondary transform-gpu">
                  {formatPrice(property.price)}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs sm:text-sm text-neutral-200 md:text-right">
                    {property.type === "RESIDENTIAL" 
                      ? `${property.bedrooms} bed • ${property.bathrooms} bath • ${property.squareFeet} sq. ft.`
                      : `${property.squareFeet} sq. ft.`}
                  </p>
                  <div className="sm:hidden">
                    <FavoriteButton
                      propertyId={property.id}
                      isFavorite={isFavorite(property.id)}
                      onToggle={toggleFavorite}
                      size="sm"
                      variant="ghost"
                      showText={false}
                      className="bg-white/10 hover:bg-white/20"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Property Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {/* Photo Gallery */}
              <div 
                className="mb-6 sm:mb-8 mobile-optimized" 
                role="region" 
                aria-label="Property photo gallery"
              >
                <div className="rounded-lg overflow-hidden mb-3 sm:mb-4 shadow-md relative group">
                  {/* Enhanced SEO Image component with structured data */}
                  {/* SEOImage temporarily replaced with regular img to fix warnings */}
                  <img
                    src={activeImage}
                    alt={`Main image of property at ${property.address}`}
                    className="w-full h-[250px] sm:h-[350px] md:h-[400px] object-cover transform-gpu cursor-pointer"
                    width={800}
                    height={600}
                    onClick={() => Array.isArray(property.images) && openFullScreenViewer(property.images.indexOf(activeImage))}
                    style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
                    onError={(e) => {
                      // Fallback for failed images
                      console.error('Main image failed to load:', activeImage);
                      (e.target as HTMLImageElement).src = "https://placehold.co/800x600/slate/white?text=Image+Not+Available";
                      (e.target as HTMLImageElement).alt = "Image not available";
                      (e.target as HTMLImageElement).onerror = null; // Prevent infinite error loop
                    }}
                  />
                  
                  {/* Fullscreen button overlay - Fixed button appearance and text */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 cursor-pointer">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute top-3 right-3 rounded-full p-2 shadow-lg bg-white/90 hover:bg-white flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (Array.isArray(property.images)) {
                          openFullScreenViewer(property.images.indexOf(activeImage));
                        }
                      }}
                      aria-label="View image fullscreen"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <polyline points="9 21 3 21 3 15"></polyline>
                        <line x1="21" y1="3" x2="14" y2="10"></line>
                        <line x1="3" y1="21" x2="10" y2="14"></line>
                      </svg>
                    </Button>
                    
                    <div className="bg-black/60 text-white px-4 py-2 rounded-md text-sm font-medium">
                      Click to view fullscreen
                    </div>
                  </div>
                </div>
                
                {Array.isArray(property.images) && property.images.length > 1 && (
                  <div 
                    className="grid grid-cols-4 gap-1 sm:gap-2 transform-gpu"
                    role="group"
                    aria-label="Property thumbnail images"
                  >
                    {property.images.map((image, index) => (
                      <div 
                        key={index}
                        className={`cursor-pointer rounded-md overflow-hidden border-2 ${
                          activeImage === image ? 'border-primary' : 'border-transparent'
                        } active:scale-95 transition-transform transform-gpu focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 relative group`}
                        onClick={() => setActiveImage(image)}
                        style={{ touchAction: 'manipulation' }}
                        role="button"
                        tabIndex={0}
                        aria-label={`View photo ${index + 1} of ${property.images.length}`}
                        aria-pressed={activeImage === image}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setActiveImage(image);
                          }
                        }}
                      >
                        <img 
                          src={image} 
                          alt="" 
                          className="w-full h-14 sm:h-20 object-cover transform-gpu"
                          style={{ backfaceVisibility: 'hidden' }}
                          aria-hidden="true"
                          onError={(e) => {
                            // Fallback for failed thumbnail images
                            console.error('Thumbnail image failed to load:', image);
                            (e.target as HTMLImageElement).src = "https://placehold.co/400x300/slate/white?text=No+Image";
                            (e.target as HTMLImageElement).style.border = '1px solid #999';
                            (e.target as HTMLImageElement).onerror = null; // Prevent infinite error loop
                          }}
                        />
                        
                        {/* Thumbnail overlay with fullscreen option */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div 
                            className="h-6 w-6 bg-white/80 hover:bg-white text-slate-800 rounded-full flex items-center justify-center cursor-pointer shadow-md"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveImage(image);
                              openFullScreenViewer(index);
                            }}
                            role="button"
                            tabIndex={0}
                            aria-label={`View photo ${index + 1} fullscreen`}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setActiveImage(image);
                                openFullScreenViewer(index);
                              }
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="15 3 21 3 21 9"></polyline>
                              <polyline points="9 21 3 21 3 15"></polyline>
                              <line x1="21" y1="3" x2="14" y2="10"></line>
                              <line x1="3" y1="21" x2="10" y2="14"></line>
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Full screen image viewer */}
                {Array.isArray(property.images) && property.images.length > 0 && (
                  <FullScreenImageViewer
                    images={property.images}
                    initialImageIndex={fullScreenImageIndex}
                    isOpen={isFullScreenViewerOpen}
                    onClose={closeFullScreenViewer}
                    propertyAddress={property.address}
                  />
                )}
              </div>
              
              {/* Property Details Tabs */}
              <Tabs defaultValue="overview" className="mt-6 sm:mt-8 mobile-optimized" aria-label="Property information tabs">
                <TabsList className="w-full mb-3 sm:mb-4 h-10 sm:h-auto" aria-label="Property information sections">
                  <TabsTrigger value="overview" className="flex-1 text-xs sm:text-sm" aria-controls="overview-tab">Overview</TabsTrigger>
                  <TabsTrigger value="features" className="flex-1 text-xs sm:text-sm" aria-controls="features-tab">Features</TabsTrigger>
                  <TabsTrigger value="location" className="flex-1 text-xs sm:text-sm" aria-controls="location-tab">Location</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="pt-3 sm:pt-4" id="overview-tab">
                  <h2 id="overview-heading" className="font-serif text-xl sm:text-2xl font-bold text-neutral-800 dark:text-white mb-3 sm:mb-4">
                    Property Overview
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-5 sm:mb-6 text-sm sm:text-base" aria-labelledby="overview-heading">
                    {property.description}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-5 sm:mb-6 mobile-optimized">
                    {property.type === "RESIDENTIAL" && (
                      <>
                        <div className="bg-card dark:bg-slate-800 p-3 sm:p-4 rounded-md shadow-sm transform-gpu">
                          <div className="flex flex-col items-center text-center">
                            <div className="bg-primary/10 dark:bg-primary/20 p-2 sm:p-3 rounded-full mb-1.5 sm:mb-2">
                              <Home className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground">Bedrooms</p>
                            <p className="font-bold text-foreground dark:text-white text-lg sm:text-xl">{property.bedrooms}</p>
                          </div>
                        </div>
                        <div className="bg-card dark:bg-slate-800 p-3 sm:p-4 rounded-md shadow-sm transform-gpu">
                          <div className="flex flex-col items-center text-center">
                            <div className="bg-primary/10 dark:bg-primary/20 p-2 sm:p-3 rounded-full mb-1.5 sm:mb-2">
                              <Bath className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground">Bathrooms</p>
                            <p className="font-bold text-foreground dark:text-white text-lg sm:text-xl">{property.bathrooms}</p>
                          </div>
                        </div>
                      </>
                    )}
                    <div className="bg-card dark:bg-slate-800 p-3 sm:p-4 rounded-md shadow-sm transform-gpu">
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-primary/10 dark:bg-primary/20 p-2 sm:p-3 rounded-full mb-1.5 sm:mb-2">
                          <Ruler className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">Square Feet</p>
                        <p className="font-bold text-foreground dark:text-white text-lg sm:text-xl">{property.squareFeet?.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="bg-card dark:bg-slate-800 p-3 sm:p-4 rounded-md shadow-sm transform-gpu">
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-primary/10 dark:bg-primary/20 p-2 sm:p-3 rounded-full mb-1.5 sm:mb-2">
                          {property.type === "RESIDENTIAL" ? (
                            <Home className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          ) : property.type === "COMMERCIAL" ? (
                            <Building className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          ) : (
                            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">Property Type</p>
                        <p className="font-bold text-foreground dark:text-white text-lg sm:text-xl">
                          {property.type === "RESIDENTIAL" ? "Residential" : 
                           property.type === "COMMERCIAL" ? "Commercial" : "Land"}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="features" className="pt-3 sm:pt-4" id="features-tab">
                  <h2 id="features-heading" className="font-serif text-xl sm:text-2xl font-bold text-neutral-800 dark:text-white mb-3 sm:mb-4">
                    Property Features
                  </h2>
                  
                  {property.features && Array.isArray(property.features) && property.features.length > 0 ? (
                    <div 
                      className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-5 sm:mb-6 mobile-optimized"
                      role="list"
                      aria-labelledby="features-heading"
                    >
                      {property.features.map((feature, index) => (
                        <div 
                          key={index} 
                          className="flex items-center bg-card dark:bg-slate-800 p-2.5 sm:p-3 rounded-md shadow-sm transform-gpu"
                          role="listitem"
                        >
                          <div className="bg-primary/10 dark:bg-primary/20 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3">
                            <Check className="h-3 w-3 sm:h-4 sm:w-4 text-primary" aria-hidden="true" />
                          </div>
                          <span className="text-foreground dark:text-white text-sm sm:text-base">{feature}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p 
                      className="text-muted-foreground bg-card dark:bg-slate-800 p-3 sm:p-4 rounded-md shadow-sm text-sm sm:text-base"
                      aria-labelledby="features-heading"
                    >
                      No additional features listed for this property.
                    </p>
                  )}
                </TabsContent>
                
                <TabsContent value="location" className="pt-3 sm:pt-4" id="location-tab">
                  <h2 id="location-heading" className="font-serif text-xl sm:text-2xl font-bold text-neutral-800 dark:text-white mb-3 sm:mb-4">
                    Location
                  </h2>
                  <p 
                    className="text-neutral-600 dark:text-neutral-300 mb-3 sm:mb-4 text-sm sm:text-base"
                    aria-labelledby="location-heading"
                  >
                    {property.address}, {property.city}, {property.state} {property.zipCode}
                  </p>
                  
                  {/* Enhanced SEO Location Map with structured data */}
                  <SEOLocationMap
                    address={property.address}
                    city={property.city}
                    state={property.state}
                    zipCode={property.zipCode}
                    latitude={property.lat}
                    longitude={property.lng}
                    className="mb-4"
                    height="350px"
                  />
                  
                  {/* Static Property Map with Google Maps Integration */}
                  <StaticPropertyMap 
                    property={property}
                    height="350px"
                    className="mb-3 sm:mb-4 mobile-optimized"
                  />
                  
                  <div className="bg-card dark:bg-slate-800 p-3 sm:p-4 rounded-md shadow-sm transform-gpu">
                    <h3 className="text-sm sm:text-md font-medium mb-1.5 sm:mb-2 flex items-center text-foreground dark:text-white">
                      <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-primary" />
                      Neighborhood Information
                    </h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      This property is located in {property.city}, TX.
                      {property.type === "RESIDENTIAL" 
                        ? " Perfect for families and individuals looking for a comfortable living space in Laredo."
                        : property.type === "COMMERCIAL"
                        ? " Ideal for businesses looking for a prime commercial location in Laredo."
                        : " Great opportunity for development in Laredo."}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Sidebar */}
            <div>
              {/* Quick Property Location */}
              <div className="mb-5 sm:mb-6 mobile-optimized">
                <StaticPropertyMap 
                  property={property}
                  height="200px"
                  className="rounded-lg shadow-md"
                />
              </div>
              
              {/* Contact Information */}
              <div 
                className="bg-card dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-md mb-5 sm:mb-6 mobile-optimized"
                aria-labelledby="contact-heading"
              >
                <h3 
                  id="contact-heading" 
                  className="font-serif text-lg sm:text-xl font-bold text-foreground dark:text-white mb-3 sm:mb-4"
                >
                  Interested in this property?
                </h3>
                <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                  Contact Valentin Cuellar for more information or to schedule a viewing of this {property.type.toLowerCase()} property.
                </p>
                
                <div className="space-y-3 sm:space-y-4">
                  <a 
                    href="tel:+19563246714" 
                    aria-label="Call Ohana Realty at (956) 324-6714"
                  >
                    <Button 
                      className="w-full h-9 sm:h-10 transform-gpu active:scale-95 transition-transform" 
                      size="sm"
                    >
                      <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" aria-hidden="true" />
                      Call (956) 324-6714
                    </Button>
                  </a>
                  <a 
                    href="mailto:valentin_cuellar@hotmail.com" 
                    aria-label="Email Valentin Cuellar at valentin_cuellar@hotmail.com"
                  >
                    <Button 
                      className="w-full h-9 sm:h-10 transform-gpu active:scale-95 transition-transform" 
                      variant="outline" 
                      size="sm"
                    >
                      <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" aria-hidden="true" />
                      Email Agent
                    </Button>
                  </a>
                  {property && (
                    <ScheduleViewingModal 
                      property={property}
                      trigger={
                        <Button 
                          className="w-full h-9 sm:h-10 transform-gpu active:scale-95 transition-transform" 
                          variant="secondary"
                          size="sm"
                          aria-label={`Schedule a viewing for property at ${property.address}`}
                        >
                          <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" aria-hidden="true" />
                          Schedule a Viewing
                        </Button>
                      }
                    />
                  )}
                  {property && (
                    <PropertyInquiryModal
                      property={property}
                      trigger={
                        <Button 
                          className="w-full h-9 sm:h-10 transform-gpu active:scale-95 transition-transform" 
                          variant="outline"
                          size="sm"
                          aria-label={`Ask questions about property at ${property.address}`}
                        >
                          <HelpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" aria-hidden="true" />
                          Ask About This Property
                        </Button>
                      }
                    />
                  )}
                </div>
              </div>
              
              <div 
                className="bg-card dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-md mb-5 sm:mb-6 mobile-optimized"
                aria-labelledby="realtor-heading"
              >
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden mr-3 sm:mr-4 shrink-0">
                    <img 
                      src={valentinCuellarImg} 
                      alt="Valentin Cuellar - Lead Realtor" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 
                      id="realtor-heading" 
                      className="font-serif text-base sm:text-lg font-bold text-foreground dark:text-white"
                    >
                      Valentin Cuellar
                    </h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      <i className="bx bx-medal mr-1 text-primary" aria-hidden="true"></i> 
                      Lead Realtor
                    </p>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4">
                  Valentin is a top-rated realtor with over 27 years of experience in the Laredo real estate market.
                </p>
                
                <div className="flex space-x-2">
                  <Link href="/about">
                    <Button 
                      variant="outline" 
                      className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3" 
                      size="sm"
                      aria-label="View Valentin Cuellar's profile"
                    >
                      <i className="bx bx-user mr-1" aria-hidden="true"></i>
                      View Profile
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button 
                      variant="outline" 
                      className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3" 
                      size="sm"
                      aria-label="Contact Valentin Cuellar"
                    >
                      <i className="bx bx-envelope mr-1" aria-hidden="true"></i>
                      Contact
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div 
                className="bg-card dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-md mobile-optimized"
                aria-labelledby="similar-properties-heading"
              >
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <h3 
                    id="similar-properties-heading" 
                    className="font-serif text-base sm:text-lg font-bold text-foreground dark:text-white"
                  >
                    Similar Properties
                  </h3>
                  <Link href="/properties" aria-label="View all properties">
                    <span 
                      className="text-primary hover:underline text-xs sm:text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1"
                    >
                      View All
                    </span>
                  </Link>
                </div>
                
                <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4">
                  Check out more {propertyTypeName.toLowerCase()} options in Laredo
                </p>
                
                <Button
                  className="w-full h-9 sm:h-10 transform-gpu active:scale-95 transition-transform"
                  variant="outline"
                  onClick={() => navigate('/properties')}
                  aria-label={`Browse more ${propertyTypeName.toLowerCase()} properties in Laredo`}
                >
                  <i className="bx bx-search mr-1.5 sm:mr-2" aria-hidden="true"></i>
                  Browse More Properties
                </Button>
              </div>
            </div>
          </div>
          
          <Separator className="my-8 sm:my-12" />
          
          {/* Contact Section */}
          <section className="mt-6 sm:mt-8">
            <ContactSection hideTitle propertyInquiry={property.address} />
          </section>
        </div>
      </div>
    </>
  );
}