'use client';

import { useId, useState, type ReactNode } from 'react';
import { CalendarDays, GitPullRequest, Inbox, Layers2, Newspaper } from 'lucide-react';
import { LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { FilterTabs } from './filter-tabs';
import { Localized as Text, useLanguage } from './language';
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from './ui/coss/accordion';
import './agent-source-replays.css';
import { Diagram } from './project-architecture';

const articles = {
  priority: { icon: GitPullRequest, firstSeen: null, title: { en: 'Agent runtime release', zh: 'Agent 运行时发布' } },
  notes: { icon: CalendarDays, firstSeen: '13:00', title: { en: 'Conference programme', zh: '会议日程' } },
  followup: { icon: Newspaper, firstSeen: '14:00', title: { en: 'Follow-up release', zh: '后续版本发布' } },
} as const;

type Article = keyof typeof articles;
const frames = [
  { time: '13:00', queue: ['notes'], digest: [], status: { en: 'A priority release reached the inbox. The conference programme stayed in the queue.', zh: '优先发布已送达，会议日程留在队列。' } },
  { time: '14:00', queue: ['notes', 'followup'], digest: [], status: { en: 'The follow-up release joined the programme in the queue. No message was sent.', zh: '后续发布进入队列，和会议日程一起等晚报。' } },
  { time: '18:00', queue: [], digest: ['notes', 'followup'], status: { en: 'Both queued items arrived in one digest. There were no new updates at this check.', zh: '队列里的两条内容合为一份晚报，本轮没有新增。' } },
] as const;

function ArticleSlip({ article }: { article: Article }) {
  const { icon: Icon, title, firstSeen } = articles[article];
  const reduced = useReducedMotion();
  return <motion.li layoutId={reduced ? undefined : article} layout={reduced ? false : 'position'}
    initial={false} transition={{ type: 'spring', stiffness: 390, damping: 39 }}
    className="digest-slip" data-article={article}>
    <Icon size={15} strokeWidth={1.65} aria-hidden="true" />
    <div><Text {...title} />{firstSeen && <small className="digest-origin"><Text en="First seen" zh="首次采集" /> <time>{firstSeen}</time></small>}</div>
  </motion.li>;
}

export function AgentDigestReplay({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<string>('14:00');
  const { language } = useLanguage();
  const instance = useId();
  const frame = frames.find(item => item.time === selected)!;
  return <div className="digest-replay">
    <div className="digest-controls">
      <FilterTabs label={language === 'zh' ? '采集时刻' : 'Collection time'} options={frames.map(({time}) => ({value:time,label:<time>{time}</time>}))}
        value={selected} onChange={setSelected} />
    </div>
    <LayoutGroup id={instance}>
      <div className="digest-spread" data-time={selected}>
        <section className="digest-column" aria-labelledby={instance + '-queue'}>
          <h4 id={instance + '-queue'}><Layers2 size={17} aria-hidden="true" /><Text en="Digest queue" zh="等待晚报" /></h4>
          <ul className="digest-sheet" data-lane="queue">
            {frame.queue.map(article => <ArticleSlip key={article} article={article} />)}
            {!frame.queue.length && <li className="digest-empty"><Text en="Queue cleared" zh="队列已清空" /></li>}
          </ul>
        </section>
        <section className="digest-column" aria-labelledby={instance + '-inbox'}>
          <h4 id={instance + '-inbox'}><Inbox size={17} aria-hidden="true" /><Text en="Reader’s inbox" zh="读者收件箱" /></h4>
          <div className="digest-sheet" data-lane="inbox">
            <p className="digest-stamp"><time>13:00</time><Text en="Priority notice" zh="优先通知" /></p>
            <ul><ArticleSlip article="priority" /></ul>
            {frame.digest.length > 0 && <div className="digest-envelope">
              <p className="digest-stamp"><time>18:00</time><Text en="Evening digest" zh="晚间摘要" /></p>
              <ul>{frame.digest.map(article => <ArticleSlip key={article} article={article} />)}</ul>
            </div>}
          </div>
        </section>
      </div>
    </LayoutGroup>
    <p className="digest-status" aria-live="polite" aria-atomic="true">{frame.status[language]}</p>
    <Accordion className="digest-audit">
      <AccordionItem value="history">
        <AccordionTrigger><Text en="Full log · seven checks" zh="完整记录 · 七次采集" /></AccordionTrigger>
        <AccordionPanel>{children}</AccordionPanel>
      </AccordionItem>
    </Accordion>
  </div>;
}

const schedules = [
  { id: 'serial', limit: 1, median: '160.7', label: { en: 'One at a time', zh: '逐个读取' } },
  { id: 'parallel', limit: 3, median: '54.0', label: { en: 'Up to three', zh: '三路并发' } },
] as const;

export function AgentCollectionSchedule() {
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const [id, setId] = useState<string>('serial');
  const schedule = schedules.find(item => item.id === id)!;
  return <Diagram id="agent-collection-schedule"
    title={{ en: 'Six requests on the same clock', zh: '同一时间轴上的六次请求' }}
    caption={{ en: 'Bar positions illustrate dispatch with equal source delays. The reported times are measured medians from seven replays with a 25 ms delay injected per source. Results return in subscription order in both modes.', zh: '条形位置示意来源延迟相同时的请求调度。耗时为七轮回放的实测中位数，每个来源注入 25 毫秒延迟。两种方式都按订阅顺序整理结果。' }}>
    <div className="collection-header">
      <FilterTabs label={language === 'zh' ? '采集方式' : 'Collection mode'} value={id} onChange={setId}
        options={schedules.map(item => ({value:item.id,label:item.label[language]}))} />
      <span className="collection-median" aria-live="polite"><Text en="Median" zh="实测中位数" /> <strong>{schedule.median}</strong> ms</span>
    </div>
    <ol className="collection-sources">
      {['A','B','C','D','E','F'].map((source, index) =>
        <li key={source}><span><Text en="Feed" zh="来源" /> {source}</span>
          <div className="collection-track" aria-hidden="true">
            <motion.i initial={false} animate={{ x: Math.floor(index / schedule.limit) * 100 + '%' }}
              transition={{ duration: reduced ? 0 : .36, ease: [.22, 1, .36, 1] }} />
          </div>
        </li>)}
    </ol>
    <p className="collection-axis"><Text en="Dispatch order →" zh="请求发出顺序 →" /></p>
    <span className="sr-only">{schedule.id === 'serial'
      ? <Text en="Each feed waits for the previous feed to finish." zh="每个来源等待前一个来源完成后再开始。" />
      : <Text en="A, B and C start together, then D, E and F." zh="A、B、C 同时开始，随后读取 D、E、F。" />}</span>
  </Diagram>;
}
