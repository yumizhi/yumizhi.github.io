'use client';

import { useState } from 'react';
import { Localized, useLanguage } from '@/components/language';
import { TOTAL_STEPS, attacks, injectionSteps, stepAblation, type Strategy } from './data';

const strategies: { id: Strategy; en: string; zh: string }[] = [
  { id: 'none', en: 'No watermark guidance', zh: '无水印引导' },
  { id: 'fixed', en: 'Fixed budget', zh: '固定预算' },
  { id: 'adaptive', en: 'Adaptive (TIDE)', zh: '自适应（TIDE）' },
];

const insight = [
  {
    en: 'Very early. The image layout is still being decided, so any change is amplified over 45 more steps: fidelity is the lowest of all settings, and a fixed budget drags rotation robustness down to 0.336.',
    zh: '非常早。图像的整体布局尚未确定，任何改动都会在其后的 45 步中被放大：保真度是所有设置中最低的，固定预算还会把旋转鲁棒性拖到 0.336。',
  },
  {
    en: 'Still early. Detection is workable, but the watermarked image sits more than 4 dB below the step-35 setting in PSNR.',
    zh: '仍然偏早。检测已经可用，但 PSNR 比第 35 步的设置低 4 dB 以上。',
  },
  {
    en: 'Mid-trajectory. Robustness with and without guidance is already close, and fidelity keeps improving as injection moves later.',
    zh: '轨迹中段。有无引导时的鲁棒性已经接近，保真度随着注入点后移继续提高。',
  },
  {
    en: 'The setting used in the paper. Adaptive guidance has the best average robustness and the best PSNR and SSIM; this is also the step the watermark was trained for.',
    zh: '论文采用的设置。自适应引导的平均鲁棒性以及 PSNR、SSIM 都最好；水印也正是在这一步上训练的。',
  },
  {
    en: 'Too late. Only five steps remain to carry the watermark into the image. Fidelity stays high, but blur and rotation break verification for every strategy.',
    zh: '太晚。只剩五步把水印带入图像。保真度仍然很高，但在模糊和旋转下三种策略的验证都失效。',
  },
];

/** Tables 12 and 14 of the paper: what happens when the same watermark is written earlier or later. */
export function StepExplorer() {
  const { language } = useLanguage();
  const [index, setIndex] = useState(3);
  const zh = language === 'zh';
  const step = injectionSteps[index];

  return (
    <div className="step-explorer">
      <div className="step-track" role="radiogroup" aria-label="Injection step">
        <span className="step-track-line" aria-hidden="true" />
        {injectionSteps.map((value, position) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={position === index}
            className="step-stop"
            style={{ left: `${(value / TOTAL_STEPS) * 100}%` }}
            onClick={() => setIndex(position)}
          >
            <span className="step-stop-dot" aria-hidden="true" />
            <span className="step-stop-label">{zh ? `第 ${value} 步` : `Step ${value}`}</span>
          </button>
        ))}
        <span className="step-track-end" data-end="start" aria-hidden="true"><Localized en="noise" zh="噪声" /></span>
        <span className="step-track-end" data-end="finish" aria-hidden="true"><Localized en="image" zh="图像" /></span>
      </div>

      <div className="step-panels" aria-live="polite">
        <div className="step-panel">
          <p className="label"><Localized en="Robustness · TPR@1%FPR" zh="鲁棒性 · TPR@1%FPR" /></p>
          <table className="bar-table">
            <caption className="sr-only">TPR at 1% FPR when injecting at step {step}, by image transformation and guidance strategy</caption>
            <thead className="sr-only">
              <tr><th scope="col">Transformation</th>{strategies.map(strategy => <th key={strategy.id} scope="col">{strategy.en}</th>)}</tr>
            </thead>
            <tbody>
              {attacks.map((attack, column) => (
                <tr key={attack.id}>
                  <th scope="row" title={attack.detail}>{zh ? attack.zh : attack.en}</th>
                  {strategies.map(strategy => {
                    const value = stepAblation[strategy.id][index].tpr[column];
                    return (
                      <td key={strategy.id} data-strategy={strategy.id}>
                        <span className="bar" style={{ width: `${value * 100}%` }} aria-hidden="true" />
                        <span className="bar-value">{value.toFixed(3)}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="step-panel">
          <p className="label"><Localized en="Fidelity to the unwatermarked image" zh="相对无水印图像的保真度" /></p>
          <table className="metric-table">
            <thead>
              <tr>
                <th scope="col"><span className="sr-only">Strategy</span></th>
                <th scope="col"><Localized en="Avg. TPR" zh="平均 TPR" /></th>
                <th scope="col">PSNR</th>
                <th scope="col">SSIM</th>
              </tr>
            </thead>
            <tbody>
              {strategies.map(strategy => {
                const row = stepAblation[strategy.id][index];
                return (
                  <tr key={strategy.id} data-strategy={strategy.id}>
                    <th scope="row"><span className="swatch" aria-hidden="true" />{zh ? strategy.zh : strategy.en}</th>
                    <td>{row.tpr[5].toFixed(3)}</td>
                    <td>{row.psnr.toFixed(2)}</td>
                    <td>{row.ssim.toFixed(3)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="step-insight">{zh ? insight[index].zh : insight[index].en}</p>
        </div>
      </div>
    </div>
  );
}
