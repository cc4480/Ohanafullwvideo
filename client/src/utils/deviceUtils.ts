/**
 * Utility functions for device detection and responsive behavior
 */

export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'large-screen';

/**
 * Detects the current device type based on screen width
 * @returns The detected device type
 */
export const getDeviceType = (): DeviceType => {
  // We need to check if window is defined for SSR compatibility
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  if (width < 1920) return 'desktop';
  return 'large-screen';
};

/**
 * Get the optimal video quality based on device type and connection speed
 * @returns Quality level: 'low', 'medium', 'high', or 'ultra'
 */
export const getOptimalVideoQuality = (): 'low' | 'medium' | 'high' | 'ultra' => {
  const deviceType = getDeviceType();
  
  // Check if the browser has connection info available
  const connection = (navigator as any).connection;
  const isSlowConnection = connection && (
    connection.saveData || 
    connection.effectiveType === 'slow-2g' || 
    connection.effectiveType === '2g' ||
    connection.downlink < 1
  );
  
  // Determine quality based on device and connection
  if (isSlowConnection || deviceType === 'mobile') return 'low';
  if (deviceType === 'tablet') return 'medium';
  if (deviceType === 'desktop') return 'high';
  return 'ultra'; // large-screen
};

/**
 * Get video settings based on device type
 * @returns Object with video display settings
 */
export const getVideoDisplaySettings = () => {
  const deviceType = getDeviceType();
  
  // Base settings
  const settings = {
    aspectRatio: '16/9',
    maxWidth: '100%',
    maxHeight: '100vh',
    bufferSize: 8 * 1024 * 1024, // 8MB default buffer
    objectFit: 'contain' as 'contain' | 'cover',
    playbackRate: 1.0,
    preload: 'auto' as 'auto' | 'metadata' | 'none',
    background: '#000000',
  };
  
  // Device-specific adjustments
  switch (deviceType) {
    case 'mobile':
      return {
        ...settings,
        bufferSize: 4 * 1024 * 1024, // 4MB buffer for mobile
        preload: 'metadata', // Use metadata preload on mobile to save data
        maxHeight: '80vh', // Limit height on mobile
      };
      
    case 'tablet':
      return {
        ...settings,
        bufferSize: 8 * 1024 * 1024, // 8MB buffer
        maxHeight: '90vh',
      };
      
    case 'desktop':
      return {
        ...settings,
        bufferSize: 16 * 1024 * 1024, // 16MB buffer for desktop
      };
      
    case 'large-screen':
      return {
        ...settings,
        bufferSize: 32 * 1024 * 1024, // 32MB buffer for large screens
        maxWidth: '100%', // Full width
      };
      
    default:
      return settings;
  }
};

/**
 * Determines if the device is capable of high-performance video playback
 * @returns Boolean indicating high-performance capability
 */
export const isHighPerformanceDevice = (): boolean => {
  // Check if the browser reports more than 4 logical processors
  const hasMultipleCores = typeof navigator !== 'undefined' && navigator.hardwareConcurrency > 4;
  
  // Check device memory if available (Chrome-specific)
  const hasHighMemory = typeof navigator !== 'undefined' && (navigator as any).deviceMemory > 4; // More than 4GB
  
  // Check if device pixel ratio is high (suggests high-end display)
  const hasHighDPI = typeof window !== 'undefined' && window.devicePixelRatio > 1.5;
  
  // Check if it's a large screen device
  const isLargeScreen = getDeviceType() === 'large-screen' || getDeviceType() === 'desktop';
  
  // Count how many high-performance indicators we have
  let highPerfCount = 0;
  if (hasMultipleCores) highPerfCount++;
  if (hasHighMemory) highPerfCount++;
  if (hasHighDPI) highPerfCount++;
  if (isLargeScreen) highPerfCount++;
  
  // Return true if we have at least 2 indicators of high performance
  return highPerfCount >= 2;
};
