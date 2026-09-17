import * as THREE from './vendor/three.module.js';
import {landmarks, connections, chains} from './hand-anatomy.js';

const V = p => new THREE.Vector3(...p);

function line(points, color, opacity=1) {
  return new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map(V)), new THREE.LineBasicMaterial({color,transparent:true,opacity}));
}

function glowTexture() {
  const canvas=document.createElement('canvas');canvas.width=canvas.height=64;
  const ctx=canvas.getContext('2d'),gradient=ctx.createRadialGradient(32,32,0,32,32,32);
  gradient.addColorStop(0,'rgba(186,214,255,1)');gradient.addColorStop(.15,'rgba(111,164,255,.7)');gradient.addColorStop(.45,'rgba(73,132,255,.18)');gradient.addColorStop(1,'rgba(73,132,255,0)');
  ctx.fillStyle=gradient;ctx.fillRect(0,0,64,64);return new THREE.CanvasTexture(canvas);
}

async function loadSurface() {
  const response=await fetch(new URL('./assets/hand-surface.bin',import.meta.url));
  if(!response.ok)throw new Error('Hand surface unavailable');
  const buffer=await response.arrayBuffer(),header=new Uint32Array(buffer,0,2),[vertices,indices]=header;
  if(buffer.byteLength!==8+vertices*24+indices*4)throw new Error('Invalid hand surface');
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(buffer,8,vertices*3),3));
  geometry.setAttribute('normal',new THREE.BufferAttribute(new Float32Array(buffer,8+vertices*12,vertices*3),3));
  geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(buffer,8+vertices*24,indices),1));
  geometry.computeBoundingSphere();return geometry;
}

export async function createHandModel(root,color,host) {
  const geometry=await loadSurface();
  const rig=new THREE.Group();rig.position.set(-.38,-.07,0);rig.scale.setScalar(.86);rig.rotation.set(.04,-.24,-.08);root.add(rig);
  const shellMaterial=new THREE.MeshPhysicalMaterial({color:0x416798,metalness:.28,roughness:.28,clearcoat:1,clearcoatRoughness:.22,transparent:true,opacity:.42,depthWrite:false,side:THREE.FrontSide});
  const shell=new THREE.Mesh(geometry,shellMaterial);rig.add(shell);
  // The contour uses the actual smooth surface normals, giving the hand a quiet rim light.
  const contourMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.FrontSide,blending:THREE.AdditiveBlending,
    uniforms:{color:{value:new THREE.Color(0x8eb7ff)},strength:{value:.40}},
    vertexShader:'varying vec3 n;varying vec3 eye;void main(){vec4 p=modelViewMatrix*vec4(position,1.0);n=normalize(normalMatrix*normal);eye=normalize(-p.xyz);gl_Position=projectionMatrix*p;}',
    fragmentShader:'varying vec3 n;varying vec3 eye;uniform vec3 color;uniform float strength;void main(){float rim=pow(1.0-abs(dot(normalize(n),normalize(eye))),2.8);gl_FragColor=vec4(color,rim*strength);}'
  });
  rig.add(new THREE.Mesh(geometry,contourMaterial));

  const nodes=new THREE.Group();rig.add(nodes);
  const beadGeometry=new THREE.SphereGeometry(.038,16,12);
  const beadMaterial=new THREE.MeshBasicMaterial({color:0xe6f0ff});
  const haloMap=glowTexture();
  const halos=[],beads=[];
  landmarks.forEach((p,i)=>{
    const bead=new THREE.Mesh(beadGeometry,beadMaterial);bead.position.copy(V(p));if(i===0)bead.scale.setScalar(1.35);nodes.add(bead);beads.push(bead);
    const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:haloMap,color:0x7faaff,transparent:true,opacity:.65,depthWrite:false,blending:THREE.AdditiveBlending}));halo.position.copy(V(p));halo.scale.setScalar(i===0?.3:.23);nodes.add(halo);halos.push(halo);
  });
  for(const id of [0,4,8,12,16,20]){
    const canvas=document.createElement('canvas');canvas.width=128;canvas.height=64;
    const ctx=canvas.getContext('2d');ctx.font='24px monospace';ctx.textAlign='center';ctx.fillStyle='#b7cbe9';ctx.fillText(String(id).padStart(2,'0'),64,40);
    const label=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(canvas),transparent:true,depthWrite:false,depthTest:false,opacity:.8}));
    label.position.copy(V(landmarks[id])).add(new THREE.Vector3(id===4?-.22:id===0?.30:.15,id===0?-.04:.13,.10));label.scale.set(.48,.24,1);rig.add(label);
  }
  const bones=new THREE.Group();nodes.add(bones);
  connections.forEach(([a,b])=>{const curve=new THREE.LineCurve3(V(landmarks[a]),V(landmarks[b]));const tube=new THREE.Mesh(new THREE.TubeGeometry(curve,1,.011,6,false),new THREE.MeshBasicMaterial({color:0x8bb8ff,transparent:true,opacity:.9}));bones.add(tube);});
  const palmGuide=line([landmarks[0],landmarks[5],landmarks[9],landmarks[13],landmarks[17],landmarks[0]],0x7faaff,.25);rig.add(palmGuide);

  // Fine contours reveal finger volume without drawing a second wire skeleton.
  const contourLines=new THREE.Group();rig.add(contourLines);
  const widths=[.15,.14,.15,.14,.115];
  chains.forEach((chain,f)=>chain.slice(2,4).forEach((id,j)=>{
    const point=V(landmarks[id]),axis=V(landmarks[id+1]).sub(V(landmarks[id-1])).normalize();
    const u=new THREE.Vector3(0,0,1).cross(axis).normalize(),v=axis.clone().cross(u).normalize();
    const coords=Array.from({length:33},(_,i)=>{const angle=i/32*Math.PI*2;return point.clone().addScaledVector(u,Math.cos(angle)*(widths[f]-j*.016)).addScaledVector(v,Math.sin(angle)*(widths[f]-j*.016)).toArray()});
    contourLines.add(line(coords,0x9cbcff,.21));
  }));

  const measureGroup=new THREE.Group();rig.add(measureGroup);
  const measurements=[[4,8],[8,12],[12,16],[16,20],[0,12]];
  measurements.forEach(([a,b])=>{
    const coords=[V(landmarks[a]),V(landmarks[b])].map(p=>p.add(new THREE.Vector3(0,0,.03)));
    const geometry=new THREE.BufferGeometry().setFromPoints(coords);
    const dashed=new THREE.Line(geometry,new THREE.LineDashedMaterial({color:0xe4edff,dashSize:.04,gapSize:.035,transparent:true,opacity:.72}));dashed.computeLineDistances();measureGroup.add(dashed);
  });
  const triangleGeometry=new THREE.BufferGeometry().setFromPoints([V(landmarks[0]),V(landmarks[4]),V(landmarks[8])]);triangleGeometry.computeVertexNormals();
  measureGroup.add(new THREE.Mesh(triangleGeometry,new THREE.MeshBasicMaterial({color:0x6a9fff,transparent:true,opacity:.10,side:THREE.DoubleSide,depthWrite:false})));

  const scanMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,
    uniforms:{height:{value:0},strength:{value:.55}},
    vertexShader:'varying float y;void main(){y=position.y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader:'varying float y;uniform float height;uniform float strength;void main(){float band=exp(-pow((y-height)*13.0,2.0));gl_FragColor=vec4(.30,.56,1.0,band*strength);}'
  });
  const scan=new THREE.Mesh(geometry,scanMaterial);rig.add(scan);

  const dais=new THREE.Group();dais.position.set(-.38,-1.91,0);dais.scale.setScalar(.9);root.add(dais);
  const disc=new THREE.Mesh(new THREE.CylinderGeometry(1.03,1.10,.08,80),new THREE.MeshStandardMaterial({color:0x202833,metalness:.6,roughness:.4}));dais.add(disc);
  for(const radius of [1.07,1.23,1.47]){
    const points=Array.from({length:97},(_,i)=>[Math.cos(i/96*Math.PI*2)*radius,.048,Math.sin(i/96*Math.PI*2)*radius]);dais.add(line(points,0x7daaff,radius===1.07?.7:.16));
  }
  for(let i=0;i<48;i++){
    const a=i/48*Math.PI*2,r=i%4===0?1.32:1.39;
    dais.add(line([[Math.cos(a)*r,.05,Math.sin(a)*r],[Math.cos(a)*1.45,.05,Math.sin(a)*1.45]],0x8facd7,i%4===0?.45:.16));
  }
  const origin=new THREE.Group();origin.position.set(0,-1.26,0);rig.add(origin);
  [[.45,0,0],[0,.45,0],[0,0,.45]].forEach(p=>origin.add(line([[0,0,0],p],0xa5c2f5,.45)));

  const packets=chains.map(chain=>{
    const curve=new THREE.CatmullRomCurve3(chain.map(i=>V(landmarks[i])));
    const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:haloMap,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,color:0xc4daff}));sprite.scale.setScalar(.2);rig.add(sprite);return {curve,sprite};
  });

  host.insertAdjacentHTML('beforeend',`<div class="hand-readout" aria-hidden="true"><span class="hand-readout-label">SPATIAL INPUT</span><strong>21<span>points</span></strong><div class="hand-readout-detail">One hand.<br>Three dimensions.</div><div class="hand-mini-axes">X <i></i> Y <i></i> Z</div></div><div class="hand-stage-note" aria-hidden="true"><span>01 / LANDMARK MAPPING</span><b>WRIST → FINGERTIPS</b></div><div class="hand-branches" aria-hidden="true"><span>Skeleton image <b>MobileNet</b></span><span>Feature vector <b>Random Forest</b></span><strong>26 alphabet classes</strong></div>`);
  const readout=host.querySelector('.hand-readout'),note=host.querySelector('.hand-stage-note'),branches=host.querySelector('.hand-branches');
  const copy=[['SPATIAL INPUT','21','points','One hand.<br>Three dimensions.','01 / LANDMARK MAPPING','WRIST → FINGERTIPS'],['FEATURE SPACE','75','features','Coordinates.<br>Geometric relations.','02 / FEATURE EXTRACTION','DISTANCE + POSITION'],['MODEL OUTPUT','A–Z','alphabet','Two approaches.<br>One recognition task.','03 / CLASSIFICATION','ILLUSTRATED PIPELINE']];
  let active=0,surfaceOpacity=.42,compact=false;
  host.dataset.handSurface='ready';
  return {
    resize(width){compact=width<=520;rig.position.x=compact?0:-.38;dais.position.x=rig.position.x;rig.scale.setScalar(compact?.95:.86);dais.position.y=compact?-2.34:-1.91;},
    setStep(step){
      active=step;const c=copy[step];
      readout.querySelector('.hand-readout-label').textContent=c[0];readout.querySelector('strong').innerHTML=c[1]+'<span>'+c[2]+'</span>';readout.querySelector('.hand-readout-detail').innerHTML=c[3];
      note.querySelector('span').textContent=c[4];note.querySelector('b').textContent=c[5];branches.classList.toggle('is-visible',step===2);
      measureGroup.visible=step===1;scan.visible=step===0;origin.visible=step===1;
      packets.forEach(p=>p.sprite.visible=step!==1);
    },
    update(t,step,still){
      const target=active===1?.16:active===2?.28:.42;surfaceOpacity=THREE.MathUtils.lerp(surfaceOpacity,target,still?1:.065);shellMaterial.opacity=surfaceOpacity;
      contourMaterial.uniforms.strength.value=active===1?.23:.40;
      rig.rotation.y=-.24+(still?0:Math.sin(t*.23)*.13);rig.position.y=(compact?-.34:-.07)+(still?0:Math.sin(t*.65)*.025);
      scanMaterial.uniforms.height.value=still?.45:-1.7+((t*.19)%1)*4.4;
      halos.forEach((h,i)=>h.material.opacity=still?.5:.44+Math.sin(t*1.6-i*.19)*.13);
      packets.forEach(({curve,sprite},i)=>sprite.position.copy(curve.getPoint(still?.5:(t*.22+i*.13)%1)));
    }
  };
}
