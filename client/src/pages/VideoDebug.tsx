import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

export function VideoDebug() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoStatus, setVideoStatus] = useState<string>('Not loaded');
  const [videoError, setVideoError] = useState<string | null>(null);

  useEffect(() => {
    const handleVideoError = (e: Event) => {
      const target = e.target as HTMLVideoElement;
      setVideoError(`Error: ${target.error?.message || 'Unknown error'} (Code: ${target.error?.code || 'None'})`);
      setVideoStatus('Error');
      console.error('Video Error:', target.error);
    };

    const handleVideoLoaded = () => {
      setVideoStatus('Loaded');
      console.log('Video loaded successfully');
    };

    // Set up event listeners
    if (videoRef.current) {
      videoRef.current.addEventListener('error', handleVideoError);
      videoRef.current.addEventListener('loadeddata', handleVideoLoaded);
    }

    return () => {
      // Clean up event listeners
      if (videoRef.current) {
        videoRef.current.removeEventListener('error', handleVideoError);
        videoRef.current.removeEventListener('loadeddata', handleVideoLoaded);
      }
    };
  }, []);

  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.error('Error playing video:', err);
        setVideoError(`Play error: ${err.message}`);
      });
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-center">Ohana Video Test Page</h1>

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">OHANAVIDEOMASTER.mp4</h2>
        <div className="mb-4">
          <p className="text-sm mb-2">Status: <span className={videoStatus === 'Loaded' ? 'text-green-600 font-bold' : videoStatus === 'Error' ? 'text-red-600 font-bold' : 'text-gray-600'}>{videoStatus}</span></p>
          {videoError && <p className="text-red-600 text-sm mb-2">{videoError}</p>}
          <Button onClick={playVideo} className="mb-2">Play Video</Button>
        </div>
        <div className="aspect-video bg-black rounded-md overflow-hidden">
          <video 
            ref={videoRef}
            className="w-full h-full object-contain"
            playsInline
            muted
            loop
            controls
            src="/OHANAVIDEOMASTER.mp4"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Technical Information</h2>
        <p className="text-sm text-gray-700 mb-2">File Path: /OHANAVIDEOMASTER.mp4</p>
        <p className="text-sm text-gray-700 mb-2">Browser: {navigator.userAgent}</p>
        <p className="text-sm text-gray-700 mb-2">Screen Size: {window.innerWidth} x {window.innerHeight}</p>
        <p className="text-sm text-gray-700 mb-2">Video Support: {document.createElement('video').canPlayType('video/mp4') ? 'Supported' : 'Not Supported'}</p>
      </div>
    </div>
  );
}

export default VideoDebug;