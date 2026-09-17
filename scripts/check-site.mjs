import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);
const files=walk(root);let links=0;
for(const file of files.filter(file=>file.endsWith('.html'))){
 const html=fs.readFileSync(file,'utf8');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
 assert.equal(ids.length,new Set(ids).size,`Duplicate IDs: ${file}`);
 for(const [,value] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  if(/^(?:https?:|mailto:|data:|tel:|\/\/)/.test(value))continue;
  const [pathname,hash]=value.split('#');let target=pathname?path.resolve(pathname.startsWith('/')?root:path.dirname(file),'.'+(pathname.startsWith('/')?'':'/')+decodeURIComponent(pathname.split('?')[0])):file;
  assert(fs.existsSync(target),`Missing local resource ${value} in ${file}`);
  if(fs.statSync(target).isDirectory())target=path.join(target,'index.html');
  assert(fs.existsSync(target),`Missing directory index ${value}`);
  if(hash&&target.endsWith('.html'))assert(fs.readFileSync(target,'utf8').includes(`id="${hash}"`),`Broken anchor ${value} in ${file}`);
  links++;
 }
}
for(const file of files.filter(file=>file.endsWith('.js')&&!file.includes(`${path.sep}vendor${path.sep}`))){
 const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);
}
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(home.includes('data-theme="dark"'),'Default theme must be dark');
assert(home.includes('https://br1wa.github.io/assets/social-preview.png'),'Missing social preview metadata');
const preview=fs.readFileSync(path.join(root,'assets/social-preview.png'));
assert.equal(preview.subarray(1,4).toString(),'PNG');assert.equal(preview.readUInt32BE(16),1200);assert.equal(preview.readUInt32BE(20),630);
assert(fs.existsSync(path.join(root,'404.html')));assert(fs.existsSync(path.join(root,'robots.txt')));assert(fs.existsSync(path.join(root,'sitemap.xml')));
console.log(`Site checks passed: ${links} local links/assets, JavaScript syntax, anchors, and social preview.`);
