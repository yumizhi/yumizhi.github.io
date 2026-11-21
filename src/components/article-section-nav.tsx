'use client';

import { useEffect, useRef, useState } from 'react';
import { LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { Localized, useLanguage } from './language';
import './article-section-nav.css';

type Section = { id: string; en: string; zh: string };

export function ArticleSectionNav({ sections, label }: {
  sections: readonly Section[];
  label: { en: string; zh: string };
}) {
  const { language } = useLanguage();
  const nav = useRef<HTMLElement>(null);
  const [active, setActive] = useState(sections[0].id);
  const reduced = useReducedMotion();

  useEffect(() => {
    const targets = sections.map(({ id }) => document.getElementById(id));
    let frame = 0;

    function update() {
      const cutoff = (nav.current?.getBoundingClientRect().bottom ?? 96) + 30;
      const reached = targets.findLast(target => target && target.getBoundingClientRect().top <= cutoff);
      const atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      setActive(atEnd ? sections[sections.length - 1].id : reached?.id ?? sections[0].id);
      frame = 0;
    }

    function schedule() {
      if (frame === 0) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [sections]);

  useEffect(() => {
    const scroller = nav.current;
    const current = scroller?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!scroller || !current) return;

    const track = scroller.getBoundingClientRect();
    const item = current.getBoundingClientRect();
    const delta = item.left < track.left ? item.left - track.left : Math.max(0, item.right - track.right);
    if (delta) scroller.scrollBy({ left: delta, behavior: reduced ? 'instant' : 'smooth' });
  }, [active, language, reduced]);

  return (
    <LayoutGroup>
      <motion.nav layoutScroll ref={nav} className="article-section-nav" aria-label={label[language]}>
        {sections.map(section => (
          <a href={`#${section.id}`} key={section.id} aria-current={section.id === active ? 'location' : undefined}>
            {section.id === active && (
              <motion.span aria-hidden="true" className="article-section-selection" layoutId="article-section"
                transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 530, damping: 42 }} />
            )}
            <Localized en={section.en} zh={section.zh} />
          </a>
        ))}
      </motion.nav>
    </LayoutGroup>
  );
}
