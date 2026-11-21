'use client';

import { useId, useState, type CSSProperties } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { GalleryHorizontalEnd, Maximize2, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { GlassChoice } from './ui/cupertino/choice';
import { Localized, useLanguage } from './language';
import { asset } from '@/lib/paths';
import type { Project } from '@/lib/content';

export function ProjectStage({ project }: { project: Project }) {
  const group = useId();
  const reduced = useReducedMotion();
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const views = project.previews?.length ? project.previews : [{
    id: 'overview', label: 'Overview', labelZh: '概览', image: project.image, width: 1440, height: 1050,
    mobile: undefined, mobileWidth: undefined, mobileHeight: undefined, alt: project.imageAlt,
    caption: undefined, captionZh: undefined,
  }];
  const [view, setView] = useState(views[0].id);
  const selected = views.find(item => item.id === view)!;
  const timing = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 380, damping: 36 };
  const items = views.map(item => ({ value: item.id, label: language === 'zh' ? item.labelZh ?? item.label : item.label }));
  const expand = language === 'zh' ? `放大${selected.labelZh ?? selected.label}截图` : `Expand ${project.title} ${selected.label.toLowerCase()} screenshot`;

  return (
    <LayoutGroup id={group}>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <div className="project-demo">
          <div className="project-stage">
            <motion.div layout layoutId={`image-${view}`} className="stage-window" transition={{ layout: timing }}
              style={{ '--capture-ratio': selected.width / selected.height, '--mobile-capture-ratio':
                (selected.mobileWidth ?? selected.width) / (selected.mobileHeight ?? selected.height), borderRadius: 16 } as CSSProperties}>
              {views.map(item => (
                <motion.picture layout="position" key={item.id} className="stage-capture" initial={false}
                  animate={{ opacity: view === item.id ? 1 : 0 }} transition={{ duration: reduced ? 0 : .24 }} aria-hidden={view !== item.id}>
                  <source media="(max-width:620px)" srcSet={asset(item.mobile ?? item.image)} />
                  <img src={asset(item.image)} width={item.width} height={item.height} alt={view === item.id ? item.alt : ''}
                    loading={view === item.id ? 'eager' : 'lazy'} />
                </motion.picture>
              ))}
            </motion.div>
            <div className="preview-dock">
              {views.length > 1 && <GlassChoice items={items} value={view} onChange={setView} icon={GalleryHorizontalEnd}
                label={language === 'zh' ? '切换预览' : 'Choose preview'} />}
              <Dialog.Trigger asChild>
                <button type="button" className="reader-glass preview-expand" aria-label={expand}><Maximize2 size={16} /></button>
              </Dialog.Trigger>
            </div>
          </div>
          {selected.caption && <p className="preview-caption"><Localized en={selected.caption} zh={selected.captionZh ?? selected.caption} /></p>}
        </div>
        <AnimatePresence>
          {open && <Dialog.Portal forceMount>
            <Dialog.Overlay forceMount asChild>
              <motion.div className="stage-lightbox-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0 : .2 }} />
            </Dialog.Overlay>
            <Dialog.Content forceMount asChild aria-describedby={undefined}>
              <motion.div layoutRoot className="stage-lightbox">
                <Dialog.Title className="sr-only">{project.title} — {selected.label}</Dialog.Title>
                <motion.div className="stage-lightbox-media" layoutId={`image-${view}`} transition={{ layout: timing }} style={{ borderRadius: 16 }}>
                  <picture>
                    <source media="(max-width:620px)" srcSet={asset(selected.mobile ?? selected.image)} />
                    <img src={asset(selected.image)} width={selected.width} height={selected.height} alt={selected.alt} />
                  </picture>
                </motion.div>
                <Dialog.Close asChild><button className="stage-lightbox-close reader-glass" aria-label={language === 'zh' ? '关闭截图' : 'Close screenshot'}><X size={18} /></button></Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>}
        </AnimatePresence>
      </Dialog.Root>
    </LayoutGroup>
  );
}
