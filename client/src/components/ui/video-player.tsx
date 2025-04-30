import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PlayIcon, PauseIcon, VolumeXIcon, Volume2Icon } from 'lucide-react';

interface VideoPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  fallbackText?: string;
  showCustomControls?: boolean;
  onLoadedData?: () => void;
  onError?: () => void;
}

export function VideoPlayer({
  src,
  poster,
  className,
  autoPlay = false,
  muted = true,
  loop = true,
  controls = false,
  fallbackText = "Your browser does not support the video tag.",
  showCustomControls = true,
  ...props
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(error => {
          console.error("Error playing video:", error);
          setError(true);
        });
      }
    }
  };

  // Handle mute/unmute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Update UI state when video state changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleLoadedData = () => {
      console.log("Video loaded successfully:", src);
      setIsLoaded(true);
      
      // Call the onLoadedData callback if provided
      if (props.onLoadedData) {
        props.onLoadedData();
      }
    };
    const handleError = (e: Event) => {
      console.error("Video error:", e);
      console.error("Video src:", src);
      setError(true);
      
      // Call the onError callback if provided
      if (props.onError) {
        props.onError();
      }
    };
    
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, [src, props.onLoadedData]);

  return (
    <div className={cn("relative group overflow-hidden rounded-lg", className)}>
      {error ? (
        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground p-4 text-center">
          <p>
            Error loading video. Please try again later or contact support.
          </p>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            className={cn("w-full h-full object-cover", !isLoaded && "invisible")}
            poster={poster}
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            controls={controls}
            playsInline
            {...props}
          >
            <source src={src} type="video/mp4" />
            {fallbackText}
          </video>
          
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="animate-pulse h-16 w-16 rounded-full bg-primary/30"></div>
            </div>
          )}
          
          {showCustomControls && isLoaded && (
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between transition-opacity opacity-0 group-hover:opacity-100">
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
                </Button>
                
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeXIcon className="h-5 w-5" /> : <Volume2Icon className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default VideoPlayer;