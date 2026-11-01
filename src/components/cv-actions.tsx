'use client';
import {useState} from 'react';
import {Download,Eye} from 'lucide-react';
import {resources} from '@/lib/content';
import {asset} from '@/lib/paths';
import {Button} from '@/components/ui/button';
import {PDFViewer} from './pdf-viewer';
export function CVActions(){const[open,setOpen]=useState(false);const r=resources.find(r=>r.id==='cv')!;return <><div className="cv-actions"><Button variant="outline" onClick={()=>setOpen(true)}><Eye size={16}/> View PDF</Button><Button asChild><a href={asset(r.file)} download><Download size={16}/> Download CV</a></Button></div><PDFViewer resource={open?r:null} onClose={()=>setOpen(false)}/></>;}
