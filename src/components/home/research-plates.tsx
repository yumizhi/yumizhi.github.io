'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Grid2X2, Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/coss/button';
import { Localized, useLanguage } from '@/components/language';
import { asset } from '@/lib/paths';
import { guidanceAt, guidanceSteps } from '@/components/tide/guidance-trace';
import './home-previews.css';

const firstStep = guidanceSteps[0].step;
const lastStep = guidanceSteps[guidanceSteps.length - 1].step;
const signalExtent = Math.max(...guidanceSteps.flatMap(sample =>
  [...sample.raw, ...sample.complement].map(Math.abs)
));

function Preview({ variant, children, controls }: {
  variant: 'tide' | 'sasbo' | 'epub';
  children: ReactNode;
  controls: ReactNode;
}) {
  return (
    <div className={`ph-preview ph-preview--${variant}`}>
      <div className="ph-preview-stage">{children}</div>
      <div className="ph-preview-controls">{controls}</div>
    </div>
  );
}

type Playhead = { step: number; separation: number };

// The measured decomposition is raw = text-aligned component + complement.
function drawGuidance(canvas: HTMLCanvasElement | null, { step, separation: progress }: Playhead) {
  const context = canvas?.getContext('2d');
  if (!context || !canvas) return;
  const { width, height } = canvas;
  context.clearRect(0, 0, width, height);
  const signals = guidanceAt(step);
  const separation = progress * progress * (3 - 2 * progress);
  const left = 23;
  const span = width - 46;
  const residual = signals.raw.map((value, index) => value - separation * signals.projected[index]);
  const aligned = signals.projected.map(value => value * separation);
  const samplingProgress = (step - firstStep) / (lastStep - firstStep);
  const signalY = 123 + separation * 47 * (1 - .65 * samplingProgress);
  const alignedY = 123 - separation * 55;

  context.strokeStyle = '#9478a823';
  context.lineWidth = 1;
  for (const y of [79, 127, 175, 223]) {
    context.beginPath();
    context.moveTo(left, y);
    context.lineTo(width - left, y);
    context.stroke();
  }
  const line = (values: number[], baseline: number, color: string, strokeWidth: number, offset = 0) => {
    context.beginPath();
    values.forEach((value, i) => {
      const x = left + span * i / (values.length - 1) + offset;
      const y = baseline - (value / signalExtent) * 53;
      if (i === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.strokeStyle = color;
    context.lineWidth = strokeWidth;
    context.lineJoin = 'round';
    context.stroke();
  };

  // The contour stack behind the selected sample is drawn from preceding steps.
  for (let offset = 3; offset > 0; offset--) {
    const previous = guidanceAt(Math.max(firstStep, step - offset));
    const trail = previous.raw.map((value, index) => value - separation * previous.projected[index]);
    context.globalAlpha = .10 + (5 - offset) * .045;
    line(trail, signalY + offset * 8, '#8d64b2', 1.6, -offset * 2);
  }
  context.globalAlpha = 1;
  if (separation > 0) {
    context.globalAlpha = Math.sin(Math.PI * separation) * .85;
    line(aligned, alignedY, '#497596', 2);
    context.globalAlpha = 1;
  }
  line(residual, signalY, '#c99cda40', 9);
  line(residual, signalY, '#78418a', 3.1);
}

export function TidePlate() {
  const { language } = useLanguage();
  const zh = language === 'zh';
  const canvas = useRef<HTMLCanvasElement>(null);
  const playhead = useRef<Playhead>({ step: firstStep, separation: 0 });
  const [step, setStep] = useState(firstStep);
  const [phase, setPhase] = useState<'raw' | 'separate' | 'retained'>('raw');
  const [playing, setPlaying] = useState(false);

  useEffect(() => drawGuidance(canvas.current, playhead.current), []);

  useEffect(() => {
    if (!playing) return;
    const start = performance.now();
    const initial = playhead.current;
    const peelDuration = (1 - initial.separation) * 1180;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) setPlaying(false);
    });
    if (canvas.current) observer.observe(canvas.current);
    let request: number;

    function tick(now: number) {
      if (media.matches) {
        setPlaying(false);
        return;
      }
      const elapsed = now - start;
      const t = Math.min(1, elapsed / 1180 + initial.separation);
      const current = Math.min(lastStep, initial.step + Math.max(0, elapsed - peelDuration) / 175);
      playhead.current = { step: current, separation: t };
      drawGuidance(canvas.current, playhead.current);
      setPhase(t < 1 ? 'separate' : 'retained');
      setStep(Math.floor(current));
      if (current < lastStep || t < 1) request = requestAnimationFrame(tick);
      else setPlaying(false);
    }
    request = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(request);
      observer.disconnect();
    };
  }, [playing]);

  function togglePlayback() {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      selectStep(step === lastStep ? firstStep : step + 1);
      return;
    }
    if (step === lastStep) selectStep(firstStep);
    setPlaying(true);
  }

  function selectStep(value: number) {
    setPlaying(false);
    const start = value === firstStep;
    playhead.current = { step: value, separation: start ? 0 : 1 };
    drawGuidance(canvas.current, playhead.current);
    setStep(value);
    setPhase(start ? 'raw' : 'retained');
  }

  return (
    <Preview variant="tide" controls={
      <>
        <Button variant="ghost" size="icon-xs" className="ph-preview-icon" onClick={togglePlayback}
          aria-label={playing ? (zh ? '暂停引导动画' : 'Pause guidance animation') : (zh ? '预览引导过程' : 'Preview guidance steps')}>
          {playing ? <Pause size={13} /> : step === lastStep ? <RotateCcw size={13} /> : <Play size={13} />}
        </Button>
        <input className="ph-guidance-range" type="range" min={firstStep} max={lastStep} value={step}
          aria-label={zh ? '扩散采样步' : 'Diffusion sampling step'}
          style={{ '--ph-progress': `${100 * (step - firstStep) / (lastStep - firstStep)}%` } as CSSProperties}
          onChange={event => selectStep(Number(event.currentTarget.value))} />
      </>
    }>
      <canvas ref={canvas} width={320} height={250} role="img"
        aria-label={zh ? '从水印引导中分离与文本对齐的部分，再观察真实采样记录中的保留分量' : 'Separate the text-aligned component from watermark guidance, then follow the retained signal through the recorded TIDE run'} />
      <span className="ph-trace-caption" aria-hidden="true">
        {phase === 'raw' && <Localized en="Watermark guidance" zh="水印引导" />}
        {phase === 'separate' && <Localized en="Separate text direction" zh="分离文本对齐分量" />}
        {phase === 'retained' && <Localized en="Retained signal" zh="保留分量" />}
      </span>
    </Preview>
  );
}

export function SasboPlate() {
  const [overlay, setOverlay] = useState(false);
  const { language } = useLanguage();
  return (
    <Preview variant="sasbo" controls={
      <Button variant="ghost" size="xs" className="ph-preview-toggle" aria-pressed={overlay}
        onClick={() => setOverlay(value => !value)}>
        <Grid2X2 size={13} aria-hidden="true" />
        <Localized en="Pixel map" zh="扰动像素" />
      </Button>
    }>
      <div className="ph-flower" data-overlay={overlay}>
        <img src={asset('/images/research-motion/sasbo-flower-attack.webp')} width={139} height={139}
          alt={language === 'zh' ? 'SASBO 论文中的花朵对抗样本' : 'Adversarial flower example from the SASBO paper'} />
        <div className="ph-flower-reveal" aria-hidden="true">
          <img src={asset('/images/research-motion/sasbo-flower-attack.webp')} width={139} height={139} alt="" />
          <img className="ph-flower-map" src={asset('/images/research-motion/sasbo-flower-map.webp')} width={139} height={139} alt="" />
        </div>
        <span className="ph-flower-scan" aria-hidden="true" />
      </div>
    </Preview>
  );
}

export function EpubPlate() {
  const [merged, setMerged] = useState(false);
  const [started, setStarted] = useState(false);
  return (
    <Preview variant="epub" controls={
      <Button variant="ghost" size="xs" className="ph-preview-toggle" onClick={() => { setStarted(true); setMerged(value => !value); }}>
        {merged ? <Localized en="Split volumes" zh="拆回原卷" /> : <Localized en="Merge volumes" zh="合并分卷" />}
      </Button>
    }>
      <div className="ph-books" data-merged={merged} data-started={started} aria-hidden="true">
        <span className="ph-book ph-book--a">A</span>
        <span className="ph-book ph-book--b">B</span>
        <span className="ph-loose-page ph-loose-page--a" />
        <span className="ph-loose-page ph-loose-page--b" />
        <span className="ph-book ph-book--collection">A+B</span>
      </div>
    </Preview>
  );
}
