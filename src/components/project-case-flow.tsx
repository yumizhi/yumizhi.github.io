'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { ProjectTraceVisual } from './project-trace-visuals';
import { Localized, useLanguage } from './language';
import { Button } from './ui/coss/button';
import { Tabs, TabsList, TabsPanel, TabsTab } from './ui/coss/tabs';
import type { ProjectStep } from '@/lib/project-stories';

export function ProjectCaseFlow({ slug, steps, title }: {
  slug: string;
  steps: ProjectStep[];
  title: { en: string; zh: string };
}) {
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const figure = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hasChangedStage, setHasChangedStage] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (current === steps.length - 1) setPlaying(false);
      else {
        setHasChangedStage(true);
        setCurrent(current + 1);
      }
    }, 2200);
    return () => window.clearTimeout(timer);
  }, [current, playing, steps.length]);

  useEffect(() => {
    const target = figure.current;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) setPlaying(false);
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  function selectStep(value: string) {
    const index = steps.findIndex(step => step.id === value);
    if (index < 0) return;
    setPlaying(false);
    setHasChangedStage(true);
    setCurrent(index);
  }

  function togglePlayback() {
    if (!playing && current === steps.length - 1) {
      setHasChangedStage(true);
      setCurrent(0);
    }
    setPlaying(!playing);
  }

  const canPlay = slug === 'epub-toolkit';
  const animateStage = hasChangedStage && !reduced;
  const playingLabel = playing
    ? { en: 'Pause', zh: '暂停' }
    : { en: 'Play walkthrough', zh: '播放流程' };

  return (
    <figure ref={figure} className="case-flow" data-project-trace={slug}>
      <figcaption>
        <span><Localized {...title} /></span>
        {canPlay && <Button variant="ghost" size="sm" className="case-play" onClick={togglePlayback}>
          {playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
          <Localized {...playingLabel} />
        </Button>}
      </figcaption>
      <Tabs value={steps[current].id} onValueChange={selectStep}>
        <TabsList aria-label={language === 'zh' ? title.zh : title.en} className="case-flow-steps">
          {steps.map((step, index) => (
            <TabsTab key={step.id} value={step.id} className="case-flow-step">
              <Localized {...step.label} />
              {index < steps.length - 1 && <ArrowRight size={14} aria-hidden="true" />}
            </TabsTab>
          ))}
        </TabsList>

        {steps.map(step => (
          <TabsPanel key={step.id} value={step.id} className="case-flow-panel" data-case-step={step.id}>
            <motion.div className="case-flow-stage"
              initial={animateStage ? { opacity: 0, y: 5 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : .18, ease: 'easeOut' }}>
              <ProjectTraceVisual slug={slug} step={step.id} animate={animateStage} />
              <div className="case-flow-reading">
                <div>
                  <h3><Localized {...step.title} /></h3>
                  <p><Localized {...step.body} /></p>
                </div>
                <dl className="case-flow-output">
                  <dt><Localized en="Result" zh="产物" /></dt>
                  <dd><Localized {...step.output} /></dd>
                </dl>
              </div>
            </motion.div>
          </TabsPanel>
        ))}
      </Tabs>
    </figure>
  );
}
