(() => {
 const button=document.querySelector('#copy-email');
 const address=document.querySelector('#contact-email');
 const status=document.querySelector('#copy-status');
 if(!button||!address||!status)return;
 button.hidden=false;
 button.addEventListener('click',async()=>{
  try{
   await navigator.clipboard.writeText(address.textContent.trim());
   status.textContent='Email address copied.';
  }catch{
   const selection=window.getSelection();const range=document.createRange();
   range.selectNodeContents(address);selection.removeAllRanges();selection.addRange(range);
   status.textContent='Email selected. Use your device’s Copy command, or open the email link.';
  }
 });
})();
