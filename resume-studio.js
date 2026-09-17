import * as THREE from './vendor/three.module.js';

const material=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.48,metalness:.16,...extra});
function slab(parent,w,h,d,mat,x=0,y=0,z=0,r=.025){
 const shape=new THREE.Shape(),a=-w/2,b=-h/2;shape.moveTo(a+r,b);shape.lineTo(a+w-r,b);shape.quadraticCurveTo(a+w,b,a+w,b+r);shape.lineTo(a+w,b+h-r);shape.quadraticCurveTo(a+w,b+h,a+w-r,b+h);shape.lineTo(a+r,b+h);shape.quadraticCurveTo(a,b+h,a,b+h-r);shape.lineTo(a,b+r);shape.quadraticCurveTo(a,b,a+r,b);
 const geometry=new THREE.ExtrudeGeometry(shape,{depth:d,bevelEnabled:true,bevelSize:.005,bevelThickness:.005,bevelSegments:2,curveSegments:6});geometry.translate(0,0,-d/2);
 const object=new THREE.Mesh(geometry,mat);object.position.set(x,y,z);parent.add(object);return object;
}
function texture(w,h,draw){const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;draw(canvas.getContext('2d'));const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;return t;}
function face(parent,w,h,map,x=0,y=0,z=.025){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map,transparent:true}));m.position.set(x,y,z);parent.add(m);return m;}
function line(parent,points,color=0x8dadde,opacity=.4){const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p))),new THREE.LineBasicMaterial({color,transparent:true,opacity}));parent.add(l);return l;}
function text(c,value,x,y,size,color='#334f75',align='left',weight=400){c.textAlign=align;c.fillStyle=color;c.font=`${weight} ${size}px Arial`;c.fillText(value,x,y);}
function bar(c,x,y,w,color='#a4b6d0',h=5){c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,h,2);c.fill();}
const words={en:{name:'YOUR NAME',role:'Professional profile',experience:'EXPERIENCE',education:'EDUCATION',skills:'SKILLS',contact:'CONTACT',languages:'LANGUAGES',summary:'PROFILE',footer:'SCHEMATIC RÉSUMÉ'},ar:{name:'الاسم الكامل',role:'المسمى المهني',experience:'الخبرة المهنية',education:'التعليم',skills:'المهارات',contact:'التواصل',languages:'اللغات',summary:'نبذة مهنية',footer:'نموذج سيرة ذاتية'}};
function pageTexture(lang){return texture(720,1018,c=>{
 const rtl=lang==='ar',w=words[lang];c.direction=rtl?'rtl':'ltr';c.fillStyle='#f4f7fc';c.fillRect(0,0,720,1018);
 c.fillStyle='#294b7c';c.fillRect(rtl?514:0,0,206,1018);
 const sx=rtl?683:35,sideAlign=rtl?'right':'left',mx=rtl?470:250,mainAlign=rtl?'right':'left';
 c.fillStyle='#6687b5';c.beginPath();c.arc(rtl?617:103,109,48,0,Math.PI*2);c.fill();
 c.fillStyle='#cbdaf0';c.beginPath();c.arc(rtl?617:103,99,14,0,Math.PI*2);c.fill();c.beginPath();c.ellipse(rtl?617:103,128,25,16,0,Math.PI,Math.PI*2);c.fill();
 [[w.contact,208],[w.skills,428],[w.languages,679]].forEach(([label,y],idx)=>{text(c,label,sx,y,rtl?24:19,'#e7effd',sideAlign,600);for(let i=0;i<(idx===1?6:4);i++){const length=125-(i%3)*14;bar(c,rtl?sx-length:sx,y+29+i*28,length,'#89a3c8',5)}});
 text(c,w.name,mx,101,rtl?46:42,'#243f65',mainAlign,600);text(c,w.role,mx,148,26,'#6c84a7',mainAlign);bar(c,250-(rtl?210:0),186,424,'#7197d4',3);
 [[w.summary,239,3],[w.experience,392,5],[w.education,651,4]].forEach(([label,y,rows])=>{text(c,label,mx,y,rtl?27:21,'#315c98',mainAlign,600);for(let i=0;i<rows;i++){const length=405-(i%3)*35;bar(c,rtl?mx-length:mx,y+32+i*27,length,i===0?'#7c94b5':'#b2c1d8',i===0?7:5)}});
 text(c,w.footer,mx,976,rtl?19:13,'#889dbb',mainAlign);text(c,'01',rtl?44:675,976,15,'#889dbb',rtl?'left':'right');
});}
function sectionTexture(name,index){return texture(600,150,c=>{
 c.fillStyle='#f4f7fc';c.fillRect(0,0,600,150);c.fillStyle='#547ec0';c.fillRect(0,0,5,150);text(c,name,28,39,23,'#315c98','left',600);text(c,`0${index+1}`,560,38,18,'#8ca2c1','right');
 for(let i=0;i<3;i++)bar(c,28,65+i*24,490-i*43,i===0?'#92a8c7':'#bdcbe0',5);
});}
function chipTexture(label,caption){return texture(360,160,c=>{c.fillStyle='#243751';c.fillRect(0,0,360,160);text(c,label,25,60,32,'#e0ecff','left',500);text(c,caption,25,110,18,'#99b5df');});}

export function createResumeModel(root,color,host){
 const assembly=new THREE.Group();assembly.rotation.set(.035,-.18,0);assembly.position.y=.03;root.add(assembly);
 const page=new THREE.Group();page.position.set(-.55,-.13,.08);page.rotation.set(-.015,-.07,-.035);assembly.add(page);
 const paper=material(0xe5edf9),edge=material(0x90a5c3),dark=material(0x263650,{metalness:.5}),blue=material(0x739eeb,{emissive:0x254c95,emissiveIntensity:.17});
 // Thin paper edges give the finished document physical volume without bulky cards.
 for(let i=3;i>=0;i--)slab(page,2.30,3.26,.014,i===0?paper:material(0xa7b9d3),i*.016,i*.012,-i*.025,.018);
 const maps={en:pageTexture('en'),ar:pageTexture('ar')};
 const document=face(page,2.28,3.22,maps.en,0,0,.024);

 // Separate editable sections settle into the document's layout when assembled.
 const layers=['EXPERIENCE','EDUCATION','SKILLS'].map((name,i)=>{
  const section=new THREE.Group();section.position.set(.27,.37-i*.66,.18+(2-i)*.18);page.add(section);
  slab(section,1.80,.48,.016,paper,0,0,0,.016);face(section,1.78,.445,sectionTexture(name,i),0,0,.016);
  for(const x of [-.855,.855])for(const y of [-.20,.20]){const handle=slab(section,.03,.03,.02,blue,x,y,.03,.005);}
  return section;
 });
 const guides=new THREE.Group();page.add(guides);
 for(const side of [-1,1]){
  line(guides,[[side*1.24,1.70,.01],[side*1.32,1.70,.01],[side*1.32,-1.70,.01],[side*1.24,-1.70,.01]],0x7fa6df,.38);
  for(let i=0;i<17;i++)line(guides,[[side*1.32,1.55-i*.195,.01],[side*(i%4===0?1.39:1.36),1.55-i*.195,.01]],0x7fa6df,.30);
 }
 for(const y of [-1.72,1.72])line(guides,[[-1.23,y,.01],[1.23,y,.01]],0x7398ce,.30);
 const cornerMarks=new THREE.Group();page.add(cornerMarks);for(const x of [-1.18,1.18])for(const y of [-1.67,1.67])line(cornerMarks,[[x-Math.sign(x)*.13,y,.03],[x,y,.03],[x,y-Math.sign(y)*.13,.03]],0xa1c4ff,.8);

 const rail=new THREE.Group();rail.position.set(1.42,.13,.14);rail.rotation.y=-.10;assembly.add(rail);
 const railFrame=slab(rail,1.29,2.30,.07,dark,0,0,-.07,.09);
 const railMap=texture(420,760,c=>{c.fillStyle='#1c2b40';c.fillRect(0,0,420,760);text(c,'DOCUMENT BUILDER',24,49,19,'#93b1dd','left',500);text(c,'Your profile',24,102,31,'#e0ebfc');bar(c,24,130,372,'#47648e',2);['EXPERIENCE','EDUCATION','SKILLS'].forEach((label,i)=>{const y=179+i*171;c.fillStyle='#2b4260';c.beginPath();c.roundRect(24,y,372,129,7);c.fill();text(c,`0${i+1}`,42,y+32,17,'#8db2e9');text(c,label,42,y+67,20,'#c5d9f7','left',500);bar(c,42,y+92,271,'#6685b0',4)});text(c,'EDIT  /  ARRANGE  /  EXPORT',24,728,13,'#7196ca');});face(rail,1.18,2.14,railMap,0,0,-.022);
 const connectors=[];layers.forEach((layer,i)=>{
  const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(1.05,.52-i*.58,.17),new THREE.Vector3(.72,.54-i*.58,.32),new THREE.Vector3(.37,.32-i*.54,.64)]);
  const tube=new THREE.Mesh(new THREE.TubeGeometry(curve,30,.008,5,false),new THREE.MeshBasicMaterial({color:0x82aaf0,transparent:true,opacity:.40}));assembly.add(tube);
  const dot=new THREE.Mesh(new THREE.SphereGeometry(.023,12,8),new THREE.MeshBasicMaterial({color:0xd4e5ff}));assembly.add(dot);connectors.push({curve,tube,dot});
 });

 const languageCards=new THREE.Group();languageCards.position.set(1.42,.15,.20);assembly.add(languageCards);
 const english=slab(languageCards,1.28,.65,.05,dark,0,.43,0,.055);face(languageCards,1.19,.55,chipTexture('English','LEFT TO RIGHT'),0,.43,.035);
 const arabic=slab(languageCards,1.28,.65,.05,dark,0,-.43,0,.055);face(languageCards,1.19,.55,texture(360,160,c=>{c.fillStyle='#243751';c.fillRect(0,0,360,160);c.direction='rtl';text(c,'العربية',335,65,40,'#e0ecff','right',500);text(c,'من اليمين إلى اليسار',335,119,23,'#99b5df','right');}),0,-.43,.035);
 const selection=slab(languageCards,.035,.47,.028,blue,-.60,.43,.075,.01);

 const pdf=new THREE.Group();pdf.position.set(1.38,-.10,.20);assembly.add(pdf);
 slab(pdf,1.32,1.72,.045,edge,0,0,0,.09);slab(pdf,1.21,1.59,.025,dark,0,0,.035,.055);
 face(pdf,1.15,1.49,texture(384,500,c=>{c.fillStyle='#20324b';c.fillRect(0,0,384,500);text(c,'FINAL DOCUMENT',28,53,17,'#92b4e6','left',500);text(c,'PDF',28,173,92,'#e2edff','left',500);bar(c,28,212,327,'#557cb5',2);text(c,'Résumé',28,271,31,'#b2cdf5');text(c,'Ready to download',28,319,21,'#8daddb');c.strokeStyle='#a5c7ff';c.lineWidth=5;c.beginPath();c.moveTo(296,368);c.lineTo(296,412);c.moveTo(279,396);c.lineTo(296,414);c.lineTo(313,396);c.moveTo(268,432);c.lineTo(325,432);c.stroke();text(c,'EXPORT',28,426,20,'#8daddb');}),0,0,.058);

 const cradle=new THREE.Group();cradle.position.set(-.43,-1.95,-.10);assembly.add(cradle);
 const plinth=slab(cradle,3.44,1.23,.085,dark,0,0,0,.12);plinth.rotation.x=-Math.PI/2;
 const rim=slab(cradle,3.27,.014,.025,blue,0,.052,.52,.007);
 for(let i=0;i<25;i++)line(cradle,[[-1.48+i*.123,.051,-.39],[-1.48+i*.123,.051,i%5===0?-.21:-.29]],0x8daddd,.35);

 host.insertAdjacentHTML('beforeend',`<div class="resume-heading" aria-hidden="true"><span>01 / EDITABLE SECTIONS</span><strong>A résumé, assembled around your story.</strong></div><div class="resume-language" role="group" aria-label="Preview document language" hidden><button type="button" data-resume-language="en" aria-pressed="true">English <span>LTR</span></button><button type="button" data-resume-language="ar" aria-pressed="false" lang="ar">العربية <span>RTL</span></button></div><div class="resume-process" aria-hidden="true"><span data-resume-phase="0"><i>01</i> Compose</span><b>→</b><span data-resume-phase="1"><i>02</i> Language</span><b>→</b><span data-resume-phase="2"><i>03</i> PDF</span></div>`);
 const heading=host.querySelector('.resume-heading'),phaseLabels=[...host.querySelectorAll('[data-resume-phase]')],languageControl=host.querySelector('.resume-language');
 const copy=[['01 / EDITABLE SECTIONS','A résumé, assembled around your story.'],['02 / BILINGUAL LAYOUTS','One profile. Two reading directions.'],['03 / PDF GENERATION','From editable sections to a finished document.']];
 let active=0,lang='en',layoutMotion=0,layerBlend=1,compact=false;
 languageControl.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{
  lang=button.dataset.resumeLanguage;document.material.map=maps[lang];selection.position.y=lang==='en'?.43:-.43;layoutMotion=.08;host.dataset.resumeLanguage=lang;
  languageControl.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  host.dispatchEvent(new CustomEvent('model-refresh'));
 }));
 host.dataset.resumeLanguage=lang;
 return {
  setStep(step){active=step;heading.querySelector('span').textContent=copy[step][0];heading.querySelector('strong').textContent=copy[step][1];phaseLabels.forEach((label,i)=>label.classList.toggle('is-active',i===step));languageControl.hidden=step!==1;rail.visible=step===0;languageCards.visible=step===1;pdf.visible=step===2;guides.visible=step!==2;cornerMarks.visible=step===0;connectors.forEach(({tube,dot})=>{tube.visible=dot.visible=step===0});document.material.map=maps[step===0?'en':lang];},
  resize(width,height){compact=width<=520;assembly.scale.setScalar(compact?Math.min(.79,(width/height)*1.30):.79);},
  update(t,step,still){
   const ease=still?1:.065;layoutMotion=THREE.MathUtils.lerp(layoutMotion,0,still?1:.09);layerBlend=THREE.MathUtils.lerp(layerBlend,active===0?1:0,still?1:.10);
   assembly.position.y=THREE.MathUtils.lerp(assembly.position.y,compact&&active===1?-.29:.11,ease);
   page.rotation.y=THREE.MathUtils.lerp(page.rotation.y,(active===0?-.16:active===1?.08:-.05)+layoutMotion,ease);
   page.position.x=THREE.MathUtils.lerp(page.position.x,active===2?-.44:-.55,ease);
   layers.forEach((layer,i)=>{const float=still?0:Math.sin(t*.65-i*.9)*.017;layer.visible=active===0||(layerBlend>.025&&lang==='en');layer.position.z=.03+layerBlend*(.14+(2-i)*.20+float);layer.position.x=.27+layerBlend*(.06+(2-i)*.09);});
   connectors.forEach(({curve,dot},i)=>dot.position.copy(curve.getPoint(still?.5:(t*.22+i*.21)%1)));
   pdf.position.y=THREE.MathUtils.lerp(pdf.position.y,active===2?-.07+(still?0:Math.sin(t*.65)*.018):-.37,ease);
   host.dataset.resumeStage=['compose','language','pdf'][active];
   host.dataset.resumeAssembly=active===0?'editable':layerBlend>.025?'assembling':'complete';
  }
 };
}
