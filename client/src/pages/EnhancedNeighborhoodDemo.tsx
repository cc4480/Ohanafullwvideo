import React from 'react';
import { Helmet } from 'react-helmet';
import LaredoNeighborhoodGuide from '@/components/LaredoNeighborhoodGuide';
import { northLaredoData } from '@/data/sample-neighborhood-data';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

/**
 * Enhanced Neighborhood Page Demo with advanced SEO implementation
 * This demonstrates the comprehensive neighborhood guide with detailed local data
 * and specialized Schema.org markup for Laredo properties
 */
export default function EnhancedNeighborhoodDemo() {
  const [_, navigate] = useLocation();
  
  console.log('EnhancedNeighborhoodDemo rendering');
  console.log('North Laredo data:', northLaredoData);
  
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Enhanced SEO metadata */}
      <Helmet>
        <title>{northLaredoData.name} - Laredo's Premier Residential Area | Ohana Realty</title>
        <meta
          name="description"
          content={`Explore ${northLaredoData.name}, Laredo's most desirable neighborhood featuring luxury homes, top schools, and premium amenities. Find your dream home in this exclusive area.`}
        />
        <meta
          name="keywords"
          content={`North Laredo homes, ${northLaredoData.name} real estate, Laredo luxury homes, best neighborhoods in Laredo, ${northLaredoData.name} houses for sale, Laredo property, ${northLaredoData.zipCode} properties`}
        />
        
        {/* Open Graph tags for social sharing */}
        <meta property="og:title" content={`${northLaredoData.name} - Laredo's Premier Residential Area | Ohana Realty`} />
        <meta property="og:description" content={`Explore ${northLaredoData.name}, Laredo's most desirable neighborhood featuring luxury homes, top schools, and premium amenities. Find your dream home in this exclusive area.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://ohanarealty.com/neighborhoods/${northLaredoData.slug}`} />
        <meta property="og:image" content="https://ohanarealty.com/images/north-laredo-cover.jpg" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${northLaredoData.name} - Laredo's Premier Residential Area | Ohana Realty`} />
        <meta name="twitter:description" content={`Explore ${northLaredoData.name}, Laredo's most desirable neighborhood featuring luxury homes, top schools, and premium amenities. Find your dream home in this exclusive area.`} />
        <meta name="twitter:image" content="https://ohanarealty.com/images/north-laredo-cover.jpg" />
        
        {/* Canonical link to prevent duplicate content issues */}
        <link rel="canonical" href={`https://ohanarealty.com/neighborhoods/${northLaredoData.slug}`} />
        
        {/* Additional locale alternate links for international SEO */}
        <link rel="alternate" href={`https://ohanarealty.com/neighborhoods/${northLaredoData.slug}`} hrefLang="en-us" />
        <link rel="alternate" href={`https://ohanarealty.com/es/neighborhoods/${northLaredoData.slug}`} hrefLang="es-mx" />
      </Helmet>
      
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 mb-4" 
          onClick={() => navigate('/neighborhoods')}
        >
          <ArrowLeft className="h-4 w-4" /> Back to All Neighborhoods
        </Button>
        
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-2">Enhanced SEO Implementation Demo</h2>
          <p className="text-muted-foreground">
            This demo showcases our enterprise-grade SEO implementation with:
          </p>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1 mt-2">
            <li>Detailed neighborhood data with Laredo-specific information</li>
            <li>Enhanced Schema.org markup targeting local real estate keywords</li>
            <li>Comprehensive content organized for search engine visibility</li>
            <li>Competitor-beating semantic HTML structure</li>
            <li>Mobile-optimized layout with proper structured data</li>
          </ul>
        </div>
      </div>
      
      {/* Main neighborhood guide with enhanced schema */}
      <LaredoNeighborhoodGuide neighborhood={northLaredoData} />
      
      {/* Call-to-action section */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Find Your Dream Home in {northLaredoData.name}?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          Contact Ohana Realty today to schedule a personalized tour of available properties in this exclusive Laredo neighborhood.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" onClick={() => navigate('/contact')}>
            Contact Us
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/properties')}>
            Browse Properties
          </Button>
        </div>
      </div>
    </div>
  );
}
