/* Login + My learning (17 Nov 2026). Works now with a profile saved in this browser; ready to be backed by real accounts later. */
(function(){
const K_USER = "rd-user", K_SAVED = "rd-saved";
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const get = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
const set = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
const user = () => { const u = get(K_USER, null); if (u && !u.name) u.name = String(u.email || "").split("@")[0] || "friend"; return u; };   // a stored user with an email but no name must not crash the page
const saved = () => get(K_SAVED, []);
const initials = n => (n || "?").trim().split(/\s+/).slice(0, 2).map(w => w[0]).join("").toUpperCase();

/* ---- login dialog ---- */
function dlg(){
 let d = document.getElementById("rd-login"); if (d) return d;
 d = document.createElement("dialog"); d.id = "rd-login"; d.className = "rd-dlg";
 d.innerHTML = `<form method="dialog" class="rd-lf"><button class="rd-x" value="x" aria-label="Close">×</button><h2 id="rd-lt">Log in to continue your learning</h2>
  <p class="rd-ls">Save your progress and your saved skills in this browser. Nothing is sent to a server.</p>
  <label>Your name<input id="rd-ln" required maxlength="40" autocomplete="name" placeholder="Your name"></label>
  <label>Email <small>(optional, only shown in your menu)</small><input id="rd-le" type="email" maxlength="80" autocomplete="email" placeholder="you@example.com"></label>
  <fieldset class="rd-fs"><legend>What do you want to learn? <small>(we pick skills for you)</small></legend><div class="rd-ints"><label><input type="checkbox" name="int" value="ai"><span>AI & ML</span></label><label><input type="checkbox" name="int" value="data"><span>Data & cloud</span></label><label><input type="checkbox" name="int" value="code"><span>Code</span></label><label><input type="checkbox" name="int" value="tools"><span>Dev tools</span></label></div></fieldset><label>I am a <select id="rd-lg"><option value="student">Student</option><option value="pro">Working professional</option><option value="switch">Career switcher</option><option value="curious">Just curious</option></select></label><button class="btn primary rd-go" type="submit" value="ok" id="rd-lb">Continue</button></form>`;
 document.body.appendChild(d);
 d.addEventListener("close", () => {
  if (d.returnValue !== "ok") return;
  const n = d.querySelector("#rd-ln").value.trim(); if (!n) return;
  set(K_USER, { name: n, email: d.querySelector("#rd-le").value.trim(), ints: [...d.querySelectorAll("input[name=int]:checked")].map(x => x.value), goal: d.querySelector("#rd-lg").value });
  d.returnValue = ""; render(); if (location.hash === "#my-learning") route();
 });
 return d;
}
function open(mode){
 const d = dlg(), u = user();
 d.querySelector("#rd-lt").textContent = u ? "Account settings" : mode === "signup" ? "Sign up and start learning" : "Log in to continue your learning";
 d.querySelector("#rd-lb").textContent = u ? "Save" : "Continue";
 d.querySelector("#rd-ln").value = u ? u.name : ""; d.querySelector("#rd-le").value = u ? u.email : "";
 d.querySelectorAll("input[name=int]").forEach(x => x.checked = !!(u && u.ints && u.ints.includes(x.value))); d.querySelector("#rd-lg").value = (u && u.goal) || "student";
 d.returnValue = ""; d.showModal(); d.querySelector("#rd-ln").focus();
}


/* ---- login page (Udemy-style, two steps: email, then a 6-digit code) ---- */
/* Real email codes need an account service. Create a free Supabase project (Authentication > Email, enable "Email OTP"),
   then put its URL and public anon key here. Empty = local profile mode (name and email saved in this browser only). */
const AUTH = { supabaseUrl: "https://vnktvgiordacnyxbwaae.supabase.co", anonKey: "sb_publishable_e4fMGkoBfVsvvWudF9JTsQ_iWj-l8iT" };
const live = () => !!(AUTH.supabaseUrl && AUTH.anonKey);
async function sb(path, body){
 const r = await fetch(AUTH.supabaseUrl + "/auth/v1/" + path, { method: "POST", headers: { "Content-Type": "application/json", apikey: AUTH.anonKey }, body: JSON.stringify(body) });
 const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.msg || j.error_description || "Something went wrong. Please try again."); return j;
}
function finish(profile){ set(K_USER, Object.assign({}, user() || {}, profile)); render(); let back = ""; try { back = sessionStorage.getItem("rd-return") || ""; sessionStorage.removeItem("rd-return"); } catch (e) {} if (back === "/naukri-saathi/") { location.href = back; return; } location.hash = "#my-learning"; }
function loginPage(app, mode){
 const u = user(), signup = mode === "signup";
 const ints = '<fieldset class="rd-fs"><legend>What do you want to learn?</legend><div class="rd-ints"><label><input type="checkbox" name="int" value="ai"><span>AI & ML</span></label><label><input type="checkbox" name="int" value="data"><span>Data & cloud</span></label><label><input type="checkbox" name="int" value="code"><span>Code</span></label><label><input type="checkbox" name="int" value="tools"><span>Dev tools</span></label></div></fieldset><label>I am a <select id="lg-goal"><option value="student">Student</option><option value="pro">Working professional</option><option value="switch">Career switcher</option><option value="curious">Just curious</option></select></label>';
 const art = '<div class="lg-art"><div class="lg-ring"><img src="img/rd/botu.png" alt="Botu" width="300" height="475"><span class="ud-chip c1">Python</span><span class="ud-chip c2">AI agents</span><span class="ud-chip c3">SQL</span><span class="ud-chip c5">Git</span></div></div>';
 function step1(){
  const who = u && !signup ? `<span class="rd-av big">${esc(initials(u.name))}</span><h3>Welcome back, ${esc(u.name.split(" ")[0])}</h3>` : "";
  app.querySelector(".lg-form").innerHTML = `<h1>${signup ? "Sign up and start learning" : "Log in to continue your learning journey"}</h1>${who}
   <form id="lg-f"><label>${signup ? "Your name" : ""}${signup ? '<input id="lg-n" required maxlength="40" autocomplete="name" placeholder="Your name">' : ""}</label>
   <label>Email<input id="lg-e" type="email" required maxlength="80" autocomplete="email" placeholder="you@example.com" value="${esc(u && u.email || "")}"></label>
   ${signup || !u ? ints : ""}<button class="lg-btn" type="submit">Continue</button><p class="lg-note">${live() ? "We'll email you a 6-digit code for a secure, passwordless log-in. No password to remember." : "Your profile and progress are saved in this browser. No password needed."}</p><p class="lg-alt">${signup ? 'Already have an account? <a href="#login">Log in</a>' : 'New here? <a href="#signup">Sign up</a>'}</p><p class="lg-err" id="lg-err" role="alert"></p></form>`;
  app.querySelector("#lg-f").addEventListener("submit", async e => {
   e.preventDefault(); const email = app.querySelector("#lg-e").value.trim(), n = (app.querySelector("#lg-n") || {}).value || (u && u.name) || email.split("@")[0];
   const prof = { name: n, email, ints: [...app.querySelectorAll("input[name=int]:checked")].map(x => x.value), goal: (app.querySelector("#lg-goal") || {}).value || (u && u.goal) || "student" };
   if (!live()) { finish(prof); return; }
   const btn = app.querySelector(".lg-btn"); btn.disabled = true; btn.textContent = "Sending code…";
   try { await sb("otp", { email, create_user: true }); step2(prof); } catch (x) { btn.disabled = false; btn.textContent = "Continue"; app.querySelector("#lg-err").textContent = x.message; }
  });
 }
 function step2(prof){
  app.querySelector(".lg-form").innerHTML = `<h1>Check your inbox</h1><p class="lg-sent">Enter the 6-digit code we sent to <b>${esc(prof.email)}</b> to finish your login.</p><form id="lg-c"><label><input id="lg-code" inputmode="numeric" pattern="[0-9]{6,8}" maxlength="8" required placeholder="6-digit code" autocomplete="one-time-code"></label><button class="lg-btn" type="submit">Log in</button></form><p class="lg-alt">Didn't receive the code? <button type="button" class="lg-link" id="lg-re" disabled>Resend code in <span id="lg-t">30</span></button></p><p class="lg-err" id="lg-err" role="alert"></p>`;
  let t = 30; const tm = setInterval(() => { t--; const s = app.querySelector("#lg-t"), b = app.querySelector("#lg-re"); if (!s) return clearInterval(tm); s.textContent = t; if (t <= 0) { clearInterval(tm); b.disabled = false; b.textContent = "Resend code"; } }, 1000);
  app.querySelector("#lg-re").addEventListener("click", async () => { try { await sb("otp", { email: prof.email, create_user: true }); app.querySelector("#lg-err").textContent = "A new code is on its way."; } catch (x) { app.querySelector("#lg-err").textContent = x.message; } });
  app.querySelector("#lg-c").addEventListener("submit", async e => {
   e.preventDefault(); const btn = app.querySelector(".lg-btn"); btn.disabled = true;
   try { const j = await sb("verify", { type: "email", email: prof.email, token: app.querySelector("#lg-code").value.trim() }); set("rd-session", { at: j.access_token, exp: j.expires_at }); finish(prof); }
   catch (x) { btn.disabled = false; app.querySelector("#lg-err").textContent = x.message || "That code did not work."; }
  });
 }
 app.innerHTML = `<div class="lg">${art}<div class="lg-form"></div></div>`; step1(); window.scrollTo(0, 0);
 document.title = (signup ? "Sign up" : "Log in") + " · Tech Samjho Raj";
}

/* ---- header ---- */
function render(){
 const bar = document.querySelector("header .bar-right"); if (!bar) return;
 let a = document.getElementById("rd-acct");
 if (!a) { a = document.createElement("div"); a.id = "rd-acct"; bar.appendChild(a); }
 const u = user(), sig = JSON.stringify([u, saved().length]);
 if (a.dataset.sig === sig) return; a.dataset.sig = sig;
 a.innerHTML = u
  ? `<button class="rd-av" type="button" aria-haspopup="true" aria-expanded="false" aria-label="Account menu">${esc(initials(u.name))}</button><div class="rd-am" role="menu"><div class="rd-ah"><span class="rd-av big">${esc(initials(u.name))}</span><div><b>${esc(u.name)}</b><small>${esc(u.email || "Learner")}</small></div></div><a href="#my-learning" role="menuitem">My learning</a><a href="#my-learning" data-ml="saved" role="menuitem">Wishlist (${saved().length})</a><a href="#tools" role="menuitem">Practice tools</a><hr><button type="button" data-act="settings" role="menuitem">Account settings</button><button type="button" data-act="out" role="menuitem">Log out</button></div>`
  : `<button class="rd-lg" type="button" data-act="login">Log in</button><button class="rd-su" type="button" data-act="signup">Sign up</button>`;
 document.querySelectorAll(".rd-save-n").forEach(e => e.textContent = saved().length);
}
document.addEventListener("click", e => {
 const act = e.target.closest("[data-act]");
 if (act) { const k = act.dataset.act; if (k === "login" || k === "signup") { location.hash = "#" + k; } if (k === "settings") open(); if (k === "out") { try { localStorage.removeItem(K_USER); } catch (x) {} render(); if (location.hash === "#my-learning") route(); } }
 const av = e.target.closest(".rd-av:not(.big)"); const m = document.querySelector(".rd-am");
 if (av && m) { const o = m.classList.toggle("open"); av.setAttribute("aria-expanded", o); e.stopPropagation(); return; }
 if (m && !e.target.closest(".rd-am")) m.classList.remove("open");
 if (e.target.closest(".rd-am a")) m && m.classList.remove("open");
 const h = e.target.closest(".ud-heart");
 if (h) { e.preventDefault(); e.stopPropagation(); const id = h.dataset.save, s = saved(), i = s.indexOf(id); i < 0 ? s.push(id) : s.splice(i, 1); set(K_SAVED, s); h.classList.toggle("on", i < 0); h.textContent = i < 0 ? "♥" : "♡"; render(); }
}, true);


/* ---- personalised picks ---- */
function picks(n){
 const L = window.RDLEARN; if (!L) return []; const u = user() || {}, s = saved(), ints = u.ints && u.ints.length ? u.ints : null;
 const score = id => { let p = 0; if (ints && ints.includes(L.CATOF[id])) p += 3; if (u.goal === "student" && ["dsa", "java", "sql", "git"].includes(id)) p += 2; if (u.goal === "pro" && ["system", "azure", "docker", "mcp", "llm"].includes(id)) p += 2; if (u.goal === "switch" && ["sql", "javascript", "git", "api", "ml"].includes(id)) p += 2; if (u.goal === "curious" && ["mcp", "llm", "rag", "aisec"].includes(id)) p += 2; if (s.includes(id)) p -= 5; return p; };
 return L.ORDER.slice().sort((x, y) => score(y) - score(x)).slice(0, n);
}
function picksHtml(n, title, sub){
 const L = window.RDLEARN; if (!L) return "";
 return `<section class="ud-sec2 ud-rec"><h2>${title}</h2><p class="ud-secsub">${sub}</p><div class="ud-skgrid">${picks(n).map(id => `<a class="ud-sk" href="#learn-${id}"><div class="ud-skimg"><img src="img/rd/topics/${L.T[id].img}.webp" alt="" width="96" height="96"></div><div class="ud-skb"><h3>${esc(L.T[id].t)}</h3><p>${esc(L.T[id].tag)}</p><div class="ud-skm"><span class="ud-free">Free</span><span>${esc(L.T[id].level)}</span></div></div></a>`).join("")}</div></section>`;
}

/* ---- My learning page ---- */
function courseCards(){
 let out = "";
 try {
  COURSES.forEach(c => {
   const ls = live(c), n = ls.filter(l => done.has(l.id)).length, pct = ls.length ? Math.round(100 * n / ls.length) : 0, nxt = ls.find(l => !done.has(l.id)) || ls[0];
   out += `<a class="ml-c" href="#${nxt ? nxt.id : ""}"><div class="ml-t"><h3>${esc(c.title)}</h3><p>${n} of ${ls.length} lessons done</p><div class="ml-bar"><i style="width:${pct}%"></i></div></div><span class="ml-b">${pct === 100 ? "Completed" : n ? "Continue" : "Start"}</span></a>`;
  });
 } catch (e) {}
 return out || "<p>No courses yet.</p>";
}
function savedCards(){
 const T = window.RDLEARN && RDLEARN.T, s = saved().filter(id => T && T[id]);
 if (!s.length) return "<p class='ml-empty'>No saved skills yet. Tap the ♡ on any skill card to save it here.</p>";
 return `<div class="ud-skgrid">${s.map(id => `<a class="ud-sk" href="#learn-${id}"><div class="ud-skimg"><img src="img/rd/topics/${T[id].img}.webp" alt="" width="96" height="96"></div><div class="ud-skb"><h3>${esc(T[id].t)}</h3><p>${esc(T[id].tag)}</p></div></a>`).join("")}</div>`;
}
function completedCards(){
 let out = ""; try { COURSES.forEach(c => { const ls = live(c); if (ls.length && ls.every(l => done.has(l.id))) out += `<a class="ml-c" href="#${ls[0].id}"><div class="ml-t"><h3>${esc(c.title)}</h3><p>All ${ls.length} lessons done</p><div class="ml-bar"><i style="width:100%"></i></div></div><span class="ml-b">Completed</span></a>`; }); } catch (e) {}
 return out || "<p class='ml-empty'>Finish every lesson in a course to see it here.</p>";
}
function toolsTab(){
 const T = [["T08", "JavaScript", "js"], ["T05", "SQL", "sql"], ["T14", "API tester", "api"], ["T13", "Git practice", "git"], ["T15", "Docker", "docker"], ["T18", "Linux shell", "linux"], ["T12", "Fit a line (ML)", "ml"], ["T09", "RAG demo", "rag"]];
 return `<div class="ud-row ud-toolrow ml-tools">${T.map(([i, n, k]) => `<a class="ud-tc" href="#tools" data-tool="${k}"><img src="img/rd/topics/${i}.webp" alt="" width="84" height="84"><b>${n}</b><span>Open tool →</span></a>`).join("")}</div>`;
}
const TABS = [["all", "All courses"], ["saved", "Wishlist"], ["done", "Completed"], ["tools", "Learning tools"]];
function page(app, tab){
 const u = user();
 if (!u) { app.innerHTML = `<div class="ml"><section class="ml-band"><h1>My learning</h1></section><div class="ml-body"><div class="ud-box"><h2>Log in to see your learning</h2><p>Your progress and saved skills are kept for you, and we pick skills that fit your goals.</p><button class="btn primary" type="button" data-act="login">Log in</button></div></div></div>`; return; }
 tab = tab || "all";
 const body = tab === "saved" ? savedCards() : tab === "done" ? `<div class="ml-list">${completedCards()}</div>` : tab === "tools" ? toolsTab() : `<div class="ml-list">${courseCards()}</div>${picksHtml(6, "Recommended for you", "Picked from what you told us you want to learn")}`;
 app.innerHTML = `<div class="ml"><section class="ml-band"><div class="ml-bi"><span class="rd-av big">${esc(initials(u.name))}</span><div><h1>My learning</h1><p>Welcome back, ${esc(u.name.split(" ")[0])}</p></div></div><nav class="ml-tabs">${TABS.map(([k, t]) => `<button data-mt="${k}" aria-selected="${tab === k}">${t}${k === "saved" ? ` <span class="rd-save-n">${saved().length}</span>` : ""}</button>`).join("")}</nav></section><div class="ml-body">${body}</div></div>`;
 app.querySelectorAll("[data-mt]").forEach(b => b.addEventListener("click", () => page(app, b.dataset.mt)));
 app.querySelectorAll("[data-tool]").forEach(x => x.addEventListener("click", () => { window.__rtPick = x.dataset.tool; }));
 window.scrollTo(0, 0); document.title = "My learning · Tech Samjho Raj";
}
function route(){ const app = document.getElementById("app"); if (app && location.hash === "#my-learning") page(app); }

/* ---- welcome strip on the home page ---- */
function welcome(){
 const u = user(), hero = document.querySelector(".rdh .ud-hero"); if (!hero) return;
 let w = document.getElementById("ud-welcome");
 if (!u) { if (w) w.remove(); const rw = document.getElementById("ud-recwrap"); if (rw) rw.remove(); return; }
 if (w) return;
 const nm = u.name || String(u.email || "").split("@")[0] || "friend";
 let last = null; try { const id = localStorage.getItem(typeof LAST !== "undefined" ? LAST : "swr-last"); COURSES.forEach(c => live(c).forEach(l => { if (l.id === id) last = { c, l }; })); } catch (e) {}
 w = document.createElement("section"); w.id = "ud-welcome"; w.className = "ud-welcome";
 w.innerHTML = `<span class="rd-av big">${esc(initials(nm))}</span><div><h2>Welcome back, ${esc(nm.split(" ")[0])}</h2><p>${last ? `Pick up where you left off: <a href="#${last.l.id}">${esc(last.l.title)}</a>` : "Pick a skill below and start learning."} · <a href="#my-learning">My learning</a></p></div>`;
 hero.parentNode.insertBefore(w, hero);
 const r = document.createElement("div"); r.id = "ud-recwrap"; r.innerHTML = picksHtml(4, "Recommended for you, " + esc(nm.split(" ")[0]), "Picked from what you want to learn"); hero.parentNode.insertBefore(r, document.querySelector(".rdh .ud-stats") || hero.nextSibling);
}
/* heart buttons on skill cards */
function hearts(){
 const s = saved();
 document.querySelectorAll(".ud-skimg:not([data-h])").forEach(box => {
  box.dataset.h = 1; const id = (box.closest("a").getAttribute("href") || "").replace("#learn-", "");
  const b = document.createElement("button"); b.type = "button"; b.className = "ud-heart" + (s.includes(id) ? " on" : ""); b.dataset.save = id; b.setAttribute("aria-label", "Save this skill"); b.textContent = s.includes(id) ? "♥" : "♡"; box.appendChild(b);
 });
}
new MutationObserver(() => { render(); welcome(); hearts(); }).observe(document.body, { childList: true, subtree: true });
window.addEventListener("hashchange", route);
render(); welcome(); hearts();
document.addEventListener("click", e => { const m = e.target.closest("[data-ml]"); if (m) setTimeout(() => { const app = document.getElementById("app"); if (app) page(app, m.dataset.ml); }, 30); });
window.RDAUTH = { page: (app, t) => page(app, t), login: (app, m) => loginPage(app, m), user };
if (location.hash === "#my-learning") window.dispatchEvent(new HashChangeEvent("hashchange"));
})();
