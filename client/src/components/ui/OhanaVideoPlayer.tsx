import React, { useEffect, useRef, useState } from 'react';

interface OhanaVideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onError?: (error: any) => void;
}

/**
 * A custom video player component built from scratch for Ohana Realty
 */
export function OhanaVideoPlayer({
  src,
  poster,
  autoPlay = true,
  muted = true,
  loop = true,
  className = '',
  onPlay,
  onPause,
  onError
}: OhanaVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleCanPlay = () => {
      setIsLoaded(true);
      console.log('OhanaVideoPlayer: Video can play now');
    };
    
    const handlePlaying = () => {
      setIsPlaying(true);
      setError(null);
      onPlay?.();
      console.log('OhanaVideoPlayer: Video is playing');
    };
    
    const handlePause = () => {
      setIsPlaying(false);
      onPause?.();
      console.log('OhanaVideoPlayer: Video is paused');
    };
    
    const handleError = (e: any) => {
      setError(`Error loading video: ${e}`);
      setIsPlaying(false);
      onError?.(e);
      console.error('OhanaVideoPlayer error:', e);
    };
    
    // Add event listeners
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);
    
    // Try to play if autoPlay is true
    if (autoPlay) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('OhanaVideoPlayer: Autoplay successful');
          })
          .catch((err) => {
            console.warn('OhanaVideoPlayer: Autoplay prevented by browser', err);
            // Most browsers require user interaction before playing with sound
            // Try again with muted if it wasn't already muted
            if (!video.muted) {
              video.muted = true;
              video.play().catch((err) => {
                console.error('OhanaVideoPlayer: Even muted autoplay failed', err);
                setError('Autoplay is not allowed by your browser. Please click play.');
              });
            }
          });
      }
    }
    
    // Cleanup event listeners
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
    };
  }, [autoPlay, onPlay, onPause, onError]);
  
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch((err) => {
        console.error('OhanaVideoPlayer: Failed to play on user interaction', err);
        setError('Video playback failed. Please try again.');
      });
    }
  };
  
  return (
    <div className={`ohana-video-player relative ${className}`}>
      {/* The actual video element */}
      <video 
        ref={videoRef}
        src={src}
        poster={poster}
        muted={muted}
        loop={loop}
        playsInline
        className="w-full h-full object-cover"
      />
      
      {/* Custom play/pause button overlay */}
      <div 
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
        onClick={togglePlay}
      >
        {!isLoaded && !error && (
          <div className="flex flex-col items-center justify-center text-white">
            <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2 text-sm">Loading video...</p>
          </div>
        )}
        
        {isLoaded && !isPlaying && !error && (
          <div className="bg-black/30 rounded-full p-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
            </svg>
          </div>
        )}
      </div>
      
      {/* Error message display */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white p-4">
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
            className="mt-4 px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
          >
            Retry
          </button>
        </div>
      )}
      
      {/* Simple video controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 flex justify-between items-center opacity-0 hover:opacity-100 transition-opacity">
        <button 
          onClick={togglePlay}
          className="text-white focus:outline-none"
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
            </svg>
          )}
        </button>
        
        <div className="text-white text-xs">
          {isLoaded ? 'Ohana Realty Video' : 'Preparing video...'}
        </div>
      </div>
    </div>
  );
}

export default OhanaVideoPlayer;