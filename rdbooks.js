/* Books section redesign (25 Nov 2026). Exposes window.RDBOOKS: shop(ctx), aiPage(ctx), sticky(o).
   Rules: no ratings or sales counts, ebook wording, no job guarantee, Money Book = education only, buy buttons stay on Gumroad until DODO_LIVE is true,
   nothing copied from other bookshops. Prices come from the site's BOOK and AIJOB constants. */
(function(){
const DODO_LIVE = false;   // set true only when the Dodo products + Naukri Saathi builds are live; until then the build lines say "coming with the new checkout"
const CAREER_KIT_LIVE = false;   // set true only after the Delivery Manager says "approved: Career Kit"
const KIT_LINE = CAREER_KIT_LIVE ? "Free Career Kit included: resume and cover letter starter templates (Word + PDF), filled examples and HR/LinkedIn message templates. Starter templates, not certified country formats; no job guarantee." : "";
const CART_LIVE = false;   // set true only when the Dodo session says checkout is live (and cart.js is loaded by index.html) AND Raj says yes
const MEDIA = "media/books/";
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const rs = n => "₹" + n;
const BUILD_NOTE = DODO_LIVE ? "" : " (arrives with our new checkout)";

function card(c){
  const stage = c.cover
    ? `<img${c.mock ? ' class="mock"' : ""} src="${c.cover}" alt="${esc(c.alt)}" width="${c.w}" height="${c.h}" loading="lazy" decoding="async">`
    : `<span class="emo" aria-hidden="true">${c.emoji}</span>`;
  const ext = c.ext ? ' target="_blank" rel="noopener"' : "";
  const price = c.price
    ? `<div class="bk-price"><b>${rs(c.price)}</b>${c.was ? `<s>${rs(c.was)}</s><em>Save ${rs(c.was - c.price)}</em>` : ""}${c.priceNote ? `<span>${c.priceNote}</span>` : ""}</div>`
    : `<div class="bk-price"><span>${c.priceNote || ""}</span></div>`;
  const btn = c.buy ? `<a class="bk-btn pri" href="${c.buy}" target="_blank" rel="noopener">${esc(c.buyLabel)}</a>`
    : c.go ? `<a class="bk-btn pri" href="${c.go}"${ext}>${esc(c.goLabel)}</a>`
    : `<span class="bk-btn" aria-disabled="true">Coming soon</span>`;
  const cartBtn = c.cartId && CART_LIVE && window.Cart ? `<button type="button" class="bk-btn" data-bk-cart="${c.cartId}">Add to cart</button>` : "";
  return `<article class="bk-card" data-cats="${c.cats.join(" ")}">
    <div class="bk-stage${c.saf ? " saf" : ""}"><span class="bk-pill">${esc(c.pill)}</span>${c.badge ? `<span class="bk-badge">${esc(c.badge)}</span>` : ""}${stage}${c.mascot ? `<img class="bk-mascot" src="${c.mascot}" alt="" width="34" height="34" loading="lazy">` : ""}</div>
    <div class="bk-body"><h3><a href="${c.href}"${ext}>${esc(c.title)}</a></h3><p class="bk-meta">${c.meta}</p>${price}${btn}${cartBtn}${c.preview ? `<a class="bk-link" href="${c.preview}"${c.previewExt ? ' target="_blank" rel="noopener"' : ""}>${esc(c.previewLabel || "Free preview →")}</a>` : ""}</div></article>`;
}

function cards(B, A){
  const pyBuy = B.buy.en || "";
  return [
    { cats:["tech"], title:"Python with Chai", pill:"English + Hinglish", cover:"media/book-mockup-tech.webp", mock:1, w:560, h:700, alt:"Python with Chai: 3D view of the navy book with a chai glass on the cover", mascot:"img/botu-192.png",
      meta:"30 chapters · 300+ pages · PDF + EPUB · for beginners", price:B.price, priceNote:"per edition", href:"#book", buy:pyBuy, buyLabel:"Buy " + rs(B.price), preview:"#book", previewLabel:"Free preview →" },
    { cats:["jobs","tech"], cartId:"book", title:"AI Job Search", pill:"English + Hinglish", badge:DODO_LIVE ? "Includes 1 resume build" : "New", cover:MEDIA + "aijob-cover.webp", w:420, h:420, alt:"AI Job Search by Raj: book cover with the Botu robot at a laptop", mascot:"img/botu-192.png",
      meta:"50 AI prompts for jobs and study · PDF · helps you prepare, no job guarantee" + (CAREER_KIT_LIVE ? " · <b>Free Career Kit included</b>" : ""), price:A.price, priceNote:"per edition", href:"#ai-job-search", buy:A.en, buyLabel:"Buy " + rs(A.price), preview:"#ai-job-search", previewLabel:"Free sample + details →" },
    { cats:["jobs"], title:"Naukri Saathi", pill:"Tool", badge:"Free demo", saf:1, emoji:"📄", w:0, h:0, alt:"", mascot:"img/botu-192.png",
      meta:"Paste a job post and your resume: skill match, resume lines, cover note and interview questions", priceNote:"Free to try. Paid resume packs: price not final yet", href:"/naukri-saathi/", go:"/naukri-saathi/", goLabel:"Try it free →" },
    { cats:["money"], title:"Money Book 1", pill:"3 languages", cover:MEDIA + "money-cover.webp", w:600, h:600, alt:"Money Book 1 by Raj: book cover", ext:1,
      meta:"English, Hinglish and Hindi · on the Paisa site · education only, not financial advice", priceNote:"See price on paisasamjhoraj.com", href:"https://www.paisasamjhoraj.com/", go:"https://www.paisasamjhoraj.com/", goLabel:"See it on the Paisa site ↗" },
    { cats:["reasoning"], title:"Reasoning Samjho", pill:"Exam reasoning", cover:MEDIA + "reasoning-cover.webp", w:420, h:596, alt:"Reasoning Samjho book cover: Dimaag Dada at a green chalkboard", ext:1, mascot:"img/dada-badge-128.png",
      meta:"192 puzzles + 3 mock tests · SSC, Bank, Railway, CSAT, CAT and more · on dimaagdada.com", priceNote:"See price on dimaagdada.com", href:"https://www.dimaagdada.com/reasoning-puzzles/", go:"https://www.dimaagdada.com/reasoning-puzzles/", goLabel:"See it on dimaagdada.com ↗", preview:"https://www.dimaagdada.com/notes/puzzles-1-en-preview.pdf", previewExt:1, previewLabel:"Free Chapter 1 →" },
    { cats:["tech"], title:"Python for kids", pill:"Ages 10–15", badge:"Coming soon", saf:1, emoji:"🐍", w:0, h:0, alt:"", mascot:"img/botu-192.png",
      meta:"A kids' Python series, in the same chai-shop style. Not on sale yet", priceNote:"Not released", href:"#shop" }
  ].map(card).join("");
}

function shop(x){
  const B = x.BOOK, A = x.AIJOB;
  const pyBoth = B.bundle, pyWas = B.price * 2;
  const aiWas = A.price * 2;
  return `<div class="bk" id="bk-top">
  <header class="bk-hero"><div class="bk-eyebrow">Books by Raj</div>
    <h1>Illustrated books in Hinglish and English, <em>every example tested</em></h1>
    <p class="bk-lead">Python, AI for jobs, exam reasoning and money basics, written the Samjho way: simple language, chai-shop examples, and a free preview before you buy.</p>
    <div class="bk-btns"><a class="bk-btn pri" href="#bk-lib" data-bk-go="bk-lib">See all books</a><a class="bk-btn" href="#book">Read a free preview</a><a class="bk-btn" href="#bk-goals" data-bk-go="bk-goals">Which book is for me?</a></div>
    <ul class="bk-chips"><li>Instant digital download</li><li>English &amp; Hinglish</li><li>Free previews</li><li>Secure checkout by Gumroad</li></ul></header>
  <section id="bk-goals" aria-labelledby="bk-g"><h2 id="bk-g">What are you preparing for?</h2>
    <div class="bk-router" style="margin-top:14px">
      <a class="bk-goal" href="#bk-lib" data-bk-tab="tech"><span class="ic">🐍</span><b>Learn coding</b><span>Python with Chai, kids Python soon</span></a>
      <a class="bk-goal" href="#bk-lib" data-bk-tab="jobs"><span class="ic">💼</span><b>Get a job</b><span>AI Job Search + Naukri Saathi</span></a>
      <a class="bk-goal" href="#bk-lib" data-bk-tab="reasoning"><span class="ic">🧠</span><b>Exams &amp; reasoning</b><span>Reasoning Samjho by Dimaag Dada</span></a>
      <a class="bk-goal" href="#bk-lib" data-bk-tab="money"><span class="ic">🐷</span><b>Money basics</b><span>Money Book 1 on the Paisa site</span></a></div></section>
  <section id="bk-lib" aria-labelledby="bk-l"><h2 id="bk-l">The library</h2>
    <div class="bk-tabs" role="tablist" aria-label="Filter books" style="margin:12px 0">${[["all","All"],["tech","Tech"],["jobs","Jobs"],["money","Money"],["reasoning","Reasoning"]].map((t, i) => `<button class="bk-tab" role="tab" data-tab="${t[0]}" aria-selected="${i === 0}">${t[1]}</button>`).join("")}</div>
    <div class="bk-grid" id="bk-grid">${cards(B, A)}</div>
    <p class="bk-note" style="margin-top:12px">Prices are in rupees. Python with Chai and AI Job Search are sold through Gumroad, which shows the final amount at checkout. AI Job Search helps you prepare and does not promise a job. Money Book 1 is education only, not financial advice.</p></section>
  <section aria-labelledby="bk-b"><h2 id="bk-b">Bundles</h2>
    <div class="bk-row" style="margin-top:14px">
      <div class="bk-bundle"><span class="bk-badge">Best value</span><div class="bkim"><img src="${MEDIA}aijob-cover.webp" alt="" width="420" height="420" loading="lazy"></div><div class="tx"><h3>Job-Ready bundle</h3><p>AI Job Search in English + Hinglish${DODO_LIVE ? ", plus 5 resume builds on Naukri Saathi" : ". 5 resume builds join this bundle with our new checkout"}.</p><div class="pr"><b>${rs(A.bundle)}</b><s>${rs(aiWas)}</s><em>Save ${rs(aiWas - A.bundle)}</em></div><a class="bk-btn pri" href="${A.both}" target="_blank" rel="noopener">Get the bundle, save ${rs(aiWas - A.bundle)}</a>${CART_LIVE && window.Cart ? `<button type="button" class="bk-btn" data-bk-cart="bundle">Add to cart</button>` : ""}</div></div>
      <div class="bk-bundle"><div class="bkim"><img src="media/book-mockup-tech.webp" alt="" width="560" height="700" loading="lazy"></div><div class="tx"><h3>Python with Chai: both editions</h3><p>English (Tech Edition) and Hinglish edition, PDF + EPUB.</p><div class="pr"><b>${rs(pyBoth)}</b><s>${rs(pyWas)}</s><em>Save ${rs(pyWas - pyBoth)}</em></div>${B.buy.both ? `<a class="bk-btn pri" href="${B.buy.both}" target="_blank" rel="noopener">Get the bundle, save ${rs(pyWas - pyBoth)}</a>` : `<span class="bk-btn" aria-disabled="true">Coming soon</span>`}</div></div>
      <div class="bk-bundle"><div class="bkim"><span style="font-size:42px" aria-hidden="true">📦</span></div><div class="tx"><h3>Starter set</h3><p>Python with Chai + AI Job Search together. We are working on this one.</p><span class="bk-btn" aria-disabled="true">Coming soon</span></div></div></div></section>
  <section aria-labelledby="bk-i"><h2 id="bk-i">Straight from the pages</h2><p class="bk-lead" style="margin:6px 0 14px">Real pages from our own free previews. Swipe to see more.</p>
    <div class="bk-pages" role="list">
      <figure role="listitem"><img src="${MEDIA}aijob-en-p2.webp" alt="AI Job Search, English edition, sample page" width="640" height="495" loading="lazy"><figcaption>AI Job Search · English · sample page</figcaption></figure>
      <figure role="listitem"><img src="${MEDIA}aijob-hi-p2.webp" alt="AI Job Search, Hinglish edition, sample page" width="640" height="495" loading="lazy"><figcaption>AI Job Search · Hinglish · sample page</figcaption></figure>
      <figure role="listitem"><img class="tall" src="${MEDIA}python-ch1-p2.webp" alt="Python with Chai, Chapter 1 preview page" width="409" height="579" loading="lazy"><figcaption>Python with Chai · Chapter 1 preview</figcaption></figure>
      <figure role="listitem"><img class="tall" src="${MEDIA}python-ch3-p2.webp" alt="Python with Chai, Chapter 3 preview page" width="409" height="579" loading="lazy"><figcaption>Python with Chai · Chapter 3 preview</figcaption></figure>
      <figure role="listitem"><img class="tall" src="${MEDIA}reasoning-p2.webp" alt="Reasoning Samjho, Chapter 1 preview page" width="409" height="579" loading="lazy"><figcaption>Reasoning Samjho · Chapter 1 preview</figcaption></figure>
      <figure role="listitem"><img class="tall" src="${MEDIA}reasoning-p3.webp" alt="Reasoning Samjho, Chapter 1 preview, second page" width="409" height="579" loading="lazy"><figcaption>Reasoning Samjho · Chapter 1 preview</figcaption></figure></div></section>
  <section aria-labelledby="bk-w"><h2 id="bk-w">Why our books</h2>
    <ul class="bk-ticks" style="margin-top:12px"><li>Simple Hinglish or English, chai-shop examples</li><li>Code examples are really run, not just typed</li><li>A free preview for every book before you pay</li><li>Written by Raj, a technology architect with 20 years of experience</li></ul></section>
  <section class="bk-faq" aria-labelledby="bk-f"><h2 id="bk-f" style="margin-bottom:12px">Questions</h2>
    <details><summary>What do I get after paying?</summary><p>An instant digital download. Python with Chai comes as PDF + EPUB; AI Job Search comes as a PDF. These are ebooks: nothing is printed or shipped.</p></details>
    <details><summary>English or Hinglish?</summary><p>Same content in both. Pick the language you enjoy reading, or take both in the bundle.</p></details>
    <details><summary>Will AI Job Search get me a job?</summary><p>No book can promise that. It gives you tested prompts to prepare a better resume, interview answers and study plan.</p></details>
    <details><summary>Where do I pay?</summary><p>Python with Chai and AI Job Search open a secure checkout on Gumroad. Money Book 1 and Reasoning Samjho are sold on the Paisa and Dimaag Dada sites. We are moving to a new checkout soon; your download links keep working.</p></details>
    <details><summary>Something wrong with my copy?</summary><p>Email <a href="mailto:samjhowithraj@gmail.com">samjhowithraj@gmail.com</a> with your order number. See also the <a href="#refund">refund page</a>.</p></details></section>
  </div>`;
}

function aiPage(x){
  const A = x.AIJOB;
  const inside = {
    en: ["Resume &amp; LinkedIn: achievements, resume summary, cover letter, career gap, LinkedIn headline and About", "Interview prep: \"Tell me about yourself\", mock interviews, STAR answers, the salary question", "Study smarter: 7-day study plans, quizzes, flashcards, step-by-step solving", "Coding help: explain code, fix errors, SQL, Git", "Office work: emails, meeting notes, Excel formulas, presentations"],
    hi: ["Resume &amp; LinkedIn: achievements, resume summary, cover letter, career gap, LinkedIn headline aur About", "Interview prep: \"Tell me about yourself\", mock interview, STAR answers, salary wala sawaal", "Study smarter: 7-day study plan, quiz, flashcards, step-by-step solving", "Coding help: code samjhao, error fix, SQL, Git", "Office work: emails, meeting notes, Excel formulas, presentations"]
  };
  const li = a => a.map(t => `<li>${t}</li>`).join("");
  const pg = (l, n) => `<figure><img src="${MEDIA}aijob-${l}-p${n}.webp" alt="AI Job Search, ${l === "en" ? "English" : "Hinglish"} edition, sample page ${n}" width="640" height="495" loading="lazy"><figcaption>${l === "en" ? "English" : "Hinglish"} · sample page ${n}</figcaption></figure>`;
  return `<div class="bk bk-has-sticky">
  <p><a class="bk-link" href="#shop">← All books</a></p>
  <section class="bk-pagehero"><div class="bk-stage" style="border-radius:24px"><span class="bk-pill">English + Hinglish</span><span class="bk-badge">New</span><img src="${MEDIA}aijob-cover.webp" alt="AI Job Search by Raj: book cover with the Botu robot at a laptop" width="420" height="420" decoding="async"></div>
    <div style="display:grid;gap:12px"><div class="bk-eyebrow">E-book · by Raj</div><h1>AI Job Search: 50 AI prompts for jobs + study</h1>
      <p class="bk-lead">50 copy-paste AI prompts that help you prepare for a job and study smarter. Every prompt comes with a real AI reply and a one-line tip on why it works. Just change the [brackets] and paste into ChatGPT, Gemini or any AI.</p>
      <div class="bk-price" style="padding:0"><b>${rs(A.price)}</b><span>per edition</span><span>·</span><b>${rs(A.bundle)}</b><span>both editions</span><em>Save ${rs(A.price * 2 - A.bundle)}</em></div>
      <div class="bk-buy" id="bk-buy"><a class="bk-btn pri" href="${A.both}" target="_blank" rel="noopener">Both editions · ${rs(A.bundle)}</a><a class="bk-btn" href="${A.en}" target="_blank" rel="noopener">English · ${rs(A.price)}</a><a class="bk-btn" href="${A.hi}" target="_blank" rel="noopener">Hinglish · ${rs(A.price)}</a></div>
      <p class="bk-note">Instant PDF download. English edition 89 pages, Hinglish edition 91 pages. Checkout is on Gumroad. This book helps you prepare; it does not promise a job.</p></div></section>
  <section class="bk-get"><b>What you get</b><ul><li>The book as a PDF, in the edition you pick (both editions in the ${rs(A.bundle)} bundle)</li><li>1 free Naukri Saathi resume build with each book${BUILD_NOTE}</li><li>5 Naukri Saathi builds and both editions in the ${rs(A.bundle)} bundle${BUILD_NOTE}</li>${KIT_LINE ? `<li>${KIT_LINE}</li>` : ""}<li>A free <a href="/naukri-saathi/">Naukri Saathi demo</a> to try right now</li></ul></section>
  <section aria-labelledby="ai-in"><h2 id="ai-in">What's inside</h2>
    <div class="bk-two" style="margin-top:12px"><div class="bk-box"><h3>English edition</h3><ul>${li(inside.en)}</ul><p class="bk-note">89-page PDF in English, instant download.</p></div>
      <div class="bk-box"><h3>Hinglish edition</h3><ul>${li(inside.hi)}</ul><p class="bk-note">91-page PDF in Hinglish, instant download.</p></div></div></section>
  <section aria-labelledby="ai-pg"><h2 id="ai-pg">Free preview</h2><p class="bk-lead" style="margin:6px 0 14px">Real pages from the book. Download the free sample PDF of either edition.</p>
    <div class="bk-pages">${pg("en", 1)}${pg("en", 2)}${pg("en", 3)}${pg("hi", 1)}${pg("hi", 2)}${pg("hi", 3)}</div>
    <div class="bk-btns" style="margin-top:12px"><a class="bk-btn" href="notes/ai-job-search-sample-en.pdf" target="_blank" rel="noopener">Free sample · English PDF</a><a class="bk-btn" href="notes/ai-job-search-sample-hi.pdf" target="_blank" rel="noopener">Free sample · Hinglish PDF</a></div></section>
  <section class="bk-faq" aria-labelledby="ai-q"><h2 id="ai-q" style="margin-bottom:12px">Questions</h2>
    <details><summary>Which AI tools do the prompts work with?</summary><p>ChatGPT, Gemini or any other AI chat tool. You change the [brackets] and paste.</p></details>
    <details><summary>English or Hinglish edition?</summary><p>Same 50 prompts in both. The English edition has 89 pages and the Hinglish edition 91 pages. Get both together in the bundle for ${rs(A.bundle)} instead of ${rs(A.price * 2)}.</p></details>
    <details><summary>Will this get me a job?</summary><p>No book can promise that. It helps you prepare a better resume, cover letter, interview answers and study plan.</p></details>
    <details><summary>What format is it, and how do I get it?</summary><p>A PDF, downloaded instantly after payment on Gumroad. Nothing is printed or shipped.</p></details>
    <details><summary>What are the Naukri Saathi resume builds?</summary><p>Naukri Saathi is our job-search helper: paste a job post and your resume to get a skill match and resume lines. Each book comes with 1 free build and the bundle with 5${BUILD_NOTE}. You can try the free demo today.</p></details>
    <details><summary>Something wrong with my copy?</summary><p>Email <a href="mailto:samjhowithraj@gmail.com">samjhowithraj@gmail.com</a> with your order number. See the <a href="#refund">refund page</a>.</p></details></section>
  ${sticky({ price: rs(A.bundle), label: "Buy · both", href: A.both, preview: "#bk-buy", previewLabel: "Editions" })}
  </div>`;
}

function sticky(o){
  return `<div class="bk-sticky" role="region" aria-label="Buy"><b>${esc(o.price)}</b><a class="bk-btn" href="${o.preview}" data-bk-go="${String(o.preview).replace("#", "")}">${esc(o.previewLabel || "Preview")}</a><a class="bk-btn pri" href="${o.href}" target="_blank" rel="noopener">${esc(o.label || "Buy")}</a></div>`;
}

function setTab(t){
  document.querySelectorAll(".bk-tab").forEach(b => b.setAttribute("aria-selected", String(b.dataset.tab === t)));
  document.querySelectorAll("#bk-grid .bk-card").forEach(c => { c.hidden = !(t === "all" || c.dataset.cats.split(" ").indexOf(t) >= 0); });
}
function scrollTo_(id){ const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }); }
document.addEventListener("click", e => {
  const ct = e.target.closest("[data-bk-cart]"); if (ct && window.Cart) { Cart.add(ct.dataset.bkCart); Cart.open(); return; }
  const tab = e.target.closest(".bk-tab"); if (tab) { setTab(tab.dataset.tab); return; }
  const go = e.target.closest("[data-bk-tab]"); if (go) { e.preventDefault(); setTab(go.dataset.bkTab); scrollTo_("bk-lib"); return; }
  const sc = e.target.closest("[data-bk-go]"); if (sc) { e.preventDefault(); scrollTo_(sc.dataset.bkGo); }
});
if (CART_LIVE) addEventListener("DOMContentLoaded", () => {   // header cart button with count badge (cart.js fills data-cart-count)
  const k = document.getElementById("cmdk-open"); if (!k || document.getElementById("bk-cartbtn") || !window.Cart) return;
  const b = document.createElement("button"); b.id = "bk-cartbtn"; b.type = "button"; b.className = "kbtn"; b.setAttribute("aria-label", "Open cart");
  b.innerHTML = '🛒 <span data-cart-count></span>'; b.addEventListener("click", () => Cart.open()); k.after(b);
});
window.RDBOOKS = { shop, aiPage, sticky };
})();
if (["#shop", "#book", "#ai-job-search"].indexOf(location.hash) >= 0) window.dispatchEvent(new HashChangeEvent("hashchange"));
