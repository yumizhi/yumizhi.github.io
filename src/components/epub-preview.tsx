'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Localized, useLanguage } from './language';
import { MediaLenses } from '@/components/ui/cupertino/media-lenses';
import { FilterTabs } from './filter-tabs';
import { asset } from '@/lib/paths';
import type { Project } from '@/lib/content';

type Preview = NonNullable<Project['previews']>[number];

export function EpubPreview({ views }: { views: [Preview, Preview] }) {
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const [view, setView] = useState(views[0].id);

  return (
    <div className="project-card-cover project-card-cover--epub" data-preview={view}>
      <MediaLenses />
      {views.map(preview => (
        <motion.img data-lens-source="" key={preview.id} src={asset(preview.image)} alt={preview.alt}
          width={preview.width} height={preview.height} aria-hidden={view !== preview.id}
          loading="lazy" initial={false} animate={{ opacity: view === preview.id ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : .18 }} />
      ))}
      <FilterTabs surface="overlay" className="project-card-switcher" label={language === 'zh' ? 'EPUB 操作预览' : 'EPUB workflow preview'}
        options={views.map(preview => ({ value: preview.id, label: <Localized en={preview.label} zh={preview.labelZh ?? preview.label} /> }))}
        value={view} onChange={setView} />
    </div>
  );
}
