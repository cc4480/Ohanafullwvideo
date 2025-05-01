import { Express, Request, Response, NextFunction } from 'express';
import { PRIMARY_KEYWORDS, LONG_TAIL_KEYWORDS, NEIGHBORHOOD_KEYWORDS, COMPETITOR_KEYWORDS, generateSEOMetaTags, generateStructuredData } from './keyword-optimization';
import { db } from './db';
import { seoKeywords, seoRankings } from '@shared/schema';
import { eq } from 'drizzle-orm';

/**
 * Enhanced SEO Functions
 * Provides advanced SEO capabilities for improved search engine visibility
 */
export function configureSEO(app: Express) {
  // Add SEO middleware to inject metadata based on route path
  app.use(seoMiddleware);
  
  // SEO API Routes
  // These routes provide SEO data for the dashboard
  
  // Return tracked keywords
  app.get('/api/seo/keywords', async (_req: Request, res: Response) => {
    try {
      // Get keywords from database
      const keywords = await db.select().from(seoKeywords);
      res.json(keywords);
    } catch (error) {
      console.error('Error fetching SEO keywords:', error);
      res.status(500).json({ error: 'Unable to fetch SEO keywords' });
    }
  });
  
  // Return keyword rankings
  app.get('/api/seo/rankings', async (_req: Request, res: Response) => {
    try {
      // Get rankings with keyword data included
      const rankings = await db.select()
        .from(seoRankings)
        .innerJoin(seoKeywords, eq(seoRankings.keywordId, seoKeywords.id));
        
      // Format the response with nested objects
      const formattedRankings = rankings.map(row => ({
        ranking: {
          id: row.seo_rankings.id,
          keywordId: row.seo_rankings.keywordId,
          position: row.seo_rankings.position,
          date: row.seo_rankings.date,
          url: row.seo_rankings.url,
          coldwellPosition: row.seo_rankings.coldwellPosition,
          remaxPosition: row.seo_rankings.remaxPosition,
          zillowPosition: row.seo_rankings.zillowPosition,
          truliaPosition: row.seo_rankings.truliaPosition
        },
        keyword: {
          id: row.seo_keywords.id,
          keyword: row.seo_keywords.keyword,
          category: row.seo_keywords.category,
          searchVolume: row.seo_keywords.searchVolume,
          difficultyScore: row.seo_keywords.difficultyScore,
          priority: row.seo_keywords.priority,
          createdAt: row.seo_keywords.createdAt,
          updatedAt: row.seo_keywords.updatedAt
        }
      }));
      
      res.json(formattedRankings);
    } catch (error) {
      console.error('Error fetching SEO rankings:', error);
      res.status(500).json({ error: 'Unable to fetch SEO rankings' });
    }
  });
  
  // Update ranking data
  app.post('/api/seo/rankings', async (req: Request, res: Response) => {
    try {
      const { keywordId, position, url, competitors } = req.body;
      
      if (!keywordId || !position || !url) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // Insert new ranking
      const [ranking] = await db.insert(seoRankings)
        .values({
          keywordId,
          position,
          date: new Date(),
          url,
          coldwellPosition: competitors?.coldwell || null,
          remaxPosition: competitors?.remax || null,
          zillowPosition: competitors?.zillow || null,
          truliaPosition: competitors?.trulia || null
        })
        .returning();
      
      res.json(ranking);
    } catch (error) {
      console.error('Error updating SEO ranking:', error);
      res.status(500).json({ error: 'Unable to update SEO ranking' });
    }
  });
  
  // Get SEO insights based on stored data
  app.get('/api/seo/insights', async (req: Request, res: Response) => {
    try {
      // Get the most recent ranking for each keyword
      const rankings = await db.select()
        .from(seoRankings)
        .innerJoin(seoKeywords, eq(seoRankings.keywordId, seoKeywords.id))
        .orderBy(seoRankings.date);
        
      // Compute insights based on the rankings
      const insights = {
        totalKeywords: await db.select().from(seoKeywords).then(rows => rows.length),
        keywordsInTop10: rankings.filter(r => r.seo_rankings.position <= 10).length,
        keywordsInTop3: rankings.filter(r => r.seo_rankings.position <= 3).length,
        competitorInsights: {
          aheadOfColdwell: rankings.filter(r => r.seo_rankings.position < (r.seo_rankings.coldwellPosition || 100)).length,
          aheadOfRemax: rankings.filter(r => r.seo_rankings.position < (r.seo_rankings.remaxPosition || 100)).length,
          aheadOfZillow: rankings.filter(r => r.seo_rankings.position < (r.seo_rankings.zillowPosition || 100)).length,
          aheadOfTrulia: rankings.filter(r => r.seo_rankings.position < (r.seo_rankings.truliaPosition || 100)).length,
        },
        categoryDistribution: {
          primary: rankings.filter(r => r.seo_keywords.category === 'primary').length,
          longTail: rankings.filter(r => r.seo_keywords.category === 'long-tail').length,
          neighborhood: rankings.filter(r => r.seo_keywords.category === 'neighborhood').length,
          competitor: rankings.filter(r => r.seo_keywords.category === 'competitor').length,
        },
        rankingTrends: {
          // This would normally include historical data and trends
          // For now, just returning a stub
          improved: 12,
          decreased: 3,
          unchanged: 7
        },
        opportunities: rankings
          .filter(r => r.seo_rankings.position > 10 && r.seo_rankings.position <= 20)
          .map(r => ({
            keyword: r.seo_keywords.keyword,
            position: r.seo_rankings.position,
            searchVolume: r.seo_keywords.searchVolume,
            difficultyScore: r.seo_keywords.difficultyScore
          }))
      };
      
      res.json(insights);
    } catch (error) {
      console.error('Error generating SEO insights:', error);
      res.status(500).json({ error: 'Unable to generate SEO insights' });
    }
  });
  
  // Generate sitemap.xml for search engines
  app.get('/sitemap.xml', (_req: Request, res: Response) => {
    generateSitemap(res);
  });
  
  // Generate robots.txt for web crawlers
  app.get('/robots.txt', (_req: Request, res: Response) => {
    const robotsTxt = `User-agent: *
Allow: /
Sitemap: https://ohanarealty.com/sitemap.xml`;
    res.type('text/plain').send(robotsTxt);
  });
}

/**
 * Middleware to inject SEO metadata into the response
 */
function seoMiddleware(req: Request, res: Response, next: NextFunction) {
  // Original render method
  const originalRender = res.render;
  
  // Override the render method to inject SEO data
  res.render = function(view: string, options?: any, callback?: (err: Error, html: string) => void): void {
    // Determine the page type based on the URL path
    const path = req.path;
    let pageType = 'home';
    let specificData = null;
    
    if (path === '/') {
      pageType = 'home';
    } else if (path.startsWith('/properties/') && path.length > 12) {
      pageType = 'property';
      // In a real implementation, fetch property data from the database
      specificData = options?.property || null;
    } else if (path.startsWith('/properties')) {
      pageType = 'properties';
    } else if (path.startsWith('/neighborhoods/') && path.length > 15) {
      pageType = 'neighborhood';
      specificData = options?.neighborhood || null;
    } else if (path.startsWith('/neighborhoods')) {
      pageType = 'neighborhoods';
    } else if (path.startsWith('/airbnb/') && path.length > 8) {
      pageType = 'airbnb';
      specificData = options?.rental || null;
    } else if (path.startsWith('/airbnb')) {
      pageType = 'airbnbs';
    } else if (path.startsWith('/blog/') && path.length > 6) {
      pageType = 'blog';
      specificData = options?.blogPost || null;
    } else if (path.startsWith('/blog')) {
      pageType = 'blog';
    } else if (path.startsWith('/about')) {
      pageType = 'about';
    } else if (path.startsWith('/contact')) {
      pageType = 'contact';
    }
    
    // Generate SEO metadata
    const seoMetaTags = generateSEOMetaTags(pageType, specificData);
    const structuredData = generateStructuredData(pageType, specificData);
    
    // Inject SEO data into the response
    options = options || {};
    options.seo = seoMetaTags;
    options.structuredData = JSON.stringify(structuredData);
    
    // Call the original render method
    originalRender.call(this, view, options, callback);
  };
  
  next();
}

/**
 * Generate XML sitemap for search engines
 */
function generateSitemap(res: Response) {
  const baseUrl = 'https://ohanarealty.com';
  
  // List of all public URLs in the sitemap
  const urls = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/properties', priority: 0.9, changefreq: 'daily' },
    { url: '/neighborhoods', priority: 0.9, changefreq: 'weekly' },
    { url: '/airbnb', priority: 0.9, changefreq: 'daily' },
    { url: '/about', priority: 0.7, changefreq: 'monthly' },
    { url: '/contact', priority: 0.7, changefreq: 'monthly' },
    { url: '/blog', priority: 0.8, changefreq: 'weekly' },
    // In a real implementation, fetch dynamic URLs from the database
  ];
  
  // Generate XML content
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  
  // Add each URL to the sitemap
  urls.forEach(item => {
    xml += '<url>';
    xml += `<loc>${baseUrl}${item.url}</loc>`;
    xml += `<priority>${item.priority}</priority>`;
    xml += `<changefreq>${item.changefreq}</changefreq>`;
    xml += `<lastmod>${new Date().toISOString()}</lastmod>`;
    xml += '</url>';
  });
  
  xml += '</urlset>';
  
  // Send the XML response
  res.header('Content-Type', 'application/xml');
  res.send(xml);
}
