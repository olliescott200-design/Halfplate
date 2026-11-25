# Halfplate

Find Melbourne restaurants with half serves, lunch sizes and high-protein small meals at fair prices. Built for people on GLP-1 medications (Ozempic, Wegovy, Mounjaro).

**Preview build:** every restaurant in `data.js` is fictional sample data.

## Pages

| URL | Page |
| --- | --- |
| `#/` | Home: search, top rated, browse by suburb |
| `#/search` | Results list with filters and a map |
| `#/place/<id>` | Restaurant page: small meals, portion policy, ratings, reviews |
| `#/specials` | Small-plate deals |
| `#/add` | Add a place or suggest an update |
| `#/business` | For restaurants |
| `#/how` | How ratings work |

## Files

- `index.html`: header, footer, page shell
- `styles.css`: all styles
- `data.js`: restaurants and specials. Edit this to add real venues
- `app.js`: routing, search, filters, map, reviews

No build step. Uses Leaflet for the map, CARTO/OpenStreetMap map tiles, and Google Fonts.

Reviews and "Add a place" submissions are saved in the visitor's browser only, until there's a backend.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## GitHub Pages

Settings → Pages → Deploy from a branch → `main` / `(root)` → Save.
