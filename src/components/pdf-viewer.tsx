'use client';
import {useEffect,useState} from 'react';
import {Download,ArrowUpRight} from 'lucide-react';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import type {Resource} from '@/lib/content';
import {asset} from '@/lib/paths';
export function PDFViewer({resource,onClose}:{resource:Resource|null;onClose:()=>void}){const[native,setNative]=useState(false);useEffect(()=>{setNative(navigator.pdfViewerEnabled===true);},[]);return <Dialog open={!!resource} onOpenChange={open=>{if(!open)onClose();}}><DialogContent className="pdf-dialog">{resource&&<><div className="pdf-toolbar"><div><DialogTitle>{resource.title}</DialogTitle><DialogDescription>{resource.description}</DialogDescription></div><div className="pdf-toolbar-actions"><Button asChild variant="outline" size="sm"><a href={asset(resource.file)} target="_blank" rel="noreferrer">Open PDF <ArrowUpRight size={14}/></a></Button><Button asChild size="sm"><a href={asset(resource.file)} download>Download <Download size={14}/></a></Button></div></div>{native&&<iframe className="pdf-frame" src={asset(resource.file)} title={`${resource.title} PDF preview`}/>}<div className={native?"pdf-mobile-preview":"pdf-static-preview"} tabIndex={0} role="region" aria-label="First page preview"><img src={asset(resource.preview)} width="640" height="830" alt={`First page preview of ${resource.title}`}/></div><p className="pdf-fallback">Open the full document in your browser, or download a copy.</p></>}</DialogContent></Dialog>;}
