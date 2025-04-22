import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Property } from '@shared/schema';

// Define the context type
type FavoritesContextType = {
  favorites: number[];
  addFavorite: (propertyId: number) => void;
  removeFavorite: (propertyId: number) => void;
  toggleFavorite: (propertyId: number) => void;
  isFavorite: (propertyId: number) => boolean;
  favoritedProperties: Property[];
  setFavoritedProperties: (properties: Property[]) => void;
};

// Create the context with default values
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Provider component
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [favoritedProperties, setFavoritedProperties] = useState<Property[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('propertyFavorites');
    if (storedFavorites) {
      try {
        const parsedFavorites = JSON.parse(storedFavorites);
        if (Array.isArray(parsedFavorites)) {
          setFavorites(parsedFavorites);
        }
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
        // Reset localStorage if there's an error
        localStorage.setItem('propertyFavorites', JSON.stringify([]));
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('propertyFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Functions to manage favorites
  const addFavorite = (propertyId: number) => {
    if (!favorites.includes(propertyId)) {
      setFavorites([...favorites, propertyId]);
    }
  };

  const removeFavorite = (propertyId: number) => {
    setFavorites(favorites.filter(id => id !== propertyId));
  };

  const toggleFavorite = (propertyId: number) => {
    if (favorites.includes(propertyId)) {
      removeFavorite(propertyId);
    } else {
      addFavorite(propertyId);
    }
  };

  const isFavorite = (propertyId: number) => {
    return favorites.includes(propertyId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        favoritedProperties,
        setFavoritedProperties
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