import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
fs.mkdirSync('tmp',{recursive:true});
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write']});
 const page=await context.newPage(),requests=[],errors=[];page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:4173/',{waitUntil:'networkidle'});
 assert(!requests.some(url=>url.includes('/vendor/three.')||url.endsWith('/project-models.js')),'3D loaded before approaching project models');
 await page.locator('.project-index').scrollIntoViewIfNeeded();await page.screenshot({path:'tmp/improvements-work-desktop.png'});
 for(const name of ['dark','light']){
  await page.evaluate(t=>document.documentElement.dataset.theme=t,name);
  for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:900});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow ${name}/${width}`);
   assert(await page.locator('.project-index').evaluate(e=>[...e.children].every(a=>a.getBoundingClientRect().height>=44)));
  }
 }
 await page.evaluate(()=>document.documentElement.dataset.theme='dark');
 await page.setViewportSize({width:390,height:900});await page.locator('.project-index').scrollIntoViewIfNeeded();await page.screenshot({path:'tmp/improvements-work-mobile.png'});
 await page.locator('.project-index a[href="#resume-project"]').focus();await page.keyboard.press('Enter');
 await page.waitForFunction(()=>document.querySelector('[data-model=resume]').dataset.modelStatus==='ready');assert.equal(new URL(page.url()).hash,'#resume-project');
 assert(requests.some(url=>url.includes('/vendor/three.')),'3D never loaded');
 await page.locator('#copy-email').click();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),'salaheddinezouitni00@gmail.com');assert.equal(await page.locator('#copy-status').textContent(),'Email address copied.');
 await page.evaluate(()=>Object.defineProperty(navigator.clipboard,'writeText',{value:()=>Promise.reject(new Error('denied'))}));
 await page.locator('#copy-email').click();assert.match(await page.locator('#copy-status').textContent(),/Email selected/);assert.equal(await page.evaluate(()=>getSelection().toString()),'salaheddinezouitni00@gmail.com');
 await page.evaluate(()=>getSelection().removeAllRanges());await page.locator('#contact').scrollIntoViewIfNeeded();await page.screenshot({path:'tmp/improvements-contact.png'});
 const resume=await context.newPage();await resume.goto('http://localhost:4173/resume');await resume.waitForURL('**/resume.html');
 const missing=await context.newPage();const response=await missing.goto('http://localhost:4173/not-a-page');assert.equal(response.status(),404);assert(await missing.locator('h1').isVisible());await missing.screenshot({path:'tmp/improvements-404.png'});
 const offline=await context.newPage();await offline.route('**/project-models.js',route=>route.abort());await offline.goto('http://localhost:4173/#hr-project');await offline.waitForFunction(()=>document.querySelector('[data-model=hr]').dataset.modelStatus==='fallback');assert(await offline.locator('[data-model=hr] .project-image').isVisible());
 const nojs=await browser.newPage({javaScriptEnabled:false});await nojs.goto('http://localhost:4173/');assert.equal(await nojs.locator('#copy-email').isVisible(),false);assert.equal(await nojs.locator('.project-index a').count(),5);
 assert.deepEqual(errors,[]);console.log(JSON.stringify({initial3DDeferred:true,keyboardProjectNavigation:true,clipboardSuccessAndFallback:true,resumeRoute:true,custom404:true,moduleFailureFallback:true,noJS:true,themes:2,screenSizes:4,errors}));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});

