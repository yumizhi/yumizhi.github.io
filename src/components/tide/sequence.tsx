'use client';
import {useEffect,useRef} from 'react';
import {asset} from '@/lib/paths';
import type {Method} from './story';

// Image loading/playhead/draw pattern adapted from GSAP's official imageSequence helper:
// https://gsap.com/docs/v3/HelperFunctions/helpers/imageSequenceScrub/
// Adjacent clean-estimate frames are blended for a continuous, reversible presentation.
export default function SamplingSequence({step,mode,onReady}:{step:number;mode:Method;onReady?:()=>void}){
 const canvas=useRef<HTMLCanvasElement>(null),images=useRef<HTMLImageElement[]>([]),value=useRef(step),ready=useRef(onReady);value.current=step;ready.current=onReady;
 function draw(){
  const context=canvas.current?.getContext('2d');if(!context)return;
  const low=Math.floor(value.current),high=Math.min(50,low+1),fraction=value.current-low,a=images.current[low],b=images.current[high];
  if(!a?.complete||!a.naturalWidth)return;
  context.globalAlpha=1;context.drawImage(a,0,0,512,512);
  if(b?.complete&&b.naturalWidth&&fraction>0){context.globalAlpha=fraction;context.drawImage(b,0,0,512,512);context.globalAlpha=1;}
 }
 useEffect(()=>{let cancelled=false,loaded=0;images.current=Array.from({length:51},(_,i)=>{const image=new Image();image.onload=()=>{if(cancelled)return;loaded++;draw();if(loaded===51)ready.current?.();};image.src=asset(i===0?'/media/tide/sampling/gaussian.webp':`/media/tide/sampling/${mode}-${String(i).padStart(2,'0')}.webp`);return image;});return()=>{cancelled=true;images.current=[];};},[mode]);
 useEffect(draw,[step]);
 return <canvas ref={canvas} width="512" height="512" className="sampling-sequence" data-testid="sampling-sequence" data-step={step.toFixed(2)} aria-label="Generation preview from Gaussian noise through fifty sampling steps"/>;
}
