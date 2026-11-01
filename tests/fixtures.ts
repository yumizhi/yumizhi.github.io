import {test as base,expect} from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
const contentTypes:Record<string,string>={'.html':'text/html','.css':'text/css','.js':'application/javascript','.json':'application/json','.txt':'text/x-component','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.pdf':'application/pdf','.xml':'application/xml'};
// Optional static fixture for network-restricted workspaces. CI uses a real HTTP server.
export const test=base.extend({page:async({page},use)=>{
 if(process.env.USE_STATIC_FIXTURE){
 await page.route('https://homepage.test/**',async route=>{
  const url=new URL(route.request().url());const root=path.resolve('out');
  let file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
  if(file!==root&&!file.startsWith(root+path.sep)){await route.fulfill({status:403,body:'Forbidden'});return;}
  try{if((await fs.stat(file)).isDirectory())file=path.join(file,'index.html');await route.fulfill({status:200,contentType:contentTypes[path.extname(file)]||'application/octet-stream',body:await fs.readFile(file)});}
  catch{await route.fulfill({status:404,contentType:'text/html',body:await fs.readFile(path.join(root,'404.html'))});}
 });}
 await use(page);
}});
export {expect};
