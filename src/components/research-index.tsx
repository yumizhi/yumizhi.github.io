'use client';

import { useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, LayoutGrid, List, Search } from 'lucide-react';
import { papers, type Paper } from '@/lib/content';
import { motionTokens } from '@/lib/motion';
import { FilterTabs } from './filter-tabs';
import { Localized, useLanguage } from './language';
import { TransitionLink } from './providers';
import { ResearchCard } from './research-card';
import { Button } from './ui/button';
import { Input } from './ui/input';

const topics = [
  { value: 'All', label: <Localized en="All" zh="全部" /> },
  { value: 'Watermarking', label: <Localized en="Watermarking" zh="图像水印" /> },
  { value: 'Adversarial learning', label: <Localized en="Adversarial learning" zh="对抗学习" /> },
];
const displays = [
  { value: 'grid', label: <><LayoutGrid size={16} aria-hidden="true" /><span className="sr-only"><Localized en="Grid view" zh="网格视图" /></span></> },
  { value: 'list', label: <><List size={17} aria-hidden="true" /><span className="sr-only"><Localized en="List view" zh="列表视图" /></span></> },
];

function PublicationRow({ paper }: { paper: Paper }) {
  const href = '/research/' + paper.slug + '/';
  return <article className="publication-row">
    <time className="publication-year">{paper.year}</time>
    <div>
      <motion.p layoutId={'meta-' + paper.slug} className="paper-meta venue-name">
        {paper.venue}{paper.slug === 'sasbo' && <> · <Localized en="Oral" zh="口头报告" /></>}
      </motion.p>
      <motion.h2 layoutId={'title-' + paper.slug}><TransitionLink href={href}>{paper.title}</TransitionLink></motion.h2>
      <motion.p layoutId={'authors-' + paper.slug} className="authors">{paper.authors.join(', ')}</motion.p>
      <p className="paper-summary publication-synopsis"><Localized en={paper.summary} zh={paper.summaryZh ?? paper.summary} /></p>
    </div>
    <TransitionLink href={href} aria-label={paper.shortTitle}><ArrowUpRight size={20} /></TransitionLink>
  </article>;
}

export function ResearchIndex() {
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const [topic, setTopic] = useState('All');
  const [query, setQuery] = useState('');
  const [view, setView] = useState('grid');
  const found = papers.filter(p => (topic === 'All' || p.topic === topic)
    && [p.shortTitle,p.title,...p.authors,p.venue,p.year,p.summary,p.summaryZh].join(' ').toLowerCase().includes(query.trim().toLowerCase()));
  const searchLabel = language === 'en' ? 'Search research' : '搜索论文';
  return <>
    <div className="filter-toolbar">
      <FilterTabs value={topic} onChange={setTopic} label={language === 'en' ? 'Filter research' : '筛选论文'} options={topics} />
      <div className="filter-controls">
        <label className="search-field"><Search size={16} /><Input aria-label={searchLabel} placeholder={searchLabel} value={query} onChange={e=>setQuery(e.target.value)} /></label>
        <FilterTabs value={view} onChange={setView} label={language === 'en' ? 'Research display' : '显示方式'} options={displays} />
      </div>
    </div>
    <p className="result-count" role="status"><Localized en={found.length + (found.length === 1 ? ' publication' : ' publications')} zh={found.length + ' 篇论文'} /></p>
    <LayoutGroup>
      <motion.div layout={!reduced} className={view === 'grid' ? 'research-grid index-grid' : 'publication-list'}>
        <AnimatePresence initial={false} mode="popLayout">
          {found.map(p => <motion.div layout={reduced ? false : 'position'} key={p.slug} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            transition={{duration:reduced ? 0 : .2, ease:motionTokens.ease}}>
            {view === 'grid' ? <ResearchCard paper={p} sharedLayout /> : <PublicationRow paper={p} />}
          </motion.div>)}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
    {!found.length && <div className="empty-state">
      <h2><Localized en="No matching publications" zh="未找到匹配论文" /></h2>
      <p><Localized en="Try a different title, year, or research area." zh="试试其他标题、年份或研究方向。" /></p>
      <Button variant="outline" onClick={()=>{setQuery('');setTopic('All');}}><Localized en="Clear filters" zh="清除筛选" /></Button>
    </div>}
  </>;
}
