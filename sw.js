const CACHE_NAME = "lostfound-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./admin.html",
  "./style.css",
  "./admin.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Activate Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => 
      Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null))
    )
  );
});

// Fetch cached assets first
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
