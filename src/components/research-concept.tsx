'use client';
import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { Pause, Play } from 'lucide-react';
import { TransitionLink } from './providers';
import { Localized } from './language';
import { asset } from '@/lib/paths';

export function ResearchConcept({slug,title}:{slug:string;title:string}){
 const frame=useRef<HTMLElement>(null);const video=useRef<HTMLVideoElement>(null);const inView=useInView(frame,{amount:.45});const reduced=useReducedMotion();const [choice,setChoice]=useState<boolean|null>(null);const [playing,setPlaying]=useState(false);const shouldPlay=inView&&(choice??!reduced);
 useEffect(()=>{const media=video.current;if(!media)return;if(shouldPlay)media.play().catch(()=>setPlaying(false));else media.pause();},[shouldPlay]);
 return <figure ref={frame} className="research-concept" data-testid={`concept-${slug}`}><TransitionLink href={`/research/${slug}/`} className="concept-media" aria-label={`View ${title} research details`}><video ref={video} poster={asset(`/images/${slug}-concept-poster.webp`)} width="960" height="600" muted playsInline loop preload="metadata" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} aria-label={`${title}: conceptual animation of the method`} aria-describedby={`${slug}-concept-description`}><source src={asset(`/videos/${slug}-concept.mp4`)} type="video/mp4"/></video></TransitionLink><figcaption className="concept-caption"><span><Localized en="Concept animation" zh="研究思路示意"/></span><button onClick={()=>setChoice(!playing)} aria-label={`${playing?'Pause':'Play'} ${title} concept animation`}>{playing?<Pause size={13}/>:<Play size={13}/>}<Localized en={playing?'Pause':'Play'} zh={playing?'暂停':'播放'}/></button></figcaption><span className="sr-only" id={`${slug}-concept-description`}>{slug==='tide'?'TIDE observes recent text-guidance directions, removes the overlapping component from watermark guidance, and propagates the watermark with an adaptive budget.':'SASBO factorizes perturbations into coordinate selection and magnitude, optimizes them alternately, and removes redundant coordinates. The matrix is a conceptual illustration.'}</span></figure>;
}
