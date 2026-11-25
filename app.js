// Halfplate — Melbourne small-meal guide. Plain JS, no build step.
// Routes: #/  #/explore?q=&near=&f=&sort=  #/place/<id>  #/lists  #/list/<id>  #/specials  #/add  #/business  #/how
(function(){
"use strict";

const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const money = n => "$" + n;
const byId = Object.fromEntries(VENUES.map(v => [v.id, v]));
const store = {
  get(k, d){ try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch(e){ return d; } },
  set(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }
};
const img = (src, w, alt="") => src ? `<img src="${src}&w=${w}" srcset="${src}&w=${w} 1x, ${src}&w=${w*2} 2x" alt="${esc(alt)}" loading="lazy">` : "";

const OFFERS = { half:"Half serves", lunch:"Lunch sizes", entree:"Entrée as a main", kids:"Kids' menu for adults", fair:"Fair price for smaller sizes", box:"Takeaway boxes" };
const DIETS = { gf:"Gluten-free", veg:"Vegetarian", df:"Dairy-free" };
const FILTERS = [["half","Half serves"],["lunch","Lunch sizes"],["entree","Entrée as a main"],["kids","Kids' menu OK"],["fair","Fair price"],["cheap","Under $15"],["protein","25 g+ protein"],["gf","Gluten-free"],["veg","Vegetarian"],["df","Dairy-free"]];
const SORTS = [["rating","Top rated"],["price","Cheapest"],["protein","Most protein"],["reviews","Most reviewed"]];

const avg = v => (v.rating.portion + v.rating.value + v.rating.nutrition + v.rating.staff) / 4;
const cheapest = v => v.meals.reduce((a,b) => b.price < a.price ? b : a);
const dollars = n => "$".repeat(n);
const RANKED = [...VENUES].sort((a,b) => avg(b) - avg(a));
const rank = v => RANKED.indexOf(v) + 1;
// Rating bubbles: 5 circles, filled in halves
const bubbles = s => {
  const r = Math.round(s * 2) / 2;
  let h = "";
  for (let i = 1; i <= 5; i++) {
    const fill = r >= i ? 1 : r >= i - .5 ? .5 : 0;
    h += `<svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/>${fill === 1 ? '<circle cx="7" cy="7" r="4.3" fill="currentColor"/>' : fill ? '<path d="M7 2.7a4.3 4.3 0 0 0 0 8.6z" fill="currentColor"/>' : ""}</svg>`;
  }
  return `<span class="bub" role="img" aria-label="${s.toFixed(1)} out of 5">${h}</span>`;
};
const rating = (v, long) => `<span class="rate">${bubbles(avg(v))} <b class="num">${avg(v).toFixed(1)}</b> <span class="num">${v.ratingCount} ${long ? "diner ratings" : "ratings"}</span></span>`;

/* ---------- routing ---------- */
function parse(){
  const h = location.hash.replace(/^#\/?/, "");
  const [path, qs] = h.split("?");
  const parts = path.split("/").filter(Boolean);
  return { page: parts[0] || "home", id: parts[1], params: new URLSearchParams(qs || "") };
}
let current = null;
function route(){
  const r = parse();
  const pages = { home, explore, place, lists, list, specials, add, business, how };
  document.body.classList.toggle("explore-page", r.page === "explore");
  $$("#nav a").forEach(a => a.classList.toggle("on", a.dataset.nav === r.page || (r.page === "list" && a.dataset.nav === "lists") || (r.page === "place" && a.dataset.nav === "explore")));
  $("#nav").classList.remove("open"); $("#menuBtn").setAttribute("aria-expanded", "false");
  (pages[r.page] || notFound)(r);
  if (!(r.page === "explore" && current === "explore")) window.scrollTo(0, 0);
  current = r.page;
}
window.addEventListener("hashchange", route);
const exploreLink = p => {
  const sp = new URLSearchParams();
  if (p.q) sp.set("q", p.q);
  if (p.near) sp.set("near", p.near);
  if (p.f && p.f.length) sp.set("f", p.f.join(","));
  if (p.sort && p.sort !== "rating") sp.set("sort", p.sort);
  const s = sp.toString();
  return "#/explore" + (s ? "?" + s : "");
};
const setTitle = t => document.title = t ? `${t} – Halfplate` : "Halfplate – eat small in Melbourne";

/* ---------- shared pieces ---------- */
const card = v => {
  const m = cheapest(v);
  return `<a class="card" href="#/place/${v.id}">
    <div class="ph">${img(v.photo, 480, "")}${v.example ? `<span class="example">Example</span>` : ""}</div>
    <span class="kicker">${v.suburb} · ${esc(v.cuisine)}</span>
    <h3>${esc(v.name)}</h3>
    <p>${esc(m.name)}, ${esc(m.note.toLowerCase())}. ${money(m.price)} for ${m.protein} g of protein.</p>
    ${rating(v)}
  </a>`;
};
const listCard = l => {
  const n = VENUES.filter(l.pick).length;
  return `<a class="list-card" href="#/list/${l.id}"><div class="ph">${img(l.photo, 640)}</div>
    <span class="kicker">${esc(l.kicker)}</span><h3>${esc(l.title)}</h3><p>${esc(l.dek)} <span class="num">${n} places.</span></p></a>`;
};

/* ---------- home ---------- */
function home(){
  setTitle("");
  const top = RANKED.slice(0, 8);
  const counts = Object.fromEntries(SUBURBS.map(s => [s, VENUES.filter(v => v.suburb === s).length]));
  $("#app").innerHTML = `
  <div class="shell">
    <section class="lead">
      <a class="lead-main" href="#/explore">
        <div class="ph">${img(SITE_PHOTOS.hero, 1100, "Diners at outdoor tables on a city street at night")}</div>
        <span class="kicker">The guide</span>
        <h1>Eat less, <span class="hl">pay less.</span> Melbourne's best small meals.</h1>
        <p class="dek">Half serves, lunch sizes and entrées that work as a main. Where to find them, what to ask for, and what it'll cost.</p>
      </a>
      <aside class="lead-side">
        <span class="kicker">The lists</span>
        ${LISTS.map(l => `<a class="side-item" href="#/list/${l.id}"><div><span class="kicker mute">${esc(l.kicker)}</span><h3>${esc(l.title)}</h3></div>${img(l.photo, 192)}</a>`).join("")}
        <div class="side-cta"><h3>Found a good half serve?</h3><p>Tell us where. Every listing on Halfplate comes from diners.</p><a class="btn dark sm" href="#/add">Add a place</a></div>
      </aside>
    </section>

    <section class="find">
      <form id="find" role="search">
        <label class="t" for="fq">Find a small meal</label>
        <input id="fq" name="q" placeholder="Pho, dumplings, a suburb…">
        <select name="near" aria-label="Suburb"><option value="">All of Melbourne</option>${SUBURBS.map(s => `<option>${s}</option>`).join("")}</select>
        <button type="submit">Search</button>
      </form>
      <div class="quick"><span>Popular:</span><a href="${exploreLink({ f:["half"] })}">Half serves</a><a href="${exploreLink({ f:["cheap"] })}">Under $15</a><a href="${exploreLink({ f:["protein"] })}">25 g+ protein</a><a href="${exploreLink({ f:["kids"] })}">Kids' menu OK</a><a href="${exploreLink({ f:["gf"] })}">Gluten-free</a></div>
    </section>

    <section class="block">
      <div class="sec-head"><h2>Top rated right now</h2><a href="#/explore">See them on the map →</a></div>
      <div class="grid4">${top.map(card).join("")}</div>
    </section>

    <section class="block">
      <div class="sec-head"><h2>By suburb</h2></div>
      <div class="suburbs">${SUBURBS.map(s => `<a href="${exploreLink({ near:s })}"><b>${s}</b><span class="num">${counts[s]} ${counts[s] === 1 ? "place" : "places"}</span></a>`).join("")}</div>
    </section>

    <section class="contrib">
      <div><h2>Know where to get half a parma?</h2><p>Halfplate is built by people who eat less. Add a place, a dish and what you paid. It takes a minute.</p></div>
      <a class="btn dark" href="#/add">Add a place</a>
    </section>
  </div>`;
  $("#find").addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    location.hash = exploreLink({ q: fd.get("q").trim(), near: fd.get("near") });
  });
}

/* ---------- explore (list + map) ---------- */
const mealOK = (m, f) => !(f.has("cheap") && m.price >= 15) && !(f.has("protein") && m.protein < 25);
function results(q, near, f, sort){
  const ql = q.toLowerCase();
  const out = VENUES.filter(v => {
    if (near && v.suburb !== near) return false;
    if (ql && ![v.name, v.cuisine, v.suburb, v.street, ...v.meals.map(m => m.name)].join(" ").toLowerCase().includes(ql)) return false;
    for (const k of Object.keys(OFFERS)) if (f.has(k) && !v.features[k]) return false;
    for (const d of Object.keys(DIETS)) if (f.has(d) && !v.diet.includes(d)) return false;
    return v.meals.some(m => mealOK(m, f));
  }).map(v => {
    const ms = v.meals.filter(m => mealOK(m, f));
    return { v, m: sort === "protein" ? ms.reduce((a,b) => b.protein > a.protein ? b : a) : ms.reduce((a,b) => b.price < a.price ? b : a) };
  });
  const key = { rating: x => -avg(x.v), reviews: x => -x.v.ratingCount, price: x => x.m.price, protein: x => -x.m.protein }[sort];
  return out.sort((a,b) => key(a) - key(b));
}
let map = null, layer = null, pins = {};
function explore(r){
  const q = r.params.get("q") || "", near = r.params.get("near") || "", sort = r.params.get("sort") || "rating";
  const f = new Set((r.params.get("f") || "").split(",").filter(Boolean));
  if (!$("#explore")) {
    $("#app").innerHTML = `
    <div class="explore" id="explore">
      <div class="ex-list">
        <div class="ex-head">
          <h1 id="exTitle"></h1>
          <form class="ex-search" id="exSearch" role="search">
            <input id="exq" placeholder="Search dishes, cuisines, places" aria-label="Search">
            <select id="exnear" aria-label="Suburb"><option value="">All of Melbourne</option>${SUBURBS.map(s => `<option>${s}</option>`).join("")}</select>
          </form>
        </div>
        <div class="ex-filters" id="exFilters">${FILTERS.map(([k,l]) => `<label class="chip"><input type="checkbox" value="${k}"><span>${l}</span></label>`).join("")}</div>
        <div class="ex-sort"><span id="exCount"></span><label>Sort: <select id="exsort">${SORTS.map(([k,l]) => `<option value="${k}">${l}</option>`).join("")}</select></label></div>
        <div id="exRows"></div>
        <p class="ex-note">Listings marked Example are placeholders while we build the guide.</p>
      </div>
      <div class="ex-map"><div id="map"></div></div>
      <button class="map-toggle" id="mapToggle" type="button">Show map</button>
    </div>`;
    const read = () => ({ q: $("#exq").value.trim(), near: $("#exnear").value, sort: $("#exsort").value, f: $$("#exFilters input:checked").map(i => i.value) });
    const update = () => { history.replaceState(null, "", exploreLink(read())); route(); };
    let t; $("#exq").addEventListener("input", () => { clearTimeout(t); t = setTimeout(update, 250); });
    $("#exSearch").addEventListener("submit", e => { e.preventDefault(); update(); });
    $("#exnear").addEventListener("change", update);
    $("#exsort").addEventListener("change", update);
    $("#exFilters").addEventListener("change", update);
    $("#mapToggle").addEventListener("click", () => {
      const x = $("#explore"); x.classList.toggle("map-on");
      $("#mapToggle").textContent = x.classList.contains("map-on") ? "Show list" : "Show map";
      if (map) setTimeout(() => { map.invalidateSize(); fit(); }, 30);
    });
    initMap();
  }
  if (document.activeElement !== $("#exq")) $("#exq").value = q;
  $("#exnear").value = near; $("#exsort").value = sort;
  $$("#exFilters input").forEach(i => i.checked = f.has(i.value));
  setTitle(near ? `Small meals in ${near}` : "Explore");

  const res = results(q, near, f, sort);
  $("#exTitle").textContent = q ? `“${q}”` : `Small meals in ${near || "Melbourne"}`;
  $("#exCount").innerHTML = `<span class="num">${res.length}</span> ${res.length === 1 ? "place" : "places"}` + (q || near || f.size ? ` · <button type="button" id="exReset">Clear</button>` : "");
  if ($("#exReset")) $("#exReset").onclick = () => { location.hash = "#/explore"; };
  $("#exRows").innerHTML = res.length ? res.map(({ v, m }, i) => `
    <a class="row" href="#/place/${v.id}" data-id="${v.id}">
      <div class="ph">${img(v.photo, 300)}<span class="n num">${i+1}</span></div>
      <div>
        <span class="kicker mute">${v.suburb} · ${esc(v.cuisine)} · ${dollars(v.price)}</span>
        <h2>${esc(v.name)}</h2>
        ${rating(v)}
        <p class="rank">#${rank(v)} of ${VENUES.length} small-meal spots in Melbourne${v.example ? " · Example" : ""}</p>
        <p class="quote">“${esc(v.reports[0][0])}”</p>
        <div class="meal"><b>${esc(m.name)}</b> · ${esc(m.note)} · ${m.protein} g protein · <b class="num">${money(m.price)}</b></div>
      </div>
    </a>`).join("") : `<div class="empty"><h2>Nothing here yet</h2><p>No places match all of that. Try fewer filters, or <a href="#/add">add one you know</a>.</p></div>`;
  $$(".row").forEach(el => {
    el.addEventListener("mouseenter", () => mark(el.dataset.id, true));
    el.addEventListener("mouseleave", () => mark(el.dataset.id, false));
  });
  drawPins(res);
}
const tiles = () => L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
  maxZoom: 19, subdomains: "abcd",
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
});
function initMap(){
  if (typeof L === "undefined") { map = null; return; }
  map = L.map("map").setView([-37.81, 144.975], 13);
  tiles().addTo(map);
  layer = L.layerGroup().addTo(map);
}
function drawPins(res){
  if (!map) return;
  layer.clearLayers(); pins = {};
  res.forEach(({ v, m }) => {
    const mk = L.marker([v.lat, v.lng], { title: v.name, icon: L.divIcon({ className: "", html: `<span class="pin num" data-pin="${v.id}">${money(m.price)}</span>`, iconSize: null }) })
      .bindPopup(`<a href="#/place/${v.id}">${esc(v.name)}</a><br>${esc(m.name)} · ${money(m.price)}`);
    mk.on("mouseover", () => mark(v.id, true)); mk.on("mouseout", () => mark(v.id, false));
    mk.addTo(layer); pins[v.id] = mk;
  });
  fit();
}
function fit(){
  const pts = Object.values(pins).map(m => m.getLatLng());
  if (!map || !pts.length) return;
  pts.length === 1 ? map.setView(pts[0], 15) : map.fitBounds(L.latLngBounds(pts), { padding: [48, 48], maxZoom: 15 });
}
function mark(id, on){
  const a = $(`.row[data-id="${id}"]`); if (a) a.classList.toggle("on", on);
  const p = $(`[data-pin="${id}"]`); if (p) p.classList.toggle("on", on);
  if (pins[id]) pins[id].setZIndexOffset(on ? 1000 : 0);
}

/* ---------- place ---------- */
function place(r){
  const v = byId[r.id]; if (!v) return notFound();
  setTitle(`${v.name}, ${v.suburb}`);
  const s = avg(v), revs = store.get("hp_reviews", {})[v.id] || [];
  const R = [["portion","Portion options"],["value","Value"],["nutrition","Nutrition"],["staff","Staff"]];
  $("#app").innerHTML = `
  <div class="hero">${img(v.photo, 1600, "")}${v.example ? `<span class="example">Example listing</span>` : ""}</div>
  <div class="shell">
    <div class="place-top">
      <span class="kicker">${v.suburb} · ${esc(v.cuisine)}</span>
      <h1>${esc(v.name)}</h1>
      <div>${rating(v, true)} <span class="rank-inline">#${rank(v)} of ${VENUES.length} small-meal spots in Melbourne</span></div>
      <p class="dek">${esc(v.tip)}</p>
    </div>
    <div class="facts">
      <div><span class="kicker">Small meals from</span><b class="num">${money(cheapest(v).price)}</b></div>
      <div><span class="kicker">Price</span><b>${dollars(v.price)}</b></div>
      <div><span class="kicker">Address</span><b>${esc(v.street)}, ${v.suburb}</b></div>
      <div><span class="kicker">Hours</span><b>${esc(v.hours)}</b></div>
    </div>
    <div class="place-body">
      <div>
        <section class="part">
          <h2>What to order <small>${v.meals.length} small meals</small></h2>
          <div class="twrap"><table class="menu">
            <thead><tr><th>Dish</th><th>Protein</th><th class="x">Serve</th><th class="x">Energy</th><th>Price</th></tr></thead>
            <tbody>${v.meals.map(m => `<tr><td class="d">${esc(m.name)}<small>${esc(m.note)}</small></td><td class="num">${m.protein} g</td><td class="num x">${m.size} g</td><td class="num x">${m.cal} cal</td>
              <td class="p num">${money(m.price)}${m.full ? `<small>Full size ${money(m.full)}</small>` : ""}</td></tr>`).join("")}</tbody>
          </table></div>
          <p class="fine">Protein, serve size and energy are estimates.</p>
        </section>
        <section class="part">
          <h2>Ratings <small>${v.ratingCount} diners</small></h2>
          <div class="scores">
            <div class="big num">${s.toFixed(1)}<small>${bubbles(s)}</small></div>
            <div class="bars">${R.map(([k,l]) => `<div class="bar"><span>${l}</span><span class="tr"><i style="width:${v.rating[k]/5*100}%"></i></span><b class="num">${v.rating[k].toFixed(1)}</b></div>`).join("")}</div>
          </div>
          <ul class="said">${v.reports.map(([t,n]) => `<li>“${esc(t)}”<span class="num">${n} diners said this</span></li>`).join("")}</ul>
        </section>
        <section class="part">
          <h2>The details</h2>
          <ul class="offer">${Object.entries(OFFERS).map(([k,l]) => `<li class="${v.features[k] ? "" : "no"}"><span>${l}</span><b>${v.features[k] ? "Yes" : "Not confirmed"}</b></li>`).join("")}
            ${Object.entries(DIETS).map(([k,l]) => `<li class="${v.diet.includes(k) ? "" : "no"}"><span>${l} options</span><b>${v.diet.includes(k) ? "Yes" : "Not confirmed"}</b></li>`).join("")}</ul>
        </section>
        <section class="part" id="reviews">
          <h2>Reviews <small>${revs.length ? revs.length + " on this device" : ""}</small></h2>
          ${revs.length ? revs.map(x => `<div class="rev">${bubbles(x.stars)} <span class="meta">${esc(x.date)}${x.dish ? " · " + esc(x.dish) : ""}${x.price ? " · " + money(x.price) : ""}</span><p>${esc(x.text)}</p></div>`).join("") : `<p class="dek" style="margin:0 0 20px">No written reviews yet. Had a small meal here? Be the first.</p>`}
          <form class="form" id="revForm" style="margin-top:20px">
            <fieldset><legend>Your rating</legend><div class="stars-in" id="starsIn">${[1,2,3,4,5].map(n => `<button type="button" data-n="${n}" aria-label="${n} out of 5">${n}</button>`).join("")}</div></fieldset>
            <div class="two"><label>What did you order? <input type="text" name="dish"></label><label><span>Price paid <span class="opt">(optional)</span></span><input type="number" name="price" min="0"></label></div>
            <label class="cb"><input type="checkbox" name="smaller"> They were happy to do a smaller serve</label>
            <label class="cb"><input type="checkbox" name="fair"> The price was fair for the size</label>
            <label>Your review <textarea name="text" required></textarea></label>
            <div><button class="btn dark" type="submit">Post review</button></div>
          </form>
        </section>
      </div>
      <aside class="aside">
        <div class="mapbox"><div id="mini"></div></div>
        <div class="aside-box">
          <div><span class="kicker">Address</span><br>${esc(v.street)}, ${v.suburb} VIC</div>
          <div><span class="kicker">Hours</span><br>${esc(v.hours)}</div>
        </div>
        <div class="btns">
          <a class="btn dark" href="#reviews" id="toRev">Rate your meal</a>
          <a class="btn" href="https://www.google.com/maps/search/?api=1&query=${v.lat},${v.lng}" target="_blank" rel="noopener">Directions</a>
          <a class="btn" href="#/add?update=${v.id}">Suggest an edit</a>
        </div>
      </aside>
    </div>
  </div>`;
  if (typeof L !== "undefined") {
    const mm = L.map("mini", { zoomControl: false, dragging: false, scrollWheelZoom: false, doubleClickZoom: false, touchZoom: false }).setView([v.lat, v.lng], 15);
    tiles().addTo(mm);
    L.marker([v.lat, v.lng], { icon: L.divIcon({ className: "", html: `<span class="pin">${esc(v.name)}</span>`, iconSize: null }) }).addTo(mm);
  }
  $("#toRev").addEventListener("click", e => { e.preventDefault(); $("#reviews").scrollIntoView({ behavior: "smooth" }); });
  let n = 0;
  $("#starsIn").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    n = +b.dataset.n; $("#starsIn").classList.remove("err");
    $$("#starsIn button").forEach(x => x.classList.toggle("on", +x.dataset.n <= n));
  });
  $("#revForm").addEventListener("submit", e => {
    e.preventDefault();
    if (!n) { $("#starsIn").classList.add("err"); return; }
    const fd = new FormData(e.target), all = store.get("hp_reviews", {});
    (all[v.id] = all[v.id] || []).unshift({ stars: n, dish: fd.get("dish").trim(), price: fd.get("price") ? +fd.get("price") : null, text: fd.get("text").trim(), smaller: !!fd.get("smaller"), fair: !!fd.get("fair"), date: new Date().toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" }) });
    store.set("hp_reviews", all);
    place(r); $("#reviews").scrollIntoView();
  });
}

/* ---------- lists ---------- */
function lists(){
  setTitle("Lists");
  $("#app").innerHTML = `<div class="shell page">
    <div class="page-head"><span class="kicker">The lists</span><h1>Where to eat small</h1><p class="dek">Built from what diners tell us. They update as new places are added.</p></div>
    <div class="lists">${LISTS.map(listCard).join("")}</div>
  </div>`;
}
function list(r){
  const l = LISTS.find(x => x.id === r.id); if (!l) return notFound();
  setTitle(l.title);
  const vs = VENUES.filter(l.pick).sort((a,b) => avg(b) - avg(a));
  $("#app").innerHTML = `<div class="hero">${img(l.photo, 1600)}</div>
  <div class="shell page">
    <div class="page-head" style="border-bottom:0;margin-bottom:8px"><span class="kicker">${esc(l.kicker)}</span><h1 style="text-transform:none">${esc(l.title)}</h1><p class="dek">${esc(l.dek)}</p></div>
    ${vs.map((v,i) => { const m = cheapest(v); return `<article class="entry">
      <div class="no num">${String(i+1).padStart(2,"0")}</div>
      <div><span class="kicker">${v.suburb} · ${esc(v.cuisine)}</span><h2><a href="#/place/${v.id}">${esc(v.name)}</a></h2>
        <div style="margin-top:8px">${rating(v)}</div>
        <p>${esc(v.tip)}</p>
        <div class="order">Order: <b>${esc(m.name)}</b> (${esc(m.note.toLowerCase())}) · ${m.protein} g protein · <b class="num">${money(m.price)}</b></div></div>
      <a class="ph" href="#/place/${v.id}">${img(v.photo, 680)}${v.example ? `<span class="example">Example</span>` : ""}</a>
    </article>`; }).join("")}
  </div>`;
}

/* ---------- other pages ---------- */
function specials(){
  setTitle("Specials");
  $("#app").innerHTML = `<div class="shell page">
    <div class="page-head"><span class="kicker">Deals</span><h1>Small-meal specials</h1><p class="dek">Smaller plates at smaller prices, straight from the restaurants.</p></div>
    ${SPECIALS.map(s => { const v = byId[s.venue]; return `<a class="deal" href="#/place/${v.id}">${img(v.photo, 400)}
      <div><span class="kicker mute">${esc(v.name)} · ${v.suburb}</span><h2>${esc(s.title)}</h2><p>${esc(s.when)}</p></div>
      <div class="pr num">${money(s.price)}${s.was ? `<s>${money(s.was)}</s>` : ""}</div></a>`; }).join("")}
  </div>`;
}
function add(r){
  const u = byId[r.params.get("update")];
  setTitle(u ? "Suggest an edit" : "Add a place");
  $("#app").innerHTML = `<div class="shell page">
    <div class="page-head"><span class="kicker">Help build the guide</span><h1>${u ? "Suggest an edit" : "Add a place"}</h1>
      <p class="dek">${u ? `What's changed at ${esc(u.name)}?` : "Somewhere that'll do a half serve, a lunch size or an entrée as a main? Tell us. We check every one before it goes up."}</p></div>
    <div class="thanks" id="done" hidden>Thanks, got it. We'll check the details and get it on the map. <a href="#/explore">Back to the guide</a></div>
    <form class="form" id="addForm">
      <div class="two">
        <label>Restaurant <input type="text" name="name" required value="${u ? esc(u.name) : ""}"></label>
        <label>Suburb <select name="suburb" required><option value=""></option>${SUBURBS.map(s => `<option${u && u.suburb === s ? " selected" : ""}>${s}</option>`).join("")}<option>Somewhere else</option></select></label>
      </div>
      <fieldset><legend>What can you order smaller?</legend>
        <div class="cbs">${Object.entries(OFFERS).map(([k,l]) => `<label class="cb"><input type="checkbox" name="${k}"${u && u.features[k] ? " checked" : ""}> ${l}</label>`).join("")}</div>
      </fieldset>
      <div class="two">
        <label><span>What you ordered <span class="opt">(optional)</span></span><input type="text" name="dish"></label>
        <label><span>What it cost <span class="opt">(optional)</span></span><input type="number" name="price" min="0"></label>
      </div>
      <label><span>Anything else? <span class="opt">(what to ask for, when to go)</span></span><textarea name="notes"></textarea></label>
      <div><button class="btn dark" type="submit">Send it in</button></div>
    </form>
  </div>`;
  $("#addForm").addEventListener("submit", e => {
    e.preventDefault();
    const subs = store.get("hp_submissions", []);
    subs.push({ ...Object.fromEntries(new FormData(e.target)), at: new Date().toISOString() });
    store.set("hp_submissions", subs);
    e.target.hidden = true; $("#done").hidden = false; window.scrollTo(0, 0);
  });
}
function business(){
  setTitle("For restaurants");
  $("#app").innerHTML = `<div class="shell page">
    <div class="page-head"><span class="kicker">For restaurants</span><h1>Smaller appetites, regular customers</h1>
      <p class="dek">More Melburnians are on GLP-1 medications and eating half what they used to. They still go out. They just look for places that will serve them less, and charge them less. Listing is free.</p></div>
    <table class="compare">
      <thead><tr><th></th><th>Free</th><th>Verified</th></tr></thead>
      <tbody>
        <tr><td>Your small meals and prices on the map</td><td>✓</td><td>✓</td></tr>
        <tr><td>Diner ratings and reviews</td><td>✓</td><td>✓</td></tr>
        <tr><td>Update your menu any time</td><td>✓</td><td>✓</td></tr>
        <tr><td>Verified tag on your listing</td><td></td><td>✓</td></tr>
        <tr><td>Deals on the Specials page</td><td></td><td>✓</td></tr>
        <tr><td>Monthly views report</td><td></td><td>✓</td></tr>
        <tr class="price"><td>Per month</td><td class="num">$0</td><td class="num">$49</td></tr>
      </tbody>
    </table>
    <p style="margin-top:28px"><a class="btn dark" href="#/add">List your restaurant</a></p>
  </div>`;
}
function how(){
  setTitle("How it works");
  $("#app").innerHTML = `<div class="shell page">
    <div class="page-head"><span class="kicker">About the guide</span><h1>How ratings work</h1><p class="dek">Every score comes from diners, answering four questions after a meal.</p></div>
    <div class="prose narrow">
      <h2>Portion options</h2><p>Could you get a properly smaller meal, off the menu or by asking?</p>
      <h2>Value</h2><p>Was the smaller serve priced like a smaller serve, or close to full price?</p>
      <h2>Nutrition</h2><p>Were there decent protein options, and food that sits easy on a sensitive stomach?</p>
      <h2>Staff</h2><p>Were they fine with a half serve, a swap or a takeaway box, without fuss?</p>
      <h2>Verified</h2><p>The restaurant has confirmed its small meals and prices with us. Paying for it doesn't change ratings or reviews.</p>
      <h2>The fine print</h2><p>Protein, serve size and energy figures are estimates unless the restaurant gave them to us. Halfplate is a food guide, not medical advice.</p>
    </div>
  </div>`;
}
function notFound(){
  setTitle("Not found");
  $("#app").innerHTML = `<div class="shell page"><div class="page-head"><h1>Not here</h1><p class="dek">That page doesn't exist. <a href="#/">Back to the guide</a>.</p></div></div>`;
}

$("#menuBtn").addEventListener("click", () => {
  const n = $("#nav"); n.classList.toggle("open");
  $("#menuBtn").setAttribute("aria-expanded", n.classList.contains("open"));
});
route();
})();
