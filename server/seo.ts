import { Express, Request, Response, NextFunction } from 'express';
import { PRIMARY_KEYWORDS, LONG_TAIL_KEYWORDS, NEIGHBORHOOD_KEYWORDS, COMPETITOR_KEYWORDS, generateSEOMetaTags, generateStructuredData } from './keyword-optimization';
import { db } from './db';
import { seoKeywords, seoRankings } from '@shared/schema';
import { eq } from 'drizzle-orm';

/**
 * Enterprise-Grade SEO Domination System
 * Provides aggressive SEO capabilities designed to outrank major competitors
 * Specifically optimized for Laredo real estate market domination
 * Target competitors: Coldwell Banker, RE/MAX, Zillow, Trulia, and Realtor.com
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
  
  // Generate enhanced robots.txt to outrank competitors
  app.get('/robots.txt', (_req: Request, res: Response) => {
    const robotsTxt = `User-agent: *
Allow: /
Sitemap: https://ohanarealty.com/sitemap.xml

# Prioritize major entry points for crawlers
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: bingbot
Allow: /
Crawl-delay: 1

# Ensure archive pages are indexed to maximize keyword coverage
User-agent: *
Allow: /neighborhoods/*
Allow: /properties/*
Allow: /airbnb/*

# Page importance hints for crawlers
Allow: /neighborhoods/north-laredo
Allow: /neighborhoods/downtown-laredo
Allow: /neighborhoods/san-isidro
Allow: /neighborhoods/del-mar`;
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
 * Generate comprehensive XML sitemap to dominate search rankings
 * Specifically designed to outrank Coldwell Banker, RE/MAX, and Realtor.com
 * in all Laredo-specific real estate search terms
 */
function generateSitemap(res: Response) {
  const baseUrl = 'https://ohanarealty.com';
  
  // Core URLs with aggressive SEO priorities
  const urls = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/properties', priority: 0.9, changefreq: 'daily' },
    { url: '/properties?type=RESIDENTIAL', priority: 0.9, changefreq: 'daily' },
    { url: '/properties?type=COMMERCIAL', priority: 0.9, changefreq: 'daily' },
    { url: '/properties?type=RENTAL', priority: 0.9, changefreq: 'daily' },
    { url: '/neighborhoods', priority: 0.95, changefreq: 'daily' },
    { url: '/neighborhoods/1', priority: 0.9, changefreq: 'daily' }, // North Laredo
    { url: '/neighborhoods/2', priority: 0.9, changefreq: 'daily' }, // Downtown Laredo
    { url: '/neighborhoods/3', priority: 0.9, changefreq: 'daily' }, // San Isidro
    { url: '/airbnb', priority: 0.9, changefreq: 'daily' },
    { url: '/about', priority: 0.8, changefreq: 'weekly' },
    { url: '/contact', priority: 0.8, changefreq: 'weekly' },
    { url: '/blog', priority: 0.9, changefreq: 'daily' },
    
    // Laredo-specific local keywords optimized pages
    { url: '/laredo-real-estate-market', priority: 1.0, changefreq: 'daily' },
    { url: '/luxury-homes-laredo', priority: 0.95, changefreq: 'daily' },
    { url: '/new-construction-laredo', priority: 0.95, changefreq: 'daily' },
    { url: '/laredo-condos', priority: 0.9, changefreq: 'daily' },
    { url: '/laredo-investment-properties', priority: 0.9, changefreq: 'daily' },
    { url: '/laredo-home-values', priority: 0.95, changefreq: 'daily' },
    { url: '/laredo-rentals', priority: 0.9, changefreq: 'daily' },
    { url: '/laredo-property-management', priority: 0.9, changefreq: 'weekly' },
    { url: '/laredo-commercial-properties', priority: 0.9, changefreq: 'weekly' },
    { url: '/laredo-real-estate-schools', priority: 0.8, changefreq: 'weekly' },
    
    // Beat competitor specific pages
    { url: '/laredo-vs-coldwell-banker', priority: 0.8, changefreq: 'weekly' },
    { url: '/laredo-vs-remax', priority: 0.8, changefreq: 'weekly' },
    { url: '/laredo-vs-realtor-com', priority: 0.8, changefreq: 'weekly' },
  ];
  
  // Generate XML content with advanced schema support
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:pagemap="http://www.google.com/schemas/sitemap-pagemap/1.0" xmlns:xhtml="http://www.w3.org/1999/xhtml" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">';
  
  // Add each URL to the sitemap with full schema support
  urls.forEach(item => {
    xml += '<url>';
    xml += `<loc>${baseUrl}${item.url}</loc>`;
    xml += `<priority>${item.priority}</priority>`;
    xml += `<changefreq>${item.changefreq}</changefreq>`;
    xml += `<lastmod>${new Date().toISOString()}</lastmod>`;
    
    // Add mobile crawler support
    xml += '<mobile:mobile/>';
    
    // Add alternate language support for Spanish speakers (important for Laredo)
    xml += `<xhtml:link rel="alternate" hreflang="es" href="${baseUrl}${item.url}?lang=es"/>`;
    xml += `<xhtml:link rel="alternate" hreflang="en" href="${baseUrl}${item.url}"/>`;
    
    xml += '</url>';
  });
  
  xml += '</urlset>';
  
  // Send the XML response with cache control headers
  res.header('Content-Type', 'application/xml');
  res.header('Cache-Control', 'max-age=86400'); // 24 hour cache
  res.send(xml);
}
