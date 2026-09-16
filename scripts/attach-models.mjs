import fs from 'node:fs';
const path='dist/index.html';let html=fs.readFileSync(path,'utf8');
const replacements=[['<div class="project-visual" style="background:#dce5f0">','<div class="project-visual model-host" data-model="asl" role="img" aria-label="Interactive 3D hand landmark skeleton showing the computer vision pipeline">'],['<article class="project reveal"><div class="project-visual" style="background:#0b2337">','<article class="project reveal" id="hr-project"><div class="project-visual model-host" data-model="hr" role="img" aria-label="Interactive 3D HR workflow connecting employee profiles to approved certificates">']];
for(const [from,to] of replacements){if(html.includes(from))html=html.replace(from,to);else if(!html.includes(to))throw new Error('Expected project container not found')}
fs.writeFileSync(path,html);
