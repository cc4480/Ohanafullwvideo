import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import { User, LoginUser, insertUserSchema } from '@shared/schema';

// Add session interface to express Request
declare module 'express-session' {
  interface SessionData {
    user: {
      id: number;
      username: string;
      email: string;
      firstName?: string;
      lastName?: string;
      role: string;
    };
  }
}

declare module 'express' {
  interface Request {
    session: {
      user?: {
        id: number;
        username: string;
        email: string;
        firstName?: string;
        lastName?: string;
        role: string;
      };
      cookie: {
        maxAge: number;
      };
      destroy: (callback: (err: Error) => void) => void;
    };
  }
}

// Constants
const SALT_ROUNDS = 10;
const SESSION_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Create a new user account with hashed password
 */
export async function createUser(userData: any): Promise<User> {
  // Validate user data
  const result = insertUserSchema.safeParse({
    ...userData,
    createdAt: new Date().toISOString()
  });
  
  if (!result.success) {
    throw new Error(`Invalid user data: ${result.error.message}`);
  }
  
  // Hash the password
  const hashedPassword = await hashPassword(result.data.password);
  
  // Create the user with hashed password
  return storage.createUser({
    ...result.data,
    password: hashedPassword
  });
}

/**
 * Authenticate a user by username and password
 */
export async function authenticateUser(credentials: LoginUser): Promise<User | null> {
  // Find the user by username
  const user = await storage.getUserByUsername(credentials.username);
  
  if (!user) {
    return null;
  }
  
  // Verify the password
  const isPasswordValid = await verifyPassword(credentials.password, user.password);
  
  if (!isPasswordValid) {
    return null;
  }
  
  // Update last login timestamp
  await storage.updateUserLastLogin(user.id, new Date().toISOString());
  
  return user;
}

/**
 * Middleware to check if a user is authenticated
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  next();
}

/**
 * Middleware to check if a user has admin role
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  next();
}

/**
 * Get the current authenticated user from session
 */
export async function getCurrentUser(req: Request): Promise<User | null> {
  if (!req.session || !req.session.user) {
    return null;
  }
  
  const user = await storage.getUser(req.session.user.id);
  return user || null;
}

/**
 * Helper to create a session for a user
 */
export function createUserSession(req: Request, user: User) {
  // Create a safe user object without sensitive data
  const safeUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.firstName || undefined,
    lastName: user.lastName || undefined,
    role: user.role
  };
  
  // Set user in session
  req.session.user = safeUser;
  
  // Configure session to expire after a set period
  req.session.cookie.maxAge = SESSION_MAX_AGE;
}

/**
 * Clear user session
 */
export function clearUserSession(req: Request) {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
  });
}