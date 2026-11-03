'use client';
import {useState} from 'react';
import {ArrowUpRight,Play,X} from 'lucide-react';
import {Button} from './ui/button';
import {asset} from '@/lib/paths';

export function ReferenceEmbed({title,url,poster,instruction}:{title:string;url:string;poster:string;instruction:string}){
 const [active,setActive]=useState(false);
 return <div><div className="relative overflow-hidden rounded-2xl bg-neutral-100" style={active?{height:'clamp(360px,48vw,580px)'}:undefined}>{active?<iframe title={title} src={url} className="h-full w-full border-0" allow="fullscreen" referrerPolicy="strict-origin-when-cross-origin"/>:<><img src={asset(poster)} alt={`${title} 实际运行截图`} className="h-auto w-full"/><div className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/30 to-transparent px-6 py-8"><Button onClick={()=>setActive(true)}><Play size={15}/>体验原始示例</Button></div></>}</div><div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground"><p>{instruction}</p><div className="flex items-center gap-4">{active&&<button onClick={()=>setActive(false)} className="inline-flex min-h-10 items-center gap-1 underline underline-offset-4"><X size={13}/>关闭预览</button>}<a href={url} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-1 underline underline-offset-4">打开原站<ArrowUpRight size={13}/></a></div></div></div>;
}
