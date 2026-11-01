import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
export type Post = {slug:string; title:string; description:string; date:string; category:string; author:string; minutes:number; content:string; toc:{id:string;title:string}[]};
const directory = path.join(process.cwd(),'src/content/writing');
export function getPosts(): Post[] {
  return fs.readdirSync(directory).filter(f=>f.endsWith('.mdx')).map(file=>{
    const {data,content}=matter(fs.readFileSync(path.join(directory,file),'utf8'));
    return {slug:file.replace(/\.mdx$/,''),title:data.title,description:data.description,date:data.date,category:data.category,author:data.author??'Yihan Meng',minutes:Math.max(1,Math.ceil(content.split(/\s+/).length/200)),content,toc:[...content.matchAll(/^## (.+)$/gm)].map(m=>({title:m[1],id:slugify(m[1])}))};
  }).sort((a,b)=>b.date.localeCompare(a.date));
}
export function slugify(s:string){return s.toLowerCase().replace(/[^\p{L}\p{N} ]/gu,'').replace(/\s+/g,'-');}
