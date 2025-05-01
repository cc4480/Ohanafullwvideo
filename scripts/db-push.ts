import { db } from '../server/db';
import { seoKeywords } from '../shared/schema';
import { PRIMARY_KEYWORDS, LONG_TAIL_KEYWORDS, NEIGHBORHOOD_KEYWORDS, COMPETITOR_KEYWORDS } from '../server/keyword-optimization';

// This script initializes the SEO database tables with keywords from keyword-optimization.ts
async function main() {
  console.log('Pushing SEO keywords to database...');
  
  try {
    // Insert primary keywords
    console.log('Adding primary keywords...');
    for (const keyword of PRIMARY_KEYWORDS) {
      await db.insert(seoKeywords).values({
        keyword,
        category: 'primary',
        searchVolume: Math.floor(Math.random() * 2000) + 500, // Random value for demo
        difficultyScore: Math.floor(Math.random() * 50) + 40, // Random difficulty 40-90
        priority: 10, // Highest priority
      }).onConflictDoUpdate({
        target: seoKeywords.keyword,
        set: { priority: 10 },
      });
    }
    
    // Insert long-tail keywords
    console.log('Adding long-tail keywords...');
    for (const keyword of LONG_TAIL_KEYWORDS) {
      await db.insert(seoKeywords).values({
        keyword,
        category: 'long-tail',
        searchVolume: Math.floor(Math.random() * 300) + 100, // Less search volume for long-tail
        difficultyScore: Math.floor(Math.random() * 30) + 30, // Usually easier to rank for
        priority: 8,
      }).onConflictDoUpdate({
        target: seoKeywords.keyword,
        set: { priority: 8 },
      });
    }
    
    // Insert neighborhood keywords
    console.log('Adding neighborhood keywords...');
    for (const keyword of NEIGHBORHOOD_KEYWORDS) {
      await db.insert(seoKeywords).values({
        keyword,
        category: 'neighborhood',
        searchVolume: Math.floor(Math.random() * 200) + 50,
        difficultyScore: Math.floor(Math.random() * 20) + 30,
        priority: 7,
      }).onConflictDoUpdate({
        target: seoKeywords.keyword,
        set: { priority: 7 },
      });
    }
    
    // Insert competitor keywords
    console.log('Adding competitor keywords...');
    for (const keyword of COMPETITOR_KEYWORDS) {
      await db.insert(seoKeywords).values({
        keyword,
        category: 'competitor',
        searchVolume: Math.floor(Math.random() * 100) + 30,
        difficultyScore: Math.floor(Math.random() * 20) + 50,
        priority: 9,
      }).onConflictDoUpdate({
        target: seoKeywords.keyword,
        set: { priority: 9 },
      });
    }
    
    console.log('All SEO keywords added successfully!');
  } catch (error) {
    console.error('Error initializing SEO keywords:', error);
  }
}

main().catch(e => {
  console.error('Error in db-push script:', e);
  process.exit(1);
}).finally(() => {
  process.exit(0);
});
