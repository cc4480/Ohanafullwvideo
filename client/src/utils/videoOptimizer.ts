/**
 * Video Performance Optimizer
 * Provides advanced adaptive streaming capabilities for the Ohana Video Player
 */

export interface VideoQualitySettings {
  bufferTarget: number;       // Target buffer in seconds
  maxBufferTarget: number;    // Maximum buffer size in seconds
  initialQuality: string;     // Initial quality level to use ('mobile', 'standard', 'highperf')
  enableAdaptiveStreaming: boolean; // Whether to automatically adapt quality based on performance
  adaptionThreshold: number;  // How many consistent good/bad samples before changing quality
  stallThreshold: number;     // Stall time in milliseconds before considering downgrading
  stallFrequencyThreshold: number; // Number of stalls within interval before downgrading
  stallFrequencyInterval: number;  // Time window to measure stall frequency (ms)
  bitrateUpgradeFactor: number;    // How much better performance needs to be to upgrade
  networkConditionSamples: number;  // Number of samples to average for network conditions
  useNativeHls: boolean;      // Whether to use native HLS when available
  forceMobileOnMobileDevices: boolean; // Always use mobile quality on detected mobile devices
}

// Default optimized settings
export const DEFAULT_VIDEO_QUALITY_SETTINGS: VideoQualitySettings = {
  bufferTarget: 8,            // Target 8 seconds of buffered video
  maxBufferTarget: 30,        // Don't buffer more than 30 seconds to save bandwidth
  initialQuality: 'standard', // Start with standard quality
  enableAdaptiveStreaming: true,
  adaptionThreshold: 5,       // Need 5 consistent samples before changing quality
  stallThreshold: 200,        // 200ms stall is considered significant
  stallFrequencyThreshold: 3, // 3 stalls within interval trigger downgrade
  stallFrequencyInterval: 30000, // 30 second interval for measuring stalls
  bitrateUpgradeFactor: 1.5,  // Need 1.5x better performance to upgrade
  networkConditionSamples: 10, // Average over 10 samples for smooth transitions
  useNativeHls: true,         // Use native HLS when supported by browser
  forceMobileOnMobileDevices: true // Force mobile quality on mobile devices
};

// Quality levels with their configurations
export const QUALITY_LEVELS = [
  {
    id: 'mobile',
    endpoint: '/api/video/ohana/mobile',
    chunkSize: 2 * 1024 * 1024, // 2MB chunks
    bitrateEstimate: 1500000,   // 1.5 Mbps
    maxHeight: 720,             // 720p max resolution
    label: 'Data Saver',
    description: 'Low data usage, suitable for mobile connections'
  },
  {
    id: 'standard',
    endpoint: '/api/video/ohana',
    chunkSize: 4 * 1024 * 1024, // 4MB chunks
    bitrateEstimate: 3000000,   // 3 Mbps
    maxHeight: 1080,            // 1080p max resolution
    label: 'Standard',
    description: 'Balanced quality and performance for most connections'
  },
  {
    id: 'highperf',
    endpoint: '/api/video/ohana/highperf',
    chunkSize: 8 * 1024 * 1024, // 8MB chunks
    bitrateEstimate: 6000000,   // 6 Mbps
    maxHeight: 2160,            // 4K max resolution
    label: 'High Quality',
    description: 'Best quality for fast connections'
  }
];

// Device detection functions
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Network speed measurement
export class NetworkSpeedMonitor {
  private samples: number[] = [];
  private maxSamples: number;
  private lastCheckTime: number = 0;
  private lastBytesLoaded: number = 0;
  
  constructor(maxSamples: number = 10) {
    this.maxSamples = maxSamples;
  }
  
  // Record a new speed sample in bytes per second
  addSample(bytesLoaded: number): void {
    const now = performance.now();
    
    // Skip if not enough time has passed
    if (now - this.lastCheckTime < 1000) return;
    
    const timeDiff = (now - this.lastCheckTime) / 1000; // in seconds
    const bytesDiff = bytesLoaded - this.lastBytesLoaded;
    
    if (timeDiff > 0 && this.lastCheckTime > 0 && bytesDiff > 0) {
      const bytesPerSecond = bytesDiff / timeDiff;
      
      // Add to samples
      this.samples.push(bytesPerSecond);
      
      // Keep only the most recent samples
      if (this.samples.length > this.maxSamples) {
        this.samples.shift();
      }
    }
    
    this.lastCheckTime = now;
    this.lastBytesLoaded = bytesLoaded;
  }
  
  // Get the average speed in bytes per second
  getAverageSpeed(): number {
    if (this.samples.length === 0) return 0;
    
    const sum = this.samples.reduce((acc, val) => acc + val, 0);
    return sum / this.samples.length;
  }
  
  // Get the average speed in Mbps
  getAverageSpeedMbps(): number {
    const bytesPerSecond = this.getAverageSpeed();
    return (bytesPerSecond * 8) / 1000000; // Convert bytes/sec to Mbps
  }
  
  // Reset measurements
  reset(): void {
    this.samples = [];
    this.lastCheckTime = 0;
    this.lastBytesLoaded = 0;
  }
  
  // Get reliability score (0-1) based on variance of samples
  getReliabilityScore(): number {
    if (this.samples.length < 3) return 0;
    
    const avg = this.getAverageSpeed();
    const variance = this.samples.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / this.samples.length;
    const stdDev = Math.sqrt(variance);
    
    // Calculate coefficient of variation (lower is more reliable)
    const cv = stdDev / avg;
    
    // Convert to reliability score (1 - normalized CV)
    return Math.max(0, Math.min(1, 1 - (cv / 2)));
  }
}

// Adaptive streaming quality selector
export class AdaptiveQualitySelector {
  private settings: VideoQualitySettings;
  private currentQuality: string;
  private networkMonitor: NetworkSpeedMonitor;
  private goodPerformanceSamples: number = 0;
  private poorPerformanceSamples: number = 0;
  private stallEvents: number[] = [];
  
  constructor(settings: VideoQualitySettings = DEFAULT_VIDEO_QUALITY_SETTINGS) {
    this.settings = settings;
    this.currentQuality = this.determineInitialQuality();
    this.networkMonitor = new NetworkSpeedMonitor(settings.networkConditionSamples);
  }
  
  // Determine the best starting quality based on device and settings
  private determineInitialQuality(): string {
    // If forced mobile for mobile devices is enabled
    if (this.settings.forceMobileOnMobileDevices && isMobileDevice()) {
      return 'mobile';
    }
    
    return this.settings.initialQuality;
  }
  
  // Update with new video playback metrics
  update(metrics: {
    bytesLoaded: number;
    currentTime: number;
    buffered: TimeRanges;
    playing: boolean;
  }): void {
    // Update network speed measurements
    this.networkMonitor.addSample(metrics.bytesLoaded);
    
    // Skip further analysis if adaptive streaming is disabled
    if (!this.settings.enableAdaptiveStreaming) return;
    
    // Calculate buffer ahead
    let bufferAhead = 0;
    if (metrics.buffered.length > 0) {
      const currentBufferEnd = metrics.buffered.end(metrics.buffered.length - 1);
      bufferAhead = currentBufferEnd - metrics.currentTime;
    }
    
    // Current network speed in Mbps
    const currentSpeedMbps = this.networkMonitor.getAverageSpeedMbps();
    
    // Get current quality settings
    const currentQualitySettings = QUALITY_LEVELS.find(q => q.id === this.currentQuality);
    if (!currentQualitySettings) return;
    
    // Check if network is comfortably faster than current bitrate
    const canUpgrade = currentSpeedMbps > (currentQualitySettings.bitrateEstimate / 1000000) * this.settings.bitrateUpgradeFactor;
    
    // Check if buffer is healthy
    const bufferHealthy = bufferAhead >= this.settings.bufferTarget;
    
    // Track good/poor performance
    if (metrics.playing && bufferHealthy && canUpgrade) {
      this.goodPerformanceSamples++;
      this.poorPerformanceSamples = 0;
      
      // Consider upgrading quality
      if (this.goodPerformanceSamples >= this.settings.adaptionThreshold) {
        this.considerQualityUpgrade();
      }
    } else if (!bufferHealthy || currentSpeedMbps < (currentQualitySettings.bitrateEstimate / 1000000)) {
      this.poorPerformanceSamples++;
      this.goodPerformanceSamples = 0;
      
      // Consider downgrading quality
      if (this.poorPerformanceSamples >= this.settings.adaptionThreshold) {
        this.considerQualityDowngrade();
      }
    } else {
      // Neutral performance, reset counters
      this.goodPerformanceSamples = 0;
      this.poorPerformanceSamples = 0;
    }
  }
  
  // Record a playback stall event
  recordStallEvent(): void {
    const now = performance.now();
    this.stallEvents.push(now);
    
    // Only keep stall events within the monitoring interval
    const cutoffTime = now - this.settings.stallFrequencyInterval;
    this.stallEvents = this.stallEvents.filter(time => time >= cutoffTime);
    
    // Check if we've had too many stalls recently
    if (this.stallEvents.length >= this.settings.stallFrequencyThreshold) {
      // Force immediate quality downgrade due to frequent stalling
      this.considerQualityDowngrade(true);
      // Reset stall counter after taking action
      this.stallEvents = [];
    }
  }
  
  // Consider upgrading video quality
  private considerQualityUpgrade(): void {
    const currentIndex = QUALITY_LEVELS.findIndex(q => q.id === this.currentQuality);
    
    // Already at highest quality
    if (currentIndex >= QUALITY_LEVELS.length - 1) {
      this.goodPerformanceSamples = 0; // Reset counter
      return;
    }
    
    // Get next higher quality
    const nextQuality = QUALITY_LEVELS[currentIndex + 1].id;
    
    // Don't upgrade beyond highperf on mobile devices if forceMobileOnMobileDevices is true
    if (this.settings.forceMobileOnMobileDevices && isMobileDevice() && nextQuality === 'highperf') {
      this.goodPerformanceSamples = 0; // Reset counter
      return;
    }
    
    // Upgrade quality
    this.currentQuality = nextQuality;
    console.log(`OhanaVideoPlayer: Upgrading quality to ${nextQuality}`);
    
    // Reset performance counters
    this.goodPerformanceSamples = 0;
    this.poorPerformanceSamples = 0;
  }
  
  // Consider downgrading video quality
  private considerQualityDowngrade(forceDowngrade: boolean = false): void {
    const currentIndex = QUALITY_LEVELS.findIndex(q => q.id === this.currentQuality);
    
    // Already at lowest quality
    if (currentIndex <= 0) {
      this.poorPerformanceSamples = 0; // Reset counter
      return;
    }
    
    // Only downgrade if really necessary or forced
    if (forceDowngrade || this.poorPerformanceSamples >= this.settings.adaptionThreshold * 2) {
      // Get next lower quality
      const nextQuality = QUALITY_LEVELS[currentIndex - 1].id;
      
      // Downgrade quality
      this.currentQuality = nextQuality;
      console.log(`OhanaVideoPlayer: Downgrading quality to ${nextQuality} due to poor performance`);
      
      // Reset performance counters
      this.goodPerformanceSamples = 0;
      this.poorPerformanceSamples = 0;
    }
  }
  
  // Get current quality ID
  getCurrentQuality(): string {
    return this.currentQuality;
  }
  
  // Get current quality settings
  getCurrentQualitySettings() {
    return QUALITY_LEVELS.find(q => q.id === this.currentQuality);
  }
  
  // Manually set quality (overrides adaptive behavior)
  setQuality(qualityId: string): boolean {
    const qualityExists = QUALITY_LEVELS.some(q => q.id === qualityId);
    
    if (qualityExists) {
      this.currentQuality = qualityId;
      
      // Reset metrics
      this.goodPerformanceSamples = 0;
      this.poorPerformanceSamples = 0;
      this.stallEvents = [];
      
      return true;
    }
    
    return false;
  }
  
  // Get all available quality options
  getAvailableQualities() {
    return QUALITY_LEVELS.map(q => ({
      id: q.id,
      label: q.label,
      description: q.description,
      current: q.id === this.currentQuality
    }));
  }
  
  // Get performance statistics
  getPerformanceStats() {
    return {
      networkSpeedMbps: this.networkMonitor.getAverageSpeedMbps(),
      reliabilityScore: this.networkMonitor.getReliabilityScore(),
      currentQuality: this.currentQuality,
      goodPerformanceSamples: this.goodPerformanceSamples,
      poorPerformanceSamples: this.poorPerformanceSamples,
      recentStallEvents: this.stallEvents.length
    };
  }
}

// Video buffer management
export class BufferManager {
  private settings: VideoQualitySettings;
  
  constructor(settings: VideoQualitySettings = DEFAULT_VIDEO_QUALITY_SETTINGS) {
    this.settings = settings;
  }
  
  // Calculate optimal seek position based on current state
  calculateOptimalSeekPosition(currentTime: number, buffered: TimeRanges): number | null {
    // If we have buffered data ahead, no need to seek
    for (let i = 0; i < buffered.length; i++) {
      if (currentTime >= buffered.start(i) && currentTime < buffered.end(i)) {
        return null; // Already in a buffered range
      }
    }
    
    // Find closest buffered range
    let closestStart = -1;
    let minDistance = Infinity;
    
    for (let i = 0; i < buffered.length; i++) {
      const distance = Math.abs(currentTime - buffered.start(i));
      if (distance < minDistance) {
        minDistance = distance;
        closestStart = buffered.start(i);
      }
    }
    
    // If we found a buffered range and it's close enough, seek to it
    if (closestStart >= 0 && minDistance < 5) {
      return closestStart;
    }
    
    return null; // No good seek position found
  }
  
  // Check if we should preload more content
  shouldPreloadMoreContent(currentTime: number, buffered: TimeRanges): boolean {
    let bufferAhead = 0;
    
    // Find the buffer range that contains current playback position
    for (let i = 0; i < buffered.length; i++) {
      if (currentTime >= buffered.start(i) && currentTime <= buffered.end(i)) {
        bufferAhead = buffered.end(i) - currentTime;
        break;
      }
    }
    
    // Preload more if buffer ahead is less than target
    return bufferAhead < this.settings.bufferTarget;
  }
  
  // Determine if we should abort loading to prevent over-buffering
  shouldAbortLoading(currentTime: number, buffered: TimeRanges): boolean {
    let maxBufferAhead = 0;
    
    // Find maximum buffered ahead time
    for (let i = 0; i < buffered.length; i++) {
      if (currentTime <= buffered.end(i)) {
        const bufferAhead = buffered.end(i) - Math.max(currentTime, buffered.start(i));
        maxBufferAhead = Math.max(maxBufferAhead, bufferAhead);
      }
    }
    
    // Stop loading if we've buffered more than max target
    return maxBufferAhead > this.settings.maxBufferTarget;
  }
}
