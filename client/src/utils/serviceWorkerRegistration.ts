/**
 * Service Worker Registration
 * Handles registration and updates of the service worker for offline functionality
 */

// Check if the browser supports service workers
const isServiceWorkerSupported = 'serviceWorker' in navigator;

/**
 * Register the service worker for the application
 * This provides caching and offline capabilities
 */
export function registerServiceWorker() {
  if (!isServiceWorkerSupported) {
    console.log('Service workers are not supported in this browser.');
    return;
  }
  
  // Wait for the page to load before registering service worker
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
      });
      
      console.log('Service worker registered successfully:', registration.scope);
      
      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content is available, prompt the user to refresh
            console.log('New version available! Reload to update.');
            showUpdateNotification();
          }
        });
      });
      
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  });
  
  // Listen for service worker updates
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // The service worker controlling this page has changed,
    // reload the page to ensure we get the new version
    if (!window.isReloading) {
      window.isReloading = true;
      window.location.reload();
    }
  });
}

/**
 * Unregister all service workers and remove cached data
 * Useful for troubleshooting or major version updates
 */
export async function unregisterServiceWorkers() {
  if (!isServiceWorkerSupported) return;
  
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
    
    // Clear all caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }
    
    console.log('Service workers unregistered and caches cleared.');
    
    // Reload the page to ensure clean state
    window.location.reload();
    
  } catch (error) {
    console.error('Error unregistering service workers:', error);
  }
}

/**
 * Check for service worker updates
 * Can be triggered by user action or on a schedule
 */
export async function checkForUpdates() {
  if (!isServiceWorkerSupported) return;
  
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      console.log('Service worker update check completed.');
    }
  } catch (error) {
    console.error('Error checking for service worker updates:', error);
  }
}

/**
 * Show a notification to the user that a new version is available
 */
function showUpdateNotification() {
  // Here you would use your UI library's toast or notification system
  // For example with a custom element:
  const notification = document.createElement('div');
  notification.className = 'update-notification';
  notification.innerHTML = `
    <div class="update-notification-content">
      <p>A new version of this app is available!</p>
      <button id="update-button">Reload to Update</button>
      <button id="dismiss-button">Later</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Add event listeners
  document.getElementById('update-button')?.addEventListener('click', () => {
    window.location.reload();
  });
  
  document.getElementById('dismiss-button')?.addEventListener('click', () => {
    document.body.removeChild(notification);
  });
  
  // Also add styles for the notification
  const style = document.createElement('style');
  style.textContent = `
    .update-notification {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #1c5c48;
      color: white;
      padding: 12px;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      z-index: 9999;
      max-width: 300px;
    }
    .update-notification-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .update-notification p {
      margin: 0 0 8px 0;
    }
    .update-notification button {
      cursor: pointer;
      padding: 8px 12px;
      border: none;
      border-radius: 4px;
    }
    #update-button {
      background-color: white;
      color: #1c5c48;
      font-weight: bold;
    }
    #dismiss-button {
      background-color: transparent;
      color: white;
      border: 1px solid white;
    }
  `;
  document.head.appendChild(style);
}

// Declaration for TypeScript
declare global {
  interface Window {
    isReloading?: boolean;
  }
}
