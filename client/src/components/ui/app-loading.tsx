import React, { useEffect, useState } from 'react';

interface AppLoadingProps {
  /**
   * Minimum time to show the loading screen in milliseconds
   * This prevents flashing of loading screen for very fast loads
   */
  minimumDuration?: number;
}

/**
 * Animated loading component for showing during initial app load
 * Uses optimized animation techniques for better performance
 */
export function AppLoading({ minimumDuration = 800 }: AppLoadingProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    // Simulated loading progress with optimized timeouts
    const startTime = Date.now();
    let progressInterval: number;
    let hideTimeout: number;
    
    // Update progress in small increments
    progressInterval = window.setInterval(() => {
      setProgress(prev => {
        // Accelerate progress over time but never reach 100% until actually loaded
        const newProgress = prev + (100 - prev) * 0.08;
        return Math.min(98, newProgress);
      });
    }, 100);
    
    // Ensure loader stays visible for minimum duration for better UX
    hideTimeout = window.setTimeout(() => {
      // Finish progress animation
      setProgress(100);
      
      // Start fade out animation 
      setTimeout(() => setVisible(false), 300);
    }, minimumDuration);
    
    return () => {
      clearInterval(progressInterval);
      clearTimeout(hideTimeout);
    };
  }, [minimumDuration]);
  
  if (!visible) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transform-gpu"
      style={{
        opacity: progress === 100 ? 0 : 1,
        transition: 'opacity 0.4s ease-in-out',
      }}
    >
      <div className="w-full max-w-md px-4">
        <div className="flex flex-col gap-4 items-center justify-center">
          {/* App Logo */}
          <div className="animate-pulse mb-2">
            <div className="text-3xl font-semibold text-primary">Ohana Realty</div>
          </div>
          
          {/* Animated loading bar with progressive filling */}
          <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transform-gpu" 
              style={{ 
                width: `${progress}%`,
                transition: 'width 0.4s ease-out'
              }}
            />
          </div>
          
          {/* Loading text */}
          <div className="text-sm text-muted-foreground animate-pulse">
            Loading your experience...
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppLoading;