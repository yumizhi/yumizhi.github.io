'use client';
import { useState } from 'react';
import { ArrowUpRight, ArrowRight, Info } from 'lucide-react';
import type { Paper } from '@/lib/content';
import { asset } from '@/lib/paths';
import { TransitionLink } from './providers';
import { Button } from '@/components/ui/button';
export function ResearchArt({paper,detail=false}:{paper:Paper;detail?:boolean}){
 if(detail&&paper.image)return <img className="detail-figure" src={asset(paper.image)} width={paper.slug==='tide'?1422:782} height={paper.slug==='tide'?1120:341} alt={paper.imageAlt}/>;
 if(paper.slug==='tide')return <div className="tide-art" aria-label="Two actual generated images from the TIDE paper"><img className="tide-car" src={asset('/images/tide-car.webp')} width="687" height="681" alt="TIDE image: red sports car"/><img className="tide-street" src={asset('/images/tide-street.webp')} width="684" height="681" alt="TIDE image: sunlit city street"/></div>;
 if(paper.image)return <div className="sasbo-art"><img src={asset(paper.image)} alt={paper.imageAlt} width="782" height="341"/></div>;
 return <div className="type-cover"><span>IJCNN 2024</span><strong>Sparse Attack<br/>with Meta-Learning</strong><small>Cover pending</small></div>;
}
export function ResearchCard({paper}:{paper:Paper}){
 const [expanded,setExpanded]=useState(false);
 return <article className={`research-card ${expanded?'is-expanded':''}`} data-testid={`research-card-${paper.slug}`}>
   <div className="research-image" style={{viewTransitionName:`research-image-${paper.slug}`}}>
    <div className="research-art"><ResearchArt paper={paper}/></div>
    <button className="touch-preview" aria-label={`About ${paper.shortTitle}`} aria-expanded={expanded} onClick={()=>setExpanded(!expanded)}><Info size={17}/></button>
    <div className="research-reveal"><p>{paper.summary}</p><div className="research-actions"><Button asChild size="sm" variant="secondary"><a href={asset(paper.paper)} target="_blank" rel="noreferrer">Paper <ArrowUpRight size={14}/></a></Button><Button asChild size="sm" variant="secondary"><TransitionLink href={`/research/${paper.slug}/`}>Details <ArrowRight size={14}/></TransitionLink></Button>{paper.code&&<a href={paper.code}>Code <ArrowUpRight size={14}/></a>}</div></div>
   </div><div className="research-caption"><div className="paper-meta">{paper.venue} <span>·</span> {paper.year}</div><h3><TransitionLink href={`/research/${paper.slug}/`} style={{viewTransitionName:`research-title-${paper.slug}`}}>{paper.slug==='tide'?<>TIDE: Trajectory-Aware<br className="wide-break"/> Watermark Propagation</>:paper.title}<ArrowUpRight className="title-arrow" size={21}/></TransitionLink></h3><div className="mobile-card-actions"><TransitionLink href={`/research/${paper.slug}/`}>Details <ArrowRight size={14}/></TransitionLink><a href={asset(paper.paper)} target="_blank" rel="noreferrer">Paper <ArrowUpRight size={14}/></a></div></div>
 </article>;
}
