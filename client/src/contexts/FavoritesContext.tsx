import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Property } from '@shared/schema';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Define the context type
type FavoritesContextType = {
  favorites: Property[];
  favoriteIds: number[];
  isFavorite: (propertyId: number) => boolean;
  toggleFavorite: (propertyId: number) => Promise<void>;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
};

// Create the context with default values
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// For demo purposes, we'll use a fixed user ID
// In a real application, this would come from authentication
const DEFAULT_USER_ID = 1;

// Provider component
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const userId = DEFAULT_USER_ID;
  
  // Key for caching favorite properties
  const favoritesKey = ['/api/favorites', userId.toString()];
  
  // Query to fetch user favorites
  const {
    data: favorites = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: favoritesKey,
    queryFn: async () => {
      const response = await axios.get(`/api/favorites/${userId}`);
      return response.data;
    },
  });
  
  // Get favorite IDs for easy checking
  const favoriteIds = favorites.map((prop: Property) => prop.id);
  
  // Mutation to add a property to favorites
  const addToFavorites = useMutation({
    mutationFn: async (propertyId: number) => {
      return axios.post('/api/favorites', { userId, propertyId });
    },
    onSuccess: () => {
      // Invalidate favorites cache to trigger refetch
      queryClient.invalidateQueries({ queryKey: favoritesKey });
    },
  });
  
  // Mutation to remove a property from favorites
  const removeFromFavorites = useMutation({
    mutationFn: async (propertyId: number) => {
      return axios.delete(`/api/favorites/${userId}/${propertyId}`);
    },
    onSuccess: () => {
      // Invalidate favorites cache to trigger refetch
      queryClient.invalidateQueries({ queryKey: favoritesKey });
    },
  });
  
  // Toggle favorite status
  const toggleFavorite = async (propertyId: number) => {
    try {
      if (isFavorite(propertyId)) {
        await removeFromFavorites.mutateAsync(propertyId);
      } else {
        await addToFavorites.mutateAsync(propertyId);
      }
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    }
  };
  
  // Check if a property is in favorites
  const isFavorite = (propertyId: number): boolean => {
    return favoriteIds.includes(propertyId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteIds,
        isFavorite,
        toggleFavorite,
        isLoading,
        isError,
        error
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

// Custom hook to use the favorites context
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}