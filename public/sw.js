// Simple service worker with no caching to fix ERR_BLOCKED_BY_RESPONSE issues
// This will be a temporary fix until we can debug the caching issues

// Install event - skip waiting to take control immediately 
self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('Service Worker: Installed');
});

// Activate event - claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    // Take control of all clients immediately
    self.clients.claim().then(() => {
      console.log('Service Worker: Activated and claimed clients');
    })
  );
});

// Fetch event - pass-through to network without caching
self.addEventListener('fetch', (event) => {
  // Just pass through to the network, no caching
  // This will prevent any ERR_BLOCKED_BY_RESPONSE issues
  console.log('Service Worker: Fetch pass-through');
});

// Handle messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});