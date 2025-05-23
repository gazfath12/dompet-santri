self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open('dompet-santri-v1').then(cache => cache.addAll([
      '/', '/manifest.json', '/icon-192x192.png', '/icon-512x512.png'
      // Tambahkan file statis lain yang ingin di-cache
    ]))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});