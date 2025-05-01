/**
 * Ohana Realty Service Worker
 * Provides caching and offline capabilities for the application
 */

const CACHE_NAME = 'ohana-realty-v1';

// Resources to cache on install
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/robots.txt',
  '/assets/index.js',
  '/assets/index.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Cache API and video API responses for a shorter period
const DYNAMIC_CACHE_NAME = 'ohana-realty-dynamic-v1';

// Video chunks should be cached separately with a different strategy
const VIDEO_CACHE_NAME = 'ohana-realty-video-v1';

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

// Activate event handler
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            // Delete outdated caches
            return (
              cacheName.startsWith('ohana-realty-') &&
              cacheName !== CACHE_NAME &&
              cacheName !== DYNAMIC_CACHE_NAME &&
              cacheName !== VIDEO_CACHE_NAME
            );
          })
          .map((cacheName) => {
            console.log('Service worker deleting outdated cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );

  // Take control immediately
  self.clients.claim();
});

// Helper function to handle network-first strategy with fallback to cache
async function networkFirstWithCacheFallback(request, cacheName) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Clone the response to save it to cache
    const responseToCache = networkResponse.clone();
    
    // Cache the response
    const cache = await caches.open(cacheName);
    cache.put(request, responseToCache);
    
    return networkResponse;
  } catch (error) {
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If cache also fails, return a fallback or throw
    throw error;
  }
}

// Helper function to handle cache-first strategy with network fallback
async function cacheFirstWithNetworkFallback(request, cacheName) {
  // Try cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // If not in cache, try network
  try {
    const networkResponse = await fetch(request);
    
    // Clone the response to save it to cache
    const responseToCache = networkResponse.clone();
    
    // Cache the response
    const cache = await caches.open(cacheName);
    cache.put(request, responseToCache);
    
    return networkResponse;
  } catch (error) {
    // If both cache and network fail, return a fallback or throw
    if (request.headers.get('accept').includes('text/html')) {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

// Fetch event handler
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }
  
  // Special handling for API requests
  if (url.pathname.startsWith('/api/')) {
    // Don't cache video chunk requests in the main cache
    if (url.pathname.includes('/api/video/')) {
      event.respondWith(
        networkFirstWithCacheFallback(request, VIDEO_CACHE_NAME)
      );
      return;
    }
    
    // For other API requests, use network first with short-lived cache
    event.respondWith(
      networkFirstWithCacheFallback(request, DYNAMIC_CACHE_NAME)
    );
    return;
  }
  
  // For navigations (HTML), use network first
  if (request.mode === 'navigate' || (request.method === 'GET' && request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      networkFirstWithCacheFallback(request, CACHE_NAME)
    );
    return;
  }
  
  // For all other requests (CSS, JS, images), use cache first
  event.respondWith(
    cacheFirstWithNetworkFallback(request, CACHE_NAME)
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
