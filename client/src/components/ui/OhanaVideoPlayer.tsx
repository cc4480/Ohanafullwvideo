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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(muted ? 0 : 0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  
  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Performance optimization: Use passive event listeners for better scroll performance
    const eventOptions = { passive: true };
    
    // Throttle function for performance-critical handlers
    const throttle = (func: Function, limit: number) => {
      let inThrottle: boolean;
      let lastTime = 0;
      return function(this: any, ...args: any[]) {
        const now = Date.now();
        if (!inThrottle && now - lastTime >= limit) {
          func.apply(this, args);
          lastTime = now;
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    };
    
    const handleCanPlay = () => {
      setIsLoaded(true);
      setDuration(video.duration);
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
    
    // Throttle time update to reduce unnecessary re-renders
    const handleTimeUpdate = throttle(() => {
      setCurrentTime(video.currentTime);
    }, 200); // Update at most once every 200ms
    
    const handleVolumeChange = () => {
      setIsMuted(video.muted);
      setVolume(video.volume);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };
    
    // Performance optimization: Low quality during playback, high quality when paused
    const handleQualityControl = () => {
      if (video.readyState >= 3) { // HAVE_FUTURE_DATA or better
        // Video is ready for smooth playback
        video.style.filter = 'none';
      }
    };
    
    // Add event listeners with passive option when possible
    video.addEventListener('canplay', handleCanPlay, eventOptions);
    video.addEventListener('canplaythrough', handleQualityControl, eventOptions);
    video.addEventListener('playing', handlePlaying, eventOptions);
    video.addEventListener('pause', handlePause, eventOptions);
    video.addEventListener('error', handleError); // Can't be passive
    video.addEventListener('timeupdate', handleTimeUpdate, eventOptions);
    video.addEventListener('volumechange', handleVolumeChange, eventOptions);
    video.addEventListener('loadedmetadata', handleLoadedMetadata, eventOptions);
    
    // Optimization: Prioritize loading metadata
    video.preload = 'metadata';
    
    // Try to play if autoPlay is true with a slight delay to allow browser to prepare
    if (autoPlay) {
      // Add slight delay to prevent immediate play failures
      setTimeout(() => {
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
                setIsMuted(true);
                video.play().catch((err) => {
                  console.error('OhanaVideoPlayer: Even muted autoplay failed', err);
                  setError('Autoplay is not allowed by your browser. Please click play.');
                });
              }
            });
        }
      }, 50);
    }
    
    // Cleanup event listeners
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('canplaythrough', handleQualityControl);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('volumechange', handleVolumeChange);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [autoPlay, onPlay, onPause, onError]);
  
  // Apply volume when isMuted changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = isMuted;
    video.volume = isMuted ? 0 : volume;
  }, [isMuted, volume]);
  
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
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };
  
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };
  
  return (
    <div 
      ref={containerRef}
      className={`ohana-video-player relative ${className}`}
      onMouseEnter={() => setIsControlsVisible(true)}
      onMouseLeave={() => setIsControlsVisible(false)}
    >
      {/* The actual video element */}
      <video 
        ref={videoRef}
        src={src}
        poster={poster}
        muted={isMuted}
        loop={loop}
        playsInline
        preload="auto"
        x-webkit-airplay="allow"
        x-webkit-playsinline="true"
        controlsList="nodownload"
        disablePictureInPicture={false}
        className="w-full h-full object-contain"
      >  
        {/* Add a fallback text for browsers that don't support video */}
        Your browser does not support the video tag.
      </video>
      
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
            onClick={(e) => {
              e.stopPropagation();
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
      
      {/* Enhanced video controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3 flex flex-col transition-opacity duration-300 ${isControlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Progress bar */}
        <div className="w-full mb-2">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-400 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex justify-between text-xs text-white mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        {/* Controls row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Play/Pause button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
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
            
            {/* Volume control */}
            <div className="flex items-center space-x-1">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className="text-white focus:outline-none"
              >
                {isMuted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
                  </svg>
                ) : volume <= 0.5 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                  </svg>
                )}
              </button>
              <div className="w-16 hidden sm:block">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 bg-gray-400 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </div>
          
          <div className="text-white text-xs mr-3">
            {isLoaded ? 'Ohana Realty Video' : 'Preparing video...'}
          </div>
          
          {/* Fullscreen button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
            className="text-white focus:outline-none"
          >
            {isFullscreen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M15 9H19.5M15 9V4.5M15 15v4.5M15 15H9M15 15h4.5M9 15H4.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m9 0v4.5m0-4.5h4.5m0 9v4.5m0-4.5h-4.5m-9 0H3.75m0 0v4.5" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OhanaVideoPlayer;