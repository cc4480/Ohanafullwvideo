import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlayIcon, PauseIcon, VolumeXIcon, Volume2Icon } from 'lucide-react';

interface VideoSectionProps {
  videoSrc: string;
  title: string;
  description: string;
}

export function VideoSection({ videoSrc, title, description }: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if video exists before trying to play it
  useEffect(() => {
    const checkVideoExists = async () => {
      try {
        console.log('Checking video at path:', videoSrc);
        // For debugging - log full URL
        const fullUrl = window.location.origin + videoSrc;
        console.log('Full video URL:', fullUrl);
        
        const response = await fetch(videoSrc, { method: 'HEAD' });
        if (!response.ok) {
          setVideoError(true);
          console.log('Video file not found or not accessible:', videoSrc);
        } else {
          console.log('Video file found and accessible');
          setVideoError(false);
        }
      } catch (error) {
        setVideoError(true);
        console.error('Error checking video existence:', error);
      }
    };
    
    // Simple file path verification
    if (!videoSrc || videoSrc === '') {
      setVideoError(true);
      console.error('Invalid video path provided');
      return;
    }
    
    // For testing purposes, try to directly access the video
    const testVideo = document.createElement('video');
    testVideo.onloadeddata = () => {
      console.log('Test video loaded successfully');
      setVideoError(false);
      setVideoLoaded(true);
    };
    testVideo.onerror = () => {
      console.error('Test video failed to load');
      setVideoError(true);
    };
    testVideo.src = videoSrc;
    
    // Also check with fetch
    checkVideoExists();
  }, [videoSrc]);

  // Handle play/pause toggle
  const togglePlay = () => {
    if (videoRef.current && !videoError) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle mute/unmute toggle
  const toggleMute = () => {
    if (videoRef.current && !videoError) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Update play state when video ends
  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  // Update play state on other video events
  const handleVideoPlay = () => setIsPlaying(true);
  const handleVideoPause = () => setIsPlaying(false);
  const handleVideoError = () => setVideoError(true);
  const handleVideoLoaded = () => setVideoLoaded(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoError) return;

    // Add event listeners
    video.addEventListener('ended', handleVideoEnd);
    video.addEventListener('play', handleVideoPlay);
    video.addEventListener('pause', handleVideoPause);
    video.addEventListener('error', handleVideoError);
    video.addEventListener('loadeddata', handleVideoLoaded);

    // Auto-play with mute on mobile devices
    const attemptAutoplay = async () => {
      try {
        video.muted = true;
        setIsMuted(true);
        await video.play();
        setIsPlaying(true);
      } catch (error) {
        console.log('Autoplay prevented by browser policy');
        setIsPlaying(false);
      }
    };

    // Only attempt autoplay if video isn't in error state
    if (!videoError) {
      attemptAutoplay();
    }

    // Cleanup
    return () => {
      video.removeEventListener('ended', handleVideoEnd);
      video.removeEventListener('play', handleVideoPlay);
      video.removeEventListener('pause', handleVideoPause);
      video.removeEventListener('error', handleVideoError);
      video.removeEventListener('loadeddata', handleVideoLoaded);
    };
  }, [videoError]);

  return (
    <section className="w-full bg-slate-50 dark:bg-slate-900 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{description}</p>
          </div>

          {videoError ? (
            // Placeholder state when video is not available
            <div className="relative rounded-xl overflow-hidden shadow-2xl bg-slate-200 dark:bg-slate-800">
              <div className="aspect-video flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-4 p-4 rounded-full bg-primary/10 text-primary">
                  <PlayIcon className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Video Coming Soon</h3>
                <p className="text-muted-foreground max-w-md">
                  We're preparing a beautiful video tour of our vacation rentals. Check back soon to see our properties in action!
                </p>
              </div>
            </div>
          ) : (
            // Video player when video is available
            <div 
              className="relative rounded-xl overflow-hidden shadow-2xl"
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
            >
              {/* Video Element */}
              <video
                ref={videoRef}
                className="w-full aspect-video object-cover"
                src={videoSrc}
                loop
                playsInline
                muted={isMuted}
                onEnded={handleVideoEnd}
                onError={handleVideoError}
              >
                Your browser does not support the video tag.
              </video>

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>

              {/* Video Controls */}
              <div className={`absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 sm:opacity-100'}`}>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
                  onClick={togglePlay}
                >
                  {isPlaying ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
                    onClick={toggleMute}
                  >
                    {isMuted ? <VolumeXIcon className="h-5 w-5" /> : <Volume2Icon className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
              
              {/* Central Play Button (Only visible when paused) */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30"
                    onClick={togglePlay}
                  >
                    <PlayIcon className="h-8 w-8" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default VideoSection;