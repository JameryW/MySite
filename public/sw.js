const CACHE = 'mysite-v99';
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
  './404.html',
  './styles.css?v=77',
  './fonts/syne-latin-var-v1.woff2',
  './fonts/space-grotesk-latin-var-v1.woff2',
  './xiaohongshu-logo.png',
  './app.js?v=43',
  './data.js?v=32',
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
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }

  /* Navigations are network-first: a deploy lands on the next online
     visit instead of waiting for a second load. Offline falls back to
     the precached shell, then index as a last resort. */
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return response;
      }).catch(() =>
        caches.match(e.request).then((cached) =>
          cached || caches.match('./404.html').then((notFound) => notFound || caches.match('./index.html'))
        )
      )
    );
    return;
  }

  /* Versioned statics (?v=) are immutable: cache-first is safe because
     every deploy mints new URLs. Unversioned misses go to network. */
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
});
