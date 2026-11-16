/* Dimaag Dada page (16 Nov 2026): cream + deep purple hero and tiles from Raj's mockup, then the existing book, preview and jigsaw content. */
(function(){
 const TILES = [
  ["DD2","Logic puzzles","Clues, shapes and aha! moments","puzzles/","#ffcd44"],
  ["DD3","Maths adventures","Snakes, ladders and sums","puzzles/snakes-sums.html","#ff8a5c"],
  ["DD4","Jigsaws","Free online jigsaw, 3 levels","#jigsaw","#7dd3a8"],
  ["DD5","Comics & stories","Dada's tales in pictures","puzzles/comics.html","#c9a7ff"],
  ["DD6","Ludo","Classic family game","puzzles/ludo.html","#ffb3c7"],
  ["DD7","Chess","Learn and play","puzzles/chess.html","#a7d3ff"]];
 const CHIPS = [["Logic puzzles","Clues, shapes and aha! moments. Try today's puzzle.","puzzles/"],["Maths adventures","Snakes, ladders and sums, made fun.","puzzles/snakes-sums.html"],["Jigsaws","A free online jigsaw with 3 levels.","#jigsaw"],["Comics & stories","Dada's tales told in pictures.","puzzles/comics.html"],["Chess","Learn and play chess with Dada.","puzzles/chess.html"]];
 const hero = () => `<div class="rd-dada-top">
  <nav class="rd-crumb" aria-label="Breadcrumb"><a href="#classroom">Home</a> <span>/</span> <b>Dimaag Dada</b></nav>
  <section class="rd-dh">
   <div class="rd-dh-t"><div class="rd-dk">Dimaag Dada</div>
    <h1>A new mystery for <em>every curious mind.</em></h1>
    <p>Logic puzzles, maths adventures and stories with Dimaag Dada, Anna and Chiklu. Free to play in your browser.</p>
    <div class="rd-dh-b"><a class="rd-dbtn" href="puzzles/">Try today's puzzle →</a><a class="rd-dbtn ghost" href="#jigsaw">Play the jigsaw</a></div>
    <ul class="rd-dh-s"><li><b>6</b> free games</li><li><b>1</b> exam puzzle every day</li><li><b>192</b> puzzles in the book</li></ul></div>
   <div class="rd-dh-i"><div class="rd-dchips" aria-label="Dada's adventures: hover a word">${CHIPS.map(([t,d,l],i)=>`<a class="rd-dchip dc${i+1}" href="${l}"><span>${t}</span><div class="rd-dtip"><b>${t}</b><p>${d}</p></div></a>`).join("")}</div><img src="img/rd/dada/hero.webp" alt="Dimaag Dada, Anna and Chiklu, all in round black glasses" width="1005" height="698"><div class="rd-dcap">“Pehle socho, phir bolo!”</div></div>
  </section>
  <section class="rd-dt"><h2>Pick your adventure</h2><div class="rd-dtg">${TILES.map(([e,t,d,l,c])=>`<a class="rd-dtile" href="${l}" style="--c:${c}"><span class="rd-de"><img src="img/rd/dada/${e}.webp" alt="" width="84" height="84" loading="lazy"></span><b>${t}</b><small>${d}</small></a>`).join("")}</div></section>
  <div class="rd-dsep"><span>For exam preparation: Reasoning Samjho</span></div></div>`;
 function wrap(){
  const old = window.__puzzlesOld;
  return `<div class="rd-dada">${hero()}<div class="rd-dada-old">${old().split("img/dada-badge-128.png").join("img/rd/dada/DD1.webp")}</div></div>`;
 }
 if (typeof puzzlesPage === "function" && !window.__puzzlesOld){
  window.__puzzlesOld = puzzlesPage;
  window.puzzlesPage = function(){ return wrap(); };
 }
 document.addEventListener("click", e => { const b = e.target.closest("#install"); if (b && b.dataset.dada === "1") { e.preventDefault(); e.stopImmediatePropagation(); location.href = "puzzles/"; } }, true);
 let wasDada = false;
 function dsoc(){
  const html = DADA_SOCIAL.map(x => `<a class="ico" href="${x.url}" target="_blank" rel="noopener" aria-label="${x.name}" title="${x.name}" style="--sb:${x.color}"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[x.icon]}</svg></a>`).join("");
  document.querySelectorAll("[data-dsocial], footer .social").forEach(e => e.innerHTML = html);
 }
 const mark = () => {
  const on = location.hash === "#puzzles" || location.hash === "#jigsaw";
  document.body.classList.toggle("rd-dadapage", on);
  const SEL = ".brand img,.install img,#installBtn img,button img[src*='badge'],button img[src*='botu']";
  document.querySelectorAll(SEL).forEach(i => { i.src = on ? "img/rd/dada/DD1.webp" : "img/rd/botu.png"; });
  // brand wordmark + footer blurb + install button follow the Dada page
  document.querySelectorAll(".brand .wm").forEach(w => { if (!w.dataset.o) w.dataset.o = w.innerHTML; w.innerHTML = on ? '<span class="t">Dimaag</span> Dada' : w.dataset.o; });
  const blurb = document.querySelector("footer .fabout p"); if (blurb) { if (!blurb.dataset.o) blurb.dataset.o = blurb.textContent; blurb.textContent = on ? "Free puzzles, jigsaws, comics and games with Dimaag Dada, Anna and Chiklu, plus the Reasoning Samjho exam book." : blurb.dataset.o; }
  const ib = document.getElementById("install"); if (ib) {
   const tn = [...ib.childNodes].reverse().find(n => n.nodeType === 3 && n.textContent.trim());
   if (tn) { if (!ib.dataset.o) ib.dataset.o = tn.textContent; tn.textContent = on ? " Dada" : ib.dataset.o; }
   ib.hidden = false; ib.dataset.dada = on ? "1" : "";
  }
  if (on) { dsoc(); wasDada = true; }
  else if (wasDada) { wasDada = false; try { fillSocial(); } catch (e) {} }
 };
 window.addEventListener("hashchange", () => { setTimeout(mark, 40); setTimeout(mark, 400); }); mark(); setTimeout(mark, 500);
 if (location.hash === "#puzzles") window.dispatchEvent(new HashChangeEvent("hashchange"));
})();
