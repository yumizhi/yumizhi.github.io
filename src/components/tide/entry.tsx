'use client';
import dynamic from 'next/dynamic';
import {useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {Play,X} from 'lucide-react';
import {Localized} from '../language';
import {asset} from '@/lib/paths';
import '@/app/tide-cover.css';
import '@/app/tide-experience.css';
const loadExperience=()=>import('./experience');
const Experience=dynamic(loadExperience,{ssr:false,loading:()=> <div className="tide-experience" style={{padding:'80px 32px',textAlign:'center'}} role="status"><Localized en="Loading…" zh="加载中…"/></div>});
function CoverArt(){
 return <>
  <span className="tide-cover-mosaic">
   {['street','guitar','car'].map(scene=><img key={scene} src={asset('/images/tide-paper/tide-'+scene+'.webp')} alt="" width={226} height={226}/>)}
  </span>
  <span className="tide-cover-action"><Play size={13}/><Localized en="Explore the pipeline" zh="查看交互流程"/></span>
 </>;
}
export function TideInteractiveCover(){
 const [open,setOpen]=useState(false);
 return <Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog.Trigger asChild>
   <button className="tide-home-cover" aria-label="Explore the TIDE pipeline" onPointerEnter={loadExperience} onFocus={loadExperience}>
    <CoverArt/>
   </button>
  </Dialog.Trigger>
  <Dialog.Portal>
   <Dialog.Overlay className="tide-dialog-overlay"/>
   <Dialog.Content className="tide-dialog" aria-describedby={undefined}>
    <Dialog.Title className="sr-only">TIDE interactive method</Dialog.Title>
    <Dialog.Close className="tide-dialog-close" aria-label="Close animation"><X size={16}/></Dialog.Close>
    {open&&<Experience autoPlay/>}
   </Dialog.Content>
  </Dialog.Portal>
 </Dialog.Root>;
}
export function TideInline(){return <div className="tide-paper-entry"><Experience/></div>;}
