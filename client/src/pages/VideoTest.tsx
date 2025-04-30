import React from 'react';

export function VideoTest() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Video Test Page</h1>
      
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Basic Video Player</h2>
        
        <div className="aspect-video bg-black rounded-md overflow-hidden">
          <video 
            controls
            autoPlay
            muted
            loop
            className="w-full h-full object-contain"
          >
            <source src="/property-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>Video path: <code className="bg-gray-100 px-2 py-1 rounded">/property-video.mp4</code></p>
        </div>
      </div>
    </div>
  );
}

export default VideoTest;