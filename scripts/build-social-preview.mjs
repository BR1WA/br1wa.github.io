import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
try{
 const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
 await page.goto(new URL('./social-preview.html',import.meta.url).href);
 await page.locator('img').evaluate(image=>image.decode());
 await page.screenshot({path:fileURLToPath(new URL('../dist/assets/social-preview.png',import.meta.url))});
}finally{await browser.close();}
