'use client';

import { Fragment, useState, type ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Diagram } from './project-architecture';
import { Localized as Text } from './language';
import { Button } from './ui/coss/button';
import './agent-source-replays.css';

function Replay({ onClick }: { onClick: () => void }) {
  return <Button variant="link" size="sm" className="ink-replay" onClick={onClick}>
    <RotateCcw size={14} aria-hidden="true" /><Text en="Replay" zh="重播" />
  </Button>;
}

const threads = [
  { d: 'M9 30 H118', delay: 0, duration: .28, tone: 'immediate' },
  { d: 'M20 90 V150 C20 182 48 207 75 210 H116', delay: .2, duration: 1.25, tone: 'programme' },
  { d: 'M87 150 V167 C87 189 78 203 75 210 H116', delay: .72, duration: .73, tone: 'release' },
];

export function AgentDigestReplay({ children }: { children: ReactNode }) {
  const [pass, replay] = useState(0);
  const reduced = useReducedMotion();
  return <div className="digest-ink">
    <div className="digest-route">
      <time className="digest-clock" style={{gridRow:'1'}}>13:00</time>
      <time className="digest-clock" style={{gridRow:'2'}}>13:00</time>
      <time className="digest-clock" style={{gridRow:'3'}}>14:00</time>
      <time className="digest-clock" style={{gridRow:'4'}}>18:00</time>
      <svg viewBox="0 0 125 240" preserveAspectRatio="none" className="digest-threads" aria-hidden="true">
        {threads.map(line => <path key={line.tone} d={line.d} className="digest-guide" />)}
        <g key={pass}>{threads.map(line => <motion.path key={line.tone} d={line.d} data-tone={line.tone}
          initial={pass && !reduced ? {pathLength:0} : false} animate={{pathLength:1}}
          transition={{duration:reduced ? 0 : line.duration,delay:reduced ? 0 : line.delay,ease:'linear'}} />)}</g>
        <g className="digest-starts">
          {['M9 30h.01','M20 90h.01','M87 150h.01'].map(d => <g key={d}><path d={d} /><path d={d} /></g>)}
        </g>
        <path d="m111 25 7 5-7 5" className="digest-arrow" /><path d="M117 210h.01" className="digest-delivered" />
      </svg>
      <div className="digest-label" style={{gridRow:'1'}}><strong><Text en="Agent runtime release" zh="Agent 运行时发布" /></strong><small><Text en="Priority notice, delivered immediately" zh="优先通知，当轮送达" /></small></div>
      <div className="digest-label" style={{gridRow:'2'}}><strong><Text en="Conference programme" zh="会议日程" /></strong><small><Text en="Saved for the evening digest" zh="留待晚报" /></small></div>
      <div className="digest-label" style={{gridRow:'3'}}><strong><Text en="Follow-up release" zh="后续版本发布" /></strong><small><Text en="Queued at the new, lower priority" zh="按调低后的优先级列入待发队列" /></small></div>
      <div className="digest-label digest-result" style={{gridRow:'4'}}><strong><Text en="One evening digest" zh="一份晚报" /></strong><small><Text en="Two waiting items delivered together" zh="两条待发内容一起送达" /></small></div>
    </div>
    <div className="digest-foot">
      <strong><Text en="Seven-check log" zh="七次采集记录" /></strong>
      <Replay onClick={() => replay(n => n+1)} />
    </div>
    {children}
  </div>;
}

const feeds = ['A','B','C','D','E','F'];

export function AgentCollectionSchedule() {
  const [pass,replay] = useState(0);
  const reduced = useReducedMotion();
  return <Diagram id="agent-collection-schedule" title={{ en:'Sequential and concurrent source polling', zh:'六个来源的顺序采集与并发采集' }}
    caption={{ en:'Bars show the idealized dispatch order with equal source delays. Times are measured medians from seven replays with a 25 ms delay per source. The returned records keep their subscription order.', zh:'条形示意来源延迟相同时的请求调度。耗时中位数来自七轮回放，每个来源注入 25 毫秒延迟。返回记录始终按订阅顺序排列。' }}>
    <div className="collection-comparison">
      <div className="collection-coltitle"><span><Text en="Sequential" zh="逐个读取" /></span><strong>160.7 <small>ms</small></strong></div>
      <div className="collection-coltitle"><span><Text en="Three in parallel" zh="三路并发" /></span><strong>54.0 <small>ms</small></strong></div>
      {feeds.map((feed,index) => <Fragment key={feed}>
        <span className="collection-feed"><Text en="Feed" zh="来源" /> {feed}</span>
        {[1,3].map(limit => {
          const start = Math.floor(index / limit);
          return <div className="collection-track" data-mode={limit} key={limit}>
            <div style={{marginInlineStart: start / feeds.length * 100 + '%'}}>
              <motion.i key={pass} initial={pass && !reduced ? {scaleX:0} : false} animate={{scaleX:1}}
                transition={{delay:reduced ? 0 : start*.22,duration:reduced ? 0 : .22,ease:'linear'}} />
            </div>
          </div>;
        })}
      </Fragment>)}
    </div>
    <div className="collection-foot"><Text en="Each bar represents one source request." zh="每根条形代表一次来源请求。" /><Replay onClick={() => replay(n=>n+1)} /></div>
    <span className="sr-only"><Text en="Sequential collection waits for each feed in turn. Parallel collection starts A, B and C together, followed by D, E and F." zh="顺序采集逐个等待六个来源。并发采集同时发出前三个请求，随后读取后三个来源。" /></span>
  </Diagram>;
}
