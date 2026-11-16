/* Udemy-style lesson player (17 Nov 2026): dark title bar, video (mp4 or YouTube), tabs (Notes, Code, Practice, Ask Botu), course content list with ticks. Reuses the lesson data and the existing Run / Mark-complete handlers. */
(function(){
if (typeof lessonView !== "function") return;
function yt(url){
 if (!url) return null; let m;
 if ((m = url.match(/youtu\.be\/([\w-]{6,})/)) || (m = url.match(/[?&]v=([\w-]{6,})/)) || (m = url.match(/shorts\/([\w-]{6,})/))) return { id: m[1], short: /shorts\//.test(url) };
 return null;
}
function player(c, l){
 const L = live(c), i = L.indexOf(l), prev = L[i - 1], next = L[i + 1], y = yt(l.yt);
 const video = l.video ? `<video controls playsinline preload="metadata" poster="${l.video.replace(".mp4", ".jpg")}" src="${l.video}"></video>`
  : y ? `<iframe src="https://www.youtube-nocookie.com/embed/${y.id}?rel=0" title="${esc(l.title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" allowfullscreen></iframe>`
  : `<div class="placeholder"><div><b>${l.videoSoon || "Video coming soon"}</b>Until then, read the notes and run the code.</div></div>`;
 const side = c.modules.map(m => `<details class="pl-mod" ${m.lessons.includes(l) || m === c.modules[0] ? "open" : ""}><summary>${m.title}<span>${m.lessons.filter(x => !x.locked).length}/${m.lessons.length}</span></summary><ul>${m.lessons.map((x, k) => x.locked
  ? `<li class="lock"><span class="pl-tick lock"></span><div><b>${x.title}</b><small>Soon</small></div></li>`
  : `<li${x === l ? ' class="cur"' : ""}><a href="#${x.id}"><span class="pl-tick ${done.has(x.id) ? "done" : ""}"></span><div><b>${x.title}</b><small>${x.yt && !x.video ? "▶ YouTube" : x.video ? "▶ Video" : "Notes + code"}</small></div></a></li>`).join("")}</ul></details>`).join("");
 const code = l.code ? `<section class="codebox"${RUNNABLE.includes(c.id) ? ` data-run data-id="${l.id}" data-code="${encodeURIComponent(l.code)}"` : ""}><div class="file"><span>chai.py</span><button class="copy" type="button">Copy</button></div><pre><code>${hl(l.code)}</code></pre>${RUNNABLE.includes(c.id) ? runParts(l.code, false, l.id) : ""}${l.output ? `<div class="out"><div class="file"><span>Output</span></div><pre>${esc(l.output)}</pre></div>` : ""}</section>` : `<p class="pl-empty">No code in this lesson. Read the notes and try the practice tab.</p>`;
 return `<div class="pl"><header class="pl-bar"><a class="pl-back" href="#classroom" aria-label="Back to all courses">←</a><div><small>${esc(c.title)}</small><b>Lesson ${i + 1}: ${esc(l.title)}</b></div><div class="pl-prog"><span>${pct(c)}% done</span><div class="prog"><i style="width:${pct(c)}%"></i></div></div></header>
 <div class="pl-grid"><main class="pl-main"><div class="pl-video ${y && y.short ? "short" : ""}">${video}</div>
  ${l.yt && !l.video ? "" : (l.yt ? `<p class="pl-yt">▶ <a href="${l.yt}" target="_blank" rel="noopener">Watch this episode on YouTube</a></p>` : "")}
  <div class="pl-tabs" role="tablist"><button role="tab" data-pt="notes" aria-selected="true">Notes</button><button role="tab" data-pt="code" aria-selected="false">Code</button><button role="tab" data-pt="practice" aria-selected="false">Practice</button><button role="tab" data-pt="ask" aria-selected="false">Ask Botu</button></div>
  <section class="pl-pane" data-pane="notes"><h2>${l.title}</h2><div class="block"><h3>The idea</h3>${l.concept.map(p => `<p>${p}</p>`).join("")}${l.list ? `<ul>${l.list.map(x => `<li>${x}</li>`).join("")}</ul>` : ""}</div>${l.takeaway ? `<div class="block takeaway"><h3>Remember</h3><p>${l.takeaway}</p></div>` : ""}${l.code ? `<p class="pl-hint">Want to run the code from this lesson? Open the <button type="button" class="pl-link" data-goto="code">Code tab</button>.</p>` : ""}</section>
  <section class="pl-pane" data-pane="code" hidden>${code}</section>
  <section class="pl-pane" data-pane="practice" hidden><div class="block try"><h3>Try it yourself</h3><ul>${(l.practice || []).map(p => `<li>${p}</li>`).join("")}</ul></div><p class="pl-hint">Tip: change the code in the Code tab and press Run to test each idea.</p></section>
  <section class="pl-pane" data-pane="ask" hidden><div class="block"><h3>Ask Botu about this lesson</h3><p>Stuck on "${esc(l.title)}"? Ask Botu, the automated helper, or join the channel to ask Raj.</p><p><button class="btn primary" type="button" data-askbotu>Open Ask Botu</button> <a class="btn" href="https://whatsapp.com/channel/0029VbDWZ7lEawdpgGPw5t0y" target="_blank" rel="noopener">WhatsApp channel</a></p></div></section>
  <div class="lesson-actions"><button class="btn ${done.has(l.id) ? "done" : "primary"}" type="button" id="mark" data-id="${l.id}">${done.has(l.id) ? "✓ Completed" : "Mark as complete"}</button><div class="navbtns"><a class="btn" href="${prev ? "#" + prev.id : "#classroom"}" ${prev ? "" : 'aria-disabled="true"'}>← Previous</a><a class="btn" href="${next ? "#" + next.id : "#upcoming"}">${next ? "Next →" : "What's next →"}</a></div></div></main>
 <aside class="pl-side"><h3>Course content</h3>${side}</aside></div></div>`;
}
window.lessonView = player;
document.addEventListener("click", e => {
 const t = e.target.closest("[data-pt],[data-goto]"); if (t) { const k = t.dataset.pt || t.dataset.goto, root = t.closest(".pl"); if (!root) return;
  root.querySelectorAll(".pl-tabs button").forEach(b => b.setAttribute("aria-selected", b.dataset.pt === k)); root.querySelectorAll(".pl-pane").forEach(p => p.hidden = p.dataset.pane !== k); }
 if (e.target.closest("[data-askbotu]")) { const f = document.querySelector(".cb-fab"); if (f) f.click(); }
});
try { const h = (location.hash || "").slice(1); if (h && typeof find === "function" && find(h)[0]) window.dispatchEvent(new HashChangeEvent("hashchange")); } catch (e) {}
})();
