/* Tech news (#news): daily headlines from public feeds (news.json, refreshed by the publish workflow) + Raj's news videos (news-videos.json). 17 Nov 2026 */
(function(){
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let DATA = null, VIDS = null, TAKE = null;
const load = () => DATA ? Promise.resolve() : Promise.all([fetch("news.json", { cache: "no-store" }).then(r => r.json()).catch(() => ({ items: [] })), fetch("news-videos.json", { cache: "no-store" }).then(r => r.json()).catch(() => ({ videos: [] }))]).then(([n, v]) => { DATA = n; VIDS = v; return fetch("news-take.json", { cache: "no-store" }).then(r => r.ok ? r.json() : null).catch(() => null); }).then(t => { TAKE = t; });
function ago(iso){ const m = Math.max(1, Math.round((Date.now() - Date.parse(iso)) / 6e4)); return m < 60 ? m + " min ago" : m < 1440 ? Math.round(m / 60) + " h ago" : Math.round(m / 1440) + " d ago"; }
const TOPICS = ["AI", "Big Tech", "Startups & business", "Chips & hardware", "Cloud & software", "Cybersecurity", "India tech", "Science & space", "Gadgets"];
const EMO = { "AI": "🤖", "Big Tech": "🏢", "Startups & business": "🚀", "Chips & hardware": "🔌", "Cloud & software": "☁️", "Cybersecurity": "🔐", "India tech": "🇮🇳", "Science & space": "🛰️", "Gadgets": "📱" };
const LEARN = [[/\b(llm|gpt|openai|claude|anthropic|gemini|chatbot|language model|generative|genai|copilot)\b/i, "llm"], [/\b(agent|agents|agentic|mcp)\b/i, "mcp"], [/\b(rag|vector|embeddings?)\b/i, "rag"], [/hack|breach|vulnerab|ransomware|malware|cyber|phishing|security/i, "security"], [/\b(kubernetes|containers?|docker)\b/i, "k8s"], [/\b(cloud|azure|aws)\b|data cent/i, "azure"], [/\b(database|sql|postgres)\b/i, "sql"], [/machine learning|neural|deep learning|\bAI\b|nvidia|\bchips?\b/i, "ml"], [/\b(github|git)\b/i, "git"], [/\bapis?\b/i, "api"], [/\b(javascript|browser)\b/i, "javascript"], [/databricks|\bspark\b|data engineer|data pipeline/i, "databricks"], [/\bpython\b/i, "python-1"]];
function learnFor(n){ const t = n.title + " " + (n.summary || ""); for (const [re, id] of LEARN) if (re.test(t)) { const g = window.RDLEARN && RDLEARN.T && RDLEARN.T[id]; if (g) return { href: "#learn-" + id, label: g.t }; if (id === "python-1") return { href: "#python-1", label: "Python with Chai" }; } return null; }
const card = n => { const L = learnFor(n); return `<div class="nw-c"><a class="nw-ca" href="${esc(n.link)}" target="_blank" rel="noopener nofollow"><div class="nw-img" data-t="${esc(n.topic)}"><span>${EMO[n.topic] || "📰"}</span>${n.image ? `<img src="${esc(n.image)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">` : ""}</div><div class="nw-top"><span class="nw-src">${esc(n.source)}</span><span class="nw-tp">${esc(n.topic)}</span></div><h3>${esc(n.title)}</h3>${n.summary ? `<p>${esc(n.summary)}</p>` : ""}<div class="nw-m"><span>${ago(n.date)}</span><span>Read at ${esc(n.source)} ↗</span></div></a>${L ? `<a class="nw-learn" href="${L.href}">🎓 Learn this: ${esc(L.label)} →</a>` : ""}</div>`; };
function take(){ if (!TAKE || !TAKE.text) return ""; return `<section class="nw-take"><img src="img/rd/botu.png" alt="" width="64" height="100"><div><h2>Raj's take${TAKE.date ? " · " + esc(TAKE.date) : ""}</h2><p><b>${esc(TAKE.headline || "")}</b></p><p>${esc(TAKE.text)}</p>${TAKE.lesson ? `<p><a class="btn primary" href="${esc(TAKE.lesson)}">${esc(TAKE.lessonLabel || "Learn this")} →</a></p>` : ""}</div></section>`; }
function vids(){
 const all = (VIDS && VIDS.videos) || [], news = all.filter(v => /news|update|trending|this week/i.test(v.title)), list = (news.length ? news : all).slice(0, 7), lead = list[0];
 if (!lead) return `<section class="nw-vid"><h2>Raj's tech news videos</h2><p class="nw-vs">Raj's tech news videos will appear here. Subscribe on <a href="https://www.youtube.com/@SamjhowithRaj" target="_blank" rel="noopener">YouTube</a> to get them first.</p></section>`;
 return `<section class="nw-vid"><h2>${news.length ? "Raj's tech news videos" : "Latest from Raj's channel"}</h2><p class="nw-vs">${news.length ? "Short explainers on what is happening in technology." : "Videos with News in the title appear here automatically as soon as Raj posts them."}</p>
 <div class="nw-vg"><div class="nw-lead"><div class="nw-frame" id="nw-frame"><iframe src="https://www.youtube-nocookie.com/embed/${lead.id}?rel=0" title="${esc(lead.title)}" loading="lazy" allowfullscreen></iframe></div><h3 id="nw-vt">${esc(lead.title)}</h3></div>
 <div class="nw-vl">${list.map((v, i) => `<button type="button" class="nw-vi${i === 0 ? " on" : ""}" data-vid="${v.id}" data-vt="${esc(v.title)}"><img src="https://i.ytimg.com/vi/${v.id}/mqdefault.jpg" alt="" loading="lazy" width="168" height="94"><span>${esc(v.title)}</span></button>`).join("")}</div></div></section>`;
}
function mix(a){ const w = a.filter(n => n.region !== "India"), i = a.filter(n => n.region === "India"), o = []; for (let k = 0; k < Math.max(w.length, i.length); k++) { if (w[k]) o.push(w[k]); if (i[k]) o.push(i[k]); } return o.length ? o : a; }
function show(app, topic, region){
 app.innerHTML = `<div class="nw"><section class="nw-band"><h1>Tech news</h1><p>The latest in technology from around the world: AI, big tech, chips, cloud, cybersecurity, startups, India tech, space and gadgets. Updated every morning from public news sources; each headline links to the original story.</p><small id="nw-up"></small></section><div class="nw-body"><p class="ml-empty">Loading the latest headlines…</p></div></div>`;
 load().then(() => {
  const raw = DATA.items || [], items = mix(raw), topics = ["All", ...TOPICS.filter(t => items.some(n => n.topic === t))];
  topic = topic || "All"; region = region || "All";
  const inRegion = items.filter(n => region === "All" || n.region === region);
  const topicsR = ["All", ...TOPICS.filter(t => inRegion.some(n => n.topic === t))];
  const list = inRegion.filter(n => topic === "All" || n.topic === topic);
  app.querySelector("#nw-up").textContent = DATA.updated ? "Last updated " + ago(DATA.updated) : "";
  app.querySelector(".nw-body").innerHTML = `<div class="nw-reg">${["All", "World", "India"].map(r => `<button type="button" class="nw-rb" data-nr="${r}" aria-pressed="${r === region}">${r === "All" ? "🌐 All news" : r === "World" ? "🌍 Around the world" : "🇮🇳 India"}</button>`).join("")}</div><div class="ud-tabs nw-tabs">${topicsR.map(t => `<button class="ud-tab" data-nt="${esc(t)}" aria-selected="${t === topic}">${esc(t)}</button>`).join("")}</div>${take()}${vids()}<h2 class="nw-h">${topic === "All" ? (region === "India" ? "Top stories from India" : region === "World" ? "Top stories from around the world" : "Top stories") : esc(topic)}</h2>${list.length ? `<div class="nw-g">${list.slice(0, 18).map(card).join("")}</div>${list.length > 18 ? `<p class="nw-more"><button class="btn" type="button" id="nw-more">Show more stories</button></p>` : ""}` : "<p class='ml-empty'>No stories right now. Check back soon.</p>"}`;
  app.querySelectorAll("[data-nt]").forEach(b => b.addEventListener("click", () => show(app, b.dataset.nt, region)));
  app.querySelectorAll("[data-nr]").forEach(b => b.addEventListener("click", () => show(app, "All", b.dataset.nr)));
  const mb = app.querySelector("#nw-more"); if (mb) mb.addEventListener("click", () => { app.querySelector(".nw-g").insertAdjacentHTML("beforeend", list.slice(18, 60).map(card).join("")); mb.remove(); });
  app.querySelectorAll(".nw-vi").forEach(b => b.addEventListener("click", () => { app.querySelector("#nw-frame").innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${b.dataset.vid}?rel=0&autoplay=1" title="${esc(b.dataset.vt)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`; app.querySelector("#nw-vt").textContent = b.dataset.vt; app.querySelectorAll(".nw-vi").forEach(x => x.classList.toggle("on", x === b)); }));
 });
 window.scrollTo(0, 0); document.title = "Tech news · Tech Samjho Raj";
}
function row(){
 const h = document.getElementById("ud-newsrow"); if (!h || h.dataset.f) return; h.dataset.f = 1;
 load().then(() => { const all = (DATA.items || []).filter(n => n.image), it = all.filter(n => n.region !== "India").slice(0, 2).concat(all.filter(n => n.region === "India").slice(0, 1)); if (!it.length) { h.remove(); return; }
  h.innerHTML = `<h2>Tech news today</h2><p class="ud-secsub">What is happening in technology around the world, with sources.</p><div class="nw-g">${it.map(card).join("")}</div><p class="ud-more"><a href="#news">See all tech news and Raj's news videos →</a></p>`; });
}
new MutationObserver(row).observe(document.body, { childList: true, subtree: true }); row();
window.RDNEWS = { show };
if (location.hash === "#news") window.dispatchEvent(new HashChangeEvent("hashchange"));
})();
