// Service Worker for Ohana Realty
// Provides caching and offline support

const CACHE_NAME = 'ohana-realty-cache-v1';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/assets/index.css',
  '/assets/index.js',
];

// Cache assets with network fallback strategy
const CACHE_ASSETS = [
  // Images files patterns
  /\.(png|jpg|jpeg|gif|webp|avif|svg)$/,
  // Font files patterns
  /\.(woff|woff2|ttf|otf|eot)$/,
];

// API routes that should use network-first strategy
const API_ROUTES = [
  '/api/properties',
  '/api/neighborhoods'
];

// Install event - precache important resources
self.addEventListener('install', (event) => {
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Pre-caching important assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => {
            console.log('Service Worker: Removing old cache', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
    .then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

// Helper function to determine if a request is an API request
function isApiRequest(url) {
  return API_ROUTES.some(route => url.pathname.startsWith(route));
}

// Helper function to determine if a request should be cached
function shouldCache(url) {
  // Cache static assets that match our patterns
  return CACHE_ASSETS.some(pattern => {
    if (pattern instanceof RegExp) {
      return pattern.test(url.pathname);
    }
    return url.pathname === pattern;
  });
}

// Fetch event - handle requests with appropriate strategies
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }
  
  // Handle API requests with network-first strategy
  if (isApiRequest(url)) {
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }
  
  // Handle cacheable assets with cache-first strategy
  if (shouldCache(url)) {
    event.respondWith(cacheFirstStrategy(event.request));
    return;
  }
  
  // For all other requests, use network-first
  event.respondWith(networkFirstStrategy(event.request));
});

// Cache-first strategy: Try cache first, fallback to network
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Also update cache in the background (stale-while-revalidate)
    fetch(request)
      .then(response => {
        if (response.ok) {
          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, response.clone()));
        }
      })
      .catch(() => {/* Ignore errors */});
    
    return cachedResponse;
  }
  
  // If not in cache, fetch from network and cache
  try {
    const networkResponse = await fetch(request);
    
    // Cache only successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // For image requests, try to show a fallback image
    if (request.destination === 'image') {
      return caches.match('/assets/fallback-image.svg');
    }
    
    // Just throw for other asset types
    throw error;
  }
}

// Network-first strategy: Try network first, fallback to cache
async function networkFirstStrategy(request) {
  try {
    // Try to get from network first
    const networkResponse = await fetch(request);
    
    // For successful responses, update the cache
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // If network fails, try to return from cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // For API requests, try to return a cached version of the root data
    if (isApiRequest(new URL(request.url))) {
      const cache = await caches.open(CACHE_NAME);
      const cachedApiResponses = await cache.match('/api/properties');
      
      if (cachedApiResponses) {
        return cachedApiResponses;
      }
    }
    
    // Return specific offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/');
    }
    
    // For image requests, try to show a fallback image
    if (request.destination === 'image') {
      return caches.match('/assets/fallback-image.svg');
    }
    
    // Return offline JSON for API requests
    if (request.url.includes('/api/')) {
      return new Response(
        JSON.stringify({ 
          error: 'You are offline',
          offline: true
        }),
        { 
          headers: { 'Content-Type': 'application/json' },
          status: 503
        }
      );
    }
    
    // Rethrow for all other cases
    throw error;
  }
}

// Handle messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});