import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('./dist/',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.xml':'application/xml','.txt':'text/plain; charset=utf-8','.pdf':'application/pdf'};
http.createServer(async(req,res)=>{
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});return res.end();}
 let pathname;
 try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);return res.end('Invalid URL');}
 let target=path.resolve(root,'.'+pathname);
 const relative=path.relative(root,target);
 if(relative.startsWith('..')||path.isAbsolute(relative)){res.writeHead(403);return res.end('Forbidden');}
 try{
  if((await fs.stat(target)).isDirectory())target=path.join(target,'index.html');
  const data=await fs.readFile(target);
  res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-cache'});
  res.end(req.method==='HEAD'?undefined:data);
 }catch{
  const fallback=await fs.readFile(path.join(root,'404.html'));
  res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(req.method==='HEAD'?undefined:fallback);
 }
}).listen(4173,'127.0.0.1',()=>console.log('Local: http://localhost:4173'));
