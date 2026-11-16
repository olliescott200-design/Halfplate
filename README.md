# Halfplate

A restaurant finder for people on GLP-1 medications (Ozempic, Wegovy, Mounjaro). It shows restaurants that serve small, high-protein meals at fair prices, rated by the people who eat there.

This is an investor prototype. Every venue, dish, price and rating in `data.js` is fictional sample data.

## What's in it

- **Explore:** search, filters (half serves, under $15, 25 g+ protein, fair half-price, gentle on stomach, kids' menu OK, open now, gluten-free, vegetarian, dairy-free), four sort orders, and list or map view
- **Venue page:** Small Plate rating breakdown, portion policy, what to ask for, small meals with price, savings, protein, portion and calories, and diner reports
- **Specials:** small-plate deals from partner venues
- **Saved:** venues you've hearted
- **Me:** protein target, budget per meal, appetite size and diet settings, which feed every match score

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page layout: pitch column and phone prototype |
| `styles.css` | All styles, light and dark themes |
| `data.js` | Venue, filter and specials data. Edit this to add real restaurants |
| `app.js` | App logic: filtering, scoring, rendering |

No build step and no dependencies. Fonts load from Google Fonts.

## Run it locally

Open `index.html` in a browser. Or serve the folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Put it online with GitHub Pages

1. Create a new repository on GitHub and upload these files to it.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and `/ (root)`, then save.
4. After a minute your site is live at `https://<your-username>.github.io/<repo-name>/`.

GitHub Pages sites on free accounts are public, even when the repo is private.

## Adding a real restaurant

Add an object to the `V` array in `data.js`:

```js
{id:"my-venue", name:"Venue Name", sub:"Suburb", km:1.2, cuisine:"Thai", open:true,
 hue:"#3D6E7A",           // card colour
 x:40, y:50,              // position on the demo map (0–100)
 partner:false,           // true = verified small-plate menu badge
 r:{portion:4.5, nutrition:4.2, value:4.0, staff:4.6},  // ratings out of 5
 n:12,                    // number of ratings
 f:{half:true, lunch:true, kids:false, fair:true, box:true},
 diet:["gf"],
 meals:[{d:"Dish name", price:14, full:24, g:250, p:30, k:400, gentle:true, diet:["gf"]}],
 tip:"What to ask for when ordering.",
 notes:[["Happy to do half serves", 5]]}
```

## Next steps

- Replace the sample data with real listings
- Swap the drawn map for a real one, e.g. Leaflet with OpenStreetMap tiles
- Add an "Add a restaurant" form and a backend to store submissions
- Add sign-in so diners can save venues and submit ratings
