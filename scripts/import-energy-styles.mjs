// Port the original user-supplied geometry with the portfolio's shared palette.
import fs from 'node:fs';
import {energyPalette} from './energy-palette.mjs';
const source=fs.readFileSync('C:/Users/salah/Documents/MASTER/PFE2-main-release/frontend/src/components/landing/landing.module.css','utf8');
const start=source.indexOf('/* Local 3D geometry:');
const end=source.indexOf('@media (prefers-reduced-motion: no-preference)',start);
if(start<0||end<0)throw new Error('Original model style boundaries not found');
const css=source.slice(start,end).replace(/\.scene(?=[\s.{:[>])/g,'.energy-scene');
fs.writeFileSync('dist/energy-scene.css',energyPalette(css+`\n/* Portfolio integration, accessibility, and responsive sizing. */
.energy-scene{--accent:#7dd3fc;--scene-scale:1;touch-action:pan-y;height:460px}.energy-scene .sceneModel{scale:var(--scene-scale)}.energy-scene .sceneHalo{inset:12% -5%}.energy-scene .orbitTwo{width:96%;left:2%}.energy-scene .sceneTag small{font-size:9px}.energy-scene .sceneTag strong{font-size:12px}.energy-scene .sourceTag{top:40px;left:0}.energy-scene .forecastTag{right:0;bottom:67px}.energy-scene .actionTag{bottom:18px;left:8px;font-size:11px}.energy-scene .sceneCoordinates{right:0;top:18px;font-size:9px}.energy-scene .sceneTag{z-index:2;transition:border-color .5s,box-shadow .5s}.energy-scene .sceneCoordinates span{color:#698bb0}.energy-scene[data-step='0'] .sourceTag,.energy-scene[data-step='1'] .forecastTag,.energy-scene[data-step='2'] .actionTag{border-color:#96dcff;box-shadow:0 0 30px #60bff521}.energy-scene[data-step='1'] .energyPulse{animation-duration:4s}.energy-scene[data-step='2'] .energyPulse{stroke:#d5fc75}.energy-scene[data-offscreen=true] *{animation-play-state:paused!important}
@media(max-width:1100px){.energy-scene{--scene-scale:.8;height:410px}.energy-scene .sceneTag{padding:9px}.energy-scene .sceneTag strong{font-size:11px}.energy-scene .sceneTag small{font-size:8px}.energy-scene .sourceTag{top:35px}.energy-scene .forecastTag{bottom:58px}.energy-scene .sceneCoordinates{font-size:8px}}
@media(max-width:700px){.energy-scene{--scene-scale:.85;height:410px}.energy-scene .sourceTag{top:30px}.energy-scene .forecastTag{bottom:66px}.energy-scene .sceneCoordinates{top:14px}.energy-scene .actionTag{bottom:18px}}
@media(max-width:390px){.energy-scene{--scene-scale:.7;height:370px}.energy-scene .sceneTag{padding:8px;gap:6px}.energy-scene .sceneTag strong{font-size:10px}.energy-scene .tagIcon{width:22px;height:22px}.energy-scene .sceneCoordinates{font-size:7px}}
@media(prefers-reduced-motion:reduce){.energy-scene *{animation:none!important;transition:none!important}}\n`));
