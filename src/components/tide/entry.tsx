'use client';
import dynamic from 'next/dynamic';
import {useState} from 'react';
import {motion,useReducedMotion} from 'motion/react';
import * as Dialog from '@radix-ui/react-dialog';
import {Play,X} from 'lucide-react';
import {Localized} from '../language';
import {asset} from '@/lib/paths';
import '@/app/tide-cover.css';
import '@/app/tide-experience.css';
const loadExperience=()=>import('./experience');
const Experience=dynamic(loadExperience,{ssr:false,loading:()=> <div className="tide-experience" style={{padding:'80px 32px',textAlign:'center'}} role="status"><Localized en="Loading…" zh="加载中…"/></div>});
export function TideInteractiveCover(){
 const [open,setOpen]=useState(false);const reduced=useReducedMotion();
 return <Dialog.Root open={open} onOpenChange={setOpen}><Dialog.Trigger asChild><motion.button className="diffusion-cover" aria-label="Explore the TIDE pipeline" initial="rest" whileHover="hover" onPointerEnter={loadExperience} onFocus={loadExperience}><motion.img variants={{rest:{scale:1},hover:{scale:reduced?1:1.025}}} transition={{duration:.5,ease:[.22,1,.36,1]}} src={asset('/media/tide/sampling/tide-50.webp')} width="512" height="512" alt="Robot generation example for TIDE" loading="lazy"/><span className="diffusion-cover-shade"/><span className="diffusion-cover-eyebrow">TIDE <span><Localized en="Interactive" zh="交互演示"/></span></span><span className="diffusion-cover-title"><Localized en="How TIDE works" zh="TIDE 如何工作"/></span><span className="diffusion-cover-play"><span className="diffusion-cover-play-icon"><Play size={14}/></span><Localized en="Explore the pipeline" zh="查看交互流程"/></span></motion.button></Dialog.Trigger><Dialog.Portal><Dialog.Overlay className="tide-dialog-overlay"/><Dialog.Content className="tide-dialog" aria-describedby={undefined}><Dialog.Title className="sr-only">TIDE interactive method</Dialog.Title><Dialog.Close className="tide-dialog-close" aria-label="Close animation"><X size={16}/></Dialog.Close>{open&&<Experience autoPlay/>}</Dialog.Content></Dialog.Portal></Dialog.Root>;
}
export function TideInline(){return <div id="interactive-method" className="tide-paper-entry"><Experience/></div>;}
