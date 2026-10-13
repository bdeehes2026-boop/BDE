'use strict';

const CACHE_NAME = 'ehes-bde-pwa-v2';
const OWNED_CACHE_PREFIX = 'ehes-bde-pwa-';
const LEGACY_CACHE_NAME = 'ehes-pwa-v1';
const APP_SCOPE = new URL(self.registration.scope);
const PRECACHE_URLS = [
  './',
  'index.html',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png'
].map((path) => new URL(path, APP_SCOPE).href);
const PRECACHE_PATHS = new Set(
  PRECACHE_URLS.map((url) => new URL(url).pathname)
);

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(PRECACHE_URLS);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    const obsoleteOwnedCaches = cacheNames.filter((name) =>
      name === LEGACY_CACHE_NAME ||
      (name.startsWith(OWNED_CACHE_PREFIX) && name !== CACHE_NAME)
    );
    await Promise.all(obsoleteOwnedCaches.map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (
    url.origin !== APP_SCOPE.origin ||
    !url.pathname.startsWith(APP_SCOPE.pathname) ||
    !PRECACHE_PATHS.has(url.pathname)
  ) {
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const response = await fetch(request);
      if (response.ok && response.type === 'basic') {
        await cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      const cachedResponse = await cache.match(request, { ignoreSearch: true });
      if (cachedResponse) return cachedResponse;

      if (request.mode === 'navigate') {
        const appShell = await cache.match(new URL('index.html', APP_SCOPE).href);
        if (appShell) return appShell;
      }

      throw error;
    }
  })());
});
