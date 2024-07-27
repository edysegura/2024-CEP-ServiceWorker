self.addEventListener('install', (event) => {
  console.log(`[Service Worker] install event lifecycle!`);
  event.waitUntil(
    caches
      .open('sw-cache-v1')
      .then(async (cache) =>
        cache.put('/images/dog.svg', await fetch('/images/cat.svg'))
      )
  );
  // self.skipWaiting(); // don't wait for installation just activate it
});

self.addEventListener('activate', () => {
  console.log(`[Service Worker] activate event lifecycle!`);
  return self.clients.claim(); // claim all tabs
});

self.addEventListener('fetch', async (event) => {
  console.log(`[Service Worker] fetch event lifecycle!`);
  const response = await caches.match(event.request.url);
  event.respondWith(response && fetch(event.request));
});
