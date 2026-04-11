const CACHE_VERSION = 'v4';
const CACHE_NAME = `grateful-${CACHE_VERSION}`;

// App shell — everything needed to run offline
const APP_SHELL = [
  '/apps/grateful/',
  '/apps/grateful/index.html',
  '/apps/grateful/styles.css',
  '/apps/grateful/app.js',
  '/apps/grateful/manifest.json',
];

// CDN resources — cached on first use, served from cache thereafter
const CDN_ORIGINS = [
  'cdn.jsdelivr.net',
];

// ── Install: pre-cache app shell ─────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: remove stale caches ────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key.startsWith('grateful-') && key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first for shell + CDN, network-only for everything else ─────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') return;

  const isAppShell = url.pathname.startsWith('/apps/grateful/');
  const isCDN = CDN_ORIGINS.includes(url.hostname);

  if (isAppShell || isCDN) {
    event.respondWith(cacheFirst(request));
  }
  // All other requests (e.g. push subscription endpoints) go straight to network
});

// ── Strategy: cache-first, fall back to network and store the result ──────────
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Offline and not cached — return a minimal offline fallback for navigation
    if (request.mode === 'navigate') {
      return caches.match('/apps/grateful/index.html');
    }
    return new Response('Offline', { status: 503 });
  }
}

// ── Push notifications ────────────────────────────────────────────────────────
self.addEventListener('push', event => {
  console.log('push event fired', event.data?.text());  // add this

  let data = {};
  try { data = event.data?.json() ?? {}; } catch { /* plain-text or empty push */ }
  const title = data.title ?? 'Grateful';
  const options = {
    body: data.body ?? 'Time to record what you\'re grateful for today.',
    icon: '/apps/grateful/icons/icon-192.png',
    badge: '/apps/grateful/icons/icon-192.png',
    data: { url: '/apps/grateful/' },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(windowClients => {
        const existing = windowClients.find(c => c.url.includes('/apps/grateful/'));
        if (existing) return existing.focus();
        return clients.openWindow('/apps/grateful/');
      })
  );
});
