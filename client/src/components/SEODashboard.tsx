import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Chart, PieArcDatum } from 'recharts';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ArrowUp, ArrowDown, Minus, Award, Target, TrendingUp, Flag, AlertTriangle } from 'lucide-react';

interface KeywordRankingData {
  keyword: string;
  position: number;
  change: number; // positive for improvement, negative for decline
  url: string;
  competitors: {
    name: string;
    position: number;
  }[];
  searchVolume: number; // monthly search volume
  difficultyScore: number; // 0-100 difficulty to rank
}

interface SeoKeyword {
  id: number;
  keyword: string;
  category: string;
  searchVolume: number;
  difficultyScore: number;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

interface SeoRanking {
  ranking: {
    id: number;
    keywordId: number;
    position: number;
    date: string;
    url: string;
    coldwellPosition: number | null;
    remaxPosition: number | null;
    zillowPosition: number | null;
    truliaPosition: number | null;
  };
  keyword: SeoKeyword;
}

export default function SEODashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch rankings data
  const { data: rankings, isLoading: rankingsLoading, error: rankingsError } = useQuery({
    queryKey: ["/api/seo/rankings"],
    enabled: true,
  });

  // Fetch keywords data
  const { data: keywords, isLoading: keywordsLoading, error: keywordsError } = useQuery({
    queryKey: ["/api/seo/keywords"],
    enabled: true,
  });

  // Fetch insights data
  const { data: insights, isLoading: insightsLoading, error: insightsError } = useQuery({
    queryKey: ["/api/seo/insights"],
    enabled: true,
  });

  const isLoading = rankingsLoading || keywordsLoading || insightsLoading;
  const hasError = rankingsError || keywordsError || insightsError;

  // Format data for charts
  const formatRankingData = () => {
    if (!rankings || !keywords) return [];
    
    return rankings.map((item: SeoRanking) => ({
      name: item.keyword.keyword.length > 20 ? item.keyword.keyword.substring(0, 20) + '...' : item.keyword.keyword,
      position: item.ranking.position,
      coldwell: item.ranking.coldwellPosition,
      remax: item.ranking.remaxPosition,
      zillow: item.ranking.zillowPosition,
      trulia: item.ranking.truliaPosition,
      searchVolume: item.keyword.searchVolume,
      difficultyScore: item.keyword.difficultyScore,
      category: item.keyword.category,
    }));
  };

  const categoryColors = {
    primary: '#4f46e5',
    'long-tail': '#10b981',
    neighborhood: '#f59e0b',
    competitor: '#ef4444',
  };

  const getPositionColor = (position: number) => {
    if (position <= 3) return '#10b981';
    if (position <= 10) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">SEO Performance Dashboard</h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">Export Data</Button>
            <Button variant="default" size="sm">Refresh Data</Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="competitors">Competitor Analysis</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-lg text-gray-500 mb-4">Loading SEO data...</p>
                <Progress value={33} className="w-1/2 h-2" />
              </div>
            ) : hasError ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Failed to load SEO data. Please try again later.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Top Rankings</CardTitle>
                        <CardDescription>Keywords ranked in top 10</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {rankings?.filter((r: SeoRanking) => r.ranking.position <= 10).length || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {`of ${rankings?.length || 0} tracked keywords`}
                        </p>
                        <div className="mt-4 h-2">
                          <Progress value={(rankings?.filter((r: SeoRanking) => r.ranking.position <= 10).length / (rankings?.length || 1)) * 100} />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Keyword Categories</CardTitle>
                        <CardDescription>Distribution by type</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="h-[120px]">
                          {keywords && (
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={[
                                    { name: 'Primary', value: keywords.filter((k: SeoKeyword) => k.category === 'primary').length },
                                    { name: 'Long-tail', value: keywords.filter((k: SeoKeyword) => k.category === 'long-tail').length },
                                    { name: 'Neighborhood', value: keywords.filter((k: SeoKeyword) => k.category === 'neighborhood').length },
                                    { name: 'Competitor', value: keywords.filter((k: SeoKeyword) => k.category === 'competitor').length },
                                  ]}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={30}
                                  outerRadius={50}
                                  paddingAngle={5}
                                  dataKey="value"
                                >
                                  {[
                                    { name: 'primary', color: categoryColors.primary },
                                    { name: 'long-tail', color: categoryColors['long-tail'] },
                                    { name: 'neighborhood', color: categoryColors.neighborhood },
                                    { name: 'competitor', color: categoryColors.competitor },
                                  ].map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          )}
                        </div>
                        <div className="flex justify-center space-x-4 text-xs">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: categoryColors.primary }}></div>
                            <span>Primary</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: categoryColors['long-tail'] }}></div>
                            <span>Long-tail</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: categoryColors.neighborhood }}></div>
                            <span>Neighborhood</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: categoryColors.competitor }}></div>
                            <span>Competitor</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Competitive Edge</CardTitle>
                        <CardDescription>Outranking major competitors</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {rankings && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Coldwell Banker</span>
                              <span className="text-sm font-medium">
                                {rankings.filter((r: SeoRanking) => r.ranking.position < (r.ranking.coldwellPosition || 100)).length} keywords
                              </span>
                            </div>
                            <Progress value={(rankings.filter((r: SeoRanking) => r.ranking.position < (r.ranking.coldwellPosition || 100)).length / rankings.length) * 100} />
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm">RE/MAX</span>
                              <span className="text-sm font-medium">
                                {rankings.filter((r: SeoRanking) => r.ranking.position < (r.ranking.remaxPosition || 100)).length} keywords
                              </span>
                            </div>
                            <Progress value={(rankings.filter((r: SeoRanking) => r.ranking.position < (r.ranking.remaxPosition || 100)).length / rankings.length) * 100} />
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Zillow</span>
                              <span className="text-sm font-medium">
                                {rankings.filter((r: SeoRanking) => r.ranking.position < (r.ranking.zillowPosition || 100)).length} keywords
                              </span>
                            </div>
                            <Progress value={(rankings.filter((r: SeoRanking) => r.ranking.position < (r.ranking.zillowPosition || 100)).length / rankings.length) * 100} />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top Performing Keywords</CardTitle>
                      <CardDescription>Keywords with highest rankings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Keyword</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Search Volume</TableHead>
                            <TableHead className="text-right">Difficulty</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {rankings && formatRankingData()
                            .sort((a: any, b: any) => a.position - b.position)
                            .slice(0, 5)
                            .map((ranking: any, index: number) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{ranking.name}</TableCell>
                                <TableCell>
                                  <Badge variant={ranking.position <= 3 ? "success" : ranking.position <= 10 ? "warning" : "destructive"}>
                                    #{ranking.position}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" style={{ backgroundColor: `${categoryColors[ranking.category]}20`, color: categoryColors[ranking.category] }}>
                                    {ranking.category}
                                  </Badge>
                                </TableCell>
                                <TableCell>{ranking.searchVolume.toLocaleString()}/mo</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end space-x-2">
                                    <Progress 
                                      value={ranking.difficultyScore} 
                                      className="w-16" 
                                      indicatorColor={ranking.difficultyScore > 70 ? 'bg-red-500' : 
                                                     ranking.difficultyScore > 40 ? 'bg-amber-500' : 'bg-green-500'}
                                    />
                                    <span>{ranking.difficultyScore}</span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          }
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="keywords" className="space-y-4">
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-semibold tracking-tight">Keyword Rankings</h2>
                      <p className="text-sm text-muted-foreground">
                        Tracking {keywords?.length || 0} keywords across {keywords ? Array.from(new Set(keywords.map((k: SeoKeyword) => k.category))).length : 0} categories
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Keyword</TableHead>
                          <TableHead>Position</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Volume</TableHead>
                          <TableHead>Difficulty</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead className="text-right">Competitors</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rankings && rankings.map((item: SeoRanking, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.keyword.keyword}</TableCell>
                            <TableCell>
                              <Badge variant={item.ranking.position <= 3 ? "success" : item.ranking.position <= 10 ? "warning" : "destructive"}>
                                #{item.ranking.position}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" style={{ backgroundColor: `${categoryColors[item.keyword.category]}20`, color: categoryColors[item.keyword.category] }}>
                                {item.keyword.category}
                              </Badge>
                            </TableCell>
                            <TableCell>{item.keyword.searchVolume.toLocaleString()}/mo</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Progress 
                                  value={item.keyword.difficultyScore} 
                                  className="w-16" 
                                  indicatorColor={item.keyword.difficultyScore > 70 ? 'bg-red-500' : 
                                                item.keyword.difficultyScore > 40 ? 'bg-amber-500' : 'bg-green-500'}
                                />
                                <span>{item.keyword.difficultyScore}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={item.keyword.priority > 8 ? "default" : 
                                        item.keyword.priority > 5 ? "secondary" : "outline"}>
                                {item.keyword.priority}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-4">
                                {item.ranking.coldwellPosition && (
                                  <div className="flex flex-col items-center">
                                    <span className="text-xs text-gray-500">CB</span>
                                    <Badge variant={item.ranking.position < item.ranking.coldwellPosition ? "success" : "destructive"}>
                                      {item.ranking.position < item.ranking.coldwellPosition ? 
                                        <ArrowUp className="h-3 w-3 mr-1" /> : 
                                        <ArrowDown className="h-3 w-3 mr-1" />}
                                      {item.ranking.coldwellPosition}
                                    </Badge>
                                  </div>
                                )}
                                {item.ranking.remaxPosition && (
                                  <div className="flex flex-col items-center">
                                    <span className="text-xs text-gray-500">RE/MAX</span>
                                    <Badge variant={item.ranking.position < item.ranking.remaxPosition ? "success" : "destructive"}>
                                      {item.ranking.position < item.ranking.remaxPosition ? 
                                        <ArrowUp className="h-3 w-3 mr-1" /> : 
                                        <ArrowDown className="h-3 w-3 mr-1" />}
                                      {item.ranking.remaxPosition}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="competitors" className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">Competitor Benchmarking</h2>
                    <p className="text-sm text-muted-foreground">
                      See how Ohana Realty ranks against top competitors for each tracked keyword
                    </p>
                  </div>

                  <div className="h-80 mt-4">
                    {rankings && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={formatRankingData()}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis reversed domain={[0, 100]} />
                          <Tooltip formatter={(value) => [`Position: ${value}`, 'Rank']} />
                          <Legend />
                          <Bar name="Ohana" dataKey="position" fill="#4f46e5" />
                          <Bar name="Coldwell" dataKey="coldwell" fill="#ef4444" />
                          <Bar name="RE/MAX" dataKey="remax" fill="#f59e0b" />
                          <Bar name="Zillow" dataKey="zillow" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-4">
                      <Target className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Competitive Insights</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Ranking Comparison</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {rankings && [
                              { name: 'Coldwell Banker', key: 'coldwellPosition' },
                              { name: 'RE/MAX', key: 'remaxPosition' },
                              { name: 'Zillow', key: 'zillowPosition' },
                            ].map((competitor, index) => {
                              const ahead = rankings.filter((r: SeoRanking) => 
                                r.ranking.position < (r.ranking[competitor.key] || 100)
                              ).length;
                              const behind = rankings.filter((r: SeoRanking) => 
                                r.ranking.position > (r.ranking[competitor.key] || 0) && r.ranking[competitor.key] !== null
                              ).length;
                              const tied = rankings.filter((r: SeoRanking) => 
                                r.ranking.position === r.ranking[competitor.key] && r.ranking[competitor.key] !== null
                              ).length;
                              
                              return (
                                <div key={index} className="flex items-center">
                                  <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                      <span className="text-sm font-medium">{competitor.name}</span>
                                      <span className="text-sm text-muted-foreground">
                                        {ahead} ahead, {behind} behind, {tied} tied
                                      </span>
                                    </div>
                                    <div className="flex">
                                      <div 
                                        className="h-2 bg-green-500" 
                                        style={{ width: `${(ahead / rankings.length) * 100}%` }}
                                      ></div>
                                      <div 
                                        className="h-2 bg-gray-300" 
                                        style={{ width: `${(tied / rankings.length) * 100}%` }}
                                      ></div>
                                      <div 
                                        className="h-2 bg-red-500" 
                                        style={{ width: `${(behind / rankings.length) * 100}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Key Opportunities</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2 text-sm">
                            {rankings && 
                              rankings
                                .filter((r: SeoRanking) => 
                                  r.ranking.position > 10 && 
                                  r.keyword.searchVolume > 500 &&
                                  ((r.ranking.coldwellPosition && r.ranking.coldwellPosition <= 10) ||
                                   (r.ranking.remaxPosition && r.ranking.remaxPosition <= 10))
                                )
                                .slice(0, 4)
                                .map((opportunity: SeoRanking, index: number) => (
                                  <li key={index} className="flex justify-between">
                                    <span className="font-medium">{opportunity.keyword.keyword}</span>
                                    <div className="flex items-center">
                                      <Badge variant="outline">
                                        #{opportunity.ranking.position}
                                      </Badge>
                                      <span className="mx-2 text-xs">vs</span>
                                      <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                                        #{Math.min(
                                          opportunity.ranking.coldwellPosition || 100,
                                          opportunity.ranking.remaxPosition || 100
                                        )}
                                      </Badge>
                                    </div>
                                  </li>
                                ))
                            }
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="recommendations" className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">SEO Recommendations</h2>
                    <p className="text-sm text-muted-foreground">
                      Actionable steps to improve your search engine rankings
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          <CardTitle>High-Impact Opportunities</CardTitle>
                        </div>
                        <CardDescription>
                          Keywords that can deliver quick wins
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {rankings && rankings
                          .filter((r: SeoRanking) => 
                            r.ranking.position > 10 && 
                            r.ranking.position <= 20 && 
                            r.keyword.priority >= 7
                          )
                          .slice(0, 3)
                          .map((item: SeoRanking, index: number) => (
                            <div key={index} className="p-3 bg-muted rounded-lg">
                              <div className="flex justify-between mb-1">
                                <span className="font-medium">{item.keyword.keyword}</span>
                                <Badge variant="outline">#{item.ranking.position}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {item.keyword.searchVolume.toLocaleString()} monthly searches
                              </p>
                              <div className="flex space-x-1 text-xs">
                                <Badge variant="outline" style={{ backgroundColor: `${categoryColors[item.keyword.category]}20`, color: categoryColors[item.keyword.category] }}>
                                  {item.keyword.category}
                                </Badge>
                                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                                  Priority {item.keyword.priority}/10
                                </Badge>
                              </div>
                            </div>
                          ))
                        }
                        
                        <Button variant="outline" className="w-full mt-2">
                          View All Opportunities
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <div className="flex items-center space-x-2">
                          <Flag className="h-5 w-5 text-primary" />
                          <CardTitle>Optimization Strategies</CardTitle>
                        </div>
                        <CardDescription>
                          Content and technical SEO improvements
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-4">
                          <li className="flex items-start space-x-2">
                            <div className="mt-0.5 bg-green-100 text-green-800 w-5 h-5 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold">1</span>
                            </div>
                            <div>
                              <p className="font-medium">Optimize property detail pages</p>
                              <p className="text-sm text-muted-foreground">Update meta titles, descriptions, and headings with primary keywords.</p>
                            </div>
                          </li>
                          <li className="flex items-start space-x-2">
                            <div className="mt-0.5 bg-green-100 text-green-800 w-5 h-5 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold">2</span>
                            </div>
                            <div>
                              <p className="font-medium">Create neighborhood guide content</p>
                              <p className="text-sm text-muted-foreground">Develop detailed, keyword-rich neighborhood guides for Laredo areas.</p>
                            </div>
                          </li>
                          <li className="flex items-start space-x-2">
                            <div className="mt-0.5 bg-green-100 text-green-800 w-5 h-5 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold">3</span>
                            </div>
                            <div>
                              <p className="font-medium">Improve mobile page speed</p>
                              <p className="text-sm text-muted-foreground">Optimize image sizes and implement lazy loading for better Core Web Vitals.</p>
                            </div>
                          </li>
                          <li className="flex items-start space-x-2">
                            <div className="mt-0.5 bg-green-100 text-green-800 w-5 h-5 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold">4</span>
                            </div>
                            <div>
                              <p className="font-medium">Enhance structured data</p>
                              <p className="text-sm text-muted-foreground">Implement RealEstateListing schema markup for all property listings.</p>
                            </div>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Alerts for critical issues */}
                  <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Attention Required</AlertTitle>
                    <AlertDescription>
                      5 high-priority keywords have rankings below position #20. These need immediate content improvements.
                    </AlertDescription>
                  </Alert>
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
