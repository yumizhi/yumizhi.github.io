'use client';
import {useRouter} from 'next/navigation';
import {ArrowUpRight,FileText,FolderOpen,BookOpen} from 'lucide-react';
import {CommandDialog,CommandInput,CommandList,CommandEmpty,CommandGroup,CommandItem} from './ui/command';
import {Localized,useLanguage} from './language';
import type {SearchItem} from '@/lib/search';

export default function SiteSearch({index,open,onOpenChange}:{index:SearchItem[];open:boolean;onOpenChange:(open:boolean)=>void}){
 const {language}=useLanguage();
 const router=useRouter();
 const setOpen=onOpenChange;
 return <CommandDialog open={open} onOpenChange={setOpen} title={language==='en'?'Search this site':'站内搜索'} description={language==='en'?'Find research, projects, writing, and resources.':'搜索研究、项目、文章与文档。'}><CommandInput placeholder={language==='en'?'Search papers, projects, and writing…':'搜索论文、项目与文章…'}/><CommandList><CommandEmpty><Localized en="No results. Try “TIDE”, “EPUB”, or “CV”." zh="暂无结果。试试 TIDE、EPUB 或 CV。"/></CommandEmpty>{['Research','Projects','Writing','Resources','About'].map(kind=><CommandGroup key={kind} heading={language==='en'?kind:({Research:'研究',Projects:'项目',Writing:'写作',Resources:'资料',About:'关于'}[kind]??kind)}>{index.filter(i=>i.kind===kind).map(i=><CommandItem key={i.href} value={`${i.title} ${i.keywords}`} onSelect={()=>{setOpen(false);if(i.external){window.open(i.href,'_blank','noopener,noreferrer');}else{router.push(i.href);}}}>{kind==='Research'?<FileText/>:kind==='Projects'?<FolderOpen/>:<BookOpen/>}<span>{i.title}</span><ArrowUpRight className="ml-auto shrink-0"/></CommandItem>)}</CommandGroup>)}</CommandList><div className="command-footer"><span>↑ ↓ <Localized en="Navigate" zh="选择"/></span><span>↵ <Localized en="Open" zh="打开"/></span><span>esc <Localized en="Close" zh="关闭"/></span></div></CommandDialog>;
}
