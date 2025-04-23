import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { queryClient, apiRequest } from '@/lib/queryClient';

// User type definition
export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: string;
}

// Auth context type definition
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  initialized: boolean;
}

// Register data type
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

// Create the auth context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component that wraps the app and makes auth available
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Effect to check if the user is already logged in when the app loads
  useEffect(() => {
    async function checkAuthStatus() {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        const response = await fetch('/api/auth/me');
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // User not authenticated, but not an error
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to check authentication status:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
        setInitialized(true);
      }
    }

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const response = await apiRequest('POST', '/api/auth/login', { username, password });
      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error('Failed to login'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      await apiRequest('POST', '/api/auth/logout');
      setUser(null);
      // Clear any user data from the cache
      queryClient.removeQueries({ queryKey: ['/api/auth/me'] });
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error('Failed to logout'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const response = await apiRequest('POST', '/api/auth/register', userData);
      const newUser = await response.json();
      setUser(newUser);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error('Failed to register'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (profileData: Partial<User>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const response = await apiRequest('PATCH', '/api/auth/profile', profileData);
      const updatedUser = await response.json();
      setUser(updatedUser);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error('Failed to update profile'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Change password function
  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      await apiRequest('POST', '/api/auth/change-password', {
        currentPassword,
        newPassword
      });
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error('Failed to change password'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Value object for the context provider
  const value = {
    user,
    isLoading,
    isError,
    error,
    login,
    logout,
    register,
    updateProfile,
    changePassword,
    initialized
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook for using the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}