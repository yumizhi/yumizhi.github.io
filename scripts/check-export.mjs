import fs from 'node:fs';import path from 'node:path';
const root=path.resolve('out'),prefix=process.env.NEXT_PUBLIC_BASE_PATH??'';const errors=[];
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const pages=walk(root).filter(f=>f.endsWith('.html'));
for(const file of pages){const html=fs.readFileSync(file,'utf8');for(const m of html.matchAll(/(?:href|src)="([^"#]+)"/g)){let href=m[1].replaceAll('&amp;','&').split(/[?#]/)[0];if(!href.startsWith('/')||href.startsWith('//'))continue;if(prefix){if(!href.startsWith(prefix+'/')){errors.push(`${file}: missing base path: ${href}`);continue;}href=href.slice(prefix.length);}let target=path.join(root,decodeURIComponent(href));if(href.endsWith('/'))target=path.join(target,'index.html');if(!fs.existsSync(target))errors.push(`${path.relative(root,file)} -> ${href}`);}}
for(const file of ['.nojekyll','404.html','sitemap.xml','robots.txt','about.html','files/tide-neurips-2026.pdf','files/yihan-meng-cv.pdf'])if(!fs.existsSync(path.join(root,file)))errors.push(`Missing ${file}`);
if(errors.length){console.error(errors.join('\n'));process.exit(1);}console.log(`Verified ${pages.length} HTML files, internal links, original asset aliases, and static deployment files.`);
