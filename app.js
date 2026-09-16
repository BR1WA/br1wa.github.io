import * as THREE from './vendor/three.module.js';
const host = document.querySelector('#scene');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let paused = reduced.matches;
const toggle = document.querySelector('#motion-toggle');
function syncMotion(){document.body.classList.toggle('motion-paused',paused);toggle.textContent=paused?'Resume motion ▷':'Pause motion Ⅱ';toggle.setAttribute('aria-pressed',String(paused));toggle.setAttribute('aria-label',paused?'Resume animations':'Pause animations');}
toggle.addEventListener('click',()=>{paused=!paused;syncMotion()});
reduced.addEventListener('change',e=>{paused=e.matches;syncMotion()});syncMotion();
try {
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setClearColor(0x000000,0);host.appendChild(renderer.domElement);
 const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(0,.25,8.3);
 scene.add(new THREE.HemisphereLight(0xffffff,0x74835a,3));const key=new THREE.DirectionalLight(0xffffff,4);key.position.set(-3,4,5);scene.add(key);const fill=new THREE.DirectionalLight(0xc7ff7d,3);fill.position.set(3,-2,2);scene.add(fill);
 const group=new THREE.Group();scene.add(group);group.rotation.set(.3,-.25,-.27);
 const metal=new THREE.MeshStandardMaterial({color:0x727f63,metalness:.86,roughness:.24});const lime=new THREE.MeshStandardMaterial({color:0xd2fa83,metalness:.3,roughness:.28});const dark=new THREE.MeshStandardMaterial({color:0x263224,metalness:.7,roughness:.3});
 const knot=new THREE.Mesh(new THREE.TorusKnotGeometry(1.19,.32,180,30,2,3),metal);group.add(knot);
 const ringA=new THREE.Mesh(new THREE.TorusGeometry(2.03,.025,12,150),lime);ringA.rotation.x=1.06;group.add(ringA);
 const ringB=new THREE.Mesh(new THREE.TorusGeometry(2.18,.012,8,140),dark);ringB.rotation.set(.3,.75,.6);group.add(ringB);
 const core=new THREE.Mesh(new THREE.IcosahedronGeometry(.42,1),lime);group.add(core);
 const satellite=new THREE.Mesh(new THREE.SphereGeometry(.16,24,24),lime);group.add(satellite);
 const points=[];for(let i=0;i<55;i++){const a=i*2.399963;const y=1-(i/54)*2;const r=Math.sqrt(1-y*y);points.push(Math.cos(a)*r*2.6,y*2.6,Math.sin(a)*r*2.6)}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(points,3));group.add(new THREE.Points(geometry,new THREE.PointsMaterial({color:0x65784d,size:.024,transparent:true,opacity:.55})));
 let pointer={x:0,y:0},scroll=0,visible=true,last=0,time=0;
 const resize=()=>{const {width,height}=host.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix()};new ResizeObserver(resize).observe(host);resize();
 host.addEventListener('pointermove',e=>{const box=host.getBoundingClientRect();pointer.x=((e.clientX-box.left)/box.width-.5)*.55;pointer.y=((e.clientY-box.top)/box.height-.5)*.35});host.addEventListener('pointerleave',()=>{pointer={x:0,y:0}});
 addEventListener('scroll',()=>{scroll=Math.min(scrollY/innerHeight,1.8)},{passive:true});new IntersectionObserver(([e])=>{visible=e.isIntersecting},{rootMargin:'100px'}).observe(host);
 function frame(now){requestAnimationFrame(frame);if(!visible||document.hidden)return;const dt=Math.min((now-last)/1000,.05);last=now;if(!paused){time+=dt;group.rotation.y+=(time*.13+pointer.x+scroll*.7-group.rotation.y)*.035;group.rotation.x+=(.3+pointer.y+scroll*.3-group.rotation.x)*.035;knot.rotation.z=time*.07;core.rotation.y=time*.4;satellite.position.set(Math.cos(time*.6)*2.05,Math.sin(time*.6)*.9,Math.sin(time*.6)*1.6);group.position.y=Math.sin(time*.7)*.07;}renderer.render(scene,camera)}requestAnimationFrame(frame);document.body.classList.add('scene-ready');
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();document.body.classList.remove('scene-ready')});
} catch(e){console.info('3D unavailable; showing static visual.');toggle.hidden=true;}
const reveals=document.querySelectorAll('.reveal');
const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}})},{threshold:.06});reveals.forEach(el=>observer.observe(el));document.body.classList.add('js-motion');
const cards=[...document.querySelectorAll('.project-visual')];let scrollQueued=false;
function updateCards(){for(const card of cards){const rect=card.getBoundingClientRect();if(rect.top<innerHeight&&rect.bottom>0){const t=Math.max(-1,Math.min(1,(rect.top+rect.height/2-innerHeight/2)/innerHeight));card.style.transform=paused?'none':`perspective(1200px) rotateX(${t*9}deg) rotateY(${t*-3}deg) translateY(${t*12}px)`}}scrollQueued=false}
addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateCards)}},{passive:true});toggle.addEventListener('click',updateCards);updateCards();
