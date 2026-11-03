'use client';
import {motion,useReducedMotion} from 'motion/react';
import {motionTokens} from '@/lib/motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import type { Paper } from '@/lib/content';
import { asset } from '@/lib/paths';
import { TransitionLink } from './providers';
import { TideInteractiveCover } from './tide/entry';
import { Localized } from './language';

export function ResearchArt({paper,detail=false}:{paper:Paper;detail?:boolean}){
 if(!paper.image)return null;
 return <img className={detail?'detail-figure':undefined} src={asset(paper.image)} width={paper.imageWidth} height={paper.imageHeight} alt={paper.imageAlt} loading={detail?undefined:'lazy'}/>;
}
export function ResearchCard({paper,sharedLayout=false}:{paper:Paper;sharedLayout?:boolean}){
 const reduced=useReducedMotion();
 return <motion.article initial={sharedLayout?false:"waiting"} whileInView="visible" viewport={{once:true,amount:.15}} className={`research-card ${paper.image?'':'text-publication'}`} data-testid={`research-card-${paper.slug}`}>
  {paper.image&&<motion.div className="research-visual" variants={{waiting:{opacity:reduced?1:.5,y:reduced?0:22},visible:{opacity:1,y:0,transition:{duration:reduced?0:.65,ease:motionTokens.ease}}}}>{paper.slug==='tide'?<TideInteractiveCover/>:paper.image&&<TransitionLink href={`/research/${paper.slug}/`} className="research-image" aria-label={`View ${paper.shortTitle} research details`}><ResearchArt paper={paper}/></TransitionLink>}</motion.div>}
  <motion.div className="research-caption" variants={{waiting:{opacity:reduced?1:.65,y:reduced?0:12},visible:{opacity:1,y:0,transition:{duration:reduced?0:.55,delay:reduced?0:.08,ease:motionTokens.ease}}}}><motion.p layoutId={sharedLayout?`meta-${paper.slug}`:undefined} className="paper-meta"><span className="venue-name">{paper.venue} {paper.year}</span>{paper.slug==='sasbo'&&<span className="presentation-type"> · Oral</span>}</motion.p><motion.h3 layoutId={sharedLayout?`title-${paper.slug}`:undefined} lang="en"><TransitionLink href={`/research/${paper.slug}/`}>{paper.title}</TransitionLink></motion.h3><motion.p layoutId={sharedLayout?`authors-${paper.slug}`:undefined} className="authors" lang="en">{paper.authors.map((name,i)=><span key={name}>{i>0?', ':''}{name==='Yihan Meng'?<strong>{name}</strong>:name}</span>)}</motion.p><p className="paper-summary"><Localized en={paper.summary} zh={paper.slug==='tide'?'通过轨迹感知的水印引导，减少对扩散图像生成的干扰。':paper.slug==='sasbo'?'使用随机二值优化实现稀疏对抗攻击。':paper.slug==='sparse-meta-learning'?'结合跨模型元学习与扰动投影，提高稀疏对抗样本的迁移能力。':paper.summary}/></p><div className="paper-links"><a href={asset(paper.paper)} target="_blank" rel="noreferrer"><Localized en="Paper" zh="论文"/> <ArrowUpRight size={14}/></a><TransitionLink href={`/research/${paper.slug}/`}><Localized en="Details" zh="详情"/> <ArrowRight size={14}/></TransitionLink>{paper.code&&<a href={paper.code} target="_blank" rel="noreferrer">Code <ArrowUpRight size={14}/></a>}</div></motion.div>
 </motion.article>;
}
