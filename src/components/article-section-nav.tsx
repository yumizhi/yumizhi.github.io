'use client';

import { useEffect, useState } from 'react';
import { LensRefraction } from './ui/cupertino/glass-optics';
import { Check, ChevronDown, List } from 'lucide-react';
import { Menu, MenuLinkItem, MenuPopup, MenuTrigger } from './ui/coss/menu';
import { Localized, useLanguage } from './language';
import './article-section-nav.css';

type Section = { id: string; en: string; zh: string };

export function ArticleSectionNav({ sections, label, embedded = false }: {
  sections: readonly Section[];
  label: { en: string; zh: string };
  embedded?: boolean;
}) {
  const { language } = useLanguage();
  const [active, setActive] = useState(sections[0].id);
  const current = sections.find(section => section.id === active) ?? sections[0];

  useEffect(() => {
    const targets = sections.map(({ id }) => document.getElementById(id));
    const first = targets.find(target => target !== null);
    let frame = 0;

    function update() {
      const cutoff = first ? (parseFloat(getComputedStyle(first).scrollMarginTop) || 0) + 8 : 32;
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

  return (
    <nav className="article-section-nav" aria-label={label[language]}>
      <Menu modal={false}>
        <MenuTrigger className={embedded ? "glass-trigger" : "glass-trigger reader-glass"} title={label[language]} aria-label={`${label[language]}, ${current[language]}`}>
          {!embedded && <LensRefraction />}
          <List size={16} aria-hidden="true" />
          <span className={embedded ? 'reader-current-section' : undefined}>{current[language]}</span>
          {embedded && <span className="reader-contents-label"><Localized en="Guide" zh="导读" /></span>}
          <ChevronDown size={13} aria-hidden="true" />
        </MenuTrigger>
        <MenuPopup align="start" sideOffset={6} className="reader-glass glass-menu">
          {sections.map(section => (
            <MenuLinkItem key={section.id} href={`#${section.id}`} label={section[language]}
              className="glass-option" aria-current={section.id === active ? 'location' : undefined}>
              <Localized en={section.en} zh={section.zh} />
              {section.id === active && <Check size={15} aria-hidden="true" />}
            </MenuLinkItem>
          ))}
        </MenuPopup>
      </Menu>
    </nav>
  );
}
