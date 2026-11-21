'use client';

import { useState } from 'react';
import { GitPullRequestArrow } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { FilterTabs } from './filter-tabs';
import { Localized as Text, useLanguage } from './language';
import { TransitionPanel } from './ui/motion-primitives/transition-panel';
import './agent-handoff.css';

const runs = [
  { id: 'original', en: 'Original', zh: '原登记', time: '09:04', minutes: 54, result: { en: '9 minutes overdue', zh: '超时 9 分钟' } },
  { id: 'corrected', en: 'Corrected', zh: '更正后', time: '08:49', minutes: 39, result: { en: 'Within the allowance', zh: '在约定时限内' } },
] as const;

function ScaleLabels() {
  return <div className="handoff-ticks"><span>08:10</span><span><Text en="45 min limit" zh="45 分钟时限" /></span></div>;
}

export function AgentHandoffCover() {
  return <div className="handoff-chart compact">
    <div className="handoff-chart-heading"><span><GitPullRequestArrow size={16} /> I-204</span><span><Text en="Handoff review" zh="交接复核" /></span></div>
    <div className="handoff-scale">
      <ScaleLabels />
      {runs.map(run => <div className="handoff-row" key={run.id}>
        <div><Text en={run.en} zh={run.zh} /> <time>{run.time}</time></div>
        <div className="handoff-axis"><i style={{width: run.minutes / 60 * 100 + '%'}} /><b>{run.minutes} <Text en="min" zh="分" /></b></div>
      </div>)}
    </div>
  </div>;
}

export function AgentHandoff() {
  const [version, setVersion] = useState<string>(runs[0].id);
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const index = runs.findIndex(run => run.id === version);
  const selected = runs[index];
  const transition = { duration: reduced ? 0 : .18, ease: 'easeOut' as const };
  return <div className="handoff-chart reader" data-handoff={version}>
    <div className="handoff-chart-heading">
      <span><GitPullRequestArrow size={17} aria-hidden="true" /> I-204</span>
      <FilterTabs label={language === 'zh' ? '交接记录' : 'Handoff record'} value={version} onChange={setVersion}
        options={runs.map(run => ({value: run.id, label: run[language]}))} surface="inline" />
    </div>
    <div className="handoff-readout" aria-live="polite" aria-atomic="true">
      <strong>{selected.minutes} <small><Text en="min" zh="分钟" /></small></strong>
      <span>{selected.result[language]}</span>
    </div>
    <div className="handoff-plot">
      <ScaleLabels />
      <div className="handoff-track"><motion.i initial={false} animate={{scaleX: selected.minutes / 60}} transition={transition} /></div>
    </div>
    <TransitionPanel activeIndex={index} transition={transition} variants={{enter:{opacity:0},center:{opacity:1},exit:{opacity:0}}}>
      {runs.map(run => <div className="handoff-stamps" key={run.id}><Text en="Acknowledged" zh="确认时间" /><time>{run.time} UTC</time></div>)}
    </TransitionPanel>
  </div>;
}
