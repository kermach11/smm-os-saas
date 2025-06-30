// Spline Service Worker для миттєвого завантаження
const CACHE_NAME = 'spline-cache-v2';
const SPLINE_ORIGINS = [
  'https://prod.spline.design',
  'https://spline.design',
  'https://my.spline.design'
];

// Spline file extensions для кешування
const SPLINE_EXTENSIONS = [
  '.splinecode',
  '.spline',
  '.glb', '.gltf',
  '.jpg', '.jpeg', '.png', '.webp', '.hdr',
  '.mp3', '.wav', '.ogg'
];

self.addEventListener('install', (event) => {
  console.log('🚀 Spline SW: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('✅ Spline SW: Cache opened');
      // Preconnect to Spline domains
      return Promise.resolve();
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('🎯 Spline SW: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName.includes('spline')) {
            console.log('🗑️ Spline SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Перевіряємо чи це Spline ресурс
  const isSplineResource = SPLINE_ORIGINS.some(origin => 
    url.href.startsWith(origin)
  ) || SPLINE_EXTENSIONS.some(ext => 
    url.pathname.includes(ext)
  );

  if (isSplineResource) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          console.log('⚡ Spline SW: Serving from cache:', url.href);
          return cachedResponse;
        }

        console.log('🌐 Spline SW: Fetching and caching:', url.href);
        return fetch(event.request).then((response) => {
          // Перевіряємо чи response валідна
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Клонуємо response для кешування
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        }).catch((error) => {
          console.error('❌ Spline SW: Fetch failed:', error);
          throw error;
        });
      })
    );
  }
});

// Background sync для prefetch
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PREFETCH_SPLINE') {
    const { urls } = event.data;
    console.log('🔄 Spline SW: Prefetching assets:', urls);
    
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return Promise.all(
          urls.map((url) => {
            return fetch(url).then((response) => {
              if (response.ok) {
                return cache.put(url, response);
              }
            }).catch((error) => {
              console.warn('⚠️ Prefetch failed for:', url, error);
            });
          })
        );
      })
    );
  }
}); 