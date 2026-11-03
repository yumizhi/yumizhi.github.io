'use client';
import {motionTokens} from '@/lib/motion';
import { Localized } from './language';
import { useState } from 'react';
import { motion,AnimatePresence,useReducedMotion } from 'motion/react';
import { ChevronDown,Copy,Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible,CollapsibleTrigger,CollapsibleContent } from '@/components/ui/collapsible';
export function Abstract({text}:{text:string}){
 const [open,setOpen]=useState(true),reduced=useReducedMotion(),timing={duration:reduced?0:.3,ease:motionTokens.ease};
 return <Collapsible open={open} onOpenChange={setOpen} asChild><section className="abstract-section"><CollapsibleTrigger asChild><button className="disclosure-trigger"><h2><Localized en="Abstract" zh="摘要"/></h2><motion.span animate={{rotate:open?180:0}} transition={timing}><ChevronDown size={20}/></motion.span></button></CollapsibleTrigger><AnimatePresence initial={false}>{open&&<CollapsibleContent forceMount asChild><motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={timing} className="overflow-hidden"><p className="abstract-text" lang="en">{text}</p></motion.div></CollapsibleContent>}</AnimatePresence></section></Collapsible>;
}
export function CopyButton({text,label='Copy BibTeX'}:{text:string;label?:string}){const[copied,setCopied]=useState(false);const[error,setError]=useState(false);async function copy(){try{await navigator.clipboard.writeText(text);setCopied(true);setTimeout(()=>setCopied(false),2000);}catch{setError(true);}}return <><Button variant="outline" size="sm" onClick={copy}>{copied?<Check size={15}/>:<Copy size={15}/>} {copied?<Localized en="Copied" zh="已复制"/>:<Localized en={label} zh={label==='Copy BibTeX'?'复制 BibTeX':label}/>}</Button><span className="sr-only" role="status">{copied?'Copied to clipboard':error?'Copy unavailable. Select the text below to copy.':''}</span></>;}
