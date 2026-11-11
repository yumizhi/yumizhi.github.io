'use client';

import { useMemo, useState } from 'react';
import { Localized } from '@/components/language';

const SIDE = 16;
const CELLS = SIDE * SIDE;

/** Deterministic pseudo-random numbers in [0, 1) from integer arithmetic, so server and client render the same grid. */
function noise(index: number, salt: number) {
  let value = Math.imul(index + 1, 0x9e3779b1) ^ Math.imul(salt + 1, 0x85ebca6b);
  value = Math.imul(value ^ (value >>> 15), 0x2c1b3c6d);
  value = Math.imul(value ^ (value >>> 12), 0x297a2d39);
  return ((value ^ (value >>> 15)) >>> 0) / 4294967296;
}

const sigmoid = (value: number) => 1 / (1 + Math.exp(-value));

/** Scripted logits: a few cells are pushed up, the rest are pushed down at different speeds. */
const cells = Array.from({ length: CELLS }, (_, index) => {
  const useful = noise(index, 1) > 0.945;
  return {
    start: (noise(index, 2) - 0.5) * 0.4,
    drift: useful ? 5 + noise(index, 3) * 3 : -(2 + noise(index, 3) * 7),
  };
});

/**
 * A toy picture of the relaxation SASBO optimises: every pixel has a probability of being perturbed,
 * masks are sampled from those probabilities, and the k most probable pixels form the final mask.
 */
export function MaskLab() {
  const [progress, setProgress] = useState(35);
  const [draw, setDraw] = useState(1);
  const [k, setK] = useState(12);

  const state = useMemo(() => {
    const probability = cells.map(cell => Math.round(sigmoid(cell.start + (cell.drift * progress) / 100) * 1000) / 1000);
    const sampled = probability.map((value, index) => noise(index, 10 + draw) < value);
    const threshold = [...probability].sort((a, b) => b - a)[k - 1];
    const kept = probability.map(value => value >= threshold);
    return {
      probability,
      sampled,
      kept,
      expected: probability.reduce((sum, value) => sum + value, 0),
      sampledCount: sampled.filter(Boolean).length,
    };
  }, [progress, draw, k]);

  const grids = [
    { id: 'probability', en: 'Probability σ(φ)', zh: '概率 σ(φ)', value: state.expected.toFixed(1), unit: { en: 'expected pixels', zh: '期望像素数' } },
    { id: 'sample', en: 'One sampled mask M', zh: '一次采样的掩码 M', value: String(state.sampledCount), unit: { en: 'pixels in this draw', zh: '本次采样的像素数' } },
    { id: 'kept', en: 'Top-k mask', zh: 'Top-k 掩码', value: String(k), unit: { en: 'pixels kept', zh: '保留的像素数' } },
  ] as const;

  return (
    <div className="mask-lab">
      <div className="mask-grids">
        {grids.map(grid => (
          <div className="mask-panel" key={grid.id}>
            <p className="label"><Localized en={grid.en} zh={grid.zh} /></p>
            <div className="mask-grid" role="img" aria-label={`${grid.en}: ${grid.value} ${grid.unit.en}`}>
              {state.probability.map((value, index) => (
                <i
                  key={index}
                  style={{
                    opacity: grid.id === 'probability' ? Math.max(value, 0.03) : (grid.id === 'sample' ? state.sampled[index] : state.kept[index]) ? 1 : 0.03,
                  }}
                />
              ))}
            </div>
            <p className="mask-readout"><strong>{grid.value}</strong> <Localized en={grid.unit.en} zh={grid.unit.zh} /></p>
          </div>
        ))}
      </div>
      <div className="mask-controls">
        <label>
          <span><Localized en="Optimization progress" zh="优化进度" /></span>
          <input className="range" type="range" min={0} max={100} value={progress} onChange={event => setProgress(+event.target.value)} />
          <output>{progress}%</output>
        </label>
        <label>
          <span><Localized en="Pixel budget k" zh="像素上限 k" /></span>
          <input className="range" type="range" min={4} max={32} value={k} onChange={event => setK(+event.target.value)} />
          <output>{k}</output>
        </label>
        <button className="pill" type="button" onClick={() => setDraw(value => value + 1)}>
          <Localized en="Draw another mask" zh="重新采样掩码" />
        </button>
      </div>
    </div>
  );
}
