// Sample data: fictional venues for the prototype.
// Replace with real listings (same shape) when you have them.
/* Venue fields: meals[] = d (dish), price, full (full-serve price or null), g (portion grams), p (protein g), k (kcal), gentle, diet[] ('gf','veg','df') */
const V=[
 {id:"kombu",name:"Kombu Lane",sub:"Carlton",km:1.4,cuisine:"Japanese",open:true,hue:"#3D6E7A",x:30,y:22,partner:true,
  r:{portion:4.8,nutrition:4.7,value:4.3,staff:4.9},n:184,f:{half:true,lunch:true,kids:false,fair:true,box:true},diet:["gf","df"],
  meals:[{d:"Sashimi & rice, entrée size",price:16,full:28,g:240,p:32,k:390,gentle:true,diet:["gf","df"]},
         {d:"Chawanmushi with prawn",price:9,full:null,g:180,p:17,k:160,gentle:true,diet:["gf"]},
         {d:"Chicken teriyaki half bento",price:14,full:24,g:280,p:30,k:450,gentle:false,diet:["df"]}],
  tip:"Every main comes as an entrée size on request. Say \"half bento\" and it's rung up at the half price.",
  notes:[["Happy to do half serves",62],["Fair price for the smaller size",41],["Gentle food, not greasy",28]]},
 {id:"quince",name:"Little Quince",sub:"Brunswick",km:3.1,cuisine:"Middle Eastern",open:true,hue:"#B05A4B",x:38,y:8,partner:true,
  r:{portion:4.9,nutrition:4.5,value:4.8,staff:4.6},n:131,f:{half:true,lunch:true,kids:true,fair:true,box:true},diet:["gf","veg"],
  meals:[{d:"Lamb kofta mezze for one",price:15,full:27,g:250,p:31,k:440,gentle:false,diet:["gf"]},
         {d:"Lentil & lemon soup, cup",price:8,full:13,g:250,p:14,k:210,gentle:true,diet:["gf","veg","df"]},
         {d:"Chicken shish, half skewer plate",price:13,full:24,g:220,p:33,k:360,gentle:true,diet:["gf"]}],
  tip:"The mezze-for-one is the smallest full meal on the menu. Soup cups are a good pick on queasy days.",
  notes:[["Small meals are a real menu section",48],["Fair price for the smaller size",39],["Staff didn't make it awkward",22]]},
 {id:"pebble",name:"Pebble Bakehouse",sub:"Fitzroy",km:0.8,cuisine:"Café",open:true,hue:"#C98B4A",x:44,y:30,partner:false,
  r:{portion:4.4,nutrition:4.2,value:4.6,staff:4.5},n:212,f:{half:true,lunch:false,kids:true,fair:true,box:false},diet:["veg","gf"],
  meals:[{d:"Eggs & smoked trout half stack",price:13,full:22,g:220,p:28,k:360,gentle:true,diet:[]},
         {d:"Greek yoghurt, berries & seeds",price:9,full:null,g:220,p:20,k:270,gentle:true,diet:["gf","veg"]}],
  tip:"Half stacks aren't on the menu, but staff do them at about 60% of the price. Just ask.",
  notes:[["Half serves on request",74],["Good protein options",51]]},
 {id:"brightwater",name:"Brightwater Bowls",sub:"South Yarra",km:3.4,cuisine:"Bowls",open:true,hue:"#3E8A72",x:56,y:76,partner:true,
  r:{portion:4.6,nutrition:4.8,value:4.0,staff:4.4},n:97,f:{half:false,lunch:true,kids:false,fair:true,box:true},diet:["gf","veg","df"],
  meals:[{d:"Mini poke bowl, salmon",price:14,full:21,g:280,p:27,k:380,gentle:true,diet:["gf","df"]},
         {d:"Mini tofu & edamame bowl",price:12,full:19,g:270,p:24,k:340,gentle:true,diet:["gf","veg","df"]}],
  tip:"Mini bowls are listed on the board. Ask for double protein (+$3) to hit 35 g+.",
  notes:[["Clear protein info on menu",44],["Mini size is properly priced",30]]},
 {id:"verdigris",name:"Verdigris Taqueria",sub:"Collingwood",km:1.9,cuisine:"Mexican",open:true,hue:"#5E8C3A",x:62,y:36,partner:false,
  r:{portion:4.7,nutrition:3.9,value:4.9,staff:4.3},n:88,f:{half:true,lunch:false,kids:false,fair:true,box:true},diet:["gf"],
  meals:[{d:"Two chicken tacos",price:11,full:15,g:220,p:26,k:410,gentle:false,diet:["gf","df"]},
         {d:"Black bean & egg tostada, single",price:7,full:null,g:160,p:15,k:260,gentle:true,diet:["gf","veg"]}],
  tip:"Tacos are priced individually, so order two instead of the plate of three.",
  notes:[["Cheapest small meal nearby",57],["Easy to order less",33]]},
 {id:"hollow",name:"Hollow Oak Grill",sub:"Richmond",km:2.6,cuisine:"Grill",open:false,hue:"#7A4E38",x:70,y:60,partner:false,
  r:{portion:3.6,nutrition:4.4,value:3.4,staff:4.1},n:52,f:{half:false,lunch:true,kids:true,fair:false,box:true},diet:["gf"],
  meals:[{d:"Kids' eye fillet with greens",price:19,full:42,g:200,p:38,k:360,gentle:true,diet:["gf"]},
         {d:"Lunch chicken breast, side salad",price:22,full:34,g:260,p:42,k:420,gentle:true,diet:["gf","df"]}],
  tip:"Adults can order the 150 g kids' steak. Lunch sizes run until 3 pm.",
  notes:[["Kids' menu OK for adults",29],["Pricey, but high protein",18]]},
 {id:"tamarind",name:"Tamarind Room",sub:"Melbourne CBD",km:1.1,cuisine:"Thai",open:true,hue:"#C2622D",x:22,y:46,partner:false,
  r:{portion:3.2,nutrition:3.8,value:3.5,staff:3.9},n:41,f:{half:false,lunch:true,kids:false,fair:false,box:true},diet:["gf","df"],
  meals:[{d:"Lunch-size larb gai",price:15,full:24,g:240,p:27,k:330,gentle:false,diet:["gf","df"]}],
  tip:"Only the lunch menu has smaller sizes. Dinner portions are large, so ask for a box up front.",
  notes:[["Lunch sizes only",21],["Boxes offered without asking",14]]},
 {id:"fennel",name:"Fennel & Fig",sub:"St Kilda",km:4.8,cuisine:"Modern Australian",open:true,hue:"#6B5B8E",x:34,y:86,partner:true,
  r:{portion:4.7,nutrition:4.6,value:3.8,staff:4.8},n:118,f:{half:true,lunch:true,kids:false,fair:false,box:true},diet:["gf","veg"],
  meals:[{d:"Barramundi entrée as a main",price:24,full:38,g:200,p:31,k:320,gentle:true,diet:["gf","df"]},
         {d:"Burrata & roast pumpkin, small",price:18,full:26,g:180,p:14,k:340,gentle:true,diet:["gf","veg"]}],
  tip:"Any entrée can be plated as a main with a side. They also have a printed GLP-1 menu.",
  notes:[["Has a dedicated small-plate menu",46],["Staff very understanding",40]]}
];
const FILTERS=[["half","Half serves"],["cheap","Under $15"],["protein","25 g+ protein"],["fair","Fair half-price"],["gentle","Gentle on stomach"],["kids","Kids' menu OK"],["open","Open now"],["gf","Gluten-free",1],["veg","Vegetarian",1],["df","Dairy-free",1]];
const SORTS=[["match","Best match"],["price","Cheapest"],["protein","Most protein"],["near","Nearest"]];
const APPETITE={xs:["Very small",200],s:["Small",260],m:["Moderate",320]};
const SPECIALS=[
 {v:"kombu",title:"Half bento + miso",when:"Weekdays 11:30–2:30",price:15,was:24},
 {v:"quince",title:"Mezze for one + mint tea",when:"Every day after 5 pm",price:17,was:29},
 {v:"brightwater",title:"Mini bowl with double protein",when:"All day",price:16,was:24},
 {v:"fennel",title:"GLP-1 tasting plate",when:"Tue–Thu dinner",price:26,was:null}
];
