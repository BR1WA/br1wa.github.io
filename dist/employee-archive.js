import * as THREE from './vendor/three.module.js';

const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.42,metalness:.42,...extra});
function slab(parent,w,h,d,material,x=0,y=0,z=0,r=.045){
 const shape=new THREE.Shape(),a=-w/2,b=-h/2;
 shape.moveTo(a+r,b);shape.lineTo(a+w-r,b);shape.quadraticCurveTo(a+w,b,a+w,b+r);shape.lineTo(a+w,b+h-r);shape.quadraticCurveTo(a+w,b+h,a+w-r,b+h);shape.lineTo(a+r,b+h);shape.quadraticCurveTo(a,b+h,a,b+h-r);shape.lineTo(a,b+r);shape.quadraticCurveTo(a,b,a+r,b);
 const geometry=new THREE.ExtrudeGeometry(shape,{depth:d,bevelEnabled:true,bevelSize:.008,bevelThickness:.008,bevelSegments:2,curveSegments:6});geometry.translate(0,0,-d/2);
 const object=new THREE.Mesh(geometry,material);object.position.set(x,y,z);parent.add(object);return object;
}
function line(parent,points,color=0x89aff0,opacity=.4){const object=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p))),new THREE.LineBasicMaterial({color,transparent:true,opacity}));parent.add(object);return object;}
function texture(w,h,draw){const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;draw(canvas.getContext('2d'));const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;return t;}
function text(c,label,x,y,size=18,color='#b6c9e5',weight=400){c.font=`${weight} ${size}px Arial`;c.fillStyle=color;c.fillText(label,x,y);}
function bar(c,x,y,w,color='#abbdd7',height=5){c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,height,2);c.fill();}
function face(parent,w,h,map,x,y,z){const object=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map,transparent:true}));object.position.set(x,y,z);parent.add(object);return object;}
function tag(parent,label,w,x,y,z){return face(parent,w,w*.16,texture(512,82,c=>{c.textAlign='center';text(c,label,256,51,25,'#bdcee5',500)}),x,y,z);}
function recordTexture(){return texture(480,620,c=>{
 c.fillStyle='#e9eff8';c.fillRect(0,0,480,620);c.fillStyle='#4679d1';c.fillRect(0,0,480,10);
 text(c,'EMPLOYEE / PROFILE',32,53,18,'#536d90',600);text(c,'Selected record',32,102,34,'#263e61',500);
 c.fillStyle='#d6e2f4';c.beginPath();c.roundRect(32,136,416,134,8);c.fill();c.fillStyle='#829fc9';c.beginPath();c.arc(89,187,24,0,Math.PI*2);c.fill();c.beginPath();c.ellipse(89,237,38,24,0,Math.PI,Math.PI*2);c.fill();bar(c,157,172,239,'#7d98bc',9);bar(c,157,201,165,'#9cafcb',7);bar(c,157,228,200,'#9cafcb',5);
 ['IDENTITY','ADMINISTRATIVE DETAILS','DOCUMENT STATUS'].forEach((label,i)=>{text(c,label,32,315+i*80,14,'#607b9f',600);bar(c,32,333+i*80,350-i*35,'#a5b8d4',7);});
 bar(c,32,555,416,'#c4d1e3',2);text(c,'SCHEMATIC PROFILE / NO PERSONAL DATA',32,585,13,'#7489a7');
});}
function queryTexture(selected=false){return texture(600,660,c=>{
 c.fillStyle='#182536';c.fillRect(0,0,600,660);text(c,'PERSONNEL REGISTER',34,54,19,'#91aed6',600);text(c,selected?'One profile, in focus.':'Find the right record.',34,109,33,'#e0ebfc',500);
 c.strokeStyle='#7199d3';c.lineWidth=2;c.beginPath();c.roundRect(34,149,532,67,8);c.stroke();c.beginPath();c.arc(61,178,10,0,Math.PI*2);c.moveTo(68,185);c.lineTo(77,194);c.stroke();text(c,selected?'Selected profile':'Search employee records',94,191,23,'#a9c3e8');
 ['PROFILE','STATUS','DOCUMENTS'].forEach((label,i)=>{c.fillStyle='#293e5a';c.beginPath();c.roundRect(34+i*180,239,163,37,5);c.fill();text(c,label,48+i*180,263,14,'#b5cae9');});
 for(let i=0;i<4;i++){const y=312+i*70;c.fillStyle=i===1&&selected?'#2e578a':'#223449';c.beginPath();c.roundRect(34,y,532,54,5);c.fill();text(c,`0${i+1}`,49,y+32,18,'#92b5e9');bar(c,102,y+16,225-i*23,'#728ba9',5);bar(c,102,y+32,160,'#485e79',4);bar(c,449,y+23,82,i===1&&selected?'#9fbfff':'#536d90',6);}
 text(c,'SEARCH  /  FILTER  /  SELECT',34,628,15,'#7395c4');
});}
function reportTexture(){return texture(640,720,c=>{
 c.fillStyle='#edf2fa';c.fillRect(0,0,640,720);c.fillStyle='#2c5fae';c.fillRect(0,0,640,9);text(c,'EMPLOYEE MANAGER',35,53,19,'#58759b',600);text(c,'Personnel export',35,110,38,'#294464',500);text(c,'Structured records, ready for reporting.',35,149,20,'#7489a5');
 c.fillStyle='#d7e2f2';c.fillRect(35,189,570,48);['PROFILE','STATUS','DOCUMENTS'].forEach((label,i)=>text(c,label,48+i*187,220,15,'#47688e',600));
 for(let i=0;i<6;i++){const y=237+i*51;if(i%2===0){c.fillStyle='#e2eaf5';c.fillRect(35,y,570,51);}for(let col=0;col<3;col++)bar(c,48+col*187,y+21,col===0?128:104,'#94abc9',6);}
 for(let i=0;i<4;i++){c.strokeStyle='#bacce2';c.lineWidth=1;c.beginPath();c.moveTo(35+i*190,189);c.lineTo(35+i*190,543);c.stroke();}
 text(c,'FILTERED RECORDS',35,596,15,'#6883a7',600);bar(c,35,618,340,'#abbdd4',7);bar(c,35,640,259,'#c0cede',5);text(c,'SCHEMATIC EXPORT / NO PERSONAL DATA',35,687,13,'#8295b1');
});}

export function createEmployeeModel(root,color,host){
 const assembly=new THREE.Group();assembly.rotation.set(.055,-.34,0);root.add(assembly);
 const metal=mat(0x46576e),edge=mat(0x8197b4),dark=mat(0x1f2b3b),light=mat(0xc2d0e3),accent=mat(0x7ca5ed,{emissive:0x315ca6,emissiveIntensity:.25});
 const plinth=slab(assembly,4.85,2.65,.12,dark,0,-1.65,.04,.16);plinth.rotation.x=-Math.PI/2;
 const deck=slab(assembly,4.67,2.48,.022,mat(0x26354a,{roughness:.65}),0,-1.573,.04,.13);deck.rotation.x=-Math.PI/2;
 for(let i=-5;i<=5;i++)line(assembly,[[i*.4,-1.548,-1.07],[i*.4,-1.548,1.13]],0x93b4e4,.07);
 for(let i=-2;i<=2;i++)line(assembly,[[-2.2,-1.548,i*.42],[2.2,-1.548,i*.42]],0x93b4e4,.07);

 // An open archive exposes its sliding mechanisms, dividers, and indexed folders.
 const cabinet=new THREE.Group();cabinet.position.set(-1.12,-.12,-.16);assembly.add(cabinet);
 slab(cabinet,2.05,2.69,.10,dark,0,0,-.47,.08);
 for(const x of [-1.02,1.02]){
  const side=slab(cabinet,.095,2.71,1.12,x>0?mat(0x658ab9,{transparent:true,opacity:.22,depthWrite:false,roughness:.18,metalness:.1}):metal,x,0,.04,.025);
  if(x>0){const edges=new THREE.LineSegments(new THREE.EdgesGeometry(side.geometry,35),new THREE.LineBasicMaterial({color:0x7696c2,transparent:true,opacity:.32}));side.add(edges);}
  slab(cabinet,.035,2.51,.026,edge,x,0,.616,.01);
 }
 for(const y of [-1.36,1.36]){const cap=slab(cabinet,2.19,1.16,.08,metal,0,y,.04,.065);cap.rotation.x=-Math.PI/2;}
 const roof=slab(cabinet,2.06,.97,.022,edge,0,1.413,.04,.055);roof.rotation.x=-Math.PI/2;
 tag(cabinet,'PERSONNEL / REGISTER',1.64,0,1.23,.625);
 for(let row=0;row<3;row++){const y=.78-row*.85;for(let side of [-1,1]){
  slab(cabinet,.075,.055,1.02,edge,side*.89,y-.26,.08,.018);
  slab(cabinet,.045,.032,.95,light,side*.89,y-.24,.15,.01);
 }}
 const drawers=[],folders=[];
 for(let row=0;row<3;row++){
  const drawer=new THREE.Group();drawer.position.set(0,.78-row*.85,0);cabinet.add(drawer);drawers.push(drawer);
  const floor=slab(drawer,1.74,.97,.04,metal,0,-.24,.06,.028);floor.rotation.x=-Math.PI/2;
  for(const x of [-.85,.85])slab(drawer,.027,.24,.93,edge,x,-.10,.07,.012);
  slab(drawer,1.84,.30,.065,metal,0,-.115,.59,.035);
  slab(drawer,.68,.055,.10,edge,.23,-.10,.66,.02);
  face(drawer,.53,.12,texture(256,64,c=>{text(c,`0${row+1} / INDEX`,12,43,25,'#d2e1f6',500)}),-.52,-.12,.631);
  for(let j=0;j<5;j++){
   const folder=new THREE.Group();folder.position.set(0,.095,-.24+j*.15);drawer.add(folder);folders.push(folder);
   slab(folder,1.57,.50,.023,mat(j===2?0x88a9d9:0x8a9eb8),0,0,0,.025);
   slab(folder,.34,.10,.025,j===2?accent:light,-.57+(j%3)*.47,.295,0,.025);
   slab(folder,1.45,.46,.009,light,0,.026,-.018,.016);
   face(folder,.95,.27,texture(384,108,c=>{text(c,`PROFILE / 0${row+1}–0${j+1}`,8,32,23,'#304b6e',600);bar(c,8,53,276,'#a7bad5',5);bar(c,8,74,215,'#a7bad5',5)}),-.18,.045,.022);
  }
 }
 for(const x of [-.99,.99])for(const y of [-1.23,1.23]){const screw=new THREE.Mesh(new THREE.SphereGeometry(.025,12,8),light);screw.position.set(x,y,.643);cabinet.add(screw);}
 // The right-hand surface changes from register to extracted profile to report.
 const workspace=new THREE.Group();workspace.position.set(1.31,.10,.08);workspace.rotation.y=-.055;assembly.add(workspace);
 const foot=slab(workspace,1.57,.98,.095,metal,0,-1.62,.0,.08);foot.rotation.x=-Math.PI/2;
 slab(workspace,.12,.60,.13,edge,0,-1.29,-.24,.022);
 const screenFrame=slab(workspace,1.82,2.12,.09,dark,0,-.03,0,.075);
 const searchMaps=[queryTexture(),queryTexture(true)],screen=face(workspace,1.69,1.99,searchMaps[0],0,-.03,.061);
 const screwGeo=new THREE.SphereGeometry(.017,12,8);for(const x of [-.79,.79]){const screw=new THREE.Mesh(screwGeo,edge);screw.position.set(x,.94,.053);workspace.add(screw);}

 const profile=new THREE.Group();profile.position.set(-1.10,-.10,.13);assembly.add(profile);
 slab(profile,1.55,2.01,.045,light,0,0,0,.05);face(profile,1.48,1.92,recordTexture(),0,0,.033);profile.rotation.y=-.08;
 const clip=slab(profile,.38,.085,.045,edge,0,1.025,.016,.02);
 const report=new THREE.Group();report.position.set(1.28,.14,.34);report.rotation.set(-.025,-.12,.025);assembly.add(report);
 for(let i=2;i>=0;i--)slab(report,1.83,2.08,.015,mat(i===0?0xe5edf9:0xa6b9d4),i*.025,i*.018,-i*.028,.02);
 face(report,1.79,2.01,reportTexture(),0,0,.022);
 const binder=slab(report,.22,.27,.04,edge,-.58,1.04,.01,.045);slab(report,.12,.11,.046,dark,-.58,1.09,.014,.025);

 const routeCurve=new THREE.CatmullRomCurve3([[-1.13,-1.52,.93],[-.45,-1.52,1.05],[.43,-1.52,1.05],[1.35,-1.52,.74]].map(p=>new THREE.Vector3(...p)));
 const track=new THREE.Mesh(new THREE.TubeGeometry(routeCurve,60,.013,6,false),new THREE.MeshBasicMaterial({color:0x749dde,transparent:true,opacity:.5}));assembly.add(track);
 const pulse=new THREE.Mesh(new THREE.SphereGeometry(.036,16,10),new THREE.MeshBasicMaterial({color:0xd6e5ff}));assembly.add(pulse);
 const scanningLine=slab(cabinet,1.64,.017,.017,accent,0,.4,.66,.006);
 const brackets=new THREE.Group();cabinet.add(brackets);for(const side of [-1,1])line(brackets,[[side*.88,.42,.71],[side*.99,.42,.71],[side*.99,-.39,.71],[side*.88,-.39,.71]],0x91b9ff,.8);
 tag(assembly,'ORGANIZE',1.18,-1.11,-1.39,1.17);tag(assembly,'FIND → EXPORT',1.53,1.32,-1.39,1.17);

 host.insertAdjacentHTML('beforeend',`<div class="archive-heading" aria-hidden="true"><span>01 / STRUCTURED RECORDS</span><strong>A place for every profile.</strong></div><div class="archive-process" aria-hidden="true"><span data-archive-phase="0"><i>01</i> Organize</span><b>→</b><span data-archive-phase="1"><i>02</i> Find</span><b>→</b><span data-archive-phase="2"><i>03</i> Export</span></div>`);
 const heading=host.querySelector('.archive-heading'),phases=[...host.querySelectorAll('[data-archive-phase]')];
 const copy=[['01 / STRUCTURED RECORDS','A place for every profile.'],['02 / SEARCH & FILTER','Bring the relevant record into focus.'],['03 / REPORTING & EXPORTS','Turn selected records into usable information.']];
 let active=0,started=null,travel=0;
 return {
  setStep(step){active=step;started=null;travel=0;heading.querySelector('span').textContent=copy[step][0];heading.querySelector('strong').textContent=copy[step][1];phases.forEach((p,i)=>p.classList.toggle('is-active',i===step));profile.visible=step===1;report.visible=step===2;workspace.visible=step===0;screen.material.map=searchMaps[step===0?0:1];brackets.visible=step===1;scanningLine.visible=step===1;},
  resize(width,height){const compact=width<=520;assembly.scale.setScalar(compact?Math.min(.84,(width/height)*1.09):.84);assembly.position.y=.34;},
  update(t,step,still){
   const ease=still?1:.06;if(started===null)started=t;
   drawers.forEach((drawer,i)=>{const opened=(active===0&&i===0)||(active===1&&i===1);drawer.position.z=THREE.MathUtils.lerp(drawer.position.z,opened?(active===1?.66:.29):.015,ease);});
   const progress=still?1:Math.min(1,Math.max(0,(t-started-.25)/1.2));travel=progress*progress*(3-2*progress);
   profile.position.set(THREE.MathUtils.lerp(-1.12,1.3,travel),THREE.MathUtils.lerp(-.05,.16,travel)+Math.sin(travel*Math.PI)*.35,THREE.MathUtils.lerp(.62,.42,travel));profile.scale.setScalar(THREE.MathUtils.lerp(.30,1,travel));
   report.position.y=THREE.MathUtils.lerp(report.position.y,active===2?.25:-.25,ease);
   scanningLine.position.y=still?.09:.74-(Math.sin(t*1.45)+1)*.85;
   pulse.visible=active>0;pulse.position.copy(routeCurve.getPoint(still?.6:(t*.2)%1));
   host.dataset.archiveExtraction=active===1?(travel>=1?'complete':'moving'):'idle';
  }
 };
}
