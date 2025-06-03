
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface HealthCheck {
  timestamp: string;
  environment: string;
  uptime: number;
  status: string;
  checks: {
    database: boolean;
    videoFiles: boolean;
    staticAssets: boolean;
    apiEndpoints: boolean;
  };
  errors: string[];
}

interface EndpointTest {
  name: string;
  passed: boolean;
  error?: string;
  timestamp: string;
}

interface TestResults {
  totalTests: number;
  passed: number;
  failed: number;
  tests: EndpointTest[];
}

export default function DeploymentReadinessCheck() {
  const [healthStatus, setHealthStatus] = useState<HealthCheck | null>(null);
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [loading, setLoading] = useState(false);

  const runHealthCheck = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/health');
      const health = await response.json();
      setHealthStatus(health);
    } catch (error) {
      console.error('Health check failed:', error);
    }
    setLoading(false);
  };

  const runEndpointTests = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-endpoints');
      const results = await response.json();
      setTestResults(results);
    } catch (error) {
      console.error('Endpoint tests failed:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    runHealthCheck();
    runEndpointTests();
  }, []);

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getOverallStatus = () => {
    if (!healthStatus || !testResults) return 'unknown';
    
    const healthOk = healthStatus.status === 'ok';
    const testsOk = testResults.failed === 0;
    
    if (healthOk && testsOk) return 'ready';
    if (healthStatus.errors.length > 0 || testResults.failed > 0) return 'issues';
    return 'warning';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-500">Ready for Deployment</Badge>;
      case 'issues':
        return <Badge className="bg-red-500">Issues Found</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500">Warnings</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Deployment Readiness Check</h1>
        {getStatusBadge(getOverallStatus())}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>System Health</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={runHealthCheck}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </CardHeader>
          <CardContent>
            {healthStatus ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Database</span>
                  {getStatusIcon(healthStatus.checks.database)}
                </div>
                <div className="flex items-center justify-between">
                  <span>Video Files</span>
                  {getStatusIcon(healthStatus.checks.videoFiles)}
                </div>
                <div className="flex items-center justify-between">
                  <span>Static Assets</span>
                  {getStatusIcon(healthStatus.checks.staticAssets)}
                </div>
                <div className="flex items-center justify-between">
                  <span>Environment</span>
                  <Badge>{healthStatus.environment}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Uptime</span>
                  <span>{Math.round(healthStatus.uptime)}s</span>
                </div>
                {healthStatus.errors.length > 0 && (
                  <div className="mt-4 p-3 bg-red-50 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">Errors:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      {healthStatus.errors.map((error, i) => (
                        <li key={i}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">Loading health status...</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>API Endpoints</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={runEndpointTests}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </CardHeader>
          <CardContent>
            {testResults ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{testResults.passed}</div>
                    <div className="text-sm text-gray-500">Passed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{testResults.failed}</div>
                    <div className="text-sm text-gray-500">Failed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{testResults.totalTests}</div>
                    <div className="text-sm text-gray-500">Total</div>
                  </div>
                </div>
                
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {testResults.tests.map((test, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="truncate flex-1">{test.name}</span>
                      {getStatusIcon(test.passed)}
                    </div>
                  ))}
                </div>
                
                {testResults.tests.some(t => !t.passed) && (
                  <div className="mt-4 p-3 bg-red-50 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">Failed Tests:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      {testResults.tests
                        .filter(t => !t.passed)
                        .map((test, i) => (
                          <li key={i}>• {test.name}: {test.error}</li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">Loading test results...</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deployment Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              {healthStatus?.checks.database ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span>Database connection established</span>
            </div>
            <div className="flex items-center space-x-2">
              {testResults && testResults.failed === 0 ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span>All API endpoints functional</span>
            </div>
            <div className="flex items-center space-x-2">
              {healthStatus?.checks.videoFiles ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span>Video streaming operational</span>
            </div>
            <div className="flex items-center space-x-2">
              {healthStatus?.checks.staticAssets ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span>Static assets available</span>
            </div>
            <div className="flex items-center space-x-2">
              {healthStatus?.environment === 'production' ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-500" />
              )}
              <span>Production environment configured</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
