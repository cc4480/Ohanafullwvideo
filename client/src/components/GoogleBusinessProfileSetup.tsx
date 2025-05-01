import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Check, Building2, MapPin, Phone, Mail, Clock, Image, Star, ShieldCheck } from "lucide-react";

const GoogleBusinessProfileSetup = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <ShieldCheck className="mr-2 h-6 w-6 text-blue-500" />
          Google Business Profile Setup
        </CardTitle>
        <CardDescription>
          Improve local search visibility with a properly configured Google Business Profile
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="overview" onValueChange={setActiveTab} value={activeTab}>
        <div className="px-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="setup">Setup Guide</TabsTrigger>
            <TabsTrigger value="tips">Optimization Tips</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="pt-6">
          <TabsContent value="overview" className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <AlertTitle className="text-blue-800">Why Google Business Profile matters for real estate</AlertTitle>
              <AlertDescription className="text-blue-700">
                For local real estate businesses, Google Business Profile (formerly Google My Business) is critical 
                for appearing in local search results, Google Maps, and gaining customer trust.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium flex items-center mb-3">
                  <MapPin className="mr-2 h-5 w-5 text-orange-500" />
                  Local Visibility Benefits
                </h3>
                <ul className="space-y-2">
                  {[
                    "Appears in Google Maps searches",
                    "Shows in local 3-pack results",
                    "Displays in nearby searches",
                    "Improves visibility for Laredo real estate queries",
                    "Helps outrank Coldwell Banker, RE/MAX locally"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium flex items-center mb-3">
                  <Star className="mr-2 h-5 w-5 text-yellow-500" />
                  Trust & Credibility Benefits
                </h3>
                <ul className="space-y-2">
                  {[
                    "Showcases customer reviews",
                    "Displays verified business status",
                    "Presents professional photos of properties",
                    "Shows business hours and contact methods",
                    "Builds client trust before they call"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mt-6">
              <h3 className="text-lg font-medium text-green-800 mb-2">Ready to dominate local Laredo real estate searches?</h3>
              <p className="text-green-700 mb-4">Setting up your Google Business Profile will significantly increase your visibility for local searches.</p>
              <Button onClick={() => setActiveTab('setup')} className="bg-green-600 hover:bg-green-700">
                Start Setup Process
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="setup" className="space-y-6">
            <Alert className="bg-amber-50 border-amber-200">
              <AlertTitle className="text-amber-800">Complete these steps in order</AlertTitle>
              <AlertDescription className="text-amber-700">
                Follow this checklist to properly set up your Google Business Profile for maximum local SEO benefit.
              </AlertDescription>
            </Alert>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="step1">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">1</div>
                    <span>Create your Google Business Profile</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-12">
                  <ol className="list-decimal space-y-3 pl-5">
                    <li>Go to <a href="https://business.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">business.google.com</a></li>
                    <li>Sign in with your Google account</li>
                    <li>Click "Add your business to Google"</li>
                    <li>Enter "Ohana Realty" as your business name</li>
                    <li>Select "Real Estate Agency" as your business category</li>
                    <li>Add your physical office address in Laredo</li>
                    <li>Follow the prompts to complete initial setup</li>
                  </ol>
                  <div className="mt-3">
                    <Button variant="outline" className="text-blue-600" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      <a href="https://business.google.com" target="_blank" rel="noopener noreferrer">Go to Google Business</a>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="step2">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">2</div>
                    <span>Verify your business</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-12">
                  <p className="mb-3">Google requires verification to prove you own the business. You'll typically have these options:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Mail:</strong> Google sends a postcard with verification code (5-7 days)</li>
                    <li><strong>Phone:</strong> Receive verification code via call/text (instant)</li>
                    <li><strong>Email:</strong> Sometimes available for certain businesses (instant)</li>
                  </ul>
                  <p className="mt-3 text-amber-700">Important: Choose the verification method that works best for your situation, but postcard verification is most commonly offered for new real estate businesses.</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="step3">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">3</div>
                    <span>Complete your business profile</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-12">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium flex items-center">
                        <Building2 className="h-4 w-4 mr-2 text-gray-600" />
                        Basic Information
                      </h4>
                      <ul className="ml-6 mt-1 list-disc text-gray-700 space-y-1">
                        <li>Business category: "Real Estate Agency" (primary)</li>
                        <li>Additional categories: "Real Estate Consultant", "Property Management Company"</li>
                        <li>Opening date: When you established Ohana Realty</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-600" />
                        Contact Information
                      </h4>
                      <ul className="ml-6 mt-1 list-disc text-gray-700 space-y-1">
                        <li>Phone number: Your business phone</li>
                        <li>Website URL: https://ohanarealty.com</li>
                        <li>Appointment URL: Link to your contact/booking page</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-600" />
                        Business Hours
                      </h4>
                      <ul className="ml-6 mt-1 list-disc text-gray-700 space-y-1">
                        <li>Set your regular hours of operation</li>
                        <li>Add special hours for holidays</li>
                        <li>Include "By appointment" options if applicable</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium flex items-center">
                        <Image className="h-4 w-4 mr-2 text-gray-600" />
                        Photos & Media
                      </h4>
                      <ul className="ml-6 mt-1 list-disc text-gray-700 space-y-1">
                        <li>Logo: Upload Ohana Realty logo</li>
                        <li>Cover photo: High-quality image of your best property</li>
                        <li>Additional photos: At least 10 photos of properties, team, office</li>
                        <li>Virtual tour: Add if available</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="step4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">4</div>
                    <span>Add services and areas served</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-12">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Services (Add these specific services)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        {[
                          "Home buying assistance",
                          "Home selling services",
                          "Property management",
                          "Investment property consultation",
                          "Rental property management",
                          "First-time homebuyer assistance",
                          "Luxury property sales",
                          "Commercial real estate services",
                          "New construction sales"
                        ].map((service, i) => (
                          <div key={i} className="flex items-center">
                            <Check className="h-4 w-4 mr-2 text-green-500" />
                            <span className="text-sm">{service}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium">Areas Served (Add these specific locations)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        {[
                          "Laredo, TX",
                          "North Laredo",
                          "South Laredo",
                          "Central Laredo",
                          "Del Mar Hills",
                          "Alexander Estates",
                          "La Bota Ranch",
                          "Lakeside",
                          "Casa Bella",
                          "San Isidro",
                          "Cielito Lindo",
                          "United Heights",
                          "Webb County"
                        ].map((area, i) => (
                          <div key={i} className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-red-500" />
                            <span className="text-sm">{area}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="step5">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">5</div>
                    <span>Create your first post and respond to reviews</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-12">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">First Post Ideas</h4>
                      <ul className="ml-6 mt-1 list-disc text-gray-700 space-y-1">
                        <li>Welcome announcement introducing Ohana Realty</li>
                        <li>Featured property with high-quality photos</li>
                        <li>Special offer for new clients</li>
                        <li>Local Laredo market update with statistics</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Review Management</h4>
                      <ul className="ml-6 mt-1 list-disc text-gray-700 space-y-1">
                        <li>Ask satisfied clients to leave reviews</li>
                        <li>Respond to all reviews within 24 hours</li>
                        <li>For positive reviews: Thank the reviewer and reinforce positives</li>
                        <li>For negative reviews: Apologize, offer to resolve offline, provide contact method</li>
                      </ul>
                    </div>
                    
                    <Alert>
                      <AlertTitle>Pro Tip</AlertTitle>
                      <AlertDescription>
                        Post consistently (at least weekly) to keep your profile active and improve local visibility.
                      </AlertDescription>
                    </Alert>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setActiveTab('overview')}>Back to Overview</Button>
              <Button onClick={() => setActiveTab('tips')}>See Optimization Tips</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="tips" className="space-y-6">
            <Alert className="bg-purple-50 border-purple-200">
              <AlertTitle className="text-purple-800">Advanced Optimization Tips</AlertTitle>
              <AlertDescription className="text-purple-700">
                Use these strategies to maximize your Google Business Profile's impact and outrank competitors.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Image className="h-5 w-5 mr-2 text-blue-500" />
                    Photo Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {[
                      "Add at least 25 high-quality photos",
                      "Include your logo as the profile image",
                      "Use a stunning property as your cover photo",
                      "Add interior and exterior shots of your office",
                      "Include team photos with professional attire",
                      "Update photos monthly with new listings"
                    ].map((tip, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-1" />
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-green-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-500" />
                    Review Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {[
                      "Aim for at least 10 reviews within first month",
                      "Email past clients with direct review link",
                      "Respond to every review within 24 hours",
                      "Include keywords in your review responses",
                      "Create a text shortcut for easy review requests",
                      "Add review link to email signatures"
                    ].map((tip, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-1" />
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-amber-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-amber-500" />
                    Posting Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {[
                      "Post 2-3 times per week consistently",
                      "Use the 'What's New' post option for listings",
                      "Create 'Event' posts for open houses",
                      "Share 'Offer' posts for new client incentives",
                      "Post local Laredo market updates monthly",
                      "Highlight neighborhood features regularly"
                    ].map((tip, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-1" />
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-red-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-red-500" />
                    Local SEO Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {[
                      "Use identical business info on website and GMB",
                      "Add Google Maps embed on your contact page",
                      "Create local content about Laredo neighborhoods",
                      "Add schema markup to your website",
                      "Link Google Business Profile in website footer",
                      "Create neighborhood guides with GMB links"
                    ].map((tip, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-1" />
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setActiveTab('setup')}>Back to Setup Guide</Button>
              <Button variant="default">
                <ExternalLink className="h-4 w-4 mr-2" />
                <a href="https://business.google.com" target="_blank" rel="noopener noreferrer" className="text-white">Go to Google Business</a>
              </Button>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardFooter className="flex justify-between border-t pt-6">
        <div className="text-sm text-gray-500">
          <p>Last updated: May 1, 2025</p>
        </div>
        <Button variant="outline">
          <ExternalLink className="h-4 w-4 mr-2" />
          <a href="https://support.google.com/business/" target="_blank" rel="noopener noreferrer">Google Business Help</a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GoogleBusinessProfileSetup;
