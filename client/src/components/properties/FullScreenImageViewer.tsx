import { useState, useEffect, useCallback } from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogTitle,
  DialogDescription
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface FullScreenImageViewerProps {
  images: string[];
  initialImageIndex: number;
  isOpen: boolean;
  onClose: () => void;
  propertyAddress: string;
}

export default function FullScreenImageViewer({
  images,
  initialImageIndex,
  isOpen,
  onClose,
  propertyAddress,
}: FullScreenImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(initialImageIndex);

  // Reset to the initial image when the viewer is opened
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialImageIndex);
    }
  }, [initialImageIndex, isOpen]);

  const navigateNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const navigatePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);
  
  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    
    if (e.key === 'ArrowLeft') {
      navigatePrevious();
    } else if (e.key === 'ArrowRight') {
      navigateNext();
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [isOpen, onClose, navigatePrevious, navigateNext]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Enhanced full screen mode with proper controls and navigation
  // Added touch-friendly features for mobile users
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="max-w-none w-screen h-screen p-0 m-0 bg-black/95 border-none inset-0 overflow-hidden" 
        aria-describedby="fullscreen-viewer-description"
        style={{
          touchAction: 'manipulation',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transform: 'none',
          borderRadius: 0
        }}
      >
        <DialogTitle className="sr-only">Image Viewer - {propertyAddress}</DialogTitle>
        <DialogDescription id="fullscreen-viewer-description" className="sr-only">
          Full screen image viewer for property at {propertyAddress}, showing image {currentIndex + 1} of {images.length}.
        </DialogDescription>
        <div className="relative w-full h-full flex flex-col justify-center items-center translate-y-6">
          {/* Close button - Made larger on mobile for easier touch */}
          <div className="absolute top-4 right-4 z-50">
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/30 hover:bg-black/50 text-white rounded-full h-12 w-12 shadow-lg"
              onClick={onClose}
              aria-label="Close full-screen view"
              style={{ minHeight: '52px', minWidth: '52px' }}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Enhanced image counter */}
          <div className="absolute top-4 left-4 z-50 bg-black/30 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
            {currentIndex + 1} / {images.length}
          </div>
          
          {/* Main image container - Enhanced for touch interactions */}
          <div 
            className="flex-1 flex items-center justify-center w-full h-full overflow-hidden"
            style={{ 
              WebkitOverflowScrolling: 'touch', // Better momentum scrolling
              touchAction: 'pan-y pinch-zoom' // Enable vertical swiping and pinch zoom
            }}
          >
            {images && images.length > 0 && (
              <img
                src={images[currentIndex]}
                alt={`Property image ${currentIndex + 1} of ${propertyAddress}`}
                className="max-h-[75vh] w-auto max-w-[90vw] mx-auto object-contain select-none mt-4"
                loading="eager"
                draggable="false" // Prevent unwanted drag on mobile
                style={{ 
                  transform: 'translateZ(0)', // Hardware acceleration
                  WebkitUserSelect: 'none',
                  userSelect: 'none'
                }}
                onError={(e) => {
                  // Handle image loading errors
                  console.error('Fullscreen image failed to load:', images[currentIndex]);
                  (e.target as HTMLImageElement).src = 'https://placehold.co/800x600/slate/white?text=Image+Not+Available';
                  (e.target as HTMLImageElement).alt = 'Image failed to load';
                  (e.target as HTMLImageElement).style.border = '1px solid #999';
                  (e.target as HTMLImageElement).onerror = null; // Prevent infinite error loop
                }}
              />
            )}
          </div>

          {/* Navigation controls - Enhanced size for better touch targets */}
          <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 flex justify-between px-3 w-full">
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/30 hover:bg-black/50 text-white rounded-full h-14 w-14 z-10 shadow-lg"
              onClick={navigatePrevious}
              aria-label="Previous image"
              style={{ minHeight: '56px', minWidth: '56px' }}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/30 hover:bg-black/50 text-white rounded-full h-14 w-14 z-10 shadow-lg"
              onClick={navigateNext}
              aria-label="Next image"
              style={{ minHeight: '56px', minWidth: '56px' }}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>

          {/* Thumbnail navigation - Enhanced for touch with better spacing */}
          <div className="absolute bottom-0 left-0 right-0 p-3 overflow-x-auto flex justify-center space-x-3 bg-black/40 backdrop-blur-sm">
            {images && images.length > 0 && images.map((image, index) => (
              <div
                key={index}
                className={`flex-shrink-0 h-16 w-16 sm:h-20 sm:w-20 rounded-md overflow-hidden border-2 transition-all ${
                  currentIndex === index ? 'border-primary scale-105 shadow-lg' : 'border-transparent opacity-70'
                }`}
                onClick={() => setCurrentIndex(index)}
                role="button"
                tabIndex={0}
                aria-label={`View image ${index + 1}`}
                aria-current={currentIndex === index}
                style={{ 
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setCurrentIndex(index);
                  }
                }}
              >
                <img
                  src={image}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="eager"
                  onError={(e) => {
                    // Handle thumbnail loading errors
                    console.error('FullScreenImageViewer thumbnail failed to load:', image);
                    (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/slate/white?text=Thumbnail';
                    (e.target as HTMLImageElement).style.border = '1px solid #999';
                    (e.target as HTMLImageElement).onerror = null; // Prevent infinite error loop
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}