'use client';

import {useState} from 'react';
import {motion, AnimatePresence} from 'motion/react';
import {ArrowUpRight} from 'lucide-react';
import {FilterTabs} from './filter-tabs';
import {TransitionLink} from './providers';
import {Localized} from './language';
import {motionTokens} from '@/lib/motion';
import type {WritingEntry} from '@/lib/posts';

const categoryNames: Record<string,string> = {'All':'全部','Research notes':'研究笔记'};

export function WritingIndex({posts}:{posts:WritingEntry[]}) {
  const [category,setCategory] = useState('All');
  const categories = [...new Set(posts.map(p=>p.category))];
  return <>
    {categories.length>1&&<FilterTabs value={category} onChange={setCategory} label="Writing categories" className="writing-filters" options={['All',...categories].map(c=>({value:c,label:<Localized en={c} zh={categoryNames[c]??c}/>}))}/>}
    <motion.div layout className="writing-index">
      <AnimatePresence initial={false} mode="popLayout">
        {posts.filter(p=>category==='All'||p.category===category).map(p=>
          <motion.article layout key={p.slug} className="writing-row" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:0,transition:{duration:.16}}} transition={{duration:motionTokens.feedback}}>
            <div>
              {p.date?<small><time dateTime={p.date}>{p.date}</time></small>:<small>Notion</small>}
              <span className="post-category"><Localized en={p.category} zh={categoryNames[p.category]??p.category}/></span>
            </div>
            <div lang={p.language}>
              <h2><TransitionLink href={p.href} target={p.external?'_blank':undefined} rel={p.external?'noreferrer':undefined}>{p.title}</TransitionLink></h2>
              <p>{p.description}</p>
            </div>
            <TransitionLink href={p.href} target={p.external?'_blank':undefined} rel={p.external?'noreferrer':undefined} aria-label={`Read ${p.title}`}><ArrowUpRight size={20}/></TransitionLink>
          </motion.article>
        )}
      </AnimatePresence>
    </motion.div>
  </>;
}
