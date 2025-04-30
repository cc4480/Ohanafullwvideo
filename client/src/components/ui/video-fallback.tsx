import React from 'react';

interface VideoFallbackProps {
  videoUrl: string;
  posterImage?: string;
  fallbackImage?: string;
  className?: string;
}

export function VideoFallback({
  videoUrl,
  posterImage = '/images/backgrounds/real-estate-bg.jpg',
  fallbackImage = '/images/backgrounds/real-estate-bg.jpg', 
  className = ''
}: VideoFallbackProps) {
  // We'll use an image as a fallback but make it look like a video player
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Display a static image styled like a video */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${fallbackImage})` }}
      ></div>
      
      {/* Overlay with a "play button" that's just for visual effect */}
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <div className="relative">
          <div className="bg-white/80 rounded-full p-6 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
          
          {/* Animated ripple effect */}
          <div className="absolute inset-0 rounded-full animate-ping bg-white/30"></div>
        </div>
      </div>
      
      {/* Visual player controls at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/70 to-transparent">
        <div className="absolute bottom-4 left-0 right-0 px-4 flex items-center">
          <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
            <div className="w-1/3 h-full bg-primary rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Download link in bottom right */}
      <div className="absolute bottom-3 right-3">
        <a 
          href={videoUrl} 
          download="property-video.mp4"
          className="text-xs text-white/70 hover:text-white flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>Download</span>
        </a>
      </div>
      
      {/* Status indicator */}
      <div className="absolute top-3 right-3 text-xs text-white bg-black/50 px-2 py-1 rounded">
        Video unavailable - Click to download
      </div>
    </div>
  );
}

export default VideoFallback;