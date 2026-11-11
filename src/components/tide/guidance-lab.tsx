'use client';

import { useId, useState } from 'react';
import { Localized, useLanguage } from '@/components/language';
import { GUIDANCE_SCALE, run } from './data';

// In the recorded run the watermark branch can take at most half of the budget.
const RESERVED = GUIDANCE_SCALE / 2;
const CX = 130;
const CY = 190;
const R = 150;

/**
 * Equations 15–20 on a plane. The text subspace is drawn as one axis; the real
 * residuals live in the latent space, so this is a drawing of the rule, not of data.
 */
export function GuidanceLab() {
  const { language } = useLanguage();
  const zh = language === 'zh';
  const [mode, setMode] = useState<'explore' | 'recorded'>('explore');
  const [overlap, setOverlap] = useState(0.35);
  const [curvature, setCurvature] = useState(0.05);
  const [recorded, setRecorded] = useState(0);
  const ids = { overlap: useId(), curvature: useId(), recorded: useId() };

  const entry = run.guidance[recorded];
  const c = mode === 'recorded' ? entry.conflict : overlap;
  const k = mode === 'recorded' ? entry.curvature : curvature;
  const eta = mode === 'recorded' ? entry.eta : (1 - c) * Math.exp(-k);
  const watermark = (GUIDANCE_SCALE - RESERVED) * eta;
  const text = GUIDANCE_SCALE - watermark;

  // Unit watermark residual at the angle whose cosine is the overlap.
  const px = c * R;
  const py = Math.sqrt(1 - c * c) * R;
  const turn = Math.acos(Math.max(-1, 1 - k));
  const previous = { x: Math.cos(turn) * R * 1.25, y: -Math.sin(turn) * R * 1.25 };

  return (
    <div className="guidance-lab">
      <div className="segmented" role="tablist" aria-label="Guidance diagram mode">
        <button type="button" role="tab" aria-selected={mode === 'explore'} onClick={() => setMode('explore')}>
          <Localized en="Explore the rule" zh="自由调节" />
        </button>
        <button type="button" role="tab" aria-selected={mode === 'recorded'} onClick={() => setMode('recorded')}>
          <Localized en="Values from the recorded run" zh="实测采样记录" />
        </button>
      </div>

      <div className="guidance-grid">
        <svg className="guidance-plot" viewBox="0 0 400 230" role="img" aria-label={`Watermark residual split into a part along the text direction, which is discarded, and a perpendicular part, which is kept. Overlap ${c.toFixed(2)}.`}>
          <defs>
            {(['text', 'raw', 'null', 'proj'] as const).map(name => (
              <marker key={name} id={`arrow-${name}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 10 5 0 10z" className="guidance-head" data-vector={name} />
              </marker>
            ))}
          </defs>
          <line className="guidance-axis" x1="20" x2="390" y1={CY} y2={CY} />
          <line className="guidance-vector" data-vector="previous" x1={CX} y1={CY} x2={CX + previous.x} y2={CY + previous.y} />
          <line className="guidance-vector" data-vector="text" x1={CX} y1={CY} x2={CX + R * 1.55} y2={CY} markerEnd="url(#arrow-text)" />
          <line className="guidance-drop" x1={CX + px} y1={CY - py} x2={CX + px} y2={CY} />
          <line className="guidance-drop" x1={CX + px} y1={CY - py} x2={CX} y2={CY - py} />
          {c > 0.02 && <line className="guidance-vector" data-vector="proj" x1={CX} y1={CY + 12} x2={CX + px} y2={CY + 12} markerEnd="url(#arrow-proj)" />}
          <line className="guidance-vector" data-vector="null" x1={CX} y1={CY} x2={CX} y2={CY - py} markerEnd="url(#arrow-null)" />
          <line className="guidance-vector" data-vector="raw" x1={CX} y1={CY} x2={CX + px} y2={CY - py} markerEnd="url(#arrow-raw)" />
          <text className="guidance-label" data-vector="text" x={CX + R * 1.55} y={CY - 10} textAnchor="end">Δtxt</text>
          <text className="guidance-label" data-vector="raw" x={CX + px + 8} y={CY - py - 6}>Δwm</text>
          <text className="guidance-label" data-vector="null" x={CX - 10} y={CY - py + 4} textAnchor="end">{zh ? '保留' : 'kept'}</text>
          {c > 0.12 && <text className="guidance-label" data-vector="proj" x={CX + px / 2} y={CY + 30} textAnchor="middle">{zh ? '舍弃' : 'discarded'}</text>}
        </svg>

        <div className="guidance-side">
          {mode === 'explore' ? (
            <>
              <div className="field">
                <label htmlFor={ids.overlap}><Localized en="Overlap with the text subspace" zh="与文本子空间的重叠" /> <span>c<sub>t</sub> = {c.toFixed(2)}</span></label>
                <input id={ids.overlap} className="range" type="range" min={0} max={0.95} step={0.01} value={overlap} onChange={event => setOverlap(Number(event.target.value))} />
              </div>
              <div className="field">
                <label htmlFor={ids.curvature}><Localized en="Curvature of the text trajectory" zh="文本轨迹的曲率" /> <span>κ<sub>t</sub> = {k.toFixed(2)}</span></label>
                <input id={ids.curvature} className="range" type="range" min={0} max={0.6} step={0.01} value={curvature} onChange={event => setCurvature(Number(event.target.value))} />
              </div>
            </>
          ) : (
            <div className="field">
              <label htmlFor={ids.recorded}><Localized en="Denoising step" zh="去噪步" /> <span>{entry.step + 1} / 50</span></label>
              <input id={ids.recorded} className="range" type="range" min={0} max={run.guidance.length - 1} step={1} value={recorded} onChange={event => setRecorded(Number(event.target.value))} aria-valuetext={`Step ${entry.step + 1}`} />
              <p className="field-note">c<sub>t</sub> = {c.toFixed(3)} · κ<sub>t</sub> = {k.toFixed(3)}</p>
            </div>
          )}

          <dl className="guidance-output" aria-live="polite">
            <div><dt>η<sub>t</sub></dt><dd>{eta.toFixed(3)}</dd></div>
            <div data-part="text"><dt>g<sub>txt</sub></dt><dd>{text.toFixed(2)}</dd></div>
            <div data-part="watermark"><dt>g<sub>wm</sub></dt><dd>{watermark.toFixed(2)}</dd></div>
          </dl>
          <div className="budget-bar" aria-hidden="true">
            <span data-part="text" style={{ width: `${(text / GUIDANCE_SCALE) * 100}%` }} />
            <span data-part="watermark" style={{ width: `${(watermark / GUIDANCE_SCALE) * 100}%` }} />
          </div>
          <p className="field-note">
            <Localized
              en="s = 7.5, with half of it reserved for text as in the recorded run. The residual-ratio term is 1 here: in that run r_t stays near 0.003."
              zh="s = 7.5，其中一半保留给文本分支，与实测记录一致。残差比一项在这里取 1：实测中 r_t 始终约为 0.003。"
            />
          </p>
        </div>
      </div>
    </div>
  );
}
