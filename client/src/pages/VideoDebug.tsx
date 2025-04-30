import React, { useEffect, useRef, useState } from 'react';

export default function VideoDebug() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoInfo, setVideoInfo] = useState<{
    readyState: number;
    networkState: number;
    error: string | null;
    paused: boolean;
    currentTime: number;
    duration: number;
    buffered: string;
  }>({
    readyState: 0,
    networkState: 0,
    error: null,
    paused: true,
    currentTime: 0,
    duration: 0,
    buffered: ''
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateVideoInfo = () => {
      let bufferedRanges = '';
      if (video.buffered.length) {
        for (let i = 0; i < video.buffered.length; i++) {
          bufferedRanges += `${video.buffered.start(i).toFixed(2)}-${video.buffered.end(i).toFixed(2)} `;
        }
      }

      setVideoInfo({
        readyState: video.readyState,
        networkState: video.networkState,
        error: video.error ? `Error code: ${video.error.code}, message: ${video.error.message}` : null,
        paused: video.paused,
        currentTime: video.currentTime,
        duration: video.duration || 0,
        buffered: bufferedRanges
      });
    };

    // Add event listeners
    const events = [
      'loadstart', 'progress', 'loadedmetadata', 'loadeddata', 'canplay', 
      'canplaythrough', 'play', 'pause', 'seeking', 'seeked', 'waiting', 
      'playing', 'timeupdate', 'ended', 'error'
    ];

    events.forEach(event => {
      video.addEventListener(event, () => {
        console.log(`Video event: ${event}`);
        updateVideoInfo();
      });
    });

    // Initial update
    updateVideoInfo();

    // Cleanup
    return () => {
      events.forEach(event => {
        video.removeEventListener(event, updateVideoInfo);
      });
    };
  }, []);

  const renderReadyState = (state: number) => {
    switch(state) {
      case 0: return 'HAVE_NOTHING';
      case 1: return 'HAVE_METADATA';
      case 2: return 'HAVE_CURRENT_DATA';
      case 3: return 'HAVE_FUTURE_DATA';
      case 4: return 'HAVE_ENOUGH_DATA';
      default: return `Unknown (${state})`;
    }
  };

  const renderNetworkState = (state: number) => {
    switch(state) {
      case 0: return 'NETWORK_EMPTY';
      case 1: return 'NETWORK_IDLE';
      case 2: return 'NETWORK_LOADING';
      case 3: return 'NETWORK_NO_SOURCE';
      default: return `Unknown (${state})`;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Video Debug Tools</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <video 
            ref={videoRef}
            src="/api/video/ohana"
            controls
            muted
            playsInline
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Video Diagnostics</h2>
          
          <div className="space-y-4">
            <div>
              <div className="font-medium">Ready State:</div>
              <div className="ml-4 text-sm">
                {renderReadyState(videoInfo.readyState)} ({videoInfo.readyState})
              </div>
            </div>
            
            <div>
              <div className="font-medium">Network State:</div>
              <div className="ml-4 text-sm">
                {renderNetworkState(videoInfo.networkState)} ({videoInfo.networkState})
              </div>
            </div>
            
            <div>
              <div className="font-medium">Error:</div>
              <div className="ml-4 text-sm text-red-600">
                {videoInfo.error || 'None'}
              </div>
            </div>
            
            <div>
              <div className="font-medium">Playback:</div>
              <div className="ml-4 text-sm">
                Status: {videoInfo.paused ? 'Paused' : 'Playing'}<br />
                Position: {videoInfo.currentTime.toFixed(2)}s / {videoInfo.duration.toFixed(2)}s<br />
                Progress: {videoInfo.duration ? Math.round((videoInfo.currentTime / videoInfo.duration) * 100) : 0}%
              </div>
            </div>
            
            <div>
              <div className="font-medium">Buffered Ranges:</div>
              <div className="ml-4 text-sm">
                {videoInfo.buffered || 'None'}
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-x-2">
            <button 
              onClick={() => videoRef.current?.play()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Play
            </button>
            <button 
              onClick={() => videoRef.current?.pause()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Pause
            </button>
            <button 
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = 0;
                  videoRef.current.load();
                }
              }}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
            >
              Reload
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Technical Notes</h2>
        <p className="mb-4">
          This debug page shows detailed technical information about the video playback.
          It's useful for diagnosing playback issues and understanding how the browser
          is handling the video stream.
        </p>
        
        <h3 className="text-lg font-medium mt-4 mb-2">Explanation of States:</h3>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li><strong>HAVE_NOTHING (0)</strong>: No information available</li>
          <li><strong>HAVE_METADATA (1)</strong>: Metadata (like duration) loaded</li>
          <li><strong>HAVE_CURRENT_DATA (2)</strong>: Data for current position loaded</li>
          <li><strong>HAVE_FUTURE_DATA (3)</strong>: Data for current and next frame loaded</li>
          <li><strong>HAVE_ENOUGH_DATA (4)</strong>: Enough data for continuous playback</li>
        </ul>
        
        <h3 className="text-lg font-medium mt-4 mb-2">Network States:</h3>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li><strong>NETWORK_EMPTY (0)</strong>: Element not initialized</li>
          <li><strong>NETWORK_IDLE (1)</strong>: Element initialized but not using network</li>
          <li><strong>NETWORK_LOADING (2)</strong>: Browser is downloading data</li>
          <li><strong>NETWORK_NO_SOURCE (3)</strong>: Source not found</li>
        </ul>
      </div>
    </div>
  );
}