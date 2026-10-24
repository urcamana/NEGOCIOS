/* Service worker del lanzador negocios.mematalimon.com.ar
   Solo cubre este subdominio (la pantalla de inicio / redirección).
   El contenido real vive en mematalimon.com.ar/otrosnegocios/ */
const CACHE = 'negocios-launcher-v1';
const ASSETS = ['./', './index.html', './manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).catch(() => caches.match('./index.html')))
  );
});
