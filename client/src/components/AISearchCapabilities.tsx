
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Brain, 
  Zap, 
  Globe, 
  Target, 
  TrendingUp,
  MessageSquare,
  Eye,
  Clock
} from 'lucide-react';

interface SearchCapability {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  endpoint: string;
}

export default function AISearchCapabilities() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCapability, setActiveCapability] = useState('semantic-search');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const searchCapabilities: SearchCapability[] = [
    {
      id: 'semantic-search',
      name: 'Semantic Search',
      description: 'Understanding search intent beyond keywords',
      icon: <Brain className="h-5 w-5" />,
      features: [
        'Natural language understanding',
        'Intent recognition',
        'Context-aware results',
        'Synonym matching'
      ],
      endpoint: '/api/ai-search/semantic'
    },
    {
      id: 'voice-search',
      name: 'Voice Search Optimization',
      description: 'Optimized for voice and conversational queries',
      icon: <MessageSquare className="h-5 w-5" />,
      features: [
        'Question-based queries',
        'Conversational responses',
        'Local voice search',
        'Featured snippets'
      ],
      endpoint: '/api/ai-search/voice'
    },
    {
      id: 'visual-search',
      name: 'Visual Search',
      description: 'Search using images and visual content',
      icon: <Eye className="h-5 w-5" />,
      features: [
        'Image recognition',
        'Property visual matching',
        'Style-based search',
        'Floor plan analysis'
      ],
      endpoint: '/api/ai-search/visual'
    },
    {
      id: 'predictive-search',
      name: 'Predictive Search',
      description: 'Anticipating user needs and market trends',
      icon: <TrendingUp className="h-5 w-5" />,
      features: [
        'Search suggestions',
        'Trend prediction',
        'Market forecasting',
        'User behavior analysis'
      ],
      endpoint: '/api/ai-search/predictive'
    },
    {
      id: 'real-time-search',
      name: 'Real-time Search',
      description: 'Live search with instant results',
      icon: <Zap className="h-5 w-5" />,
      features: [
        'Instant suggestions',
        'Live property updates',
        'Market changes',
        'Price fluctuations'
      ],
      endpoint: '/api/ai-search/realtime'
    },
    {
      id: 'local-search',
      name: 'Hyper-Local Search',
      description: 'Location-specific search optimization',
      icon: <Globe className="h-5 w-5" />,
      features: [
        'Neighborhood-specific',
        'Local amenities',
        'School districts',
        'Community insights'
      ],
      endpoint: '/api/ai-search/local'
    },
    {
      id: 'personalized-search',
      name: 'Personalized Search',
      description: 'Customized results based on user preferences',
      icon: <Target className="h-5 w-5" />,
      features: [
        'User preference learning',
        'Behavioral analysis',
        'Custom recommendations',
        'Saved searches'
      ],
      endpoint: '/api/ai-search/personalized'
    },
    {
      id: 'contextual-search',
      name: 'Contextual Search',
      description: 'Search that understands current context',
      icon: <Clock className="h-5 w-5" />,
      features: [
        'Time-sensitive results',
        'Market context',
        'Seasonal trends',
        'Event-based search'
      ],
      endpoint: '/api/ai-search/contextual'
    }
  ];

  const performAISearch = async (capability: string, query: string) => {
    setIsSearching(true);
    setSearchResults(null);

    try {
      const capabilityConfig = searchCapabilities.find(c => c.id === capability);
      if (!capabilityConfig) return;

      // Simulate different search capabilities
      const mockResults = generateMockResults(capability, query);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error('AI Search Error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const generateMockResults = (capability: string, query: string) => {
    const baseResults = {
      query,
      capability,
      timestamp: new Date().toISOString(),
      processingTime: Math.random() * 200 + 50 // 50-250ms
    };

    switch (capability) {
      case 'semantic-search':
        return {
          ...baseResults,
          intent: 'property_search',
          entities: ['homes', 'laredo', 'real estate'],
          semanticMatches: [
            'Properties for sale in Laredo',
            'Real estate listings Laredo TX',
            'Houses available in Laredo',
            'Residential properties Laredo'
          ],
          confidence: 0.92,
          suggestions: [
            'Homes for sale in North Laredo',
            'Luxury properties in Laredo',
            'Affordable houses in Laredo'
          ]
        };

      case 'voice-search':
        return {
          ...baseResults,
          questionType: 'where_can_i_find',
          conversationalResponse: `Based on your query "${query}", I found several homes for sale in Laredo. Would you like me to show you properties in a specific neighborhood?`,
          featuredSnippet: 'Laredo has over 500 homes currently for sale, with prices ranging from $80,000 to $800,000.',
          followUpQuestions: [
            'What is your budget range?',
            'Which neighborhoods interest you?',
            'Do you need specific amenities?'
          ]
        };

      case 'visual-search':
        return {
          ...baseResults,
          visualElements: ['modern architecture', 'two-story', 'brick exterior'],
          similarProperties: [
            { id: 1, similarity: 0.89, address: '123 Main St' },
            { id: 2, similarity: 0.84, address: '456 Oak Ave' },
            { id: 3, similarity: 0.82, address: '789 Pine Rd' }
          ],
          styleMatches: ['Contemporary', 'Traditional', 'Ranch'],
          colorScheme: ['earth tones', 'neutral colors']
        };

      case 'predictive-search':
        return {
          ...baseResults,
          predictions: [
            'Real estate prices may increase 5% next quarter',
            'High demand expected for 3-bedroom homes',
            'North Laredo showing strong growth potential'
          ],
          trendingSearches: [
            'new construction laredo',
            'investment properties texas',
            'first time homebuyer programs'
          ],
          marketForecast: {
            priceDirection: 'up',
            confidence: 0.78,
            timeline: '3-6 months'
          }
        };

      case 'real-time-search':
        return {
          ...baseResults,
          liveUpdates: [
            'New listing added 5 minutes ago',
            'Price reduced on 3 properties today',
            '2 properties went under contract this hour'
          ],
          marketPulse: {
            activity: 'high',
            newListings: 12,
            priceChanges: 5,
            soldToday: 3
          },
          instantAlerts: [
            'Match found for your saved search',
            'Property you viewed had price update'
          ]
        };

      case 'local-search':
        return {
          ...baseResults,
          localContext: {
            neighborhood: 'North Laredo',
            walkScore: 67,
            schoolRating: 8.5,
            crimeIndex: 'low'
          },
          nearbyAmenities: [
            'Mall del Norte - 2.1 miles',
            'Laredo Community College - 3.4 miles',
            'Rio Grande River - 4.8 miles'
          ],
          localInsights: [
            'Popular with young families',
            'Growing tech sector nearby',
            'New shopping center planned'
          ]
        };

      case 'personalized-search':
        return {
          ...baseResults,
          userProfile: {
            preferences: ['3+ bedrooms', 'garage', 'good schools'],
            budget: '$200k-$350k',
            timeline: 'next 6 months'
          },
          personalizedResults: [
            { match: 0.95, reason: 'Meets all your criteria' },
            { match: 0.89, reason: 'Great schools nearby' },
            { match: 0.84, reason: 'Within your budget' }
          ],
          recommendations: [
            'Consider homes in Del Mar area',
            'Properties with recent renovations',
            'Look at homes with solar panels'
          ]
        };

      case 'contextual-search':
        return {
          ...baseResults,
          context: {
            season: 'spring',
            marketCondition: 'buyer_favorable',
            economicIndicators: 'stable'
          },
          seasonalFactors: [
            'Spring is peak home buying season',
            'More inventory typically available',
            'Schools ending helps with moves'
          ],
          timingAdvice: [
            'Good time to make offers',
            'Interest rates are competitive',
            'Consider closing before summer'
          ]
        };

      default:
        return baseResults;
    }
  };

  const renderSearchInterface = () => {
    const currentCapability = searchCapabilities.find(c => c.id === activeCapability);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          {currentCapability?.icon}
          <span>Using {currentCapability?.name}</span>
        </div>
        
        <div className="flex space-x-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={getPlaceholderForCapability(activeCapability)}
            className="flex-1"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                performAISearch(activeCapability, searchQuery);
              }
            }}
          />
          <Button 
            onClick={() => performAISearch(activeCapability, searchQuery)}
            disabled={!searchQuery.trim() || isSearching}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {currentCapability?.features.map((feature, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  const getPlaceholderForCapability = (capability: string) => {
    const placeholders = {
      'semantic-search': 'Find me a cozy home near good schools...',
      'voice-search': 'Where can I find affordable homes in Laredo?',
      'visual-search': 'Upload an image or describe the style you want...',
      'predictive-search': 'What will home prices be like next year?',
      'real-time-search': 'Show me new listings today...',
      'local-search': 'Best neighborhoods for families in Laredo',
      'personalized-search': 'Homes perfect for me...',
      'contextual-search': 'Should I buy now or wait?'
    };
    
    return placeholders[capability] || 'Enter your search query...';
  };

  const renderSearchResults = () => {
    if (isSearching) {
      return (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <Brain className="h-8 w-8 animate-pulse mr-3 text-blue-500" />
              <span>AI is processing your search...</span>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (!searchResults) return null;

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Search Results</span>
              <Badge variant="outline">
                {searchResults.processingTime?.toFixed(0)}ms
              </Badge>
            </CardTitle>
            <CardDescription>
              Query: "{searchResults.query}" using {searchResults.capability}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                {renderCapabilitySpecificResults()}
              </TabsContent>
              
              <TabsContent value="details" className="space-y-4">
                <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
                  {JSON.stringify(searchResults, null, 2)}
                </pre>
              </TabsContent>
              
              <TabsContent value="insights" className="space-y-4">
                {renderSearchInsights()}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCapabilitySpecificResults = () => {
    switch (activeCapability) {
      case 'semantic-search':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Detected Intent</h4>
              <Badge>{searchResults.intent}</Badge>
              <span className="ml-2 text-sm text-gray-600">
                Confidence: {(searchResults.confidence * 100).toFixed(0)}%
              </span>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Semantic Matches</h4>
              <ul className="space-y-1">
                {searchResults.semanticMatches?.map((match: string, index: number) => (
                  <li key={index} className="text-sm p-2 bg-blue-50 rounded">
                    {match}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'voice-search':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Conversational Response</h4>
              <p className="text-sm bg-green-50 p-3 rounded">
                {searchResults.conversationalResponse}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Follow-up Questions</h4>
              <ul className="space-y-1">
                {searchResults.followUpQuestions?.map((question: string, index: number) => (
                  <li key={index} className="text-sm">
                    <MessageSquare className="h-3 w-3 inline mr-1" />
                    {question}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'predictive-search':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Market Predictions</h4>
              <ul className="space-y-2">
                {searchResults.predictions?.map((prediction: string, index: number) => (
                  <li key={index} className="text-sm p-2 bg-yellow-50 rounded flex items-start">
                    <TrendingUp className="h-4 w-4 mr-2 mt-0.5 text-yellow-600" />
                    {prediction}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Trending Searches</h4>
              <div className="flex flex-wrap gap-2">
                {searchResults.trendingSearches?.map((trend: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {trend}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <h4 className="font-medium mb-2">Results Overview</h4>
            <p className="text-sm text-gray-600">
              AI search completed successfully with {Object.keys(searchResults).length} data points.
            </p>
          </div>
        );
    }
  };

  const renderSearchInsights = () => {
    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Search Performance</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Processing Time:</span>
              <span className="ml-2 font-medium">
                {searchResults.processingTime?.toFixed(0)}ms
              </span>
            </div>
            <div>
              <span className="text-gray-600">Capability:</span>
              <span className="ml-2 font-medium">{searchResults.capability}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">AI Analysis</h4>
          <p className="text-sm text-gray-600">
            The AI successfully processed your query using {activeCapability} technology,
            analyzing context, intent, and providing relevant results tailored to your needs.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Search Capabilities</h1>
        <p className="text-gray-600">
          Experience next-generation search powered by artificial intelligence
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Capability Selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Search Types</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {searchCapabilities.map((capability) => (
                  <button
                    key={capability.id}
                    onClick={() => setActiveCapability(capability.id)}
                    className={`w-full text-left p-3 hover:bg-gray-50 border-l-4 transition-colors ${
                      activeCapability === capability.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {capability.icon}
                      <div>
                        <div className="font-medium text-sm">{capability.name}</div>
                        <div className="text-xs text-gray-500">{capability.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Interface and Results */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {searchCapabilities.find(c => c.id === activeCapability)?.icon}
                <span className="ml-2">
                  {searchCapabilities.find(c => c.id === activeCapability)?.name}
                </span>
              </CardTitle>
              <CardDescription>
                {searchCapabilities.find(c => c.id === activeCapability)?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderSearchInterface()}
            </CardContent>
          </Card>

          {renderSearchResults()}
        </div>
      </div>
    </div>
  );
}
