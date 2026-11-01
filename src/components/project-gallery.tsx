'use client';
import {motionTokens} from '@/lib/motion';
import { useState } from 'react';
import { motion,AnimatePresence } from 'motion/react';
import { asset } from '@/lib/paths';
export function ProjectGallery({images,title}:{images:string[];title:string}){const[current,setCurrent]=useState(0);return <div className="project-gallery"><div className="gallery-main"><AnimatePresence mode="wait" initial={false}><motion.img key={current} initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-10}} transition={{duration:motionTokens.feedback}} src={asset(images[current])} width="1440" height="1050" alt={`${title}: ${current===0?'book queue and output settings':'empty workspace'}`} style={current===0?{viewTransitionName:'project-epub-toolkit'}:undefined}/></AnimatePresence></div><div className="gallery-thumbnails" aria-label="Project screenshots">{images.map((image,i)=><button key={image} aria-pressed={current===i} onClick={()=>setCurrent(i)} aria-label={`Show ${i===0?'workspace':'empty state'} screenshot`}><img src={asset(image)} width="120" height="88" alt=""/></button>)}</div></div>;}
