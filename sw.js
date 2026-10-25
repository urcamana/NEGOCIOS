/* Service worker de negocios.mematalimon.com.ar
   Red primero (así no quedan páginas viejas guardadas) y, si no hay conexión, lo que haya en caché.
   Cambiar el número de CACHE fuerza a los celulares a descartar la versión anterior
   (la versión vieja de este sitio solo redirigía a otra página). */
const CACHE = 'negocios-v2';
const ASSETS = ['./', './index.html', './profesionales.html', './manifest.webmanifest'];

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
  const url = new URL(req.url);
  // Solo gestionamos este subdominio; articulos.json y style.css de la web principal van directo a la red
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
  );
});
