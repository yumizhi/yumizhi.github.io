'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { Localized, useLanguage } from '@/components/language';
import { asset } from '@/lib/paths';
import { GUIDANCE_SCALE, INJECTION_STEP, TOTAL_STEPS, run } from './data';

const tracks = [
  { id: 'original', en: 'No watermark', zh: '无水印', noteEn: 'reference', noteZh: '参照' },
  { id: 'tree', en: 'Tree-Ring', zh: 'Tree-Ring', noteEn: 'written into the initial noise', noteZh: '写入初始噪声' },
  { id: 'tide', en: 'TIDE', zh: 'TIDE', noteEn: 'written at step 35', noteZh: '在第 35 步写入' },
] as const;

// Chart geometry (SVG user units).
const W = 1000;
const H = 190;
const PAD = { left: 44, right: 16, top: 14, bottom: 28 };
const MAX_DRIFT = 0.16;
const x = (step: number) => PAD.left + ((step - 1) / (TOTAL_STEPS - 1)) * (W - PAD.left - PAD.right);
const y = (value: number) => H - PAD.bottom - (value / MAX_DRIFT) * (H - PAD.top - PAD.bottom);
const line = (key: 'tree' | 'tide') => run.drift.map((row, index) => `${index ? 'L' : 'M'}${x(row.step).toFixed(1)} ${y(row[key]).toFixed(1)}`).join(' ');

/** Scrub one real sampling run and watch where each watermark changes the image. */
export function TrajectoryExplorer() {
  const { language } = useLanguage();
  const [step, setStep] = useState(TOTAL_STEPS);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const sliderId = useId();

  // The sprite sheets are ~0.5 MB each: fetch them only once the figure is near.
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      Promise.all(tracks.map(track => new Promise(resolve => {
        const image = new Image();
        image.onload = image.onerror = resolve;
        image.src = asset(`/images/art/tide-sprite-${track.id}.webp`);
      }))).then(() => setReady(true));
    }, { rootMargin: '600px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setStep(current => {
        if (current >= TOTAL_STEPS) { setPlaying(false); return current; }
        return current + 1;
      });
    }, 130);
    return () => window.clearInterval(timer);
  }, [playing]);

  const toggle = () => {
    if (!playing && step >= TOTAL_STEPS) setStep(1);
    setPlaying(value => !value);
  };

  const drift = run.drift[step - 1];
  const guidance = run.guidance.find(entry => entry.step === step - 1);
  const textShare = guidance ? guidance.text / GUIDANCE_SCALE : 1;
  const spritePosition = `${((step - 1) % 10) * (100 / 9)}% ${Math.floor((step - 1) / 10) * 25}%`;
  const zh = language === 'zh';

  return (
    <div className="trajectory" ref={root} data-ready={ready}>
      <div className="trajectory-lanes">
        {tracks.map(track => {
          const value = track.id === 'original' ? null : drift[track.id];
          return (
            <div className="trajectory-lane" key={track.id} data-track={track.id}>
              <div
                className="trajectory-frame"
                role="img"
                aria-label={`${track.en}: clean-image estimate at step ${step} of ${TOTAL_STEPS}`}
                style={{
                  backgroundImage: ready ? `url(${asset(`/images/art/tide-sprite-${track.id}.webp`)})` : `url(${asset(`/media/tide/sampling/${track.id}-50.webp`)})`,
                  backgroundSize: ready ? '1000% 500%' : 'cover',
                  backgroundPosition: ready ? spritePosition : 'center',
                }}
              />
              <div className="trajectory-lane-label">
                <strong>{zh ? track.zh : track.en}</strong>
                <span>{zh ? track.noteZh : track.noteEn}</span>
                <span className="trajectory-drift">
                  {value === null ? '—' : `Δ ${value.toFixed(3)}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="trajectory-controls">
        <button type="button" className="trajectory-play" onClick={toggle} aria-label={playing ? 'Pause' : step >= TOTAL_STEPS ? 'Replay sampling' : 'Play sampling'}>
          {playing ? <Pause size={16} /> : step >= TOTAL_STEPS ? <RotateCcw size={16} /> : <Play size={16} />}
        </button>
        <label className="label" htmlFor={sliderId}><Localized en="Denoising step" zh="去噪步" /></label>
        <input
          id={sliderId}
          className="range"
          type="range"
          min={1}
          max={TOTAL_STEPS}
          value={step}
          onChange={event => { setPlaying(false); setStep(Number(event.target.value)); }}
          aria-valuetext={`Step ${step} of ${TOTAL_STEPS}`}
        />
        <output className="trajectory-step" htmlFor={sliderId}>{String(step).padStart(2, '0')}<span> / {TOTAL_STEPS}</span></output>
      </div>

      <svg className="trajectory-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Difference from the unwatermarked image at every step. Tree-Ring differs from step 1 and keeps growing; TIDE is identical until step 35 and stays lower afterwards.">
        {[0, 0.05, 0.1, 0.15].map(value => (
          <g key={value}>
            <line className="chart-grid" x1={PAD.left} x2={W - PAD.right} y1={y(value)} y2={y(value)} />
            <text className="chart-axis" x={PAD.left - 8} y={y(value) + 4} textAnchor="end">{value.toFixed(2)}</text>
          </g>
        ))}
        {[1, 10, 20, 30, 40, 50].map(value => (
          <text key={value} className="chart-axis" x={x(value)} y={H - 8} textAnchor="middle">{value}</text>
        ))}
        <rect className="chart-phase" x={x(INJECTION_STEP + 0.5)} y={PAD.top} width={x(TOTAL_STEPS) - x(INJECTION_STEP + 0.5)} height={H - PAD.top - PAD.bottom} />
        <line className="chart-injection" x1={x(INJECTION_STEP + 0.5)} x2={x(INJECTION_STEP + 0.5)} y1={PAD.top} y2={H - PAD.bottom} />
        <text className="chart-axis chart-injection-label" x={x(INJECTION_STEP + 0.5) - 8} y={PAD.top + 10} textAnchor="end">{zh ? 'τ = 35 写入水印' : 'τ = 35 · watermark written'}</text>
        <path className="chart-line" data-series="tree" d={line('tree')} />
        <path className="chart-line" data-series="tide" d={line('tide')} />
        <line className="chart-cursor" x1={x(step)} x2={x(step)} y1={PAD.top} y2={H - PAD.bottom} />
        <circle className="chart-dot" data-series="tree" cx={x(step)} cy={y(drift.tree)} r="4.5" />
        <circle className="chart-dot" data-series="tide" cx={x(step)} cy={y(drift.tide)} r="4.5" />
        <text className="chart-series-label" data-series="tree" x={x(13)} y={y(0.1) - 12}>Tree-Ring</text>
        <text className="chart-series-label" data-series="tide" x={x(13)} y={y(0) - 8}>TIDE</text>
      </svg>

      <div className="trajectory-readout" aria-live="polite">
        <div className="budget">
          <div className="budget-head">
            <span className="label"><Localized en="Guidance budget s = 7.5" zh="引导预算 s = 7.5" /></span>
            <span className="budget-values">
              g<sub>txt</sub> {(textShare * GUIDANCE_SCALE).toFixed(2)}
              {' · '}g<sub>wm</sub> {guidance ? guidance.watermark.toFixed(2) : '0.00'}
            </span>
          </div>
          <div className="budget-bar" aria-hidden="true">
            <span data-part="text" style={{ width: `${textShare * 100}%` }} />
            <span data-part="watermark" style={{ width: `${(1 - textShare) * 100}%` }} />
          </div>
        </div>
        <p className="trajectory-note">
          {guidance ? (
            <Localized
              en={<>Step {step}. The watermark is in the latent. Overlap with the text subspace is c<sub>t</sub> = {guidance.conflict.toFixed(3)}, so η<sub>t</sub> = {guidance.eta.toFixed(3)} and {((1 - textShare) * 100).toFixed(0)}% of the budget goes to the watermark branch.</>}
              zh={<>第 {step} 步。水印已经在潜变量中。与文本子空间的重叠 c<sub>t</sub> = {guidance.conflict.toFixed(3)}，于是 η<sub>t</sub> = {guidance.eta.toFixed(3)}，{((1 - textShare) * 100).toFixed(0)}% 的预算分给水印分支。</>}
            />
          ) : (
            <Localized
              en={<>Step {step}. TIDE has not touched the latent yet, so its estimate is pixel-identical to the reference. Tree-Ring changed the starting noise and is already heading to a different image.</>}
              zh={<>第 {step} 步。TIDE 还没有改动潜变量，它的估计与参照逐像素相同。Tree-Ring 修改了初始噪声，已经走向另一张图像。</>}
            />
          )}
        </p>
      </div>
    </div>
  );
}
