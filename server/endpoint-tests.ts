
import { Request, Response } from 'express';
import { storage } from './storage';

export async function testAllEndpoints(req: Request, res: Response) {
  const results = {
    timestamp: new Date().toISOString(),
    totalTests: 0,
    passed: 0,
    failed: 0,
    tests: [] as any[]
  };

  const addTest = (name: string, passed: boolean, error?: string) => {
    results.totalTests++;
    if (passed) results.passed++;
    else results.failed++;
    results.tests.push({ name, passed, error, timestamp: new Date().toISOString() });
  };

  try {
    // Test Properties API
    const properties = await storage.getProperties();
    addTest('GET /api/properties', Array.isArray(properties));

    // Test Featured Properties
    const featured = await storage.getFeaturedProperties(4);
    addTest('GET /api/properties/featured', Array.isArray(featured));

    // Test Neighborhoods API
    const neighborhoods = await storage.getNeighborhoods();
    addTest('GET /api/neighborhoods', Array.isArray(neighborhoods));

    // Test Search with basic filters
    const searchResults = await storage.searchProperties({ minPrice: 100000, maxPrice: 500000 });
    addTest('Property Search API', Array.isArray(searchResults));

    // Test Airbnb Rentals
    const airbnbRentals = await storage.getAirbnbRentals();
    addTest('GET /api/airbnb', Array.isArray(airbnbRentals));

    // Test Featured Airbnb
    const featuredAirbnb = await storage.getFeaturedAirbnbRentals(4);
    addTest('GET /api/airbnb/featured', Array.isArray(featuredAirbnb));

    // Test Messages (empty result is OK)
    const messages = await storage.getMessages();
    addTest('GET /api/messages', Array.isArray(messages));

  } catch (error) {
    addTest('API Endpoints', false, error instanceof Error ? error.message : 'Unknown error');
  }

  // Test specific property if exists
  try {
    const properties = await storage.getProperties();
    if (properties.length > 0) {
      const firstProperty = await storage.getProperty(properties[0].id);
      addTest('GET /api/properties/:id', !!firstProperty);
    }
  } catch (error) {
    addTest('Property Details API', false, error instanceof Error ? error.message : 'Unknown error');
  }

  // Test neighborhood details if exists
  try {
    const neighborhoods = await storage.getNeighborhoods();
    if (neighborhoods.length > 0) {
      const firstNeighborhood = await storage.getNeighborhood(neighborhoods[0].id);
      addTest('GET /api/neighborhoods/:id', !!firstNeighborhood);
    }
  } catch (error) {
    addTest('Neighborhood Details API', false, error instanceof Error ? error.message : 'Unknown error');
  }

  res.json(results);
}
