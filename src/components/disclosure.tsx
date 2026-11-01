'use client';
import {motionTokens} from '@/lib/motion';
import { useState } from 'react';
import { motion,AnimatePresence } from 'motion/react';
import { ChevronDown,Copy,Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
export function Abstract({text}:{text:string}){const[open,setOpen]=useState(true);return <section className="abstract-section"><button className="disclosure-trigger" aria-expanded={open} aria-controls="paper-abstract" onClick={()=>setOpen(!open)}><h2>Abstract</h2><ChevronDown size={20} style={{transform:open?'rotate(180deg)':'none',transition:'transform 200ms'}}/></button><AnimatePresence initial={false}>{open&&<motion.div id="paper-abstract" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden"><p className="abstract-text">{text}</p></motion.div>}</AnimatePresence></section>;}
export function CopyButton({text,label='Copy BibTeX'}:{text:string;label?:string}){const[copied,setCopied]=useState(false);const[error,setError]=useState(false);async function copy(){try{await navigator.clipboard.writeText(text);setCopied(true);setTimeout(()=>setCopied(false),2000);}catch{setError(true);}}return <><Button variant="outline" size="sm" onClick={copy}>{copied?<Check size={15}/>:<Copy size={15}/>} {copied?'Copied':label}</Button><span className="sr-only" role="status">{copied?'Copied to clipboard':error?'Copy unavailable. Select the text below to copy.':''}</span></>;}
