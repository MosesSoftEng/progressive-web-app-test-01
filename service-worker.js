/*
 * 01. Add Offline support.
 * - initialize the cache and,
 * - add files to it for offline use.
 */
const cacheName = 'pfXEetLQyyNMtLHy-v1.5'; // Cache name and version.

const appShellFiles = [
    "app.js",
    "index.htm",
    "logo-01-96.png",
    "style.css",
    "http://localhost/Tests/PWAs/PWATest/icons/logo-32.png",
    "http://localhost/Tests/PWAs/PWATest/icons/logo-64.png",
    "http://localhost/Tests/PWAs/PWATest/icons/logo-96.png",
    "http://localhost/Tests/PWAs/PWATest/icons/logo-128.png",
    "http://localhost/Tests/PWAs/PWATest/icons/logo-168.png",
    "http://localhost/Tests/PWAs/PWATest/icons/logo-192.png",
    "http://localhost/Tests/PWAs/PWATest/icons/logo-256.png",
    "http://localhost/Tests/PWAs/PWATest/icons/logo-512.png",
    "http://localhost/Tests/PWAs/PWATest/icons/maskable_icon_x192.png"
];

// Files from other sources, API endpoint or Database.
// Do not chace this source as will be used to update contents.
self.importScripts("Data/cars.js")

const carsImages = [];

for (let i = 0; i < cars.length; i++) {
    carsImages.push(cars[i].image);
}

// Join all resources urls
const contentToCache = appShellFiles.concat(carsImages);

for (let i = 0; i < contentToCache.length; i++) {
    logI("content to cache: " + contentToCache[i]);
}

/*
 * Install event.
 */
self.addEventListener('install', (e) => { // App install event
    logI('Install');

    e.waitUntil((async () => { // wait for the process to finish.
        /*
         * caches - a special CacheStorage object available in the scope of the given Service Worker to enable saving data.
         */
        // Open cache.
        const cache = await caches.open(cacheName);
        logI('Caching all: app shell and content');
        // Add files to cache.
        await cache.addAll(contentToCache);
    })());
});

/*
 * TODO - Periodic Background Sync
 */

/*
 *TODO - Activation event usually used to delete any files that are no longer necessary and clean up after the app in general.
 */
/*
 * Clean up the cache to ensure there is no resource that is not being used.
 * Cache space is limited.
 */
self.addEventListener('activate', (e) => {
    e.waitUntil(caches.keys().then((keyList) => {
        return Promise.all(keyList.map((key) => {
            if (key === cacheName) { return; }
            return caches.delete(key);
        }))
    }));
});

/*
 * Fetch event
 * Fires each time a HTTP request is made, you can intercept requests and respond to them
 * with custom responses, the requested file, its cached copy, or a piece of JavaScript code
 * Enables the app to work offline.
 */
self.addEventListener('fetch', (event) => {
    logI(`Fetched resource ${event.request.url}`);

    /*
     * Serve content from the cache, if it does not exist add then serve.
     * Acts as a proxy server between app and network.
     */
    event.respondWith((async () => {
        // Fetch resource from cache.
        const r = await caches.match(event.request);
        console.log(`[Service Worker] Fetching resource: ${event.request.url}`);
        if (r) { return r; }

        // Save resource first.
        const response = await fetch(event.request);
        const cache = await caches.open(cacheName);
        console.log(`[Service Worker] Caching new resource: ${event.request.url}`);
        cache.put(event.request, response.clone());
        return response;
    })());

    // event.respondWith(
    //     caches.match(event.request)
    //         .then(function(response) {
    //             if (response) {
    //                 return response;     // if valid response is found in cache return it
    //             } else {
    //                 return fetch(event.request)     //fetch from internet
    //                     .then(function(res) {
    //                         return caches.open(cacheName)
    //                             .then(function(cache) {
    //                                 cache.put(event.request.url, res.clone());    //save the response for future
    //                                 return res;   // return the fetched data
    //                             })
    //                     })
    //                     .catch(function(err) {       // fallback mechanism
    //                         logI("Fetch err: " + err)
    //                         // return caches.open(CACHE_CONTAINING_ERROR_MESSAGES)
    //                         //     .then(function(cache) {
    //                         //         return cache.match('/offline.html');
    //                         //     });
    //                     });
    //             }
    //         })
    // );
});

/*
 * Manage logs.
 */
function logI(message) {
    console.log(`[Service Worker] ${message}`);
}

