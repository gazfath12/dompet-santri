const CACHE_NAME = 'dompet-santri-v1';
const ASSETS = [
  '/',
  '/login.html',
  '/register.html',
  '/dashboard.html',
  '/styles/main.css',
  '/scripts/app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => {
        if (event.request.url.includes('/api/')) {
          return new Response(JSON.stringify({ error: 'Offline mode' }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        return caches.match('/offline.html');
      })
  );
});