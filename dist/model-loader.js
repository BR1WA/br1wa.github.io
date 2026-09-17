// Keep Three.js and scene builders off the initial page load.
const hosts=[...document.querySelectorAll('[data-model]')];
const observer=new IntersectionObserver(entries=>{
 if(!entries.some(entry=>entry.isIntersecting))return;
 observer.disconnect();
 import('./project-models.js').catch(()=>{
  for(const host of hosts){
   if(host.dataset.modelStatus)continue;
   host.dataset.modelStatus='fallback';
   const note=document.createElement('p');note.className='model-error-note';
   note.textContent='The interactive models could not load. Project details and links remain available below.';
   host.after(note);
  }
 });
},{rootMargin:'500px'});
hosts.forEach(host=>observer.observe(host));
