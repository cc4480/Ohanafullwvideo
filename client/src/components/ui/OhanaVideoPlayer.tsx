import React, { useEffect, useRef, useState } from 'react';

interface OhanaVideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean; // Note: muted defaults to true for better autoplay success
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
  muted = true, // Always default to muted for better autoplay success
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
  
  // Socket for real-time video performance monitoring
  const socketRef = useRef<WebSocket | null>(null);
  const [optimizedConfig, setOptimizedConfig] = useState<any>(null);
  
  // Detect if user has high-performance device (16GB+ RAM)
  const isHighPerformanceDevice = () => {
    // Check if the browser reports more than 4 logical processors
    const hasMultipleCores = navigator.hardwareConcurrency > 4;
    
    // Check device memory if available (Chrome-specific)
    const hasHighMemory = (navigator as any).deviceMemory > 4; // More than 4GB suggests high-end device
    
    // Check if device pixel ratio is high (suggests high-end display)
    const hasHighDPI = window.devicePixelRatio > 1.5;
    
    // If we can detect at least two of these conditions, consider it high-performance
    let highPerfCount = 0;
    if (hasMultipleCores) highPerfCount++;
    if (hasHighMemory) highPerfCount++;
    if (hasHighDPI) highPerfCount++;
    
    return highPerfCount >= 2;
  };
  
  // Connect to WebSocket for real-time video performance optimization
  useEffect(() => {
    // Disable WebSocket for now to avoid connection errors
    // This fixes the unhandled promise rejections
    return;
    
    /* Original WebSocket implementation - temporarily disabled
    if (!isHighPerformanceDevice()) return;
    
    // Create WebSocket connection for performance monitoring
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;
      
      socket.onopen = () => {
        console.log('WebSocket connected for video performance monitoring');
        
        // Start sending performance metrics
        const metricsInterval = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN && videoRef.current) {
            try {
              const metrics = {
                bufferLevel: videoRef.current.buffered.length > 0 ? 
                  videoRef.current.buffered.end(videoRef.current.buffered.length - 1) - videoRef.current.currentTime : 0,
                playbackRate: videoRef.current.playbackRate,
                readyState: videoRef.current.readyState,
                memoryUsage: (performance as any).memory?.usedJSHeapSize ? 
                  ((performance as any).memory.usedJSHeapSize / (performance as any).memory.jsHeapSizeLimit) * 100 : 50,
                timestamp: Date.now()
              };
              
              if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                  type: 'video_metrics',
                  metrics
                }));
              }
            } catch (err) {
              console.error('Error sending metrics:', err);
            }
          }
        }, 5000); // Send metrics every 5 seconds
        
        return () => clearInterval(metricsInterval);
      };
      
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received WebSocket message:', data);
          
          if (data.type === 'video_config') {
            setOptimizedConfig(data.config);
            console.log('Received optimized video configuration:', data.config);
          } else if (data.type === 'video_config_update') {
            setOptimizedConfig((prev: any) => ({ ...prev, ...data.config }));
            console.log('Received dynamic configuration update:', data.config);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      socket.onclose = () => {
        console.log('WebSocket connection closed');
      };
      
      return () => {
        if (socket && socket.readyState !== WebSocket.CLOSED) {
          socket.close();
        }
      };
    } catch (err) {
      console.error('Error setting up WebSocket connection:', err);
    }
    */
  }, []);
  
  // Use high-performance endpoint if detected - temporarily disabled to fix video loading issues
  useEffect(() => {
    // Disable high-performance endpoint switching to prevent video loading issues
    // This simplifies the video loading process and avoids potential errors
    return;
    
    /* Original implementation - temporarily disabled
    // Check if we should use the high-performance endpoint
    if (videoRef.current && src.includes('/api/video/ohana') && isHighPerformanceDevice()) {
      // Replace standard endpoint with high-performance version that sends entire video file
      let highPerfSrc = '/api/video/ohana/highperf';
      
      // If we received specific cached URLs from the WebSocket, use the best one
      if (optimizedConfig?.cachedUrls?.length > 0) {
        highPerfSrc = optimizedConfig.cachedUrls[0];
      }
      
      console.log('Using high-performance video endpoint for 16GB+ RAM systems:', highPerfSrc);
      videoRef.current.src = highPerfSrc;
    }
    */
  }, [src, optimizedConfig]);

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
    }, 250); // Update at most once every 250ms for better performance
    
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
    
    // Set video to have higher priority loading
    if ('priority' in HTMLImageElement.prototype) {
      (video as any).fetchPriority = 'high';
    }
    
    // Try to play if autoPlay is true with a slight delay to allow browser to prepare
    if (autoPlay) {
      // Always ensure video is muted for autoplay (browsers require this)
      video.muted = true;
      setIsMuted(true);
      
      // Add longer delay to prevent immediate play failures
      setTimeout(() => {
        try {
          // Use a safer approach to handle autoplay
          const playPromise = video.play();
          
          // Only attach handlers if it's actually a promise
          if (playPromise !== undefined && typeof playPromise.then === 'function') {
            playPromise
              .then(() => {
                console.log('OhanaVideoPlayer: Autoplay successful');
              })
              .catch((err) => {
                console.warn('OhanaVideoPlayer: Autoplay prevented by browser', err);
                // Don't show error to user, just let them click play manually
                // This creates a better user experience than showing an error message
              });
          }
        } catch (err) {
          // Catch any synchronous errors
          console.error('OhanaVideoPlayer: Error during autoplay attempt', err);
          // Don't show error to user - just fail silently and let them press play
        }
      }, 300); // Increased delay for better reliability
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
  }, [autoPlay, onPlay, onPause, onError, src]);
  
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
        className="w-full h-full object-cover" 
        style={{
          objectPosition: 'center',
          objectFit: 'cover',
          transform: 'scale(0.9)', /* Reduce zoom while maintaining coverage */
          margin: 'auto'
        }}
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
                try {
                  // First, reset the video element
                  video.pause();
                  video.currentTime = 0;
                  
                  // Ensure it's muted to improve chances of success
                  video.muted = true;
                  setIsMuted(true);
                  
                  // Reload and attempt to play
                  video.load();
                  
                  // Delay play slightly to ensure video is ready
                  setTimeout(() => {
                    video.play().catch(e => {
                      console.error('Retry failed:', e);
                      // Don't update error state here to avoid an error loop
                    });
                  }, 300);
                } catch (err) {
                  console.error('Error during retry:', err);
                }
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