const CACHE = 'mysite-v75';
/* Precache keys must exactly match the URLs pages request, otherwise
   caches.match() never hits (query params are part of the cache key).
   Bump styles.css?v= / app.js?v= / data.js?v= in every HTML head together
   with the versioned keys below. */
const SHELL = [
  './',
  './index.html',
  './projects.html',
  './showcase.html',
  './notes.html',
  './about.html',
  './project.html',
  './note.html',
  './styles.css?v=63',
  './fonts/syne-latin-var-v1.woff2',
  './fonts/space-grotesk-latin-var-v1.woff2',
  './xiaohongshu-logo.png',
  './app.js?v=27',
  './data.js?v=26',
  './favicon.svg',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    e.respondWith(
      fetch(e.request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE).then((c) => c.put(e.request, clone));
        return response;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        if (cached) return cached;
        return fetch(e.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
