// Offline support for Dada World (/puzzles/). Bump VERSION whenever a scene is added or a file here changes.
const VERSION = "p12";
const CACHE = "dada-puzzles-" + VERSION;
const PRECACHE = ["./", "index.html", "ludo.html", "snakes-sums.html", "chess.html", "comics.html", "img/comic/trail-1-cover.webp", "img/comic/trail-1-p1.webp", "img/comic/trail-1-p2.webp", "img/comic/trail-1-p3.webp", "img/comic/trail-1-p4.webp", "img/comic/trail-1-p5.webp", "img/comic/trail-1-p6.webp", "img/chess.webp", "img/chess-frame.webp", "img/botu.webp", "img/snakes-board.webp", "manifest.webmanifest", "img/icon-96.webp", "img/icon-192.png", "img/icon-512.png", "img/dada.webp", "img/dada-thumbs.webp", "img/gullak-happy.webp",
  "img/ludo.webp", "img/snakes-sums.webp", "img/learn.webp", "img/puzzle-book.webp", "img/stationery.webp", "img/comics-trail.webp",
  "scenes/mystery-house.webp", "scenes/mystery-house-sm.webp",
  "scenes/school-trip.webp", "scenes/train-journey.webp", "scenes/school-trip-sm.webp", "scenes/train-journey-sm.webp", "scenes/diwali-market-sm.webp", "scenes/cricket-ground-sm.webp", "scenes/space-lab-sm.webp"];
self.addEventListener("install", e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("dada-puzzles-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  if (r.mode === "navigate") { e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put(r, c)); return res; }).catch(() => caches.match(r).then(m => m || caches.match("./")))); return; }
  e.respondWith(caches.match(r).then(m => { const net = fetch(r).then(res => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then(x => x.put(r, c)); } return res; }).catch(() => m); return m || net; }));
});
