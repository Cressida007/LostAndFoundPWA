const CACHE_NAME = 'lostfound-cache-v2';  // Incremented version to force new cache
const urlsToCache = [
  '/',
  '/index.html',
  '/admin.html',
  '/manifest.json',
  '/style.css',  // Add any other assets (like JS files) if necessary
  '/sw.js'  // Make sure the service worker itself is cached
];

// INSTALL: Cache the essential files
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[Service Worker] Caching files...');
      return cache.addAll(urlsToCache);
    })
  );
});

// ACTIVATE: Clean up old caches and take control immediately
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log(`[Service Worker] Deleting old cache: ${key}`);
            return caches.delete(key);
          }
        })
      );
    })
  );
  // Ensure the new service worker takes control immediately
  self.clients.claim();
});

// FETCH: Serve cached assets when offline, or fetch from network if available
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        console.log(`[Service Worker] Serving from cache: ${event.request.url}`);
        return response;
      }

      console.log(`[Service Worker] Fetching from network: ${event.request.url}`);
      return fetch(event.request);
    })
  );
});
