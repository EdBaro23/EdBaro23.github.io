# edbaro23.github.io

Source for my portfolio site: **https://edbaro23.github.io**

A static site with no build step and no dependencies — plain HTML, one stylesheet and one script.
GitHub Pages serves it straight from `main`.

```
index.html              landing page
projects/*.html         one page per project
assets/css/style.css    all styling
assets/js/main.js       hero canvas, scroll reveals, nav, lightbox
assets/img/             project figures
```

## Working on it locally

No tooling required — open `index.html` in a browser, or serve the folder if you want the paths to
behave exactly as they do in production:

```bash
python -m http.server 8000
```

## Notes

- The hero background is drawn procedurally on a `<canvas>`, so the site depends on no stock imagery.
- Every animation is disabled automatically when the visitor has `prefers-reduced-motion` set.
- The same projects are also written up as markdown in
  [EdBaro23/engineering-portfolio](https://github.com/EdBaro23/engineering-portfolio).
