// Código basado en: https://www.youtube.com/playlist?list=PL4cUxeGkcC9gTxqJBcDmoi5Q2pzDusSL7

const staticCacheName = 'static-play-planner';
const dynamicCacheName = 'dynamic-play-planner';
const staticAssets = [
    './',
    './index.html',
    './script.js',
    './styles/style.css',
    './back/db.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      console.log('caching assets')
      cache.addAll(staticAssets);
   })
  );
});

self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    if (url.origin === location.origin) {
        event.respondWith(cacheData(request));
    } else {
        event.respondWith(networkFirst(request));
    }
});

async function cacheData(request) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || fetch(request);
}

async function networkFirst(request) {
    const cache = await caches.open(dynamicCacheName);
    try {
        const response = await fetch(request);
        cache.put(request, response.clone());
        return response;
    } catch (error){
        return await cache.match(request);
    }
}
