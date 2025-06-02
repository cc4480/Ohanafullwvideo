
import { db } from '../server/db';
import { properties, users, neighborhoods } from '../shared/schema';

async function waitForDatabase(maxAttempts = 10) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`Database connection attempt ${attempt}/${maxAttempts}...`);
      
      // Simple wake-up query
      await db.execute('SELECT 1 as test');
      console.log('✅ Database connection established');
      return true;
    } catch (error) {
      console.log(`❌ Attempt ${attempt} failed:`, error.message || 'Unknown error');
      
      if (attempt < maxAttempts) {
        const waitTime = Math.min(2000 * attempt, 10000); // Progressive backoff up to 10s
        console.log(`⏳ Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  return false;
}

async function initializeDatabase() {
  try {
    console.log('🚀 Initializing database...');
    
    // Wait for database to be available
    const connected = await waitForDatabase();
    if (!connected) {
      throw new Error('Unable to establish database connection after multiple attempts');
    }
    
    // Check if we have any properties
    console.log('📊 Checking existing data...');
    let propertyCount;
    try {
      const properties_result = await db.select().from(properties);
      propertyCount = properties_result.length;
      console.log(`Current property count: ${propertyCount}`);
    } catch (error) {
      console.log('Table might not exist yet, will be created by migration');
      propertyCount = 0;
    }
    
    if (propertyCount === 0) {
      console.log('📝 No properties found, will be populated by storage initialization...');
    }
    
    console.log('✅ Database initialization complete');
  } catch (error) {
    const errorMessage = error?.message || 'Unknown database error';
    const errorCode = error?.code || 'NO_CODE';
    console.error('❌ Database initialization failed:', {
      message: errorMessage,
      code: errorCode,
      severity: error?.severity || 'UNKNOWN'
    });
    
    // Don't throw error to prevent app crash
    console.log('⚠️  App will continue with mock data if database is unavailable');
  }
}

initializeDatabase().catch(error => {
  console.error('🔥 Critical error in database initialization:', error?.message || 'Unknown error');
});
