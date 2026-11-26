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
  const price = c.tba ? `<div class="bk-price"><b class="tba">₹ —</b><span>Price to be announced</span></div>` : c.price
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
  const prev2 = c.preview2 ? `<a class="bk-link" href="${c.preview2}" target="_blank" rel="noopener">${esc(c.preview2Label || "More →")}</a>` : "";
  const links = buyNow || prev ? `<div class="bk-links">${buyNow}${prev}${prev2}</div>` : "";
  return `<article class="bk-card" data-cats="${c.cats.join(" ")}">
    <div class="bk-stage${c.saf ? " saf" : ""}"><span class="bk-pill">${esc(c.pill)}</span>${c.badge ? `<span class="bk-badge">${esc(c.badge)}</span>` : ""}${stage}${c.mascot ? `<img class="bk-mascot" src="${c.mascot}" alt="" width="34" height="34" loading="lazy">` : ""}</div>
    <div class="bk-body"><h3><a href="${c.href}"${ext}>${esc(c.title)}</a></h3><p class="bk-meta">${c.meta}</p>${price}${btn}${links}</div></article>`;
}

function cards(B, A){
  const pyBuy = B.buy.en || "";
  return [
    { cats:["tech"], cartId:"python-chai", title:"Python with Chai", pill:"English", cover:MEDIA + "python-with-chai-cover-a4.webp", w:560, h:792, alt:"Python with Chai: 3D view of the navy book with a chai glass on the cover", mascot:"img/botu-192.png",
      meta:"30 chapters · 300+ pages · PDF + EPUB · for beginners", price:B.price, priceNote:"", href:"#p/python-with-chai", buy:pyBuy, buyLabel:"Buy " + rs(B.price), preview:"#book", previewLabel:"Free preview →" },
    { cats:["tech"], title:"Python Libraries Made Easy", pill:"English", badge:"Coming soon", cover:MEDIA + "pylibs-cover.webp?v=2", w:560, h:792, alt:"Python Libraries Made Easy, book cover", mascot:"img/botu-192.png",
      meta:"19 libraries, one per chapter · 64 pages · free sample of 11 pages", href:"#p/python-libraries", price:299, priceNote:"+ tax", preview:"notes/python-libraries-made-easy-sample.pdf", previewExt:1, previewLabel:"Sample PDF →" },
    { cats:["tech"], title:"Build with AI: 100 Days to Job-Ready", pill:"English", badge:"Coming soon", cover:MEDIA + "build-with-ai-cover.webp?v=2", w:560, h:792, alt:"Build with AI: 100 Days to Job-Ready, book cover", mascot:"img/botu-192.png",
      meta:"24 skills, day by day, with code you can run · free sample of 3 chapters", href:"#p/build-with-ai", price:599, priceNote:"+ tax", preview:"notes/build-with-ai-sample.pdf", previewExt:1, previewLabel:"Sample PDF →", preview2:"notes/ai100-sample-labs.zip", preview2Label:"Labs zip →" },
    { cats:["jobs","tech"], cartId:"book", title:"AI Job Search", pill:"English", badge:DODO_LIVE ? "1 free resume build" : "New", cover:MEDIA + "aijob-cover.webp?v=2", w:560, h:792, alt:"AI Job Search by Raj: book cover with the Botu robot at a laptop", mascot:"img/botu-192.png",
      meta:"50 AI prompts for jobs and study · PDF · helps you prepare, no job guarantee" + (CAREER_KIT_LIVE ? " · <b>Free Career Kit included</b>" : ""), price:A.price, priceNote:"+ tax", href:"#p/ai-job-search", buy:A.en, buyLabel:"Buy now · " + rs(A.price), preview:"#ai-job-search", previewLabel:"Free sample + details →" },
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

const I3 = n => `<span class="ic3d" aria-hidden="true"><svg viewBox="0 0 56 56" width="46" height="46"><use href="#i3-${n}"/></svg></span>`;
const I3DEFS = '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><symbol id="i3-dl" viewBox="0 0 56 56"><defs><linearGradient id="g-dl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34d399"/><stop offset="1" stop-color="#059669"/></linearGradient><linearGradient id="gl-dl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><filter id="sh-dl" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="1.5" stdDeviation="1.2" flood-color="#000" flood-opacity=".35"/></filter></defs><rect x="4" y="9" width="48" height="43" rx="14" fill="#059669" opacity=".55"/><rect x="4" y="4" width="48" height="43" rx="14" fill="url(#g-dl)"/><rect x="4" y="4" width="48" height="22" rx="14" fill="url(#gl-dl)"/><g filter="url(#sh-dl)" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M28 14v17"/><path d="M20 24l8 8 8-8"/><path d="M17 38h22"/></g></symbol><symbol id="i3-test" viewBox="0 0 56 56"><defs><linearGradient id="g-test" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#60a5fa"/><stop offset="1" stop-color="#2563eb"/></linearGradient><linearGradient id="gl-test" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><filter id="sh-test" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="1.5" stdDeviation="1.2" flood-color="#000" flood-opacity=".35"/></filter></defs><rect x="4" y="9" width="48" height="43" rx="14" fill="#2563eb" opacity=".55"/><rect x="4" y="4" width="48" height="43" rx="14" fill="url(#g-test)"/><rect x="4" y="4" width="48" height="22" rx="14" fill="url(#gl-test)"/><g filter="url(#sh-test)" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M28 13l11 4v9c0 8-5 13-11 16-6-3-11-8-11-16v-9z"/><path d="M23 27l4 4 7-8"/></g></symbol><symbol id="i3-prev" viewBox="0 0 56 56"><defs><linearGradient id="g-prev" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbbf24"/><stop offset="1" stop-color="#d97706"/></linearGradient><linearGradient id="gl-prev" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><filter id="sh-prev" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="1.5" stdDeviation="1.2" flood-color="#000" flood-opacity=".35"/></filter></defs><rect x="4" y="9" width="48" height="43" rx="14" fill="#d97706" opacity=".55"/><rect x="4" y="4" width="48" height="43" rx="14" fill="url(#g-prev)"/><rect x="4" y="4" width="48" height="22" rx="14" fill="url(#gl-prev)"/><g filter="url(#sh-prev)" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 28s6-11 16-11 16 11 16 11-6 11-16 11-16-11-16-11z"/><circle cx="28" cy="28" r="4.5"/></g></symbol><symbol id="i3-pay" viewBox="0 0 56 56"><defs><linearGradient id="g-pay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a78bfa"/><stop offset="1" stop-color="#6d28d9"/></linearGradient><linearGradient id="gl-pay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><filter id="sh-pay" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="1.5" stdDeviation="1.2" flood-color="#000" flood-opacity=".35"/></filter></defs><rect x="4" y="9" width="48" height="43" rx="14" fill="#6d28d9" opacity=".55"/><rect x="4" y="4" width="48" height="43" rx="14" fill="url(#g-pay)"/><rect x="4" y="4" width="48" height="22" rx="14" fill="url(#gl-pay)"/><g filter="url(#sh-pay)" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><rect x="13" y="19" width="30" height="21" rx="4"/><path d="M13 26h30"/><path d="M19 34h7"/></g></symbol><symbol id="i3-code" viewBox="0 0 56 56"><defs><linearGradient id="g-code" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fb923c"/><stop offset="1" stop-color="#c2410c"/></linearGradient><linearGradient id="gl-code" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><filter id="sh-code" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="1.5" stdDeviation="1.2" flood-color="#000" flood-opacity=".35"/></filter></defs><rect x="4" y="9" width="48" height="43" rx="14" fill="#c2410c" opacity=".55"/><rect x="4" y="4" width="48" height="43" rx="14" fill="url(#g-code)"/><rect x="4" y="4" width="48" height="22" rx="14" fill="url(#gl-code)"/><g filter="url(#sh-code)" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 20l-8 8 8 8"/><path d="M34 20l8 8-8 8"/><path d="M30 17l-4 22"/></g></symbol><symbol id="i3-job" viewBox="0 0 56 56"><defs><linearGradient id="g-job" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4ade80"/><stop offset="1" stop-color="#15803d"/></linearGradient><linearGradient id="gl-job" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><filter id="sh-job" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="1.5" stdDeviation="1.2" flood-color="#000" flood-opacity=".35"/></filter></defs><rect x="4" y="9" width="48" height="43" rx="14" fill="#15803d" opacity=".55"/><rect x="4" y="4" width="48" height="43" rx="14" fill="url(#g-job)"/><rect x="4" y="4" width="48" height="22" rx="14" fill="url(#gl-job)"/><g filter="url(#sh-job)" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><rect x="13" y="22" width="30" height="19" rx="4"/><path d="M22 22v-4a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v4"/><path d="M13 31h30"/></g></symbol><symbol id="i3-kids" viewBox="0 0 56 56"><defs><linearGradient id="g-kids" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f472b6"/><stop offset="1" stop-color="#be185d"/></linearGradient><linearGradient id="gl-kids" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><filter id="sh-kids" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="1.5" stdDeviation="1.2" flood-color="#000" flood-opacity=".35"/></filter></defs><rect x="4" y="9" width="48" height="43" rx="14" fill="#be185d" opacity=".55"/><rect x="4" y="4" width="48" height="43" rx="14" fill="url(#g-kids)"/><rect x="4" y="4" width="48" height="22" rx="14" fill="url(#gl-kids)"/><g filter="url(#sh-kids)" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M28 14l4.2 8.6 9.4 1.3-6.8 6.6 1.6 9.4L28 35.500l-8.4 4.4 1.6-9.4-6.8-6.6 9.4-1.3z"/></g></symbol><symbol id="i3-all" viewBox="0 0 56 56"><defs><linearGradient id="g-all" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#818cf8"/><stop offset="1" stop-color="#4338ca"/></linearGradient><linearGradient id="gl-all" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><filter id="sh-all" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="1.5" stdDeviation="1.2" flood-color="#000" flood-opacity=".35"/></filter></defs><rect x="4" y="9" width="48" height="43" rx="14" fill="#4338ca" opacity=".55"/><rect x="4" y="4" width="48" height="43" rx="14" fill="url(#g-all)"/><rect x="4" y="4" width="48" height="22" rx="14" fill="url(#gl-all)"/><g filter="url(#sh-all)" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="14" width="11" height="11" rx="3"/><rect x="31" y="14" width="11" height="11" rx="3"/><rect x="14" y="31" width="11" height="11" rx="3"/><rect x="31" y="31" width="11" height="11" rx="3"/></g></symbol></svg>';
/* Combo deals: contents and separate prices come from our own data; a set price is shown only when Raj has set one (price) and its Dodo product exists (cartId). */
const COMBOS = [
  { id:"job-ready", tag:"Available now", title:"Job-Ready bundle", books:["ai-job-search"], extra:"+ 5 Naukri Saathi resume builds", price:249, cartId:"bundle", chip:"Book + tool", sep:null },
  { id:"py-starter", tag:"Learn Python", title:"Python Starter Set", books:["python-with-chai", "python-libraries"], price:null, cartId:null, chip:"2-book set" },
  { id:"py-ai", tag:"Python to AI", title:"Python + AI Set", books:["python-with-chai", "python-libraries", "build-with-ai"], price:null, cartId:null, chip:"3-book set" }
];
function combos(x){
  const D = productData(x);
  return COMBOS.map(c => {
    const bs = c.books.map(k => D[k]), sep = bs.reduce((t, e) => t + (e.price || 0), 0), n = c.books.length + (c.extra ? 1 : 0);
    const stack = bs.map((e, i) => `<img class="p${i + 1}" src="${e.gallery[0][0]}" alt="" width="140" height="198" loading="lazy">`).join("");
    const live = c.price && c.cartId, save = c.price && c.books.length > 1 ? sep - c.price : 0;
    const price = live ? `<div class="cmb-price"><b>${rs(c.price)}</b><span>+ tax</span>${save > 0 ? `<s>${rs(sep)}</s><em>Save ${rs(save)}</em>` : ""}</div>` : `<div class="cmb-price"><b class="tba">₹ —</b><span>Set price announced at launch</span></div>`;
    const sepLine = c.books.length > 1 ? `<p class="cmb-sep">Bought separately: ${rs(sep)}</p>` : "";
    const btn = live ? `<button type="button" class="bk-btn pri flash" data-bk-cart="${c.cartId}">Add set to cart</button>` : `<span class="bk-btn" aria-disabled="true">Coming soon</span>`;
    return `<article class="cmb-card"><div class="cmb-art n${c.books.length}"><span class="cmb-chip">${esc(c.chip)}</span>${stack}</div><div class="cmb-body"><span class="cmb-tag">${esc(c.tag)}</span><h3>${esc(c.title)}</h3><p class="cmb-list">${bs.map(e => esc(e.title.split(":")[0])).join(" &middot; ")}${c.extra ? " " + esc(c.extra) : ""}</p>${sepLine}${price}${btn}</div></article>`;
  }).join("");
}
function shop(x){
  const B = x.BOOK, A = x.AIJOB;
  const pyBoth = B.bundle, pyWas = B.price * 2;
  const aiWas = A.price * 2;
  return `<div class="bk" id="bk-top">
  <div class="hm-hero"><div class="hm-copy"><div class="bk-eyebrow">Books by Raj</div><h1>Learn tech with examples you can run.</h1>
      <p class="bk-lead">Chai-shop code, real AI prompts and step-by-step labs. Illustrated English ebooks that take you from your first program to a job-ready skill set. Free preview before you buy.</p>
      <div class="bk-btns"><a class="bk-btn pri" href="#bk-lib" data-bk-go="bk-lib">Shop all books →</a><a class="bk-btn" href="#p/ai-job-search">See inside a book</a></div>
      <ul class="hm-facts"><li><b>Instant</b> PDF download</li><li><b>Every example</b> tested</li><li><b>English</b> edition</li></ul></div>
    <div class="hm-art" aria-hidden="true"><img class="a" src="${MEDIA}build-with-ai-cover.webp?v=2" alt="" width="280" height="396"><img class="c" src="${MEDIA}aijob-cover.webp?v=2" alt="" width="280" height="396"><img class="b" src="${MEDIA}python-with-chai-cover-a4.webp" alt="" width="300" height="424"><span class="hm-chip">Python · AI · Jobs</span></div></div>
  <section class="hm-trust" aria-label="Why buy here">${I3DEFS}<div>${I3("dl")}<p><b>Instant download</b><span>Ebooks, nothing is shipped</span></p></div><div>${I3("test")}<p><b>Every example tested</b><span>Outputs come from running the code</span></p></div><div>${I3("prev")}<p><b>Free previews</b><span>Read pages before you pay</span></p></div><div>${I3("pay")}<p><b>Secure checkout</b><span>Payments by Dodo Payments</span></p></div></section>
  <section class="hm-nums" aria-label="By the numbers"><div><b>100</b><span>day plan in Build with AI</span></div><div><b>30</b><span>chapters in Python with Chai</span></div><div><b>19</b><span>libraries in Python Libraries Made Easy</span></div><div><b>11</b><span>free sample labs that run in Colab</span></div></section>
  ${(() => { const ba = BEFORE_AFTER.default; return ba ? `<section class="pp-ba" aria-labelledby="hm-ba"><h2 id="hm-ba">From stuck to confident</h2><p class="bk-lead" style="margin:6px 0 12px">AI-generated illustration. Real results depend on your own practice.</p><div class="ba-grid"><figure><video src="${ba.before}" ${ba.poster1 ? `poster="${ba.poster1}"` : ""} muted loop playsinline preload="none" controls></video><figcaption><b>Before</b> Struggling alone with a heavy textbook</figcaption></figure><span class="ba-arrow" aria-hidden="true">&rarr;</span><figure><video src="${ba.after}" ${ba.poster2 ? `poster="${ba.poster2}"` : ""} muted loop playsinline preload="none" controls></video><figcaption class="ok"><b>After</b> Learning step by step with our books</figcaption></figure></div></section>` : ""; })()}
  <section class="hm-goals" aria-labelledby="hm-g"><div class="bk-eyebrow">Pick a goal</div><h2 id="hm-g">What do you want to do?</h2>
    <div class="hm-gcards"><a class="hm-g" href="#bk-lib" data-bk-tab="tech">${I3("code")}<b>Learn coding</b><span>Python from zero, libraries and building with AI.</span><i>Python · AI →</i></a><a class="hm-g" href="#bk-lib" data-bk-tab="jobs">${I3("job")}<b>Get a job</b><span>Resume, cover letter and interview prompts, plus Naukri Saathi.</span><i>AI Job Search →</i></a><a class="hm-g" href="#bk-lib" data-bk-tab="kids">${I3("kids")}<b>Kids and teens</b><span>The Samjho Squad books, coming soon.</span><i>See the squad →</i></a></div></section>
  <section id="bk-lib" aria-labelledby="bk-l"><div class="bk-libhead"><div><div class="bk-eyebrow">Our books</div><h2 id="bk-l">Every book, one shelf.</h2></div>
    <div class="bk-tabs" role="tablist" aria-label="What do you want to do?">${[["all","All books"],["tech","Learn coding"],["jobs","Get a job"],["kids","Kids"]].map((t, i) => `<button class="bk-tab" role="tab" data-tab="${t[0]}" aria-selected="${i === 0}"><svg class="tab3d" viewBox="0 0 56 56" width="24" height="24" aria-hidden="true"><use href="#i3-${{ all:"all", tech:"code", jobs:"job", kids:"kids" }[t[0]]}"/></svg>${t[1]}</button>`).join("")}</div></div>
    <div class="bk-grid" id="bk-grid">${cards(B, A)}</div>
    <p class="bk-note" style="margin-top:12px">Prices are in rupees. AI Job Search prices show ₹ + tax (10% is added at checkout). Python with Chai is sold through Gumroad, which shows the final amount at checkout. AI Job Search helps you prepare and does not promise a job. Money books are on <a href="https://www.paisasamjhoraj.com/#books">our Paisa site</a>, and exam books are on <a href="https://www.dimaagdada.com/reasoning-puzzles/">Dimaag Dada</a>.</p></section>
  <section class="cmb" aria-labelledby="bk-b"><div class="cmb-head"><div><div class="bk-eyebrow">Combo deals</div><h2 id="bk-b">Books that work together</h2></div><a class="bk-link" href="#bk-lib" data-bk-go="bk-lib">See all books &rarr;</a></div>
    <div class="cmb-grid">${combos(x)}</div>
    <p class="bk-note">Set prices are decided by Raj. Where a price is not shown yet, the set is not on sale. The "bought separately" total is just the sum of the single prices.</p></section>
  <section aria-labelledby="bk-i"><h2 id="bk-i">Real pages from our books</h2><p class="bk-lead" style="margin:6px 0 14px">Real pages from our own free previews. Swipe to see more.</p>
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
  <section class="bk-pagehero"><div class="bk-stage" style="border-radius:24px"><span class="bk-pill">English</span><span class="bk-badge">New</span><img src="${MEDIA}aijob-cover.webp?v=2" alt="AI Job Search by Raj: book cover with the Botu robot at a laptop" width="420" height="420" decoding="async"></div>
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

/* ---- Product page (#p/<slug>): gallery, price, pills, book picker, sticky bar. Layout idea only; own wording and art. ---- */
function productData(x){
  const B = x.BOOK, A = x.AIJOB;
  return {
    "ai-job-search": { title:"AI Job Search: 50 AI prompts for jobs + study", eyebrow:"E-book · by Raj", pill:"English", badge:"New", cartId:"book", price:A.price, buy:A.en,
      gallery:[[MEDIA + "aijob-cover.webp?v=2", "AI Job Search book cover"], [MEDIA + "aijob-en-p1.webp", "Sample page 1"], [MEDIA + "aijob-en-p2.webp", "Sample page 2"], [MEDIA + "aijob-en-p3.webp", "Sample page 3"]],
      desc:"50 copy-paste AI prompts that help you prepare for a job and study smarter. Every prompt comes with a real AI reply and a one-line tip on why it works.",
      more:"Resume and LinkedIn prompts, interview practice, the salary question and a 7-day study plan. You change the [brackets] and paste into any AI chat tool. It helps you prepare and does not promise a job.",
      pills:["50 prompts with real replies", "Instant PDF, 89 pages", "Free sample pages", "1 free Naukri Saathi resume build"], more_href:"#ai-job-search", more_label:"Full details and free sample →" },
    "python-with-chai": { title:"Python with Chai: From Basic to Expert", eyebrow:"E-book · by Raj", pill:"English", cartId:"python-chai", price:B.price, buy:B.buy.en,
      gallery:[[MEDIA + "python-with-chai-cover-a4.webp", "Python with Chai book cover"], [MEDIA + "python-ch1-p2.webp", "Chapter 1 preview page"], [MEDIA + "python-ch3-p2.webp", "Chapter 3 preview page"]],
      desc:"30 illustrated chapters and 300+ pages that take you from print() to decorators and a real project, with chai-shop examples.",
      more:"120+ examples where every output was really run, common mistakes with real error messages, practice with answers, cheat sheets and an index. PDF + EPUB in every purchase.",
      pills:["30 chapters, 300+ pages", "Every output really run", "Free chapter previews", "PDF + EPUB"], more_href:"#book", more_label:"Free preview and details →", sold:"Sold on Gumroad" },
    "python-libraries": { title:"Python Libraries Made Easy", eyebrow:"E-book · by Raj", pill:"English", badge:"Coming soon", soon:1, price:299,
      gallery:[[MEDIA + "pylibs-cover.webp?v=2", "Python Libraries Made Easy book cover"], [MEDIA + "pylibs-numpy.webp", "NumPy sample page"], [MEDIA + "pylibs-pandas.webp", "pandas sample page"], [MEDIA + "pylibs-flask.webp", "Flask sample page"]],
      desc:"19 popular Python libraries explained step by step, with examples you can run.", more:"", pills:["19 libraries", "Runnable examples", "English edition"], more_href:"notes/python-libraries-made-easy-sample.pdf", more_label:"Free sample (PDF) →" },
    "build-with-ai": { title:"Build with AI: 100 Days to Job-Ready", eyebrow:"E-book · by Raj", pill:"English", badge:"Coming soon", soon:1, price:599,
      gallery:[[MEDIA + "build-with-ai-cover.webp?v=2", "Build with AI book cover"], [MEDIA + "bwa-p3.webp", "Sample page: what you will learn"], [MEDIA + "bwa-p4.webp", "Sample page: a lesson with code"], [MEDIA + "bwa-p5.webp", "Sample page: the real output"], [MEDIA + "bwa-p10.webp", "Sample page: quiz"]],
      desc:"24 skills, day by day, with code you can run. A free sample of 3 chapters is available.", more:"The sample labs run on your laptop with no API key.", pills:["24 skills, day by day", "Code you can run", "Free sample"],
      more_href:"notes/build-with-ai-sample.pdf", more_label:"Free sample (PDF) →" }
  };
}
/* Long-page content per book. Own wording; only facts we can show. No ratings, buyer counts, urgency bars or reviews until we have real ones. */
function productExtra(x){
  const B = x.BOOK;
  return {
    "ai-job-search": {
      why:[["Real replies, not just prompts","Every prompt comes with a real AI reply, so you see what to expect before you paste."],["One-line tip each","A short note on why the prompt works, so you can change it for your own case."],["Made for job and study","Resume, interview, salary talk, study plans, coding help and office work in one place."],["Works with any AI chat tool","ChatGPT, Gemini or any other. You only change the [brackets]."]],
      who:["Freshers writing a first resume","People changing jobs","Students preparing for interviews and exams","Working professionals who want faster emails and notes","Anyone returning to work after a gap"],
      learn:["Write a clear resume summary and achievements","Draft a cover letter for one job","Explain a career gap honestly","Write a LinkedIn headline and About section","Practise \"Tell me about yourself\" and STAR answers","Prepare for the salary question","Build a 7-day study plan","Use AI to explain code, fix errors and write SQL"],
      details:[["Title","AI Job Search: 50 AI prompts for jobs + study"],["Language","English"],["Format","PDF, instant download"],["Pages","89"],["Prompts","50"],["Edition","First edition"]],
      inside:["Resume and LinkedIn: achievements, resume summary, cover letter, career gap, LinkedIn headline and About","Interview prep: \"Tell me about yourself\", mock interviews, STAR answers, the salary question","Study smarter: 7-day study plans, quizzes, flashcards, step-by-step solving","Coding help: explain code, fix errors, SQL, Git","Office work: emails, meeting notes, Excel formulas, presentations"],
      stats:[["50","prompts"],["89","pages"],["PDF","instant download"]],
      pages:[[MEDIA + "aijob-en-p1.webp","Sample page 1","A prompt with its real AI reply"],[MEDIA + "aijob-en-p2.webp","Sample page 2","The tip on why it works"],[MEDIA + "aijob-en-p3.webp","Sample page 3","Change the [brackets] and paste"]],
      faq:[["Which AI tools do the prompts work with?","ChatGPT, Gemini or any other AI chat tool. You change the [brackets] and paste."],["Will this get me a job?","No book can promise that. It helps you prepare a better resume, cover letter, interview answers and study plan."],["What format is it?","A PDF, downloaded after payment through our cart (Dodo Payments). Nothing is printed or shipped."],["What are the Naukri Saathi resume builds?","Naukri Saathi is our job-search helper. The book comes with 1 free build, and you can add 5 builds in the Job-Ready bundle."],["Something wrong with my copy?","Email samjhowithraj@gmail.com with your order number. See the refund page."]]
    },
    "python-with-chai": {
      why:[["Chai-shop examples","One small shop, from print() to a full project, so every idea sticks."],["Every output really run","The code outputs shown in the book were produced by running the code."],["Mistakes with real errors","Common mistakes shown with the real error message and the fix."],["Practice with answers","Exercises at the end of chapters, with answers and cheat sheets."]],
      who:["Complete beginners","School and college students","Working people moving into tech","Anyone preparing for Python interviews","Parents and teachers looking for a clear Python book"],
      learn:["Variables, strings, numbers and input()","Decisions and loops","Lists, tuples, sets and dictionaries","Functions, errors and debugging","Files, CSV and JSON","Modules and the standard library","Classes and objects","A real project, then decorators and performance"],
      details:[["Title","Python with Chai: From Basic to Expert"],["Language","English"],["Format","PDF + EPUB"],["Pages","300+"],["Chapters","30"],["Sold on","Gumroad"]],
      chapters:(B.chapters || []).map(c => [c[0], c[2]]),
      stats:[["30","chapters"],["300+","pages"],["120+","examples"]],
      pages:[["media/book-mockup-tech.webp?v=2","Cover","Python with Chai, English edition"],[MEDIA + "python-ch1-p2.webp","Chapter 1","Hello, Python!"],[MEDIA + "python-ch3-p2.webp","Chapter 3","Strings: playing with text"]],
      faq:[["What format is the book?","PDF + EPUB, both included in every purchase. The PDF reads well on a phone, tablet or laptop; the EPUB is for Kindle, Kobo and phone readers."],["Do I need to know programming?","No. It starts from print() and builds up."],["Can I read a free preview first?","Yes. Every preview chapter shows the title page, a chapter and the practice section."],["Where do I pay?","Checkout is on Gumroad, which shows the final amount."]]
    },
    "python-libraries": {
      why:[["Every example was really run","The output in the book is what the code printed."],["Same steps every chapter","What it is, when to use it, install, example and a mini project."],["Two common mistakes per chapter","Each one shown with the real error message."],["Four practice questions per chapter","With answers at the end."]],
      who:["Beginners who know basic Python and want to know which library does what","B.Tech, BCA, MCA and BSc CS students building projects","Self-learners preparing for AI, data and backend jobs","Working developers moving into data science or AI","Anyone who wants a quick first example before reading long docs"],
      learn:["Arrays and fast maths with NumPy","Cleaning and analysing tables with pandas","Charts with Matplotlib","First machine-learning models with scikit-learn","Deep learning basics with PyTorch and TensorFlow","Images with OpenCV and text with NLTK","Scraping and automating the web with BeautifulSoup and Selenium","Web apps and APIs with Flask, FastAPI, Django and Streamlit, plus Airflow, PySpark, Kivy, Boto3 and LangChain"],
      details:[["Title","Python Libraries Made Easy"],["Language","English"],["Format","PDF e-book, A4, full colour"],["Pages","64 (A4)"],["Libraries","19"],["Free sample","11 pages: NumPy, pandas, Flask"],["Status","Coming soon"]],
      chapters:[[1,"NumPy, page 5"],[2,"Pandas, page 8"],[3,"Matplotlib, page 11"],[4,"Scikit-learn, page 14"],[5,"PyTorch, page 17"],[6,"TensorFlow, page 20"],[7,"OpenCV, page 23"],[8,"NLTK, page 26"],[9,"BeautifulSoup, page 29"],[10,"Selenium, page 32"],[11,"Flask, page 35"],[12,"FastAPI, page 38"],[13,"Django, page 41"],[14,"Streamlit, page 44"],[15,"Apache Airflow, page 47"],[16,"PySpark, page 50"],[17,"Kivy, page 53"],[18,"Boto3, page 56"],[19,"LangChain, page 59"]],
      stats:[["19","libraries"],["64","pages"],["A4","full colour PDF"]],
      pages:[[MEDIA + "pylibs-numpy.webp","NumPy","A first example, with the real output beside the code"],[MEDIA + "pylibs-pandas.webp","pandas","Load a table, filter it and read the result line by line"],[MEDIA + "pylibs-flask.webp","Flask","A small web app, tested so the printed output is real"]],
      faq:[["Is there a free sample?","Yes: 11 pages with NumPy, pandas and Flask, as a PDF on this page."],["Do I need to know Python first?","Yes, the basics only: variables, loops and functions."],["Do I need accounts or API keys?","No. The Boto3 chapter uses a pretend AWS (moto) and the LangChain chapter uses a stand-in model, and the chapters say so."],["Does everything run on Windows?","The examples were run on Windows. Airflow's scheduler needs Linux (WSL or Docker), which the chapter explains."],["Are library logos or code copied?","No. The book has its own text, code and diagrams. Library names are trademarks of their owners and the book is not affiliated with them."]]
    },
    "build-with-ai": {
      why:[["One lesson a day for 100 days","About 60 to 90 minutes each: read, run the lab, do the exercise."],["24 skills, Python to deployment","From Python for AI to security and a portfolio project."],["Labs that run on your laptop","The sample labs need no API key. Labs are marked Local, Needs a model or Concept."],["A mini project and quiz per block","Each block ends with a project, a quiz and answers."]],
      who:["Beginners with basic Python aiming at AI jobs","B.Tech, BCA and MCA students","Developers moving into AI engineering","Self-learners who want a daily plan","Institutes that want a ready 100-day course"],
      learn:["Python for AI","How LLMs work, tokens and embeddings","Prompting and structured output","Tool calling and agents","Chunking, ingestion, vector search and hybrid search with reranking","RAG and how to evaluate it","Reliability, tracing and security","Deployment and a portfolio project"],
      details:[["Title","Build with AI: 100 Days to Job-Ready"],["Language","English"],["Plan","100 days, 24 skill blocks"],["Daily time","About 60 to 90 minutes"],["Status","Coming soon. The full book is not released yet"],["Free sample","3 chapters (PDF) and sample labs (zip)"]],
      inside:["Week 1 (days 1-7): Python for AI; How LLMs work", "Week 2 (days 8-14): How LLMs work; Tokens and embeddings; Prompt engineering", "Week 3 (days 15-21): Prompt engineering; Structured output; Tool calling", "Week 4 (days 22-28): Cost and latency; Context engineering", "Week 5 (days 29-35): Memory; AI backend and APIs", "Week 6 (days 36-42): AI backend and APIs; Chunking and ingestion; Vector databases", "Week 7 (days 43-49): Vector databases; Hybrid search and reranking; RAG and grounding", "Week 8 (days 50-56): RAG and grounding; RAG evaluation; AI agents", "Week 9 (days 57-63): AI agents; Agent reliability and human-in-the-loop", "Week 10 (days 64-70): Agent reliability and human-in-the-loop; MCP; Evals and LLM-as-judge", "Week 11 (days 71-77): Evals and LLM-as-judge; Observability and tracing; AI security", "Week 12 (days 78-84): AI security; Cloud deployment", "Week 13 (days 85-91): Cloud deployment; Fine-tuning and inference", "Week 14 (days 92-98): Fine-tuning and inference; Portfolio and interviews", "Week 15 (days 99-100): Portfolio and interviews"],
      stats:[["100","days"],["24","skills"],["3","free sample chapters"]],
      pages:[[MEDIA + "bwa-p3.webp","Chapter start","What you will learn in the chapter"],[MEDIA + "bwa-p4.webp","A lesson","Plain explanation, then the code"],[MEDIA + "bwa-p5.webp","The real output","What you should see, and what each line does"],[MEDIA + "bwa-p10.webp","Quiz","Check yourself before the next chapter"]],
      labs:[["day10-tokenizers-and-bpe","Day 10","Tokenizers and BPE"],["day11-embeddings-and-similarity","Day 11","Embeddings and similarity"],["day12-mini-project-search-50-notes-by-meaning","Day 12","Mini project: search 50 notes by meaning"],["day38-loading-pdf-html-and-text","Day 38","Loading PDF, HTML and text"],["day39-chunking-strategies","Day 39","Chunking strategies"],["day40-metadata-and-clean-up","Day 40","Metadata and clean-up"],["day41-mini-project-the-ingestion-pipeline","Day 41","Mini project: the ingestion pipeline"],["day45-keyword-search-with-bm25","Day 45","Keyword search with BM25"],["day46-hybrid-search-with-rank-fusion","Day 46","Hybrid search with rank fusion"],["day47-rerankers","Day 47","Rerankers"],["day48-mini-project-a-search-benchmark","Day 48","Mini project: a search benchmark"]],
      howto:["Download the free sample labs (zip) and unzip it.","Make a virtual environment: python -m venv .venv, then activate it.","Install the libraries: pip install -r requirements.txt (no API key needed).","Open the data folder and run a lab, for example python lab_day10.py. Day 10 needs the internet once to fetch the tokenizer vocabulary, and Day 11 downloads a model of about 90 MB the first time.","Compare your result with the \"What you see\" page in the sample PDF."],
      faq:[["Is the book ready?","Not yet. A free 3-chapter sample is available now."],["How do I test the code?","Unzip the sample labs, install the libraries and run each lab with Python on your own laptop. The steps are on this page and in the README inside the zip."],["Do I need an API key?","Not for the sample labs. Labs that need a model will be marked."],["Do I need to know Python?","Basics, yes. Block 1 refreshes Python for AI."],["How long does each day take?","About 60 to 90 minutes."],["What does the plan build toward?","The plan builds toward a tested, secured AI project with a short deployment plan and a demo for your portfolio."]]
    }
  };
}
/* Smart pairs: a tiny rule-based score from facts we hold about each book (topics, level, goal). Not "customers also bought": there is no sales data. */
const REC = {
  "python-with-chai": { tags:["python","code"], level:1, goal:"learn", cart:"python-chai" },
  "python-libraries": { tags:["python","code","data"], level:2, goal:"learn" },
  "build-with-ai": { tags:["python","ai","code"], level:3, goal:"job" },
  "ai-job-search": { tags:["ai","job"], level:1, goal:"job", cart:"book" }
};
const REC_TOPIC = { python:"Python", code:"coding", data:"data work", ai:"AI", job:"job hunting" };
function recScore(a, b){
  const A = REC[a], B = REC[b]; if (!A || !B || a === b) return { s:-1 };
  const shared = A.tags.filter(t => B.tags.indexOf(t) >= 0);
  let s = shared.length * 2, why = "";
  if (B.level === A.level + 1) { s += 3; why = "A natural next step after it"; }
  else if (B.level === A.level - 1) { s += 1; why = "Good groundwork for it"; }
  if (B.goal === A.goal) s += 1;
  if (!why && shared.length) why = "Both cover " + REC_TOPIC[shared[0]];
  if (!why) why = "Rounds out your learning";
  return { s, why };
}
/* picks(slugs): best two books to pair with the books given (cart or page) */
function recommend(slugs, limit){
  const out = {};
  Object.keys(REC).forEach(b => { if (slugs.indexOf(b) >= 0) return; let best = { s:-1 }; slugs.forEach(a => { const r = recScore(a, b); if (r.s > best.s) best = r; }); if (best.s >= 0) out[b] = best; });
  return Object.keys(out).sort((x, y) => out[y].s - out[x].s).slice(0, limit || 2).map(k => ({ slug:k, why:out[k].why }));
}
function cartSlugs(){
  const ids = (window.Cart ? Cart.items() : []), m = { "python-chai":"python-with-chai", book:"ai-job-search", bundle:"ai-job-search" }, o = [];
  ids.forEach(i => { if (m[i] && o.indexOf(m[i]) < 0) o.push(m[i]); }); return o;
}
/* Reviews: real ones only. reviews.json holds approved reviews ({book, name, city, stars, title, text, verified, date}); empty today. */
let REVIEWS = null;
const SB = { url:"https://vnktvgiordacnyxbwaae.supabase.co", key:"sb_publishable_e4fMGkoBfVsvvWudF9JTsQ_iWj-l8iT" };
function loadReviews(){
  if (REVIEWS) return Promise.resolve(REVIEWS);
  const local = fetch("reviews.json", { cache:"no-cache" }).then(r => r.ok ? r.json() : []).catch(() => []);
  const remote = fetch(SB.url + "/rest/v1/reviews?select=book,name,city,stars,title,body,verified,created_at&approved=eq.true&order=created_at.desc&limit=200", { headers:{ apikey:SB.key, Authorization:"Bearer " + SB.key } }).then(r => r.ok ? r.json() : []).catch(() => []);
  return Promise.all([local, remote]).then(([a, b]) => (REVIEWS = (Array.isArray(a) ? a : []).concat((Array.isArray(b) ? b : []).map(x => ({ book:x.book, name:x.name, city:x.city, stars:x.stars, title:x.title, text:x.body, verified:x.verified, date:(x.created_at || "").slice(0, 10) })))));
}
function rvSession(){ try { const j = JSON.parse(localStorage.getItem("rd-session") || "null"); return j && j.at && (!j.exp || j.exp * 1000 > Date.now()) ? j.at : ""; } catch (e) { return ""; } }
function starRow(n){ let h = ""; for (let i = 1; i <= 5; i++) h += `<i class="${i <= Math.round(n) ? "on" : ""}">★</i>`; return `<span class="rv-st" aria-label="${n} out of 5">${h}</span>`; }
function reviewsHtml(slug, title, list){
  const L = list.filter(r => r.book === slug && r.stars >= 1 && r.stars <= 5), n = L.length, avg = n ? L.reduce((s, r) => s + r.stars, 0) / n : 0;
  const bars = [5, 4, 3, 2, 1].map(k => { const c = L.filter(r => Math.round(r.stars) === k).length, p = n ? Math.round(c * 100 / n) : 0; return `<div class="rv-bar"><span>${k} ★</span><div><b style="width:${p}%"></b></div><em>${p}%</em></div>`; }).join("");
  const cards = L.map(r => `<article class="rv-card"><div class="rv-h"><span class="rv-av">${esc((r.name || "?").charAt(0).toUpperCase())}</span><b>${esc(r.name || "Reader")}${r.city ? " · " + esc(r.city) : ""}</b></div>${starRow(r.stars)}${r.verified ? `<div class="rv-v">Verified buyer</div>` : ""}<h3>${esc(r.title || "")}</h3><p>${esc(r.text || "")}</p><small>${esc(title)}${r.date ? " · " + esc(r.date) : ""}</small></article>`).join("");
  return `<section class="pp-rev" aria-labelledby="pp-rv"><h2 id="pp-rv">Reader reviews</h2>
    <div class="rv-top"><div class="rv-sum">${n ? `<b>${avg.toFixed(1)}</b>${starRow(avg)}<span>${n} review${n === 1 ? "" : "s"}</span>` : `<b>No reviews yet</b><span>Be the first to share what you think.</span>`}</div><div class="rv-bars">${bars}</div>
      <div class="rv-add"><button type="button" class="bk-btn buy" data-rv-add="${esc(slug)}" data-rv-title="${esc(title)}">Add your review</button><small>Reviews are checked by Raj before they appear.</small></div></div>
    ${n ? `<div class="rv-grid">${cards}</div>` : `<div class="rv-empty">Reviews from real readers will appear here.</div>`}</section>`;
}
document.addEventListener("click", e => {
  const b = e.target.closest("[data-rv-add]"); if (!b) return;
  const slug = b.dataset.rvAdd, title = b.dataset.rvTitle;
  let me = null; try { me = JSON.parse(localStorage.getItem("rd-user") || "null"); } catch (x) {}
  const d = document.createElement("div"); d.className = "rv-modal"; d.innerHTML = `<div class="rv-box" role="dialog" aria-modal="true" aria-label="Write your review"><button type="button" class="rv-x" aria-label="Close">&times;</button><h3>Write your review</h3><p class="rv-bk">${esc(title)}</p>
    <label>Your name<input id="rv-n" maxlength="60" autocomplete="name" value="${esc((me && me.name) || "")}" placeholder="Name, City"></label>
    <div class="rv-rate"><span>Rating</span><div id="rv-stars" role="radiogroup" aria-label="Rating">${[1, 2, 3, 4, 5].map(i => `<button type="button" role="radio" aria-checked="false" aria-label="${i} star${i > 1 ? "s" : ""}" data-s="${i}">★</button>`).join("")}</div><em id="rv-sl">Select rating</em></div>
    <label>Review title<input id="rv-t" maxlength="90"></label><label>Your review<textarea id="rv-b" rows="5" maxlength="600"></textarea></label>
    <label>Your email<input id="rv-e" type="email" maxlength="80" value="${esc((me && me.email) || "")}" readonly></label>
    <div class="rv-btns"><button type="button" class="bk-btn" id="rv-c">Cancel</button><button type="button" class="bk-btn buy" id="rv-send">Submit review</button></div>
    <p class="bk-note">Free login needed. Your review is checked by Raj before it appears; only approved reviews are shown.</p></div>`;
  document.body.appendChild(d);
  let rate = 0; const labs = ["Select rating", "Poor", "Fair", "Good", "Very good", "Excellent"];
  d.addEventListener("click", ev => { if (ev.target === d || ev.target.closest(".rv-x") || ev.target.id === "rv-c") { d.remove(); return; } const st = ev.target.closest("[data-s]"); if (st) { rate = +st.dataset.s; d.querySelectorAll("[data-s]").forEach(b => { const on = +b.dataset.s <= rate; b.classList.toggle("on", on); b.setAttribute("aria-checked", String(+b.dataset.s === rate)); }); d.querySelector("#rv-sl").textContent = labs[rate]; return; } if (ev.target.id !== "rv-send") return;
    const val = id => d.querySelector(id).value.trim(), msg = d.querySelector("#rv-m") || (() => { const p = document.createElement("p"); p.id = "rv-m"; p.className = "bk-note"; p.setAttribute("aria-live", "polite"); d.querySelector(".rv-box").appendChild(p); return p; })();
    if (!rate) { msg.textContent = "Please select a star rating."; return; }
    if (val("#rv-b").length < 10 || !val("#rv-n")) { msg.textContent = "Please add your name and a few words about the book."; return; }
    const tok = rvSession(); if (!tok) { msg.innerHTML = "Please <a href=\"#login\">log in</a> first (free) so we can keep spam out, then add your review."; return; }
    const send = ev.target; send.disabled = true; send.textContent = "Sending...";
    const parts = val("#rv-n").split(","), row = { book:slug, name:parts[0].trim().slice(0, 60), city:(parts.slice(1).join(",").trim() || null), stars:rate, title:val("#rv-t").slice(0, 90), body:val("#rv-b").slice(0, 600) };
    fetch(SB.url + "/rest/v1/reviews", { method:"POST", headers:{ apikey:SB.key, Authorization:"Bearer " + tok, "Content-Type":"application/json", Prefer:"return=minimal" }, body:JSON.stringify(row) })
      .then(r => { if (!r.ok) throw new Error("x" + r.status); msg.textContent = "Thank you! Your review will appear after Raj checks it."; send.remove(); })
      .catch(() => { const body = `Book: ${title} (${slug})\nRating: ${row.stars}/5\nName, city: ${val("#rv-n")}\nHeadline: ${row.title}\n\n${row.body}`; location.href = "mailto:samjhowithraj@gmail.com?subject=" + encodeURIComponent("Book review: " + title) + "&body=" + encodeURIComponent(body); send.disabled = false; send.textContent = "Send for review"; });
  });
});
const BEFORE_AFTER = {};   // slug -> { before:"media/books/ba-<slug>-before.mp4", after:"media/books/ba-<slug>-after.mp4", poster1:"...", poster2:"..." } once the AI clips are made and approved
const PP_ORDER = ["ai-job-search", "python-with-chai", "python-libraries", "build-with-ai"];
function productPage(x, slug){
  loadReviews().then(list => { const w = document.getElementById("pp-revwrap"); if (w && w.dataset.slug === slug) w.innerHTML = reviewsHtml(slug, w.dataset.title, list); });
  setTimeout(() => { const t = document.querySelector(".pp-track"); if (t) { t.scrollLeft = 0; ppSync(t); } }, 0);
  const D = productData(x), d0 = D[slug], d = d0 && Object.assign({}, d0, productExtra(x)[slug] || {});
  if (!d) return `<div class="bk"><p><a class="bk-link" href="#shop">← All books</a></p><h1>Book not found</h1></div>`;
  const imgs = d.gallery.map((g, i) => `<img src="${g[0]}" alt="${esc(g[1])}" ${i ? 'loading="lazy"' : ""} decoding="async">`).join("");
  const nav = d.gallery.length > 1 ? `<button type="button" class="pp-arrow l" data-pp-nav="-1" aria-label="Previous picture">‹</button><button type="button" class="pp-arrow r" data-pp-nav="1" aria-label="Next picture">›</button>` : "";
  const price = d.soon ? `<div class="pp-price"><b>${rs(d.price)}</b><span>+ tax · coming soon</span></div>` : `<div class="pp-price"><b>${rs(d.price)}</b><span>${d.cartId && d.cartId !== "python-chai" ? "+ tax" : ""}</span></div>`;
  const extA = d.more_href && !d.more_href.startsWith("#") ? ' target="_blank" rel="noopener"' : "";
  const cta = d.soon ? `<a class="bk-btn" href="${d.more_href || "#shop"}"${extA}>${d.more_href ? esc(d.more_label) : "See all books"}</a>`
    : d.cartId ? `<button type="button" class="bk-btn pri flash" data-bk-cart="${d.cartId}">Add to cart</button><button type="button" class="bk-btn buy flash" data-pp-buy="${d.cartId}">Buy now</button>`
    : `<a class="bk-btn pri" href="${d.buy}" target="_blank" rel="noopener">Buy on Gumroad</a>`;
  const rows = PP_ORDER.map(k => {
    const e = D[k], can = !!e.cartId, tag = e.soon ? "Coming soon" : (can ? rs(e.price) : (e.sold || ""));
    return `<label class="pp-row${can ? "" : " off"}"><input type="checkbox" data-pp-pick="${k}" ${k === slug && can ? "checked" : ""} ${can ? "" : "disabled"}><img src="${e.gallery[0][0]}" alt="" width="40" height="40" loading="lazy"><span class="t">${esc(e.title.split(":")[0])}</span><span class="p">${esc(tag)}</span></label>`;
  }).join("") + `<label class="pp-row"><input type="checkbox" data-pp-pick="builds"><span class="pp-ic" aria-hidden="true">📄</span><span class="t">Add 5 resume builds (Naukri Saathi)</span><span class="p">${rs(100)}</span></label>`;
  return `<div class="bk bk-has-sticky pp">
  <p><a class="bk-link" href="#shop">← All books</a></p>
  <section class="pp-hero">
    <div class="pp-left"><div class="pp-gal"><span class="pp-badge">${esc(d.badge || d.pill)}</span><div class="pp-track" tabindex="0" aria-label="Book pictures">${imgs}</div>${nav}${d.gallery.length > 1 ? `<span class="pp-count" id="pp-count">1 / ${d.gallery.length}</span>` : ""}</div>
    ${d.gallery.length > 1 ? `<div class="pp-thumbs" role="tablist" aria-label="All pictures">${d.gallery.map((g, i) => `<button type="button" class="pp-th" data-pp-th="${i}" aria-label="Show ${esc(g[1])}" aria-selected="${i === 0}"><img src="${g[0]}" alt="" width="64" height="64" loading="lazy"></button>`).join("")}</div>` : ""}</div>
    <div class="pp-info"><div class="bk-eyebrow">${esc(d.eyebrow)}</div><h1>${esc(d.title)}</h1>${price}
      <p class="pp-desc">${esc(d.desc)}</p>${d.more ? `<details class="pp-more"><summary>View more</summary><p>${esc(d.more)}</p>${d.more_href && !d.soon ? `<p><a class="bk-link" href="${d.more_href}">${esc(d.more_label)}</a></p>` : ""}</details>` : ""}
      <ul class="pp-pills">${d.pills.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
      <div class="bk-btns" id="pp-cta">${cta}</div>
      ${d.cartId ? `<div class="pp-pay" aria-label="Payment methods"><b>Pay your way</b><span>Cards</span><span>UPI</span><span>RuPay</span><span>Apple Pay</span><span>and more, shown on the secure page for your country</span></div>` : ""}
      ${d.soon ? "" : `<ul class="pp-trust"><li><b>Instant download</b> after payment</li><li><b>Run the code live:</b> free sample labs open in Google Colab</li><li><b>Free sample first</b> before you pay</li></ul>`}
      <p class="bk-note">English edition. Ebook: nothing is printed or shipped. No job promise and no income promise.</p></div></section>
  <section class="pp-pick" aria-labelledby="pp-h"><h2 id="pp-h">Choose your books</h2><p class="bk-lead" style="margin:6px 0 12px">Tick the books you want and add them to your cart together. Books sold on Gumroad or not released yet cannot be added here.</p>
    <div class="pp-rows">${rows}</div>
    <div class="pp-sum"><span id="pp-sum">Nothing selected</span><button type="button" class="bk-btn pri" data-pp-add>Add selected to cart</button></div>
    <p class="bk-note" id="pp-msg" aria-live="polite"></p></section>
  ${(() => { const D2 = D, rec = recommend([slug], 2); if (!rec.length) return ""; return `<section class="pp-rec" aria-labelledby="pp-rc"><h2 id="pp-rc">Smart picks to pair with this book</h2><p class="bk-lead" style="margin:6px 0 12px">Chosen by a simple rule from topic, level and goal. Not based on what others bought.</p><div class="pp-rcs">${rec.map(r => { const e = D2[r.slug], can = !!e.cartId && !e.soon, me = D2[slug]; const both = can && me.cartId ? `<button type="button" class="bk-btn pri" data-pp-both="${me.cartId},${e.cartId}">Add both to cart</button>` : (can ? `<button type="button" class="bk-btn" data-bk-cart="${e.cartId}">Add to cart</button>` : `<a class="bk-btn" href="#p/${r.slug}">${e.soon ? "Coming soon: see details" : "See details"}</a>`); return `<div class="pp-rc"><img src="${e.gallery[0][0]}" alt="" width="64" height="90" loading="lazy"><div><b><a href="#p/${r.slug}">${esc(e.title.split(":")[0])}</a></b><span>${esc(r.why)}</span><small>${e.soon ? rs(e.price) + " + tax · coming soon" : rs(e.price) + (e.cartId === "book" ? " + tax" : "")}</small></div>${both}</div>`; }).join("")}</div></section>`; })()}
  ${(() => { const ba = BEFORE_AFTER[slug] || BEFORE_AFTER.default; return ba ? `<section class="pp-ba" aria-labelledby="pp-ba"><h2 id="pp-ba">From stuck to confident</h2><p class="bk-lead" style="margin:6px 0 12px">AI-generated illustration. Real results depend on your own practice.</p><div class="ba-grid"><figure><video src="${ba.before}" ${ba.poster1 ? `poster="${ba.poster1}"` : ""} muted loop playsinline preload="none" controls></video><figcaption><b>Before</b> Struggling alone with a heavy textbook</figcaption></figure><span class="ba-arrow" aria-hidden="true">&rarr;</span><figure><video src="${ba.after}" ${ba.poster2 ? `poster="${ba.poster2}"` : ""} muted loop playsinline preload="none" controls></video><figcaption class="ok"><b>After</b> Learning step by step with ${esc(d.title.split(":")[0])}</figcaption></figure></div></section>` : ""; })()}
  <div id="pp-revwrap" data-slug="${slug}" data-title="${esc(d.title.split(":")[0])}"></div>
  <section class="pp-sets" aria-labelledby="pp-sh"><h2 id="pp-sh">Sets</h2><p class="bk-lead" style="margin:6px 0 12px">Books and tools that work well together.</p>
    <div class="pp-rows">
      <div class="pp-set"><span class="pp-tag">Bundle</span><div class="t"><b>Job-Ready bundle</b><small>AI Job Search book + 5 Naukri Saathi resume builds</small></div><div class="p"><b>${rs(249)}</b><small>+ tax</small></div><button type="button" class="bk-btn pri" data-bk-cart="bundle">Add to cart</button></div>
      <div class="pp-set off"><span class="pp-tag best">Set</span><div class="t"><b>Python + AI set</b><small>Python with Chai + Python Libraries Made Easy + Build with AI</small></div><div class="p"><small>Price announced at launch</small></div><span class="bk-btn" aria-disabled="true">Coming soon</span></div>
    </div>
    <p class="bk-note">Set prices are decided at launch. Have a coupon? You can enter it on the secure payment page.</p></section>
    ${d.stats ? `<section class="pp-stats" aria-label="At a glance">${d.stats.map(t => `<div><b>${esc(t[0])}</b><span>${esc(t[1])}</span></div>`).join("")}</section>` : ""}
  ${d.why ? `<section aria-labelledby="pp-why"><h2 id="pp-why">Why choose this book</h2><div class="pp-cards">${d.why.map(t => `<div class="pp-card"><b>${esc(t[0])}</b><p>${esc(t[1])}</p></div>`).join("")}</div></section>` : ""}
  ${d.who ? `<section aria-labelledby="pp-who"><h2 id="pp-who">Who is it for</h2><ul class="pp-who">${d.who.map(t => `<li>${esc(t)}</li>`).join("")}</ul></section>` : ""}
  ${d.learn ? `<section aria-labelledby="pp-learn"><h2 id="pp-learn">What you will learn</h2><ul class="pp-ticks">${d.learn.map(t => `<li>${esc(t)}</li>`).join("")}</ul></section>` : ""}
  ${d.details ? `<section aria-labelledby="pp-det"><h2 id="pp-det">Book details</h2><table class="pp-table"><tbody>${d.details.map(t => `<tr><th scope="row">${esc(t[0])}</th><td>${esc(t[1])}</td></tr>`).join("")}</tbody></table></section>` : ""}
  ${d.inside ? `<section aria-labelledby="pp-in"><h2 id="pp-in">${d.soon ? "The plan" : "Inside the book"}</h2><ul class="pp-ticks one">${d.inside.map(t => `<li>${esc(t)}</li>`).join("")}</ul></section>` : ""}
  ${d.chapters && d.chapters.length ? `<section aria-labelledby="pp-ch"><h2 id="pp-ch">Chapters</h2><ol class="pp-chs">${d.chapters.map(c => `<li value="${c[0]}">${esc(c[1])}</li>`).join("")}</ol></section>` : ""}
  ${d.pages ? `<section aria-labelledby="pp-pg"><h2 id="pp-pg">See a real page</h2><div class="pp-pages">${d.pages.map(g => `<figure><img src="${g[0]}" alt="${esc(g[1])}" loading="lazy"><figcaption><b>${esc(g[1])}</b> ${esc(g[2])}</figcaption></figure>`).join("")}</div></section>` : ""}
  ${d.labs ? (() => { let u = null; try { u = JSON.parse(localStorage.getItem("rd-user") || "null"); } catch (e) {} const ok = !!(u && u.email);
    return `<section aria-labelledby="pp-colab"><h2 id="pp-colab">Open the sample labs in Google Colab</h2><p class="bk-lead" style="margin:6px 0 12px">No install needed: run the labs in your browser.</p>${ok
      ? `<div class="pp-labs">${d.labs.map(l => `<a class="bk-btn" href="https://colab.research.google.com/github/samjhowithraj-007/samjhowithrajwebsite/blob/main/colab/${l[0]}.ipynb" target="_blank" rel="noopener"><b>${esc(l[1])}</b> ${esc(l[2])} · Open in Colab →</a>`).join("")}</div>`
      : `<p><a class="bk-btn pri" href="#login">Log in to open the labs in Colab</a></p>`}<p class="bk-note">Colab asks you to sign in to your own Google account; we cannot log you in to Google. The site login is only a convenience: these sample notebooks are in our public repository.</p></section>`; })() : ""}
  ${d.howto ? `<section aria-labelledby="pp-how"><h2 id="pp-how">How to test the code</h2><ol class="pp-how">${d.howto.map(t => `<li>${esc(t)}</li>`).join("")}</ol>${d.more_href ? `<p class="bk-btns" style="margin-top:12px"><a class="bk-btn" href="notes/ai100-sample-labs.zip">Free sample labs (zip) →</a><a class="bk-btn" href="${d.more_href}" target="_blank" rel="noopener">Free sample (PDF) →</a></p>` : ""}</section>` : ""}
  ${d.faq ? `<section class="bk-faq" aria-labelledby="pp-faq"><h2 id="pp-faq" style="margin-bottom:12px">Questions</h2>${d.faq.map(q => `<details><summary>${esc(q[0])}</summary><p>${esc(q[1])}</p></details>`).join("")}</section>` : ""}
  <section aria-labelledby="pp-like"><h2 id="pp-like">You may also like</h2><div class="pp-like">${PP_ORDER.filter(k => k !== slug).map(k => `<a class="pp-lk" href="#p/${k}"><img src="${D[k].gallery[0][0]}" alt="" width="64" height="64" loading="lazy"><b>${esc(D[k].title.split(":")[0])}</b><span>${D[k].soon ? "Coming soon" : rs(D[k].price)}</span></a>`).join("")}</div></section>
  <div class="pp-bar" role="region" aria-label="Buy"><img src="${d.gallery[0][0]}" alt="" width="44" height="44"><div class="t"><b>${esc(d.title.split(":")[0])}</b><span>${rs(d.price)}${(d.cartId && d.cartId !== "python-chai") || d.soon ? " + tax" : ""}</span></div>${cta}</div>
  </div>`;
}
function ppSum(){
  const rows = [...document.querySelectorAll("[data-pp-pick]:checked")]; const el = document.getElementById("pp-sum"); if (!el) return;
  const ids = rows.map(r => r.dataset.ppPick), book = ids.indexOf("ai-job-search") >= 0, b = ids.indexOf("builds") >= 0;
  let total = 0; if (book && b) total = 249; else { if (book) total = 149; if (b) total = 49; } if (ids.indexOf("python-with-chai") >= 0) total += 499;
  el.textContent = ids.length ? `${ids.length} selected · ${rs(total)} + tax` : "Nothing selected";
}
function ppSync(t){ const i = Math.round(t.scrollLeft / Math.max(1, t.clientWidth)), n = t.children.length, c = document.getElementById("pp-count");
  if (c) c.textContent = (i + 1) + " / " + n;
  document.querySelectorAll("[data-pp-th]").forEach(b => b.setAttribute("aria-selected", String(+b.dataset.ppTh === i)));
  const l = document.querySelector(".pp-arrow.l"), r = document.querySelector(".pp-arrow.r"); if (l) l.disabled = i === 0; if (r) r.disabled = i >= n - 1; }
document.addEventListener("scroll", e => { if (e.target && e.target.classList && e.target.classList.contains("pp-track")) ppSync(e.target); }, true);
document.addEventListener("keydown", e => { const t = e.target; if (t && t.classList && t.classList.contains("pp-track") && (e.key === "ArrowRight" || e.key === "ArrowLeft")) { e.preventDefault(); t.scrollBy({ left: (e.key === "ArrowRight" ? 1 : -1) * t.clientWidth, behavior: "smooth" }); } });
document.addEventListener("change", e => { if (e.target.closest("[data-pp-pick]")) ppSum(); });
document.addEventListener("click", e => {
  const n = e.target.closest("[data-pp-nav]"); if (n) { const t = document.querySelector(".pp-track"); if (t) t.scrollBy({ left: +n.dataset.ppNav * t.clientWidth, behavior: "smooth" }); return; }
  const ab = e.target.closest("[data-pp-both]"); if (ab && window.Cart) { ab.dataset.ppBoth.split(",").forEach(i => Cart.add(i)); Cart.open(); return; }
  const bn = e.target.closest("[data-pp-buy]"); if (bn && window.Cart) { e.preventDefault(); const lab = bn.textContent; bn.disabled = true; bn.textContent = "Processing..."; Cart.add(bn.dataset.ppBuy); Promise.resolve(Cart.checkout()).then(() => { bn.disabled = false; bn.textContent = lab; }, () => { bn.disabled = false; bn.textContent = lab; }); return; }
  const th = e.target.closest("[data-pp-th]"); if (th) { const t = document.querySelector(".pp-track"); if (t) t.scrollTo({ left: +th.dataset.ppTh * t.clientWidth, behavior: "smooth" }); return; }
  if (e.target.closest("[data-pp-add]")) {
    const ids = [...document.querySelectorAll("[data-pp-pick]:checked")].map(r => r.dataset.ppPick), m = document.getElementById("pp-msg");
    if (!ids.length) { if (m) m.textContent = "Tick at least one item first."; return; }
    if (!window.Cart) { if (m) m.textContent = "The cart is not available right now. Please reload the page."; return; }
    const book = ids.indexOf("ai-job-search") >= 0, b = ids.indexOf("builds") >= 0;
    if (book && b) Cart.add("bundle"); else { if (book) Cart.add("book"); if (b) Cart.add("resume-pack"); }
    if (ids.indexOf("python-with-chai") >= 0) Cart.add("python-chai");
    Cart.open();
  }
});

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
window.RDBOOKS = { shop, aiPage, sticky, productPage, recommend, cartSlugs, productData };
})();
if (["#shop", "#book", "#ai-job-search"].indexOf(location.hash) >= 0 || location.hash.indexOf("#p/") === 0) window.dispatchEvent(new HashChangeEvent("hashchange"));
