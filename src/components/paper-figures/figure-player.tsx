'use client';

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform, type MotionValue } from 'motion/react';
import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react';
import { Button } from '../ui/coss/button';
import { FilterTabs } from '../filter-tabs';
import { Localized, useLanguage } from '../language';
import type { EssayChapter, EssayCopy } from './essay-chapters';
import './figure-player.css';

type Chapter = { label: EssayCopy; description: EssayCopy };

export function FigurePlayer({ id, title, chapters, essay, children }: {
  id: string;
  title: EssayCopy;
  chapters: Chapter[];
  essay: EssayChapter[];
  children: (step: number, reduced: boolean, position: MotionValue<number>) => ReactNode;
}) {
  const name = useId();
  const { language } = useLanguage();
  const reduced = useReducedMotion() === true;
  const [step, setStep] = useState(0);
  const activeStep = useRef(0);
  const [playing, setPlaying] = useState(false);
  const figure = useRef<HTMLElement>(null);
  const reading = useRef<HTMLDivElement>(null);
  const animation = useRef<ReturnType<typeof animate> | null>(null);
  const inPlayback = useRef(false);
  const position = useMotionValue(.88);
  const atStaticFrame = useRef(true);
  const total = chapters.length;
  const progress = useTransform(position, [0, total], [0, 1]);

  useMotionValueEvent(position, 'change', time => {
    if (!inPlayback.current) return;
    const next = Math.min(Math.floor(time), total - 1);
    if (next === activeStep.current) return;
    activeStep.current = next;
    setStep(next);
  });

  const seek = useCallback((index: number, animateTransition = false) => {
    animation.current?.stop();
    atStaticFrame.current = true;
    inPlayback.current = false;
    activeStep.current = index;
    setStep(index);
    setPlaying(false);
    const frame = index + .88;
    if (!animateTransition || reduced) position.jump(frame);
    else animation.current = animate(position, frame, { type: 'spring', bounce: 0, duration: .61 });
  }, [position, reduced]);

  useEffect(() => {
    const chapters = Array.from(reading.current?.children ?? []);
    let observer: IntersectionObserver | undefined;
    function observeChapters() {
      observer?.disconnect();
      const mobile = window.matchMedia('(max-width: 760px)').matches;
      const height = window.innerHeight;
      const line = Math.round(height * (mobile ? .79 : .44));
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = chapters.indexOf(entry.target);
          if (index !== activeStep.current) seek(index, true);
        }
      }, { rootMargin: `-${line}px 0px -${height - line - 2}px 0px` });
      chapters.forEach(chapter => observer?.observe(chapter));
    }
    observeChapters();
    window.addEventListener('resize', observeChapters);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', observeChapters);
    };
  }, [seek]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) return;
      animation.current?.stop();
      setPlaying(false);
    });
    if (figure.current) observer.observe(figure.current);
    function onVisibilityChange() {
      if (!document.hidden) return;
      animation.current?.stop();
      setPlaying(false);
    }
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      animation.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (!reduced) return;
    animation.current?.stop();
    inPlayback.current = false;
    position.jump(activeStep.current + .88);
    setPlaying(false);
  }, [position, reduced]);

  function play(from = atStaticFrame.current ? activeStep.current : position.get()) {
    if (reduced) {
      seek((step + 1) % total);
      return;
    }
    animation.current?.stop();
    const start = from >= total - .001 ? 0 : from;
    atStaticFrame.current = false;
    inPlayback.current = true;
    position.jump(start);
    setPlaying(true);
    animation.current = animate(position, total, {
      duration: (total - start) * 2.6,
      ease: 'linear',
      onComplete: () => { inPlayback.current = false; setPlaying(false); },
    });
  }

  function toggle() {
    if (!playing) {
      play();
      return;
    }
    animation.current?.stop();
    setPlaying(false);
  }

  const action = reduced ? { en: 'Next stage', zh: '下一阶段' }
    : playing ? { en: 'Pause animation', zh: '暂停动画' }
    : { en: 'Play animation', zh: '播放动画' };
  const ActionIcon = reduced ? SkipForward : playing ? Pause : Play;

  return (
    <div className="paper-essay">
     <figure ref={figure} id={id} className="paper-motion-figure" aria-labelledby={name} data-step={step} data-playing={playing}>
      <div className="paper-motion-heading">
        <h3 id={name}><Localized {...title} /></h3>
        <span><Localized en="Mechanism illustration" zh="机制示意" /></span>
      </div>
      <div className="paper-motion-scene">{children(step, reduced, position)}</div>
      <div className="paper-motion-controls">
        <FilterTabs className="paper-motion-stages" value={String(step)} onChange={value => seek(Number(value))}
          label={language === 'zh' ? '图解阶段' : 'Illustration stages'}
          options={chapters.map(({ label }, index) => ({ value: String(index), label: <Localized {...label} /> }))} />
      </div>
      <div className="paper-motion-progress" aria-hidden="true"><motion.div style={{ scaleX: progress }} /></div>
      <figcaption>
        <span><Localized {...chapters[step].description} /></span>
        <div className="paper-motion-actions">
          <Button variant="secondary" size="icon" aria-label={action[language]} onClick={toggle}><ActionIcon aria-hidden="true" /></Button>
          <Button variant="ghost" size="icon" aria-label={language === 'zh' ? '从头播放' : 'Replay animation'}
            onClick={() => reduced ? seek(0) : play(0)}><RotateCcw aria-hidden="true" /></Button>
        </div>
      </figcaption>
     </figure>
     <div className="paper-essay-reading" ref={reading}>
       {essay.map((chapter, index) => (
         <section className="paper-essay-chapter" key={chapter.title.en} data-current={index === step}>
           <h3><Localized {...chapter.title} /></h3>
           {chapter.body.map(paragraph => <p key={paragraph.en}><Localized {...paragraph} /></p>)}
         </section>
       ))}
     </div>
    </div>
  );
}
