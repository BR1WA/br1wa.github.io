import * as THREE from './vendor/three.module.js';

const definitions={
 asl:{title:'THE HAND-LANDMARK PIPELINE',figure:'FIG. 02',color:0x8db2ff,steps:['Landmarks','Features','Classification'],descriptions:['21 hand landmarks form a spatial skeleton. The model illustrates the input used by the recognition pipeline.','The Random Forest path uses 75 engineered features: landmark coordinates and geometric distances.','MobileNet and Random Forest provide two approaches to 26 alphabet classes. This is a conceptual model, not a live prediction.']},
 hr:{title:'PEOPLE → DOCUMENTS',figure:'FIG. 03',color:0x8db2ff,steps:['Personnel','Review','Certificate'],descriptions:['Employee profiles connect personnel information to the university’s HR workflows.','Certificate requests pass through an administrative review and approval workflow.','Approved requests become generated PDF certificates. The model contains schematic profiles only.']},
 employee:{title:'THE PERSONNEL ARCHIVE',figure:'FIG. 04',color:0x8db2ff,steps:['Records','Find a profile','Reports'],descriptions:['A structured register organizes employee profiles and administrative information.','Search and filters surface the relevant profile from the personnel archive.','Exports make selected records useful for reporting and administration. No real employee data is shown.']},
 resume:{title:'A DOCUMENT, BUILT IN LAYERS',figure:'FIG. 05',color:0x8db2ff,steps:['Compose','EN / العربية','PDF'],descriptions:['Education, experience, and skills are editable sections that come together as a résumé.','English and Arabic support adapt the document to different audiences, including right-to-left reading.','The completed profile becomes a downloadable PDF. The floating document is a schematic example.']}
};
let paused=document.body.classList.contains('motion-paused')||matchMedia('(prefers-reduced-motion: reduce)').matches;
const instances=[];
const sphereGeometry=new THREE.SphereGeometry(1,24,16),boxGeometry=new THREE.BoxGeometry(1,1,1);
const material=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.4,metalness:.15,...extra});
function mesh(geometry,mat,parent,x=0,y=0,z=0){const o=new THREE.Mesh(geometry,mat);o.position.set(x,y,z);parent.add(o);return o}
function box(parent,w,h,d,mat,x=0,y=0,z=0){const m=mesh(boxGeometry,mat,parent,x,y,z);m.scale.set(w,h,d);return m}
function ball(parent,r,mat,x=0,y=0,z=0){const m=mesh(sphereGeometry,mat,parent,x,y,z);m.scale.setScalar(r);return m}
function rod(parent,a,b,r,mat){const m=mesh(new THREE.CylinderGeometry(r,r,1,10),mat,parent);positionRod(m,a,b);return m}
function positionRod(m,a,b){m.position.copy(a).add(b).multiplyScalar(.5);const delta=b.clone().sub(a);m.scale.y=delta.length();m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize())}
function rounded(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill()}
function texture(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');draw(ctx,w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
function text(ctx,value,x,y,size,color='#263449',align='left'){ctx.fillStyle=color;ctx.font=`500 ${size}px Arial`;ctx.textAlign=align;ctx.fillText(value,x,y)}
function documentTexture(title,accent='#739fff',kind='document'){
 return texture(512,680,(c,w)=>{c.fillStyle='#f2f4f6';c.fillRect(0,0,w,680);c.fillStyle=accent;c.fillRect(0,0,w,15);text(c,title,40,67,28);c.fillStyle='#cdd6df';
 if(kind==='profile'){c.fillStyle=accent;c.beginPath();c.arc(84,145,28,0,Math.PI*2);c.fill();rounded(c,46,182,76,25,10);c.fillStyle='#a9b8c8';rounded(c,155,130,280,14,6);rounded(c,155,165,180,11,5);}
 for(let i=0;i<5;i++){const y=kind==='profile'?255+i*66:140+i*88;c.fillStyle=i===0?accent:'#d3dce5';rounded(c,40,y,i%2?315:420,13,5);c.fillStyle='#e0e5eb';rounded(c,40,y+26,390,9,4)}
 if(kind==='certificate'){c.strokeStyle=accent;c.lineWidth=6;c.beginPath();c.arc(397,565,39,0,Math.PI*2);c.stroke();c.beginPath();c.moveTo(378,566);c.lineTo(391,579);c.lineTo(415,550);c.stroke();}
 });
}
function card(parent,w,h,map,x=0,y=0,z=0){const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);box(g,w,h,.09,material(0xc9d6e1),0,0,-.035);const face=mesh(new THREE.PlaneGeometry(w-.025,h-.025),new THREE.MeshBasicMaterial({map}),g,0,0,.014);return {group:g,face}}
function route(parent,points,color){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));const line=mesh(new THREE.TubeGeometry(curve,60,.018,7,false),material(color,{emissive:color,emissiveIntensity:.25,transparent:true,opacity:.55}),parent);const particle=ball(parent,.075,material(color,{emissive:color,emissiveIntensity:1}));return t=>{particle.position.copy(curve.getPoint((t*.16)%1))}}
function base(parent,color){const m=mesh(new THREE.CylinderGeometry(2.15,2.22,.13,64),material(0x303640,{metalness:.4}),parent,0,-1.90,0);const ring=mesh(new THREE.TorusGeometry(2.17,.014,8,90),material(color,{emissive:color,emissiveIntensity:.3}),parent,0,-1.82,0);ring.rotation.x=Math.PI/2;return m}

function handModel(root,color){
 const accent=material(color,{emissive:color,emissiveIntensity:.12}),muted=material(0x535f73),joint=material(0xe3ecff,{emissive:color,emissiveIntensity:.18});
 const hand=new THREE.Group();hand.position.x=-.65;hand.rotation.z=-.10;root.add(hand);
 const raw=[[0,-1.65,0],[-.55,-1.05,.04],[-1.03,-.62,.12],[-1.38,-.16,.20],[-1.65,.20,.24],[-.65,-.24,0],[-.78,.68,.03],[-.81,1.25,.07],[-.78,1.80,.11],[0,-.12,-.08],[-.04,.92,-.04],[-.04,1.60,.02],[-.02,2.15,.08],[.59,-.24,0],[.67,.73,.03],[.72,1.33,.09],[.74,1.85,.13],[1.06,-.55,.10],[1.22,.20,.17],[1.32,.76,.23],[1.4,1.22,.30]];
 const points=raw.map(p=>new THREE.Vector3(...p));const joints=points.map((p,i)=>ball(hand,[4,8,12,16,20].includes(i)?.10:.075,joint,...p.toArray()));
 const pairs=[[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[0,17],[17,18],[18,19],[19,20]];
 const bones=pairs.map(([a,b])=>rod(hand,points[a],points[b],.044,accent));
 const palmGeo=new THREE.BufferGeometry();const palmIndices=[0,1,5,9,13,17];const vertices=[];for(let i=1;i<palmIndices.length-1;i++)for(const j of [palmIndices[0],palmIndices[i],palmIndices[i+1]])vertices.push(...points[j].toArray());palmGeo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));palmGeo.computeVertexNormals();mesh(palmGeo,material(0x638acb,{transparent:true,opacity:.3,side:THREE.DoubleSide,depthWrite:false}),hand);
 const measurements=[[4,8],[8,12],[12,16],[16,20],[0,12]].map(([a,b])=>rod(hand,points[a],points[b],.008,material(0xffffff,{transparent:true,opacity:.8})));
 const labels=[['21','LANDMARKS'],['75','FEATURES'],['A–Z','26 CLASSES']].map(([big,small])=>texture(256,320,c=>{c.fillStyle='#202631';c.fillRect(0,0,256,320);text(c,big,128,147,62,'#a9c4ff','center');text(c,small,128,202,19,'#b5bfce','center');c.strokeStyle='#52637c';c.strokeRect(14,14,228,292)}));
 const panel=card(root,1.17,1.48,labels[0],1.86,.05,.15);panel.group.rotation.y=-.1;
 const scanner=box(hand,3.5,.014,.035,material(color,{emissive:color,emissiveIntensity:.7,transparent:true,opacity:.35}),0,0,.39);
 return {setStep(step){panel.face.material.map=labels[step];measurements.forEach(m=>m.visible=step===1);bones.forEach(m=>m.material=step===2?muted:accent);joints.forEach(j=>j.material=step===1?accent:joint)},update(t,step,still){scanner.position.y=still?.3:-1.35+(Math.sin(t*.8)+1)*1.55;scanner.visible=step===0;hand.rotation.y=still?-.07:Math.sin(t*.38)*.12;}};
}
function hrModel(root,color){
 base(root,color);const people=new THREE.Group();people.position.set(-1.30,0,-.25);root.add(people);const mat=material(color),dark=material(0x697789);
 const person=(x,y,z,s)=>{const g=new THREE.Group();g.position.set(x,y,z);g.scale.setScalar(s);people.add(g);ball(g,.28,mat,0,.75);mesh(new THREE.CapsuleGeometry(.30,.42,8,16),dark,g,0,.02,0);const disc=mesh(new THREE.CylinderGeometry(.62,.65,.1,32),material(0x353e4c),g,0,-.55,0);return g};
 person(-.60,-.2,.35,1);person(.48,.35,-.55,.82);person(.75,-.6,.55,.70);
 const cert=card(root,1.90,2.6,documentTexture('CERTIFICATE','#739fff','certificate'),1.35,.05,.20);cert.group.rotation.set(-.06,-.18,.035);
 const request=card(root,.88,1.2,documentTexture('REQUEST','#739fff','profile'),-.25,-.75,1.10);request.group.rotation.z=-.15;
 const orbit=route(root,[[-1.4,.95,0],[-.9,1.80,0],[.6,1.88,.15],[1.35,1.48,.2]],color);
 const seal=mesh(new THREE.TorusGeometry(.23,.045,10,32),material(color,{emissive:color,emissiveIntensity:.25}),root,1.78,-.84,.30);
 return {setStep(step){seal.visible=step===2;request.group.visible=step!==2;people.traverse(o=>{if(o.isMesh)o.material.emissive?.setHex(step===0?0x101827:0x000000)})},update(t,step,still){orbit(still?2:t);cert.group.position.z=THREE.MathUtils.lerp(cert.group.position.z,step===2?.75:.2,still?1:.065);request.group.position.y=-.65+(still?0:Math.sin(t*.7)*.08);}};
}
function employeeModel(root,color){
 base(root,color);const cabinet=new THREE.Group();cabinet.position.set(-.70,-.20,0);root.add(cabinet);const frame=material(0x4b5668),front=material(0x79869a),accent=material(color,{emissive:color,emissiveIntensity:.08});
 box(cabinet,2.25,2.72,.85,frame,0,0,-.22);box(cabinet,2.3,.13,.94,material(0xaab5c6),0,1.42,-.22);const drawers=[];
 for(let i=0;i<3;i++){const g=new THREE.Group();g.position.set(0,.9-i*.88,.27);cabinet.add(g);box(g,2.04,.73,.75,front,0,0,-.35);box(g,1.0,.075,.11,accent,0,.10,.07);box(g,.44,.13,.016,material(0xe4e9f2),-.58,-.16,.043);for(let j=0;j<4;j++)box(g,1.8,.12,.045,material(j===1?color:0xcfd8e6),0,.3,-.15-j*.13);drawers.push(g)}
 const profile=card(root,1.35,1.85,documentTexture('PROFILE','#739fff','profile'),1.58,.32,.72);profile.group.rotation.set(.02,-.22,-.05);
 const bars=new THREE.Group();bars.position.set(1.62,-1.55,.5);root.add(bars);[.5,.8,.65,1.0].forEach((h,i)=>box(bars,.18,h,.18,accent,(i-1.5)*.31,h/2,0));
 const move=route(root,[[.45,.1,.2],[1.03,.12,.6],[1.53,.32,.7]],color);
 return {setStep(step){bars.visible=step===2;profile.group.visible=step!==0},update(t,step,still){drawers.forEach((g,i)=>{const target=(step===0&&i===0||step===1&&i===1)?.82:.27;g.position.z=THREE.MathUtils.lerp(g.position.z,target,still?1:.07)});profile.group.position.y=.32+(still?0:Math.sin(t*.65)*.05);move(still?2:t);}};
}
function resumeModel(root,color){
 const page=new THREE.Group();page.position.set(-.55,.05,0);page.rotation.set(.04,-.15,-.055);root.add(page);
 const backing=card(page,2.55,3.6,texture(512,720,c=>{c.fillStyle='#f1f4f9';c.fillRect(0,0,512,720);c.fillStyle='#739fff';c.fillRect(0,0,512,12);text(c,'YOUR NAME',40,83,36);text(c,'PROFESSIONAL PROFILE',40,117,14,'#647086')}));
 const sectionNames=['EXPERIENCE','EDUCATION','SKILLS'];const layers=sectionNames.map((name,i)=>{const t=texture(440,150,c=>{c.fillStyle='#ffffff';c.fillRect(0,0,440,150);text(c,name,22,35,18,'#33568e');for(let j=0;j<3;j++){c.fillStyle='#d1d9e5';rounded(c,22,56+j*25,350-j*35,8,4)}});const piece=card(page,2.18,.73,t,0,.43-i*.92,.10);return piece.group});
 const languageTextures=['EN','العربية'].map((lang,i)=>texture(240,160,c=>{c.fillStyle='#232e42';c.fillRect(0,0,240,160);text(c,lang,120,98,i?41:58,'#b3ccff','center')}));
 const en=card(root,1.12,.75,languageTextures[0],1.67,.93,.25),ar=card(root,1.12,.75,languageTextures[1],1.80,-.02,.40);en.group.rotation.y=-.12;ar.group.rotation.y=-.12;
 const pdf=card(root,1.07,1.47,texture(256,352,c=>{c.fillStyle='#e2e9f5';c.fillRect(0,0,256,352);text(c,'PDF',128,158,60,'#315995','center');text(c,'DOCUMENT',128,205,18,'#536785','center');c.strokeStyle='#7e9bc9';c.lineWidth=4;c.strokeRect(18,18,220,316)}),1.75,-.77,.65);pdf.group.rotation.z=.12;
 return {setStep(step){en.group.visible=ar.group.visible=step===1;pdf.group.visible=step===2},update(t,step,still){layers.forEach((g,i)=>{const z=step===0?.26+(2-i)*.23:.1;g.position.z=THREE.MathUtils.lerp(g.position.z,z,still?1:.07)});page.rotation.y=-.15+(still?0:Math.sin(t*.35)*.045);pdf.group.position.y=-.77+(still?0:Math.sin(t*.7)*.06);}};
}
const builders={asl:handModel,hr:hrModel,employee:employeeModel,resume:resumeModel};

function mount(host){
 const type=host.dataset.model,def=definitions[type];let renderer;
 try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});}catch{return showFallback(host)}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0,0);host.append(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');renderer.domElement.setAttribute('tabindex','-1');
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,1,.1,50);camera.position.set(0,.65,8.4);camera.lookAt(0,0,0);scene.add(new THREE.HemisphereLight(0xe6f3ff,0x3a4752,2.4));const key=new THREE.DirectionalLight(0xffffff,3.2);key.position.set(-3,5,6);scene.add(key);const fill=new THREE.DirectionalLight(def.color,.8);fill.position.set(4,1,3);scene.add(fill);
 const root=new THREE.Group();scene.add(root);root.rotation.y=-.08;const model=builders[type](root,def.color);model.setStep(0);
 host.insertAdjacentHTML('beforeend',`<div class="model-head"><span>${def.title}</span><b>${def.figure} / 3D STUDY</b></div><div class="model-caption"><span>${matchMedia('(pointer: coarse)').matches?'EXPLORE WITH THE CONTROLS BELOW':'DRAG TO ROTATE'}</span><span>CONCEPTUAL MODEL</span></div>`);
 const controls=document.createElement('div');controls.className='model-controls';controls.innerHTML=`<div class="model-step-buttons" role="group" aria-label="Explore ${host.closest('article').querySelector('h3').textContent}">${def.steps.map((label,i)=>`<button type="button" data-model-step="${i}" aria-pressed="${i===0}">${label}</button>`).join('')}</div><p class="model-description" aria-live="polite">${def.descriptions[0]}</p><div class="model-footer"><button type="button" class="model-rotate">Rotate view ↻</button><button type="button" class="model-pause">Pause all motion Ⅱ</button></div>`;host.after(controls);
 const state={host,renderer,scene,camera,root,model,controls,step:0,visible:true,dirty:true,targetX:0,targetY:-.08,dragging:false,dragX:0,dragY:0,autoY:0,time:0};instances.push(state);
 controls.querySelectorAll('[data-model-step]').forEach(button=>button.addEventListener('click',()=>{state.step=Number(button.dataset.modelStep);host.dataset.step=String(state.step);model.setStep(state.step);controls.querySelectorAll('[data-model-step]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));controls.querySelector('.model-description').textContent=def.descriptions[state.step];state.dirty=true;}));
 controls.querySelector('.model-pause').addEventListener('click',()=>document.dispatchEvent(new CustomEvent('portfolio-toggle-motion')));
 controls.querySelector('.model-rotate').addEventListener('click',()=>{state.targetY+=Math.PI/8;state.dirty=true;});
 const size=()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.position.z=camera.aspect<1?10.5:8.4;camera.updateProjectionMatrix();state.dirty=true};new ResizeObserver(size).observe(host);size();
 renderer.domElement.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')return;state.dragging=true;state.dragX=e.clientX;state.dragY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)});
 renderer.domElement.addEventListener('pointermove',e=>{if(!state.dragging||paused)return;state.targetY+=Math.max(-.12,Math.min(.12,(e.clientX-state.dragX)*.006));state.targetX=Math.max(-.45,Math.min(.45,state.targetX+(e.clientY-state.dragY)*.004));state.dragX=e.clientX;state.dragY=e.clientY;state.dirty=true});renderer.domElement.addEventListener('pointerup',()=>{state.dragging=false});renderer.domElement.addEventListener('pointercancel',()=>{state.dragging=false});
 new IntersectionObserver(([entry])=>{state.visible=entry.isIntersecting;if(state.visible)state.dirty=true},{rootMargin:'50px'}).observe(host);
 renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();host.classList.remove('model-ready');state.visible=false;host.dataset.modelStatus='fallback';controls.hidden=true;showFallback(host)});
 host.classList.add('model-ready');host.dataset.modelStatus='ready';host.dataset.step='0';syncButtons();
}
function showFallback(host){host.dataset.modelStatus='fallback';if(!host.querySelector('.model-error-note')){const p=document.createElement('p');p.className='model-error-note';p.textContent='The interactive model is unavailable in this browser. Project details and links remain available below.';host.after(p)}}
function syncButtons(){document.querySelectorAll('.model-pause').forEach(button=>{button.textContent=paused?'Resume all motion ▷':'Pause all motion Ⅱ';button.setAttribute('aria-pressed',String(paused))});instances.forEach(s=>s.dirty=true)}
document.addEventListener('portfolio-motion-change',event=>{paused=event.detail.paused;syncButtons()});
let scrollPending=false;addEventListener('scroll',()=>{if(scrollPending)return;scrollPending=true;requestAnimationFrame(()=>{scrollPending=false;instances.forEach(state=>{if(!state.visible)return;const r=state.host.getBoundingClientRect();state.autoY=Math.max(-.25,Math.min(.25,(r.top+r.height/2-innerHeight/2)/innerHeight*.5));state.dirty=true})})},{passive:true});
let last=performance.now();function render(now){requestAnimationFrame(render);const dt=Math.min((now-last)/1000,.04);last=now;if(document.hidden)return;for(const s of instances){if(!s.visible)continue;if(paused&&!s.dirty)continue;if(!paused)s.time+=dt;const amount=paused?1:.07;s.root.rotation.y=THREE.MathUtils.lerp(s.root.rotation.y,s.targetY+(paused?0:s.autoY),amount);s.root.rotation.x=THREE.MathUtils.lerp(s.root.rotation.x,s.targetX,amount);s.model.update(s.time,s.step,paused);s.renderer.render(s.scene,s.camera);s.dirty=false;}}requestAnimationFrame(render);
const lazy=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){lazy.unobserve(entry.target);mount(entry.target)}},{rootMargin:'250px'});document.querySelectorAll('[data-model]').forEach(host=>lazy.observe(host));
