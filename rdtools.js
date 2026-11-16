/* Tools hub (16 Nov 2026): runnable tools for the topics on the home page. All run in the visitor's browser. */
(function(){
const IMG = t => `img/rd/topics/${t}.webp`;
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const TOOLS = [
 {id:"py", t:"Python", img:"T01", live:1, href:"#playground", blurb:"Real Python 3.12 in your browser."},
 {id:"js", t:"JavaScript", img:"T08", live:1},
 {id:"sql", t:"SQL", img:"T05", live:1},
 {id:"api", t:"API tester", img:"T14", live:1},
 {id:"dsa", t:"DSA visualiser", img:"T04", live:1},
 {id:"vec", t:"Vector search", img:"T06", live:1},
 {id:"git", t:"Git practice", img:"T13", live:1},
 {id:"java", t:"Java", img:"T07", live:1},
 {id:"linux", t:"Linux shell", img:"T18", live:1},
 {id:"docker", t:"Docker", img:"T15", live:1},
 {id:"azure", t:"Azure", img:"T10", live:1},
 {id:"dbx", t:"Databricks", img:"T11", live:1},
 {id:"ml", t:"Machine learning", img:"T12", live:1},
 {id:"rag", t:"RAG & LLM apps", img:"T09", live:1},
 {id:"sys", t:"System design", img:"T16", live:1},
 {id:"sec", t:"Cyber security", img:"T17", live:1},
 {id:"mcp", t:"MCP tool calls", img:"T14", live:1},
 {id:"llm", t:"LLM prompt workbench", img:"T19", live:1}
];
const SOON = [["Java","T07"],["Linux shell","T18"],["Docker","T15"],["Azure","T10"],["Databricks","T11"],["Machine learning","T12"],["RAG & LLM apps","T09"],["System design","T16"],["Cyber security","T17"]];

const JS_EX = [["Hello, chai", `console.log("Namaste! Chai ready hai ☕");\nconsole.log("2 + 3 =", 2 + 3);`],
 ["Loop and array", `const orders = ["masala chai", "adrak chai", "elaichi chai"];\norders.forEach((o, i) => console.log(i + 1, o));\nconsole.log(orders.map(o => o.toUpperCase()));`],
 ["Function and object", `const bill = (price, qty) => price * qty;\nconst item = { name: "chai", price: 20, qty: 3 };\nconsole.log(item.name, "total:", bill(item.price, item.qty));`]];
const SQL_SETUP = `CREATE TABLE students(id INTEGER PRIMARY KEY, name TEXT, city TEXT, marks INTEGER);
INSERT INTO students VALUES (1,'Asha','Delhi',82),(2,'Bilal','Mumbai',74),(3,'Chitra','Pune',91),(4,'Dev','Delhi',66),(5,'Esha','Mumbai',88),(6,'Farhan','Pune',79);
CREATE TABLE orders(id INTEGER PRIMARY KEY, student_id INTEGER, item TEXT, price INTEGER);
INSERT INTO orders VALUES (1,1,'chai',20),(2,1,'samosa',15),(3,3,'chai',20),(4,5,'vada pav',25),(5,3,'samosa',15);`;
const SQL_EX = [["All students","SELECT * FROM students;"],["Top marks","SELECT name, marks FROM students ORDER BY marks DESC LIMIT 3;"],["Average by city","SELECT city, COUNT(*) AS students, ROUND(AVG(marks),1) AS avg_marks\nFROM students GROUP BY city;"],["JOIN","SELECT s.name, o.item, o.price\nFROM students s JOIN orders o ON o.student_id = s.id;"]];
const API_EX = ["https://jsonplaceholder.typicode.com/todos/1","https://jsonplaceholder.typicode.com/users/1","https://api.github.com/zen","https://jsonplaceholder.typicode.com/posts?_limit=3"];
const VEC = [["🍎 Apple",[.9,.1,.1]],["🍌 Banana",[.95,.05,.1]],["🥭 Mango",[.9,.05,.15]],["💻 Laptop",[.05,.95,.05]],["📱 Phone",[.1,.95,.05]],["🤖 Robot",[.1,.8,.3]],["🐶 Dog",[.1,.1,.95]],["🐱 Cat",[.1,.1,.9]],["🐘 Elephant",[.05,.1,.95]]];

function page(){
 return `<div class="page-head"><div><div class="eyebrow">Tools</div><h1>Try it. <em>Right in your browser.</em></h1>
 <p class="lead">Small tools to practise what you learn. They run on your device: no install, no sign-up, nothing you type is stored on a server.</p></div></div>
 <div class="rt-tabs rt-tabs-hide" role="tablist">${TOOLS.map(x=>`<button class="rt-tab" role="tab" data-t="${x.id}"><img src="${IMG(x.img)}" alt="" width="40" height="40"><span>${x.t}</span></button>`).join("")}</div>
 <section id="rt-panel" class="rt-panel"></section>
 <p class="rt-note">Java, Docker, Linux, Azure, Databricks, RAG and security are practice versions that run in your browser: they teach the ideas and commands, they are not the real products.</p>`;
}

function show(app){
 app.innerHTML = page();
 const panel = app.querySelector("#rt-panel");
 const tabs = app.querySelectorAll(".rt-tab");
 function open(id){
  tabs.forEach(b => b.setAttribute("aria-selected", b.dataset.t === id));
  const tool = TOOLS.find(x=>x.id===id);
  if (id === "py"){ panel.innerHTML = `<div class="rt-card"><h2>Python</h2><p>Real Python 3.12 with numpy and pandas, running in your browser (Pyodide).</p><a class="btn primary" href="#playground">Open the Python playground →</a></div>`; return; }
  ({js:jsTool, sql:sqlTool, api:apiTool, dsa:dsaTool, vec:vecTool, git:gitTool, java:javaTool, linux:linuxTool, docker:dockerTool, azure:azureTool, dbx:dbxTool, ml:mlTool, rag:ragTool, sys:sysTool, sec:secTool, mcp:mcpTool, llm:llmTool})[id](panel);
  try{ history.replaceState(null,"","#tools"); }catch(e){}
 }
 tabs.forEach(b => b.addEventListener("click", () => open(b.dataset.t)));
 const pick=window.__rtPick||"js"; window.__rtPick=null; open(pick); window.scrollTo(0,0);
}

/* ---- JavaScript: sandboxed iframe, console captured ---- */
function jsTool(p){
 p.innerHTML = `<div class="rt-card"><h2>JavaScript</h2><label class="rt-l">Example <select id="jsex">${JS_EX.map((x,i)=>`<option value="${i}">${x[0]}</option>`).join("")}</select></label>
 <textarea id="jscode" class="rt-ed" spellcheck="false" rows="9">${esc(JS_EX[0][1])}</textarea>
 <div class="rt-row"><button class="btn primary" id="jsrun">▶ Run</button><small>Ctrl + Enter runs</small></div><pre class="rt-out" id="jsout">Press Run.</pre></div>`;
 const out = p.querySelector("#jsout"), code = p.querySelector("#jscode");
 p.querySelector("#jsex").onchange = e => code.value = JS_EX[e.target.value][1];
 function run(){
  out.textContent = "";
  const f = document.createElement("iframe"); f.setAttribute("sandbox","allow-scripts"); f.style.display="none";
  const id = "m"+Math.random().toString(36).slice(2);
  const h = e => { if(e.data && e.data.id===id){ out.textContent += e.data.line + "\n"; } };
  window.addEventListener("message", h);
  f.srcdoc = `<script>const id=${JSON.stringify(id)};const send=l=>parent.postMessage({id,line:l},"*");
   const fmt=a=>a.map(x=>typeof x==="object"?JSON.stringify(x):String(x)).join(" ");
   console.log=(...a)=>send(fmt(a));console.error=(...a)=>send("Error: "+fmt(a));
   try{ new Function(${JSON.stringify(code.value)})(); }catch(e){ send("Error: "+e.message); }<\/script>`;
  document.body.appendChild(f); setTimeout(()=>{ window.removeEventListener("message",h); f.remove(); if(!out.textContent) out.textContent="(no output: use console.log)"; }, 1500);
 }
 p.querySelector("#jsrun").onclick = run;
 code.addEventListener("keydown", e => { if(e.ctrlKey && e.key==="Enter") run(); });
}

/* ---- SQL: sql.js (SQLite in WebAssembly) ---- */
let sqlP;
function loadSql(){ return sqlP || (sqlP = new Promise((res,rej)=>{ const s=document.createElement("script"); s.src="https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/sql-wasm.js"; s.onload=()=>initSqlJs({locateFile:f=>"https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/"+f}).then(res,rej); s.onerror=rej; document.head.appendChild(s); })); }
function sqlTool(p){
 p.innerHTML = `<div class="rt-card"><h2>SQL</h2><p>A small practice database with two tables: <code>students(id, name, city, marks)</code> and <code>orders(id, student_id, item, price)</code>. This is real SQLite.</p>
 <label class="rt-l">Example <select id="sqex">${SQL_EX.map((x,i)=>`<option value="${i}">${x[0]}</option>`).join("")}</select></label>
 <textarea id="sqcode" class="rt-ed" spellcheck="false" rows="5">${esc(SQL_EX[0][1])}</textarea>
 <div class="rt-row"><button class="btn primary" id="sqrun">▶ Run</button><small id="sqst">Loading SQLite (about 1 MB)…</small></div><div id="sqout" class="rt-out"></div></div>`;
 const code=p.querySelector("#sqcode"), out=p.querySelector("#sqout"), st=p.querySelector("#sqst"); let db;
 p.querySelector("#sqex").onchange = e => code.value = SQL_EX[e.target.value][1];
 loadSql().then(SQL=>{ db=new SQL.Database(); db.run(SQL_SETUP); st.textContent="Ready. Ctrl + Enter runs."; }).catch(()=>{ st.textContent="Could not load SQLite. Check your internet connection and reload."; });
 function run(){ if(!db){return;} try{ const r=db.exec(code.value); out.innerHTML = r.length ? r.map(t=>`<table class="rt-t"><thead><tr>${t.columns.map(c=>`<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${t.values.map(v=>`<tr>${v.map(c=>`<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`).join("") : "<pre class='rt-out'>Done. (No rows returned.)</pre>"; }catch(e){ out.innerHTML = `<pre class="rt-out rt-err">${esc(e.message)}</pre>`; } }
 p.querySelector("#sqrun").onclick = run; code.addEventListener("keydown", e => { if(e.ctrlKey && e.key==="Enter") run(); });
}

/* ---- API tester (GET only, browser fetch) ---- */
function apiTool(p){
 p.innerHTML = `<div class="rt-card"><h2>API tester</h2><p>Send a GET request and read the JSON reply. Only sites that allow browser requests (CORS) will work. Your request goes straight from your browser to that site.</p>
 <label class="rt-l">Try one <select id="apex">${API_EX.map(u=>`<option>${u}</option>`).join("")}</select></label>
 <div class="rt-row"><input id="apurl" class="rt-in" value="${API_EX[0]}" aria-label="URL"><button class="btn primary" id="aprun">Send GET</button></div>
 <div class="rt-row"><small id="apst">Press Send.</small></div><pre class="rt-out" id="apout"></pre></div>`;
 const url=p.querySelector("#apurl"), out=p.querySelector("#apout"), st=p.querySelector("#apst");
 p.querySelector("#apex").onchange = e => url.value = e.target.value;
 p.querySelector("#aprun").onclick = async () => { if(!/^https:\/\//i.test(url.value)){ st.textContent="Use an https:// address."; return; } st.textContent="Sending…"; out.textContent=""; const t=performance.now();
  try{ const r=await fetch(url.value); const txt=await r.text(); let body=txt; try{ body=JSON.stringify(JSON.parse(txt),null,2);}catch(e){} st.textContent=`Status ${r.status} ${r.statusText} · ${Math.round(performance.now()-t)} ms`; out.textContent=body.slice(0,6000); }
  catch(e){ st.textContent="Request failed (the site may block browser requests)."; } };
}

/* ---- DSA visualiser: sorting + binary search ---- */
function dsaTool(p){
 p.innerHTML = `<div class="rt-card"><h2>DSA visualiser</h2><p>Watch an algorithm work, one step at a time.</p>
 <div class="rt-row"><label class="rt-l">Algorithm <select id="dsal"><option value="bubble">Bubble sort</option><option value="selection">Selection sort</option><option value="insertion">Insertion sort</option><option value="bsearch">Binary search</option></select></label>
 <button class="btn" id="dsnew">New data</button><button class="btn primary" id="dsgo">▶ Start</button></div><div id="dsbars" class="rt-bars"></div><p id="dsmsg" class="rt-msg"></p></div>`;
 const box=p.querySelector("#dsbars"), msg=p.querySelector("#dsmsg"); let a=[],run=0;
 function fresh(){ run++; const alg=p.querySelector("#dsal").value; a=Array.from({length:18},()=>5+Math.floor(Math.random()*95)); if(alg==="bsearch") a.sort((x,y)=>x-y); draw(); msg.textContent = alg==="bsearch" ? "Sorted data. A random value is the target." : "Press Start."; }
 function draw(hi={},sorted=new Set(),target){ box.innerHTML=a.map((v,i)=>`<div class="rt-bar${hi[i]?" "+hi[i]:""}${sorted.has(i)?" ok":""}${target===i?" tg":""}" style="height:${v*2.2}px"><span>${v}</span></div>`).join(""); }
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 async function go(){ const my=++run, alg=p.querySelector("#dsal").value, d=130, ok=new Set();
  if(alg==="bsearch"){ const tgt=Math.floor(Math.random()*a.length), val=a[tgt]; let lo=0,hi=a.length-1,n=0; msg.textContent=`Looking for ${val}`;
   while(lo<=hi){ if(my!==run)return; const mid=(lo+hi)>>1; n++; draw({[mid]:"cmp"},new Set(),undefined); await wait(700); if(a[mid]===val){ draw({},new Set(),mid); msg.textContent=`Found ${val} at position ${mid+1} in ${n} step${n>1?"s":""}. Linear search could take ${a.length}.`; return;} if(a[mid]<val){lo=mid+1;msg.textContent=`${a[mid]} is too small: look right`;} else {hi=mid-1;msg.textContent=`${a[mid]} is too big: look left`;} } return; }
  const n=a.length;
  if(alg==="bubble"){ for(let i=0;i<n-1;i++){ for(let j=0;j<n-i-1;j++){ if(my!==run)return; draw({[j]:"cmp",[j+1]:"cmp"},ok); await wait(d); if(a[j]>a[j+1]){[a[j],a[j+1]]=[a[j+1],a[j]]; draw({[j]:"sw",[j+1]:"sw"},ok); await wait(d);} } ok.add(n-1-i);} }
  if(alg==="selection"){ for(let i=0;i<n-1;i++){ let m=i; for(let j=i+1;j<n;j++){ if(my!==run)return; draw({[m]:"sw",[j]:"cmp"},ok); await wait(d/2); if(a[j]<a[m])m=j;} [a[i],a[m]]=[a[m],a[i]]; ok.add(i); draw({},ok); await wait(d);} }
  if(alg==="insertion"){ for(let i=1;i<n;i++){ let j=i; while(j>0&&a[j-1]>a[j]){ if(my!==run)return; [a[j-1],a[j]]=[a[j],a[j-1]]; draw({[j]:"sw",[j-1]:"cmp"},ok); await wait(d); j--; } } }
  draw({},new Set(a.map((_,i)=>i))); msg.textContent="Sorted!"; }
 p.querySelector("#dsnew").onclick=fresh; p.querySelector("#dsgo").onclick=go; p.querySelector("#dsal").onchange=fresh; fresh();
}

/* ---- Vector search: toy embeddings + cosine similarity ---- */
function vecTool(p){
 p.innerHTML = `<div class="rt-card"><h2>Vector search</h2><p>A vector database finds items whose numbers point in a similar direction. Here each item has 3 toy scores (Food, Tech, Animal). Move the sliders to describe what you want and see the closest matches (cosine similarity). Real systems use hundreds of numbers from an AI model.</p>
 <div class="rt-sl">${["Food","Tech","Animal"].map((n,i)=>`<label>${n} <input type="range" min="0" max="100" value="${i===0?90:10}" data-i="${i}"><output>${i===0?90:10}</output></label>`).join("")}</div><div id="vcout" class="rt-vc"></div></div>`;
 const q=[.9,.1,.1], o=p.querySelector("#vcout");
 const cos=(a,b)=>{const d=a.reduce((s,x,i)=>s+x*b[i],0),n=v=>Math.sqrt(v.reduce((s,x)=>s+x*x,0));return d/(n(a)*n(b)||1)};
 function upd(){ const r=VEC.map(([n,v])=>[n,cos(q,v)]).sort((a,b)=>b[1]-a[1]); o.innerHTML=r.map(([n,s],i)=>`<div class="rt-vr${i<3?" top":""}"><span>${n}</span><i style="width:${Math.max(0,s)*100}%"></i><b>${s.toFixed(2)}</b></div>`).join(""); }
 p.querySelectorAll("input[type=range]").forEach(r=>r.oninput=()=>{ q[r.dataset.i]=r.value/100; r.nextElementSibling.textContent=r.value; upd(); }); upd();
}

/* ---- Git practice: tiny simulated repo (nothing real is touched) ---- */
function gitTool(p){
 p.innerHTML = `<div class="rt-card"><h2>Git practice</h2><p>A pretend repository to try the basic commands safely. Try: <code>git init</code>, <code>touch notes.txt</code>, <code>git status</code>, <code>git add .</code>, <code>git commit -m "first"</code>, <code>git branch dev</code>, <code>git checkout dev</code>, <code>git log</code>. Type <code>help</code> for the list.</p>
 <div class="rt-term" id="gt"><div id="gl"></div><div class="rt-prompt"><span id="gp">$</span><input id="gi" autocomplete="off" spellcheck="false" aria-label="Git command"></div></div></div>`;
 const L=p.querySelector("#gl"), inp=p.querySelector("#gi"), gp=p.querySelector("#gp");
 let S={init:false,files:{},staged:{},branches:{main:[]},cur:"main",n:0};
 const say=(t,c)=>{const d=document.createElement("div");d.className=c||"";d.textContent=t;L.appendChild(d);L.parentElement.scrollTop=1e9};
 function status(){ const u=Object.keys(S.files).filter(f=>!(f in S.staged)||S.staged[f]!==S.files[f]); const st=Object.keys(S.staged).filter(f=>!lastHas(f)); return {u,st}; }
 const lastHas=f=>{const c=S.branches[S.cur];const l=c[c.length-1];return l&&l.files[f]===S.staged[f]};
 function cmd(line){ say(`${S.cur} $ ${line}`,"rt-cmd"); const a=line.trim().split(/\s+/); if(!a[0])return;
  if(a[0]==="help"){ say("git init · git status · git add <file|.> · git commit -m \"msg\" · git log · git branch [name] · git checkout <branch> · git checkout -b <name> · git merge <branch> · touch <file> · ls · clear"); return; }
  if(a[0]==="clear"){ L.innerHTML=""; return; }
  if(a[0]==="touch"){ if(!a[1]) return say("touch: name a file"); S.files[a[1]]=(S.files[a[1]]||0)+1; return say(`(file ${a[1]} created or edited)`); }
  if(a[0]==="ls"){ return say(Object.keys(S.files).join("  ")||"(empty)"); }
  if(a[0]!=="git") return say(`${a[0]}: command not found (try help)`);
  const g=a[1];
  if(g==="init"){ S.init=true; return say("Initialized empty Git repository (branch main)"); }
  if(!S.init) return say("fatal: not a git repository (run git init first)");
  const br=S.branches[S.cur];
  if(g==="status"){ const {u,st}=status(); say(`On branch ${S.cur}`); if(st.length)say("Changes to be committed:  "+st.join(", ")); if(u.length)say("Not staged / untracked:  "+u.join(", ")); if(!st.length&&!u.length)say("nothing to commit, working tree clean"); return; }
  if(g==="add"){ if(!a[2]) return say("Nothing specified. Try: git add ."); (a[2]==="."?Object.keys(S.files):[a[2]]).forEach(f=>{ if(f in S.files) S.staged[f]=S.files[f]; else say(`pathspec '${f}' did not match any files`) }); return; }
  if(g==="commit"){ const m=line.match(/-m\s+["']?(.+?)["']?$/); if(!m) return say('Add a message: git commit -m "message"'); const {st}=status(); if(!st.length) return say("nothing to commit (use git add first)"); S.n++; const id=Math.random().toString(16).slice(2,9); br.push({id,msg:m[1],files:{...S.staged}}); return say(`[${S.cur} ${id}] ${m[1]}`); }
  if(g==="log"){ if(!br.length) return say("(no commits yet)"); [...br].reverse().forEach(c=>say(`${c.id}  ${c.msg}`)); return; }
  if(g==="branch"){ if(a[2]){ if(S.branches[a[2]]) return say("branch already exists"); S.branches[a[2]]=[...br]; return say(`Branch '${a[2]}' created`);} return Object.keys(S.branches).forEach(b=>say((b===S.cur?"* ":"  ")+b)); }
  if(g==="checkout"||g==="switch"){ let n=a[2]; if(n==="-b"){ n=a[3]; if(!n)return say("name the branch"); S.branches[n]=[...br]; } if(!S.branches[n]) return say(`error: no branch named '${n}'`); S.cur=n; gp.textContent="$"; return say(`Switched to branch '${n}'`); }
  if(g==="merge"){ const o=S.branches[a[2]]; if(!o) return say("merge: no such branch"); if(o.length>=br.length&&o.slice(0,br.length).every((c,i)=>c.id===br[i].id)){ S.branches[S.cur]=[...o]; return say(`Fast-forward: ${S.cur} now has ${o.length} commits`);} return say("Already up to date (this practice tool supports fast-forward merges)."); }
  say(`git: '${g}' is not supported here (try help)`); }
 inp.addEventListener("keydown",e=>{ if(e.key==="Enter"){ cmd(inp.value); inp.value=""; } });
 say("Practice repo ready. Type git init to begin."); setTimeout(()=>inp.focus(),50);
}

/* ===== 16 Nov: tools for the remaining topics (all run in the browser; simulations are labelled) ===== */
const note = t => `<p class="rt-note">${t}</p>`;

/* ---- Java: predict-the-output practice (Java itself cannot run in the browser here) ---- */
const JQ = [
 ["int a = 5;\nint b = 2;\nSystem.out.println(a / b);", ["2","2.5","3"], 0, "Both are int, so Java does integer division and drops the .5."],
 ["String s = \"Chai\";\ns = s + 1 + 2;\nSystem.out.println(s);", ["Chai3","Chai12","Chai 1 2"], 1, "Strings join left to right, so 1 and 2 are added as text."],
 ["int x = 10;\nx += 5;\nx--;\nSystem.out.println(x);", ["14","15","16"], 0, "10 + 5 = 15, then x-- makes it 14."],
 ["for (int i = 0; i < 3; i++) {\n  System.out.print(i + \" \");\n}", ["0 1 2 ","1 2 3 ","0 1 2 3 "], 0, "i starts at 0 and stops before 3."],
 ["boolean ok = (3 > 2) && (2 > 5);\nSystem.out.println(ok);", ["true","false","Error"], 1, "&& needs both sides true; 2 > 5 is false."]];
function javaTool(p){
 let i=0, score=0;
 function q(){
  const [c,o,a,w]=JQ[i];
  p.innerHTML=`<div class="rt-card"><h2>Java: predict the output</h2>${note("Java needs a compiler, which does not run in a browser here. So practise the skill that matters first: reading code and knowing what it prints.")}<pre class="rt-out">${esc(c)}</pre><div class="rt-opts">${o.map((x,k)=>`<button class="btn" data-k="${k}">${esc(x)}</button>`).join("")}</div><p id="jfb" class="rt-msg"></p><small>Question ${i+1} of ${JQ.length} · Score ${score}</small></div>`;
  p.querySelectorAll(".rt-opts .btn").forEach(b=>b.onclick=()=>{
   const ok=+b.dataset.k===a; if(ok)score++;
   p.querySelectorAll(".rt-opts .btn").forEach(x=>x.disabled=true);
   b.style.background=ok?"#14d3dc":"#ff6b81"; b.style.color="#04101c";
   const f=p.querySelector("#jfb");
   f.innerHTML=(ok?"Correct! ":"Not quite. ")+esc(w)+` <button class="btn primary" id="jn">${i<JQ.length-1?"Next →":"See score"}</button>`;
   p.querySelector("#jn").onclick=()=>{
    if(i<JQ.length-1){ i++; q(); }
    else { p.innerHTML=`<div class="rt-card"><h2>Done: ${score} / ${JQ.length}</h2><p>Nice. Try again to improve your score.</p><button class="btn primary" id="jr">Restart</button></div>`; p.querySelector("#jr").onclick=()=>{ i=0; score=0; q(); }; }
   };
  });
 }
 q();
}

/* ---- Linux shell: simulated terminal with a virtual file system ---- */
function linuxTool(p){
 p.innerHTML=`<div class="rt-card"><h2>Linux shell</h2>${note("A practice shell with a pretend file system. Nothing touches your computer. Try: pwd, ls, mkdir demo, cd demo, echo hello > a.txt, cat a.txt, cp a.txt b.txt, grep hello a.txt, wc a.txt, rm b.txt. Type help for the list.")}<div class="rt-term"><div id="ll"></div><div class="rt-prompt"><span id="lp">~ $</span><input id="li" autocomplete="off" spellcheck="false" aria-label="Shell command"></div></div></div>`;
 const L=p.querySelector("#ll"), inp=p.querySelector("#li"), pr=p.querySelector("#lp");
 const fs={"/":{t:"d",c:{home:{t:"d",c:{raj:{t:"d",c:{"notes.txt":{t:"f",d:"learn linux\nhello chai\n"}}}}}}}};
 let cwd=["home","raj"];
 const node=(path)=>{ let n=fs["/"]; for(const s of path){ if(!n||n.t!=="d"||!n.c[s]) return null; n=n.c[s]; } return n; };
 const res=(x)=>{ const parts=x.startsWith("/")?[]:[...cwd]; for(const s of x.split("/")){ if(!s||s===".")continue; if(s==="..")parts.pop(); else if(s==="~"){ parts.length=0; parts.push("home","raj"); } else parts.push(s); } return parts; };
 const out=(t,c)=>{ const d=document.createElement("div"); d.className=c||""; d.textContent=t; L.appendChild(d); L.parentElement.scrollTop=1e9; };
 const pwd=()=>"/"+cwd.join("/");
 function run(line){
  out(`${pwd()} $ ${line}`,"rt-cmd");
  const m=line.match(/^(.*?)\s*>\s*(\S+)$/); let cmd=line, redir=null; if(m){ cmd=m[1]; redir=m[2]; }
  const a=cmd.trim().split(/\s+/); const c=a[0]; if(!c) return; let o="";
  if(c==="help") o="pwd · ls · cd · mkdir · touch · echo · cat · cp · mv · rm · grep · wc · head · clear · whoami";
  else if(c==="clear"){ L.innerHTML=""; return; }
  else if(c==="whoami") o="raj";
  else if(c==="pwd") o=pwd();
  else if(c==="ls"){ const n=node(res(a[1]||".")); o=!n?"ls: no such file or directory":n.t==="d"?Object.keys(n.c).map(k=>n.c[k].t==="d"?k+"/":k).join("  "):a[1]; }
  else if(c==="cd"){ const p2=res(a[1]||"~"), n=node(p2); if(!n||n.t!=="d") o="cd: no such directory"; else cwd=p2; }
  else if(c==="mkdir"){ const p2=res(a[1]||""), nm=p2.pop(), par=node(p2); if(!nm||!par) o="mkdir: cannot create directory"; else par.c[nm]=par.c[nm]||{t:"d",c:{}}; }
  else if(c==="touch"){ const p2=res(a[1]||""), nm=p2.pop(), par=node(p2); if(!nm||!par) o="touch: cannot touch"; else par.c[nm]=par.c[nm]||{t:"f",d:""}; }
  else if(c==="echo"){ const txt=cmd.replace(/^echo\s*/,"").replace(/^["']|["']$/g,""); if(redir){ const p2=res(redir), nm=p2.pop(), par=node(p2); if(par) par.c[nm]={t:"f",d:txt+"\n"}; } else o=txt; }
  else if(c==="cat"){ const n=node(res(a[1]||"")); o=!n||n.t!=="f"?"cat: no such file":n.d.replace(/\n$/,""); }
  else if(c==="head"){ const n=node(res(a[1]||"")); o=!n||n.t!=="f"?"head: no such file":n.d.split("\n").slice(0,10).join("\n").replace(/\n$/,""); }
  else if(c==="wc"){ const n=node(res(a[1]||"")); o=!n||n.t!=="f"?"wc: no such file":`${n.d.split("\n").length-1} lines  ${n.d.split(/\s+/).filter(Boolean).length} words  ${n.d.length} chars`; }
  else if(c==="grep"){ const n=node(res(a[2]||"")); o=!n||n.t!=="f"?"grep: usage: grep word file":n.d.split("\n").filter(l=>l.includes(a[1])).join("\n"); }
  else if(c==="cp"||c==="mv"){ const s=res(a[1]||""), n=node(s), d=res(a[2]||""), nm=d.pop(), par=node(d); if(!n||!par||!nm) o=c+": cannot do that"; else { par.c[nm]=JSON.parse(JSON.stringify(n)); if(c==="mv"){ const sn=s.pop(); delete node(s).c[sn]; } } }
  else if(c==="rm"){ const s=res(a[1]||""), nm=s.pop(), par=node(s); if(!par||!par.c[nm]) o="rm: no such file"; else delete par.c[nm]; }
  else o=`${c}: command not found (try help)`;
  if(o) out(o);
  pr.textContent=(cwd.length===2&&cwd[0]==="home"&&cwd[1]==="raj"?"~":pwd())+" $";
 }
 inp.addEventListener("keydown",e=>{ if(e.key==="Enter"){ run(inp.value); inp.value=""; } });
 out("Welcome. Type help."); setTimeout(()=>inp.focus(),50);
}

/* ---- Docker: simulated CLI ---- */
function dockerTool(p){
 p.innerHTML=`<div class="rt-card"><h2>Docker</h2>${note("A pretend Docker so you can learn the commands. Try: docker pull nginx, docker images, docker run -d --name web nginx, docker ps, docker stop web, docker ps -a, docker rm web, docker rmi nginx. Type help.")}<div class="rt-term"><div id="dl"></div><div class="rt-prompt"><span>$</span><input id="di" autocomplete="off" spellcheck="false" aria-label="Docker command"></div></div></div>`;
 const L=p.querySelector("#dl"), inp=p.querySelector("#di");
 const out=(t,c)=>{ const d=document.createElement("div"); d.className=c||""; d.textContent=t; L.appendChild(d); L.parentElement.scrollTop=1e9; };
 const KNOWN=["nginx","redis","python","node","postgres","ubuntu","hello-world"]; let imgs=[], ctrs=[], n=0;
 const id=()=>Math.random().toString(16).slice(2,14);
 function run(line){
  out(`$ ${line}`,"rt-cmd"); const a=line.trim().split(/\s+/); if(!a[0]) return;
  if(a[0]==="help") return out("docker pull <image> · images · run [-d] [--name x] <image> · ps [-a] · stop <name> · start <name> · rm <name> · rmi <image> · logs <name> · images to try: "+KNOWN.join(", "));
  if(a[0]==="clear"){ L.innerHTML=""; return; }
  if(a[0]!=="docker") return out("Start with docker (try help)");
  const g=a[1];
  if(g==="pull"){ const i=(a[2]||"").split(":")[0]; if(!KNOWN.includes(i)) return out(`Error: image '${i}' not found (try ${KNOWN.join(", ")})`); if(!imgs.includes(i)) imgs.push(i); return out(`Pulling ${i}:latest ... done\nStatus: Downloaded newer image for ${i}:latest`); }
  if(g==="images"){ out("REPOSITORY   TAG      IMAGE ID"); return imgs.forEach(i=>out(`${i.padEnd(12)} latest   ${id().slice(0,8)}`)); }
  if(g==="run"){
   const d=a.includes("-d"), ni=a.indexOf("--name"), name=ni>0?a[ni+1]:"c"+(++n), img=a[a.length-1];
   if(!KNOWN.includes(img)) return out(`Unable to find image '${img}'`);
   if(!imgs.includes(img)){ imgs.push(img); out(`(pulled ${img} first)`); }
   const c={id:id(),name,img,up:d}; ctrs.push(c);
   return out(d?c.id:`Container ${name} ran and exited (add -d to keep it running)`);
  }
  if(g==="ps"){ const all=a.includes("-a"); out("CONTAINER ID   IMAGE      STATUS    NAMES"); return ctrs.filter(c=>all||c.up).forEach(c=>out(`${c.id.slice(0,12)}   ${c.img.padEnd(10)} ${c.up?"Up":"Exited"}      ${c.name}`)); }
  const c=ctrs.find(x=>x.name===a[2]||x.id.startsWith(a[2]||"~"));
  if(g==="stop"){ if(!c) return out("No such container"); c.up=false; return out(c.name); }
  if(g==="start"){ if(!c) return out("No such container"); c.up=true; return out(c.name); }
  if(g==="rm"){ if(!c) return out("No such container"); if(c.up) return out("Error: stop the container first"); ctrs=ctrs.filter(x=>x!==c); return out(c.name); }
  if(g==="logs"){ if(!c) return out("No such container"); return out(`[${c.img}] started... ready to accept connections`); }
  if(g==="rmi"){ const i=a[2]; if(!imgs.includes(i)) return out("No such image"); if(ctrs.some(x=>x.img===i)) return out("Error: a container is using this image"); imgs=imgs.filter(x=>x!==i); return out("Untagged: "+i); }
  out(`docker: '${g}' is not supported here (try help)`);
 }
 inp.addEventListener("keydown",e=>{ if(e.key==="Enter"){ run(inp.value); inp.value=""; } });
 out("Practice Docker ready. Type help."); setTimeout(()=>inp.focus(),50);
}

/* ---- Azure: which service + rough cost ---- */
const AZ = [["Run a website or API","App Service","Hosts web apps without managing servers.",13],["Run small pieces of code on events","Azure Functions","Pay per run, great for automation.",2],["Store files, photos, backups","Blob Storage","Cheap object storage for any file.",2],["A relational database","Azure SQL Database","Managed SQL Server in the cloud.",15],["A full virtual computer","Virtual Machines","Your own Windows or Linux server.",35],["Run many containers","Azure Kubernetes Service","Orchestrates containers at scale.",70],["Add AI to an app","Azure AI services","Ready-made language, vision and speech APIs.",20],["Big data and analytics","Synapse / Databricks on Azure","Process large data and train models.",120]];
function azureTool(p){
 p.innerHTML=`<div class="rt-card"><h2>Azure: which service?</h2>${note("Pick what you want to do and see the Azure service that fits. The monthly cost is only a rough starting guess in US dollars for a small project, not a price quote.")}<div class="rt-az">${AZ.map((x,i)=>`<label class="rt-chk"><input type="checkbox" data-i="${i}"><span>${x[0]}</span></label>`).join("")}</div><div id="azo" class="rt-az-out"></div></div>`;
 const o=p.querySelector("#azo");
 function upd(){ const s=[...p.querySelectorAll("input:checked")].map(c=>AZ[+c.dataset.i]); o.innerHTML=s.length?s.map(x=>`<div class="rt-azr"><b>${x[1]}</b><span>${x[2]}</span><i>~$${x[3]}/month</i></div>`).join("")+`<div class="rt-azr tot"><b>Rough total</b><span>for a small starter setup</span><i>~$${s.reduce((t,x)=>t+x[3],0)}/month</i></div>`:"<p class='rt-msg'>Tick one or more things you want to build.</p>"; }
 p.querySelectorAll("input").forEach(c=>c.onchange=upd); upd();
}

/* ---- Databricks: medallion pipeline stepper ---- */
function dbxTool(p){
 const raw=[{id:1,city:"delhi ",amt:"250"},{id:2,city:"Mumbai",amt:"x"},{id:3,city:"delhi",amt:"400"},{id:3,city:"delhi",amt:"400"},{id:4,city:"PUNE",amt:"150"},{id:5,city:"mumbai",amt:"300"}];
 const stages=[["Bronze: raw data","Data arrives exactly as received: messy, duplicated, with bad values."],["Silver: cleaned","Trim and fix city names, remove duplicate ids, drop rows with an invalid amount."],["Gold: ready for reports","Group the clean data by city and sum the amounts, ready for a dashboard."]];
 let s=0;
 const clean=()=>{ const seen=new Set(); return raw.map(r=>({id:r.id,city:r.city.trim().toLowerCase().replace(/^./,c=>c.toUpperCase()),amt:Number(r.amt)})).filter(r=>!isNaN(r.amt)&&!seen.has(r.id)&&seen.add(r.id)); };
 const gold=()=>{ const m={}; clean().forEach(r=>m[r.city]=(m[r.city]||0)+r.amt); return Object.entries(m).map(([city,total])=>({city,total})); };
 const tbl=rows=>`<table class="rt-t"><thead><tr>${Object.keys(rows[0]).map(k=>`<th>${k}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${Object.values(r).map(v=>`<td>${esc(v)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
 function draw(){
  const rows=s===0?raw:s===1?clean():gold();
  p.innerHTML=`<div class="rt-card"><h2>Databricks: the medallion pipeline</h2>${note("Databricks teams move data through Bronze, Silver and Gold layers. Step through a tiny example. This is a classroom simulation, not Databricks itself.")}<div class="rt-steps">${stages.map((x,i)=>`<span class="${i===s?"on":""}">${x[0].split(":")[0]}</span>`).join("")}</div><h3>${stages[s][0]}</h3><p>${stages[s][1]}</p>${tbl(rows)}<div class="rt-row"><button class="btn" id="dbb" ${s===0?"disabled":""}>← Back</button><button class="btn primary" id="dbn" ${s===2?"disabled":""}>${s===0?"Clean it →":"Aggregate →"}</button></div></div>`;
  p.querySelector("#dbb").onclick=()=>{ s--; draw(); }; p.querySelector("#dbn").onclick=()=>{ s++; draw(); };
 }
 draw();
}

/* ---- Machine learning: click to add points, fit a line ---- */
function mlTool(p){
 p.innerHTML=`<div class="rt-card"><h2>Machine learning: fit a line</h2>${note("Click on the chart to add points (say, hours studied vs marks). The tool finds the best-fit line (linear regression) and predicts a new value.")}<canvas id="mlc" width="640" height="320" class="rt-cv"></canvas><div class="rt-row"><button class="btn" id="mlclr">Clear</button><button class="btn" id="mlrnd">Random points</button><label class="rt-l">Predict y at x = <input id="mlx" type="number" value="8" style="width:80px;padding:6px"></label><b id="mlp"></b></div><small id="mlt"></small></div>`;
 const cv=p.querySelector("#mlc"), cx=cv.getContext("2d"); let pts=[[1,2.1],[2,3.9],[3,6.2],[4,7.8],[5,10.1],[6,12.2]];
 const X=x=>40+x*52, Y=y=>300-y*22;
 function fit(){ const n=pts.length; if(n<2) return null; const mx=pts.reduce((s,q)=>s+q[0],0)/n, my=pts.reduce((s,q)=>s+q[1],0)/n; let nu=0,de=0; pts.forEach(q=>{ nu+=(q[0]-mx)*(q[1]-my); de+=(q[0]-mx)**2; }); if(!de) return null; const m=nu/de; return {m,b:my-m*mx}; }
 function draw(){
  cx.clearRect(0,0,640,320); cx.strokeStyle="#1c4a5f"; cx.lineWidth=1; cx.beginPath(); cx.moveTo(40,10); cx.lineTo(40,300); cx.lineTo(630,300); cx.stroke();
  cx.fillStyle="#25e0e6"; pts.forEach(q=>{ cx.beginPath(); cx.arc(X(q[0]),Y(q[1]),6,0,7); cx.fill(); });
  const f=fit();
  if(f){ cx.strokeStyle="#ffd343"; cx.lineWidth=3; cx.beginPath(); cx.moveTo(X(0),Y(f.b)); cx.lineTo(X(11),Y(f.m*11+f.b)); cx.stroke(); p.querySelector("#mlt").textContent=`Best fit: y = ${f.m.toFixed(2)}·x + ${f.b.toFixed(2)}`; const x=+p.querySelector("#mlx").value; p.querySelector("#mlp").textContent=`→ y ≈ ${(f.m*x+f.b).toFixed(2)}`; }
  else { p.querySelector("#mlt").textContent="Add at least 2 points."; p.querySelector("#mlp").textContent=""; }
 }
 cv.addEventListener("click",e=>{ const r=cv.getBoundingClientRect(), x=((e.clientX-r.left)*(640/r.width)-40)/52, y=(300-(e.clientY-r.top)*(320/r.height))/22; if(x>=0&&y>=0){ pts.push([x,y]); draw(); } });
 p.querySelector("#mlclr").onclick=()=>{ pts=[]; draw(); };
 p.querySelector("#mlrnd").onclick=()=>{ pts=Array.from({length:10},(_,i)=>[i+.5,Math.max(.3,(i+.5)*1.2+(Math.random()*4-2))]); draw(); };
 p.querySelector("#mlx").oninput=draw; draw();
}

/* ---- RAG & LLM apps: toy retrieval + prompt builder (no AI model involved) ---- */
const DOCS=["Chai ka price 20 rupees hai. Masala chai 25 rupees. Adrak chai 25 rupees.","Our cafe opens at 8 am and closes at 10 pm every day except Sunday.","Refunds are possible within 7 days if the item is unused and you have the bill.","We deliver within 5 km. Delivery is free above 300 rupees.","Samosa and vada pav are made fresh every morning with no preservatives."];
function ragTool(p){
 p.innerHTML=`<div class="rt-card"><h2>RAG: retrieve, then answer</h2>${note("Retrieval-Augmented Generation first finds the right pieces of your documents, then gives them to a language model to write an answer. This demo shows the retrieval step with simple word matching and builds the prompt. No AI model is used here.")}<h3>Your documents (chunks)</h3><ol class="rt-docs">${DOCS.map(d=>`<li>${esc(d)}</li>`).join("")}</ol><div class="rt-row"><input id="rgq" class="rt-in" value="When does the cafe open?" aria-label="Question"><button class="btn primary" id="rgb">Search</button></div><div id="rgo"></div></div>`;
 const tok=s=>s.toLowerCase().match(/[a-z0-9]+/g)||[];
 const stop=new Set("the a an is are of to in and or do does when what how for we you it at with on".split(" "));
 function go(){
  const qs=p.querySelector("#rgq").value, q=tok(qs).filter(w=>!stop.has(w));
  const sc=DOCS.map(d=>{ const t=tok(d); return [d,q.filter(w=>t.includes(w)).length/(q.length||1)]; }).sort((a,b)=>b[1]-a[1]);
  const top=sc.filter(x=>x[1]>0).slice(0,2);
  const ctx=top.map(x=>"- "+x[0]).join("\n");
  p.querySelector("#rgo").innerHTML=`<h3>Retrieved chunks</h3>${top.length?top.map(([d,s])=>`<div class="rt-rag"><b>match ${(s*100).toFixed(0)}%</b> ${esc(d)}</div>`).join(""):"<p class='rt-msg'>Nothing matched. Try other words.</p>"}<h3>Prompt sent to the language model</h3><pre class="rt-out">Answer the question using only this context.\nContext:\n${esc(ctx)}\nQuestion: ${esc(qs)}\n\n(about ${Math.ceil((ctx+qs).length/4)} tokens)</pre>`;
 }
 p.querySelector("#rgb").onclick=go; p.querySelector("#rgq").addEventListener("keydown",e=>{ if(e.key==="Enter") go(); }); go();
}

/* ---- System design: capacity estimator ---- */
function sysTool(p){
 p.innerHTML=`<div class="rt-card"><h2>System design: capacity estimator</h2>${note("Back-of-the-envelope maths every design interview starts with. Change the numbers.")}<div class="rt-sl"><label>Daily active users <input id="sy1" type="number" value="1000000"></label><label>Requests per user per day <input id="sy2" type="number" value="20"></label><label>Peak factor (× average) <input id="sy3" type="number" value="3"></label><label>Data per write (KB) <input id="sy4" type="number" value="2"></label><label>Writes share of requests (%) <input id="sy5" type="number" value="10"></label><label>Keep data for (years) <input id="sy6" type="number" value="3"></label></div><div id="syo" class="rt-az-out"></div></div>`;
 const f=n=>n>=1e9?(n/1e9).toFixed(1)+" billion":n>=1e6?(n/1e6).toFixed(1)+" million":n>=1e3?(n/1e3).toFixed(1)+" thousand":n.toFixed(1);
 function upd(){
  const v=i=>+p.querySelector("#sy"+i).value||0, req=v(1)*v(2), avg=req/86400, peak=avg*v(3), wr=req*v(5)/100, gb=wr*v(4)/1e6*365*v(6);
  p.querySelector("#syo").innerHTML=[["Requests per day",f(req)],["Average requests / second",avg.toFixed(0)],["Peak requests / second",peak.toFixed(0)],["New writes per day",f(wr)],["Storage needed",gb>=1000?(gb/1000).toFixed(1)+" TB":gb.toFixed(0)+" GB"],["Hint",peak>10000?"Plan for load balancers, caching and sharding.":peak>1000?"Use a load balancer and a cache.":"One or two servers can handle this."]].map(([a,b])=>`<div class="rt-azr"><b>${a}</b><span></span><i>${b}</i></div>`).join("");
 }
 p.querySelectorAll("input").forEach(i=>i.oninput=upd); upd();
}

/* ---- Cyber security: password strength, SHA-256, Base64 (local only) ---- */
function secTool(p){
 p.innerHTML=`<div class="rt-card"><h2>Cyber security</h2>${note("Everything here runs on your device. Still, never type a real password into any tool: use made-up ones to learn.")}<h3>1. Password strength</h3><input id="sc1" class="rt-in" placeholder="type a made-up password" aria-label="Password"><div class="rt-meter"><i id="scm"></i></div><p id="sct" class="rt-msg"></p><h3>2. SHA-256 hash</h3><input id="sc2" class="rt-in" value="hello" aria-label="Text to hash"><pre class="rt-out" id="sch"></pre><p class="rt-msg">A hash is a one-way fingerprint. Change one letter and the whole hash changes.</p><h3>3. Base64 (encoding is not encryption)</h3><input id="sc3" class="rt-in" value="Namaste Raj" aria-label="Text to encode"><pre class="rt-out" id="scb"></pre></div>`;
 const pw=p.querySelector("#sc1");
 pw.oninput=()=>{
  const s=pw.value; let pool=0; if(/[a-z]/.test(s))pool+=26; if(/[A-Z]/.test(s))pool+=26; if(/\d/.test(s))pool+=10; if(/[^\w]/.test(s))pool+=32;
  const bits=s.length*Math.log2(pool||1), common=/^(password|123456|qwerty|admin|letmein|iloveyou)/i.test(s), sc=common?0:Math.min(100,bits*1.2);
  const m=p.querySelector("#scm"); m.style.width=(s?Math.max(sc,4):0)+"%"; m.style.background=sc<35?"#ff6b81":sc<65?"#ffd343":"#25e0e6";
  p.querySelector("#sct").textContent=!s?"":common?"This is one of the most guessed passwords.":`About ${bits.toFixed(0)} bits of strength. ${sc<35?"Weak: use a longer passphrase of several words.":sc<65?"Okay. Add length.":"Strong."}`;
 };
 async function hs(){ const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(p.querySelector("#sc2").value)); p.querySelector("#sch").textContent=[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join(""); }
 p.querySelector("#sc2").oninput=hs; hs();
 const b64=()=>{ try{ p.querySelector("#scb").textContent=btoa(String.fromCharCode(...new TextEncoder().encode(p.querySelector("#sc3").value))); }catch(e){ p.querySelector("#scb").textContent="(could not encode)"; } };
 p.querySelector("#sc3").oninput=b64; b64();
}

/* ---- MCP: tool-call simulator (rule-based, no AI model) ---- */
function mcpTool(p){
 const CITY = {delhi:[31,"Sunny"],mumbai:[29,"Humid"],pune:[26,"Cloudy"],bengaluru:[24,"Light rain"],chennai:[32,"Hot"]};
 const EV = {today:["10:00 Team stand-up","16:30 Dentist"],tomorrow:["09:00 Train to Pune","14:00 Project review"]};
 const FX = {usd:{inr:83.5},inr:{usd:0.012}};
 p.innerHTML=`<div class="rt-card"><h2>MCP: how an agent calls a tool</h2>${note("An MCP server offers tools. The AI client lists them, picks one, calls it with inputs, and uses the result. This is a classroom simulation with simple keyword matching, not a real model or server.")}
 <div class="rt-az"><div class="rt-azr"><b>get_weather</b><span>city</span><i>tool</i></div><div class="rt-azr"><b>get_events</b><span>day</span><i>tool</i></div><div class="rt-azr"><b>convert_currency</b><span>amount, from, to</span><i>tool</i></div></div>
 <div class="rt-row"><input id="mcq" class="rt-in" value="What is the weather in Pune?" aria-label="Ask the agent"><button class="btn primary" id="mcb">Ask</button></div>
 <div class="rt-opts"><button class="btn" data-q="What is on my calendar tomorrow?">Calendar</button><button class="btn" data-q="Convert 200 usd to inr">Currency</button><button class="btn" data-q="Tell me a joke">No matching tool</button></div><div id="mco"></div></div>`;
 const o=p.querySelector("#mco"), q=p.querySelector("#mcq");
 function step(n,t,body){ return `<div class="rt-rag"><b>${n}. ${t}</b><pre class="rt-out" style="margin:8px 0 0">${esc(body)}</pre></div>`; }
 function go(){
  const s=q.value.toLowerCase(); let name=null,args={},res=null,ans="";
  if(/weather|rain|temperature|hot|cold/.test(s)){ const c=Object.keys(CITY).find(k=>s.includes(k)); if(c){ name="get_weather"; args={city:c}; res={temp_c:CITY[c][0],sky:CITY[c][1]}; ans=`In ${c[0].toUpperCase()+c.slice(1)} it is ${res.temp_c} °C and ${res.sky.toLowerCase()}.`; } }
  else if(/calendar|meeting|events|schedule|plan/.test(s)){ const d=s.includes("tomorrow")?"tomorrow":"today"; name="get_events"; args={day:d}; res={events:EV[d]}; ans=`${d[0].toUpperCase()+d.slice(1)} you have: ${EV[d].join("; ")}.`; }
  else if(/convert|usd|inr|dollar|rupee/.test(s)){ const m=s.match(/(\d+(?:\.\d+)?)/); const from=/usd|dollar/.test(s)&&/(to|in)\s*(inr|rupee)/.test(s)?"usd":(/inr|rupee/.test(s)&&/(to|in)\s*(usd|dollar)/.test(s)?"inr":null); if(m&&from){ const to=from==="usd"?"inr":"usd"; name="convert_currency"; args={amount:+m[1],from,to}; res={result:+(m[1]*FX[from][to]).toFixed(2)}; ans=`${m[1]} ${from.toUpperCase()} is about ${res.result} ${to.toUpperCase()} (demo rate).`; } }
  o.innerHTML = step(1,"Client asks the server: what tools do you have?","tools/list -> [get_weather, get_events, convert_currency]")
   + (name ? step(2,"Model chooses a tool and fills the inputs","tools/call "+name+"\n"+JSON.stringify(args,null,2)) + step(3,"Server runs the tool and returns data",JSON.stringify(res,null,2)) + step(4,"Agent answers in plain language",ans)
            : step(2,"Model decides no tool fits","No call is made. The agent answers from its own knowledge or says it cannot help with that."));
 }
 p.querySelector("#mcb").onclick=go; q.addEventListener("keydown",e=>{ if(e.key==="Enter") go(); });
 p.querySelectorAll(".rt-opts .btn").forEach(b=>b.onclick=()=>{ q.value=b.dataset.q; go(); }); go();
}

/* ---- LLM engineering: prompt and token workbench (estimates only) ---- */
function llmTool(p){
 p.innerHTML=`<div class="rt-card"><h2>LLM prompt workbench</h2>${note("Build a prompt the way you would send it to a model, and see a rough size and cost estimate. Tokens are estimated at about 4 characters each; real counts depend on the model.")}
 <label class="rt-l">System instruction <input id="lms" class="rt-in" value="You are a helpful tutor. Reply in 2 short sentences."></label>
 <label class="rt-l">User message <textarea id="lmu" class="rt-ed" rows="3">What is a Python list?</textarea></label>
 <label class="rt-l"><input type="checkbox" id="lmj"> Ask for a JSON answer (structured output)</label>
 <div class="rt-sl"><label>Expected reply length (tokens) <input id="lmo" type="number" value="80"></label><label>Price per 1M input tokens (USD) <input id="lmp" type="number" value="1" step="0.1"></label><label>Price per 1M output tokens (USD) <input id="lmq" type="number" value="4" step="0.1"></label></div>
 <h3>Messages sent</h3><pre class="rt-out" id="lmm"></pre><div id="lmr" class="rt-az-out"></div></div>`;
 const g=id=>p.querySelector("#"+id);
 function upd(){
  const sys=g("lms").value, user=g("lmu").value+(g("lmj").checked?'\nReturn only JSON: {"answer": "...", "confidence": "high|medium|low"}':"");
  g("lmm").textContent=JSON.stringify([{role:"system",content:sys},{role:"user",content:user}],null,2);
  const tin=Math.ceil((sys.length+user.length)/4)+8, tout=+g("lmo").value||0, cost=(tin*(+g("lmp").value||0)+tout*(+g("lmq").value||0))/1e6;
  g("lmr").innerHTML=[["Input tokens (estimate)",tin],["Output tokens (your guess)",tout],["Cost of one call",`$${cost.toFixed(6)}`],["Cost of 10,000 calls",`$${(cost*10000).toFixed(2)}`]].map(([a,b])=>`<div class="rt-azr"><b>${a}</b><span></span><i>${b}</i></div>`).join("");
 }
 p.querySelectorAll("input,textarea").forEach(i=>i.oninput=upd); upd();
}

window.RDTOOLS = { show, mount: (id, el) => { const f = ({js:jsTool, sql:sqlTool, api:apiTool, dsa:dsaTool, vec:vecTool, git:gitTool, java:javaTool, linux:linuxTool, docker:dockerTool, azure:azureTool, dbx:dbxTool, ml:mlTool, rag:ragTool, sys:sysTool, sec:secTool, mcp:mcpTool, llm:llmTool})[id]; if (f) f(el); return !!f; } };
if (location.hash === "#tools") window.dispatchEvent(new HashChangeEvent("hashchange"));
})();
