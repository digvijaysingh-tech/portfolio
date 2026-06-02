# Portfolio

An interactive personal portfolio built with vanilla HTML, CSS, and JavaScript.

## Features

- Interactive particle-network canvas background that reacts to the cursor
- Custom animated cursor with magnetic hover states
- Scroll-driven reveal animations and parallax hero
- 3D tilt effect on stat cards
- Spotlight hover on skill cards
- Animated counters
- Responsive design with mobile menu
- Dark theme, gradient accents, smooth transitions
- Respects `prefers-reduced-motion`

## Run locally

Just open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy with GitHub Pages

In the repo settings, enable Pages on the `main` branch (root). Site will be live at
`https://<username>.github.io/portfolio/`.

## Structure

- `index.html` — markup
- `styles.css` — styling and animations
- `script.js` — interactivity (cursor, canvas, scroll, tilt)
