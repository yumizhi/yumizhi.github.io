'use client';
import {motion} from 'motion/react';
import { PublicationActions } from './publication-actions';
import type { Paper } from '@/lib/content';
import { asset } from '@/lib/paths';
import { TransitionLink } from './providers';
import { TideCover } from './research-experiment/tide-cover';
import { SparseStudyCover } from './research-experiment/sparse-covers';
import { Localized } from './language';
import { PaperTitle } from './paper-title';

export function ResearchArt({paper,detail=false}:{paper:Paper;detail?:boolean}){
 if(!paper.image)return null;
 return <img className={detail?'detail-figure':undefined} src={asset(paper.image)} width={paper.imageWidth} height={paper.imageHeight} alt={paper.imageAlt} loading={detail?undefined:'lazy'}/>;
}
export function ResearchCard({paper,sharedLayout=false}:{paper:Paper;sharedLayout?:boolean}){
 return <motion.article initial={sharedLayout?false:"waiting"} whileInView="visible" viewport={{once:true,amount:.15}} className={`research-card ${paper.image?'':'text-publication'}`} data-testid={`research-card-${paper.slug}`} data-paper={paper.slug}>
  {paper.image&&<div className="research-visual"><TransitionLink href={`/research/${paper.slug}/`} className="research-plate-link" aria-label={`Read ${paper.shortTitle}`}>{paper.slug==='tide'?<TideCover priority/>:<SparseStudyCover study={paper.slug==='sasbo'?'sasbo':'sam'}/>}</TransitionLink></div>}
  <motion.div className="research-caption"><motion.p layoutId={sharedLayout?`meta-${paper.slug}`:undefined} className="paper-meta"><span className="venue-name">{paper.venue} {paper.year}</span>{paper.slug==='sasbo'&&<span className="presentation-type"> · Oral</span>}</motion.p><motion.h3 layoutId={sharedLayout?`title-${paper.slug}`:undefined} lang="en"><TransitionLink href={`/research/${paper.slug}/`}><PaperTitle>{paper.title}</PaperTitle></TransitionLink></motion.h3><motion.p layoutId={sharedLayout?`authors-${paper.slug}`:undefined} className="authors" lang="en">{paper.authors.map((name,i)=><span key={name}>{i>0?', ':''}{name==='Yihan Meng'?<strong>{name}</strong>:name}</span>)}</motion.p><p className="paper-summary"><Localized en={paper.summary} zh={paper.summaryZh??paper.summary}/></p><PublicationActions paper={paper} /></motion.div>
 </motion.article>;
}
