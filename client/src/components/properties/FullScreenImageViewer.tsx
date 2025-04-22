import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  }, [isOpen, currentIndex, images.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const navigateNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const navigatePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Enhanced full screen mode with proper controls and navigation
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-7xl w-full p-0 bg-black/95 border-none">
        <div className="relative w-full h-screen max-h-[90vh] flex flex-col">
          {/* Close button */}
          <div className="absolute top-2 right-2 z-50">
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/20 hover:bg-black/40 text-white rounded-full h-10 w-10"
              onClick={onClose}
              aria-label="Close full-screen view"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Image counter */}
          <div className="absolute top-2 left-2 z-50 bg-black/20 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
          
          {/* Main image container */}
          <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
            <img
              src={images[currentIndex]}
              alt={`Property image ${currentIndex + 1} of ${propertyAddress}`}
              className="max-h-full max-w-full object-contain"
              loading="eager"
            />
          </div>

          {/* Navigation controls */}
          <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 flex justify-between px-4">
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/20 hover:bg-black/40 text-white rounded-full h-12 w-12 z-10"
              onClick={navigatePrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/20 hover:bg-black/40 text-white rounded-full h-12 w-12 z-10"
              onClick={navigateNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>

          {/* Thumbnail navigation (optional for larger screens) */}
          <div className="mt-auto p-2 overflow-x-auto flex space-x-2 bg-black/20">
            {images.map((image, index) => (
              <button
                key={index}
                className={`flex-shrink-0 h-16 w-16 rounded overflow-hidden border-2 transition-all ${
                  currentIndex === index ? 'border-primary' : 'border-transparent'
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`View image ${index + 1}`}
                aria-current={currentIndex === index}
              >
                <img
                  src={image}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}