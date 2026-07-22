var CACHE_NAME = 'saudebucalapp-v2';

var PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/imagemicone.png',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function(name) { return name !== CACHE_NAME; })
          .map(function(name) { return caches.delete(name); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  var request = event.request;

  if (request.method !== 'GET') return;

  if (
    request.url.includes('/functions/v1/') ||
    request.url.includes('supabase.co') ||
    request.url.includes('supabase.in')
  ) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then(function(response) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(request, clone);
        });
        return response;
      }).catch(function() {
        return caches.match('/index.html').then(function(cached) {
          return cached || new Response('Offline', {
            status: 503,
            headers: { 'Content-Type': 'text/html' }
          });
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(function(cached) {
      if (cached) {
        fetch(request).then(function(response) {
          if (response && response.status === 200) {
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(request, response);
            });
          }
        }).catch(function() {});
        return cached;
      }

      return fetch(request).then(function(response) {
        if (response && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(request, clone);
          });
        }
        return response;
      }).catch(function() {
        return new Response('', { status: 503 });
      });
    })
  );
});
