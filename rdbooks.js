/* Books section redesign (25 Nov 2026). Exposes window.RDBOOKS: shop(ctx), aiPage(ctx), sticky(o).
   Rules: no ratings or sales counts, ebook wording, no job guarantee, buy buttons stay on Gumroad until DODO_LIVE is true,
   nothing copied from other bookshops. Prices come from the site's BOOK and AIJOB constants. */
(function(){
const DODO_LIVE = true;   // set true only when the Dodo products + Naukri Saathi builds are live; until then the build lines say "coming with the new checkout"
const CAREER_KIT_LIVE = true;   // set true only after the Delivery Manager says "approved: Career Kit"
const KIT_LINE = CAREER_KIT_LIVE ? "Free Career Kit included: resume and cover letter starter templates (Word + PDF), filled examples and HR/LinkedIn message templates. Starter templates, not certified country formats; no job guarantee." : "";
const CART_LIVE = true;   // set true only when the Dodo session says checkout is live (and cart.js is loaded by index.html) AND Raj says yes
const MEDIA = "media/books/";
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const rs = n => "₹" + n;
const BUILD_NOTE = DODO_LIVE ? "" : " (arrives with our new checkout)";

function card(c){
  const stage = c.lang
    ? `<span class="bk-lang" style="--lc:${c.lang[1]}" role="img" aria-label="${esc(c.title)} book cover (placeholder)"><b>${esc(c.lang[0])}</b><small>Samjho with Raj</small><i>Coming soon</i></span>`
    : c.cover
    ? `<img${c.mock ? ' class="mock"' : ""} src="${c.cover}" alt="${esc(c.alt)}" width="${c.w}" height="${c.h}" loading="lazy" decoding="async">`
    : `<span class="emo" aria-hidden="true">${c.emoji}</span>`;
  const ext = c.ext ? ' target="_blank" rel="noopener"' : "";
  const price = c.price
    ? `<div class="bk-price"><b>${rs(c.price)}</b>${c.was ? `<s>${rs(c.was)}</s><em>Save ${rs(c.was - c.price)}</em>` : ""}${c.priceNote ? `<span>${c.priceNote}</span>` : ""}</div>`
    : `<div class="bk-price"><span>${c.priceNote || ""}</span></div>`;
  const canCart = c.cartId && CART_LIVE && window.Cart;
  const btn = canCart ? `<button type="button" class="bk-btn pri" data-bk-cart="${c.cartId}">Add to cart</button>`
    : c.cartId ? `<a class="bk-btn pri" href="${c.buy}" data-bk-buy="${c.cartId}" rel="noopener">${esc(c.buyLabel)}</a>`
    : c.buy ? `<a class="bk-btn pri" href="${c.buy}" target="_blank" rel="noopener">${esc(c.buyLabel)}</a>`
    : c.go ? `<a class="bk-btn pri" href="${c.go}"${ext}>${esc(c.goLabel)}</a>`
    : `<span class="bk-btn" aria-disabled="true">Coming soon</span>`;
  const buyNow = canCart ? `<a class="bk-link" href="${c.buy}" data-bk-buy="${c.cartId}" rel="noopener">Buy now</a>` : "";
  const prev = c.preview ? `<a class="bk-link" href="${c.preview}"${c.previewExt ? ' target="_blank" rel="noopener"' : ""}>${esc(c.previewLabel || "Free preview →")}</a>` : "";
  const links = buyNow || prev ? `<div class="bk-links">${buyNow}${prev}</div>` : "";
  return `<article class="bk-card" data-cats="${c.cats.join(" ")}">
    <div class="bk-stage${c.saf ? " saf" : ""}"><span class="bk-pill">${esc(c.pill)}</span>${c.badge ? `<span class="bk-badge">${esc(c.badge)}</span>` : ""}${stage}${c.mascot ? `<img class="bk-mascot" src="${c.mascot}" alt="" width="34" height="34" loading="lazy">` : ""}</div>
    <div class="bk-body"><h3><a href="${c.href}"${ext}>${esc(c.title)}</a></h3><p class="bk-meta">${c.meta}</p>${price}${btn}${links}</div></article>`;
}

function cards(B, A){
  const pyBuy = B.buy.en || "";
  return [
    { cats:["tech"], title:"Python with Chai", pill:"English", cover:"media/book-mockup-tech.webp", mock:1, w:560, h:700, alt:"Python with Chai: 3D view of the navy book with a chai glass on the cover", mascot:"img/botu-192.png",
      meta:"30 chapters · 300+ pages · PDF + EPUB · for beginners", price:B.price, priceNote:"", href:"#book", buy:pyBuy, buyLabel:"Buy " + rs(B.price), preview:"#book", previewLabel:"Free preview →" },
    { cats:["tech"], title:"Build with AI: 100 Days to Job-Ready", pill:"English", badge:"Coming soon", cover:MEDIA + "build-with-ai-cover.webp", w:840, h:650, alt:"Build with AI: 100 Days to Job-Ready, book cover", mascot:"img/botu-192.png",
      meta:"24 skills, day by day, with code you can run · free sample of 3 chapters", priceNote:"The sample labs run on your laptop with no API key.", href:"notes/build-with-ai-sample.pdf", go:"notes/build-with-ai-sample.pdf", goLabel:"Free sample (PDF) →", ext:1, preview:"notes/ai100-sample-labs.zip", previewExt:1, previewLabel:"Free sample labs (zip) →" },
    { cats:["jobs","tech"], cartId:"book", title:"AI Job Search", pill:"English", badge:DODO_LIVE ? "1 free resume build" : "New", cover:MEDIA + "aijob-cover.webp", w:420, h:420, alt:"AI Job Search by Raj: book cover with the Botu robot at a laptop", mascot:"img/botu-192.png",
      meta:"50 AI prompts for jobs and study · PDF · helps you prepare, no job guarantee" + (CAREER_KIT_LIVE ? " · <b>Free Career Kit included</b>" : ""), price:A.price, priceNote:"+ tax", href:"#ai-job-search", buy:A.en, buyLabel:"Buy now · " + rs(A.price), preview:"#ai-job-search", previewLabel:"Free sample + details →" },
    { cats:["jobs"], title:"Naukri Saathi", pill:"Tool", badge:"Free demo", saf:1, emoji:"📄", w:0, h:0, alt:"", mascot:"img/botu-192.png",
      meta:"Paste a job post and your resume: skill match, resume lines, cover note and interview questions", priceNote:"Free to try. Resume pack ₹49 + tax", href:"/naukri-saathi/", go:"/naukri-saathi/", goLabel:"Try it free →" },
    { cats:["tech"], title:"JavaScript Made Easy", pill:"Coding", badge:"Coming soon", cover:MEDIA + "lang-js.webp?v=2", w:540, h:720, alt:"JavaScript Made Easy book cover, coming soon", meta:"Programming book · not released yet", priceNote:"Not released", href:"#shop" },
    { cats:["tech"], title:"Java Made Easy", pill:"Coding", badge:"Coming soon", cover:MEDIA + "lang-java.webp?v=2", w:540, h:720, alt:"Java Made Easy book cover, coming soon", meta:"Programming book · not released yet", priceNote:"Not released", href:"#shop" },
    { cats:["tech"], title:"C Made Easy", pill:"Coding", badge:"Coming soon", cover:MEDIA + "lang-c.webp?v=2", w:540, h:720, alt:"C Made Easy book cover, coming soon", meta:"Programming book · not released yet", priceNote:"Not released", href:"#shop" },
    { cats:["tech"], title:"C++ Made Easy", pill:"Coding", badge:"Coming soon", cover:MEDIA + "lang-cpp.webp?v=2", w:540, h:720, alt:"C++ Made Easy book cover, coming soon", meta:"Programming book · not released yet", priceNote:"Not released", href:"#shop" },
    { cats:["tech"], title:"SQL Made Easy", pill:"Coding", badge:"Coming soon", cover:MEDIA + "lang-sql.webp?v=2", w:540, h:720, alt:"SQL Made Easy book cover, coming soon", meta:"Programming book · not released yet", priceNote:"Not released", href:"#shop" },
    { cats:["tech"], title:"HTML & CSS Made Easy", pill:"Coding", badge:"Coming soon", cover:MEDIA + "lang-html.webp?v=2", w:540, h:720, alt:"HTML & CSS Made Easy book cover, coming soon", meta:"Programming book · not released yet", priceNote:"Not released", href:"#shop" },
    { cats:["tech"], title:"Go Made Easy", pill:"Coding", badge:"Coming soon", cover:MEDIA + "lang-go.webp?v=2", w:540, h:720, alt:"Go Made Easy book cover, coming soon", meta:"Programming book · not released yet", priceNote:"Not released", href:"#shop" },
    { cats:["tech"], title:"PHP Made Easy", pill:"Coding", badge:"Coming soon", cover:MEDIA + "lang-php.webp?v=2", w:540, h:720, alt:"PHP Made Easy book cover, coming soon", meta:"Programming book · not released yet", priceNote:"Not released", href:"#shop" },
    { cats:["tech","kids"], title:"Jugnu Learns to Glow", pill:"Ages 9–13", badge:"Coming soon", cover:MEDIA + "kids-jugnu.webp", w:540, h:720, alt:"Jugnu Learns to Glow book cover with Jugnu the purple firefly", meta:"Machine learning for kids · Samjho Squad · not released yet", priceNote:"Not released", href:"#shop" },
    { cats:["tech","kids"], title:"Dabba Builds Games", pill:"Teens 13–18", badge:"Coming soon", cover:MEDIA + "kids-dabba-teens.webp", w:540, h:699, alt:"Dabba Builds Games book cover with Dabba the tiffin robot holding a game controller", meta:"Python game coding for teens · Samjho Squad · not released yet", priceNote:"Not released", href:"#shop" },
    { cats:["kids"], title:"Tikki's Future Files 2027", pill:"Teens 13–18", badge:"Coming soon", cover:MEDIA + "kids-tikki-teens.webp", w:540, h:699, alt:"Tikki's Future Files 2027 book cover with Tikki the satellite", meta:"Science and tech facts for teens · Samjho Squad · not released yet", priceNote:"Not released", href:"#shop" },
    { cats:["tech","kids"], title:"Dabba Codes! Python for Young Explorers", pill:"Ages 9–13", badge:"Coming soon", cover:MEDIA + "kids-dabba.webp", w:560, h:560, alt:"Dabba Codes! book cover with Dabba the tiffin robot", meta:"Kids' Python series · Samjho Squad · not released yet", priceNote:"Not released", href:"#shop" },
    { cats:["kids"], title:"Tikki's Wow World 2027", pill:"Ages 9–13", badge:"Coming soon", cover:MEDIA + "kids-tikki.webp", w:560, h:560, alt:"Tikki's Wow World 2027 book cover with Tikki the satellite", meta:"Science and tech facts for kids · Samjho Squad · not released yet", priceNote:"Not released", href:"#shop" }
  ].map(card).join("");
}

function shop(x){
  const B = x.BOOK, A = x.AIJOB;
  const pyBoth = B.bundle, pyWas = B.price * 2;
  const aiWas = A.price * 2;
  return `<div class="bk" id="bk-top">
  <header class="bk-hero"><div><div class="bk-eyebrow">Books by Raj</div><h1>Our book store</h1></div>
    <p class="bk-lead">Illustrated books in English, every example tested. Free preview before you buy.</p>
    <ul class="bk-chips"><li>Instant digital download</li><li>English edition</li><li>Free previews</li><li>Secure checkout</li></ul></header>
  <section id="bk-lib" aria-labelledby="bk-l"><div class="bk-libhead"><div><div class="bk-eyebrow">The library</div><h2 id="bk-l">Every book, one shelf. Pick your path.</h2></div>
    <div class="bk-tabs" role="tablist" aria-label="What are you preparing for?">${[["all","All books"],["tech","Learn coding"],["jobs","Get a job"],["kids","Kids"]].map((t, i) => `<button class="bk-tab" role="tab" data-tab="${t[0]}" aria-selected="${i === 0}">${t[1]}</button>`).join("")}</div></div>
    <div class="bk-grid" id="bk-grid">${cards(B, A)}</div>
    <p class="bk-note" style="margin-top:12px">Prices are in rupees. AI Job Search prices show ₹ + tax (10% is added at checkout). Python with Chai is sold through Gumroad, which shows the final amount at checkout. AI Job Search helps you prepare and does not promise a job. Money books are on <a href="https://www.paisasamjhoraj.com/#books">our Paisa site</a>, and exam books are on <a href="https://www.dimaagdada.com/reasoning-puzzles/">Dimaag Dada</a>.</p></section>
  <section aria-labelledby="bk-b"><h2 id="bk-b">Bundle</h2>
    <div class="bk-row" style="margin-top:14px;grid-template-columns:minmax(0,520px)">
      <div class="bk-bundle"><span class="bk-badge">Best value</span><div class="bkim"><img src="${MEDIA}aijob-cover.webp" alt="" width="420" height="420" loading="lazy"></div><div class="tx"><h3>Job-Ready bundle</h3><p>AI Job Search book (English) + 5 resume builds on Naukri Saathi${DODO_LIVE ? "" : " (the builds arrive with our new checkout)"}${CAREER_KIT_LIVE ? ", plus the free Career Kit" : ""}. Helps you prepare; no job guarantee.</p><div class="pr"><b>${rs(A.bundle)}</b><span class="bk-note">+ tax</span></div><a class="bk-btn pri" href="#shop" data-bk-buy="bundle" rel="noopener">Buy now</a>${CART_LIVE && window.Cart ? `<button type="button" class="bk-btn" data-bk-cart="bundle">Add to cart</button>` : ""}</div></div></div></section>
  <section aria-labelledby="bk-i"><h2 id="bk-i">Straight from the pages</h2><p class="bk-lead" style="margin:6px 0 14px">Real pages from our own free previews. Swipe to see more.</p>
    <div class="bk-pages" role="list">
      <figure role="listitem"><img src="${MEDIA}aijob-en-p2.webp" alt="AI Job Search, English edition, sample page" width="640" height="495" loading="lazy"><figcaption>AI Job Search · English · sample page</figcaption></figure>
      <figure role="listitem"><img class="tall" src="${MEDIA}python-ch1-p2.webp" alt="Python with Chai, Chapter 1 preview page" width="409" height="579" loading="lazy"><figcaption>Python with Chai · Chapter 1 preview</figcaption></figure>
      <figure role="listitem"><img class="tall" src="${MEDIA}python-ch3-p2.webp" alt="Python with Chai, Chapter 3 preview page" width="409" height="579" loading="lazy"><figcaption>Python with Chai · Chapter 3 preview</figcaption></figure></div></section>
  <section aria-labelledby="bk-w"><h2 id="bk-w">Why our books</h2>
    <ul class="bk-ticks" style="margin-top:12px"><li>Simple English, chai-shop examples</li><li>Code examples are really run, not just typed</li><li>A free preview for every book before you pay</li><li>Written by Raj, a technology architect with 20 years of experience</li></ul></section>
  <section class="bk-faq" aria-labelledby="bk-f"><h2 id="bk-f" style="margin-bottom:12px">Questions</h2>
    <details><summary>What do I get after paying?</summary><p>An instant digital download. Python with Chai comes as PDF + EPUB; AI Job Search comes as a PDF. These are ebooks: nothing is printed or shipped.</p></details>
    <details><summary>Will AI Job Search get me a job?</summary><p>No book can promise that. It gives you tested prompts to prepare a better resume, interview answers and study plan.</p></details>
    <details><summary>Where do I pay?</summary><p>AI Job Search checks out through our cart (secure payment by Dodo Payments; 10% tax is added) and needs a free login. Python with Chai opens a secure checkout on Gumroad. Money books are sold on the Paisa site and Reasoning Samjho on the Dimaag Dada site.</p></details>
    <details><summary>Something wrong with my copy?</summary><p>Email <a href="mailto:samjhowithraj@gmail.com">samjhowithraj@gmail.com</a> with your order number. See also the <a href="#refund">refund page</a>.</p></details></section>
  </div>`;
}

function aiPage(x){
  const A = x.AIJOB;
  const inside = {
    en: ["Resume &amp; LinkedIn: achievements, resume summary, cover letter, career gap, LinkedIn headline and About", "Interview prep: \"Tell me about yourself\", mock interviews, STAR answers, the salary question", "Study smarter: 7-day study plans, quizzes, flashcards, step-by-step solving", "Coding help: explain code, fix errors, SQL, Git", "Office work: emails, meeting notes, Excel formulas, presentations"],
  };
  const li = a => a.map(t => `<li>${t}</li>`).join("");
  const pg = n => `<figure><img src="${MEDIA}aijob-en-p${n}.webp" alt="AI Job Search sample page ${n}" width="640" height="495" loading="lazy"><figcaption>Sample page ${n}</figcaption></figure>`;
  return `<div class="bk bk-has-sticky">
  <p><a class="bk-link" href="#shop">← All books</a></p>
  <section class="bk-pagehero"><div class="bk-stage" style="border-radius:24px"><span class="bk-pill">English</span><span class="bk-badge">New</span><img src="${MEDIA}aijob-cover.webp" alt="AI Job Search by Raj: book cover with the Botu robot at a laptop" width="420" height="420" decoding="async"></div>
    <div style="display:grid;gap:12px"><div class="bk-eyebrow">E-book · by Raj</div><h1>AI Job Search: 50 AI prompts for jobs + study</h1>
      <p class="bk-lead">50 copy-paste AI prompts that help you prepare for a job and study smarter. Every prompt comes with a real AI reply and a one-line tip on why it works. Just change the [brackets] and paste into ChatGPT, Gemini or any AI.</p>
      <div class="bk-price" style="padding:0"><b>${rs(A.price)}</b><span>+ tax · English edition</span></div>
      <div class="bk-buy" id="bk-buy"><a class="bk-btn pri" href="${A.en}" data-bk-buy="book" rel="noopener">Buy now · ${rs(A.price)}</a><button type="button" class="bk-btn" data-bk-cart="book">Add to cart</button></div>
      <p class="bk-note">Instant PDF download, 89 pages. Checkout is by Dodo Payments through our cart and needs a free login; 10% tax is added. This book helps you prepare; it does not promise a job.</p></div></section>
  <section class="bk-get"><b>What you get</b><ul><li>The book as a PDF (English)</li><li>1 free Naukri Saathi resume build with the book${BUILD_NOTE}</li>${KIT_LINE ? `<li>${KIT_LINE}</li>` : ""}<li>A free <a href="/naukri-saathi/">Naukri Saathi demo</a> to try right now</li></ul></section>
  <section aria-labelledby="ai-in"><h2 id="ai-in">What's inside</h2>
    <div class="bk-box" style="margin-top:12px"><h3>English edition</h3><ul>${li(inside.en)}</ul><p class="bk-note">89-page PDF in English, instant download.</p></div></section>
  <section aria-labelledby="ai-pg"><h2 id="ai-pg">Free preview</h2><p class="bk-lead" style="margin:6px 0 14px">Real pages from the book. Download the free sample PDF.</p>
    <div class="bk-pages">${pg(1)}${pg(2)}${pg(3)}</div>
    <div class="bk-btns" style="margin-top:12px"><a class="bk-btn" href="notes/ai-job-search-sample-en.pdf" target="_blank" rel="noopener">Free sample PDF</a></div></section>
  <section class="bk-faq" aria-labelledby="ai-q"><h2 id="ai-q" style="margin-bottom:12px">Questions</h2>
    <details><summary>Which AI tools do the prompts work with?</summary><p>ChatGPT, Gemini or any other AI chat tool. You change the [brackets] and paste.</p></details>
    <details><summary>Will this get me a job?</summary><p>No book can promise that. It helps you prepare a better resume, cover letter, interview answers and study plan.</p></details>
    <details><summary>What format is it, and how do I get it?</summary><p>A PDF, downloaded after payment through our cart (Dodo Payments). Nothing is printed or shipped.</p></details>
    <details><summary>What are the Naukri Saathi resume builds?</summary><p>Naukri Saathi is our job-search helper: paste a job post and your resume to get a skill match and resume lines. The book comes with 1 free build${BUILD_NOTE}. You can try the free demo today.</p></details>
    <details><summary>Something wrong with my copy?</summary><p>Email <a href="mailto:samjhowithraj@gmail.com">samjhowithraj@gmail.com</a> with your order number. See the <a href="#refund">refund page</a>.</p></details></section>
  ${sticky({ price: rs(A.price), label: "Buy now", href: A.en, buy: "book", preview: "#bk-buy", previewLabel: "Details" })}
  </div>`;
}

function sticky(o){
  return `<div class="bk-sticky" role="region" aria-label="Buy"><b>${esc(o.price)}</b><a class="bk-btn" href="${o.preview}" data-bk-go="${String(o.preview).replace("#", "")}">${esc(o.previewLabel || "Preview")}</a><a class="bk-btn pri" href="${o.href}"${o.buy ? ` data-bk-buy="${o.buy}"` : ' target="_blank" rel="noopener"'}>${esc(o.label || "Buy")}</a></div>`;
}

function setTab(t){
  document.querySelectorAll(".bk-tab").forEach(b => b.setAttribute("aria-selected", String(b.dataset.tab === t)));
  document.querySelectorAll("#bk-grid .bk-card").forEach(c => { c.hidden = !(t === "all" || c.dataset.cats.split(" ").indexOf(t) >= 0); });
}
function scrollTo_(id){ const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }); }
document.addEventListener("click", e => {
  const by = e.target.closest("[data-bk-buy]"); if (by && window.Cart) { e.preventDefault(); Cart.add(by.dataset.bkBuy); Cart.checkout(); return; }
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
