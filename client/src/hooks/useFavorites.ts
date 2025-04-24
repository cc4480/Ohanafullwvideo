/**
 * @deprecated Use the useFavorites hook from the FavoritesContext instead
 * This file exists only for backward compatibility
 */

import { useFavorites as useFavoritesFromContext } from '../contexts/FavoritesContext';

/**
 * Re-exported useFavorites hook for backward compatibility
 * All components should migrate to using the context version directly
 */
export function useFavorites() {
  // Simply re-export the context-based hook
  return useFavoritesFromContext();
}