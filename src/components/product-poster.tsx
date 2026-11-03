'use client';
import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { asset } from '@/lib/paths';
import { Localized } from './language';
import type { Project } from '@/lib/content';

export function ProductPoster({project}:{project:Project}){
 const ref=useRef<HTMLDivElement>(null),reduced=useReducedMotion();
 const {scrollYProgress}=useScroll({target:ref,offset:['start 96%','end 88%']});
 const progress=useSpring(scrollYProgress,{stiffness:140,damping:32});
 const lift=useTransform(progress,[0,.7],[36,0]),scale=useTransform(progress,[0,.7],[.94,1]);
 const outputLift=useTransform(progress,[.2,1],[24,0]),outputScale=useTransform(progress,[.2,1],[.88,1]),outputOpacity=useTransform(progress,[.2,.55],[0,1]);
 return <div ref={ref} className="product-poster" data-testid="product-poster"><a className="poster-link" href={project.demo??project.repo} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`}><motion.div className="poster-workspace" style={{y:reduced?0:lift,scale:reduced?1:scale}}><img src={asset(project.slug==='epub-toolkit'?'/images/epub-workspace-crop.webp':project.image)} width={project.slug==='epub-toolkit'?1137:1440} height={project.slug==='epub-toolkit'?842:1050} alt={project.imageAlt} loading="lazy"/></motion.div>{project.slug==='epub-toolkit'&&<motion.figure className="poster-result" style={{y:reduced?0:outputLift,scale:reduced?1:outputScale,opacity:reduced?1:outputOpacity}}><img src={asset('/images/epub-panel-output.webp')} width="352" height="363" alt="Actual EPUB Toolkit output: combined contents and a completed EPUB ready to download" loading="lazy"/><figcaption><Localized en="Merged EPUB" zh="合并结果"/><ArrowUpRight size={13}/></figcaption></motion.figure>}</a></div>;
}
