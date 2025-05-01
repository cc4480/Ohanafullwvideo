import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SortAscIcon, SortDescIcon, ExternalLinkIcon, CheckIcon, XIcon } from "lucide-react";

interface Backlink {
  id: number;
  sourceDomain: string;
  sourceUrl: string;
  targetUrl: string;
  anchorText?: string;
  doFollow: boolean;
  domainAuthority?: number;
  pageAuthority?: number;
  discovered: string;
  lastChecked?: string;
  active: boolean;
}

interface BacklinkOrganization {
  id: number;
  name: string;
  website: string;
  category: string;
  contactEmail?: string;
  contactPhone?: string;
  contactPerson?: string;
  notes?: string;
  status: 'pending' | 'contacted' | 'acquired' | 'rejected';
  priority: 1 | 2 | 3; // 1 = high, 2 = medium, 3 = low
}

export default function BacklinkStrategy() {
  // Fetch active backlinks
  const { data: backlinks, isLoading: isLoadingBacklinks } = useQuery({
    queryKey: ["/api/seo/backlinks"],
    enabled: true,
  });

  // Fetch target organizations for backlink outreach
  const { data: targetOrganizations, isLoading: isLoadingTargets } = useQuery({
    queryKey: ["/api/seo/backlink-targets"],
    enabled: true,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Local Backlink Strategy</h1>
        <p className="text-muted-foreground mb-4">
          Track and manage backlinks from local Laredo businesses and organizations to improve SEO performance.
        </p>
      </div>

      {/* Current Backlinks */}
      <Card>
        <CardHeader>
          <CardTitle>Active Backlinks</CardTitle>
          <CardDescription>
            External websites that are currently linking to Ohana Realty
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingBacklinks ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source Domain</TableHead>
                    <TableHead>Anchor Text</TableHead>
                    <TableHead>Authority</TableHead>
                    <TableHead>Do-Follow</TableHead>
                    <TableHead>Discovered</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(backlinks) && backlinks.length > 0 ? (
                    backlinks.map((backlink: Backlink) => (
                      <TableRow key={backlink.id}>
                        <TableCell className="font-medium">{backlink.sourceDomain}</TableCell>
                        <TableCell>{backlink.anchorText || '-'}</TableCell>
                        <TableCell>
                          {backlink.domainAuthority ? (
                            <Badge className="bg-primary/20 hover:bg-primary/30">
                              DA: {backlink.domainAuthority}
                            </Badge>
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          {backlink.doFollow ? (
                            <Badge variant="default">Do-Follow</Badge>
                          ) : (
                            <Badge variant="outline">No-Follow</Badge>
                          )}
                        </TableCell>
                        <TableCell>{new Date(backlink.discovered).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {backlink.active ? (
                            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="destructive">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(backlink.sourceUrl, '_blank')}
                          >
                            <ExternalLinkIcon className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        No active backlinks found. Start your outreach campaign to build backlinks.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Laredo Backlink Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle>Laredo Backlink Opportunities</CardTitle>
          <CardDescription>
            Local businesses and organizations for targeted backlink outreach
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingTargets ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Since we don't have the API implemented yet, we'll display sample data */}
                  {/* This would be targetOrganizations.map() when the API is ready */}
                  {[
                    {
                      id: 1,
                      name: "Laredo Chamber of Commerce",
                      website: "https://laredochamber.com",
                      category: "Business Association",
                      contactEmail: "info@laredochamber.com",
                      contactPhone: "(956) 722-9895",
                      contactPerson: "President",
                      notes: "Strong authority site for local businesses",
                      status: "pending",
                      priority: 1
                    },
                    {
                      id: 2,
                      name: "Laredo Association of Realtors",
                      website: "https://laredorealtors.com",
                      category: "Real Estate Association",
                      contactEmail: "info@laredorealtors.org",
                      contactPhone: "(956) 723-0676",
                      contactPerson: "Executive Director",
                      notes: "Highly relevant for real estate SEO",
                      status: "contacted",
                      priority: 1
                    },
                    {
                      id: 3,
                      name: "Laredo Economic Development Corporation",
                      website: "https://laredoedc.org",
                      category: "Economic Development",
                      contactEmail: "info@laredoedc.org",
                      contactPhone: "(956) 722-0563",
                      status: "pending",
                      priority: 2
                    },
                    {
                      id: 4,
                      name: "Visit Laredo",
                      website: "https://visitlaredo.com",
                      category: "Tourism",
                      contactEmail: "tourism@visitlaredo.com",
                      status: "acquired",
                      priority: 1
                    },
                    {
                      id: 5,
                      name: "Laredo Morning Times",
                      website: "https://lmtonline.com",
                      category: "News Media",
                      contactEmail: "news@lmtonline.com",
                      status: "pending",
                      priority: 2
                    },
                    {
                      id: 6,
                      name: "Laredo College",
                      website: "https://laredo.edu",
                      category: "Education",
                      contactEmail: "info@laredo.edu",
                      status: "pending",
                      priority: 2
                    },
                    {
                      id: 7,
                      name: "Texas A&M International University",
                      website: "https://tamiu.edu",
                      category: "Education",
                      contactEmail: "info@tamiu.edu",
                      status: "pending",
                      priority: 2
                    },
                    {
                      id: 8,
                      name: "Laredo Builders Association",
                      website: "https://laredobuilders.org",
                      category: "Construction",
                      contactEmail: "info@laredobuilders.org",
                      status: "pending",
                      priority: 1
                    },
                    {
                      id: 9,
                      name: "Laredo Rotary Club",
                      website: "https://laredo-rotary.org",
                      category: "Community Organization",
                      contactEmail: "info@laredo-rotary.org",
                      status: "pending",
                      priority: 3
                    },
                    {
                      id: 10,
                      name: "Laredo Center for the Arts",
                      website: "https://laredoartcenter.org",
                      category: "Arts & Culture",
                      contactEmail: "info@laredoartcenter.org",
                      status: "contacted",
                      priority: 3
                    }
                  ].map((org: BacklinkOrganization, index) => (
                    <TableRow key={org.id || index}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{org.name}</div>
                          <div className="text-sm text-muted-foreground">{org.website}</div>
                        </div>
                      </TableCell>
                      <TableCell>{org.category}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={org.priority === 1 ? "default" : org.priority === 2 ? "secondary" : "outline"}
                        >
                          {org.priority === 1 ? "High" : org.priority === 2 ? "Medium" : "Low"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            org.status === "acquired" ? "default" : 
                            org.status === "contacted" ? "secondary" : 
                            org.status === "rejected" ? "destructive" : "outline"
                          }
                          className={
                            org.status === "acquired" ? "bg-green-500 hover:bg-green-600" : ""
                          }
                        >
                          {org.status.charAt(0).toUpperCase() + org.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {org.contactEmail && (
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">Email:</span>
                              <span>{org.contactEmail}</span>
                            </div>
                          )}
                          {org.contactPhone && (
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">Phone:</span>
                              <span>{org.contactPhone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(org.website, '_blank')}
                          >
                            <ExternalLinkIcon className="h-4 w-4" />
                          </Button>
                          {org.status === "acquired" ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-500"
                              title="Backlink Acquired"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </Button>
                          ) : org.status === "rejected" ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500"
                              title="Backlink Rejected"
                            >
                              <XIcon className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8"
                              onClick={() => {
                                // In the actual implementation, this would open a form or modal to log outreach
                                alert(`Contact ${org.name} for backlink outreach`);
                              }}
                            >
                              {org.status === "contacted" ? "Follow Up" : "Contact"}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Backlink Strategy Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Laredo-Specific Backlink Strategy</CardTitle>
          <CardDescription>
            Best practices for acquiring high-quality local backlinks to outrank competitors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Priority Target Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Real Estate Associations</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-sm">
                    <p className="text-muted-foreground">
                      Local realtor associations, MLS services, and housing authorities provide
                      highly relevant backlinks that search engines value for real estate keywords.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Local Business Organizations</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-sm">
                    <p className="text-muted-foreground">
                      Chamber of Commerce, economic development agencies, and business improvement
                      districts provide authoritative local signals.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Community Organizations</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-sm">
                    <p className="text-muted-foreground">
                      Neighborhood associations, non-profits, schools, and churches help establish
                      local relevance and community connections.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Outreach Templates</h3>
              <p className="text-muted-foreground mb-4">
                Use these customizable templates when reaching out to local organizations.
              </p>

              <div className="space-y-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Business Association Template</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-sm">
                    <p className="text-muted-foreground">
                      Subject: Partnering with [Organization] to Support Laredo's Growth<br /><br />
                      Dear [Contact Name],<br /><br />
                      I'm reaching out from Ohana Realty, a local real estate agency dedicated to serving the Laredo community. We're interested in exploring partnership opportunities with [Organization] to support local businesses and community development in Laredo.<br /><br />
                      We'd love to be listed as a resource on your website and would be happy to reciprocate by featuring [Organization] on our community partners page. Our comprehensive neighborhood guides and market insights could also be valuable resources for your members/visitors.<br /><br />
                      Would you be available for a brief discussion about how we might collaborate to support Laredo's growth?<br /><br />
                      Best regards,<br />
                      [Your Name]<br />
                      Ohana Realty
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Content Contribution Template</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-sm">
                    <p className="text-muted-foreground">
                      Subject: Expert Content Contribution for [Organization] Website<br /><br />
                      Dear [Contact Name],<br /><br />
                      I'm [Your Name] from Ohana Realty, and I noticed that [Organization] provides valuable information about Laredo's [relevant topic].<br /><br />
                      I'd like to offer to contribute an expert article on [specific topic relevant to their audience] for your website. As local real estate experts, we have unique insights on Laredo neighborhoods, property values, and market trends that your audience might find valuable.<br /><br />
                      The article would be entirely educational (not promotional) and we'd be happy to have it branded to your specifications. Of course, we'd appreciate a simple attribution with a link back to our website.<br /><br />
                      I've attached some sample topics that might interest your audience. Would you be open to this collaboration?<br /><br />
                      Warm regards,<br />
                      [Your Name]<br />
                      Ohana Realty
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Value Proposition Ideas</h3>
              <p className="text-muted-foreground mb-4">
                Offer these value-adding resources to incentivize backlinks:
              </p>

              <div className="space-y-2">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium">Exclusive Laredo Market Reports</h4>
                  <p className="text-sm text-muted-foreground">Offer to provide quarterly Laredo real estate market reports that organizations can share with their members/visitors.</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium">Neighborhood Resource Pages</h4>
                  <p className="text-sm text-muted-foreground">Create and offer detailed neighborhood guides with demographics, amenities, and market trends.</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium">Local Business Spotlights</h4>
                  <p className="text-sm text-muted-foreground">Feature local businesses on your blog and social media in exchange for mentions on their websites.</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium">Community Event Sponsorships</h4>
                  <p className="text-sm text-muted-foreground">Sponsor local events in exchange for website mentions and backlinks in event materials.</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium">Educational Workshops</h4>
                  <p className="text-sm text-muted-foreground">Offer to host educational workshops on homebuying, investing, or market trends for organization members.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
