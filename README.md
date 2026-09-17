# Salah Eddine Zouitni — Portfolio

Professional portfolio with project-specific 3D models, scroll-driven case-study chapters, native project disclosures, reduced-motion controls, and a printable graduate résumé.

The visual palette pairs graphite and cool white with electric blue. Project models share blue highlights and neutral materials, with their geometry and workflows providing the distinction. The résumé and favicon use the same palette.

Run `node serve.mjs` for http://localhost:4173. The published directory is `dist/`.

Content is grounded in the supplied August 2026 CV sources and project READMEs, with graduation updated from the user's September 2026 confirmation. Project images are from the user's ASL and HR repositories. The portrait is from the supplied CV archive. No employee records or operational documents are bundled.

The EnergyAI model is adapted from the user's PFE2-main-release landing page, with the same buildings, solar panels, battery, energy paths, and projected fallback. Its conceptual nature is labelled; it does not request or display live meter data. Google Fonts load with system-font fallbacks. Content remains readable without JavaScript.

ASL has a sculpted translucent hand with 21 spatial landmarks, a surface scan, feature measurements, and a two-branch classification explanation. Its smooth surface is baked with `node scripts/build-hand-surface.mjs` and loaded only when the model approaches the viewport; it requires no runtime meshing or external model service. The geometry is schematic and does not represent a predicted ASL letter. HR-System has a personnel-to-certificate workflow; Employee Manager has an interactive personnel archive; InfinityScript.CV has a layered résumé with bilingual and PDF views. These four Three.js scenes load on approach, suspend rendering offscreen, respect reduced motion, and share a pause control with EnergyAI. Workflow buttons and a rotate button support keyboard and touch interaction. The models contain no real personnel data, model predictions, or webcam input. Three.js is vendored under its included MIT license.

HR-System's detailed scene uses a layered personnel register, an administrative review terminal, and a certificate output tray connected by animated data paths. The review checks progress before the final document rises; reduced motion renders each stage immediately. All profile and certificate textures are schematic, without personal records or institutional seals.

Public hosting: https://br1wa.github.io/ . Deploy the contents of `dist/` to the root of `BR1WA/br1wa.github.io`, including `.nojekyll`. The previous Sites publication remains available, but GitHub Pages is the current publishing destination.
