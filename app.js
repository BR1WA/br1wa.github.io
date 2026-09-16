import { mountEnergyScene } from './energy-scene.js';
const preference=matchMedia('(prefers-reduced-motion: reduce)');
let paused=preference.matches;
const toggle=document.querySelector('#motion-toggle');
const scene=mountEnergyScene(document.querySelector('#energy-scene'),()=>paused);
function syncMotion(){document.body.classList.toggle('motion-paused',paused);toggle.textContent=paused?'Resume motion ▷':'Pause motion Ⅱ';toggle.setAttribute('aria-pressed',String(paused));toggle.setAttribute('aria-label',paused?'Resume animations':'Pause animations');scene.update();}
toggle.addEventListener('click',()=>{paused=!paused;syncMotion()});
preference.addEventListener('change',event=>{paused=event.matches;syncMotion()});syncMotion();
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})},{threshold:.06});
document.querySelectorAll('.reveal').forEach(element=>observer.observe(element));document.body.classList.add('js-motion');
const controls=[...document.querySelectorAll('[data-energy-step]')];
const chapters=[...document.querySelectorAll('[data-chapter]')];
function setStep(step){scene.setStep(step);controls.forEach((button,index)=>button.setAttribute('aria-pressed',String(index===step)))}
controls.forEach((button,index)=>button.addEventListener('click',()=>{setStep(index);if(innerWidth>700)chapters[index].scrollIntoView({behavior:paused?'instant':'smooth',block:'center'});}));
let scheduled=false;
function onScroll(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;scene.update();if(innerWidth>700){const midpoint=innerHeight*.58;let nearest=0,distance=Infinity;chapters.forEach((chapter,index)=>{const rect=chapter.getBoundingClientRect();const delta=Math.abs(rect.top+rect.height*.5-midpoint);if(delta<distance){distance=delta;nearest=index}});setStep(nearest)}})}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);onScroll();
