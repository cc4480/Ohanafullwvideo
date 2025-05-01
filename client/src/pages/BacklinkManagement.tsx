import React from 'react';
import { Helmet } from 'react-helmet';
import BacklinkStrategy from '@/components/BacklinkStrategy';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

/**
 * Backlink Management Page
 * This page helps track and manage backlinks from local Laredo businesses
 * and organizations to improve SEO performance against competitors
 */
export default function BacklinkManagement() {
  const [_, navigate] = useLocation();
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Local Backlink Strategy | Ohana Realty Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 mb-4" 
          onClick={() => navigate('/admin/seo')}
        >
          <ArrowLeft className="h-4 w-4" /> Back to SEO Dashboard
        </Button>
        
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-2">Laredo Backlink Strategy</h2>
          <p className="text-muted-foreground">
            This tool helps you implement a comprehensive backlink strategy to acquire high-quality
            local backlinks from Laredo businesses and organizations.
          </p>
          <div className="mt-2 flex gap-2">
            <Button 
              size="sm"
              variant="default"
              onClick={() => {
                // This would open a modal or form to add new backlink targets
                alert('This would open a form to add new backlink targets');
              }}
            >
              Add Target Organization
            </Button>
            <Button 
              size="sm"
              variant="outline"
              onClick={() => {
                // This would generate an outreach email template
                alert('This would generate customized outreach templates');
              }}
            >
              Generate Outreach Templates
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main backlink strategy component */}
      <BacklinkStrategy />
    </div>
  );
}
