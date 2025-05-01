import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Link, Copy, CheckCircle, Clock, Building, FileText, Share2, ArrowUpRight } from "lucide-react";

const LOCAL_BACKLINK_SOURCES = [
  {
    name: "Laredo Chamber of Commerce",
    website: "https://www.laredochamber.com",
    authority: "High",
    difficulty: "Medium",
    contactEmail: "info@laredochamber.com",
    contactPhone: "(956) 722-9895",
    notes: "Membership required. Contact for business directory listing."
  },
  {
    name: "City of Laredo Official Site",
    website: "https://www.cityoflaredo.com",
    authority: "Very High",
    difficulty: "Hard",
    contactEmail: "cityinfo@ci.laredo.tx.us",
    contactPhone: "(956) 791-7300",
    notes: "Contact economic development for local business listings."
  },
  {
    name: "Laredo Development Foundation",
    website: "https://www.laredoedf.org",
    authority: "High",
    difficulty: "Medium",
    contactEmail: "info@laredoedf.org",
    contactPhone: "(956) 722-0563",
    notes: "Focus on economic development partnerships."
  },
  {
    name: "Laredo Morning Times",
    website: "https://www.lmtonline.com",
    authority: "High",
    difficulty: "Medium",
    contactEmail: "newsroom@lmtonline.com",
    contactPhone: "(956) 728-2500",
    notes: "Submit real estate market analysis or local housing news."
  },
  {
    name: "Laredo College",
    website: "https://www.laredo.edu",
    authority: "High",
    difficulty: "Hard",
    contactEmail: "webmaster@laredo.edu",
    contactPhone: "(956) 721-5100",
    notes: "Partner for student housing resources or internships."
  },
  {
    name: "Texas A&M International University",
    website: "https://www.tamiu.edu",
    authority: "Very High",
    difficulty: "Hard",
    contactEmail: "webmaster@tamiu.edu",
    contactPhone: "(956) 326-2001",
    notes: "Contact student affairs for housing resources."
  },
  {
    name: "Laredo Association of REALTORS®",
    website: "https://www.laredorealtors.com",
    authority: "Very High",
    difficulty: "Easy",
    contactEmail: "info@laredorealtors.com",
    contactPhone: "(956) 724-8245",
    notes: "Membership required. High-value backlink source."
  },
  {
    name: "Laredo Builders Association",
    website: "https://www.laredobuilders.org",
    authority: "High",
    difficulty: "Medium",
    contactEmail: "info@laredobuilders.org",
    contactPhone: "(956) 724-0456",
    notes: "Partnership opportunities for new constructions."
  },
  {
    name: "Webb County",
    website: "https://www.webbcountytx.gov",
    authority: "High",
    difficulty: "Hard",
    contactEmail: "countyclerk@webbcountytx.gov",
    contactPhone: "(956) 523-4000",
    notes: "Contact for property tax and appraisal resources."
  },
  {
    name: "Laredo Economic Development Corporation",
    website: "https://www.laredoedc.org",
    authority: "High",
    difficulty: "Medium",
    contactEmail: "info@laredoedc.org",
    contactPhone: "(956) 722-0563",
    notes: "Business development and commercial real estate partnerships."
  },
  {
    name: "Laredo Convention & Visitors Bureau",
    website: "https://www.visitlaredo.com",
    authority: "Medium",
    difficulty: "Medium",
    contactEmail: "info@visitlaredo.com",
    contactPhone: "(956) 791-7330",
    notes: "List properties for visitors or relocation guides."
  },
  {
    name: "Laredo Nextdoor",
    website: "https://nextdoor.com/city/laredo--tx",
    authority: "Medium",
    difficulty: "Easy",
    contactEmail: "support@nextdoor.com",
    contactPhone: "N/A",
    notes: "Create business page and be active in local neighborhoods."
  }
];

const OUTREACH_TEMPLATES = [
  {
    name: "Chamber of Commerce Membership",
    subject: "Ohana Realty - New Chamber Member Introduction",
    body: `Dear [Contact Name],

I'm [Your Name] from Ohana Realty, a full-service real estate company in Laredo specializing in residential and commercial properties. We recently joined the Laredo Chamber of Commerce and would love to be included in your business directory.

As a local business committed to Laredo's growth, we offer:
• Comprehensive real estate services for buyers and sellers
• Property management solutions
• Investment property guidance
• Community involvement through [specific initiatives]

Is there an opportunity for us to be featured in an upcoming newsletter or member spotlight? We'd also be interested in participating in upcoming Chamber events.

Our website is https://ohanarealty.com, and I've attached our logo and a brief company bio for your directory.

Thank you for your consideration. I look forward to connecting.

Best regards,
[Your Name]
Ohana Realty
[Your Phone Number]
[Your Email]`
  },
  {
    name: "Local News Real Estate Commentary",
    subject: "Expert Commentary for Laredo Housing Market Article",
    body: `Dear [Editor Name],

I'm [Your Name], broker/owner at Ohana Realty, a real estate agency serving the Laredo community. I'm reaching out to offer expert commentary on the local housing market for any upcoming real estate features.

With [X years] of experience in Laredo real estate, I can provide insights on:
• Current market trends in Laredo neighborhoods
• Buyer and seller strategies in today's market
• Investment opportunities in Webb County
• Impact of recent developments on property values

I noticed your recent article on [mention recent relevant article], and believe your readers would benefit from additional local real estate expertise. I'm available for interviews or can provide written commentary for your pieces.

You can view our company profile at https://ohanarealty.com to learn more about our services and expertise.

Thank you for your consideration. I look forward to potentially collaborating.

Best regards,
[Your Name]
Ohana Realty
[Your Phone Number]
[Your Email]`
  },
  {
    name: "University Housing Resource",
    subject: "Partnership Opportunity: Housing Resources for TAMIU Students",
    body: `Dear [University Contact],

I'm [Your Name] from Ohana Realty, a local real estate company specializing in Laredo properties including student and faculty housing options.

I'm reaching out to explore a partnership opportunity to provide housing resources for your students and faculty. Many educational institutions list local real estate agencies as resources for incoming students and staff, and we would be honored to be included as a trusted housing resource.

Ohana Realty offers:
• Special services for student/faculty housing needs
• Rental property listings near campus
• Relocation guidance for new faculty
• First-time homebuyer assistance for graduating students

We would be happy to provide custom content for your website about local housing options, market conditions, or renting vs. buying in Laredo.

Our website (https://ohanarealty.com) contains comprehensive information about Laredo neighborhoods, and we're committed to helping your community find suitable housing.

Would you be open to including our agency in your housing resources section? I'm available to discuss this further at your convenience.

Thank you for your consideration.

Best regards,
[Your Name]
Ohana Realty
[Your Phone Number]
[Your Email]`
  },
  {
    name: "Local Business Directory Listing",
    subject: "Ohana Realty - Request for Business Directory Inclusion",
    body: `Hello [Contact Name],

I'm [Your Name], representing Ohana Realty, a full-service real estate company based in Laredo. I'm writing to request inclusion in your [Name of Directory] business directory.

Ohana Realty specializes in residential and commercial properties throughout Laredo and Webb County. We provide comprehensive real estate services including:
• Property buying and selling
• Investment property consultation
• Property management
• Relocation assistance

Our inclusion in your directory would help us connect with more Laredo residents while also providing your users with access to our local real estate expertise.

Here's our business information:
• Business Name: Ohana Realty
• Address: [Your Address]
• Phone: [Your Phone Number]
• Email: [Your Email]
• Website: https://ohanarealty.com
• Business Category: Real Estate Agency

Please let me know if you need any additional information to complete our listing. We would also be happy to provide our logo and images if needed.

Thank you for your consideration.

Best regards,
[Your Name]
Ohana Realty`
  },
  {
    name: "Community Sponsorship Announcement",
    subject: "Ohana Realty - [Event Name] Sponsorship and Partnership",
    body: `Dear [Organizer Name],

I'm [Your Name] from Ohana Realty, and I'm excited to express our interest in sponsoring the upcoming [Event Name] in Laredo.

As a locally-owned real estate company deeply committed to the Laredo community, we believe in supporting valuable local initiatives like yours. We're particularly interested in this event because it aligns with our company values of [mention relevant values - community building, education, family support, etc.]

We would like to discuss sponsorship opportunities that might include:
• Event sponsorship with logo placement
• Booth or representative presence
• Promotional materials distribution
• Digital recognition on your website and social media

In return for our sponsorship, we would appreciate a link to our website (https://ohanarealty.com) from your sponsors page, which would help potential clients discover our services while supporting your important work.

I would welcome the opportunity to discuss this potential partnership further. Please let me know when might be convenient for a brief call.

Thank you for your consideration.

Warm regards,
[Your Name]
Ohana Realty
[Your Phone Number]
[Your Email]`
  }
];

const BacklinkTracker = () => {
  const [backlinks, setBacklinks] = useState<Array<{
    source: string;
    url: string;
    status: 'pending' | 'contacted' | 'acquired' | 'rejected';
    dateAdded: string;
    notes: string;
  }>>([
    {
      source: "Laredo Chamber of Commerce",
      url: "https://www.laredochamber.com/members/ohana-realty",
      status: 'pending',
      dateAdded: "2025-04-28",
      notes: "Membership application submitted"
    },
    {
      source: "Laredo Morning Times",
      url: "https://www.lmtonline.com/realestate/experts",
      status: 'contacted',
      dateAdded: "2025-04-29",
      notes: "Emailed editor about expert commentary opportunity"
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newBacklink, setNewBacklink] = useState({
    source: "",
    url: "",
    status: "pending" as 'pending' | 'contacted' | 'acquired' | 'rejected',
    notes: ""
  });
  
  const handleAddBacklink = () => {
    if (newBacklink.source && newBacklink.url) {
      setBacklinks([...backlinks, {
        ...newBacklink,
        dateAdded: new Date().toISOString().split('T')[0]
      }]);
      setNewBacklink({
        source: "",
        url: "",
        status: "pending",
        notes: ""
      });
      setIsAddDialogOpen(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'contacted':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Contacted</Badge>;
      case 'acquired':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Acquired</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Backlink Progress</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Link className="h-4 w-4 mr-2" />
              Add Backlink
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Backlink</DialogTitle>
              <DialogDescription>
                Track a new backlink source for your SEO campaign.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="source" className="text-right">Source</Label>
                <Input 
                  id="source" 
                  value={newBacklink.source}
                  onChange={(e) => setNewBacklink({...newBacklink, source: e.target.value})}
                  className="col-span-3" 
                  placeholder="e.g., Laredo Chamber of Commerce"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">URL</Label>
                <Input 
                  id="url" 
                  value={newBacklink.url}
                  onChange={(e) => setNewBacklink({...newBacklink, url: e.target.value})}
                  className="col-span-3" 
                  placeholder="https://example.com/your-backlink"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <Select 
                  value={newBacklink.status}
                  onValueChange={(value) => setNewBacklink({...newBacklink, status: value as any})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="acquired">Acquired</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">Notes</Label>
                <Textarea 
                  id="notes" 
                  value={newBacklink.notes}
                  onChange={(e) => setNewBacklink({...newBacklink, notes: e.target.value})}
                  className="col-span-3" 
                  placeholder="Additional notes and contact details"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddBacklink}>Add Backlink</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {backlinks.length > 0 ? (
              backlinks.map((backlink, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="font-medium">{backlink.source}</div>
                    <div className="text-sm text-blue-600 hover:underline">
                      <a href={backlink.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        {backlink.url.length > 40 ? backlink.url.substring(0, 40) + '...' : backlink.url}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(backlink.status)}</TableCell>
                  <TableCell>{backlink.dateAdded}</TableCell>
                  <TableCell className="max-w-xs truncate" title={backlink.notes}>{backlink.notes}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-gray-500">No backlinks added yet</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const OutreachTemplateCard = ({ template }: { template: any }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-500" />
          {template.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Subject Line:</Label>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2" 
            onClick={() => copyToClipboard(template.subject)}
          >
            {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <div className="text-sm bg-gray-50 p-2 rounded-md">{template.subject}</div>
        
        <div className="flex items-center justify-between pt-2">
          <Label className="text-sm font-medium">Email Body:</Label>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2" 
            onClick={() => copyToClipboard(template.body)}
          >
            {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <div className="text-sm bg-gray-50 p-2 rounded-md whitespace-pre-line h-40 overflow-y-auto">
          {template.body}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={() => copyToClipboard(`Subject: ${template.subject}\n\n${template.body}`)}
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy Full Template
        </Button>
      </CardFooter>
    </Card>
  );
};

const BacklinkStrategy = () => {
  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl">Backlink Acquisition Strategy</CardTitle>
        <CardDescription>
          Build high-quality backlinks from local Laredo sources to boost your search rankings
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="sources">
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sources">Local Sources</TabsTrigger>
            <TabsTrigger value="templates">Outreach Templates</TabsTrigger>
            <TabsTrigger value="tracker">Backlink Tracker</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="pt-6">
          <TabsContent value="sources" className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <AlertTitle className="text-blue-800">Why local backlinks matter</AlertTitle>
              <AlertDescription className="text-blue-700">
                Backlinks from local Laredo websites signal to Google that you're a relevant and trusted source for 
                "houses laredo" and related searches. Focus on these high-impact sources first.
              </AlertDescription>
            </Alert>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead>Authority</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {LOCAL_BACKLINK_SOURCES.map((source, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="font-medium">{source.name}</div>
                        <a 
                          href={source.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-blue-600 hover:underline flex items-center"
                        >
                          {source.website.replace('https://', '')}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </TableCell>
                      <TableCell>
                        {source.authority === 'Very High' && (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Very High</Badge>
                        )}
                        {source.authority === 'High' && (
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">High</Badge>
                        )}
                        {source.authority === 'Medium' && (
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {source.difficulty === 'Easy' && (
                          <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">Easy</Badge>
                        )}
                        {source.difficulty === 'Medium' && (
                          <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-700">Medium</Badge>
                        )}
                        {source.difficulty === 'Hard' && (
                          <Badge variant="outline" className="bg-red-50 border-red-200 text-red-700">Hard</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{source.contactEmail}</div>
                        <div className="text-sm">{source.contactPhone}</div>
                      </TableCell>
                      <TableCell className="max-w-xs text-sm">{source.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <Alert>
              <AlertTitle>Pro Tip</AlertTitle>
              <AlertDescription>
                Start with the "Easy" difficulty sources to build momentum, then work on harder-to-get backlinks.
                Having a few initial backlinks will make your outreach more credible for high-authority sites.
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-4">
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertTitle className="text-yellow-800">Customization Required</AlertTitle>
              <AlertDescription className="text-yellow-700">
                These templates provide a starting point, but always personalize them with specific details about 
                the recipient organization and your unique value proposition.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {OUTREACH_TEMPLATES.map((template, index) => (
                <OutreachTemplateCard key={index} template={template} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="tracker">
            <BacklinkTracker />
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardFooter className="flex justify-between border-t pt-6">
        <div className="text-sm text-gray-500">
          <p>Updated: May 1, 2025</p>
        </div>
        <Button variant="outline">
          <Share2 className="h-4 w-4 mr-2" />
          Export Backlink Report
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BacklinkStrategy;
