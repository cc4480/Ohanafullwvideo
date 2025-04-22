import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import { useFavorites } from "@/contexts/FavoritesContext";
import PropertyCard from "@/components/properties/PropertyCard";
import { Heart } from "lucide-react";

export default function Favorites() {
  const [isDark, setIsDark] = useState(false);
  const { favorites, favoritedProperties, setFavoritedProperties } = useFavorites();
  
  // Detect dark mode from document class
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    // Check immediately
    checkDarkMode();
    
    // Set up observer to monitor class changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === 'class' &&
          mutation.target === document.documentElement
        ) {
          checkDarkMode();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);
  
  // Fetch all properties
  const { data: properties, isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });
  
  // Filter properties to only show favorites
  useEffect(() => {
    if (properties) {
      const favoriteProps = properties.filter(prop => favorites.includes(prop.id));
      setFavoritedProperties(favoriteProps);
    }
  }, [properties, favorites, setFavoritedProperties]);
  
  return (
    <>
      <Helmet>
        <title>My Favorite Properties | Ohana Realty</title>
        <meta name="description" content="View your favorite properties saved from Ohana Realty's listings. Easily manage and compare your shortlisted properties." />
      </Helmet>
      
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <section className="mb-12">
            <div className="text-center mb-10">
              <h1 className={`font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-800'}`}>
                My Favorite Properties
              </h1>
              <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-300' : 'text-neutral-600'}`}>
                Your saved properties all in one place. Compare and revisit the properties you're most interested in.
              </p>
            </div>
            
            {propertiesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-96 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : favorites.length === 0 ? (
              <div className="py-16 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
                  <Heart className="h-10 w-10 text-slate-400" />
                </div>
                <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-neutral-800'}`}>
                  No Favorite Properties Yet
                </h2>
                <p className={`mb-8 ${isDark ? 'text-slate-300' : 'text-neutral-600'}`}>
                  Start adding properties to your favorites by clicking the heart icon on any property card.
                </p>
                <a 
                  href="/properties" 
                  className="px-6 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                  Browse Properties
                </a>
              </div>
            ) : (
              <>
                <div className="mb-6 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Showing {favoritedProperties.length} favorite {favoritedProperties.length === 1 ? 'property' : 'properties'}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {favoritedProperties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </>
  );
}