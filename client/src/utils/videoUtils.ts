/**
 * Video utilities for advanced YouTube-like video handling
 */

interface VideoSource {
  src: string;
  type: string;
  quality: 'low' | 'medium' | 'high';
}

/**
 * Checks if the browser supports WebM format
 * @returns boolean indicating WebM support
 */
export function supportsWebM(): boolean {
  const video = document.createElement('video');
  return video.canPlayType('video/webm; codecs="vp8, vorbis"') !== '';
}

/**
 * Checks if the browser supports h.264 for MP4
 * @returns boolean indicating MP4 with h.264 support
 */
export function supportsMP4(): boolean {
  const video = document.createElement('video');
  return video.canPlayType('video/mp4; codecs="avc1.42E01E"') !== '';
}

/**
 * Gets the optimal video source based on browser capabilities and device performance
 * @param videoPath Base path of the video
 * @param isHighPerformance Whether the device is high-performance
 * @returns Array of video sources in priority order
 */
export function getOptimalVideoSources(videoPath: string, isHighPerformance: boolean): VideoSource[] {
  const sources: VideoSource[] = [];
  
  // Modern browsers support WebM which is much more efficient
  if (supportsWebM()) {
    // Add WebM sources in different qualities
    if (isHighPerformance) {
      sources.push({
        src: `${videoPath}/highperf`,
        type: 'video/webm',
        quality: 'high'
      });
    } else {
      sources.push({
        src: `${videoPath}/mobile`,
        type: 'video/webm',
        quality: 'medium'
      });
    }
  }
  
  // Add MP4 sources as fallback
  if (supportsMP4()) {
    if (isHighPerformance) {
      sources.push({
        src: `${videoPath}/highperf`,
        type: 'video/mp4',
        quality: 'high'
      });
    } else {
      sources.push({
        src: `${videoPath}/mobile`,
        type: 'video/mp4',
        quality: 'low'
      });
    }
    
    // Always add the standard quality as a final fallback
    sources.push({
      src: videoPath,
      type: 'video/mp4',
      quality: 'medium'
    });
  }
  
  return sources;
}

/**
 * Preloads video metadata for faster startup
 * @param videoSources List of video sources to try preloading
 */
export function preloadVideoMetadata(videoSources: VideoSource[]): void {
  // Only preload the first few sources to avoid excessive network requests
  videoSources.slice(0, 2).forEach(source => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'video';
    link.href = source.src;
    link.type = source.type;
    document.head.appendChild(link);
  });
}

/**
 * Loads the optimal video source into a video element
 * @param videoElement The video element to load the source into
 * @param sources Array of video sources in priority order
 * @returns Promise that resolves when a playable source is loaded
 */
export function loadOptimalSource(videoElement: HTMLVideoElement, sources: VideoSource[]): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!videoElement || sources.length === 0) {
      reject(new Error('Invalid video element or no sources provided'));
      return;
    }
    
    let currentSourceIndex = 0;
    
    // Try loading a source
    const trySource = () => {
      if (currentSourceIndex >= sources.length) {
        reject(new Error('All video sources failed to load'));
        return;
      }
      
      const source = sources[currentSourceIndex];
      console.log(`Trying video source: ${source.src} (${source.type}, ${source.quality} quality)`);
      
      videoElement.src = source.src;
      videoElement.load();
    };
    
    // Setup event listeners
    const handleCanPlay = () => {
      console.log(`Successfully loaded source: ${sources[currentSourceIndex].src}`);
      cleanup();
      resolve();
    };
    
    const handleError = () => {
      console.warn(`Failed to load source: ${sources[currentSourceIndex].src}`);
      currentSourceIndex++;
      trySource();
    };
    
    // Clean up event listeners
    const cleanup = () => {
      videoElement.removeEventListener('canplay', handleCanPlay);
      videoElement.removeEventListener('error', handleError);
    };
    
    // Add event listeners
    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('error', handleError);
    
    // Start loading the first source
    trySource();
  });
}
