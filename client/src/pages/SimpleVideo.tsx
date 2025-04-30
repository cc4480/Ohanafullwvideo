import React from 'react';

export default function SimpleVideo() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Simple Video Test</h1>
      
      <div className="max-w-3xl mx-auto">
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-lg">
          <video 
            src="/api/video/ohana"
            controls
            autoPlay
            muted
            playsInline
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="mt-6 bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-semibold mb-3">About This Test</h2>
          <p className="text-gray-700">
            This page uses a simple HTML5 video element to test video playback without the 
            custom Ohana video player component. It uses the same streaming API endpoint
            (/api/video/ohana) as the custom player, but relies entirely on the browser's
            native video controls and features.
          </p>
          
          <div className="mt-4 flex space-x-4">
            <a 
              href="/video/test" 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              View Custom Player
            </a>
            <a 
              href="/video/debug" 
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Video Debug Tools
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}