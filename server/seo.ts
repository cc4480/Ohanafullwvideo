import { Express, Response, Request, NextFunction } from 'express';
import { generateSEOMetaTags, generateStructuredData } from './keyword-optimization';
import { db } from './db';
import { seoKeywords, seoRankings } from '../shared/schema';
import { eq, desc, sql } from 'drizzle-orm';

/**
 * Enhanced SEO Functions
 * Provides advanced SEO capabilities for improved search engine visibility
 */
export function configureSEO(app: Express) {
  // Register SEO middleware
  app.use(seoMiddleware);
  
  // API endpoints for SEO dashboard
  app.get('/api/seo/keywords', async (_req: Request, res: Response) => {
    try {
      const keywords = await db.select().from(seoKeywords).orderBy(desc(seoKeywords.priority));
      res.json(keywords);
    } catch (error) {
      console.error('Error fetching SEO keywords:', error);
      res.status(500).json({ message: 'Failed to fetch SEO keywords' });
    }
  });
  
  app.get('/api/seo/rankings', async (_req: Request, res: Response) => {
    try {
      // Get latest ranking for each keyword with keyword data included
      const rankings = await db.select({
        ranking: seoRankings,
        keyword: seoKeywords
      })
      .from(seoRankings)
      .innerJoin(seoKeywords, eq(seoRankings.keywordId, seoKeywords.id))
      .orderBy(desc(seoRankings.date));
      
      // Group by keyword and return only the latest ranking for each
      const latestRankings = rankings.reduce((acc, curr) => {
        if (!acc[curr.keyword.id] || new Date(acc[curr.keyword.id].ranking.date) < new Date(curr.ranking.date)) {
          acc[curr.keyword.id] = curr;
        }
        return acc;
      }, {} as Record<number, typeof rankings[0]>);
      
      res.json(Object.values(latestRankings));
    } catch (error) {
      console.error('Error fetching SEO rankings:', error);
      res.status(500).json({ message: 'Failed to fetch SEO rankings' });
    }
  });
  
  app.post('/api/seo/rankings', async (req: Request, res: Response) => {
    try {
      const { keywordId, position, url, competitors } = req.body;
      
      // Validate input
      if (!keywordId || typeof position !== 'number' || !url) {
        return res.status(400).json({ message: 'Invalid ranking data' });
      }
      
      // Check if keyword exists
      const [keyword] = await db.select().from(seoKeywords).where(eq(seoKeywords.id, keywordId));
      if (!keyword) {
        return res.status(404).json({ message: 'Keyword not found' });
      }
      
      // Insert new ranking
      const [ranking] = await db.insert(seoRankings).values({
        keywordId,
        position,
        url,
        date: new Date(),
        coldwellPosition: competitors?.coldwell || null,
        remaxPosition: competitors?.remax || null,
        zillowPosition: competitors?.zillow || null,
        truliaPosition: competitors?.trulia || null
      }).returning();
      
      res.status(201).json(ranking);
    } catch (error) {
      console.error('Error adding SEO ranking:', error);
      res.status(500).json({ message: 'Failed to add SEO ranking' });
    }
  });
  
  // Search engine optimization tools and resources
  app.get('/api/seo/insights', async (req: Request, res: Response) => {
    try {
      // Get top performing keywords
      const topKeywords = await db.select({
        keyword: seoKeywords.keyword,
        category: seoKeywords.category,
        avgPosition: sql<number>`avg(${seoRankings.position})`,
        rankingCount: sql<number>`count(${seoRankings.id})`,
        latestPosition: sql<number>`min(${seoRankings.position})`
      })
      .from(seoKeywords)
      .innerJoin(seoRankings, eq(seoRankings.keywordId, seoKeywords.id))
      .groupBy(seoKeywords.id, seoKeywords.keyword, seoKeywords.category)
      .orderBy(sql<number>`min(${seoRankings.position})`);
      
      // Get keywords with position improvements
      const improvingKeywords = await db.select({
        keyword: seoKeywords.keyword,
        category: seoKeywords.category,
        currentPosition: sql<number>`first_value(${seoRankings.position}) over (partition by ${seoKeywords.id} order by ${seoRankings.date} desc)`,
        previousPosition: sql<number>`first_value(${seoRankings.position}) over (partition by ${seoKeywords.id} order by ${seoRankings.date} asc)`
      })
      .from(seoKeywords)
      .innerJoin(seoRankings, eq(seoRankings.keywordId, seoKeywords.id))
      .groupBy(seoKeywords.id, seoKeywords.keyword, seoKeywords.category, seoRankings.position, seoRankings.date)
      .having(sql`first_value(${seoRankings.position}) over (partition by ${seoKeywords.id} order by ${seoRankings.date} desc) < first_value(${seoRankings.position}) over (partition by ${seoKeywords.id} order by ${seoRankings.date} asc)`);
      
      // Potential issues
      const keywordsNeeedingImprovement = await db.select()
      .from(seoKeywords)
      .innerJoin(seoRankings, eq(seoRankings.keywordId, seoKeywords.id))
      .where(sql`${seoRankings.position} > 10`);
      
      res.json({
        topKeywords: topKeywords.slice(0, 10),
        improvingKeywords,
        keywordsNeeedingImprovement: keywordsNeeedingImprovement.slice(0, 10)
      });
    } catch (error) {
      console.error('Error generating SEO insights:', error);
      res.status(500).json({ message: 'Failed to generate SEO insights' });
    }
  });
  
  // Route for sitemap generation
  app.get('/sitemap.xml', (_req: Request, res: Response) => {
    generateSitemap(res);
  });
  
  // Route for robots.txt
  app.get('/robots.txt', (_req: Request, res: Response) => {
    res.type('text/plain');
    res.send(`User-agent: *\nAllow: /\nSitemap: https://ohanarealty.com/sitemap.xml\n`);
  });
}

/**
 * Middleware to inject SEO metadata into the response
 */
function seoMiddleware(req: Request, res: Response, next: NextFunction) {
  // Store original send function
  const originalSend = res.send;
  
  // Override send method to inject SEO data
  res.send = function (body) {
    // Only process HTML responses
    if (typeof body === 'string' && body.includes('<html')) {
      // Determine page type from URL
      const url = req.originalUrl;
      let pageType = 'other';
      let specificData = null;
      
      if (url === '/' || url === '/home') {
        pageType = 'home';
      } else if (url.startsWith('/properties/') && req.app.locals.property) {
        pageType = 'property';
        specificData = req.app.locals.property;
      } else if (url.startsWith('/neighborhoods/') && req.app.locals.neighborhood) {
        pageType = 'neighborhood';
        specificData = req.app.locals.neighborhood;
      } else if (url.startsWith('/rentals/') && req.app.locals.rental) {
        pageType = 'airbnb';
        specificData = req.app.locals.rental;
      }
      
      // Generate SEO metadata
      const seoTags = generateSEOMetaTags(pageType, specificData);
      const structuredData = generateStructuredData(pageType, specificData);
      
      // Inject meta tags
      body = body.replace('</head>', `
        <!-- SEO Meta Tags -->
        <title>${seoTags.title}</title>
        <meta name="description" content="${seoTags.description}">
        <meta name="keywords" content="${seoTags.keywords}">
        <link rel="canonical" href="${seoTags.canonical}">
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="${seoTags.ogUrl}">
        <meta property="og:title" content="${seoTags.ogTitle}">
        <meta property="og:description" content="${seoTags.ogDescription}">
        <meta property="og:image" content="${seoTags.ogImage}">
        
        <!-- Twitter -->
        <meta property="twitter:card" content="${seoTags.twitterCard}">
        <meta property="twitter:url" content="${seoTags.ogUrl}">
        <meta property="twitter:title" content="${seoTags.twitterTitle}">
        <meta property="twitter:description" content="${seoTags.twitterDescription}">
        <meta property="twitter:image" content="${seoTags.twitterImage}">
        
        <!-- Structured Data -->
        <script type="application/ld+json">
          ${JSON.stringify(structuredData)}
        </script>
        </head>
      `);
    }
    
    // Call original send
    return originalSend.call(this, body);
  };
  
  next();
}

/**
 * Generate XML sitemap for search engines
 */
function generateSitemap(res: Response) {
  try {
    // Start XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Static pages
    const staticUrls = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/properties', priority: '0.9', changefreq: 'daily' },
      { url: '/neighborhoods', priority: '0.8', changefreq: 'weekly' },
      { url: '/rentals', priority: '0.8', changefreq: 'daily' },
      { url: '/about', priority: '0.7', changefreq: 'monthly' },
      { url: '/contact', priority: '0.7', changefreq: 'monthly' },
      { url: '/blog', priority: '0.8', changefreq: 'weekly' }
    ];
    
    // Add static URLs
    staticUrls.forEach(page => {
      xml += '  <url>\n';
      xml += `    <loc>https://ohanarealty.com${page.url}</loc>\n`;
      xml += '    <lastmod>' + new Date().toISOString() + '</lastmod>\n';
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n';
    });
    
    // Close XML
    xml += '</urlset>';
    
    // Send response
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
}
