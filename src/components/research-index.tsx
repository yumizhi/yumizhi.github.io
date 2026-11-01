'use client';
import {motionTokens} from '@/lib/motion';
import { useState } from 'react';
import { motion,AnimatePresence,LayoutGroup } from 'motion/react';
import { LayoutGrid,List,Search,ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { papers } from '@/lib/content';
import { ResearchCard } from './research-card';
import { TransitionLink } from './providers';
export function ResearchIndex(){
 const [topic,setTopic]=useState('All');const [q,setQ]=useState('');const [view,setView]=useState('grid');
 const found=papers.filter(p=>(topic==='All'||p.topic===topic)&&`${p.title} ${p.authors} ${p.venue} ${p.year}`.toLowerCase().includes(q.toLowerCase()));
 return <><div className="filter-toolbar"><div className="filter-pills" aria-label="Filter research">{['All','Watermarking','Adversarial learning'].map(t=><Button key={t} variant={topic===t?'default':'ghost'} size="sm" onClick={()=>setTopic(t)} aria-pressed={topic===t}>{t}</Button>)}</div><div className="filter-controls"><label className="search-field"><Search size={16}/><Input aria-label="Search research" placeholder="Search research" value={q} onChange={e=>setQ(e.target.value)}/></label><div className="view-controls" aria-label="Research display"><Button variant={view==='grid'?'secondary':'ghost'} size="icon" aria-label="Grid view" aria-pressed={view==='grid'} onClick={()=>setView('grid')}><LayoutGrid size={16}/></Button><Button variant={view==='list'?'secondary':'ghost'} size="icon" aria-label="List view" aria-pressed={view==='list'} onClick={()=>setView('list')}><List size={17}/></Button></div></div></div><p className="result-count" role="status">{found.length} {found.length===1?'publication':'publications'}</p><LayoutGroup><motion.div layout className={view==='grid'?'research-grid index-grid':'publication-list'}><AnimatePresence mode="popLayout" initial={false}>{found.map(p=><motion.div layout key={p.slug} initial={{opacity:0,scale:.985}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.985}} transition={{duration:motionTokens.layout,ease:motionTokens.ease}}>{view==='grid'?<ResearchCard paper={p}/>:<article className="publication-row"><span className="publication-year">{p.year}</span><div><p className="paper-meta">{p.venue}</p><h2><TransitionLink href={`/research/${p.slug}/`}>{p.title}</TransitionLink></h2><p className="authors">{p.authors.join(', ')}</p></div><TransitionLink href={`/research/${p.slug}/`} aria-label={`Details of ${p.shortTitle}`}><ArrowUpRight size={20}/></TransitionLink></article>}</motion.div>)}</AnimatePresence></motion.div></LayoutGroup>{!found.length&&<div className="empty-state"><h2>No matching publications</h2><p>Try a different title, year, or research area.</p><Button variant="outline" onClick={()=>{setQ('');setTopic('All');}}>Clear filters</Button></div>}</>;
}
