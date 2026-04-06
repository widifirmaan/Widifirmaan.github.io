const CACHE_NAME = 'portfolio-v1';
const urlsToCache = [
    './',
    './css/style.css',
    './js/data.js',
    './js/script.js',
    './1690163389614.jpeg',
    './favicon.png',
    './icons/javascript.svg',
    './icons/react.svg',
    'https://cdn.jsdelivr.net/npm/marked/marked.min.js'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(names => 
            Promise.all(names.filter(name => name !== CACHE_NAME).map(name => caches.delete(name)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request)
            .then(res => res || fetch(e.request).then(netRes => {
                if (netRes.ok) {
                    const clone = netRes.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
                }
                return netRes;
            }))
            .catch(() => caches.match('./'))
    );
});
