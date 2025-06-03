import React, { useEffect, useRef, useState } from 'react';
import { getDeviceType, getDevicePerformance, getVideoDisplaySettings, isHighPerformanceDevice } from '../../utils/deviceUtils';
import { getOptimalVideoSources, loadOptimalSource, preloadVideoMetadata } from '../../utils/videoUtils';

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
  const [objectFit, setObjectFit] = useState<'contain' | 'cover' | 'fill'>('cover');
  const [videoEndpoint, setVideoEndpoint] = useState('/api/video/ohana');
  const [playbackQuality, setPlaybackQuality] = useState('standard');
  const [deviceType, setDeviceType] = useState('desktop');
  const [isInitialized, setIsInitialized] = useState(false);

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

  // State to track device type and optimal settings
  const [deviceSettings, setDeviceSettings] = useState(getVideoDisplaySettings());

  // Log device detection info when component mounts
  useEffect(() => {
    const deviceType = getDeviceType();
    const devicePerformance = getDevicePerformance();
    const settings = getVideoDisplaySettings();

    console.log('OhanaVideoPlayer: Device Detection', {
      deviceType,
      devicePerformance,
      videoEndpoint: settings.videoEndpoint,
      playbackQuality: settings.playbackQuality,
      maxResolution: settings.maxResolution,
      bufferSize: `${settings.bufferSize / (1024 * 1024)}MB`,
      userAgent: navigator.userAgent,
      cores: navigator.hardwareConcurrency || 'unknown',
      memory: (navigator as any).deviceMemory || 'unknown',
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      pixelRatio: window.devicePixelRatio,
    });
  }, []);

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

  // Update device settings on window resize with throttling
  useEffect(() => {
    // Track last resize timestamp to prevent excessive changes
    let lastResizeTimestamp = 0;
    const resizeThrottleMs = 1000; // Only process resize once per second

    // Track the original source and time so we can resume playback
    let originalSrc = '';
    let originalTime = 0;
    let wasPlaying = false;

    const handleResize = throttle(() => {
      // Update device settings
      setDeviceSettings(getVideoDisplaySettings());

      // Re-evaluate the video source on significant resize (e.g., device orientation change)
      if (videoRef.current && videoRef.current.src.includes('/api/video/ohana')) {
        const now = Date.now();

        // Only process resize if sufficient time has passed since last resize
        if (now - lastResizeTimestamp < resizeThrottleMs) return;
        lastResizeTimestamp = now;

        const settings = getVideoDisplaySettings();
        const deviceType = getDeviceType();
        const devicePerformance = getDevicePerformance();

        console.log(`Device resize detected: ${deviceType} with ${devicePerformance} performance`);

        // Remember playback state
        wasPlaying = !videoRef.current.paused;
        originalTime = videoRef.current.currentTime;
        originalSrc = videoRef.current.src;

        // Only change source if the endpoint type needs to change
        const shouldUseMobile = devicePerformance === 'low' || 
            (devicePerformance === 'medium' && (deviceType === 'mobile' || deviceType === 'tablet'));

        if (shouldUseMobile && !videoRef.current.src.includes('/mobile')) {
          console.log('Switching to mobile-optimized endpoint due to device resize');
          videoRef.current.src = '/api/video/ohana/mobile';
          videoRef.current.load();

          // After loading, restore playback position
          videoRef.current.addEventListener('loadedmetadata', function onceLoaded() {
            videoRef.current!.currentTime = originalTime;
            if (wasPlaying) videoRef.current!.play().catch(e => console.error('Error resuming playback', e));
            videoRef.current!.removeEventListener('loadedmetadata', onceLoaded);
          });
        } 
        else if (!shouldUseMobile && videoRef.current.src.includes('/mobile')) {
          console.log('Switching to standard/high-performance endpoint due to device resize');
          // Choose between standard and high-performance based on capabilities
          // For 16GB+ RAM, always use high-performance endpoint
          const memoryGB = typeof navigator !== 'undefined' ? (navigator as any).deviceMemory || 4 : 4;
          const hasSuperHighMemory = memoryGB >= 16;

          videoRef.current.src = (devicePerformance === 'high' || hasSuperHighMemory) ? 
            '/api/video/ohana/highperf' : '/api/video/ohana';
          videoRef.current.load();

          // After loading, restore playback position
          videoRef.current.addEventListener('loadedmetadata', function onceLoaded() {
            videoRef.current!.currentTime = originalTime;
            if (wasPlaying) videoRef.current!.play().catch(e => console.error('Error resuming playback', e));
            videoRef.current!.removeEventListener('loadedmetadata', onceLoaded);
          });
        }
      }
    }, 250); // Throttle resize events to max once per 250ms

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Send performance metrics via WebSocket for server-side optimization
  useEffect(() => {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      const socket = new WebSocket(wsUrl);
      let metricsInterval: NodeJS.Timeout;

      socket.onopen = () => {
        console.log('WebSocket connected for video performance monitoring');

        // Send metrics every 5 seconds instead of constantly
        metricsInterval = setInterval(() => {
          if (videoRef.current && socket.readyState === WebSocket.OPEN) {
            const video = videoRef.current;
            const metrics = {
              bufferLevel: video.buffered.length > 0 ? 
                video.buffered.end(video.buffered.length - 1) - video.currentTime : 0,
              playbackRate: video.playbackRate,
              readyState: video.readyState,
              networkState: video.networkState,
              currentTime: video.currentTime,
              duration: video.duration || 0
            };

            socket.send(JSON.stringify({
              type: 'video_metrics',
              metrics
            }));
          }
        }, 5000); // Send every 5 seconds instead of constantly
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
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
        if (metricsInterval) {
          clearInterval(metricsInterval);
        }
      };

      return () => {
        if (metricsInterval) {
          clearInterval(metricsInterval);
        }
        if (socket && socket.readyState !== WebSocket.CLOSED) {
          socket.close();
        }
      };
    } catch (err) {
      console.error('Error setting up WebSocket connection:', err);
    }
  }, []);

  // Use adaptive quality based on device capabilities
  useEffect(() => {
    // Get the device info to determine optimal video quality
    const deviceType = getDeviceType();
    const devicePerformance = getDevicePerformance();
    const settings = getVideoDisplaySettings();

    // Check for high-RAM systems (16GB+)
    const memoryGB = typeof navigator !== 'undefined' ? (navigator as any).deviceMemory || 4 : 4;
    const hasSuperHighMemory = memoryGB >= 16;

    if (videoRef.current && src.includes('/api/video/ohana')) {
      // For 16GB+ RAM systems, always use high-performance endpoint
      let endpoint = settings.videoEndpoint;
      if (hasSuperHighMemory && !endpoint.includes('/highperf')) {
        endpoint = '/api/video/ohana/highperf';
        console.log(`Using adaptive video quality for ${deviceType} device with ultra-high memory (${memoryGB}GB RAM)`);
      } else {
        console.log(`Using adaptive video quality for ${deviceType} device with ${devicePerformance} performance`);
      }

      console.log(`Selected video endpoint: ${endpoint}`);

      // Set src based on device capabilities
      videoRef.current.src = endpoint;
      videoRef.current.load();
    }
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Performance optimization: Use passive event listeners for better scroll performance
    const eventOptions = { passive: true };

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
      // Extract useful information from the error event
      const videoElement = e.target as HTMLVideoElement;
      const errorCode = videoElement.error ? videoElement.error.code : 'unknown';
      const errorMessage = videoElement.error ? videoElement.error.message : 'Unknown error';

      // Map error codes to user-friendly messages
      let userMessage = 'Error loading video';
      switch (errorCode) {
        case 1: // MEDIA_ERR_ABORTED
          userMessage = 'Video playback was aborted';
          break;
        case 2: // MEDIA_ERR_NETWORK
          userMessage = 'A network error occurred. Please check your connection.';
          break;
        case 3: // MEDIA_ERR_DECODE
          userMessage = 'Video format error. Trying mobile-optimized version...';
          // For decode errors, try mobile version if we're not already using it
          if (videoRef.current && !videoRef.current.src.includes('/mobile')) {
            console.log('Switching to mobile-optimized endpoint due to decode error');
            videoRef.current.src = '/api/video/ohana/mobile';
            videoRef.current.load();
            return; // Don't show error as we're trying an alternative
          }
          break;
        case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
          userMessage = 'Video format not supported by your browser';
          break;
        default:
          userMessage = `Video playback error (${errorMessage})`;
      }

      setError(userMessage);
      setIsPlaying(false);
      onError?.(e);
      console.error('OhanaVideoPlayer error:', {
        code: errorCode,
        message: errorMessage,
        event: e
      });
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
                // Reset any error states since autoplay prevention is normal
                setError(null);
                // Don't treat autoplay prevention as a fatal error
                return Promise.resolve(); // Explicitly resolve to prevent unhandled rejection
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

  // Enhanced YouTube-like adaptive bitrate control: now much more aggressive with quality switching
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // These track playback performance metrics like YouTube does
    let rebufferingEvents = 0;
    let lastBufferCheck = Date.now();
    let playbackStartTime = 0;
    let isBuffering = false;
    let loadAttempts = 0;
    let consecutiveGoodPlayback = 0;
    let qualityAssessmentCount = 0;

    // MUCH more aggressive threshold - switch quality after just 1-2 buffer events
    const rebufferingThreshold = 1; // Was 3, now 1 for much faster response

    // YouTube-like metric for monitoring playback smoothness
    const checkBuffering = () => {
      if (!video) return;

      const now = Date.now();
      // Check more frequently (500ms vs 2000ms)
      if (now - lastBufferCheck < 500) return;
      lastBufferCheck = now;

      // Calculate how much video is buffered ahead of current playback
      let bufferedAhead = 0;
      if (video.buffered.length) {
        const currentBufferEnd = video.buffered.end(video.buffered.length - 1);
        bufferedAhead = currentBufferEnd - video.currentTime;
      }

      // Much more sensitive buffering detection
      if (bufferedAhead < 1 && video.readyState < 4 && !video.paused) { // Was < 2, now < 1
        // We're about to buffer
        if (!isBuffering) {
          console.log('OhanaVideoPlayer: Buffering detected, switching quality immediately');
          rebufferingEvents++;
          isBuffering = true;
          consecutiveGoodPlayback = 0; // Reset good playback counter

          // Switch quality IMMEDIATELY after a single buffer event
          if (rebufferingEvents >= rebufferingThreshold) {
            // CRITICAL CHANGE: Try mobile version immediately regardless of current endpoint
            // This is key to fixing choppy playback
            console.log('OhanaVideoPlayer: Switching to mobile-optimized version immediately');

            // Save current playback position
            const currentTime = video.currentTime;

            // Switch to mobile-optimized version
            video.src = '/api/video/ohana/mobile';
            video.load();

            // After loading, jump to slightly before where we left off
            // The "slightly before" helps create a seamless transition
            video.addEventListener('loadedmetadata', function onceLoaded() {
              video.currentTime = Math.max(0, currentTime - 0.5); // Go back just half a second
              video.removeEventListener('loadedmetadata', onceLoaded);
            });

            loadAttempts++;
            video.play().catch(err => console.log('Error after quality switch:', err));
          }
        }
      } else if (bufferedAhead > 3) { // Was > 5, now > 3 for faster recovery detection
        // We have good buffer now
        isBuffering = false;
        consecutiveGoodPlayback++;
        qualityAssessmentCount++;

        // This tracks when we have consistently good playback, like YouTube does
        // After 10 consecutive good checks (5 seconds of smooth playback),
        // we could consider switching back to higher quality
        if (consecutiveGoodPlayback > 10 && video.src.includes('/mobile')) {
          // Only log quality changes, not every assessment
          if (qualityAssessmentCount % 10 === 0) {
            console.log(`OhanaVideoPlayer: Quality assessment ${qualityAssessmentCount}: good playback`);
          }
          // NOTE: Commented out for now to prioritize smooth playback, uncomment to enable
          // adaptive quality increases (but might cause more buffering)
          /*
          // Only attempt this once
          if (loadAttempts <= 1) { 
            console.log('OhanaVideoPlayer: Trying higher quality version');

            // Save current playback position
            const currentTime = video.currentTime;

            // Try standard quality
            video.src = '/api/video/ohana'; 
            video.load();

            video.addEventListener('loadedmetadata', function onceLoaded() {
              video.currentTime = Math.max(0, currentTime - 0.5);
              video.removeEventListener('loadedmetadata', onceLoaded);
            });

            loadAttempts++;
            video.play().catch(err => console.log('Error after quality increase:', err));

            // Reset counters
            consecutiveGoodPlayback = 0;
            rebufferingEvents = 0;
          }
          */
        }
      }
    };

    // Track playback smoothness metrics much more frequently
    // 500ms vs 2000ms - 4x more frequent checks
    const intervalId = setInterval(checkBuffering, 500);

    // YouTube monitors when playback actually starts
    const handlePlaying = () => {
      if (playbackStartTime === 0) {
        playbackStartTime = Date.now();
        console.log(`OhanaVideoPlayer: Playback started after ${playbackStartTime - lastBufferCheck}ms`);
      }
    };

    // Check for stalled playback - critical for addressing 3-second play-stop issue
    const handleStalled = () => {
      console.log('OhanaVideoPlayer: Playback stalled');
      isBuffering = true;
      rebufferingEvents++;

      // Immediately switch to mobile version when stalled
      if (!video.src.includes('/mobile')) {
        console.log('OhanaVideoPlayer: Stalled - immediately switching to mobile version');
        video.src = '/api/video/ohana/mobile';
        video.load();
        video.play().catch(err => console.log('Error after stalled quality switch:', err));
      }
    };

    // Monitor waiting events (browser waiting for more data)
    const handleWaiting = () => {
      console.log('OhanaVideoPlayer: Waiting for data');
      isBuffering = true;
      rebufferingEvents++;

      // After any waiting, immediately downgrade quality
      if (!video.src.includes('/mobile')) {
        console.log('OhanaVideoPlayer: Waiting for data - switching to mobile version');

        // Save current playback position
        const currentTime = video.currentTime;

        // Switch to mobile version
        video.src = '/api/video/ohana/mobile';
        video.load();

        video.addEventListener('loadedmetadata', function onceLoaded() {
          video.currentTime = Math.max(0, currentTime - 0.5);
          video.removeEventListener('loadedmetadata', onceLoaded);
        });

        video.play().catch(err => console.log('Error after waiting quality switch:', err));
      }
    };

    video.addEventListener('playing', handlePlaying);
    video.addEventListener('stalled', handleStalled);
    video.addEventListener('waiting', handleWaiting);

    return () => {
      clearInterval(intervalId);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('stalled', handleStalled);
      video.removeEventListener('waiting', handleWaiting);
    };
  }, []);

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

  // Function to cycle through different video display modes
  const cycleDisplayMode = () => {
    if (objectFit === 'contain') {
      setObjectFit('fill');
    } else if (objectFit === 'fill') {
      setObjectFit('cover');
    } else {
      setObjectFit('contain');
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
      style={{
        aspectRatio: deviceSettings.aspectRatio,
        maxWidth: deviceSettings.maxWidth,
        margin: '0 auto', // Center the container
        background: deviceSettings.background
      }}
    >
      {/* The actual video element */}
      <video 
        ref={videoRef}
        src={src}
        poster={poster}
        muted={isMuted}
        loop={loop}
        playsInline
        preload={deviceSettings.preload}
        x-webkit-airplay="allow"
        x-webkit-playsinline="true"
        controlsList="nodownload"
        disablePictureInPicture={false}
        className="w-full h-full" 
        style={{
          objectPosition: 'center',
          objectFit: objectFit, /* Use the state value to control display mode */
          margin: 'auto',
          willChange: 'transform',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          width: '100%',
          height: '100%',
          maxHeight: '100vh',
          maxWidth: '100%',
          background: deviceSettings.background /* Black background to fill any empty space */
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
          <div className="bg-black/30 rounded-full p-3 sm:p-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 sm:w-12 sm:h-12 text-white">
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

                  // Try mobile-optimized version regardless of current endpoint
                  // This gives us a better chance of success on constrained devices
                  const devicePerformance = getDevicePerformance();
                  if (devicePerformance === 'low' || devicePerformance === 'medium') {
                    console.log('Retry: Switching to mobile-optimized endpoint');
                    video.src = '/api/video/ohana/mobile';
                  } else if (!video.src.includes('/mobile') && !video.src.includes('/highperf')) {
                    // If we're on the default endpoint, try mobile as a fallback
                    console.log('Retry: Trying mobile endpoint as fallback');
                    video.src = '/api/video/ohana/mobile';
                  }

                  // Reload and attempt to play
                  video.load();

                  // Delay play slightly to ensure video is ready
                  setTimeout(() => {
                    video.play().catch(e => {
                      console.error('Retry failed:', e);
                      // Don't update error state here to avoid an error loop

                      // Final fallback: try the general endpoint
                      if (video.src.includes('/mobile') || video.src.includes('/highperf')) {
                        console.log('Final fallback: trying general endpoint');
                        video.src = '/api/video/ohana';
                        video.load();
                        setTimeout(() => {
                          video.play().catch(finalErr => {
                            console.error('Final fallback failed:', finalErr);
                          });
                        }, 300);
                      }
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

      {/* Enhanced video controls - with responsive spacing */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2 sm:p-3 flex flex-col transition-opacity duration-300 ${isControlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
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
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
                  </svg>
                ) : volume <= 0.5 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
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

          <div className="text-white text-xs mr-2 sm:mr-3 hidden xs:block">
            {isLoaded ? 'Ohana Realty Video' : 'Preparing video...'}
          </div>

          {/* Display mode toggle button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              cycleDisplayMode();
            }}
            className="text-white focus:outline-none mr-3"
            title={`Display mode: ${objectFit}`}
          >
            {objectFit === 'contain' ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5" />
              </svg>
            ) : objectFit === 'fill' ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m9 0v4.5m0-4.5h4.5m0 9v4.5m0-4.5h-4.5m-9 0H3.75m0 0v4.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M4.5 4.5h15v15h-15z" />
              </svg>
            )}
          </button>

          {/* Fullscreen button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
            className="text-white focus:outline-none"
          >
            {isFullscreen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M15 9H19.5M15 9V4.5M15 15v4.5M15 15H9M15 15h4.5M9 15H4.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
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