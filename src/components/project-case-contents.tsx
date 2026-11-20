'use client';

import { useEffect, useRef, useState } from 'react';
import { Localized, useLanguage } from './language';

const sections = [
  { id: 'preview', en: 'Preview', zh: '界面预览' },
  { id: 'design', en: 'Design', zh: '设计' },
  { id: 'architecture', en: 'Architecture', zh: '系统架构' },
  { id: 'implementation', en: 'Implementation', zh: '技术实现' },
  { id: 'decisions', en: 'Trade-offs', zh: '设计取舍' },
  { id: 'verification', en: 'Validation', zh: '验收' },
];

export function ProjectCaseContents() {
  const { language } = useLanguage();
  const nav = useRef<HTMLElement>(null);
  const [active, setActive] = useState(sections[0].id);

  useEffect(() => {
    const targets = sections.map(section => document.getElementById(section.id));
    let frame = 0;

    function readPosition() {
      const cutoff = (nav.current?.getBoundingClientRect().bottom ?? 96) + 26;
      const current = targets.findLast(target => target && target.getBoundingClientRect().top <= cutoff);
      const atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      setActive(atEnd ? sections[sections.length - 1].id : current?.id ?? sections[0].id);
      frame = 0;
    }

    function schedule() {
      if (frame === 0) frame = requestAnimationFrame(readPosition);
    }

    readPosition();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <nav ref={nav} className="case-contents" aria-label={language === 'zh' ? '项目目录' : 'Project sections'}>
      <ul>
        {sections.map(({ id, ...label }) => (
          <li key={id}><a href={`#${id}`} aria-current={active === id ? 'location' : undefined}><Localized {...label} /></a></li>
        ))}
      </ul>
    </nav>
  );
}
