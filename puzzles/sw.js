// Dada World moved to dimaagdada.com (16 Nov 2026). This worker clears old caches, unregisters itself and sends open windows to the new site.
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil((async () => { for (const k of await caches.keys()) await caches.delete(k); await self.registration.unregister(); const cs = await self.clients.matchAll({ type: "window" }); cs.forEach(c => c.navigate("https://www.dimaagdada.com/#play")); })()));
