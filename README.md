# edbaro23.github.io

Source for my portfolio site: **https://edbaro23.github.io**

A single-page static site with no build step and no dependencies: plain HTML, one stylesheet and one
script. GitHub Pages serves it straight from `main`.

```
index.html              the whole site
assets/css/style.css    all styling
assets/js/main.js       hero canvas, scroll reveals, nav
assets/img/             card images
```

## Working on it locally

No tooling required. Open `index.html` in a browser, or serve the folder if you want the paths to
behave exactly as they do in production:

```bash
python -m http.server 8000
```

## Notes

- The hero background is drawn procedurally on a `<canvas>`, so the site depends on no stock imagery.
- Every animation is disabled automatically when the visitor has `prefers-reduced-motion` set.
- Projects are listed as cards only. There are no per-project pages, by choice.
