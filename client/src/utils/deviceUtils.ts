/**
 * Utility functions for device detection and responsive behavior
 */

export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'large-screen';
export type DevicePerformance = 'low' | 'medium' | 'high';

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
 * Detects device performance capabilities based on various factors
 * @returns The estimated performance level of the device
 */
export const getDevicePerformance = (): DevicePerformance => {
  // Check if browser environment exists
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'medium'; // Default for SSR
  }
  
  // Factors that indicate device performance
  const factors = {
    // CPU cores (logical processors)
    cores: navigator.hardwareConcurrency || 2,
    
    // Memory (if available through navigator)
    memory: (navigator as any).deviceMemory || 2,
    
    // Device pixel ratio as a proxy for screen quality/device tier
    pixelRatio: window.devicePixelRatio || 1,
    
    // Battery status if available
    lowBattery: false,
    
    // User Agent string for rough device detection
    userAgent: navigator.userAgent.toLowerCase(),
    
    // Connection type if available
    slowConnection: false
  };
  
  // Check connection speed if available
  const connection = (navigator as any).connection;
  if (connection) {
    factors.slowConnection = (
      connection.saveData || 
      connection.effectiveType === 'slow-2g' || 
      connection.effectiveType === '2g' ||
      connection.downlink < 1
    );
  }
  
  // Check battery status if available
  const battery = (navigator as any).getBattery ? (navigator as any).getBattery() : null;
  if (battery && (battery as any).level < 0.15) {
    factors.lowBattery = true;
  }
  
  // Calculate performance score
  let performanceScore = 0;
  
  // Score based on cores
  if (factors.cores >= 8) performanceScore += 3;
  else if (factors.cores >= 4) performanceScore += 2;
  else if (factors.cores >= 2) performanceScore += 1;
  
  // Score based on memory
  if (factors.memory >= 8) performanceScore += 3;
  else if (factors.memory >= 4) performanceScore += 2;
  else if (factors.memory >= 2) performanceScore += 1;
  
  // Score based on pixel ratio (often correlates with device tier)
  if (factors.pixelRatio >= 3) performanceScore += 2;
  else if (factors.pixelRatio >= 2) performanceScore += 1;
  
  // Penalty for low battery
  if (factors.lowBattery) performanceScore -= 1;
  
  // Penalty for slow connection
  if (factors.slowConnection) performanceScore -= 2;
  
  // Detect OS for additional context
  const isIOS = /iphone|ipad|ipod/.test(factors.userAgent);
  const isAndroid = /android/.test(factors.userAgent);
  const isWindowsPhone = /windows phone/.test(factors.userAgent);
  const isMobile = isIOS || isAndroid || isWindowsPhone;
  
  // Check for known lower-performance mobile devices (older or budget phones)
  if (isMobile) {
    // Generally reduce score for all mobile devices
    performanceScore -= 1;
    
    // Further reduction for older iOS devices (iPhone 6/7/8 generation and older)
    if (isIOS && (/iPhone ([0-8]|SE|X)/.test(factors.userAgent) || /iPhone OS ([0-9]|10|11|12)/.test(factors.userAgent))) {
      performanceScore -= 1;
    }
    
    // For Android, check if it's a lower-end device (rough estimation)
    if (isAndroid && factors.cores <= 4) {
      performanceScore -= 1;
    }
  }
  
  // Determine performance level from score
  if (performanceScore >= 4) return 'high';
  if (performanceScore >= 1) return 'medium';
  return 'low';
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
 * Get YouTube-like video settings based on device type and performance capabilities
 * @returns Object with optimized video display settings like YouTube
 */
export const getVideoDisplaySettings = () => {
  const deviceType = getDeviceType();
  const devicePerformance = getDevicePerformance();
  
  // Check connection quality if available (YouTube considers this very important)
  const connection = (navigator as any).connection;
  const isSlowConnection = connection && (
    connection.saveData || 
    connection.effectiveType === 'slow-2g' || 
    connection.effectiveType === '2g' ||
    connection.downlink < 1
  );
  
  const isCellular = connection && (connection.type === 'cellular');
  
  // Additional detection for Safari, which tends to use different buffering mechanics
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  
  // Base settings (YouTube-like defaults)
  const settings = {
    aspectRatio: '16/9',
    maxWidth: '100%',
    maxHeight: '100vh',
    bufferSize: 8 * 1024 * 1024, // 8MB default buffer
    objectFit: 'contain' as 'contain' | 'cover',
    playbackRate: 1.0,
    preload: 'auto' as 'auto' | 'metadata' | 'none',
    background: '#000000',
    videoEndpoint: '/api/video/ohana', // Default endpoint
    playbackQuality: 'high', // Default quality
    maxResolution: 1080, // Default max resolution
    // Additional YouTube-like settings
    chunkSize: 5 * 1024 * 1024, // 5MB chunks (YouTube uses adaptive chunking)
    retryAttempts: 3, // YouTube retries on failure
    useAdaptiveBuffering: true, // YouTube adjusts buffering strategy during playback
  };
  
  // Apply YouTube-like device-specific optimizations
  let deviceSettings = { ...settings };
  
  switch (deviceType) {
    case 'mobile':
      deviceSettings = {
        ...deviceSettings,
        bufferSize: isSafari ? 2 * 1024 * 1024 : 4 * 1024 * 1024, // Lower for Safari
        chunkSize: 1 * 1024 * 1024, // 1MB chunks for mobile like YouTube
        preload: isCellular ? 'metadata' : 'auto', // YouTube only uses metadata on cellular
        maxHeight: '85vh', // Make slightly larger for better viewing
        maxResolution: 720, // YouTube default for mobile
      };
      break;
      
    case 'tablet':
      deviceSettings = {
        ...deviceSettings,
        bufferSize: 6 * 1024 * 1024, // 6MB buffer similar to YouTube tablet
        chunkSize: 2 * 1024 * 1024, // 2MB chunks for tablet
        maxHeight: '90vh',
        maxResolution: isSafari ? 720 : 1080, // Lower for Safari which has different buffering
      };
      break;
      
    case 'desktop':
      deviceSettings = {
        ...deviceSettings,
        bufferSize: 16 * 1024 * 1024, // 16MB buffer for desktop like YouTube
        chunkSize: 8 * 1024 * 1024, // 8MB chunks for faster loading on desktop
        retryAttempts: 5, // More retries on desktop where connection is usually more stable
      };
      break;
      
    case 'large-screen':
      deviceSettings = {
        ...deviceSettings,
        bufferSize: 32 * 1024 * 1024, // 32MB buffer for large screens like YouTube
        chunkSize: 16 * 1024 * 1024, // Larger chunks for TVs and large monitors
        maxWidth: '100%', // Full width
        maxResolution: 1440, // Default to higher resolution
      };
      break;
  }
  
  // YouTube prioritizes connection quality over device in many cases
  if (isSlowConnection) {
    deviceSettings = {
      ...deviceSettings,
      bufferSize: Math.min(deviceSettings.bufferSize, 2 * 1024 * 1024),
      chunkSize: Math.min(deviceSettings.chunkSize, 1 * 1024 * 1024), 
      preload: 'metadata',
      maxResolution: 480,
    };
  }
  
  // Then apply YouTube-like performance-specific settings
  switch (devicePerformance) {
    case 'low':
      return {
        ...deviceSettings,
        videoEndpoint: '/api/video/ohana/mobile', // Use mobile-optimized endpoint
        bufferSize: Math.min(deviceSettings.bufferSize, 2 * 1024 * 1024), // Max 2MB buffer
        chunkSize: Math.min(deviceSettings.chunkSize, 512 * 1024), // 512KB chunks
        preload: 'metadata', // Metadata-only preload to conserve resources
        playbackQuality: 'low',
        maxResolution: 480, // Lower resolution for low-performance devices
        retryAttempts: 2, // Fewer retries to avoid wasting resources
      };
      
    case 'medium':
      return {
        ...deviceSettings,
        // If it's a mobile or tablet with medium performance, still use mobile endpoint
        videoEndpoint: (deviceType === 'mobile' || deviceType === 'tablet' || isSlowConnection) 
          ? '/api/video/ohana/mobile' 
          : deviceSettings.videoEndpoint,
        bufferSize: Math.min(deviceSettings.bufferSize, 6 * 1024 * 1024), // Max 6MB buffer
        chunkSize: Math.min(deviceSettings.chunkSize, 2 * 1024 * 1024), // 2MB chunks
        playbackQuality: 'medium',
        // YouTube ensures a good user experience by limiting resolution based on performance
        maxResolution: Math.min(deviceSettings.maxResolution, 720),
      };
      
    case 'high':
      return {
        ...deviceSettings,
        // YouTube serves higher performance streams on powerful devices
        videoEndpoint: isSlowConnection ? deviceSettings.videoEndpoint : '/api/video/ohana/highperf',
        playbackQuality: 'high',
        // Even on high-performance devices, YouTube is conservative with cellular connections
        bufferSize: isCellular ? Math.min(deviceSettings.bufferSize, 8 * 1024 * 1024) : deviceSettings.bufferSize,
        chunkSize: isCellular ? Math.min(deviceSettings.chunkSize, 4 * 1024 * 1024) : deviceSettings.chunkSize,
      };
      
    default:
      return deviceSettings;
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
  const memoryGB = typeof navigator !== 'undefined' ? (navigator as any).deviceMemory || 4 : 4;
  const hasHighMemory = memoryGB > 4; // More than 4GB
  const hasUltraHighMemory = memoryGB >= 8; // 8GB or more (gaming PC, workstation)
  const hasSuperHighMemory = memoryGB >= 16; // 16GB+ (high-end workstation)
  
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
  
  // Bonus points for ultra-high memory devices
  if (hasUltraHighMemory) highPerfCount++;
  if (hasSuperHighMemory) highPerfCount += 2; // Extra bonus for 16GB+ systems
  
  // Log device capabilities for debugging
  console.log('OhanaVideoPlayer: Device Detection', {
    deviceType: getDeviceType(),
    devicePerformance: getDevicePerformance(),
    videoEndpoint: getVideoDisplaySettings().videoEndpoint,
    playbackQuality: getVideoDisplaySettings().playbackQuality,
    maxResolution: getVideoDisplaySettings().maxResolution,
    bufferSize: getVideoDisplaySettings().bufferSize / (1024 * 1024) + 'MB',
    userAgent: navigator.userAgent,
    cores: navigator.hardwareConcurrency,
    memory: memoryGB,
    viewport: window.innerWidth + 'x' + window.innerHeight,
    pixelRatio: window.devicePixelRatio
  });
  
  // On 16GB+ systems, always return true for high performance
  if (hasSuperHighMemory) {
    console.log('Using adaptive video quality for high-memory system with 16GB+ RAM');
    console.log('Selected video endpoint: /api/video/ohana/highperf');
    return true;
  }
  
  // Return true if we have at least 2 indicators of high performance
  return highPerfCount >= 2;
};
