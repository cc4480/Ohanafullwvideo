import { db } from '../db';
import { SQL, sql, eq } from 'drizzle-orm';
import { properties, neighborhoods } from '@shared/schema';

/**
 * QueryBatcher provides methods to optimize database queries by batching
 * related queries together, reducing round trips to the database.
 */
export class QueryBatcher {
  /**
   * Batch loads multiple properties by IDs in a single query
   * @param ids Array of property IDs to fetch
   * @returns Promise resolving to array of properties (in same order as IDs)
   */
  static async batchLoadProperties(ids: number[]) {
    if (!ids.length) return [];
    
    // Use a single query with IN operator instead of multiple individual queries
    const results = await db.select()
      .from(properties)
      .where(sql`${properties.id} IN (${ids.join(',')})`);
    
    // Preserve the original order of IDs in the result
    return ids.map(id => results.find(result => result.id === id) || null);
  }
  
  /**
   * Batch loads multiple neighborhoods by IDs in a single query
   * @param ids Array of neighborhood IDs to fetch
   * @returns Promise resolving to array of neighborhoods (in same order as IDs)
   */
  static async batchLoadNeighborhoods(ids: number[]) {
    if (!ids.length) return [];
    
    // Use a single query with IN operator instead of multiple individual queries
    const results = await db.select()
      .from(neighborhoods)
      .where(sql`${neighborhoods.id} IN (${ids.join(',')})`);
    
    // Preserve the original order of IDs in the result
    return ids.map(id => results.find(result => result.id === id) || null);
  }
  
  /**
   * Optimize a complex join query for properties with their neighborhoods
   * Reduces database load by batching related queries
   * @returns Promise resolving to properties with their neighborhood data included
   */
  static async getPropertiesWithNeighborhoods() {
    // First, fetch all properties efficiently
    const allProperties = await db.select().from(properties);
    
    // Extract unique neighborhood IDs (filtering out nulls)
    const neighborhoodIds = Array.from(
      new Set(
        allProperties
          .map(p => p.neighborhood)
          .filter(n => n !== null) as number[]
      )
    );
    
    // Batch load all needed neighborhoods in a single query
    const neighborhoodMap = neighborhoodIds.length 
      ? (await db.select()
          .from(neighborhoods)
          .where(sql`${neighborhoods.id} IN (${neighborhoodIds.join(',')})`)
        ).reduce((map, n) => {
          map[n.id] = n;
          return map;
        }, {} as Record<number, typeof neighborhoods.$inferSelect>)
      : {};
    
    // Combine the data in memory (avoiding N+1 queries)
    return allProperties.map(property => ({
      ...property,
      neighborhoodData: property.neighborhood ? neighborhoodMap[property.neighborhood] : null
    }));
  }
  
  /**
   * Get properties with efficient pagination and filtering
   * @param options Query options including pagination and filters
   * @returns Promise resolving to paginated and filtered properties
   */
  static async getPaginatedProperties(options: {
    page?: number;
    limit?: number;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    minBeds?: number;
    city?: string;
  }) {
    const {
      page = 1,
      limit = 10,
      type,
      minPrice,
      maxPrice,
      minBeds,
      city
    } = options;
    
    // Calculate offset
    const offset = (page - 1) * limit;
    
    // Build where conditions dynamically
    const whereConditions: SQL[] = [];
    
    if (type) {
      whereConditions.push(sql`${properties.type} = ${type}`);
    }
    
    if (minPrice) {
      whereConditions.push(sql`${properties.price} >= ${minPrice}`);
    }
    
    if (maxPrice) {
      whereConditions.push(sql`${properties.price} <= ${maxPrice}`);
    }
    
    if (minBeds) {
      whereConditions.push(sql`${properties.bedrooms} >= ${minBeds}`);
    }
    
    if (city) {
      whereConditions.push(sql`${properties.city} = ${city}`);
    }
    
    // Combine conditions with AND
    const whereClause = whereConditions.length
      ? sql`WHERE ${sql.join(whereConditions, sql` AND `)}`
      : sql``;
    
    // Execute optimized query with pagination
    // Use a raw query for maximum control and performance
    const query = sql`
      SELECT * FROM properties
      ${whereClause}
      ORDER BY id ASC
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    return db.execute(query);
  }
}

export default QueryBatcher;