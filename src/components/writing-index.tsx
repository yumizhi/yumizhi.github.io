'use client';
import {motionTokens} from '@/lib/motion';
import {useState} from 'react';
import {motion,AnimatePresence} from 'motion/react';
import {ArrowUpRight} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {TransitionLink} from './providers';
import type {Post} from '@/lib/posts';
export function WritingIndex({posts}:{posts:Omit<Post,'content'>[]}){const[category,setCategory]=useState('All');return <><div className="filter-pills writing-filters" aria-label="Writing categories">{['All',...new Set(posts.map(p=>p.category))].map(c=><Button size="sm" key={c} aria-pressed={category===c} variant={category===c?'default':'ghost'} onClick={()=>setCategory(c)}>{c}</Button>)}</div><motion.div layout className="writing-index"><AnimatePresence initial={false} mode="popLayout">{posts.filter(p=>category==='All'||p.category===category).map(p=><motion.article layout key={p.slug} className="writing-row" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}} transition={{duration:motionTokens.feedback}}><div><small>{p.date}</small><span className="post-category">{p.category}</span></div><div><h2><TransitionLink href={`/writing/${p.slug}/`}>{p.title}</TransitionLink></h2><p>{p.description}</p></div><TransitionLink href={`/writing/${p.slug}/`} aria-label={`Read ${p.title}`}><ArrowUpRight size={20}/></TransitionLink></motion.article>)}</AnimatePresence></motion.div></>;}
