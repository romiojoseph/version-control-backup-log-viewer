const CACHE_NAME = 'backup-log-viewer-v1';
const BASE_PATH = '/version-control-backup-log-viewer/';
const ASSETS_TO_CACHE = [
    BASE_PATH,
    BASE_PATH + 'index.html',
    BASE_PATH + 'styles.css',
    BASE_PATH + 'script.js',
    BASE_PATH + 'assets/python.svg',
    BASE_PATH + 'assets/favicon.svg',
    BASE_PATH + 'assets/bluesky-feeds_log.json',
    'https://unpkg.com/@phosphor-icons/web@2.1.1/src/duotone/style.css',
    'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&display=swap'
];

// Install Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activate Service Worker
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

// Fetch Strategy
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
}); 