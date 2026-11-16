// Fetches public RSS feeds and writes news.json (headline, source, link, date, topic, short summary) and
// news-videos.json (latest videos from the Tech Samjho Raj YouTube channel). Run by the daily publish workflow; run locally with: node tools/fetch-news.mjs
// Only headlines, a short excerpt and a link back are stored (no full articles).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FEEDS = [
  ["AI", "MIT Technology Review", "https://www.technologyreview.com/feed/"],
  ["AI", "Ars Technica", "https://feeds.arstechnica.com/arstechnica/technology-lab"],
  ["Big Tech", "The Verge", "https://www.theverge.com/rss/index.xml"],
  ["Big Tech", "BBC Technology", "https://feeds.bbci.co.uk/news/technology/rss.xml"],
  ["Startups & business", "TechCrunch", "https://techcrunch.com/feed/"],
  ["Chips & hardware", "IEEE Spectrum", "https://spectrum.ieee.org/feeds/feed.rss"],
  ["Cloud & software", "Hacker News (top)", "https://hnrss.org/frontpage?points=150"],
  ["Cloud & software", "InfoQ", "https://feed.infoq.com/"],
  ["Cybersecurity", "The Hacker News", "https://feeds.feedburner.com/TheHackersNews"],
  ["India tech", "MediaNama", "https://www.medianama.com/feed/"],
  ["India tech", "Inc42", "https://inc42.com/feed/"],
  ["Science & space", "Space.com", "https://www.space.com/feeds/all"],
  ["Gadgets", "Wired", "https://www.wired.com/feed/rss"],
  ["Gadgets", "Engadget", "https://www.engadget.com/rss.xml"],
  ["India tech", "Economic Times Tech", "https://economictimes.indiatimes.com/tech/rssfeeds/13357270.cms"],
  ["India tech", "The Hindu Tech", "https://www.thehindu.com/sci-tech/technology/feeder/default.rss"],
  ["India tech", "Indian Express Tech", "https://indianexpress.com/section/technology/feed/"],
  ["India tech", "Gadgets 360", "https://feeds.feedburner.com/gadgets360-latest"],
  ["India tech", "YourStory", "https://yourstory.com/feed"],
  ["India tech", "Mint Technology", "https://www.livemint.com/rss/technology"]
];
const UA = { "User-Agent": "Mozilla/5.0 (compatible; TechSamjhoRajNewsBot/1.0; +https://www.techsamjhoraj.com)" };
const clean = s => String(s || "").replace(/<!\[CDATA\[|\]\]>/g, "").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&nbsp;/g, " ").replace(/&#x([0-9a-f]+);/gi, (m, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&#(\d+);/g, (m, d) => String.fromCodePoint(+d)).replace(/\s+/g, " ").trim();
const tag = (x, t) => { const m = x.match(new RegExp("<" + t + "[^>]*>([\\s\\S]*?)</" + t + ">", "i")); return m ? m[1] : ""; };
async function get(url){ const c = new AbortController(), t = setTimeout(() => c.abort(), 15000); try { const r = await fetch(url, { headers: UA, signal: c.signal }); if (!r.ok) throw new Error(r.status); return await r.text(); } finally { clearTimeout(t); } }
const out = [];
for (const [topic, source, url] of FEEDS) {
  try {
    const xml = await get(url);
    const items = xml.split(/<item[\s>]|<entry[\s>]/i).slice(1, 9);
    for (const it of items) {
      const title = clean(tag(it, "title")); let link = clean(tag(it, "link")) || (it.match(/<link[^>]+href="([^"]+)"/i) || [])[1] || "";
      const d = clean(tag(it, "pubDate") || tag(it, "published") || tag(it, "updated") || tag(it, "dc:date")); const date = d ? new Date(d) : null;
      const sum = clean(tag(it, "description") || tag(it, "summary") || tag(it, "content:encoded")).slice(0, 190);
      const im = (it.match(/<media:(?:content|thumbnail)[^>]+url="([^"]+)"/i) || it.match(/<enclosure[^>]+url="([^"]+\.(?:jpe?g|png|webp)[^"]*)"[^>]*>/i) || it.match(/<img[^>]+src=["']([^"']+)["']/i) || it.match(/&lt;img[^&]+src=&quot;([^&]+)&quot;/i) || [])[1] || "";
      const image = /^https:\/\//.test(im) ? im.replace(/&amp;|&#0*38;/g, "&") : "";
      if (title && link && date && !isNaN(date)) out.push({ title, link, source, topic, region: topic === "India tech" ? "India" : "World", date: date.toISOString(), image, summary: sum.length >= 190 ? sum.replace(/\s+\S*$/, "") + "…" : sum });
    }
  } catch (e) { console.error("feed failed:", source, e.message); }
}
const seen = new Set(), now = Date.now();
const news = out.filter(n => now - Date.parse(n.date) < 10 * 864e5 && !seen.has(n.link) && seen.add(n.link)).sort((a, b) => Date.parse(b.date) - Date.parse(a.date)).slice(0, 170);
// For stories whose feed has no picture, read the real picture (og:image) from the article page itself.
async function ogImage(url){ try { const c = new AbortController(), t = setTimeout(() => c.abort(), 9000); const r = await fetch(url, { headers: UA, signal: c.signal, redirect: "follow" }); const h = (await r.text()).slice(0, 200000); clearTimeout(t);
  const m = h.match(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["']/i) || h.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image)["']/i);
  const u = m ? m[1].replace(/&amp;|&#0*38;/g, "&") : ""; return /^https:\/\//.test(u) ? u : ""; } catch (e) { return ""; } }
const todo = news.filter(n => !n.image).slice(0, 60);
for (let i = 0; i < todo.length; i += 8) await Promise.all(todo.slice(i, i + 8).map(async n => { n.image = await ogImage(n.link); }));
console.log("pictures:", news.filter(n => n.image).length + "/" + news.length);
if (news.length >= 10) { fs.writeFileSync(path.join(ROOT, "news.json"), JSON.stringify({ updated: new Date().toISOString(), items: news }, null, 1)); console.log("news.json:", news.length, "items"); }
else console.error("too few news items (" + news.length + "), keeping the old news.json");
// Tech Samjho Raj channel videos
try {
  const xml = await get("https://www.youtube.com/feeds/videos.xml?channel_id=UCMcwMtuOjp39M0JtLpbwvZg");
  const vids = xml.split(/<entry>/i).slice(1, 16).map(e => ({ id: clean(tag(e, "yt:videoId")), title: clean(tag(e, "title")), date: clean(tag(e, "published")) })).filter(v => v.id);
  if (vids.length) { fs.writeFileSync(path.join(ROOT, "news-videos.json"), JSON.stringify({ updated: new Date().toISOString(), videos: vids }, null, 1)); console.log("news-videos.json:", vids.length, "videos"); }
} catch (e) { console.error("videos failed:", e.message); }
