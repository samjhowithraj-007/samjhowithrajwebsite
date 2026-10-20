// Builds site-index.json: every lesson, page, Upcoming item and book FAQ as plain-text chunks for "Ask Raj".
// Run before each push:  node tools/build-index.mjs
// No packages needed. It runs the site's own <script> in a sandbox (with a do-nothing browser stub), then reads
// COURSES straight from the data and renders the other pages with the site's own view functions.
import fs from "fs"; import vm from "vm"; import path from "path"; import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const MAX = 900;

// ---- run the page script with a stub DOM ----
const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).join("\n;\n");
const stub = new Proxy(function () {}, {
  get(t, k) {
    if (k === Symbol.toPrimitive) return () => "";
    if (k === Symbol.iterator) return function* () {};
    if (k === "then") return undefined;
    if (k === "length") return 0;
    return stub;
  },
  set() { return true; }, apply() { return stub; }, construct() { return stub; },
});
const store = {};
const ctx = {
  document: stub, navigator: stub, location: stub, history: stub, performance: stub, Worker: stub, Blob: stub, URL: stub,
  TextDecoder, Date, Math, JSON, console, encodeURIComponent, decodeURIComponent, Promise, FormData: stub, fetch: stub,
  localStorage: { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
  matchMedia: () => ({ matches: false, addEventListener() {} }), addEventListener() {}, removeEventListener() {},
  setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, scrollTo() {}, getComputedStyle: stub, innerWidth: 1200,
};
ctx.window = ctx.self = ctx.globalThis = ctx;
vm.createContext(ctx);
vm.runInContext(script + `
;signup = () => ""; promo = () => ""; bookBox = () => ""; bookCard = () => "";
globalThis.__site = { PROMPTS, COURSES, BOOK, classroom, upcoming, community, about, privacy, playground, bookPage, books, shop, workshops };`, ctx, { filename: "index.html" });
const S = ctx.__site;

// ---- helpers ----
const decode = s => s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n));
const text = h => decode(String(h)
  .replace(/<(svg|script|style|select|textarea|dialog)[\s\S]*?<\/\1>/gi, " ")
  .replace(/<(br|\/p|\/li|\/h\d|\/div|\/summary|\/details|\/tr)\b[^>]*>/gi, "\n")
  .replace(/<li\b[^>]*>/gi, "• ")
  .replace(/<[^>]+>/g, " "))
  .replace(/[ \t]+/g, " ").replace(/ *\n */g, "\n").replace(/\n{2,}/g, "\n").trim();
function split(t, max = MAX) {            // cut long text at sentence / line ends
  const out = []; let cur = "";
  for (const part of t.split(/(?<=[.!?]) +|(?<=\n)(?=\S)/)) {   // keeps line breaks and code indentation
    if ((cur + " " + part).length > max && cur) { out.push(cur.trim()); cur = ""; }
    cur += (cur && !cur.endsWith("\n") ? " " : "") + part;
    while (cur.length > max) { out.push(cur.slice(0, max)); cur = cur.slice(max); }
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
const items = [];
const add = (type, id, title, url, body) => split(body).forEach((t, i, a) => items.push({ id: a.length > 1 ? `${id}-${i + 1}` : id, type, title, url, text: t }));

// page HTML → chunks, one per heading / FAQ entry
function page(id, name, url, h) {
  const parts = String(h).split(/(?=<h2\b|<h3\b|<details\b)/i);
  let n = 0, buf = "", head = name;
  const flush = () => { const t = text(buf); if (t.length > 30) add("page", `${id}-${++n}`, head === name ? name : `${name}: ${head}`, url, t); buf = ""; };
  for (const p of parts) {
    const m = p.match(/^<(h2|h3|details)\b[^>]*>([\s\S]*?)<\/(h2|h3|summary)>/i) || p.match(/^<details\b[^>]*><summary>([\s\S]*?)<\/summary>/i);
    const title = m ? text(m[m.length === 4 ? 2 : 1]).replace(/\n/g, " ") : null;
    if (title && (buf.length > 200 || /^<details/i.test(p))) { flush(); head = title.slice(0, 80); }
    else if (title && !buf.trim()) head = title.slice(0, 80);
    buf += p;
  }
  flush();
}

// ---- courses and lessons (from the data, not the rendered page) ----
for (const c of S.COURSES) {
  const all = c.modules.flatMap(m => m.lessons), live = all.filter(l => !l.locked);
  add("course", `course-${c.id}`, c.title, `#${live[0].id}`,
    `${c.title}. ${text(c.blurb)} ${live.length} of ${all.length} lessons available (${c.tag}). ` +
    c.modules.map(m => `${m.title}: ${m.lessons.map(l => l.title).join(", ")}.`).join(" "));
  live.forEach((l, i) => {
    const body = [
      `${c.title}, lesson ${i + 1}: ${l.title}.`,
      text((l.concept || []).join("\n")),
      l.list ? text(l.list.map(x => "• " + x).join("\n")) : "",
      l.takeaway ? "Remember: " + text(l.takeaway) : "",
      l.practice ? "Try it yourself: " + text(l.practice.join(" ")) : "",
      l.code ? "Code:\n" + l.code.trim() : "",
      l.output ? "Output:\n" + l.output.trim() : "",
    ].filter(Boolean).join("\n");
    add("lesson", l.id, `${c.title} · ${l.title}`, `#${l.id}`, body);
  });
  const next = all.filter(l => l.locked);
  if (next.length) add("episode", `upcoming-${c.id}`, `Coming next in ${c.title}`, "#upcoming",
    `Upcoming lessons in ${c.title}, in release order (each opens when its video is out): ` + next.map((l, k) => `${k + 1}. ${l.title}`).join("; ") + ".");
}

// ---- facts the pages show as buttons or prices, not sentences (kept in sync with the data) ----
const B = S.BOOK, rs = n => `₹${n}`;
add("book", "book-buy", "Python with Chai (book): price and how to buy", "#book",
  `The book ${B.title}: ${B.sub}, by ${B.author}. Price: ${rs(B.price)} per edition, ${rs(B.bundle)} for both editions (English + Hinglish). ` +
  (B.launchOn ? `Launch offer until ${B.launchEndsLabel}: ${rs(B.launch)} per edition, ${rs(B.bundleLaunch)} for both; the launch discount is applied automatically by the buy buttons. ` : "") +
  `Buy it on the Book page: the buy buttons open Gumroad; you get the PDF + EPUB download right after payment. Free preview chapters (English and Hinglish PDFs) are on the same page.`);
if (S.PROMPTS && S.PROMPTS.link) add("book", "prompts-buy", "50 AI Prompts for Jobs + Study: price and how to buy", "#shop",
  `The prompt pack "50 AI Prompts for Jobs + Study" by Raj: ready-to-use AI prompts for job search and studies, English and Hinglish PDFs in one download. ` +
  `Price: ${rs(S.PROMPTS.price)}. Buy it in the Shop: the "Get the 50 prompts" button opens Gumroad, and the PDFs download right after payment.`);
add("page", "install-app", "Install the Tech Samjho Raj app", "#classroom",
  "Install this site as an app (free, works offline): tap the Install app button at the top right of any page. " +
  "Android (Chrome): tap Install. iPhone (Safari): tap the Share button at the bottom, then Add to Home Screen. " +
  "iPhone (Chrome): tap Share in the address bar, then Add to Home Screen. Opened from WhatsApp, Instagram or Facebook? Open the link in Chrome or Safari first. " +
  "Computer (Chrome or Edge): click the install icon in the address bar, or the Install app button. The app opens the same lessons, progress and Playground.");
add("page", "ask-raj", "About Ask Raj (this helper)", "#chatbot-1",
  "Ask Raj is an automated helper, not Raj himself. It answers from this site's own lessons and pages: it searches them in your browser " +
  "(and, when switched on, asks an AI to write a short answer from the passages it found). It is built like the chatbot in the AI + Python course. " +
  "For questions about your own code, write to samjhowithraj@gmail.com.");

// ---- pages ----
page("classroom", "Classroom", "#classroom", S.classroom());
page("books", "Recommended books", "#books", S.books());
page("book", "Python with Chai (book)", "#book", S.bookPage());
page("playground", "Python Playground", "#playground", S.playground());
page("shop", "Shop", "#shop", S.shop());
page("workshops", "Workshops", "#workshops", S.workshops());
page("community", "Community", "#community", S.community());
page("about", "About Raj", "#about", S.about());
page("privacy", "Privacy", "#privacy", S.privacy());

// drop duplicates (same text twice), keep ids unique
const seen = new Set(), ids = new Set();
const out = items.filter(x => !seen.has(x.text) && seen.add(x.text)).map(x => { let id = x.id, k = 2; while (ids.has(id)) id = `${x.id}-${k++}`; ids.add(id); return { ...x, id }; });
let built = new Date().toISOString().slice(0, 10);
try { const old = JSON.parse(fs.readFileSync(path.join(ROOT, "site-index.json"), "utf8")); if (JSON.stringify(old.items) === JSON.stringify(out)) built = old.built; } catch (e) {}   // unchanged → no diff
fs.writeFileSync(path.join(ROOT, "site-index.json"), JSON.stringify({ site: "tech", built, items: out }) + "\n");
const counts = out.reduce((o, x) => (o[x.type] = (o[x.type] || 0) + 1, o), {});
console.log(`site-index.json: ${out.length} items`, counts, `${(fs.statSync(path.join(ROOT, "site-index.json")).size / 1024).toFixed(1)} KB`);
