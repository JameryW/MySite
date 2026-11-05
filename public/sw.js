const CACHE = 'mysite-v193';
/* Precache keys must exactly match the URLs pages request, otherwise
   caches.match() never hits (query params are part of the cache key).
   Bump styles.css?v= / app.js?v= / data.js?v= in every HTML head together
   with the versioned keys below.
   Only add URLs that return HTTP 200 for anonymous requests: /404.html is
   internal in nginx (returns 404), and including it here used to fail the
   whole install. Offline unknown URLs fall back to the cached shell/index. */
const SHELL = [
  './',
  './index.html',
  './projects.html',
  './showcase.html',
  './notes.html',
  './about.html',
  './archive.html',
  './project.html',
  './note.html',
  './styles.css?v=150',
  './styles-home.css?v=4',
  './styles-about.css?v=5',
  './fonts/syne-latin-var-v1.woff2',
  './fonts/space-grotesk-latin-var-v1.woff2',
  './xiaohongshu-logo.png',
  './app.js?v=105',
  './data.js?v=50',
  './data-list.js?v=7',
  './notfound.js',
  './favicon.svg',
  './og-image.png',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    (async () => {
      // Fetch navigations in parallel with service-worker startup.
      if (self.registration.navigationPreload) {
        try {
          await self.registration.navigationPreload.enable();
        } catch (error) {}
      }
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    })()
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
      (async () => {
        try {
          const preload = await e.preloadResponse;
          const response = preload || (await fetch(e.request));
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
          return response;
        } catch (error) {
          const cached = await caches.match(e.request);
          if (cached) return cached;
          // Detail pages are query views of their shell: serve the cached
          // shell so the client-side router can still render the entry offline.
          const path = new URL(e.request.url).pathname;
          const shell = path.endsWith('/project.html')
            ? './project.html'
            : path.endsWith('/note.html')
              ? './note.html'
              : './index.html';
          return (await caches.match(shell)) || (await caches.match('./index.html')) || Response.error();
        }
      })()
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
