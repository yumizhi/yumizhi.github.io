'use client';

import { useEffect, useRef, useState } from 'react';
import { LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { Localized } from '../language';

type Section = { id: string; en: string; zh: string };
const baseSections: Section[] = [
  { id: 'overview', en: 'Overview', zh: '导读' },
  { id: 'method', en: 'Method', zh: '方法' },
  { id: 'examples', en: 'Results', zh: '实验结果' },
  { id: 'discussion', en: 'Discussion', zh: '讨论' },
  { id: 'abstract', en: 'Abstract', zh: '摘要' },
  { id: 'citation', en: 'BibTeX', zh: '引用' },
];
const tideSections: Section[] = [
  ...baseSections.slice(0, 3),
  { id: 'timing', en: 'Timing', zh: '注入时刻' },
  ...baseSections.slice(3),
];

export function PaperNav({ expanded = false }: { expanded?: boolean }) {
  const sections = expanded ? tideSections : baseSections;
  const [current, setCurrent] = useState('overview');
  const nav = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const targets = sections.map(({ id }) => document.getElementById(id));
    let frame = 0;

    function readPosition() {
      const top = (nav.current?.getBoundingClientRect().bottom ?? 52) + 38;
      const reached = targets.filter(element => element && element.getBoundingClientRect().top <= top).pop();
      const atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      setCurrent(atEnd ? 'citation' : reached?.id ?? 'overview');
      frame = 0;
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(readPosition);
    }

    readPosition();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [sections]);

  return (
    <LayoutGroup>
      <nav ref={nav} className="tide-paper-nav" aria-label="Paper sections">
        {sections.map(section => (
          <a href={`#${section.id}`} key={section.id} aria-current={section.id === current ? 'location' : undefined}>
            {section.id === current && <motion.i layoutId="paper-position" transition={{ duration: reduced ? 0 : .2 }} />}
            <Localized en={section.en} zh={section.zh} />
          </a>
        ))}
      </nav>
    </LayoutGroup>
  );
}
