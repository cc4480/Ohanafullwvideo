
import { db } from '../server/db';
import { properties } from '../shared/schema';

async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Simple test query to wake up the database
    const testResult = await db.select().from(properties).limit(1);
    console.log('Database is awake and responding');
    
    // Check if we have any properties
    const propertyCount = await db.select().from(properties);
    console.log(`Current property count: ${propertyCount.length}`);
    
    if (propertyCount.length === 0) {
      console.log('No properties found, inserting sample data...');
      
      // Insert a sample property
      await db.insert(properties).values({
        type: 'house',
        address: '123 Sample St',
        city: 'Laredo',
        state: 'TX',
        zipCode: '78045',
        price: 250000,
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1500,
        description: 'Beautiful family home in Laredo',
        featured: true,
        status: 'active'
      });
      
      console.log('Sample property inserted successfully');
    }
    
    console.log('Database initialization complete');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}

initializeDatabase().catch(console.error);
