'use client';

import { useEffect, useRef, useState } from 'react';
import { LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { ChevronDown, Play } from 'lucide-react';
import { Localized } from '../language';
import { TideInline } from './entry';

const sections = [
  {id:'abstract', en:'Abstract', zh:'摘要'},
  {id:'method', en:'Method', zh:'方法'},
  {id:'examples', en:'Results', zh:'实验结果'},
  {id:'citation', en:'BibTeX', zh:'引用'},
];

export function PaperNav(){
  const [current,setCurrent] = useState('abstract');
  const nav = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useEffect(()=>{
    const targets = sections.map(({id})=>document.getElementById(id));
    let frame = 0;
    function readPosition(){
      const top = window.matchMedia('(min-width: 1280px)').matches ? 72 : (nav.current?.getBoundingClientRect().bottom ?? 0) + 28;
      const reached = targets.filter(el=>el && el.getBoundingClientRect().top <= top).pop();
      const atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      setCurrent(atEnd ? 'citation' : reached?.id ?? 'abstract');
      frame = 0;
    }
    const schedule = ()=>{ if(!frame) frame=requestAnimationFrame(readPosition); };
    readPosition();
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule);
    return ()=>{
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll',schedule);
      window.removeEventListener('resize',schedule);
    };
  },[]);
  return <LayoutGroup><nav ref={nav} className="tide-paper-nav" aria-label="Paper sections">
    <p className="paper-nav-label"><Localized en="On this page" zh="本文内容"/></p>
    {sections.map(s=><a href={'#'+s.id} key={s.id} aria-current={s.id===current?'location':undefined}>
      {s.id===current&&<motion.i layoutId="paper-position" transition={{duration:reduced?0:.22}}/>}
      <span><Localized en={s.en} zh={s.zh}/></span>
    </a>)}
  </nav></LayoutGroup>;
}

export function PipelineInset(){
  const [open,setOpen] = useState(false);
  useEffect(()=>{
    const followLink = ()=>{ if(location.hash==='#interactive-method')setOpen(true); };
    followLink();
    window.addEventListener('hashchange',followLink);
    return ()=>window.removeEventListener('hashchange',followLink);
  },[]);
  return <div className="tide-pipeline-inset" id="interactive-method">
    <button type="button" onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls="pipeline-player">
      <Play size={16}/><Localized en="Explore the sampling pipeline" zh="逐步查看采样过程"/><ChevronDown size={16}/>
    </button>
    <div id="pipeline-player" hidden={!open}>{open&&<TideInline/>}</div>
  </div>;
}
