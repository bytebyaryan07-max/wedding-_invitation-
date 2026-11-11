# Suhas & Komal – Royal Maharashtrian Wedding Invitation (static site)

Pure frontend: HTML + CSS + vanilla JavaScript + GSAP. No backend, no build step.

## Run locally

**Option A – VS Code Live Server (easiest)**
1. Open the `royal-wedding` folder in VS Code.
2. Install the "Live Server" extension.
3. Right-click `index.html` → **Open with Live Server**.

**Option B – simple Python server (PowerShell)**
```powershell
cd royal-wedding
python -m http.server 8000
```
Then open http://localhost:8000 in Chrome or Edge.

You need internet once for GSAP and Google Fonts (they load from CDNs). Opening `index.html` by double-click also works, but a server is better.

## Folder map
```
index.html          page structure (all layers: background, popup, card, flaps, Patrika)
css/style.css       colours, background photo, welcome screen, buttons
css/card.css        3D card, flaps, folds, popup, Patrika typography
js/data.js          ALL wedding text (edit here) + siteUrl for WhatsApp
js/patrika.js       builds the Patrika/cover/flaps from data.js (once)
js/card.js          GSAP timelines + states (entering/closed/opening/open/closing)
js/effects.js       golden dust particles
js/main.js          buttons, music, WhatsApp share
assets/images/      couple.jpg, ganesh.jpg, procession.jpg (cropped from your Patrika)
assets/audio/       put wedding-music.mp3 here (optional)
```

## Things you can change
- **Text / date / names:** `js/data.js`. The Marathi is copied exactly from the Patrika, including its original spelling.
- **Photo inside the Patrika:** set `showPhotoInPatrika: false` in `data.js`.
- **Music:** add your own licensed `assets/audio/wedding-music.mp3`. It starts after the first click; a ♪ button appears only if the file plays.
- **WhatsApp link:** after deploying, set `siteUrl` in `data.js` to your public address.

## Deploy (free static hosting)
Upload the whole folder to Netlify Drop, GitHub Pages or Cloudflare Pages. Then put the public address in `siteUrl`.

## Controls
Open button, close (✕ or Esc), replay (↻), music (♪), WhatsApp share. Enter/Space opens the card from the keyboard.

## Known limitations
- Fonts and GSAP come from CDNs. For fully offline use, download `gsap.min.js` into `js/` and change the `<script>` in `index.html`.
- The Ganesh and palanquin artwork is cropped from your Patrika image, so it is raster, not vector.
- Spelling in the Patrika (e.g. "आवश्य", "साकाळी") was intentionally left unchanged.
