import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// Define keywords directly to avoid import issues
const PRIMARY_KEYWORDS = [
  'homes for sale in Laredo TX',
  'houses for sale in Laredo',
  'Laredo real estate',
  'Laredo homes for sale',
  'houses for sale Laredo TX',
  'condos for sale in Laredo',
  'Laredo houses for sale',
  'real estate Laredo TX',
  'Laredo houses for rent',
  'homes for rent in Laredo', 
  'Laredo rental properties'
];

const LONG_TAIL_KEYWORDS = [
  'affordable homes for sale in Laredo TX',
  'houses for sale in Laredo under 200k',
  'luxury houses for sale in Laredo TX',
  'Laredo homes for sale with pool',
  'downtown Laredo condos for sale'
];

const NEIGHBORHOOD_KEYWORDS = [
  'Downtown Laredo real estate',
  'North Laredo homes for sale',
  'South Laredo houses',
  'East Laredo properties',
  'West Laredo homes for rent'
];

const COMPETITOR_KEYWORDS = [
  'better than Coldwell Banker Laredo',
  'Laredo real estate alternatives to RE/MAX',
  'Ohana Realty vs RE/MAX Laredo',
  'best real estate agency in Laredo TX' 
];

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

const mockKeywordData: KeywordRankingData[] = [
  {
    keyword: 'homes for sale in Laredo TX',
    position: 4,
    change: 2,
    url: '/properties',
    competitors: [
      { name: 'Coldwell Banker', position: 1 },
      { name: 'RE/MAX', position: 2 },
      { name: 'Zillow', position: 3 }
    ],
    searchVolume: 2200,
    difficultyScore: 68
  },
  {
    keyword: 'houses for sale in Laredo',
    position: 3,
    change: 5,
    url: '/properties',
    competitors: [
      { name: 'RE/MAX', position: 1 },
      { name: 'Coldwell Banker', position: 2 }
    ],
    searchVolume: 1800,
    difficultyScore: 62
  },
  {
    keyword: 'Laredo real estate',
    position: 6,
    change: -1,
    url: '/',
    competitors: [
      { name: 'Coldwell Banker', position: 1 },
      { name: 'RE/MAX', position: 2 },
      { name: 'Century 21', position: 3 },
      { name: 'Zillow', position: 4 },
      { name: 'Trulia', position: 5 }
    ],
    searchVolume: 1500,
    difficultyScore: 75
  },
  {
    keyword: 'condos for sale in Laredo',
    position: 2,
    change: 6,
    url: '/properties?type=condo',
    competitors: [
      { name: 'Zillow', position: 1 }
    ],
    searchVolume: 320,
    difficultyScore: 45
  },
  {
    keyword: 'Laredo houses for rent',
    position: 1,
    change: 3,
    url: '/rentals',
    competitors: [
      { name: 'Apartments.com', position: 2 },
      { name: 'Zillow', position: 3 }
    ],
    searchVolume: 1350,
    difficultyScore: 58
  },
  {
    keyword: 'Downtown Laredo real estate',
    position: 1,
    change: 2,
    url: '/neighborhoods/2',
    competitors: [
      { name: 'Coldwell Banker', position: 2 },
      { name: 'RE/MAX', position: 4 }
    ],
    searchVolume: 210,
    difficultyScore: 39
  }
];

export default function SEODashboard() {
  const [keywordData, setKeywordData] = useState<KeywordRankingData[]>(mockKeywordData);
  const [selectedCategory, setSelectedCategory] = useState<string>('primary');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const categories = [
    { id: 'primary', name: 'Primary Keywords', keywords: PRIMARY_KEYWORDS },
    { id: 'long-tail', name: 'Long-tail Keywords', keywords: LONG_TAIL_KEYWORDS },
    { id: 'neighborhood', name: 'Neighborhood Keywords', keywords: NEIGHBORHOOD_KEYWORDS },
    { id: 'competitor', name: 'Competitor Keywords', keywords: COMPETITOR_KEYWORDS }
  ];
  
  // Function to simulate fetching updated keyword ranking data
  const refreshKeywordData = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create updated data with some random variations
    const updatedData = mockKeywordData.map(keyword => {
      const positionChange = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
      const newPosition = Math.max(1, keyword.position - positionChange);
      
      return {
        ...keyword,
        position: newPosition,
        change: keyword.position - newPosition
      };
    });
    
    setKeywordData(updatedData);
    setIsLoading(false);
  };
  
  // Calculate overall SEO performance score (0-100)
  const calculateSEOScore = (): number => {
    // Weight factors based on importance
    const weightByPosition = (position: number) => {
      if (position === 1) return 1;
      if (position <= 3) return 0.8;
      if (position <= 5) return 0.6;
      if (position <= 10) return 0.4;
      return 0.2;
    };
    
    // Calculate weighted score based on keyword positions and search volume
    let totalWeight = 0;
    let weightedScore = 0;
    
    keywordData.forEach(kw => {
      const weight = kw.searchVolume / 100; // Higher search volume = more important
      totalWeight += weight;
      weightedScore += weightByPosition(kw.position) * weight;
    });
    
    return Math.round((weightedScore / totalWeight) * 100);
  };
  
  // Get keywords that are underperforming
  const getUnderperformingKeywords = (): KeywordRankingData[] => {
    return keywordData
      .filter(kw => kw.position > 3 && kw.searchVolume > 500)
      .sort((a, b) => b.searchVolume - a.searchVolume)
      .slice(0, 3);
  };
  
  // Get improvement opportunities
  const getImprovedKeywords = (): KeywordRankingData[] => {
    return keywordData
      .filter(kw => kw.change > 0)
      .sort((a, b) => b.change - a.change)
      .slice(0, 3);
  };
  
  const seoScore = calculateSEOScore();
  const underperformingKeywords = getUnderperformingKeywords();
  const improvedKeywords = getImprovedKeywords();
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">SEO Performance Dashboard</h2>
        <Button onClick={refreshKeywordData} disabled={isLoading}>
          {isLoading ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall SEO Score</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground">
              <path d="m12 16 4-4-4-4"/><rect width="20" height="12" x="2" y="6" rx="2"/>
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{seoScore}/100</div>
            <Progress value={seoScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {seoScore > 75 ? 'Excellent' : seoScore > 60 ? 'Good' : seoScore > 40 ? 'Average' : 'Needs Improvement'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top 3 Rankings</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground">
              <path d="m5 12 5 5 9-9"/>
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{keywordData.filter(kw => kw.position <= 3).length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {((keywordData.filter(kw => kw.position <= 3).length / keywordData.length) * 100).toFixed(0)}% of tracked keywords
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beating Coldwell Banker</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground">
              <line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/>
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {keywordData.filter(kw => {
                const cbPosition = kw.competitors.find(c => c.name === 'Coldwell Banker')?.position || 100;
                return kw.position < cbPosition;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {((keywordData.filter(kw => {
                const cbPosition = kw.competitors.find(c => c.name === 'Coldwell Banker')?.position || 100;
                return kw.position < cbPosition;
              }).length / keywordData.length) * 100).toFixed(0)}% outranking
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beating RE/MAX</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground">
              <path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 4v16"/>
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {keywordData.filter(kw => {
                const remaxPosition = kw.competitors.find(c => c.name === 'RE/MAX')?.position || 100;
                return kw.position < remaxPosition;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {((keywordData.filter(kw => {
                const remaxPosition = kw.competitors.find(c => c.name === 'RE/MAX')?.position || 100;
                return kw.position < remaxPosition;
              }).length / keywordData.length) * 100).toFixed(0)}% outranking
            </p>
          </CardContent>
        </Card>
      </div>
      
      {underperformingKeywords.length > 0 && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTitle className="text-amber-800">Keywords Needing Improvement</AlertTitle>
          <AlertDescription className="text-amber-700">
            <ul className="mt-2 list-disc pl-5 text-sm">
              {underperformingKeywords.map((kw, idx) => (
                <li key={idx}>
                  <strong>{kw.keyword}</strong> (currently #{kw.position}) has {kw.searchVolume.toLocaleString()} monthly searches
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      {improvedKeywords.length > 0 && (
        <Alert className="bg-green-50 border-green-200">
          <AlertTitle className="text-green-800">Recent Improvements</AlertTitle>
          <AlertDescription className="text-green-700">
            <ul className="mt-2 list-disc pl-5 text-sm">
              {improvedKeywords.map((kw, idx) => (
                <li key={idx}>
                  <strong>{kw.keyword}</strong> improved by {kw.change} positions (now at #{kw.position})
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="primary" onValueChange={setSelectedCategory}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
        
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b transition-colors hover:bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium">Keyword</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Position</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Change</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Search Volume</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Difficulty</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">URL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keywordData
                      .filter(kw => category.keywords.includes(kw.keyword))
                      .map((kw, idx) => (
                        <tr key={idx} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">{kw.keyword}</td>
                          <td className="p-4 align-middle">
                            <span className={`font-medium ${
                              kw.position <= 3 ? 'text-green-600' : 
                              kw.position <= 10 ? 'text-amber-600' : 'text-red-600'
                            }`}>
                              #{kw.position}
                            </span>
                          </td>
                          <td className="p-4 align-middle">
                            {kw.change > 0 ? (
                              <span className="text-green-600">↑ {kw.change}</span>
                            ) : kw.change < 0 ? (
                              <span className="text-red-600">↓ {Math.abs(kw.change)}</span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="p-4 align-middle">{kw.searchVolume.toLocaleString()}</td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-2">
                              <Progress value={kw.difficultyScore} className="w-16" />
                              <span className="text-xs">{kw.difficultyScore}/100</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <span className="text-blue-600 hover:underline">{kw.url}</span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {keywordData.filter(kw => category.keywords.includes(kw.keyword)).length === 0 && (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">No ranking data available for these keywords yet.</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      <div className="p-6 bg-slate-50 rounded-lg border mt-8">
        <h3 className="text-lg font-medium mb-2">SEO Domination Strategy</h3>
        <p className="text-sm text-slate-600 mb-4">
          Our system is actively working to outrank Coldwell Banker and RE/MAX for all target keywords.
          Below are the tactics currently being implemented:
        </p>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Optimizing schema.org structured data for all property listings</span>
          </li>
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Enhancing page speed with advanced caching strategies</span>
          </li>
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Building high-quality local backlinks from Laredo businesses</span>
          </li>
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Creating neighborhood-specific content to target long-tail keywords</span>
          </li>
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Implementing aggressive competitor comparison content strategy</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
