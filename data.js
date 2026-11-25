// Halfplate sample data.
// Every venue below is FICTIONAL. Coordinates sit in real Melbourne suburbs so the map looks right.
// Replace this array with real listings (same fields) once you have them.
//
// Venue fields
//   id, name, suburb, street, lat, lng, cuisine, price (1-3), hours, verified (bool)
//   rating: { portion, value, nutrition, staff }   each out of 5
//   ratingCount: number of diner ratings
//   features: { half, lunch, entree, kids, fair, box }   booleans
//   diet: ["gf","veg","df"] options available
//   tip: what to ask for when ordering
//   meals: [{ name, note, price, full (full-serve price or null), protein (g), size (g), cal }]
//   reports: [[ "what diners say", count ]]

const SUBURBS = ["Fitzroy","Collingwood","Carlton","Brunswick","Richmond","South Yarra","Melbourne CBD","St Kilda"];

const VENUES = [
 {id:"kombu-lane",name:"Kombu Lane",suburb:"Carlton",street:"Lygon St",lat:-37.7985,lng:144.9668,cuisine:"Japanese",price:2,hours:"11:30am – 9pm",verified:true,
  rating:{portion:4.8,value:4.3,nutrition:4.7,staff:4.9},ratingCount:184,
  features:{half:true,lunch:true,entree:true,kids:false,fair:true,box:true},diet:["gf","df"],
  tip:"Every main can be ordered entrée-size. Ask for a \"half bento\" and it's charged at the half price.",
  meals:[{name:"Sashimi & rice",note:"Entrée size",price:16,full:28,protein:32,size:240,cal:390},
         {name:"Chicken teriyaki half bento",note:"Half serve",price:14,full:24,protein:30,size:280,cal:450},
         {name:"Chawanmushi with prawn",note:"Small dish",price:9,full:null,protein:17,size:180,cal:160}],
  reports:[["Happy to do half serves",62],["Fair price for the smaller size",41],["Light food, not greasy",28]]},
 {id:"little-quince",name:"Little Quince",suburb:"Brunswick",street:"Sydney Rd",lat:-37.7680,lng:144.9612,cuisine:"Middle Eastern",price:2,hours:"12pm – 10pm",verified:true,
  rating:{portion:4.9,value:4.8,nutrition:4.5,staff:4.6},ratingCount:131,
  features:{half:true,lunch:true,entree:true,kids:true,fair:true,box:true},diet:["gf","veg"],
  tip:"The mezze-for-one is the smallest complete meal. Soup comes in a cup size that's good on low-appetite days.",
  meals:[{name:"Chicken shish plate",note:"Half skewer",price:13,full:24,protein:33,size:220,cal:360},
         {name:"Lamb kofta mezze for one",note:"Mezze size",price:15,full:27,protein:31,size:250,cal:440},
         {name:"Lentil & lemon soup",note:"Cup",price:8,full:13,protein:14,size:250,cal:210}],
  reports:[["Small meals are a real menu section",48],["Fair price for the smaller size",39],["Staff didn't make it awkward",22]]},
 {id:"pebble-bakehouse",name:"Pebble Bakehouse",suburb:"Fitzroy",street:"Brunswick St",lat:-37.7990,lng:144.9783,cuisine:"Café",price:1,hours:"7am – 3pm",verified:false,
  rating:{portion:4.4,value:4.6,nutrition:4.2,staff:4.5},ratingCount:212,
  features:{half:true,lunch:false,entree:false,kids:true,fair:true,box:false},diet:["veg","gf"],
  tip:"Half stacks aren't on the menu, but they'll do them for about 60% of the price if you ask.",
  meals:[{name:"Eggs & smoked trout",note:"Half stack",price:13,full:22,protein:28,size:220,cal:360},
         {name:"Greek yoghurt, berries & seeds",note:"Small bowl",price:9,full:null,protein:20,size:220,cal:270}],
  reports:[["Half serves on request",74],["Good protein options",51]]},
 {id:"verdigris-taqueria",name:"Verdigris Taqueria",suburb:"Collingwood",street:"Smith St",lat:-37.8012,lng:144.9837,cuisine:"Mexican",price:1,hours:"12pm – 10pm",verified:false,
  rating:{portion:4.7,value:4.9,nutrition:3.9,staff:4.3},ratingCount:88,
  features:{half:true,lunch:false,entree:false,kids:false,fair:true,box:true},diet:["gf"],
  tip:"Tacos are priced one at a time, so order two instead of the plate of three.",
  meals:[{name:"Two chicken tacos",note:"Order by the taco",price:11,full:15,protein:26,size:220,cal:410},
         {name:"Black bean & egg tostada",note:"Single",price:7,full:null,protein:15,size:160,cal:260}],
  reports:[["Cheapest small meal nearby",57],["Easy to order less",33]]},
 {id:"brightwater-bowls",name:"Brightwater Bowls",suburb:"South Yarra",street:"Chapel St",lat:-37.8395,lng:144.9935,cuisine:"Bowls & salads",price:2,hours:"10am – 8pm",verified:true,
  rating:{portion:4.6,value:4.0,nutrition:4.8,staff:4.4},ratingCount:97,
  features:{half:false,lunch:true,entree:false,kids:false,fair:true,box:true},diet:["gf","veg","df"],
  tip:"Mini bowls are on the board. Add double protein for $3 to get past 35 g.",
  meals:[{name:"Salmon poke",note:"Mini bowl",price:14,full:21,protein:27,size:280,cal:380},
         {name:"Tofu & edamame",note:"Mini bowl",price:12,full:19,protein:24,size:270,cal:340}],
  reports:[["Protein listed on the menu",44],["Mini size is properly priced",30]]},
 {id:"hollow-oak-grill",name:"Hollow Oak Grill",suburb:"Richmond",street:"Swan St",lat:-37.8253,lng:144.9978,cuisine:"Steak & grill",price:3,hours:"12pm – 3pm, 5:30pm – 10pm",verified:false,
  rating:{portion:3.6,value:3.4,nutrition:4.4,staff:4.1},ratingCount:52,
  features:{half:false,lunch:true,entree:true,kids:true,fair:false,box:true},diet:["gf"],
  tip:"Adults can order the 150 g kids' steak. Lunch sizes run until 3pm.",
  meals:[{name:"Eye fillet with greens",note:"Kids' size, 150 g",price:19,full:42,protein:38,size:200,cal:360},
         {name:"Chicken breast & side salad",note:"Lunch size",price:22,full:34,protein:42,size:260,cal:420}],
  reports:[["Kids' menu OK for adults",29],["Pricey, but high protein",18]]},
 {id:"tamarind-room",name:"Tamarind Room",suburb:"Melbourne CBD",street:"Little Bourke St",lat:-37.8118,lng:144.9662,cuisine:"Thai",price:2,hours:"11am – 9:30pm",verified:false,
  rating:{portion:3.4,value:3.6,nutrition:3.8,staff:3.9},ratingCount:41,
  features:{half:false,lunch:true,entree:true,kids:false,fair:false,box:true},diet:["gf","df"],
  tip:"Smaller sizes are on the lunch menu only. Dinner serves are large, so ask for a box when you order.",
  meals:[{name:"Larb gai",note:"Lunch size",price:15,full:24,protein:27,size:240,cal:330},
         {name:"Chicken satay skewers",note:"Entrée, 3 sticks",price:12,full:null,protein:21,size:150,cal:290}],
  reports:[["Lunch sizes only",21],["Offers a box without asking",14]]},
 {id:"fennel-and-fig",name:"Fennel & Fig",suburb:"St Kilda",street:"Acland St",lat:-37.8678,lng:144.9802,cuisine:"Modern Australian",price:3,hours:"5:30pm – 10pm",verified:true,
  rating:{portion:4.7,value:3.8,nutrition:4.6,staff:4.8},ratingCount:118,
  features:{half:true,lunch:false,entree:true,kids:false,fair:false,box:true},diet:["gf","veg"],
  tip:"Any entrée can be plated as a main with a side. There's also a printed small-plates menu if you ask.",
  meals:[{name:"Barramundi with herb salsa",note:"Entrée as a main",price:24,full:38,protein:31,size:200,cal:320},
         {name:"Burrata & roast pumpkin",note:"Small",price:18,full:26,protein:14,size:180,cal:340}],
  reports:[["Has a small-plates menu",46],["Staff very understanding",40]]},
 {id:"saffron-and-salt",name:"Saffron & Salt",suburb:"Fitzroy",street:"Gertrude St",lat:-37.8058,lng:144.9802,cuisine:"Indian",price:1,hours:"5pm – 10pm",verified:false,
  rating:{portion:4.5,value:4.7,nutrition:4.0,staff:4.2},ratingCount:76,
  features:{half:true,lunch:false,entree:false,kids:false,fair:true,box:true},diet:["gf","veg"],
  tip:"Every curry comes in a half size. Pair it with a small rice rather than naan.",
  meals:[{name:"Tandoori chicken",note:"Half, 4 pieces",price:12,full:21,protein:34,size:200,cal:330},
         {name:"Dal & small rice",note:"Half curry",price:10,full:17,protein:16,size:280,cal:380}],
  reports:[["Half and full sizes on menu",39],["Great value",27]]},
 {id:"marrow-and-moss",name:"Marrow & Moss",suburb:"Collingwood",street:"Johnston St",lat:-37.7990,lng:144.9905,cuisine:"Café",price:2,hours:"7:30am – 3pm",verified:true,
  rating:{portion:4.6,value:4.2,nutrition:4.7,staff:4.7},ratingCount:63,
  features:{half:true,lunch:true,entree:false,kids:false,fair:true,box:false},diet:["veg","df"],
  tip:"There's a \"lighter\" column on the menu, about two-thirds of the usual serve.",
  meals:[{name:"Chicken, quinoa & greens",note:"Lighter serve",price:14,full:22,protein:29,size:240,cal:360},
         {name:"Scrambled tofu on rye",note:"One slice",price:12,full:19,protein:22,size:200,cal:320}],
  reports:[["Lighter serves on the menu",31],["Protein listed",17]]},
 {id:"tiller-and-pine",name:"Tiller & Pine",suburb:"Richmond",street:"Bridge Rd",lat:-37.8190,lng:144.9965,cuisine:"Vietnamese",price:1,hours:"11am – 9pm",verified:false,
  rating:{portion:4.3,value:4.8,nutrition:4.3,staff:4.0},ratingCount:104,
  features:{half:false,lunch:false,entree:true,kids:true,fair:true,box:true},diet:["gf","df"],
  tip:"Order the small pho. It's about 60% of the large and still has plenty of meat.",
  meals:[{name:"Chicken pho",note:"Small bowl",price:13,full:17,protein:28,size:450,cal:380},
         {name:"Rice paper rolls, prawn",note:"Entrée, 2 rolls",price:9,full:null,protein:14,size:160,cal:190}],
  reports:[["Small bowls available",44],["Cheap and filling",30]]},
 {id:"oro-pasta-bar",name:"Oro Pasta Bar",suburb:"Carlton",street:"Rathdowne St",lat:-37.7962,lng:144.9715,cuisine:"Italian",price:2,hours:"12pm – 10pm",verified:false,
  rating:{portion:4.4,value:4.1,nutrition:3.6,staff:4.6},ratingCount:91,
  features:{half:false,lunch:false,entree:true,kids:true,fair:false,box:true},diet:["veg","gf"],
  tip:"All pastas come entrée-size. Add the grilled chicken side to bring the protein up.",
  meals:[{name:"Chicken & broccolini orecchiette",note:"Entrée size",price:19,full:29,protein:26,size:230,cal:480},
         {name:"Veal scallopini",note:"Kids' size",price:16,full:34,protein:30,size:180,cal:370}],
  reports:[["Entrée pasta sizes",37],["Kids' menu OK for adults",12]]},
 {id:"kettle-and-crane",name:"Kettle & Crane",suburb:"Melbourne CBD",street:"Flinders Ln",lat:-37.8160,lng:144.9668,cuisine:"Chinese",price:2,hours:"11am – 10pm",verified:true,
  rating:{portion:4.8,value:4.5,nutrition:4.2,staff:4.4},ratingCount:146,
  features:{half:true,lunch:true,entree:true,kids:false,fair:true,box:true},diet:["df"],
  tip:"Dumplings come in fours, so you can build a small meal. Steamed is easier on the stomach than fried.",
  meals:[{name:"Steamed prawn dumplings",note:"4 pieces",price:11,full:null,protein:18,size:160,cal:230},
         {name:"Soy chicken & rice",note:"Half plate",price:13,full:21,protein:32,size:260,cal:420}],
  reports:[["Easy to order a small meal",52],["Half plates at half price",34]]},
 {id:"seawall-kitchen",name:"Seawall Kitchen",suburb:"St Kilda",street:"Fitzroy St",lat:-37.8605,lng:144.9790,cuisine:"Seafood",price:2,hours:"11:30am – 9pm",verified:false,
  rating:{portion:4.2,value:3.9,nutrition:4.6,staff:4.3},ratingCount:58,
  features:{half:false,lunch:true,entree:true,kids:true,fair:false,box:true},diet:["gf","df"],
  tip:"Ask for the grilled fish instead of battered. The kids' fish plate is a good adult small meal.",
  meals:[{name:"Grilled flathead & salad",note:"Kids' plate",price:14,full:29,protein:28,size:200,cal:300},
         {name:"Prawn & avocado cup",note:"Entrée",price:16,full:null,protein:22,size:180,cal:260}],
  reports:[["Grilled option on request",23],["Kids' menu OK for adults",15]]}
];

const SPECIALS = [
 {venue:"kombu-lane",title:"Half bento + miso",when:"Weekdays 11:30am – 2:30pm",price:15,was:24},
 {venue:"little-quince",title:"Mezze for one + mint tea",when:"Every day after 5pm",price:17,was:29},
 {venue:"brightwater-bowls",title:"Mini bowl with double protein",when:"All day",price:16,was:24},
 {venue:"kettle-and-crane",title:"Four dumplings + small soup",when:"Lunch, Mon – Fri",price:14,was:20},
 {venue:"marrow-and-moss",title:"Lighter brekkie + coffee",when:"Before 10am",price:15,was:22},
 {venue:"fennel-and-fig",title:"Small-plates tasting for one",when:"Tue – Thu dinner",price:32,was:null}
];

// Photos (Unsplash, free licence). Generic dish photos by cuisine, not photos of these venues.
const U = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=70`;
const PHOTOS = {
  "kombu-lane":"1554502078-ef0fc409efce", "little-quince":"1750874695064-f851719d1858", "pebble-bakehouse":"1671393071395-9999964a46cd",
  "verdigris-taqueria":"1683062332605-4e1209d75346", "brightwater-bowls":"1674315526518-f8891c4a8b70", "hollow-oak-grill":"1600555379765-f82335a7b1b0",
  "tamarind-room":"1504674900247-0877df9cc836", "fennel-and-fig":"1414235077428-338989a2e8c0", "saffron-and-salt":"1762922425226-8cfe6987e7b0",
  "marrow-and-moss":"1755811248324-c70c1f10a7fd", "tiller-and-pine":"1711633648895-f5df0336ff55", "oro-pasta-bar":"1597393353365-9d4366392fe9",
  "kettle-and-crane":"1741612552052-2c5806e8a9ea", "seawall-kitchen":"1515669097368-22e68427d265"
};
VENUES.forEach(v => { v.photo = U(PHOTOS[v.id]); v.example = true; });
const SITE_PHOTOS = { hero: U("1579027989536-b7b1f875659b"), interior: U("1783447036642-90a65ff85a0f"), people: U("1466978913421-dad2ebd01d17"), skewers: U("1746564738966-bad354e75a88") };

// Lists are built from the listings, so they fill themselves once real data arrives.
const LISTS = [
  { id:"half-serves-inner-north", title:"Where to get a proper half serve in the inner north", kicker:"Fitzroy · Collingwood · Carlton · Brunswick",
    dek:"Places that will happily plate half, and charge you for half.", photo:SITE_PHOTOS.people,
    pick: v => v.features.half && ["Fitzroy","Collingwood","Carlton","Brunswick"].includes(v.suburb) },
  { id:"small-meals-under-15", title:"Small meals under $15 that still fill you up", kicker:"Cheap eats",
    dek:"Lunch sizes, single tacos and dumplings by the four.", photo:SITE_PHOTOS.skewers,
    pick: v => v.meals.some(m => m.price < 15) },
  { id:"high-protein-small-plates", title:"High-protein small plates worth crossing town for", kicker:"30 g and up",
    dek:"When you can only manage a few bites, make them count.", photo:SITE_PHOTOS.interior,
    pick: v => v.meals.some(m => m.protein >= 30) }
];
