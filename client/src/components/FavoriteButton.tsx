import { useState } from 'react';
import { Heart, HeartOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';

interface FavoriteButtonProps {
  propertyId: number;
  isFavorite: boolean;
  onToggle: (propertyId: number) => void;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost';
  showText?: boolean;
  className?: string;
  disabled?: boolean;
  loginRequired?: boolean;
  onLoginClick?: () => void;
}

/**
 * Reusable favorite button component for toggling property favorite status
 */
export default function FavoriteButton({
  propertyId,
  isFavorite,
  onToggle,
  size = 'default',
  variant = 'outline',
  showText = true,
  className = '',
  disabled = false,
  loginRequired = true,
  onLoginClick,
}: FavoriteButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Handle click with animation
  const handleClick = () => {
    if (loginRequired && onLoginClick) {
      onLoginClick();
      return;
    }
    
    // Trigger animation
    setIsAnimating(true);
    
    // Wait for animation then call toggle
    setTimeout(() => {
      onToggle(propertyId);
      setIsAnimating(false);
    }, 250);
  };
  
  // Determine icon size based on button size
  const iconSize = (()=> {
    switch(size) {
      case 'sm': return 16;
      case 'lg': return 24;
      case 'icon': return 20;
      default: return 20; // default size
    }
  })();
  
  // Determine labels
  const tooltipText = isFavorite ? 'Remove from favorites' : 'Add to favorites';
  const buttonText = isFavorite ? 'Saved' : 'Save';
  
  return (
    <Tooltip content={tooltipText}>
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        className={`favorite-button ${isAnimating ? 'animate-pulse' : ''} ${className}`}
        disabled={disabled}
        aria-label={tooltipText}
      >
        {isFavorite ? (
          <Heart className="text-red-500 mr-1" size={iconSize} fill="currentColor" />
        ) : (
          <Heart className="mr-1" size={iconSize} />
        )}
        {showText && <span>{buttonText}</span>}
      </Button>
    </Tooltip>
  );
}