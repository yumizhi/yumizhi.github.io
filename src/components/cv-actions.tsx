'use client';
import {useState} from 'react';
import {Download,Eye} from 'lucide-react';
import {resources} from '@/lib/content';
import {asset} from '@/lib/paths';
import {Button} from '@/components/ui/button';
import {PDFViewer} from './pdf-viewer';
import {Localized,useLanguage} from './language';

export function CVActions() {
 const [open,setOpen]=useState(false);
 const {language}=useLanguage();
 const resource=resources.find(r=>r.id==='cv')!;
 const r=language==='zh'?{...resource,title:'蒙一涵 — 个人简历',file:'/files/yihan-meng-cv-zh.pdf',preview:'/images/cv-page-zh.webp',description:'教育经历、研究与论文、实习、开源项目及奖励'}:resource;
 return <>
  <div className="cv-actions"><Button variant="outline" onClick={()=>setOpen(true)}><Eye size={16}/> <Localized en="View PDF" zh="预览 PDF"/></Button><Button asChild><a href={asset(r.file)} download><Download size={16}/> <Localized en="Download CV" zh="下载简历"/></a></Button></div>
  <PDFViewer resource={open?r:null} onClose={()=>setOpen(false)}/>
 </>;
}
