const CACHE_NAME = 'lostfound-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/admin.html',
  '/manifest.json',
  '/style.css', // Optional, if you separate CSS
  // Add other static assets if needed (e.g., images, fonts, etc.)
];

// INSTALL - Cache the necessary static files
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching files');
        return cache.addAll(urlsToCache);
      })
      .catch(error => console.error('[Service Worker] Failed to cache files:', error))
  );
});

// ACTIVATE - Clean up old caches and take control immediately
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete old caches that are not in the whitelist
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of the page immediately after activation
      return self.clients.claim();
    })
  );
});

// FETCH - Use cache first, then network for dynamic content
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response from cache
        if (response) {
          console.log('[Service Worker] Serving from cache:', event.request.url);
          return response;
        }
        
        // Cache miss - fetch from network
        return fetch(event.request).then(networkResponse => {
          // Cache the network response for future use
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            console.log('[Service Worker] Caching new data:', event.request.url);
            return networkResponse;
          });
        });
      })
      .catch(error => console.error('[Service Worker] Fetch error:', error))
  );
});

// Listen for messages from the client (for example, to skip waiting when new service worker is ready)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
