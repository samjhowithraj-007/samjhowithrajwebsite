/* Tech Samjho Raj: shared cart. Items are ids only (no prices stored). Prices below are display-only and must match the Dodo products;
   the Worker action "checkout" maps ids to Dodo products and Dodo charges its own price. English by default.
   API: Cart.add(id) Cart.remove(id) Cart.items() Cart.count() Cart.clear() Cart.open() Cart.close() Cart.checkout() Cart.total() Cart.info(id)
   Events on window: "cart:change" (detail {items}), "cart:login" (cancelable; fired when checkout needs a login first). */
(function () {
  var WORKER = window.CART_WORKER || "https://naukri-saathi.techsamjhoraj.workers.dev", KEY = "ns-cart";   // CART_WORKER is only set on local test pages
  var PRODUCTS = window.CART_PRODUCTS = window.CART_PRODUCTS || [
    { id: "resume-pack", title: "Naukri Saathi resume pack (3 tailored resumes + cover letters)", price: 49, cover: "" },
    { id: "book", title: "AI Job Search book (English) + 1 resume build", price: 149, cover: "" },
    { id: "bundle", title: "Job-Ready bundle: AI Job Search book + 5 resume builds", price: 249, cover: "" }
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
      ".tsr-cart{position:fixed;inset:0;z-index:99999;display:none}.tsr-cart.on{display:block}.tsr-cart .bg{position:absolute;inset:0;background:rgba(0,0,0,.45)}" +
      ".tsr-cart .pn{position:absolute;right:0;top:0;bottom:0;width:min(400px,100%);background:#fff;color:#111;padding:16px;overflow:auto;font:15px/1.45 system-ui,sans-serif;box-shadow:-4px 0 20px rgba(0,0,0,.25)}" +
      ".tsr-cart h2{margin:0 0 10px;font-size:18px}.tsr-cart .row{display:flex;gap:8px;align-items:flex-start;justify-content:space-between;padding:10px 0;border-bottom:1px solid #e5e7eb}" +
      ".tsr-cart button{font:inherit;cursor:pointer;border-radius:8px;padding:8px 12px;border:1px solid #c7d2fe;background:#fff}.tsr-cart .go{background:#4338ca;color:#fff;border-color:#4338ca;width:100%;margin-top:12px;padding:11px}.tsr-cart .go[disabled]{opacity:.6}" +
      ".tsr-cart .note{font-size:13px;color:#555;margin:8px 0 0}.tsr-cart .x{border:0;background:none;color:#b91c1c;padding:2px 6px}" +
      ":root[data-theme=\"dark\"] .tsr-cart .pn{background:#161a22;color:#e8eaf0}:root[data-theme=\"dark\"] .tsr-cart .row{border-color:#2a3040}:root[data-theme=\"dark\"] .tsr-cart button{background:#1f2430;color:#e8eaf0;border-color:#3b4256}:root[data-theme=\"dark\"] .tsr-cart .go{background:#6366f1;border-color:#6366f1;color:#fff}:root[data-theme=\"dark\"] .tsr-cart .note{color:#aab0c0}:root[data-theme=\"dark\"] .tsr-cart .x{background:none;border:0;color:#f87171}:root[data-theme=\"dark\"] .tsr-cart [data-close]{color:#e8eaf0}";
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
    p.innerHTML = "<button type='button' class='x' data-close style='float:right;color:#111'>Close</button><h2>Your cart</h2>" +
      (a.length ? a.map(function (id) { var i = info(id); return "<div class='row'><div>" + esc(i.title) + "<br><b>Rs " + i.price + "</b></div><button type='button' class='x' data-rm='" + id + "'>Remove</button></div>"; }).join("") +
        "<p><b>Estimated total: Rs " + total() + "</b> <span class='note'>plus tax. The final amount is shown on the secure Dodo Payments page.</span></p>" +
        "<button type='button' class='go' data-go>Checkout</button><p class='note' id='tsrCartMsg'></p>" : "<p>Your cart is empty.</p>");
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
