
import { db } from '../server/db';
import { properties, users, neighborhoods } from '../shared/schema';
import { sql } from 'drizzle-orm';

async function wakeUpDatabase(maxAttempts = 15) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`🔄 Database wake-up attempt ${attempt}/${maxAttempts}...`);
      
      // Multiple wake-up strategies
      await Promise.race([
        db.execute(sql`SELECT 1 as wake_up_test`),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 8000)
        )
      ]);
      
      console.log('✅ Database is awake and responding');
      
      // Verify with a second query to ensure stability
      await db.execute(sql`SELECT version()`);
      console.log('✅ Database connection verified');
      
      return true;
    } catch (error) {
      const errorMsg = error?.message || 'Unknown error';
      console.log(`❌ Attempt ${attempt} failed: ${errorMsg}`);
      
      if (attempt < maxAttempts) {
        const waitTime = Math.min(3000 + (attempt * 1000), 12000);
        console.log(`⏳ Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  return false;
}

async function testTableAccess() {
  try {
    console.log('🔍 Testing table access...');
    const result = await db.select().from(properties).limit(1);
    console.log('✅ Tables are accessible');
    return true;
  } catch (error) {
    console.log('⚠️ Tables may not exist yet, will be created by migration');
    return false;
  }
}

async function initializeDatabase() {
  console.log('🚀 Starting robust database initialization...');
  
  try {
    // Step 1: Wake up the database
    const isAwake = await wakeUpDatabase();
    if (!isAwake) {
      throw new Error('Failed to wake up database after multiple attempts');
    }
    
    // Step 2: Test table access
    const tablesExist = await testTableAccess();
    
    if (tablesExist) {
      console.log('📊 Database and tables are ready');
      console.log('✅ Database initialization complete');
    } else {
      console.log('📝 Database is awake but tables need to be created');
      console.log('ℹ️ Run migrations with: drizzle-kit push');
    }
    
  } catch (error) {
    const errorMessage = error?.message || 'Unknown database error';
    const errorCode = error?.code || 'NO_CODE';
    
    console.error('❌ Database initialization failed:', {
      message: errorMessage,
      code: errorCode,
      severity: error?.severity || 'UNKNOWN'
    });
    
    // Don't crash the app
    console.log('⚠️ App will continue with limited functionality');
    return false;
  }
  
  return true;
}

// Run initialization
initializeDatabase()
  .then(success => {
    if (success) {
      console.log('🎉 Database initialization completed successfully');
    } else {
      console.log('⚠️ Database initialization completed with warnings');
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('🔥 Critical error:', error?.message || 'Unknown error');
    process.exit(1);
  });
