import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';

// Types
interface Property {
  id: number;
  address: string;
  city: string;
  price: number;
  images: string[];
  [key: string]: any;
}

/**
 * Hook for managing user favorites
 * @param userId The ID of the current user
 * @returns Object with favorites data and methods to add/remove favorites
 */
export function useFavorites(userId: number | null) {
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Key for caching favorite properties
  const favoritesKey = userId ? ['/api/favorites', userId.toString()] : ['/api/favorites', 'none'];
  
  // Query to fetch user favorites
  const {
    data: favorites = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: favoritesKey,
    queryFn: async () => {
      if (!userId) return [];
      const response = await axios.get(`/api/favorites/${userId}`);
      return response.data;
    },
    enabled: !!userId, // Only run query if userId is provided
  });
  
  // Get favorite IDs for easy checking
  const favoriteIds = favorites.map((prop: Property) => prop.id);
  
  // Mutation to add a property to favorites
  const addToFavorites = useMutation({
    mutationFn: async (propertyId: number) => {
      if (!userId) throw new Error('User ID is required');
      return axios.post('/api/favorites', { userId, propertyId });
    },
    onSuccess: () => {
      // Invalidate favorites cache to trigger refetch
      if (favoritesKey) {
        queryClient.invalidateQueries({ queryKey: favoritesKey });
      }
    },
  });
  
  // Mutation to remove a property from favorites
  const removeFromFavorites = useMutation({
    mutationFn: async (propertyId: number) => {
      if (!userId) throw new Error('User ID is required');
      return axios.delete(`/api/favorites/${userId}/${propertyId}`);
    },
    onSuccess: () => {
      // Invalidate favorites cache to trigger refetch
      if (favoritesKey) {
        queryClient.invalidateQueries({ queryKey: favoritesKey });
      }
    },
  });
  
  // Toggle favorite status
  const toggleFavorite = async (propertyId: number) => {
    if (!userId) {
      console.warn('User must be logged in to manage favorites');
      return;
    }
    
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
  
  // Effect to mark initialization complete
  useEffect(() => {
    if (!isLoading) {
      setIsInitialized(true);
    }
  }, [isLoading]);
  
  return {
    favorites,
    favoriteIds,
    isFavorite,
    toggleFavorite,
    isLoading,
    isError,
    error,
    isInitialized,
  };
}