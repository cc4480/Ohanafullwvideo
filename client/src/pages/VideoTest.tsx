import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { VideoPlayer } from '@/components/ui/video-player';

export default function VideoTest() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  
  const addLog = (message: string) => {
    setLogs(prevLogs => [...prevLogs, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    // Check if video file exists
    fetch('/videos/property-showcase.mp4', { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          addLog(`✅ Video exists: ${response.headers.get('content-type')}, size: ${response.headers.get('content-length')} bytes`);
        } else {
          addLog(`❌ Video not found, status: ${response.status}`);
        }
      })
      .catch(error => {
        addLog(`❌ Error checking video: ${error}`);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Video Player Test</h1>
      
      <div className="mb-6">
        <p className="mb-4">Testing video: <code>/videos/property-showcase.mp4</code></p>
        
        <div className="h-[60vh] overflow-hidden rounded-lg relative mb-4">
          {videoError ? (
            <div className="absolute inset-0 bg-muted flex items-center justify-center text-center p-4">
              <div>
                <p className="text-xl font-bold text-red-500 mb-2">Video Error</p>
                <p>The video could not be loaded</p>
              </div>
            </div>
          ) : (
            <VideoPlayer
              src="/videos/property-showcase.mp4"
              autoPlay={true}
              muted={true}
              loop={true}
              controls={true}
              className="w-full h-full object-cover"
              onLoadedData={() => {
                addLog("✅ Video loaded successfully");
                setVideoLoaded(true);
              }}
              onError={() => {
                addLog("❌ Video failed to load");
                setVideoError(true);
              }}
            />
          )}
        </div>
        
        <div className="flex items-center gap-4 mb-6">
          <div className={`px-3 py-1 rounded-full ${videoLoaded ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {videoLoaded ? 'Video Loaded ✓' : 'Loading...'}
          </div>
          
          <div className={`px-3 py-1 rounded-full ${videoError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {videoError ? 'Video Error ✗' : 'No Errors'}
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Debug Logs</h2>
        <div className="border rounded-lg p-4 bg-slate-50 h-60 overflow-auto">
          {logs.length === 0 ? (
            <p className="text-muted-foreground">No logs yet...</p>
          ) : (
            <ul className="list-none space-y-1">
              {logs.map((log, index) => (
                <li key={index} className="font-mono text-sm">{log}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        <Button 
          variant="secondary" 
          onClick={() => window.location.href = '/'}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}