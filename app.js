// Halfplate prototype app logic (no build step, no dependencies).
const st={tab:"explore",view:"list",q:"",f:new Set(),sort:"match",target:30,budget:18,appetite:"s",saved:new Set(["kombu"]),tip:true};
try{const s=JSON.parse(localStorage.getItem("hp2")||"null");if(s){st.saved=new Set(s.saved);st.target=s.target;st.budget=s.budget;st.appetite=s.appetite}}catch(e){}
const persist=()=>{try{localStorage.setItem("hp2",JSON.stringify({saved:[...st.saved],target:st.target,budget:st.budget,appetite:st.appetite}))}catch(e){}};

const $=s=>document.querySelector(s), screen=$("#screen"), sheet=$("#sheet");
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const avg=v=>{const r=v.r;return (r.portion+r.nutrition+r.value+r.staff)/4};
const dietOK=m=>["gf","veg","df"].every(d=>!st.f.has(d)||m.diet.includes(d));
function mealScore(m){ // 0-100 fit to the diner's own targets
  const prot=Math.min(m.p/st.target,1)*40;
  const cap=APPETITE[st.appetite][1];
  const portion=m.g<=cap?25:Math.max(0,25-(m.g-cap)/4);
  const price=m.price<=st.budget?25:Math.max(0,25-(m.price-st.budget)*3);
  return Math.round(prot+portion+price+(m.gentle?10:0));
}
function mealOK(m){
  if(!dietOK(m))return false;
  if(st.f.has("cheap")&&m.price>=15)return false;
  if(st.f.has("protein")&&m.p<25)return false;
  if(st.f.has("gentle")&&!m.gentle)return false;
  return true;
}
const bestMeal=v=>{const ms=v.meals.filter(mealOK);return ms.length?ms.reduce((a,b)=>mealScore(b)>mealScore(a)?b:a):null};
function match(v){
  if(st.q){const q=st.q.toLowerCase();if(![v.name,v.sub,v.cuisine,...v.meals.map(m=>m.d)].join(" ").toLowerCase().includes(q))return false}
  for(const k of ["half","fair","kids"])if(st.f.has(k)&&!v.f[k])return false;
  if(st.f.has("open")&&!v.open)return false;
  return !!bestMeal(v);
}
function results(){
  const r=V.filter(match);
  const key={match:v=>-(mealScore(bestMeal(v))*0.7+avg(v)*6),price:v=>bestMeal(v).price,protein:v=>-bestMeal(v).p,near:v=>v.km}[st.sort];
  return r.sort((a,b)=>key(a)-key(b));
}
const grad=h=>`background:linear-gradient(135deg,${h},color-mix(in srgb,${h} 55%,#000))`;
const money=n=>"$"+n;
function card(v){
  const m=bestMeal(v)||v.meals[0];
  const badge=[v.f.half&&["g","Half serves"],v.f.fair&&["a","Fair half-price"],v.f.kids&&["","Kids' menu OK"],v.f.lunch&&["","Lunch sizes"]].filter(Boolean).slice(0,3);
  return `<button class="card" data-open="${v.id}">
    <div class="thumb" style="${grad(v.hue)}"><span class="pill">${v.cuisine}</span>${v.partner?'<span class="pill">✓ Verified small-plate menu</span>':""}</div>
    <div class="cbody">
      <div class="crow"><span class="cname">${esc(v.name)}</span><span class="rating"><i>★</i> ${avg(v).toFixed(1)} <span class="meta">(${v.n})</span></span></div>
      <div class="meta">${v.sub} · ${v.km.toFixed(1)} km${v.open?"":" · Closed now"}</div>
      <div class="badges">${badge.map(([c,l])=>`<span class="pill ${c}">${l}</span>`).join("")}</div>
      <div class="best"><span class="lbl">Best small meal for you · <span class="match">${mealScore(m)}% match</span></span>
        <span>${esc(m.d)}<br><small>${m.p} g protein · ${m.g} g serve</small></span>
        <span class="price">${money(m.price)}${m.full?`<br><small>was ${money(m.full)}</small>`:""}</span></div>
    </div></button>`;
}
function renderExplore(){
  const r=results(), sortL=SORTS.find(s=>s[0]===st.sort)[1];
  screen.innerHTML=`<div class="top" id="top">
    <div class="hello"><div><h2>Small plates near you</h2><div class="loc">Fitzroy, Melbourne</div></div>
      <button class="me-chip" data-goto="me">${st.target} g · ${money(st.budget)} · ${APPETITE[st.appetite][0]}</button></div>
    <label class="search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>
      <input id="q" placeholder="Search venues, dishes, suburbs" value="${esc(st.q)}" aria-label="Search"></label>
    <div class="chips">${FILTERS.map(([k,l,d])=>`<button class="chip${d?" diet":""}" data-f="${k}" aria-pressed="${st.f.has(k)}">${l}</button>`).join("")}</div>
    <div class="seg"><button class="sort" id="sort">${r.length} place${r.length===1?"":"s"} · Sort: <b>${sortL}</b> ▾</button>
      <div class="toggle"><button data-v="list" aria-pressed="${st.view==="list"}">List</button><button data-v="map" aria-pressed="${st.view==="map"}">Map</button></div></div>
  </div>
  ${r.length===0?`<div class="empty">No places have a small meal that fits all of those filters.<br><button class="btn2" id="clear">Clear filters</button></div>`:
    st.view==="list"?`<div class="list">${r.map(card).join("")}</div>`:mapView(r)}`;
  $("#q").addEventListener("input",e=>{st.q=e.target.value;const p=e.target.selectionStart;renderExplore();const q=$("#q");q.focus();q.setSelectionRange(p,p)});
}
function mapView(r){
  const pins=r.map(v=>{const m=bestMeal(v);
    return `<g class="pin" data-open="${v.id}" transform="translate(${v.x*3.6+10},${v.y*5+30})" tabindex="0" role="button" aria-label="${esc(v.name)}, ${money(m.price)}">
      <rect x="-22" y="-30" width="44" height="22" rx="11" fill="${v.partner?"var(--brand)":"var(--ink)"}"/>
      <path d="M-5 -9 0 -2 5 -9z" fill="${v.partner?"var(--brand)":"var(--ink)"}"/>
      <text x="0" y="-15" text-anchor="middle" fill="var(--surface)">${money(m.price)}</text></g>`}).join("");
  return `<div class="mapbox"><svg viewBox="0 0 380 560" preserveAspectRatio="xMidYMid slice" aria-label="Map of sample venues with cheapest small meal">
    <rect width="380" height="560" fill="var(--map-land)"/>
    <path d="M0 490 C80 460 140 520 220 500 S340 450 380 470 V560 H0z" fill="var(--map-water)"/>
    <rect x="150" y="130" width="70" height="60" rx="8" fill="var(--map-park)"/><rect x="250" y="330" width="90" height="50" rx="8" fill="var(--map-park)"/>
    <g stroke="var(--map-road)" stroke-width="9" fill="none" stroke-linecap="round"><path d="M0 100H380M0 240H380M0 370H380M60 0V560M190 0V560M310 0V560M0 0L380 430"/></g>
    <g stroke="var(--map-road)" stroke-width="4" fill="none"><path d="M0 170H380M0 310H380M125 0V560M250 0V560"/></g>
    <circle cx="168" cy="180" r="7" fill="#2E7DD1" stroke="#fff" stroke-width="3"/>
    ${pins}</svg>
    <div class="mapcard">${card(r[0])}</div></div>`;
}
function renderSpecials(){
  screen.innerHTML=`<div class="pane"><h2>Small-plate specials</h2><p>Deals from verified venues, priced for smaller appetites.</p>
   ${SPECIALS.map(s=>{const v=V.find(x=>x.id===s.v);return `<button class="special" data-open="${v.id}">
     <div class="sp-top" style="${grad(v.hue)}"><span>${esc(v.name)} · ${v.sub}</span><b>${esc(s.title)}</b><span>${s.when}</span></div>
     <div class="sp-b"><span class="meta">${s.was?`Usually ${money(s.was)} · save ${money(s.was-s.price)}`:"Only at this venue"}</span><span class="price">${money(s.price)}</span></div></button>`}).join("")}
   <p class="note">Venues pay a monthly fee to list specials here.</p></div>`;
}
function renderSaved(){
  const r=V.filter(v=>st.saved.has(v.id));
  screen.innerHTML=`<div class="pane"><h2>Saved</h2>${r.length?`<div style="display:grid;gap:12px">${r.map(card).join("")}</div>`:
    `<p>Tap the heart on any venue to keep it here.</p>`}</div>`;
}
function renderMe(){
  screen.innerHTML=`<div class="pane"><h2>My eating goals</h2><p>Every match score uses these.</p>
   <div>
    <div class="setting"><div><b>Protein per meal</b><span>Many GLP-1 users aim for 25–35 g</span></div>
      <div class="stepper"><button data-step="target,-5" aria-label="Less protein">−</button><output>${st.target} g</output><button data-step="target,5" aria-label="More protein">+</button></div></div>
    <div class="setting"><div><b>Budget per meal</b><span>Small meals over this score lower</span></div>
      <div class="stepper"><button data-step="budget,-2" aria-label="Lower budget">−</button><output>${money(st.budget)}</output><button data-step="budget,2" aria-label="Higher budget">+</button></div></div>
    <div class="setting"><div><b>Appetite right now</b><span>Sets the portion size we look for</span></div>
      <div class="segbtn">${Object.entries(APPETITE).map(([k,[l]])=>`<button data-app="${k}" aria-pressed="${st.appetite===k}">${l.replace("Very ","V. ")}</button>`).join("")}</div></div>
    ${[["gf","Gluten-free"],["veg","Vegetarian"],["df","Dairy-free"],["gentle","Queasy-day mode"]].map(([k,l])=>`
    <div class="setting"><div><b>${l}</b><span>${k==="gentle"?"Only show gentle, low-grease meals":"Only show meals that fit"}</span></div><button class="sw" data-sw="${k}" role="switch" aria-checked="${st.f.has(k)}" aria-label="${l}"></button></div>`).join("")}
   </div>
   <p class="note">Halfplate gives food guidance, not medical advice. Check protein targets with your prescriber or dietitian.</p></div>`;
}
function render(){
  document.querySelectorAll(".tabs button").forEach(b=>b.setAttribute("aria-selected",b.dataset.tab===st.tab));
  ({explore:renderExplore,specials:renderSpecials,saved:renderSaved,me:renderMe})[st.tab]();
}
function openSheet(id){
  const v=V.find(x=>x.id===id), saved=st.saved.has(id);
  const ms=[...v.meals].sort((a,b)=>mealScore(b)-mealScore(a));
  const P=[["half","Half serves"],["lunch","Lunch sizes"],["kids","Kids' menu for adults"],["fair","Fair half-price"],["box","Takeaway box offered"]];
  const R=[["portion","Portion options"],["nutrition","Nutrition"],["value","Value"],["staff","Staff attitude"]];
  sheet.innerHTML=`<div class="hero" style="${grad(v.hue)}">
      <button class="iconbtn" id="close" aria-label="Back"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 5l-7 7 7 7"/></svg></button>
      <button class="iconbtn" id="save" aria-label="${saved?"Remove from saved":"Save"}" aria-pressed="${saved}"><svg width="18" height="18" viewBox="0 0 24 24" fill="${saved?"#C0392B":"none"}" stroke="${saved?"#C0392B":"currentColor"}" stroke-width="2"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></svg></button></div>
    <div class="sbody">
      <div style="display:grid;gap:6px"><h3>${esc(v.name)}</h3>
        <div class="meta">${v.cuisine} · ${v.sub} · ${v.km.toFixed(1)} km · ${v.open?"Open now":"Closed now"}</div>
        <div class="badges"><span class="pill a">★ ${avg(v).toFixed(1)} Small Plate rating</span>${v.partner?'<span class="pill g">✓ Verified menu</span>':""}</div></div>
      <div class="sec"><h4><span>Diner ratings</span><span>${v.n} ratings</span></h4><div class="bars">
        ${R.map(([k,l])=>`<div class="bar"><span>${l}</span><div class="track"><div class="fill" style="width:${v.r[k]/5*100}%"></div></div><b>${v.r[k].toFixed(1)}</b></div>`).join("")}</div></div>
      <div class="sec"><h4>Portion policy</h4><div class="policy">${P.map(([k,l])=>`<div class="pol ${v.f[k]?"yes":"no"}"><span class="dot">${v.f[k]?"✓":"–"}</span>${l}</div>`).join("")}</div></div>
      <div class="ask"><b>What to ask for:</b> ${esc(v.tip)}</div>
      <div class="sec"><h4><span>Small meals</span><span>for ${st.target} g · ${money(st.budget)}</span></h4>
        ${ms.map((m,i)=>`<div class="dish${i===0?" top1":""}"><div class="crow"><b>${esc(m.d)}</b><span class="price">${money(m.price)}</span></div>
          <div class="crow"><span class="match">${mealScore(m)}% match${i===0?" · best for you":""}</span>${m.full?`<span class="save">Saves ${money(m.full-m.price)} vs full serve</span>`:""}</div>
          <div class="nums"><div class="num"><b>${m.p} g</b><span>Protein</span></div><div class="num"><b>${m.g} g</b><span>Serve</span></div><div class="num"><b>${m.k}</b><span>kcal</span></div></div>
          ${m.gentle||m.diet.length?`<div class="badges">${m.gentle?'<span class="pill g">Gentle</span>':""}${m.diet.map(d=>`<span class="pill">${{gf:"GF",veg:"Vegetarian",df:"Dairy-free"}[d]}</span>`).join("")}</div>`:""}
        </div>`).join("")}</div>
      <div class="sec"><h4>What diners report</h4><ul class="reports">${v.notes.map(([t,c])=>`<li><span>${esc(t)}</span><span>${c} diners</span></li>`).join("")}</ul></div>
      <div style="display:grid;gap:8px"><button class="cta" id="dir">Get directions</button><button class="cta ghost" id="rate">Rate my small meal here</button></div>
      <p class="note">Sample listing. Prices, nutrition and ratings are illustrative.</p>
    </div>`;
  sheet.classList.add("open");sheet.setAttribute("aria-hidden","false");sheet.scrollTop=0;
  $("#close").onclick=closeSheet;
  $("#save").onclick=()=>{saved?st.saved.delete(id):st.saved.add(id);persist();openSheet(id);if(st.tab==="saved")renderSaved()};
  $("#dir").onclick=e=>{e.target.textContent="Directions open in the full app";e.target.disabled=true};
  $("#rate").onclick=e=>{e.target.textContent="Ratings open in v0.3";e.target.disabled=true};
  $("#close").focus();
}
function closeSheet(){sheet.classList.remove("open");sheet.setAttribute("aria-hidden","true")}

document.querySelector(".tabs").addEventListener("click",e=>{const b=e.target.closest("[data-tab]");if(!b)return;closeSheet();st.tab=b.dataset.tab;screen.scrollTop=0;render()});
screen.addEventListener("click",e=>{
  const t=e.target;
  const o=t.closest("[data-open]");if(o)return openSheet(o.dataset.open);
  const f=t.closest("[data-f]");if(f){const k=f.dataset.f;st.f.has(k)?st.f.delete(k):st.f.add(k);return renderExplore()}
  const v=t.closest("[data-v]");if(v){st.view=v.dataset.v;return renderExplore()}
  if(t.closest("#sort")){const i=SORTS.findIndex(s=>s[0]===st.sort);st.sort=SORTS[(i+1)%SORTS.length][0];return renderExplore()}
  if(t.closest("#clear")){st.f.clear();st.q="";return renderExplore()}
  const g=t.closest("[data-goto]");if(g){st.tab=g.dataset.goto;return render()}
  const s=t.closest("[data-step]");if(s){const [k,d]=s.dataset.step.split(",");st[k]=k==="target"?Math.min(60,Math.max(15,st[k]+ +d)):Math.min(40,Math.max(8,st[k]+ +d));persist();return renderMe()}
  const a=t.closest("[data-app]");if(a){st.appetite=a.dataset.app;persist();return renderMe()}
  const w=t.closest("[data-sw]");if(w){const k=w.dataset.sw;st.f.has(k)?st.f.delete(k):st.f.add(k);return renderMe()}
});
screen.addEventListener("keydown",e=>{if(e.key==="Enter"){const o=e.target.closest("g[data-open]");if(o)openSheet(o.dataset.open)}});
screen.addEventListener("scroll",()=>{const t=$("#top");if(t)t.classList.toggle("scrolled",screen.scrollTop>4)});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeSheet()});
render();
