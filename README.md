# Salah Eddine Zouitni — Portfolio

# Salah Eddine Zouitni · Engineering portfolio

[Live portfolio](https://br1wa.github.io/) · [Résumé](https://br1wa.github.io/resume.html)

A static portfolio with five project-specific 3D studies, a graphite and electric-blue palette, accessible workflow controls, and a printable graduate résumé. This repository contains the complete source and deployment configuration.

## Run locally

Install Node.js 22 or newer. The site has no build step or required npm dependencies.

```sh
git clone https://github.com/BR1WA/br1wa.github.io.git
cd br1wa.github.io
npm start
```

Open http://localhost:4173. Run `npm run check` before publishing. The preview supports `/resume`, `/resume.html`, and the custom 404 page.

## Source layout

| Path | Purpose |
| --- | --- |
| `dist/` | Authored HTML, CSS, JavaScript, and production assets; edit these files directly |
| `dist/model-loader.js` | Defers Three.js and scene builders until a model approaches the viewport |
| `dist/project-models.js` | Shared rendering, controls, visibility, and fallback behavior |
| `dist/*-workflow.js`, `*-archive.js`, `*-studio.js`, `hand-*.js` | Project-specific geometry and animations |
| `dist/theme.js`, `theme.css` | Saved dark/light preference; dark by default |
| `scripts/` | Asset generation and deployment checks |
| `serve.mjs` | Dependency-free local preview server |
| `.github/workflows/pages.yml` | Checks and publishes only `dist/` to GitHub Pages |

## Publishing

Push the full project to `main`. The **Publish portfolio** GitHub Actions workflow validates local links, JavaScript syntax, and social-preview assets, then deploys `dist/`. GitHub Pages must use **GitHub Actions** as its publishing source. No API keys or repository secrets are needed.

The repository previously held only the published files. Its history is preserved; future updates use the complete source on `main`, without subtree publishing.

## Behavior and accessibility

- New visitors see dark mode; an explicit choice persists and synchronizes across tabs. Résumé printing always uses dark text on white paper.
- A project index provides direct links to all five studies. Email can be opened, copied, or manually selected when clipboard access is denied.
- Models load near the viewport, suspend rendering offscreen, and respect reduced motion. Pause, stage, and rotate buttons work with keyboard and touch.
- Static project content remains available without JavaScript, after a model download failure, or when the graphics context is lost.
- The site includes a 1200 × 630 social preview, sitemap, robots file, and custom 404 page. Google Fonts use local system-font fallbacks.

## Models and asset provenance

**EnergyAI:** adapted from the author's PFE2-main-release landing page, retaining the buildings, solar panels, battery, data paths, and projected fallback. No live meter data is requested.

**ASL:** a baked translucent hand surface with 21 landmarks, feature measurements, and two classification branches. The geometry is schematic and does not predict a sign or access a webcam.

**HR-System:** personnel records, a review terminal, and a certificate tray. **Employee Manager:** indexed folders, sliding drawers, profile extraction, and an export report. Both use schematic records only.

**InfinityScript.CV:** a layered document studio with English/Arabic layout controls and a PDF-output illustration. It does not generate a downloadable résumé itself.

Project screenshots come from the author's EnergyAI, ASL, and HR projects; the portrait comes from the supplied CV. Content is based on the August 2026 CV sources and project READMEs, with graduation confirmed in September 2026. No private project sources, personnel records, or operational documents are included. Three.js is vendored with its [MIT license](dist/vendor/THREE-LICENSE.txt).

## Optional asset tools

The generated assets are committed. These commands are only needed when changing their designs:

```sh
npm run build:hand
# Optional original-style re-import; provide your own source file:
node scripts/import-energy-styles.mjs /path/to/landing.module.css
```

To regenerate the social preview or run the browser smoke checks, install Playwright locally:

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
npm run build:social
# With npm start running in another terminal:
npm run test:browser
```

The social design is in `scripts/social-preview.html`. Set `BROWSER_CHANNEL=msedge` to use an installed Edge browser instead of Playwright Chromium. `PLAYWRIGHT_MODULE` can point to an existing Playwright installation. Browser-check screenshots go into ignored `tmp/`.
