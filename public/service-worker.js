/**
 * Ohana Realty Service Worker
 * Provides high-performance caching and offline capabilities for the application
 * Implements a sophisticated multi-tier caching strategy for different resource types
 */

// Cache version - increment when making significant changes
const CACHE_VERSION = 2;
const CACHE_NAME = `ohana-realty-v${CACHE_VERSION}`;

// Resources to cache immediately on install (high priority static assets)
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/robots.txt',
  '/assets/index.js',
  '/assets/index.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/offline.html',
  '/shiloh-primary.jpg',
  '/favicon.ico'
];

// API response cache with shorter TTL but longer range
const DYNAMIC_CACHE_NAME = `ohana-realty-dynamic-v${CACHE_VERSION}`;
const DYNAMIC_CACHE_MAX_AGE = 60 * 60 * 1000; // 1 hour

// Video chunks cache with extended TTL for faster video replay
const VIDEO_CACHE_NAME = `ohana-realty-video-v${CACHE_VERSION}`;
const VIDEO_CACHE_MAX_ITEMS = 500; // Limit number of video chunks in cache to avoid bloat
const VIDEO_CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days for video chunks

// Image assets cache for property images, floor plans, etc.
const IMAGE_CACHE_NAME = `ohana-realty-images-v${CACHE_VERSION}`;
const IMAGE_CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days for images

// Font cache with very long TTL as fonts rarely change
const FONT_CACHE_NAME = `ohana-realty-fonts-v${CACHE_VERSION}`;
const FONT_CACHE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days for fonts

// Cache timestamp tracking to implement TTL
const TIMESTAMP_HEADER = 'sw-cache-timestamp';

// In-memory cache hit counter for analytics
let cacheHits = {
  static: 0,
  dynamic: 0,
  video: 0,
  image: 0,
  font: 0,
  miss: 0
};

// Keep track of video chunk URLs that are frequently accessed
let frequentVideoChunks = new Map();

// Log cache performance data periodically
setInterval(() => {
  console.log('Cache performance:', { ...cacheHits });
  console.log('Frequent video chunks:', [...frequentVideoChunks.entries()].slice(0, 10));
}, 10 * 60 * 1000); // Every 10 minutes

// Install event handler
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service worker installing static assets to cache');
      return cache.addAll(STATIC_CACHE_URLS);
    })
  );

  // Activate immediately
  self.skipWaiting();
});

// Activate event handler - manage all cache types and trim as needed
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            // Delete any outdated caches (version mismatch)
            const isOhanaCache = cacheName.startsWith('ohana-realty-');
            if (!isOhanaCache) return false;
            
            // Keep current version caches
            const isCurrentVersion = cacheName.includes(`-v${CACHE_VERSION}`);
            return !isCurrentVersion;
          })
          .map((cacheName) => {
            console.log('Service worker deleting outdated cache:', cacheName);
            return caches.delete(cacheName);
          })
      ).then(() => {
        // After deleting outdated caches, limit the size of our video cache
        return trimVideoCache();
      });
    })
  );

  // Take control immediately
  self.clients.claim();
});

/**
 * Trim the video cache to prevent excessive storage use
 */
async function trimVideoCache() {
  try {
    const cache = await caches.open(VIDEO_CACHE_NAME);
    const requests = await cache.keys();
    const videoRequests = requests.filter(req => req.url.includes('/api/video/'));
    
    if (videoRequests.length > VIDEO_CACHE_MAX_ITEMS) {
      console.log(`Video cache has ${videoRequests.length} items, trimming to ${VIDEO_CACHE_MAX_ITEMS}`);
      
      // Sort by frequency of use (if we have that data)
      const toDelete = videoRequests
        .sort((a, b) => {
          const aCount = frequentVideoChunks.get(a.url) || 0;
          const bCount = frequentVideoChunks.get(b.url) || 0;
          return aCount - bCount; // Delete least accessed first
        })
        .slice(0, videoRequests.length - VIDEO_CACHE_MAX_ITEMS);
      
      for (const request of toDelete) {
        await cache.delete(request);
        // Also remove from frequency tracking
        frequentVideoChunks.delete(request.url);
      }
      
      console.log(`Trimmed ${toDelete.length} items from video cache`);
    }
  } catch (error) {
    console.error('Error trimming video cache:', error);
  }
}

/**
 * Adds a timestamp header to the response for TTL-based cache management
 * @param {Response} response - The response to modify
 * @returns {Response} - A new response with the timestamp header
 */
function addCacheTimestamp(response) {
  // Skip for opaque responses (CORS issues)
  if (response.type === 'opaque') return response;
  
  const timestamp = Date.now();
  const headers = new Headers(response.headers);
  headers.append(TIMESTAMP_HEADER, timestamp.toString());
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  });
}

/**
 * Checks if a cached response is still valid based on its timestamp and TTL
 * @param {Response} response - The cached response to check
 * @param {number} maxAge - The maximum age in milliseconds
 * @returns {boolean} - Whether the response is still valid
 */
function isCacheValid(response, maxAge) {
  // If no timestamp header, consider it indefinitely valid
  const timestampHeader = response.headers.get(TIMESTAMP_HEADER);
  if (!timestampHeader) return true;
  
  const timestamp = parseInt(timestampHeader, 10);
  const now = Date.now();
  return (now - timestamp) < maxAge;
}

/**
 * Advanced network-first strategy with intelligent fallback to cache
 * @param {Request} request - The request to handle
 * @param {string} cacheName - The cache to use
 * @param {Object} options - Additional options
 * @returns {Promise<Response>} - The response
 */
async function networkFirstWithCacheFallback(request, cacheName, options = {}) {
  const { maxAge = Infinity, trackHits = false, hitCategory = 'dynamic' } = options;
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Clone the response to save it to cache
    const responseToCache = networkResponse.clone();
    
    // Add timestamp and cache the response
    const timestampedResponse = addCacheTimestamp(responseToCache);
    const cache = await caches.open(cacheName);
    await cache.put(request, timestampedResponse);
    
    return networkResponse;
  } catch (error) {
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse && isCacheValid(cachedResponse, maxAge)) {
      // Track cache hits if requested
      if (trackHits && hitCategory in cacheHits) {
        cacheHits[hitCategory]++;
      }
      
      return cachedResponse;
    }
    
    // Special handling for video chunks - if we have an almost expired one, use it anyway
    if (hitCategory === 'video' && cachedResponse) {
      console.log('Using expired video chunk from cache:', request.url);
      if (trackHits) cacheHits.video++;
      return cachedResponse;
    }
    
    // If cache also fails or is expired, return a fallback or throw
    if (trackHits) cacheHits.miss++;
    throw error;
  }
}

/**
 * Advanced cache-first strategy with TTL support and network fallback
 * @param {Request} request - The request to handle
 * @param {string} cacheName - The cache to use
 * @param {Object} options - Additional options
 * @returns {Promise<Response>} - The response
 */
async function cacheFirstWithNetworkFallback(request, cacheName, options = {}) {
  const { maxAge = Infinity, trackHits = false, hitCategory = 'static', preloadAdjacentChunks = false } = options;
  
  // Try cache first
  const cachedResponse = await caches.match(request);
  
  // If we have a valid cached response, use it
  if (cachedResponse && isCacheValid(cachedResponse, maxAge)) {
    // Track cache hits if requested
    if (trackHits && hitCategory in cacheHits) {
      cacheHits[hitCategory]++;
    }
    
    // For video chunks, track frequency for preloading optimization
    if (hitCategory === 'video' && request.url.includes('/api/video/')) {
      const urlKey = request.url;
      const count = frequentVideoChunks.get(urlKey) || 0;
      frequentVideoChunks.set(urlKey, count + 1);
      
      // Preload next video chunks in sequence if enabled
      if (preloadAdjacentChunks) {
        // Try to detect the chunk pattern and preload the next chunks
        const urlParts = new URL(request.url);
        const rangeHeader = request.headers.get('range');
        
        // Only preload for range requests
        if (rangeHeader) {
          preloadNextVideoChunks(urlParts.pathname, rangeHeader);
        }
      }
    }
    
    return cachedResponse;
  }
  
  // If cache miss or expired, try network
  try {
    const networkResponse = await fetch(request);
    
    // Clone the response to save it to cache
    const responseToCache = networkResponse.clone();
    
    // Add timestamp and cache the response
    const timestampedResponse = addCacheTimestamp(responseToCache);
    const cache = await caches.open(cacheName);
    
    // For video cache, implement LRU by removing old entries if we have too many
    if (hitCategory === 'video') {
      const keys = await cache.keys();
      if (keys.length > VIDEO_CACHE_MAX_ITEMS) {
        // Remove 10% of the oldest items
        const itemsToRemove = Math.ceil(VIDEO_CACHE_MAX_ITEMS * 0.1);
        for (let i = 0; i < itemsToRemove; i++) {
          await cache.delete(keys[i]);
        }
        console.log(`Trimmed ${itemsToRemove} items from video cache to prevent bloat`);
      }
    }
    
    await cache.put(request, timestampedResponse);
    
    if (trackHits) cacheHits.miss++;
    return networkResponse;
  } catch (error) {
    // If both cache and network fail, return a fallback or throw
    if (request.headers.get('accept')?.includes('text/html')) {
      return caches.match('/offline.html');
    }
    
    if (trackHits) cacheHits.miss++;
    throw error;
  }
}

/**
 * Attempts to predictively preload the next video chunks to improve playback
 * @param {string} videoPath - The video path
 * @param {string} currentRange - The current range header
 */
async function preloadNextVideoChunks(videoPath, currentRange) {
  try {
    // Parse the current range to determine what to preload next
    const matches = currentRange.match(/bytes=(\d+)-(\d+)/);
    if (!matches) return;
    
    const currentStart = parseInt(matches[1], 10);
    const currentEnd = parseInt(matches[2], 10);
    const chunkSize = currentEnd - currentStart + 1;
    
    // Preload the next chunk
    const nextStart = currentEnd + 1;
    const nextEnd = nextStart + chunkSize - 1;
    
    // Create a fetch request for the next chunk
    const preloadRequest = new Request(videoPath, {
      headers: {
        'Range': `bytes=${nextStart}-${nextEnd}`
      }
    });
    
    // Fetch next chunk in background with lower priority
    fetch(preloadRequest, { priority: 'low' })
      .then(response => {
        if (response.ok || response.status === 206) {
          // Cache the preloaded chunk
          const cache = caches.open(VIDEO_CACHE_NAME);
          cache.then(c => c.put(preloadRequest, response));
          console.log(`Preloaded next video chunk: ${nextStart}-${nextEnd}`);
        }
      })
      .catch(err => {
        // Silently ignore preload errors
      });
  } catch (error) {
    // Ignore errors in preloading - it's just an optimization
  }
}

// Fetch event handler with fine-grained caching strategies
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }
  
  // Determine the resource type for specialized caching
  const acceptHeader = request.headers.get('accept') || '';
  const isHTML = acceptHeader.includes('text/html');
  const isImage = acceptHeader.includes('image/');
  const isFont = url.pathname.match(/\.(woff2?|ttf|eot)$/i);
  const isJSON = acceptHeader.includes('application/json');
  const isCSS = url.pathname.endsWith('.css') || acceptHeader.includes('text/css');
  const isJS = url.pathname.endsWith('.js') || acceptHeader.includes('application/javascript');
  
  // 1. Video chunk request handling - highest priority with predictive preloading
  if (url.pathname.startsWith('/api/video/')) {
    // For high-performance endpoint, use more aggressive caching
    const isHighPerf = url.pathname.includes('/highperf');
    const options = {
      maxAge: VIDEO_CACHE_MAX_AGE,
      trackHits: true,
      hitCategory: 'video',
      preloadAdjacentChunks: isHighPerf // Only preload for high-performance endpoint
    };
    
    event.respondWith(
      // Cache-first for videos with network fallback due to large files
      cacheFirstWithNetworkFallback(request, VIDEO_CACHE_NAME, options)
    );
    return;
  }
  
  // 2. Regular API requests - use network-first with time-based caching
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      networkFirstWithCacheFallback(request, DYNAMIC_CACHE_NAME, {
        maxAge: DYNAMIC_CACHE_MAX_AGE, 
        trackHits: true,
        hitCategory: 'dynamic'
      })
    );
    return;
  }
  
  // 3. HTML navigation - network-first with offline fallback
  if (request.mode === 'navigate' || (request.method === 'GET' && isHTML)) {
    event.respondWith(
      networkFirstWithCacheFallback(request, CACHE_NAME, {
        trackHits: true,
        hitCategory: 'static'
      })
    );
    return;
  }
  
  // 4. Image assets - cache-first with long TTL
  if (isImage) {
    event.respondWith(
      cacheFirstWithNetworkFallback(request, IMAGE_CACHE_NAME, {
        maxAge: IMAGE_CACHE_MAX_AGE,
        trackHits: true,
        hitCategory: 'image'
      })
    );
    return;
  }
  
  // 5. Font files - cache-first with very long TTL
  if (isFont) {
    event.respondWith(
      cacheFirstWithNetworkFallback(request, FONT_CACHE_NAME, {
        maxAge: FONT_CACHE_MAX_AGE,
        trackHits: true,
        hitCategory: 'font'
      })
    );
    return;
  }
  
  // 6. CSS and JS assets - cache-first with standard settings
  if (isCSS || isJS) {
    event.respondWith(
      cacheFirstWithNetworkFallback(request, CACHE_NAME, {
        trackHits: true,
        hitCategory: 'static'
      })
    );
    return;
  }
  
  // 7. All other requests - default cache-first strategy
  event.respondWith(
    cacheFirstWithNetworkFallback(request, CACHE_NAME, {
      trackHits: true,
      hitCategory: 'static'
    })
  );
});

// Push notification event handler
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'Check out our latest properties!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-96x96.png',
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Ohana Realty', options)
  );
});

// Notification click event handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // If a window is already open, focus it
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Otherwise open a new window
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
  );
});

// Keep the service worker alive
setInterval(() => {
  console.log('Service worker ping - keeping alive');
}, 24 * 60 * 60 * 1000); // 24 hours
