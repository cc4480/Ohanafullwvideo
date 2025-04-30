import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { VideoPlayer } from "@/components/ui/video-player";

interface FeaturedAirbnbRentalsProps {
  title?: string;
  subtitle?: string;
}

export function FeaturedAirbnbRentals({
  title = "Featured Vacation Rentals",
  subtitle = "Experience luxury and comfort in our hand-picked vacation rentals",
}: FeaturedAirbnbRentalsProps) {
  // Create a direct link to the video file for download
  const videoUrl = "/property-video.mp4";
  
  // State to track if the video modal is open
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  
  // Reference to the video element
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Function to play video in modal
  const openVideoModal = () => {
    setVideoModalOpen(true);
  };
  
  // Function to handle modal close
  const handleModalClose = () => {
    setVideoModalOpen(false);
    // Ensure video stops playing when modal is closed
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3">{title}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
      </div>

      <div className="w-full max-w-5xl mx-auto h-[60vh] overflow-hidden relative rounded-lg bg-gray-100">
        {/* Use a static image as a thumbnail with video play button overlay */}
        <div className="absolute inset-0">
          <img 
            src="/shiloh-primary.webp" 
            alt="Property Video Thumbnail" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
            <button 
              onClick={openVideoModal}
              className="bg-white text-primary hover:bg-white/90 transition-colors rounded-full p-6 mb-4"
              aria-label="Play video"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" fill="currentColor"></polygon>
              </svg>
            </button>
            <p className="text-white text-xl font-semibold">Watch Property Video</p>
            <p className="text-white/80 text-sm mt-2">Click to play video</p>
          </div>
        </div>
      </div>

      {/* Video Modal Dialog */}
      <Dialog open={videoModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="max-w-4xl h-[80vh] overflow-hidden p-0 bg-black">
          <DialogTitle className="sr-only">Property Video</DialogTitle>
          <DialogDescription className="sr-only">Watch property tour video</DialogDescription>
          
          <div className="relative w-full h-full">
            <video 
              ref={videoRef}
              className="w-full h-full object-contain"
              src={videoUrl}
              autoPlay={true}
              muted={false}
              loop={false}
              controls={true}
              playsInline
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            <DialogClose asChild>
              <Button 
                className="absolute top-4 right-4 rounded-full bg-black/50 hover:bg-black/70 text-white" 
                size="icon"
                aria-label="Close video"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <div className="mt-6 text-center">
        <a 
          href={videoUrl} 
          download="property-tour.mp4"
          className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download Property Video
        </a>
      </div>
    </section>
  );
}

export default FeaturedAirbnbRentals;