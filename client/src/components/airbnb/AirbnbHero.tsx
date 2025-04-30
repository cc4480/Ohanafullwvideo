import React, { useEffect, useRef, useState } from 'react';

export function AirbnbHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleCanPlay = () => {
      console.log('Video can now be played');
      setIsVideoLoaded(true);
      
      // Autoplay as soon as possible
      video.play().catch(err => {
        console.warn('Autoplay prevented:', err);
        // Some browsers require user interaction - we'll show the play button
      });
    };
    
    const handlePlaying = () => {
      console.log('Video is now playing');
      setIsPlaying(true);
    };
    
    const handlePause = () => {
      console.log('Video is paused');
      setIsPlaying(false);
    };
    
    const handleError = (e: any) => {
      console.error('Video error:', e);
      setError('Error loading video. Please try again.');
    };
    
    // Add event listeners
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);
    
    // Try to play automatically
    if (video.readyState >= 2) { // HAVE_CURRENT_DATA or better
      video.play().catch(err => {
        console.warn('Initial autoplay prevented:', err);
      });
    }
    
    // Cleanup
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
    };
  }, []);
  
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (video.paused) {
      video.play().catch(err => {
        console.error('Failed to play:', err);
        setError('Failed to play video. Please try again.');
      });
    } else {
      video.pause();
    }
  };
  
  return (
    <section className="relative w-full">
      <div className="w-full h-[80vh] overflow-hidden relative">
        {/* Video element */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src="/OHANAVIDEOMASTER.mp4"
          muted
          autoPlay
          loop
          playsInline
          controlsList="nodownload"
          onClick={togglePlay}
        />
        
        {/* Loading spinner */}
        {!isVideoLoaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
        
        {/* Play button overlay - only shown if video paused despite autoplay attempt */}
        {isVideoLoaded && !isPlaying && (
          <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20"
            onClick={togglePlay}
          >
            <div className="bg-white/30 rounded-full p-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
            </div>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-red-500 mb-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="text-center">{error}</p>
            <button
              onClick={() => {
                setError(null);
                const video = videoRef.current;
                if (video) {
                  video.load();
                  video.play().catch(e => console.error('Retry failed:', e));
                }
              }}
              className="mt-4 px-4 py-2 bg-white text-black rounded"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default AirbnbHero;