// Perform install steps
var CACHE_NAME = 'pwacman-v1';
var urlsToCache = [
    '/pwacman',
    'j/pwacman.js',
    'j/rotateAround.js',
    'j/e/aframe.js',
    'j/e/aframe-bmfont-text-component.min.js',
    'j/e/aframe-physics-system.js',
    'j/e/svrbutton.js',
    'j/e/svrbutton_helper',
    'i/icons/icon192.png',
    'i/icons/icon512.png',
    'i/hud.png',
    'i/logo.png',
    'i/splashscreen.png',
    'assets/ghostv2.obj'
];

self.addEventListener('install', function(event) {
// Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            console.log('Opened cache');
        return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', function(event) {

  var cacheWhitelist = ['pwacman-v1'];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});