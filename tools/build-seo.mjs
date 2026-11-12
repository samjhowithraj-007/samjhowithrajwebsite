// Builds the plain-HTML search pages: lesson pages, course hubs, book pages, /hi/ and /hinglish/, and sitemap.xml.
// Run before a push when lessons, books or prices change:  node tools/build-seo.mjs
// The single-page app (index.html) is rendered by JavaScript from #hash links, which search engines treat as ONE url.
// These pages give every lesson/book its own real url with its own title, description, canonical, one h1 and plain text.
// Content comes straight from the site's own data (COURSES, BOOK, PUZZLES), so nothing is typed twice.
// No packages needed. Output folders: learn/ python/ chatbot/ agentic-ai/ python-book/ reasoning-puzzles/ hi/ hinglish/
import fs from "fs"; import vm from "vm"; import path from "path"; import { fileURLToPath } from "url"; import { execSync } from "child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://www.techsamjhoraj.com";
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const TODAY = new Date().toISOString().slice(0, 10);

// ---- run the page script with a stub DOM (same trick as build-index.mjs) ----
const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).join("\n;\n");
const stub = new Proxy(function () {}, {
  get(t, k) { if (k === Symbol.toPrimitive) return () => ""; if (k === Symbol.iterator) return function* () {}; if (k === "then") return undefined; if (k === "length") return 0; return stub; },
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
vm.runInContext(script + `\n;globalThis.__site = { COURSES, BOOK, PUZZLES, live };`, ctx, { filename: "index.html" });
const { COURSES, BOOK, PUZZLES, live } = ctx.__site;

// ---- helpers ----
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const plain = h => String(h).replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const cut = (t, n = 155) => { t = plain(t); if (t.length <= n) return t; const c = t.slice(0, n - 1); return c.slice(0, c.lastIndexOf(" ")).replace(/[,;:.\s]+$/, "") + "…"; };
const ld = o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`;
const write = (rel, content) => { const f = path.join(ROOT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, content); };
const gitDate = rel => { try { const d = execSync(`git log -1 --format=%cs -- "${rel}"`, { cwd: ROOT }).toString().trim(); return d || TODAY; } catch { return TODAY; } };
const gitAdded = rel => { try { const d = execSync(`git log --diff-filter=A --format=%aI -- "${rel}"`, { cwd: ROOT }).toString().trim().split("\n").pop(); return d || null; } catch { return null; } };
const url = p => SITE + p;

const SHORT = { python: "Python with Chai", chatbot: "Chai Chatbot", agentic: "Agentic AI with Bunty" };
const COURSE_URL = { python: "/python/", chatbot: "/chatbot/", agentic: "/agentic-ai/" };
const courses = COURSES.map(c => ({ ...c, lessons: live(c), url: COURSE_URL[c.id] || `/${c.id}/` }));
const lessonUrl = id => `/learn/${id}/`;
const hashUrl = id => `/#${id}`;
const sitemap = [];   // { loc, lastmod }

// ---- shared page shell ----
const CSS = `:root{--bg:#0b1020;--card:#141b33;--fg:#e9edf9;--mut:#a9b3d1;--line:#27325a;--gold:#f5b544;--cy:#43e0d2;color-scheme:dark}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:17px/1.65 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
a{color:var(--cy)}header,main,footer{max-width:820px;margin:0 auto;padding:0 18px}
header{display:flex;flex-wrap:wrap;gap:10px 18px;align-items:center;padding-top:16px;padding-bottom:12px;border-bottom:1px solid var(--line)}
header .logo{font:800 20px system-ui;color:var(--fg);text-decoration:none}header .logo span{color:var(--gold)}
header nav{display:flex;flex-wrap:wrap;gap:6px 16px;font-size:15px}
main{padding-top:26px;padding-bottom:30px}h1{font-size:clamp(28px,5vw,40px);line-height:1.15;margin:.2em 0 .4em}h2{font-size:24px;margin:1.6em 0 .4em}h3{font-size:19px;margin:1.2em 0 .3em}
p,li{color:#d4daf0}.crumb{font-size:14px;color:var(--mut)}.lead{font-size:19px;color:var(--fg)}
.cta{display:inline-block;background:var(--gold);color:#241a00;font-weight:800;text-decoration:none;padding:12px 20px;border-radius:12px;margin:8px 10px 8px 0}.cta.alt{background:transparent;color:var(--cy);border:2px solid var(--cy)}
pre{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px;overflow-x:auto;font:14.5px/1.55 ui-monospace,Consolas,monospace;color:#dffcf7}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px 18px;margin:12px 0}
ul.lessons{padding-left:20px}ul.lessons li{margin:4px 0}
details{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px 16px;margin:10px 0}summary{cursor:pointer;font-weight:700}
footer{border-top:1px solid var(--line);padding-top:18px;padding-bottom:36px;font-size:14.5px;color:var(--mut)}footer a{margin-right:12px}
img{max-width:100%;height:auto;border-radius:12px}`;
function shell({ lang = "en", title, desc, path: p, h, jsonld = [], alternates = "", ogImage = "/img/og-card.jpg", ogImageAlt = "Tech Samjho Raj logo: Raj's drawn portrait and the words Free Python + AI lessons" }) {
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url(p)}">
${alternates}<meta property="og:type" content="website">
<meta property="og:site_name" content="Tech Samjho Raj">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url(p)}">
<meta property="og:image" content="${url(ogImage)}">
<meta property="og:image:alt" content="${esc(ogImageAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0b1020">
<link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32.png">
${jsonld.map(ld).join("\n")}
<style>${CSS}</style>
</head>
<body>
<header><a class="logo" href="/"><span>Tech</span> Samjho Raj</a>
<nav aria-label="Site"><a href="/python/">Python</a><a href="/chatbot/">Chatbot</a><a href="/agentic-ai/">AI agents</a><a href="/python-book/">Book</a><a href="/puzzles/">Dada World</a><a href="/hinglish/">Hinglish</a><a href="/hi/">हिंदी</a></nav></header>
<main>
${h}
</main>
<footer><p>© 2026 Tech Samjho Raj · Free Python and AI lessons · No tracking, no cookies</p>
<p><a href="/#terms">Terms</a><a href="/#refund">Refunds</a><a href="/#shipping">Shipping and delivery</a><a href="/#contact">Contact</a><a href="/#privacy">Privacy</a></p>
<p><a href="https://www.youtube.com/@SamjhowithRaj">YouTube</a><a href="https://whatsapp.com/channel/0029VbDWZ7lEawdpgGPw5t0y">WhatsApp</a><a href="https://t.me/techsamjhoraj">Telegram</a></p></footer>
</body>
</html>
`;
}
const orgNode = { "@type": "Organization", "@id": `${SITE}/#org`, name: "Tech Samjho Raj", url: `${SITE}/` };
const crumbs = items => ({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map(([name, p], i) => ({ "@type": "ListItem", position: i + 1, name, item: url(p) })) });

// ---- YouTube upload dates (cached; fetched once from the public watch page) ----
const DATES_FILE = path.join(ROOT, "tools", "video-dates.json");
const dates = fs.existsSync(DATES_FILE) ? JSON.parse(fs.readFileSync(DATES_FILE, "utf8")) : {};
const ytId = u => (u.match(/(?:youtu\.be\/|shorts\/|v=)([\w-]{11})/) || [])[1];
for (const c of courses) for (const l of c.lessons) {
  const id = l.yt && ytId(l.yt);
  if (id && !dates[id]) {
    try {
      const r = await fetch(`https://www.youtube.com/watch?v=${id}`, { headers: { "User-Agent": "Mozilla/5.0", "Accept-Language": "en" } });
      const t = await r.text(); const m = t.match(/itemprop="uploadDate" content="([^"]+)"/) || t.match(/"uploadDate":"([^"]+)"/);
      if (m) dates[id] = m[1];
    } catch {}
  }
}
fs.writeFileSync(DATES_FILE, JSON.stringify(dates, null, 2) + "\n");

// ---- lesson pages ----
function videoObject(c, l, n) {
  const name = `${l.title} (${c.title}, lesson ${n})`, desc = cut(l.concept[0], 200);
  if (l.video) {
    const added = gitAdded("media/" + l.video.replace(/^media\//, ""));
    if (!added) return null;
    return { "@type": "VideoObject", name, description: desc, thumbnailUrl: url("/" + l.video.replace(".mp4", ".jpg")), uploadDate: added, contentUrl: url("/" + l.video), inLanguage: "hi-Latn" };
  }
  const id = l.yt && ytId(l.yt);
  if (id && dates[id]) return { "@type": "VideoObject", name, description: desc, thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, uploadDate: dates[id], embedUrl: `https://www.youtube.com/embed/${id}`, inLanguage: "hi-Latn" };
  return null;
}
for (const c of courses) {
  c.lessons.forEach((l, i) => {
    const n = i + 1, prev = c.lessons[i - 1], next = c.lessons[i + 1], p = lessonUrl(l.id);
    let title = `${l.title} | ${SHORT[c.id] || c.title} lesson ${n} | Tech Samjho Raj`; if (title.length > 72) title = `${l.title} | ${SHORT[c.id] || c.title} lesson ${n}`;
    const desc = cut(l.concept.map(plain).join(" "), 155);
    const vo = videoObject(c, l, n);
    const g = [{ "@context": "https://schema.org", "@graph": [
      { "@type": "LearningResource", "@id": url(p) + "#lesson", name: l.title, description: desc, url: url(p), learningResourceType: "lesson", educationalLevel: "Beginner", inLanguage: "en", publisher: { "@id": `${SITE}/#org` }, author: { "@type": "Person", name: "Raj" }, isPartOf: { "@type": "Course", name: c.title, url: url(c.url), provider: { "@id": `${SITE}/#org` } } },
      orgNode, ...(vo ? [vo] : []) ] }, crumbs([["Home", "/"], [c.title, c.url], [l.title, p]])];
    const body = `<p class="crumb"><a href="/">Home</a> › <a href="${c.url}">${esc(c.title)}</a> › Lesson ${n}</p>
<h1>${esc(l.title)}</h1>
<p class="lead">${esc(c.title)}, lesson ${n} of ${c.lessons.length}. ${l.video ? "A short Hinglish video, " : ""}simple English notes${l.code ? " and code you can run" : ""}, free.</p>
<p><a class="cta" href="${hashUrl(l.id)}">Open the interactive lesson${l.code ? " with Run button" : ""}</a>${l.yt ? `<a class="cta alt" href="${esc(l.yt)}">Watch on YouTube</a>` : ""}</p>
<h2>The idea</h2>
${l.concept.map(x => `<p>${x}</p>`).join("\n")}${l.list ? `\n<ul>${l.list.map(x => `<li>${x}</li>`).join("")}</ul>` : ""}
${l.code ? `<h2>The code</h2>\n<pre><code>${esc(l.code)}</code></pre>${l.output ? `\n<p>Output:</p>\n<pre>${esc(l.output)}</pre>` : ""}` : ""}
<h2>Try it yourself</h2>
<ul>${l.practice.map(x => `<li>${x}</li>`).join("")}</ul>
<h2>Remember</h2>
<p>${l.takeaway}</p>
<p>${prev ? `← <a href="${lessonUrl(prev.id)}">${esc(prev.title)}</a>` : ""}${prev && next ? " · " : ""}${next ? `<a href="${lessonUrl(next.id)}">${esc(next.title)}</a> →` : ""}</p>
<p>All lessons: <a href="${c.url}">${esc(c.title)}</a></p>`;
    write(`learn/${l.id}/index.html`, shell({ title, desc, path: p, h: body, jsonld: g }));
    sitemap.push({ loc: p, lastmod: TODAY });
  });
}

// ---- course hubs ----
const HUB = {
  python: { title: "Learn Python Free in Hinglish: 20 Lessons | Tech Samjho Raj", h1: "Learn Python free, the chai way", desc: "20 short Python lessons: a Hinglish video, simple English notes and code you can run. From print() and variables to loops. No sign-up, no install." },
  chatbot: { title: "Chatbot Kaise Banaye Python Mein: Free Lessons | Tech Samjho Raj", h1: "Chatbot kaise banaye Python mein: build a chai chatbot", desc: "Build a chatbot in Python step by step: if-else, dictionaries, input(), random replies and a bill calculator. Short Hinglish videos and runnable code, free." },
  agentic: { title: "Agentic AI Kya Hai? AI Agents Explained | Tech Samjho Raj", h1: "Agentic AI kya hai? AI agents explained with Bunty", desc: "What is agentic AI? Short episodes with Bunty the AI intern: goals, tools, the agent loop, planning and memory, in simple words. Free." },
};
for (const c of courses) {
  const H = HUB[c.id]; const done = c.lessons.length;
  const g = [{ "@context": "https://schema.org", "@graph": [orgNode, { "@type": "Course", "@id": url(c.url) + "#course", name: c.title, description: cut(c.blurb, 250), url: url(c.url), provider: { "@id": `${SITE}/#org` }, inLanguage: "en", isAccessibleForFree: true, educationalLevel: "Beginner", hasCourseInstance: { "@type": "CourseInstance", courseMode: "online", courseWorkload: "PT5M" } }] }, crumbs([["Home", "/"], [c.title, c.url]])];
  const body = `<p class="crumb"><a href="/">Home</a> › ${esc(c.title)}</p>
<h1>${esc(H.h1)}</h1>
<p class="lead">${esc(c.blurb)}</p>
<p>${done} lessons are live. Every lesson has simple English notes and, where it makes sense, code you can run in your browser. Videos are short and in Hinglish. No account is needed.</p>
<p><a class="cta" href="${hashUrl(c.lessons[0].id)}">Start lesson 1</a><a class="cta alt" href="/">All courses</a></p>
<h2>All ${done} lessons</h2>
<ol class="lessons">${c.lessons.map(l => `<li><a href="${lessonUrl(l.id)}">${esc(l.title)}</a></li>`).join("")}</ol>
${c.playlist ? `<p>Every episode is also on <a href="${esc(c.playlist)}">YouTube</a>.</p>` : ""}`;
  write(`${c.url.slice(1)}index.html`, shell({ title: H.title, desc: H.desc, path: c.url, h: body, jsonld: g }));
  sitemap.push({ loc: c.url, lastmod: TODAY });
}

// ---- book pages ----
const bookOffers = (B, cur = "INR") => [["en", "English edition", B.price], ["hi", "Hinglish edition", B.price], ["both", "Both editions", B.bundle]].map(([k, name, price]) => ({ "@type": "Offer", name, price: String(price), priceCurrency: cur, availability: "https://schema.org/InStock", url: B.buy[k], itemCondition: "https://schema.org/NewCondition" }));
const FAQ = [
  ["What format is the Python with Chai book?", "PDF + EPUB, both included in every purchase. The PDF (A5 pages) reads well on a phone, tablet or laptop and prints nicely; the EPUB is for Kindle, Kobo and phone e-book readers."],
  ["English or Hinglish edition?", "Same chapters, same code, same pages. Pick the language you enjoy reading, or get both editions."],
  ["I do not have Python installed. Can I still use the book?", "Yes. Paste any example into the free Python Playground on this site and press Run: it runs in your browser, even on a phone. Almost every example works there."],
  ["Do I need to know coding?", "No. Chapter 1 starts from installing Python. The expert chapters are there when you are ready."],
  ["Can I read a free preview first?", "Yes. Every preview chapter shows the title page, a chai-shop story and a sneak peek, in English and Hinglish PDFs."],
];
{
  const p = "/python-book/", title = "Python Book in Hinglish and English (PDF + EPUB) | Tech Samjho Raj";
  const desc = "Python with Chai: 30 illustrated chapters, 300+ pages, from print() to decorators and a real project. English and Hinglish editions, free chapter previews.";
  const g = [{ "@context": "https://schema.org", "@graph": [orgNode,
    { "@type": "Book", "@id": url(p) + "#book", name: `${BOOK.title}: ${BOOK.sub}`, author: { "@type": "Person", name: BOOK.author }, publisher: { "@id": `${SITE}/#org` }, description: desc, image: url("/media/book-cover-en.jpg"), url: url(p), inLanguage: ["en", "hi-Latn"], bookFormat: "https://schema.org/EBook", genre: "Programming", numberOfPages: 300, offers: bookOffers(BOOK) },
    { "@type": "FAQPage", mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }] }, crumbs([["Home", "/"], ["Python with Chai book", p]])];
  const previews = BOOK.previews.map(n => { const ch = BOOK.chapters.find(c => c[0] === n); return `<li>Chapter ${n}: ${esc(ch ? ch[2] : "")}: <a href="/notes/book-ch${n}-en-preview.pdf">English</a> · <a href="/notes/book-ch${n}-hi-preview.pdf">Hinglish</a></li>`; }).join("");
  const body = `<p class="crumb"><a href="/">Home</a> › Python with Chai book</p>
<h1>Python with Chai: learn Python from Basic to Expert, in Hinglish or English</h1>
<p class="lead">Learn Python the chai way: one cup, one chapter. 30 illustrated chapters (300+ pages) take you from <code>print()</code> to decorators, asyncio and a real capstone project, with Chotu the chai-cup buddy on every page. By ${esc(BOOK.author)}, ${esc(BOOK.cred)}.</p>
<img src="/media/book-mockup-tech.webp" alt="Python with Chai, Tech Edition (English): 3D view of the navy book with a chai glass on the cover" width="560" height="700" style="max-width:260px"> <img src="/media/book-mockup-hi.webp" alt="Python with Chai, Hinglish Edition: 3D view of the navy book" width="560" height="700" style="max-width:260px">
<ul><li>30 chapters, Basic, Intermediate and Expert</li><li>Two editions: English and Hinglish (or both)</li><li>120+ examples, every output checked by really running the code</li><li>Common mistakes with real error messages, practice, answers, cheat sheets and an index</li></ul>
<h2>Price</h2>
<p>Regular price: ${BOOK.price > 0 ? `₹${BOOK.price}` : ""} per edition, ₹${BOOK.bundle} for both editions. A launch offer may be running: <a href="/#book">see today's price on the book page</a>. Checkout is on Gumroad (in US dollars, GST extra for India buyers).</p>
<p><a class="cta" href="/#book">See today's price and buy</a><a class="cta alt" href="${BOOK.buy.en}">English edition</a><a class="cta alt" href="${BOOK.buy.hi}">Hinglish edition</a></p>
<h2>Free chapter previews</h2>
<ul class="lessons">${previews}</ul>
<h2>Questions</h2>
${FAQ.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("\n")}
<p>Python is a trademark of the Python Software Foundation. This book is not affiliated with or endorsed by it.</p>`;
  write("python-book/index.html", shell({ title, desc, path: p, h: body, jsonld: g, ogImage: "/media/book-cover-en.jpg", ogImageAlt: "Python with Chai book cover, Tech Edition" }));
  sitemap.push({ loc: p, lastmod: TODAY });
}
{
  const p = "/reasoning-puzzles/", title = "Reasoning Puzzles for Exams: Reasoning Samjho | Tech Samjho Raj";
  const desc = "192 original reasoning puzzles and 3 mock tests for SSC, Bank, Railway, CSAT, CAT, CLAT, GATE and IT placements. English and Hinglish editions, free Chapter 1.";
  const g = [{ "@context": "https://schema.org", "@graph": [orgNode,
    { "@type": "Book", "@id": url(p) + "#book", name: `${PUZZLES.title}: ${PUZZLES.sub}`, author: { "@type": "Person", name: "Raj" }, publisher: { "@id": `${SITE}/#org` }, description: desc, image: url("/" + PUZZLES.cover), url: url(p), inLanguage: ["en", "hi-Latn"], bookFormat: "https://schema.org/EBook", genre: "Reasoning and aptitude", offers: bookOffers(PUZZLES) }] }, crumbs([["Home", "/"], ["Reasoning Samjho", p]])];
  const body = `<p class="crumb"><a href="/">Home</a> › Reasoning Samjho</p>
<h1>Reasoning puzzles for exams: Reasoning Samjho</h1>
<p class="lead">192 original reasoning puzzles and 3 mock tests for SSC, Bank, Railway, CSAT, CAT, CLAT, GATE and IT placements, by Raj, with Dimaag Dada. English and Hinglish editions.</p>
<img src="/${PUZZLES.cover}" alt="Reasoning Samjho book cover: Dimaag Dada at a green chalkboard" width="420" height="596" style="max-width:240px">
<h2>Price</h2>
<p>Regular price: ₹${PUZZLES.price} per edition, ₹${PUZZLES.bundle} for both. A launch offer may be running: <a href="/#puzzles">see today's price</a>. Checkout is on Gumroad.</p>
<p><a class="cta" href="/#puzzles">Read free Chapter 1 and buy</a><a class="cta alt" href="/puzzles/">Play Dada World puzzles free</a></p>
<h2>Free puzzles every day</h2>
<p>Dimaag Dada posts a new puzzle every day on <a href="https://www.youtube.com/@DimaagDada">YouTube</a>. In <a href="/puzzles/">Dada World</a> you can play jigsaws, Ludo, Snakes &amp; Sums and chess for free.</p>`;
  write("reasoning-puzzles/index.html", shell({ title, desc, path: p, h: body, jsonld: g, ogImage: "/" + PUZZLES.cover, ogImageAlt: "Reasoning Samjho book cover" }));
  sitemap.push({ loc: p, lastmod: TODAY });
}

// ---- language pages: /hi/ (Hindi) and /hinglish/ (Hinglish, Latin script), reciprocal hreflang with the home page ----
const alt = `<link rel="alternate" hreflang="en" href="${SITE}/">
<link rel="alternate" hreflang="hi" href="${SITE}/hi/">
<link rel="alternate" hreflang="en-IN" href="${SITE}/hinglish/">
<link rel="alternate" hreflang="x-default" href="${SITE}/">
`;
const pyc = courses.find(c => c.id === "python"), bot = courses.find(c => c.id === "chatbot"), ag = courses.find(c => c.id === "agentic");
const LANG = {
  hinglish: {
    lang: "en-IN", p: "/hinglish/",
    title: "Python Hinglish Mein Seekhein: Free Lessons | Tech Samjho Raj",
    desc: "Python aur AI Hinglish mein seekhein, bilkul free: chhote videos, simple notes aur code jo browser mein chalta hai. Python with Chai book Hinglish edition mein bhi.",
    h1: "Python Hinglish mein seekhein, free",
    intro: `Yahan Python aur AI ke lessons hain, ekdum simple Hinglish mein. Har lesson mein chhota video, aasaan notes aur code hai jo aap apne browser mein chala sakte hain. Kuch install karna nahi hai, sign-up bhi nahi. Raj ek technology architect hain, aur 20 saal ka experience seedhe chai ke example se samjhate hain. Pehle <a href="${pyc.url}">Python with Chai</a> se shuru karein, phir apna chatbot banayein, aur ant mein AI agents samjhein.`,
    blocks: [
      ["Kahan se shuru karein", `<ul class="lessons"><li><a href="${pyc.url}">Python with Chai</a>: ${pyc.lessons.length} lessons, Python ke basics se loops tak.</li><li><a href="${bot.url}">Chatbot kaise banaye Python mein</a>: chai shop ka chatbot, step by step, ${bot.lessons.length} parts abhi live.</li><li><a href="${ag.url}">Agentic AI kya hai</a>: Bunty ke saath AI agents ke ${ag.lessons.length} episodes.</li><li><a href="/python-book/">Python with Chai book</a>: 30 chapters, English aur Hinglish edition.</li></ul>`],
    ],
    faq: [
      ["Python Hinglish mein kaise seekhein?", `<a href="${pyc.url}">Python with Chai</a> se shuru karein. Har lesson ka video Hinglish mein hai, notes English mein hain, aur code aap browser mein run kar sakte hain.`],
      ["Kya sab kuch free hai?", "Haan. Saare lessons, notes aur Python Playground free hain, bina sign-up ke. Sirf books paid hain."],
      ["Python book Hinglish mein kahan milegi?", `<a href="/python-book/">Python with Chai book</a> English aur Hinglish dono edition mein hai. Pehle free chapter preview padh sakte hain.`],
      ["Chatbot kaise banaye Python mein?", `<a href="${bot.url}">Chai chatbot ke lessons</a> dekhein: if-else se shuru karke dictionary, input(), random replies aur bill banana, sab step by step.`],
      ["Agentic AI kya hai?", `AI agent aisa AI hai jo sirf jawab nahi deta, kaam poora karta hai. Woh goal samajhta hai, tools use karta hai, aur sochna, karna, check karna ka loop tab tak chalata hai jab tak kaam ho na jaye. <a href="${ag.url}">Bunty ke episodes</a> mein yeh aasan kahaniyon se samjhaya hai.`],
      ["Exam ke reasoning puzzles kahan milenge?", `<a href="/reasoning-puzzles/">Reasoning Samjho</a> mein 192 original puzzles aur 3 mock tests hain, aur <a href="/puzzles/">Dada World</a> mein roz ek free puzzle.`],
    ],
  },
  hi: {
    lang: "hi", p: "/hi/",
    title: "हिंदी में Python सीखें: मुफ़्त लेसन | Tech Samjho Raj",
    desc: "Python और AI हिंदी-अंग्रेज़ी मिलाकर आसान भाषा में सीखें, बिल्कुल मुफ़्त: छोटे वीडियो, सरल नोट्स और ऐसा कोड जो आपके ब्राउज़र में चलता है। Python with Chai किताब हिंग्लिश में भी।",
    h1: "हिंदी में Python सीखें, मुफ़्त",
    intro: `यहाँ Python और AI के लेसन हैं, आसान भाषा में। हर लेसन में एक छोटा वीडियो, सरल नोट्स और ऐसा कोड है जिसे आप अपने ब्राउज़र में चला सकते हैं। कुछ इंस्टॉल नहीं करना, साइन-अप भी नहीं। राज एक टेक्नोलॉजी आर्किटेक्ट हैं और अपने 20 साल के अनुभव को चाय के उदाहरणों से समझाते हैं। पहले <a href="${pyc.url}">Python with Chai</a> से शुरू करें, फिर अपना चैटबॉट बनाएँ, और आख़िर में AI एजेंट समझें। वीडियो हिंग्लिश में हैं और नोट्स अंग्रेज़ी में।`,
    blocks: [
      ["कहाँ से शुरू करें", `<ul class="lessons"><li><a href="${pyc.url}">Python with Chai</a>: ${pyc.lessons.length} लेसन, Python की बुनियाद से लूप तक।</li><li><a href="${bot.url}">Python में चैटबॉट कैसे बनाएँ</a>: चाय की दुकान का चैटबॉट, कदम दर कदम।</li><li><a href="${ag.url}">एजेंटिक AI क्या है</a>: बंटी के साथ AI एजेंट के एपिसोड।</li><li><a href="/python-book/">Python with Chai किताब</a>: 30 चैप्टर, अंग्रेज़ी और हिंग्लिश संस्करण।</li></ul>`],
    ],
    faq: [
      ["हिंदी में Python कैसे सीखें?", `<a href="${pyc.url}">Python with Chai</a> से शुरू करें। हर लेसन का वीडियो हिंग्लिश में है, नोट्स अंग्रेज़ी में हैं, और कोड आप ब्राउज़र में चला सकते हैं।`],
      ["क्या सब कुछ मुफ़्त है?", "हाँ। सभी लेसन, नोट्स और Python Playground बिना साइन-अप के मुफ़्त हैं। सिर्फ़ किताबें पेड हैं।"],
      ["Python की किताब हिंग्लिश में कहाँ मिलेगी?", `<a href="/python-book/">Python with Chai किताब</a> अंग्रेज़ी और हिंग्लिश दोनों संस्करणों में है। पहले मुफ़्त चैप्टर प्रीव्यू पढ़ सकते हैं।`],
      ["एजेंटिक AI क्या है?", `AI एजेंट ऐसा AI है जो सिर्फ़ जवाब नहीं देता, काम पूरा करता है। वह लक्ष्य समझता है, टूल इस्तेमाल करता है, और सोचो-करो-जाँचो का लूप तब तक चलाता है जब तक काम पूरा न हो जाए। <a href="${ag.url}">बंटी के एपिसोड</a> में यह आसान कहानियों से समझाया गया है।`],
      ["परीक्षा के रीज़निंग पज़ल कहाँ मिलेंगे?", `<a href="/reasoning-puzzles/">Reasoning Samjho</a> में 192 मौलिक पज़ल और 3 मॉक टेस्ट हैं, और <a href="/puzzles/">Dada World</a> में रोज़ एक मुफ़्त पज़ल।`],
    ],
  },
};
for (const k of Object.keys(LANG)) {
  const L = LANG[k], faqLabel = k === "hi" ? "अक्सर पूछे जाने वाले सवाल" : "Aksar pooche jaane wale sawal";
  const g = [{ "@context": "https://schema.org", "@graph": [orgNode, { "@type": "WebPage", "@id": url(L.p) + "#page", name: L.title, description: L.desc, url: url(L.p), inLanguage: L.lang, isPartOf: { "@type": "WebSite", url: `${SITE}/`, name: "Tech Samjho Raj" } },
    { "@type": "FAQPage", mainEntity: L.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: plain(a) } })) }] }];
  const body = `<h1>${L.h1}</h1>
<p class="lead">${L.intro}</p>
<p><a class="cta" href="${hashUrl(pyc.lessons[0].id)}">${k === "hi" ? "पहला लेसन शुरू करें" : "Pehla lesson shuru karein"}</a><a class="cta alt" href="/">${k === "hi" ? "सारे कोर्स" : "Saare courses"}</a></p>
${L.blocks.map(([t, b]) => `<h2>${t}</h2>\n${b}`).join("\n")}
<h2>${faqLabel}</h2>
${L.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${a}</p></details>`).join("\n")}`;
  write(`${L.p.slice(1)}index.html`, shell({ lang: L.lang, title: L.title, desc: L.desc, path: L.p, h: body, jsonld: g, alternates: alt }));
  sitemap.push({ loc: L.p, lastmod: TODAY });
}

// ---- sitemap.xml: home + app pages + every generated page ----
const puzzlePages = ["", "ludo.html", "snakes-sums.html", "chess.html", "comics.html", "terms.html", "refund.html", "shipping.html", "contact.html", "privacy.html"];
const all = [
  { loc: "/", lastmod: gitDate("index.html") },
  ...puzzlePages.map(f => ({ loc: "/puzzles/" + f, lastmod: gitDate(f ? "puzzles/" + f : "puzzles/index.html") })),
  ...sitemap,
];
const prio = loc => loc === "/" ? "1.0" : /^\/(python|chatbot|agentic-ai|python-book)\/$/.test(loc) ? "0.9" : loc.startsWith("/learn/") ? "0.7" : "0.6";
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${all.map(u => `  <url><loc>${SITE}${u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${prio(u.loc)}</priority>${["/", "/hi/", "/hinglish/"].includes(u.loc) ? `\n    <xhtml:link rel="alternate" hreflang="en" href="${SITE}/"/><xhtml:link rel="alternate" hreflang="hi" href="${SITE}/hi/"/><xhtml:link rel="alternate" hreflang="en-IN" href="${SITE}/hinglish/"/><xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/>\n  ` : ""}</url>`).join("\n")}
</urlset>
`);
// ---- plain HTML for the home page: one real h1, a short intro and the lesson list, inside <main> (the app replaces it when its script runs) ----
{
  const intro = "Learn Python and AI in Hinglish, free. Tech Samjho Raj has short videos in Hinglish, simple English notes and code you can run right in your browser, with no sign-up and nothing to install. Start with Python with Chai (" + courses[0].lessons.length + " lessons), then build your own chatbot step by step, and finally learn what agentic AI is with Bunty the AI intern. Raj is a technology architect with 20 years of experience, and every lesson uses easy chai-shop examples. Prefer a book? Python with Chai comes in English and Hinglish editions with free chapter previews. Kids and exam students can play free reasoning puzzles in Dada World.";
  const blk = `<!--seo-home-start--><div class="seo-home"><h1>Learn Python and AI in Hinglish, free</h1><p>${intro}</p>` +
    courses.map(c => `<h2><a href="${c.url}">${esc(c.title)}</a></h2><ul>${c.lessons.map(l => `<li><a href="${lessonUrl(l.id)}">${esc(l.title)}</a></li>`).join("")}</ul>`).join("") +
    `<p><a href="/python-book/">Python with Chai book</a> · <a href="/reasoning-puzzles/">Reasoning Samjho</a> · <a href="/puzzles/">Dada World</a> · <a href="/hinglish/">Hinglish</a> · <a href="/hi/">हिंदी</a></p></div><!--seo-home-end-->`;
  const f = path.join(ROOT, "index.html"); let h = fs.readFileSync(f, "utf8");
  const a = h.indexOf("<!--seo-home-start-->"), b = h.indexOf("<!--seo-home-end-->");
  if (a < 0 || b < 0) throw new Error("index.html has no seo-home markers");
  h = h.slice(0, a) + blk + h.slice(b + "<!--seo-home-end-->".length);
  fs.writeFileSync(f, h);
}
console.log(`seo pages: ${sitemap.length} (lessons ${courses.reduce((a, c) => a + c.lessons.length, 0)}), sitemap urls: ${all.length}, video dates cached: ${Object.keys(dates).length}`);
