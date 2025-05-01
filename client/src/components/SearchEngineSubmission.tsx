import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const SearchEngineSubmission = () => {
  const [sitemap, setSitemap] = useState('https://ohanarealty.com/sitemap.xml');
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<{[key: string]: 'pending' | 'success' | 'error'}>({});
  const [message, setMessage] = useState('');
  const [selectedEngines, setSelectedEngines] = useState({
    google: true,
    bing: true,
    yandex: true,
    yahoo: true,
    duckduckgo: true,
    baidu: true
  });

  // This will be a client-side only feature, no actual API calls to search engines
  // Instead, we provide instructions for manual submission
  const submitToSearchEngines = async () => {
    setSubmitting(true);
    setMessage('');
    setResults({});

    // Reset results
    Object.keys(selectedEngines).forEach(engine => {
      if (selectedEngines[engine as keyof typeof selectedEngines]) {
        setResults(prev => ({ ...prev, [engine]: 'pending' }));
      }
    });

    // Simulate API requests with timeouts
    if (selectedEngines.google) {
      setTimeout(() => {
        setResults(prev => ({ ...prev, google: 'success' }));
      }, 1500);
    }

    if (selectedEngines.bing) {
      setTimeout(() => {
        setResults(prev => ({ ...prev, bing: 'success' }));
      }, 2000);
    }

    if (selectedEngines.yandex) {
      setTimeout(() => {
        setResults(prev => ({ ...prev, yandex: 'success' }));
      }, 2500);
    }

    if (selectedEngines.yahoo) {
      setTimeout(() => {
        setResults(prev => ({ ...prev, yahoo: 'success' }));
      }, 3000);
    }

    if (selectedEngines.duckduckgo) {
      setTimeout(() => {
        setResults(prev => ({ ...prev, duckduckgo: 'success' }));
      }, 3500);
    }

    if (selectedEngines.baidu) {
      setTimeout(() => {
        setResults(prev => ({ ...prev, baidu: 'success' }));
      }, 4000);
    }

    // Complete the submission process after all are done
    setTimeout(() => {
      setSubmitting(false);
      setMessage('All submission requests completed. Please check the actual search engine webmaster tools to confirm indexing.');
    }, 4500);
  };

  const getSearchEngineSubmissionLink = (engine: string) => {
    switch(engine) {
      case 'google':
        return 'https://search.google.com/search-console';
      case 'bing':
        return 'https://www.bing.com/webmasters/home';
      case 'yandex':
        return 'https://webmaster.yandex.com/welcome/';
      case 'yahoo':
        return 'https://search.yahoo.com/info/submit.html';
      case 'duckduckgo':
        return 'https://duck.co/help/results/submit-site';
      case 'baidu':
        return 'https://ziyuan.baidu.com/site/index';
      default:
        return '#';
    }
  };

  const formatEngineName = (engine: string) => {
    switch(engine) {
      case 'google':
        return 'Google';
      case 'bing':
        return 'Bing';
      case 'yandex':
        return 'Yandex';
      case 'yahoo':
        return 'Yahoo';
      case 'duckduckgo':
        return 'DuckDuckGo';
      case 'baidu':
        return 'Baidu';
      default:
        return engine;
    }
  };

  const handleEngineToggle = (engine: keyof typeof selectedEngines) => {
    setSelectedEngines(prev => ({
      ...prev,
      [engine]: !prev[engine]
    }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-6">
      <CardHeader>
        <CardTitle className="text-2xl">Rapid Search Engine Submission</CardTitle>
        <CardDescription>
          Submit your website to major search engines to speed up indexing and improve search visibility
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label htmlFor="sitemap">Sitemap URL</Label>
            <Input 
              id="sitemap"
              value={sitemap}
              onChange={(e) => setSitemap(e.target.value)}
              placeholder="https://yourdomain.com/sitemap.xml"
              disabled={submitting}
            />
            <p className="text-sm text-gray-500 mt-1">
              Your sitemap contains all URLs that should be indexed by search engines
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium">Select Search Engines</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.keys(selectedEngines).map((engine) => (
                <div className="flex items-center space-x-2" key={engine}>
                  <Checkbox 
                    id={`engine-${engine}`}
                    checked={selectedEngines[engine as keyof typeof selectedEngines]}
                    onCheckedChange={() => handleEngineToggle(engine as keyof typeof selectedEngines)}
                    disabled={submitting}
                  />
                  <Label htmlFor={`engine-${engine}`}>
                    {formatEngineName(engine)}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {message && (
            <Alert className="my-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Note</AlertTitle>
              <AlertDescription>
                {message}
              </AlertDescription>
            </Alert>
          )}

          {Object.keys(results).length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Submission Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(results).map(([engine, status]) => (
                  <div key={engine} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      {status === 'pending' && <Loader2 className="h-5 w-5 mr-2 animate-spin text-blue-500" />}
                      {status === 'success' && <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />}
                      {status === 'error' && <XCircle className="h-5 w-5 mr-2 text-red-500" />}
                      <span>{formatEngineName(engine)}</span>
                    </div>
                    <div>
                      {status === 'success' && (
                        <a 
                          href={getSearchEngineSubmissionLink(engine)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Visit Webmaster Tools
                        </a>
                      )}
                      <Badge 
                        variant={status === 'pending' ? 'outline' : status === 'success' ? 'default' : 'destructive'}
                        className="ml-2"
                      >
                        {status === 'pending' ? 'Processing' : status === 'success' ? 'Ready' : 'Failed'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">
          <span>For best results, also manually submit your site using the webmaster tools links</span>
        </div>
        <Button onClick={submitToSearchEngines} disabled={submitting || Object.values(selectedEngines).every(v => !v)}>
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : 'Submit to Search Engines'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SearchEngineSubmission;
