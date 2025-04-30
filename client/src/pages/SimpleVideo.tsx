import React from 'react';

export default function SimpleVideo() {
  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Simple Video Player</h1>
      
      <div className="max-w-4xl mx-auto">
        {/* Simplest possible video element */}
        <video 
          src="/property-video.mp4" 
          controls 
          muted
          autoPlay
          width="100%" 
          height="auto"
          className="rounded-lg shadow-lg mb-6"
        >
          Your browser does not support the video tag.
        </video>
        
        <p className="text-center text-gray-600">
          Source: /property-video.mp4
        </p>
      </div>
    </div>
  );
}