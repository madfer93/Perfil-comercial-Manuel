const CACHE_NAME = 'manuel-portfolio-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './proyectos.html',
  './demos.html',
  './testimonios.html',
  './Css/style.css',
  './Css/responsive.css',
  './Css/proyectos.css',
  './Css/responsive-proyectos.css',
  './Js/script.js',
  './Js/animations.js',
  './Js/faq.js',
  './assets/VariedadesJyM.jpg'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Activación y limpieza de cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Estrategia de Caché: Network First (intenta red, si falla usa caché)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la respuesta es válida, la clonamos al caché
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          });
        return response;
      })
      .catch(() => {
        // En caso de fallo de red, devolver desde caché
        return caches.match(event.request);
      })
  );
});
