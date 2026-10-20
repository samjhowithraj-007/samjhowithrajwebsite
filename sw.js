// Offline support for Tech Samjho Raj. Bump VERSION on any change to this file or the precache list.
const VERSION = "v40";
const CACHE = "samjhowithraj-" + VERSION;
const PRECACHE = ["./", "index.html", "manifest.webmanifest", "img/badge-96.png", "img/favicon-32.png", "img/icon-192.png", "img/icon-512.png", "img/apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith("samjhowithraj-") && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  if (/\.(mp4|webm|m4a)$/i.test(url.pathname)) return;             // videos stream from the network
  if (req.mode === "navigate") {                                     // pages: newest when online, cached when offline
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put("index.html", copy)); return r; })
      .catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(req).then(hit => {                       // everything else: cache first, refresh in the background
    const net = fetch(req).then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return r; }).catch(() => hit);
    return hit || net;
  }));
});
