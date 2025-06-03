
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Bot, 
  Search, 
  Target, 
  TrendingUp, 
  FileText, 
  BarChart3, 
  Brain, 
  Lightbulb,
  Globe,
  Users,
  Calendar,
  Award
} from 'lucide-react';

interface AIServiceResponse {
  data?: any;
  loading: boolean;
  error?: string;
}

export default function AISEODashboard() {
  const [activeService, setActiveService] = useState('content-optimization');
  const [contentInput, setContentInput] = useState('');
  const [keywordsInput, setKeywordsInput] = useState('');
  const [locationInput, setLocationInput] = useState('Laredo, TX');
  const [results, setResults] = useState<AIServiceResponse>({ loading: false });

  const aiServices = [
    {
      id: 'content-optimization',
      name: 'AI Content Optimization',
      icon: <FileText className="h-5 w-5" />,
      description: 'Optimize your content with AI-powered SEO recommendations'
    },
    {
      id: 'keyword-research',
      name: 'AI Keyword Research',
      icon: <Search className="h-5 w-5" />,
      description: 'Discover high-value keywords with AI analysis'
    },
    {
      id: 'competitor-analysis',
      name: 'AI Competitor Analysis',
      icon: <Target className="h-5 w-5" />,
      description: 'Analyze competitors with AI-powered insights'
    },
    {
      id: 'seo-audit',
      name: 'AI SEO Audit',
      icon: <BarChart3 className="h-5 w-5" />,
      description: 'Comprehensive SEO audit powered by AI'
    },
    {
      id: 'content-generation',
      name: 'AI Content Generation',
      icon: <Bot className="h-5 w-5" />,
      description: 'Generate SEO-optimized content with AI'
    },
    {
      id: 'search-intent',
      name: 'AI Search Intent Analysis',
      icon: <Brain className="h-5 w-5" />,
      description: 'Understand user search intent with AI'
    },
    {
      id: 'local-optimization',
      name: 'AI Local SEO',
      icon: <Globe className="h-5 w-5" />,
      description: 'Optimize for local search with AI guidance'
    },
    {
      id: 'performance-tracking',
      name: 'AI Performance Tracking',
      icon: <TrendingUp className="h-5 w-5" />,
      description: 'Track and predict SEO performance'
    },
    {
      id: 'strategy-planning',
      name: 'AI Strategy Planning',
      icon: <Calendar className="h-5 w-5" />,
      description: 'Create data-driven SEO strategies'
    }
  ];

  const callAIService = async (serviceId: string, payload: any) => {
    setResults({ loading: true });
    
    try {
      const response = await fetch(`/api/ai-seo/${serviceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setResults({ data, loading: false });
    } catch (error) {
      setResults({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      });
    }
  };

  const handleOptimizeContent = () => {
    const payload = {
      content: contentInput,
      targetKeywords: keywordsInput.split(',').map(k => k.trim()),
      contentType: 'property',
      location: locationInput,
      competitorAnalysis: true
    };
    
    callAIService('optimize-content', payload);
  };

  const handleKeywordResearch = () => {
    const payload = {
      seedKeywords: keywordsInput.split(',').map(k => k.trim()),
      location: locationInput,
      industry: 'real estate',
      contentType: 'property',
      searchVolume: true,
      competitorKeywords: true
    };
    
    callAIService('keyword-research', payload);
  };

  const handleCompetitorAnalysis = () => {
    const payload = {
      competitors: ['Coldwell Banker', 'RE/MAX', 'Zillow'],
      targetKeywords: keywordsInput.split(',').map(k => k.trim()),
      analysisType: 'all'
    };
    
    callAIService('competitor-analysis', payload);
  };

  const handleSEOAudit = () => {
    const payload = {
      url: window.location.origin,
      contentType: 'website',
      targetKeywords: keywordsInput.split(',').map(k => k.trim()),
      includeCompetitors: true
    };
    
    callAIService('audit', payload);
  };

  const handleContentGeneration = () => {
    const payload = {
      topic: 'Real Estate in ' + locationInput,
      keywords: keywordsInput.split(',').map(k => k.trim()),
      contentType: 'blog',
      location: locationInput,
      length: 800,
      tone: 'professional'
    };
    
    callAIService('generate-content', payload);
  };

  const handleSearchIntent = () => {
    const payload = {
      keywords: keywordsInput.split(',').map(k => k.trim())
    };
    
    callAIService('search-intent', payload);
  };

  const handleLocalOptimization = () => {
    const payload = {
      businessInfo: {
        name: 'Ohana Realty',
        address: 'Laredo, TX',
        phone: '(956) 123-4567',
        industry: 'Real Estate'
      },
      targetAreas: [locationInput],
      services: ['Real Estate Sales', 'Property Management', 'Rentals']
    };
    
    callAIService('local-optimization', payload);
  };

  const renderServiceInterface = () => {
    switch (activeService) {
      case 'content-optimization':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Content to Optimize</label>
              <Textarea
                value={contentInput}
                onChange={(e) => setContentInput(e.target.value)}
                placeholder="Enter your content here for AI-powered optimization..."
                rows={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Target Keywords</label>
              <Input
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
                placeholder="homes for sale, real estate, property listings"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Laredo, TX"
              />
            </div>
            <Button onClick={handleOptimizeContent} className="w-full">
              <Bot className="h-4 w-4 mr-2" />
              Optimize Content with AI
            </Button>
          </div>
        );

      case 'keyword-research':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Seed Keywords</label>
              <Input
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
                placeholder="real estate, homes, properties"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Target Location</label>
              <Input
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Laredo, TX"
              />
            </div>
            <Button onClick={handleKeywordResearch} className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Research Keywords with AI
            </Button>
          </div>
        );

      case 'competitor-analysis':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Target Keywords</label>
              <Input
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
                placeholder="real estate laredo, homes for sale"
              />
            </div>
            <Alert>
              <Target className="h-4 w-4" />
              <AlertTitle>Competitor Analysis</AlertTitle>
              <AlertDescription>
                Analyzing against Coldwell Banker, RE/MAX, and Zillow
              </AlertDescription>
            </Alert>
            <Button onClick={handleCompetitorAnalysis} className="w-full">
              <Target className="h-4 w-4 mr-2" />
              Analyze Competitors with AI
            </Button>
          </div>
        );

      case 'seo-audit':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Target Keywords</label>
              <Input
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
                placeholder="real estate, homes for sale, properties"
              />
            </div>
            <Alert>
              <BarChart3 className="h-4 w-4" />
              <AlertTitle>Comprehensive SEO Audit</AlertTitle>
              <AlertDescription>
                Technical, Content, On-page, and Performance analysis
              </AlertDescription>
            </Alert>
            <Button onClick={handleSEOAudit} className="w-full">
              <BarChart3 className="h-4 w-4 mr-2" />
              Audit Website with AI
            </Button>
          </div>
        );

      case 'content-generation':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Keywords for Content</label>
              <Input
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
                placeholder="real estate market, home buying tips"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location Focus</label>
              <Input
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Laredo, TX"
              />
            </div>
            <Button onClick={handleContentGeneration} className="w-full">
              <Bot className="h-4 w-4 mr-2" />
              Generate Content with AI
            </Button>
          </div>
        );

      case 'search-intent':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Keywords to Analyze</label>
              <Input
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
                placeholder="buy home laredo, real estate prices, best neighborhoods"
              />
            </div>
            <Alert>
              <Brain className="h-4 w-4" />
              <AlertTitle>Search Intent Analysis</AlertTitle>
              <AlertDescription>
                Understand user intent and optimize content accordingly
              </AlertDescription>
            </Alert>
            <Button onClick={handleSearchIntent} className="w-full">
              <Brain className="h-4 w-4 mr-2" />
              Analyze Search Intent with AI
            </Button>
          </div>
        );

      case 'local-optimization':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Target Area</label>
              <Input
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Laredo, TX"
              />
            </div>
            <Alert>
              <Globe className="h-4 w-4" />
              <AlertTitle>Local SEO Optimization</AlertTitle>
              <AlertDescription>
                Optimize for local search and Google My Business
              </AlertDescription>
            </Alert>
            <Button onClick={handleLocalOptimization} className="w-full">
              <Globe className="h-4 w-4 mr-2" />
              Optimize Local SEO with AI
            </Button>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <Bot className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Select an AI service to get started</p>
          </div>
        );
    }
  };

  const renderResults = () => {
    if (results.loading) {
      return (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <Bot className="h-8 w-8 animate-spin mr-3" />
              <span>AI is analyzing your request...</span>
            </div>
            <Progress value={60} className="mt-4" />
          </CardContent>
        </Card>
      );
    }

    if (results.error) {
      return (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{results.error}</AlertDescription>
        </Alert>
      );
    }

    if (!results.data) {
      return null;
    }

    // Render different result types based on the service
    switch (activeService) {
      case 'content-optimization':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SEO Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="text-3xl font-bold">{results.data.seoScore}/100</div>
                  <Progress value={results.data.seoScore} className="flex-1" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimization Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.data.suggestions?.map((suggestion: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-yellow-500" />
                      <span className="text-sm">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {results.data.keywordDensity && (
              <Card>
                <CardHeader>
                  <CardTitle>Keyword Density Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {results.data.keywordDensity.map((kd: any, index: number) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{kd.keyword}</span>
                        <Badge variant={kd.density > 3 ? "destructive" : kd.density < 0.5 ? "secondary" : "default"}>
                          {kd.density.toFixed(2)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'keyword-research':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Expanded Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {results.data.expandedKeywords?.slice(0, 20).map((keyword: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 border rounded">
                      <span className="text-sm">{typeof keyword === 'string' ? keyword : keyword.keyword}</span>
                      {typeof keyword === 'object' && (
                        <div className="flex space-x-2">
                          <Badge variant="outline">{keyword.volume}</Badge>
                          <Badge variant={keyword.difficulty > 70 ? "destructive" : "default"}>
                            {keyword.difficulty}
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Long-tail Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {results.data.longTailKeywords?.slice(0, 10).map((keyword: string, index: number) => (
                    <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                      {keyword}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>AI Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(results.data, null, 2)}
              </pre>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI-Powered SEO Services</h1>
        <p className="text-gray-600">
          Leverage artificial intelligence to dominate search rankings and outperform competitors
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>AI Services</CardTitle>
              <CardDescription>Choose an AI-powered SEO service</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {aiServices.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setActiveService(service.id)}
                    className={`w-full text-left p-3 hover:bg-gray-50 border-l-4 transition-colors ${
                      activeService === service.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {service.icon}
                      <div>
                        <div className="font-medium text-sm">{service.name}</div>
                        <div className="text-xs text-gray-500">{service.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Interface */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {aiServices.find(s => s.id === activeService)?.icon}
                <span className="ml-2">
                  {aiServices.find(s => s.id === activeService)?.name}
                </span>
              </CardTitle>
              <CardDescription>
                {aiServices.find(s => s.id === activeService)?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderServiceInterface()}
            </CardContent>
          </Card>

          {/* Results */}
          {renderResults()}
        </div>
      </div>
    </div>
  );
}
