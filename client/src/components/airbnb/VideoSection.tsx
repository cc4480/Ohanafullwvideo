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
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle play/pause toggle
  const togglePlay = () => {
    if (videoRef.current) {
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
    if (videoRef.current) {
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Add event listeners
    video.addEventListener('ended', handleVideoEnd);
    video.addEventListener('play', handleVideoPlay);
    video.addEventListener('pause', handleVideoPause);

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

    attemptAutoplay();

    // Cleanup
    return () => {
      video.removeEventListener('ended', handleVideoEnd);
      video.removeEventListener('play', handleVideoPlay);
      video.removeEventListener('pause', handleVideoPause);
    };
  }, []);

  return (
    <section className="w-full bg-slate-50 dark:bg-slate-900 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{description}</p>
          </div>

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
        </div>
      </div>
    </section>
  );
}

export default VideoSection;