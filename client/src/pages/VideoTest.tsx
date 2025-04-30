import React from 'react';
import OhanaVideoPlayer from '../components/ui/OhanaVideoPlayer';

export default function VideoTest() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Video Test Page</h1>
      <div className="w-full max-w-4xl mx-auto aspect-video">
        <OhanaVideoPlayer
          src="/api/video/ohana"
          autoPlay={true}
          muted={true}
          loop={true}
          className="w-full h-full rounded-lg shadow-lg"
          onError={(error) => console.error("Video error:", error)}
        />
      </div>
      <div className="mt-8 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-2">Video Details</h2>
        <p className="mb-4">
          This is a test page for the Ohana Realty video player component.
          The video is being served via our optimized video streaming API.
        </p>
        <p>
          The video player includes:
        </p>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>Optimized chunked streaming for large files</li>
          <li>Adaptive playback controls</li>
          <li>Error handling and recovery</li>
          <li>Browser compatibility improvements</li>
        </ul>
      </div>
    </div>
  );
}