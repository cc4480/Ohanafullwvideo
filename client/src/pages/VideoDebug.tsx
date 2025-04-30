import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

export function VideoDebug() {
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [video1Status, setVideo1Status] = useState<string>('Not loaded');
  const [video2Status, setVideo2Status] = useState<string>('Not loaded');
  const [video1Error, setVideo1Error] = useState<string | null>(null);
  const [video2Error, setVideo2Error] = useState<string | null>(null);

  useEffect(() => {
    const handleVideo1Error = (e: Event) => {
      const target = e.target as HTMLVideoElement;
      setVideo1Error(`Error: ${target.error?.message || 'Unknown error'} (Code: ${target.error?.code || 'None'})`);
      setVideo1Status('Error');
      console.error('Video 1 Error:', target.error);
    };

    const handleVideo2Error = (e: Event) => {
      const target = e.target as HTMLVideoElement;
      setVideo2Error(`Error: ${target.error?.message || 'Unknown error'} (Code: ${target.error?.code || 'None'})`);
      setVideo2Status('Error');
      console.error('Video 2 Error:', target.error);
    };

    const handleVideo1Loaded = () => {
      setVideo1Status('Loaded');
      console.log('Video 1 loaded successfully');
    };

    const handleVideo2Loaded = () => {
      setVideo2Status('Loaded');
      console.log('Video 2 loaded successfully');
    };

    // Set up event listeners
    if (video1Ref.current) {
      video1Ref.current.addEventListener('error', handleVideo1Error);
      video1Ref.current.addEventListener('loadeddata', handleVideo1Loaded);
    }

    if (video2Ref.current) {
      video2Ref.current.addEventListener('error', handleVideo2Error);
      video2Ref.current.addEventListener('loadeddata', handleVideo2Loaded);
    }

    return () => {
      // Clean up event listeners
      if (video1Ref.current) {
        video1Ref.current.removeEventListener('error', handleVideo1Error);
        video1Ref.current.removeEventListener('loadeddata', handleVideo1Loaded);
      }

      if (video2Ref.current) {
        video2Ref.current.removeEventListener('error', handleVideo2Error);
        video2Ref.current.removeEventListener('loadeddata', handleVideo2Loaded);
      }
    };
  }, []);

  const playVideo1 = () => {
    if (video1Ref.current) {
      video1Ref.current.play().catch(err => {
        console.error('Error playing video 1:', err);
        setVideo1Error(`Play error: ${err.message}`);
      });
    }
  };

  const playVideo2 = () => {
    if (video2Ref.current) {
      video2Ref.current.play().catch(err => {
        console.error('Error playing video 2:', err);
        setVideo2Error(`Play error: ${err.message}`);
      });
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-center">Video Debug Page</h1>

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Video 1: /property-video.mp4</h2>
        <div className="mb-4">
          <p className="text-sm mb-2">Status: <span className={video1Status === 'Loaded' ? 'text-green-600 font-bold' : video1Status === 'Error' ? 'text-red-600 font-bold' : 'text-gray-600'}>{video1Status}</span></p>
          {video1Error && <p className="text-red-600 text-sm mb-2">{video1Error}</p>}
          <Button onClick={playVideo1} className="mb-2">Play Video 1</Button>
        </div>
        <div className="aspect-video bg-black rounded-md overflow-hidden">
          <video 
            ref={video1Ref}
            className="w-full h-full object-contain"
            playsInline
            muted
            loop
            controls
          >
            <source src="/property-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Video 2: /videos/property-showcase.mp4</h2>
        <div className="mb-4">
          <p className="text-sm mb-2">Status: <span className={video2Status === 'Loaded' ? 'text-green-600 font-bold' : video2Status === 'Error' ? 'text-red-600 font-bold' : 'text-gray-600'}>{video2Status}</span></p>
          {video2Error && <p className="text-red-600 text-sm mb-2">{video2Error}</p>}
          <Button onClick={playVideo2} className="mb-2">Play Video 2</Button>
        </div>
        <div className="aspect-video bg-black rounded-md overflow-hidden">
          <video 
            ref={video2Ref}
            className="w-full h-full object-contain"
            playsInline
            muted
            loop
            controls
          >
            <source src="/videos/property-showcase.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Technical Information</h2>
        <p className="text-sm text-gray-700 mb-2">Browser: {navigator.userAgent}</p>
        <p className="text-sm text-gray-700 mb-2">Screen Size: {window.innerWidth} x {window.innerHeight}</p>
        <p className="text-sm text-gray-700 mb-2">Video Support: {document.createElement('video').canPlayType('video/mp4') ? 'Supported' : 'Not Supported'}</p>
      </div>
    </div>
  );
}

export default VideoDebug;