import { useEffect, useState } from "react";
import SafeHelmet from "@/components/SafeHelmet";
import ScrollToTop from "@/components/ScrollToTop";
import AirbnbHero from "@/components/airbnb/AirbnbHero";

export default function AirbnbRentals() {
  const [videoChecked, setVideoChecked] = useState(false);
  
  useEffect(() => {
    // Check if video file exists
    fetch('/videos/property-showcase.mp4', { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          console.log('✅ Video file accessible from AirbnbRentals page');
          console.log(`Content-Type: ${response.headers.get('content-type')}`);
          console.log(`Content-Length: ${response.headers.get('content-length')} bytes`);
        } else {
          console.error(`❌ Video file not accessible from AirbnbRentals page: ${response.status}`);
        }
        setVideoChecked(true);
      })
      .catch(error => {
        console.error(`❌ Error checking video file: ${error.message}`);
        setVideoChecked(true);
      });
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      
      <SafeHelmet
        title="Video Test | Ohana Realty"
        description="Testing video playback capabilities"
        canonicalPath="/airbnb"
      />
      
      {/* Just the hero section with video */}
      <AirbnbHero />
      
      {/* Debug info */}
      <div className="max-w-5xl mx-auto w-full px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Video Loading Test</h2>
        <div className="bg-slate-100 p-6 rounded-lg">
          <p className="mb-4">Status: {videoChecked ? "Video check completed" : "Checking video..."}</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Video URL: <code className="bg-slate-200 px-2 py-1 rounded">/videos/property-showcase.mp4</code></li>
            <li>Debug mode: Enabled</li>
            <li>Controls: Visible for testing</li>
            <li>Check console for detailed logs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}