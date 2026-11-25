/* Tech Samjho Raj: shared cart. Items are ids only (no prices stored). Prices below are display-only and must match the Dodo products;
   the Worker action "checkout" maps ids to Dodo products and Dodo charges its own price. English by default.
   API: Cart.add(id) Cart.remove(id) Cart.items() Cart.count() Cart.clear() Cart.open() Cart.close() Cart.checkout() Cart.total() Cart.info(id)
   Events on window: "cart:change" (detail {items}), "cart:login" (cancelable; fired when checkout needs a login first). */
(function () {
  var WORKER = window.CART_WORKER || "https://naukri-saathi.techsamjhoraj.workers.dev", KEY = "ns-cart";   // CART_WORKER is only set on local test pages
  var PRODUCTS = window.CART_PRODUCTS = window.CART_PRODUCTS || [
    { id: "resume-pack", title: "Naukri Saathi resume pack (3 tailored resumes + cover letters)", price: 49, cover: "/img/botu-192.png" },
    { id: "book", title: "AI Job Search book (English) + 1 resume build", price: 149, cover: "/media/books/aijob-cover.webp" },
    { id: "bundle", title: "Job-Ready bundle: AI Job Search book + 5 resume builds", price: 249, cover: "/media/books/aijob-cover.webp" }
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
  function total() { return items().reduce(function (s, id) { return s + info(id).price; }, 0); }
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
      ".tsr-cart .trust{margin-top:12px;text-align:center;font-size:13px;color:#555b7a}.tsr-cart .empty{padding:40px 20px;text-align:center}" +
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
  function render() {
    if (!box) return; var a = items(), p = box.querySelector(".pn");
    var sv = 0; a.forEach(function (id) { var i = info(id); if (i.was) sv += i.was - i.price; });
    p.innerHTML = "<div class='hd'><h2>Cart</h2>" + (a.length ? "<span class='cnt'>" + a.length + "</span>" : "") + "<button type='button' class='xx' data-close aria-label='Close cart'>&times;</button></div>" +
      (a.length ? "<div class='strip'><b>Instant download</b> after payment &middot; ebooks, nothing is shipped</div><div class='items'>" +
        a.map(function (id) { var i = info(id); return "<div class='row'>" + (i.cover ? "<img src='" + esc(i.cover) + "' alt='' width='64' height='64'>" : "<span></span>") + "<div><div class='tt'>" + esc(i.title) + "</div><button type='button' class='rm' data-rm='" + id + "'>Remove</button></div><div class='pr'>Rs " + i.price + (i.was ? "<s>Rs " + i.was + "</s>" : "") + "</div></div>"; }).join("") + "</div>" +
        "<div class='sum'>" + (sv ? "<div class='ln sv'><span>Savings</span><span>-Rs " + sv + "</span></div>" : "") + "<div class='ln big'><span>Estimated total</span><span>Rs " + total() + "</span></div>" +
        "<p class='note'>Plus tax. Have a coupon? Enter it on the secure Dodo Payments page, where the final amount is shown.</p>" +
        "<button type='button' class='go' data-go>Check out</button><p class='trust'>Secure payment by Dodo Payments</p><p class='note' id='tsrCartMsg' aria-live='polite'></p></div>"
        : "<div class='empty'><p>Your cart is empty.</p></div>");
    p.onclick = function (e) {
      var t = e.target; if (t.hasAttribute("data-close")) close(); var r = t.getAttribute("data-rm"); if (r) remove(r); if (t.hasAttribute("data-go")) checkout();
    };
  }
  function badge() { var n = items().length; [].forEach.call(document.querySelectorAll("[data-cart-count]"), function (el) { el.textContent = n ? String(n) : ""; el.setAttribute("data-n", String(n)); if (!/tsr-cart-badge/.test(el.className)) el.className += " tsr-cart-badge"; }); }
  var last; function open() { ensure(); render(); last = document.activeElement; box.classList.add("on"); var f = box.querySelector("[data-close]"); if (f) f.focus(); }
  function close() { if (box) box.classList.remove("on"); try { if (last && last.focus) last.focus(); } catch (e) {} }
  function msg(t) { var m = document.getElementById("tsrCartMsg"); if (m) m.textContent = t; }

  function checkout(opts) {
    opts = opts || {}; var a = items(); if (!a.length) { msg("Your cart is empty."); return Promise.resolve(false); }
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
        if (x.ok && x.d.checkout_url) { try { window.dispatchEvent(new CustomEvent("cart:checkout")); } catch (e) {} location.href = x.d.checkout_url; return true; }
        throw new Error(x.d && x.d.error || "failed");
      }).catch(function (e) {
        if (btn) { btn.disabled = false; btn.textContent = "Checkout"; }
        msg(String(e.message) === "limit" ? "Too many tries. Please wait a little and try again." : "Payment could not be opened right now. Please try again in a minute.");
        return false;
      });
  }

  window.Cart = { add: add, remove: remove, items: items, count: function () { return items().length; }, clear: clear, open: open, close: close, checkout: checkout, total: total, info: info, products: PRODUCTS };
  document.addEventListener("DOMContentLoaded", function () { badge(); });
  window.addEventListener("storage", function (e) { if (e.key === KEY) fire(); });
  badge();
})();
