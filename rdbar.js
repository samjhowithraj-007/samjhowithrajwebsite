(function(){
 function sw(){document.querySelectorAll(".brand img,.install img,#installBtn img,button img[src*='badge']").forEach(function(i){if(/badge|icon-/.test(i.getAttribute("src")||""))i.src="img/rd/botu.png"});}
 var items=[["#classroom","🏠","Home"],["#python-1","📚","Learn"],["#tools","🛠️","Tools"],["#shop","📖","Books"],["#community","👥","Community"]];
 var bar=document.createElement("nav");bar.id="rdbar";
 bar.innerHTML=items.map(function(x){return '<a href="'+x[0]+'" data-h="'+x[0]+'"><b>'+x[1]+'</b>'+x[2]+'</a>'}).join("");
 document.body.appendChild(bar);
 function on(){var h=location.hash||"#classroom";bar.querySelectorAll("a").forEach(function(a){a.classList.toggle("on",a.dataset.h===h||(h==="#classroom"&&a.dataset.h==="#classroom")||(h.indexOf("#python")===0&&a.dataset.h==="#python-1"))});sw();}
 window.addEventListener("hashchange",function(){setTimeout(on,50)});setTimeout(on,300);
 new MutationObserver(sw).observe(document.body,{childList:true,subtree:true});
})();
(function(){
 function fill(){try{if(typeof fillSocial==="function"&&document.querySelector(".rdh [data-social]:empty"))fillSocial();}catch(e){}
  var r=document.querySelector("header .bar-right");
  if(r&&!document.getElementById("rdlang")){var d=document.createElement("div");d.id="rdlang";d.className="rd-lang";d.innerHTML='<a class="on" href="./">English</a><span class="off" aria-disabled="true" title="Coming back soon">Hinglish</span><span class="off" aria-disabled="true" title="Coming back soon">हिंदी</span>';r.insertBefore(d,r.firstChild.nextSibling||null);}}
 new MutationObserver(fill).observe(document.body,{childList:true,subtree:true});setTimeout(fill,400);
})();

/* 16 Nov: top nav = icons + merged tabs (Home, Learn, Tools, Books, Dada, Community) */
(function(){
 var G=[
  {i:"🏠",t:"Home",h:"#classroom",k:"classroom"},
  {i:"📚",t:"Learn",menu:[["Python with Chai","#python-1","python"],["AI + Python chatbot","#chatbot-1","chatbot"],["Agentic AI with Botu","#agentic-1","agentic"],["Code art with Raj","#codeart-1","codeart"],["Upcoming lessons","#upcoming","upcoming"]]},
  {i:"📰",t:"News",h:"#news",k:"news"},
  {i:"🛠️",t:"Tools",tools:1,menu:[["Python playground","#playground","playground","T01"],["JavaScript","#tools","js","T08"],["SQL","#tools","sql","T05"],["API tester","#tools","api","T14"],["DSA visualiser","#tools","dsa","T04"],["Vector search","#tools","vec","T06"],["Git practice","#tools","git","T13"],["Java","#tools","java","T07"],["Linux shell","#tools","linux","T18"],["Docker","#tools","docker","T15"],["Azure","#tools","azure","T10"],["Databricks","#tools","dbx","T11"],["Machine learning","#tools","ml","T12"],["RAG & LLM apps","#tools","rag","T09"],["System design","#tools","sys","T16"],["Cyber security","#tools","sec","T17"],["MCP tool calls","#tools","mcp","T14"],["LLM prompt workbench","#tools","llm","T19"],["Naukri Saathi (job helper)","/naukri-saathi/","naukri","T19"]]},
  {i:"📖",t:"Books",h:"#shop",k:"shop",badge:"New"},
  {i:"💼",t:"Naukri Saathi",h:"/naukri-saathi/",k:"naukri",badge:"New"},
  {i:"👥",t:"Community",menu:[["Community","#community","community"],["Workshops","#workshops","workshops"],["Live cohort waitlist","#cohort","cohort"]]},
  {i:"👤",t:"About",h:"#about",k:"about"}];
 function build(){
  var nav=document.querySelector("header .tabs"); if(!nav||nav.dataset.rd)return; nav.dataset.rd=1;
  nav.innerHTML=G.map(function(g){
   if(!g.menu) return '<a class="tab rd-t" href="'+g.h+'" data-tab="'+g.k+'"><b>'+g.i+'</b>'+g.t+(g.badge?'<span class="new">'+g.badge+'</span>':'')+'</a>';
   return '<div class="rd-dd"><button type="button" class="tab rd-t rd-gb" aria-haspopup="true" aria-expanded="false"><b>'+g.i+'</b>'+g.t+' <i>▾</i></button><div class="rd-menu" role="menu">'+g.menu.map(function(m){return '<a class="rd-sub'+(m[3]?' rd-ti2':'')+'" role="menuitem" href="'+m[1]+'" '+(m[3]&&m[1]==="#tools"?'data-tool="'+m[2]+'"':'data-tab="'+m[2]+'"')+'>'+(m[3]?'<img src="img/rd/topics/'+m[3]+'.webp" alt="" width="28" height="28">':'')+m[0]+'</a>'}).join("")+'</div></div>';
  }).join("");
  function close(){nav.querySelectorAll(".rd-dd.open").forEach(function(d){d.classList.remove("open");d.firstChild.setAttribute("aria-expanded","false")})}
  nav.querySelectorAll(".rd-dd").forEach(function(d){
   var b=d.firstChild,m=d.querySelector(".rd-menu");
   function open(){close();var r=b.getBoundingClientRect();m.style.top=(r.bottom+6)+"px";m.style.left=Math.min(r.left,innerWidth-250)+"px";d.classList.add("open");b.setAttribute("aria-expanded","true")}
   b.addEventListener("click",function(e){e.stopPropagation();d.classList.contains("open")?close():open()});
   d.addEventListener("mouseenter",function(){if(matchMedia("(hover:hover)").matches)open()});
   d.addEventListener("mouseleave",function(){if(matchMedia("(hover:hover)").matches)close()});
   m.addEventListener("click",function(e){ var a=e.target.closest("[data-tool]"); if(a){ e.preventDefault(); window.__rtPick=a.dataset.tool; if(location.hash==="#tools"){ var t=document.querySelector('.rt-tab[data-t="'+a.dataset.tool+'"]'); if(t) t.click(); } else location.hash="#tools"; } close(); });
  });
  document.addEventListener("click",close);window.addEventListener("hashchange",close);
  var hh=(location.hash||"#classroom").slice(1); nav.querySelectorAll("a.tab").forEach(function(t){ if(t.dataset.tab===hh) t.setAttribute("aria-current","page"); });
 }
 function mark(){var h=location.hash||"#classroom";document.querySelectorAll("header .rd-dd").forEach(function(d){var on=[].some.call(d.querySelectorAll(".rd-sub"),function(a){return a.getAttribute("href")===h||(d.querySelector("[data-tool]")&&(h==="#tools"||h==="#playground"))});d.firstChild.classList.toggle("rd-on",on)});}
 build();window.addEventListener("hashchange",function(){setTimeout(mark,60)});setTimeout(mark,300);
 new MutationObserver(function(){build()}).observe(document.body,{childList:true});
})();
