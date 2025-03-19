const CACHE_NAME = 'jama3i-v1';
const STATIC_CACHE = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/quran.css',
  '/js/app.js',
  '/manifest.json',
  // Images et icônes
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_CACHE);
    })
  );
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Stratégie de cache : Network First, puis cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Mettre en cache la nouvelle réponse
        const responseClone = response.clone();
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseClone);
          });
        return response;
      })
      .catch(() => {
        // Utiliser le cache si pas de réseau
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            // Si la ressource n'est pas en cache, renvoyer une page d'erreur
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            return new Response('Offline content not available');
          });
      })
  );
});
