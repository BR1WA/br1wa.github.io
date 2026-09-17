import * as THREE from './vendor/three.module.js';

const palette={paper:0xe6edf8,metal:0x394658,dark:0x192330,blue:0x81aaff};
const standard=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.34,metalness:.35,...extra});

function roundedShape(w,h,r){
 const s=new THREE.Shape(),x=-w/2,y=-h/2;
 s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;
}
function slab(parent,w,h,d,material,x=0,y=0,z=0,r=.06){
 const geometry=new THREE.ExtrudeGeometry(roundedShape(w,h,r),{depth:d,bevelEnabled:true,bevelThickness:.012,bevelSize:.012,bevelSegments:2,steps:1,curveSegments:8});
 geometry.translate(0,0,-d/2);const object=new THREE.Mesh(geometry,material);object.position.set(x,y,z);parent.add(object);return object;
}
function plane(parent,w,h,map,x,y,z){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map,transparent:true}));m.position.set(x,y,z);parent.add(m);return m;}
function line(parent,points,color=0x81aaff,opacity=.45){const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p))),new THREE.LineBasicMaterial({color,transparent:true,opacity}));parent.add(l);return l;}
function texture(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
function type(c,label,x,y,size=20,color='#c5d5ee',weight=400){c.fillStyle=color;c.font=`${weight} ${size}px Arial`;c.fillText(label,x,y);}
function rule(c,x,y,w,color='#a8b7ce',h=6){c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,h,3);c.fill();}
function profileTexture(index){return texture(384,480,c=>{
 c.fillStyle='#e7eef8';c.fillRect(0,0,384,480);c.fillStyle='#255de0';c.fillRect(0,0,384,8);
 type(c,'HR / PERSONNEL',25,43,16,'#526884',600);type(c,`PROFILE 0${index}`,25,85,26,'#243956',600);
 c.fillStyle='#d4e0f2';c.beginPath();c.roundRect(25,113,334,110,8);c.fill();c.fillStyle='#7d9fce';c.beginPath();c.arc(77,154,19,0,Math.PI*2);c.fill();c.beginPath();c.ellipse(77,194,32,19,0,Math.PI,Math.PI*2);c.fill();
 rule(c,131,144,180,'#8ba1bd',8);rule(c,131,171,130,'#b1bfd2');rule(c,131,194,152,'#b1bfd2',4);
 ['DEPARTMENT','POSITION','DOCUMENTS'].forEach((t,i)=>{type(c,t,25,260+i*64,12,'#607693',600);rule(c,25,274+i*64,275-i*36,'#a7b8d0',7)});
 type(c,'SCHEMATIC RECORD',25,453,12,'#627693');
});}
function reviewTexture(completed=0){const approved=completed===3;return texture(512,600,c=>{
 c.fillStyle='#172332';c.fillRect(0,0,512,600);type(c,'ADMINISTRATION',36,49,18,'#8ca8cf');type(c,'Request review',36,103,38,'#e6efff',500);
 rule(c,36,135,440,'#384e6d',2);type(c,'CERTIFICATE REQUEST',36,181,17,'#9ab5dd',600);
 ['Employee record','Request details','Authorization'].forEach((label,i)=>{const y=235+i*90;c.strokeStyle=i<completed?'#8fb5ff':'#597496';c.lineWidth=2;c.strokeRect(38,y,24,24);if(i<completed){c.beginPath();c.moveTo(43,y+12);c.lineTo(49,y+18);c.lineTo(59,y+6);c.stroke();}type(c,label,82,y+21,24,'#d3e2f9');rule(c,82,y+41,310-i*44,'#415776',4);});
 c.fillStyle=approved?'#2b579f':'#253b57';c.beginPath();c.roundRect(36,517,440,49,6);c.fill();type(c,approved?'REVIEW COMPLETE':'REVIEW WORKFLOW',60,549,18,'#c7dcff',600);
});}
function certificateTexture(){return texture(600,820,c=>{
 c.fillStyle='#f1f4fa';c.fillRect(0,0,600,820);c.strokeStyle='#91aace';c.lineWidth=2;c.strokeRect(24,24,552,772);c.strokeStyle='#c3d0e3';c.strokeRect(34,34,532,752);
 c.fillStyle='#2c5db5';c.beginPath();c.arc(300,103,29,0,Math.PI*2);c.fill();c.fillStyle='#eaf1ff';c.fillRect(286,94,28,4);c.fillRect(290,103,20,17);
 c.textAlign='center';type(c,'HR-SYSTEM',300,169,20,'#365581',600);type(c,'CERTIFICATE',300,247,42,'#263e63',500);type(c,'Administrative document',300,289,20,'#647b9d');
 c.textAlign='left';rule(c,72,339,456,'#9fb2cc',2);for(let i=0;i<6;i++)rule(c,72,380+i*35,[456,416,440,368,456,302][i],'#bac8dc',7);
 type(c,'AUTHORIZED',72,663,15,'#6981a5',600);rule(c,72,688,185,'#9aacc7',2);type(c,'Schematic document',72,717,16,'#7388a7');
 c.save();c.translate(458,656);c.strokeStyle='#6486bc';c.lineWidth=3;for(const r of [43,36]){c.beginPath();c.arc(0,0,r,0,Math.PI*2);c.stroke();}c.beginPath();c.moveTo(-17,0);c.lineTo(-4,12);c.lineTo(20,-14);c.stroke();c.restore();
 type(c,'PDF / GENERATED CERTIFICATE',72,766,13,'#768aaa');
});}
function placard(parent,label,w,x,y,z){const t=texture(512,96,c=>{c.textAlign='center';type(c,label,256,60,25,'#acbfda',500)});return plane(parent,w,w*96/512,t,x,y,z);}

export function createHRModel(root,color,host){
 const assembly=new THREE.Group();assembly.rotation.set(.10,-.26,0);assembly.position.y=-.04;root.add(assembly);
 const alloy=standard(palette.metal),edge=standard(0x677e9e),blue=standard(palette.blue,{emissive:0x386acd,emissiveIntensity:.35});
 const base=slab(assembly,5.35,3.05,.15,standard(0x263240),0,-1.40,0,.20);base.rotation.x=-Math.PI/2;
 const inset=slab(assembly,5.15,2.85,.035,standard(0x1c2837,{roughness:.6,metalness:.25}),0,-1.30,0,.16);inset.rotation.x=-Math.PI/2;
 const baseRim=new THREE.EdgesGeometry(base.geometry,35);const rim=new THREE.LineSegments(baseRim,new THREE.LineBasicMaterial({color:0x6c8cb8,transparent:true,opacity:.30}));base.add(rim);
 for(let i=-6;i<=6;i++)line(assembly,[[i*.38,-1.269,-1.30],[i*.38,-1.269,1.30]],0x829fc5,.055);
 for(let i=-3;i<=3;i++)line(assembly,[[-2.4,-1.269,i*.38],[2.4,-1.269,i*.38]],0x829fc5,.055);
 const screws=new THREE.CylinderGeometry(.045,.045,.014,16);for(const x of [-2.46,2.46])for(const z of [-1.31,1.31]){const screw=new THREE.Mesh(screws,edge);screw.position.set(x,-1.271,z);assembly.add(screw);line(assembly,[[x-.022,-1.261,z],[x+.022,-1.261,z]],0x17212f,1);}

 // A personnel register with layered, individually indexed record cards.
 const directory=new THREE.Group();directory.position.set(-1.65,-.06,.06);assembly.add(directory);
 const tray=slab(directory,1.40,.80,.13,alloy,0,-1.10,.02,.08);tray.rotation.x=-Math.PI/2;
 slab(directory,1.39,.29,.075,edge,0,-1.01,.41,.04);
 for(let i=0;i<3;i++){const divider=slab(directory,1.29,.52,.045,alloy,0,-.98,-.30+i*.26,.03);divider.rotation.x=-.12;}
 const records=[];
 for(let i=2;i>=0;i--){const record=new THREE.Group();record.position.set((i-1)*.045,.02+i*.075,-i*.23);record.rotation.x=-.055;directory.add(record);
  slab(record,1.21,1.64,.045,standard(i===0?palette.paper:0x8a9db8),0,0,0,.05);plane(record,1.16,1.53,profileTexture(i+1),0,0,.036);
  slab(record,.37,.10,.043,blue,-.33+i*.31,.85,-.005,.025);records.push(record);
 }
 const selected=records[2];
 placard(assembly,'01 / PERSONNEL',1.43,-1.65,-1.05,.85);

 // An approval terminal makes the middle step an explicit administrative action.
 const review=new THREE.Group();review.position.set(-.03,.0,-.25);review.rotation.y=-.055;assembly.add(review);
 const foot=slab(review,1.10,.70,.10,alloy,0,-1.13,.0,.10);foot.rotation.x=-Math.PI/2;
 slab(review,.17,.70,.14,edge,0,-.85,-.18,.03);
 const monitor=slab(review,1.53,1.80,.13,alloy,0,.16,0,.10);
 const reviewMaps=[0,1,2,3].map(reviewTexture);
 const screen=plane(review,1.38,1.63,reviewMaps[0],0,.16,.084);
 const sensor=new THREE.Mesh(new THREE.SphereGeometry(.019,12,8),blue);sensor.position.set(0,1.018,.075);review.add(sensor);
 for(let i=0;i<5;i++)slab(review,.03,.12,.02,standard(0x111b28),.58-i*.09,-.87,-.23,.01);
 placard(assembly,'02 / REVIEW',1.25,0,-1.05,.85);

 // A layered document rises out of the output tray after the review stage.
 const output=new THREE.Group();output.position.set(1.65,0,.05);assembly.add(output);
 const printer=slab(output,1.46,.38,.97,alloy,0,-1.03,-.03,.07);
 slab(output,1.16,.032,.24,standard(0x0d1520),0,-.821,.02,.014);
 const led=slab(output,.20,.045,.015,blue,.49,-1.02,.473,.012);
 for(let i=0;i<4;i++)slab(output,.13,.025,.018,edge,-.40+i*.19,-1.06,.475,.008);
 const paper=new THREE.Group();paper.position.set(0,-.28,-.015);paper.rotation.set(-.10,.05,-.025);output.add(paper);
 for(let i=2;i>=0;i--)slab(paper,1.31,1.82,.015,standard(i===0?palette.paper:0x9dafc9),i*.025,i*.023,-i*.035,.016);
 plane(paper,1.29,1.79,certificateTexture(),0,0,.022);
 // Embossed seal and ribbons catch the light without suggesting a real institution's seal.
 const seal=new THREE.Group();seal.position.set(.38,-.54,.06);paper.add(seal);
 const medallion=new THREE.Mesh(new THREE.CylinderGeometry(.115,.115,.025,48),blue);medallion.rotation.x=Math.PI/2;seal.add(medallion);
 const sealRing=new THREE.Mesh(new THREE.TorusGeometry(.088,.004,6,40),standard(0xc4d9ff));sealRing.position.z=.02;seal.add(sealRing);
 line(seal,[[-.037,0,.023],[-.009,-.023,.023],[.043,.033,.023]],0xe2edff,1);
 for(const side of [-1,1]){const ribbon=slab(seal,.055,.16,.008,standard(0x496fab),side*.046,-.12,-.014,.005);ribbon.rotation.z=side*.17;}
 placard(assembly,'03 / CERTIFICATE',1.54,1.65,-1.05,.85);

 // Routed data paths connect the three stations on the shared substrate.
 const paths=[
  [[-1.64,-1.24,.55],[-1.64,-1.24,1.07],[-.68,-1.24,1.07],[-.68,-1.24,.40],[0,-1.24,.40]],
  [[0,-1.24,.45],[.58,-1.24,.45],[.58,-1.24,1.07],[1.67,-1.24,1.07],[1.67,-1.24,.45]]
 ];
 const routes=paths.map(points=>{
  const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)),false,'centripetal');
  const track=new THREE.Mesh(new THREE.TubeGeometry(curve,64,.013,6,false),new THREE.MeshBasicMaterial({color:0x7199d6,transparent:true,opacity:.38}));assembly.add(track);
  const particle=new THREE.Mesh(new THREE.SphereGeometry(.032,16,10),new THREE.MeshBasicMaterial({color:0xd6e7ff}));assembly.add(particle);return {curve,track,particle};
 });
 const stations=[directory,review,output].map((g,i)=>{
  const indicator=slab(assembly,.72,.025,.065,blue,[-1.65,0,1.65][i],-1.29,1.41,.008);return indicator;
 });
 host.insertAdjacentHTML('beforeend',`<div class="hr-scene-heading" aria-hidden="true"><span>01 / PERSONNEL DIRECTORY</span><strong>Every document starts with a record.</strong></div><div class="hr-workflow-strip" aria-hidden="true"><span data-hr-phase="0"><i>01</i> Personnel</span><b>→</b><span data-hr-phase="1"><i>02</i> Review</span><b>→</b><span data-hr-phase="2"><i>03</i> Certificate</span></div>`);
 const heading=host.querySelector('.hr-scene-heading'),phaseLabels=[...host.querySelectorAll('[data-hr-phase]')];
 const copy=[['01 / PERSONNEL DIRECTORY','Every document starts with a record.'],['02 / ADMINISTRATIVE REVIEW','A request becomes an authorized action.'],['03 / DOCUMENT GENERATION','Approved information. A finished certificate.']];
 let active=0,sequenceStart=null;
 return {
  setStep(step){active=step;sequenceStart=null;heading.querySelector('span').textContent=copy[step][0];heading.querySelector('strong').textContent=copy[step][1];phaseLabels.forEach((label,i)=>label.classList.toggle('is-active',i===step));screen.material.map=reviewMaps[step===2?3:0];seal.visible=step===2;stations.forEach((s,i)=>{s.material=i===step?blue:alloy});},
  resize(width,height){const compact=width<=520;assembly.scale.setScalar(compact?Math.min(.84,(width/height)*1.03):.84);assembly.position.y=compact?.18:.23;},
  update(t,step,still){
   const ease=still?1:.065;
   if(sequenceStart===null)sequenceStart=t;
   if(active===1){const completed=still?3:Math.min(3,Math.floor((t-sequenceStart)*1.4)+1);screen.material.map=reviewMaps[completed];host.dataset.hrReviewChecks=String(completed);}else host.dataset.hrReviewChecks=String(active===2?3:0);
   selected.position.y=THREE.MathUtils.lerp(selected.position.y,active===0?.25+(still?0:Math.sin(t*.85)*.022):.02,ease);
   selected.position.z=THREE.MathUtils.lerp(selected.position.z,active===0?.23:.0,ease);
   review.position.y=THREE.MathUtils.lerp(review.position.y,active===1?.20:0,ease);
   paper.position.y=THREE.MathUtils.lerp(paper.position.y,active===2?.30:-.28,ease);
   paper.rotation.z=THREE.MathUtils.lerp(paper.rotation.z,active===2?-.06:-.025,ease);
   paper.position.z=THREE.MathUtils.lerp(paper.position.z,active===2?.23:-.015,ease);
   routes.forEach(({curve,particle,track},i)=>{particle.position.copy(curve.getPoint(still?.52:(t*.19+i*.4)%1));particle.visible=active>i;track.material.opacity=active>i?.72:.25});
   led.material.emissiveIntensity=still?.35:.28+Math.sin(t*1.7)*.10;
  }
 };
}
