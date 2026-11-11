'use client';

import { useEffect, useState } from 'react';
import { Localized } from '@/components/language';

export type TocItem = { id: string; en: string; zh: string };

/** Numbered contents rail. Highlights the section currently being read. */
export function Toc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const sections = items
      .map(item => document.getElementById(item.id))
      .filter((node): node is HTMLElement => node !== null);
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(entry => entry.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: '-15% 0px -70% 0px' },
    );
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="toc" aria-label="Table of contents">
      <p className="label"><Localized en="Contents" zh="目录" /></p>
      <ol>
        {items.map((item, index) => (
          <li key={item.id}>
            <a href={`#${item.id}`} aria-current={active === item.id ? 'location' : undefined}>
              <span className="toc-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <Localized en={item.en} zh={item.zh} />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
