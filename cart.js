/* Tech Samjho Raj: shared cart. Items are ids only (no prices stored). Prices below are display-only and must match the Dodo products;
   the Worker action "checkout" maps ids to Dodo products and Dodo charges its own price. English by default.
   API: Cart.add(id) Cart.remove(id) Cart.items() Cart.count() Cart.clear() Cart.open() Cart.close() Cart.checkout() Cart.total() Cart.info(id)
   Events on window: "cart:change" (detail {items}), "cart:login" (cancelable; fired when checkout needs a login first). */
(function () {
  var WORKER = window.CART_WORKER || "https://naukri-saathi.techsamjhoraj.workers.dev", KEY = "ns-cart";   // CART_WORKER is only set on local test pages
  var PRODUCTS = window.CART_PRODUCTS = window.CART_PRODUCTS || [
    { id: "resume-pack", title: "Naukri Saathi resume pack (3 tailored resumes + cover letters)", price: 49, cover: "/img/botu-192.png" },
    { id: "book", title: "AI Job Search book (English) + 1 resume build", price: 149, cover: "/media/books/aijob-cover.webp?v=2" },
    { id: "python-chai", title: "Python with Chai (PDF + EPUB, English)", price: 499, cover: "/media/books/python-with-chai-cover-a4.webp", ext: "https://samjhowithraj.gumroad.com/l/python-with-chai-en" },   // sold on Gumroad until it has a Dodo product
    { id: "bundle", title: "Job-Ready bundle: AI Job Search book + 5 resume builds", price: 249, cover: "/media/books/aijob-cover.webp?v=2" }
  ];
  var ALIAS = { "book-en": "book" };   // the book is one Dodo product (English only)
  function norm(id) { id = String(id || ""); return ALIAS[id] || id; }
  function info(id) { id = norm(id); for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i]; return null; }
  function load() { try { var a = JSON.parse(localStorage.getItem(KEY) || "[]"); return Array.isArray(a) ? a.filter(function (x) { return info(x); }) : []; } catch (e) { return []; } }
  function save(a) { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} }
  function fire() { badge(); render(); try { window.dispatchEvent(new CustomEvent("cart:change", { detail: { items: items() } })); } catch (e) {} }
  function items() {
    var a = load();
    if (a.indexOf("bundle") > -1) a = a.filter(function (x) { return x !== "book"; });   // the bundle already includes the book
    return a;
  }
  function add(id) { id = norm(id); if (!info(id)) return false; var a = load(); if (a.indexOf(id) < 0) a.push(id); save(a); fire(); return true; }
  function remove(id) { id = norm(id); save(load().filter(function (x) { return x !== id; })); fire(); }
  function clear() { save([]); fire(); }
  function dodoItems() { return items().filter(function (id) { return !info(id).ext; }); }
  function extItems() { return items().filter(function (id) { return !!info(id).ext; }); }
  function total() { return dodoItems().reduce(function (s, id) { return s + info(id).price; }, 0); }
  function extTotal() { return extItems().reduce(function (s, id) { return s + info(id).price; }, 0); }
  function user() { try { var u = JSON.parse(localStorage.getItem("rd-user") || "null"); return u && u.email ? u : null; } catch (e) { return null; } }

  /* ---- small drawer + badge, only built when used ---- */
  var box, st;
  function css() {
    if (st) return; st = document.createElement("style");
    st.textContent = ".tsr-cart-badge{display:inline-block;min-width:18px;padding:0 5px;margin-left:4px;border-radius:9px;background:#4338ca;color:#fff;font:700 12px/18px system-ui,sans-serif;text-align:center}.tsr-cart-badge:empty,.tsr-cart-badge[data-n=\"0\"]{display:none}" +
      ".tsr-cart{position:fixed;inset:0;z-index:99999;display:none}.tsr-cart.on{display:block}.tsr-cart .bg{position:absolute;inset:0;background:rgba(15,18,40,.5)}" +
      ".tsr-cart .pn{position:absolute;right:0;top:0;bottom:0;width:min(440px,100%);background:#fff;color:#14172b;overflow:auto;font:15px/1.45 system-ui,sans-serif;box-shadow:-6px 0 30px rgba(0,0,0,.28);display:flex;flex-direction:column}" +
      ".tsr-cart .hd{display:flex;align-items:center;gap:10px;padding:18px 20px;border-bottom:1px solid #e6e8f2}.tsr-cart .hd h2{margin:0;font-size:24px;color:#14172b!important}:root[data-theme=\"dark\"] .tsr-cart .hd h2{color:#e8eaf0!important}.tsr-cart .cnt{min-width:26px;height:26px;border-radius:13px;background:#f59e0b;color:#3a2500;font:700 14px/26px system-ui,sans-serif;text-align:center;padding:0 7px}" +
      ".tsr-cart .xx{margin-left:auto;width:38px;height:38px;border-radius:50%;border:0;background:transparent;font-size:26px;line-height:1;cursor:pointer;color:inherit}" +
      ".tsr-cart .strip{background:#f3f4fb;padding:11px 20px;font-size:14px;text-align:center;color:#3a3f66}.tsr-cart .strip b{color:#15803d}" +
      ".tsr-cart .items{padding:6px 20px;flex:1}.tsr-cart .row{display:grid;grid-template-columns:64px 1fr auto;gap:12px;align-items:center;padding:14px 0;border-bottom:1px solid #e6e8f2}" +
      ".tsr-cart .row img{width:64px;height:64px;object-fit:contain;border-radius:10px;background:#eef0ff}.tsr-cart .row .tt{font-weight:600}.tsr-cart .row .pr{font-weight:700;text-align:right}.tsr-cart .row s{display:block;font-weight:400;color:#6b7090;font-size:13px}" +
      ".tsr-cart .rm{border:0;background:none;color:#b91c1c;padding:4px 0;font:inherit;font-size:13px;cursor:pointer;text-decoration:underline}" +
      ".tsr-cart .sum{padding:14px 20px 20px;border-top:1px solid #e6e8f2}.tsr-cart .ln{display:flex;justify-content:space-between;gap:10px;margin:6px 0}.tsr-cart .ln.big{font-size:20px;font-weight:700;margin:10px 0}.tsr-cart .ln.sv{color:#b91c1c}" +
      ".tsr-cart .note{font-size:13px;color:#555b7a;margin:8px 0 0}.tsr-cart .go{width:100%;margin-top:12px;min-height:52px;border-radius:14px;border:0;background:#14214d;color:#fff;font:700 17px system-ui,sans-serif;cursor:pointer}.tsr-cart .go[disabled]{opacity:.6}" +
      ".tsr-cart .perks{list-style:none;margin:0;padding:10px 20px 0;display:grid;gap:6px;font-size:14px}.tsr-cart .perks li{padding-left:24px;position:relative}.tsr-cart .perks li:before{content:\"✓\";position:absolute;left:0;color:#15803d;font-weight:700}.tsr-cart .pay{display:flex;align-items:center;justify-content:center;gap:10px;margin:12px 0 0;color:#14214d;font-size:13px}.tsr-co{position:fixed;inset:0;z-index:100000;display:none;align-items:center;justify-content:center;background:rgba(15,18,40,.55);padding:12px}.tsr-co.on{display:flex}.tsr-co .md{width:min(440px,100%);max-height:calc(100vh - 24px);overflow:auto;border-radius:24px;background:#fff;color:#14172b;font:15px/1.45 system-ui,sans-serif;box-shadow:0 20px 60px rgba(0,0,0,.4)}.tsr-co .top{background:#4338ca;color:#fff;padding:16px 18px 14px;border-radius:24px 24px 0 0}.tsr-co .brand{display:flex;align-items:center;gap:10px;font-size:19px;font-weight:700}.tsr-co .brand button{border:0;background:rgba(255,255,255,.18);color:#fff;width:38px;height:38px;border-radius:50%;font-size:20px;cursor:pointer}.tsr-co .steps{display:flex;gap:8px;align-items:center;margin-top:12px;font-size:14px}.tsr-co .steps b{background:rgba(255,255,255,.22);padding:7px 14px;border-radius:99px}.tsr-co .ok{margin:14px 16px 0;padding:10px 14px;border-radius:14px 14px 0 0;background:linear-gradient(#d9f7ea,#eefaf5);color:#0f6b3f;font-weight:600;text-align:center}.tsr-co .os{margin:0 16px;padding:14px;border-radius:0 0 16px 16px;background:#f5f6fb}.tsr-co .os h3{margin:0 0 10px;font-size:16px;font-weight:600;color:#3a3f66}.tsr-co .thumbs{display:flex;align-items:center;justify-content:space-between;gap:10px}.tsr-co .thumbs div{display:flex}.tsr-co .thumbs img{width:46px;height:46px;border-radius:50%;object-fit:cover;border:2px solid #fff;margin-left:-12px;background:#eef0ff}.tsr-co .thumbs img:first-child{margin-left:0}.tsr-co .thumbs b{font-size:22px}.tsr-co .cp{margin:12px 16px 0;padding:12px 14px;border-radius:16px;background:#fff;border:1.5px solid #dfe2f5;display:flex;gap:12px;align-items:center}.tsr-co .cp i{flex:none;width:40px;height:40px;border-radius:12px;background:#f59e0b;color:#3a2500;display:grid;place-items:center;font-style:normal;font-weight:800;font-size:18px}.tsr-co .cp span{display:block;font-size:13px;color:#555b7a}.tsr-co .bar{margin:12px 0 0;background:#4338ca;color:#fff;text-align:center;padding:12px 16px;font-weight:700;font-size:14px;letter-spacing:.02em}.tsr-co .bt{padding:16px}.tsr-co .cont{width:100%;min-height:52px;border-radius:14px;border:0;background:#0b0f24;color:#fff;font:700 17px system-ui,sans-serif;cursor:pointer}.tsr-co .cont[disabled]{opacity:.6}.tsr-co .fine{margin:10px 0 0;text-align:center;font-size:12.5px;color:#555b7a}.tsr-co .ex{padding:0 0 18px;text-align:center}.tsr-co .ex .art{background:#dcd9f7;border-radius:24px 24px 50% 50%/24px 24px 40px 40px;padding:26px 0 18px;margin-bottom:14px}.tsr-co .ex h3{margin:0;font-size:22px;color:#14172b!important}:root[data-theme=\"dark\"] .tsr-co .ex h3{color:#e8eaf0!important}.tsr-conf{position:absolute;left:0;right:0;top:120px;height:0;pointer-events:none;overflow:visible}.tsr-conf i{position:absolute;top:0;width:8px;height:12px;border-radius:2px;opacity:0;animation:tsrc 1.4s ease-out forwards}@keyframes tsrc{0%{opacity:1;transform:translate(0,0) rotate(0)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) rotate(var(--r))}}@media (prefers-reduced-motion:reduce){.tsr-conf{display:none}}.tsr-co .ex p{margin:8px 20px 18px;color:#555b7a}.tsr-co .ex .row{display:grid;gap:10px;padding:0 16px}.tsr-co .ex .alt{min-height:50px;border-radius:14px;border:1.5px solid #cfd3ea;background:#fff;color:#14172b;font:700 16px system-ui,sans-serif;cursor:pointer}.tsr-co .fine a{color:inherit;font-weight:700}:root[data-theme=\"dark\"] .tsr-co .ex .art{background:#262a45}:root[data-theme=\"dark\"] .tsr-co .ex .alt{background:#1d2230;color:#e8eaf0;border-color:#3b4256}:root[data-theme=\"dark\"] .tsr-co .md{background:#161a22;color:#e8eaf0}:root[data-theme=\"dark\"] .tsr-co .os{background:#1d2230}:root[data-theme=\"dark\"] .tsr-co .os h3,:root[data-theme=\"dark\"] .tsr-co .cp span,:root[data-theme=\"dark\"] .tsr-co .fine{color:#aab0c0}:root[data-theme=\"dark\"] .tsr-co .cp{background:#1d2230;border-color:#2a3040}:root[data-theme=\"dark\"] .tsr-co .cont{background:#6366f1}:root[data-theme=\"dark\"] .tsr-co .ok{background:#12372a;color:#7ee2ac}.tsr-cart .sg{display:grid;grid-template-columns:40px 1fr auto;gap:12px;align-items:center;margin:12px 20px 0;padding:10px 12px;border:1.5px dashed #b9bdea;border-radius:14px;background:#f5f6fd}.tsr-cart .sg img{width:40px;height:56px;object-fit:cover;border-radius:4px}.tsr-cart .sg div{display:grid;gap:1px;font-size:14px}.tsr-cart .sg span{color:#555b7a;font-size:13px}.tsr-cart .sg button{border:0;background:#4338ca;color:#fff;border-radius:10px;padding:8px 14px;font:700 14px system-ui,sans-serif;cursor:pointer}.tsr-cart .trust{margin-top:12px;text-align:center;font-size:13px;color:#555b7a}.tsr-cart .empty{padding:40px 20px;text-align:center}" +
      ":root[data-theme=\"dark\"] .tsr-cart .pn{background:#161a22;color:#e8eaf0}:root[data-theme=\"dark\"] .tsr-cart .hd,:root[data-theme=\"dark\"] .tsr-cart .row,:root[data-theme=\"dark\"] .tsr-cart .sum{border-color:#2a3040}:root[data-theme=\"dark\"] .tsr-cart .strip{background:#1d2230;color:#c9cee0}:root[data-theme=\"dark\"] .tsr-cart .strip b{color:#4ade80}:root[data-theme=\"dark\"] .tsr-cart .row img{background:#232a3d}:root[data-theme=\"dark\"] .tsr-cart .go{background:#6366f1}:root[data-theme=\"dark\"] .tsr-cart .note,:root[data-theme=\"dark\"] .tsr-cart .trust,:root[data-theme=\"dark\"] .tsr-cart .row s{color:#aab0c0}:root[data-theme=\"dark\"] .tsr-cart .rm{color:#f87171}:root[data-theme=\"dark\"] .tsr-cart .ln.sv{color:#f87171}";
    document.head.appendChild(st);
  }
  function ensure() {
    if (box) return; css(); box = document.createElement("div"); box.className = "tsr-cart"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-label", "Your cart");
    box.innerHTML = "<div class='bg'></div><div class='pn'></div>"; document.body.appendChild(box);
    box.querySelector(".bg").addEventListener("click", close);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function sugg() {
    try {
      if (!window.RDBOOKS || !RDBOOKS.recommend) return "";
      var rec = RDBOOKS.recommend(RDBOOKS.cartSlugs(), 3), D = RDBOOKS.productData({ BOOK: { price: 499, buy: { en: "" } }, AIJOB: { price: 149, en: "" } }), r = null, e = null;
      for (var i = 0; i < rec.length; i++) { e = D[rec[i].slug]; if (e && e.cartId && !e.soon && items().indexOf(e.cartId) < 0 && !(e.cartId === "book" && items().indexOf("bundle") > -1)) { r = rec[i]; break; } }
      if (!r) return "";
      return "<div class='sg'><img src='/" + esc(e.gallery[0][0]) + "' alt='' width='40' height='56'><div><b>Pairs well: " + esc(e.title.split(":")[0]) + "</b><span>" + esc(r.why) + " &middot; Rs " + e.price + "</span></div><button type='button' data-sg='" + e.cartId + "'>Add</button></div>";
    } catch (x) { return ""; }
  }
  function render() {
    if (!box) return; var a = items(), p = box.querySelector(".pn");
    var sv = 0; a.forEach(function (id) { var i = info(id); if (i.was) sv += i.was - i.price; });
    p.innerHTML = "<div class='hd'><h2>Cart</h2>" + (a.length ? "<span class='cnt'>" + a.length + "</span>" : "") + "<button type='button' class='xx' data-close aria-label='Close cart'>&times;</button></div>" +
      (a.length ? "<div class='strip'><b>Instant download</b> after payment &middot; ebooks, nothing is shipped</div><ul class='perks'><li><b>Run the code live:</b> free sample labs open in Google Colab</li><li><b>Free previews</b> of every book before you pay</li></ul><div class='items'>" +
        a.map(function (id) { var i = info(id); return "<div class='row'>" + (i.cover ? "<img src='" + esc(i.cover) + "' alt='' width='64' height='64'>" : "<span></span>") + "<div><div class='tt'>" + esc(i.title) + (i.ext ? " <small>(Gumroad)</small>" : "") + "</div><button type='button' class='rm' data-rm='" + id + "'>Remove</button></div><div class='pr'>Rs " + i.price + (i.was ? "<s>Rs " + i.was + "</s>" : "") + "</div></div>"; }).join("") + "</div>" +
        sugg() + "<div class='sum'>" + (sv ? "<div class='ln sv'><span>Savings</span><span>-Rs " + sv + "</span></div>" : "") + (extItems().length ? "<div class='ln'><span>Paid on Gumroad (separate checkout)</span><span>Rs " + extTotal() + "</span></div>" : "") + (dodoItems().length ? "<div class='ln big'><span>" + (extItems().length ? "Estimated total (Dodo, this site)" : "Estimated total") + "</span><span>Rs " + total() + "</span></div>" : "") +
        (extItems().length ? "<p class='note'>Items marked Gumroad open their own secure checkout in a new tab.</p>" : "") + (dodoItems().length ? "<p class='note'>Plus tax. Have a coupon? Enter it on the secure Dodo Payments page, where the final amount is shown.</p>" : "") +
        "<button type='button' class='go' data-go>Check out</button>" + (dodoItems().length ? "<p class='pay' aria-label='Payment methods shown on the secure page'><svg viewBox='0 0 24 24' width='26' height='26' aria-hidden='true'><rect x='2' y='5' width='20' height='14' rx='3' fill='none' stroke='currentColor' stroke-width='1.8'/><path d='M2 10h20' stroke='currentColor' stroke-width='1.8'/><rect x='5' y='13.5' width='6' height='2' rx='1' fill='currentColor'/></svg><svg viewBox='0 0 24 24' width='24' height='24' aria-hidden='true'><rect x='5' y='10' width='14' height='10' rx='2.5' fill='none' stroke='currentColor' stroke-width='1.8'/><path d='M8 10V7.5a4 4 0 0 1 8 0V10' fill='none' stroke='currentColor' stroke-width='1.8'/></svg><span>Cards and other methods on the secure page</span></p><p class='trust'>Secure payment by Dodo Payments</p>" : "<p class='trust'>Secure checkout on Gumroad</p>") + "<p class='note' id='tsrCartMsg' aria-live='polite'></p></div>"
        : "<div class='empty'><p>Your cart is empty.</p></div>");
    p.onclick = function (e) {
      var t = e.target; if (t.hasAttribute("data-close")) close(); var r = t.getAttribute("data-rm"); if (r) remove(r); if (t.hasAttribute("data-go")) review(); var sgid = t.getAttribute("data-sg"); if (sgid) add(sgid);
    };
  }
  function badge() { var n = items().length; [].forEach.call(document.querySelectorAll("[data-cart-count]"), function (el) { el.textContent = n ? String(n) : ""; el.setAttribute("data-n", String(n)); if (!/tsr-cart-badge/.test(el.className)) el.className += " tsr-cart-badge"; }); }
  function confetti() {
    try {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches || !items().length) return;
      var p = box.querySelector(".pn"), old = p.querySelector(".tsr-conf"); if (old) old.remove();
      var c = document.createElement("div"); c.className = "tsr-conf"; var cols = ["#4338ca", "#f59e0b", "#15803d", "#ec4899", "#06b6d4"], h = "";
      for (var k = 0; k < 28; k++) { var x = 8 + Math.random() * 84, dx = (Math.random() - .5) * 160, dy = 60 + Math.random() * 140; h += "<i style='left:" + x + "%;background:" + cols[k % cols.length] + ";--dx:" + dx.toFixed(0) + "px;--dy:" + dy.toFixed(0) + "px;--r:" + ((Math.random() - .5) * 720).toFixed(0) + "deg;animation-delay:" + (Math.random() * .2).toFixed(2) + "s'></i>"; }
      c.innerHTML = h; p.appendChild(c); setTimeout(function () { if (c.parentNode) c.remove(); }, 1800);
    } catch (e) {}
  }
  var last; function open() { ensure(); render(); last = document.activeElement; box.classList.add("on"); confetti(); var f = box.querySelector("[data-close]"); if (f) f.focus(); }
  function close() { if (box) box.classList.remove("on"); try { if (last && last.focus) last.focus(); } catch (e) {} }
  function msg(t) { var m = document.getElementById("tsrCartMsg"); if (m) m.textContent = t; }

  var co;
  var DOOR = "<svg viewBox='0 0 64 64' width='84' height='84' aria-hidden='true'><rect x='14' y='8' width='36' height='48' rx='3' fill='#fff' stroke='#4338ca' stroke-width='3'/><path d='M32 8v48' stroke='#4338ca' stroke-width='3'/><rect x='24' y='2' width='16' height='9' rx='2' fill='#e0312f'/><path d='M38 32l8 0m-4-4l4 4-4 4' stroke='#4338ca' stroke-width='3' fill='none' stroke-linecap='round'/></svg>";
  function showExit(kind) {
    if (!co) return;
    var paid = kind === "closed";
    co.innerHTML = "<div class='md'><div class='ex'><div class='art'>" + DOOR + "</div><h3>" + (paid ? "Payment not completed" : "Are you sure you want to exit?") + "</h3><p>" + (paid ? "Nothing was charged. Your cart is saved on this device, so you can try again any time." : "Your cart is saved on this device, so you can come back and pay any time.") + "</p><div class='row'><button type='button' class='alt' data-co-stay>" + (paid ? "Try again" : "Continue to payment") + "</button><button type='button' class='cont' data-co-leave>" + (paid ? "Back to the store" : "Yes, exit") + "</button></div></div></div>";
    co.classList.add("on");
  }
  var dodoLoad, dodoInit, dodoMode;
  function openOverlay(url) {
    var mode = /^https:\/\/test\./.test(url) ? "test" : "live";
    function go() {
      try {
        var D = window.DodoPaymentsCheckout && window.DodoPaymentsCheckout.DodoPayments; if (!D) throw new Error("sdk");
        if (!dodoInit || dodoMode !== mode) { D.Initialize({ mode: mode, displayType: "overlay", onEvent: function (ev) { try { if (ev && ev.event_type === "checkout.closed") { setTimeout(function () { if (document.visibilityState === "visible") { ensureCo(); showExit("closed"); } }, 400); } } catch (e) {} } }); dodoInit = true; dodoMode = mode; }
        if (co) co.classList.remove("on");
        D.Checkout.open({ checkoutUrl: url }); return true;
      } catch (e) { location.href = url; return false; }
    }
    if (window.DodoPaymentsCheckout) return go();
    if (!dodoLoad) dodoLoad = new Promise(function (res, rej) { var sc = document.createElement("script"); sc.src = "https://cdn.jsdelivr.net/npm/dodopayments-checkout@2.2.0/dist/index.js"; sc.onload = res; sc.onerror = rej; document.head.appendChild(sc); });
    dodoLoad.then(go, function () { location.href = url; });
    return true;
  }
  function ensureCo() { if (!co) { co = document.createElement("div"); co.className = "tsr-co"; co.setAttribute("role", "dialog"); co.setAttribute("aria-modal", "true"); document.body.appendChild(co); co.addEventListener("click", function (e) { if (e.target === co || e.target.hasAttribute("data-co-x")) { showExit("leave"); return; } if (e.target.hasAttribute("data-co-stay")) { review(); return; } if (e.target.hasAttribute("data-co-leave")) { co.classList.remove("on"); return; } if (e.target.hasAttribute("data-co-go")) { var b = e.target; b.disabled = true; b.textContent = "Opening payment..."; checkout().then(function () { b.disabled = false; b.textContent = "Continue to payment"; }); } }); } }
  function review() {
    var a = items(); if (!a.length) return;
    ensureCo();
    var ex = extItems().length, dd = dodoItems().length;
    co.innerHTML = "<div class='md'><div class='top'><div class='brand'><button type='button' data-co-x aria-label='Back to cart'>&larr;</button>Tech Samjho Raj</div><div class='steps'><b>Review</b><span>&rsaquo;</span><span>Payment</span></div></div>" +
      "<div class='ok'>Instant download after payment</div>" +
      "<div class='os'><h3>Order summary &bull; " + a.length + (a.length === 1 ? " item" : " items") + "</h3><div class='thumbs'><div>" + a.map(function (id) { var i = info(id); return i.cover ? "<img src='" + esc(i.cover) + "' alt=''>" : ""; }).join("") + "</div><b>Rs " + (dd ? total() : extTotal()) + "</b></div>" + (ex ? "<p class='fine' style='text-align:left'>" + (dd ? "Plus Rs " + extTotal() + " on Gumroad (separate checkout). " : "") + "Gumroad shows the final price, taxes included, on its own page." + "</p>" : "") + "</div>" +
      "<div class='cp'><i>%</i><div><b>Have a coupon code?</b><span>Enter it on the next secure payment page.</span></div></div>" +
      "<div class='bar'>RUN THE CODE LIVE &middot; free sample labs open in Google Colab</div>" +
      "<div class='bt'><button type='button' class='cont' data-co-go>Continue to payment</button><p class='fine'>By continuing you agree to our <a href='/#terms'>Terms</a> and <a href='/#refund'>Refund policy</a>." + (dd ? " Payment is handled by Dodo Payments." : "") + "</p></div></div>";
    co.classList.add("on");
  }

  function checkout(opts) {
    opts = opts || {}; var all = items(); if (!all.length) { msg("Your cart is empty."); return Promise.resolve(false); }
    var ex = extItems(), a = dodoItems();
    if (ex.length) { ex.forEach(function (id) { try { window.open(info(id).ext, "_blank", "noopener"); } catch (e) {} }); if (!a.length) { ex.forEach(remove); return Promise.resolve(true); } ex.forEach(remove); }
    var u = user();
    if (!u) {   // log in first, so the key email is a verified one
      var ok = true; try { ok = window.dispatchEvent(new CustomEvent("cart:login", { cancelable: true })); } catch (e) {}
      if (ok) location.href = "/#login"; else close();
      return Promise.resolve(false);
    }
    var btn = box && box.querySelector("[data-go]"); if (btn) { btn.disabled = true; btn.textContent = "Opening payment..."; }
    return fetch(WORKER, { method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "checkout", items: a, email: u.email, return_url: opts.return_url || "https://www.techsamjhoraj.com/naukri-saathi/" }) })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (x) {
        if (x.ok && x.d.checkout_url) { try { window.dispatchEvent(new CustomEvent("cart:checkout")); } catch (e) {} openOverlay(x.d.checkout_url); return true; }
        throw new Error(x.d && x.d.error || "failed");
      }).catch(function (e) {
        if (btn) { btn.disabled = false; btn.textContent = "Checkout"; }
        msg(String(e.message) === "limit" ? "Too many tries. Please wait a little and try again." : "Payment could not be opened right now. Please try again in a minute.");
        return false;
      });
  }

  window.Cart = { review: review, buy: function (id) { if (!add(id)) return false; review(); return true; }, add: add, remove: remove, items: items, count: function () { return items().length; }, clear: clear, open: open, close: close, checkout: checkout, total: total, info: info, products: PRODUCTS };
  document.addEventListener("DOMContentLoaded", function () { badge(); });
  window.addEventListener("storage", function (e) { if (e.key === KEY) fire(); });
  badge();
})();
