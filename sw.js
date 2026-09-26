
const CACHE_NAME = 'ehes-pwa-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-database-compat.js'
];

// Installation : Mise en cache des fichiers essentiels
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[PWA] Mise en cache des ressources statiques');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activation : Nettoyage des anciens caches si mise à jour
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[PWA] Suppression de l\'ancien cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interception des requêtes : Stratégie "Network First, falling back to Cache"
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET (ex: POST, PUT)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Si le réseau répond, on met à jour le cache dynamiquement
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // En cas d'absence de réseau (Hors-ligne), servir depuis le cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Optionnel : retourner une page hors-ligne par défaut si disponible
          return caches.match('./index.html');
        });
      })
  );
});
