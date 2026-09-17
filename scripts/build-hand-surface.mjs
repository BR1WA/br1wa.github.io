// Bake a smooth union of palm volumes and tapered fingers. No runtime meshing cost.
import fs from 'node:fs';
import {landmarks,chains} from '../dist/hand-anatomy.js';
const shapes=[];
function ellipsoid(cx,cy,cz,rx,ry,rz){shapes.push((x,y,z)=>{
 const a=(x-cx)/rx,b=(y-cy)/ry,c=(z-cz)/rz;
 const k0=Math.hypot(a,b,c),k1=Math.hypot(a/rx,b/ry,c/rz);
 return k1===0?-Math.min(rx,ry,rz):k0*(k0-1)/k1;
});}
function segment(a,b,ra,rb){
 const d=b.map((v,i)=>v-a[i]),len=d.reduce((v,n)=>v+n*n,0);
 shapes.push((x,y,z)=>{const q=[x-a[0],y-a[1],z-a[2]];const h=Math.max(0,Math.min(1,q.reduce((s,v,i)=>s+v*d[i],0)/len));return Math.hypot(...q.map((v,i)=>v-h*d[i]))-(ra+(rb-ra)*h);});
}
ellipsoid(.08,-.43,-.035,.79,.84,.235);
ellipsoid(.09,-.04,-.04,.76,.46,.20);
ellipsoid(-.40,-.72,.035,.39,.51,.25);
ellipsoid(.40,-.67,-.01,.38,.55,.23);
ellipsoid(0,-1.43,-.025,.38,.48,.23);
const widths=[[.24,.205,.17,.145],[.19,.155,.137,.112],[.195,.165,.145,.12],[.181,.156,.133,.11],[.153,.129,.11,.095]];
chains.forEach((chain,f)=>{
 const points=chain.slice(1).map(i=>landmarks[i]);
 if(f>0)segment([points[0][0]*.74,-.5,0],points[0],widths[f][0]+.025,widths[f][0]);
 for(let i=0;i<3;i++)segment(points[i],points[i+1],widths[f][i],widths[f][i+1]);
});
const blend=.115;
function field(x,y,z){let d=10;for(const shape of shapes){const b=shape(x,y,z);const h=Math.max(blend-Math.abs(d-b),0)/blend;d=Math.min(d,b)-h*h*blend*.25;}return d;}
const step=.045,min=[-1.8,-1.99,-.48],size=[76,103,29];
const values=new Float32Array(size[0]*size[1]*size[2]);
const index=(x,y,z)=>x+size[0]*(y+size[1]*z);
for(let z=0;z<size[2];z++)for(let y=0;y<size[1];y++)for(let x=0;x<size[0];x++)values[index(x,y,z)]=field(min[0]+x*step,min[1]+y*step,min[2]+z*step);
const offsets=[[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]];
const tetrahedra=[[0,5,1,6],[0,1,2,6],[0,2,3,6],[0,3,7,6],[0,7,4,6],[0,4,5,6]];
const vertices=[],normals=[],indices=[],cache=new Map();
function vertex(a,b,va,vb){
 const t=va/(va-vb),p=a.map((v,i)=>v+(b[i]-v)*t),key=p.map(v=>v.toFixed(5)).join(',');
 if(cache.has(key))return cache.get(key);
 const e=.003,n=[field(p[0]+e,p[1],p[2])-field(p[0]-e,p[1],p[2]),field(p[0],p[1]+e,p[2])-field(p[0],p[1]-e,p[2]),field(p[0],p[1],p[2]+e)-field(p[0],p[1],p[2]-e)],length=Math.hypot(...n);
 const id=vertices.length/3;vertices.push(...p);normals.push(...n.map(v=>v/length));cache.set(key,id);return id;
}
function triangle(a,b,c){
 const p=[a,b,c].map(i=>vertices.slice(i*3,i*3+3)),u=p[1].map((v,i)=>v-p[0][i]),v=p[2].map((n,i)=>n-p[0][i]);
 const cross=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
 const dot=cross.reduce((s,n,i)=>s+n*normals[a*3+i],0);indices.push(...(dot>0?[a,b,c]:[a,c,b]));
}
for(let z=0;z<size[2]-1;z++)for(let y=0;y<size[1]-1;y++)for(let x=0;x<size[0]-1;x++){
 const v=offsets.map(o=>values[index(x+o[0],y+o[1],z+o[2])]);if(v.every(n=>n>0)||v.every(n=>n<0))continue;
 const p=offsets.map(o=>[min[0]+(x+o[0])*step,min[1]+(y+o[1])*step,min[2]+(z+o[2])*step]);
 for(const t of tetrahedra){const inside=t.filter(i=>v[i]<=0),outside=t.filter(i=>v[i]>0);if(!inside.length||!outside.length)continue;
 const edge=(a,b)=>vertex(p[a],p[b],v[a],v[b]);
 if(inside.length===1||outside.length===1){const one=inside.length===1?inside:outside,others=inside.length===1?outside:inside;triangle(...others.map(i=>edge(one[0],i)));}
 else{const [a,b]=inside,[c,d]=outside,i=edge(a,c),j=edge(a,d),k=edge(b,c),l=edge(b,d);triangle(i,j,k);triangle(j,l,k);}
 }
}
const header=new Uint32Array([vertices.length/3,indices.length]);
const output=Buffer.concat([Buffer.from(header.buffer),Buffer.from(new Float32Array(vertices).buffer),Buffer.from(new Float32Array(normals).buffer),Buffer.from(new Uint32Array(indices).buffer)]);
fs.writeFileSync('dist/assets/hand-surface.bin',output);
console.log(JSON.stringify({vertices:vertices.length/3,triangles:indices.length/3,bytes:output.length}));
