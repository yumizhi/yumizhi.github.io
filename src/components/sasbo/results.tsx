'use client';

import { useState } from 'react';
import { Localized } from '@/components/language';

type Row = [method: string, asr: number, l0: number, l1: number, l2: number, linf: number];
type Setting = { id: string; en: string; zh: string; table: string; pixels: number; thresholds: Record<'255' | '100' | '10', Row[]> };

/** Tables 1–4 of the paper. ASR in %, norms averaged over all attacked images. */
const settings: Setting[] = [
  {
    id: 'cifar-untargeted', en: 'CIFAR-10 · non-targeted', zh: 'CIFAR-10 · 非定向', table: '1', pixels: 32 * 32,
    thresholds: {
      '255': [['PGD-ℓ0+ℓ∞', 100, 48.01, 38.59, 6.05, 1], ['SparseFool', 100, 22.03, 10.61, 2.29, 0.808], ['GreedyFool', 100, 12.29, 8.14, 1.48, 0.986], ['SASBO', 100, 3.95, 3.82, 1.24, 0.985]],
      '100': [['PGD-ℓ0+ℓ∞', 100, 487.82, 171.82, 8.18, 0.389], ['SparseFool', 100, 30.39, 9.81, 1.71, 0.386], ['GreedyFool', 100, 15.56, 5.83, 1.21, 0.376], ['SASBO', 100, 7.9, 3.08, 0.51, 0.382]],
      '10': [['PGD-ℓ0+ℓ∞', 82.72, 941.78, 45.72, 1.88, 0.039], ['SparseFool', 100, 315.13, 12.25, 0.57, 0.039], ['GreedyFool', 100, 178.53, 6.56, 0.49, 0.038], ['SASBO', 100, 144.21, 5.61, 0.43, 0.039]],
    },
  },
  {
    id: 'imagenet-untargeted', en: 'ImageNet · non-targeted', zh: 'ImageNet · 非定向', table: '2', pixels: 224 * 224,
    thresholds: {
      '255': [['PGD-ℓ0+ℓ∞', 100, 1315.73, 1315.73, 114.68, 1], ['SparseFool', 100, 102.45, 49.33, 4.56, 0.86], ['GreedyFool', 100, 71.65, 30.34, 3.06, 0.867], ['SASBO', 100, 50.87, 24.52, 1.65, 0.86]],
      '100': [['PGD-ℓ0+ℓ∞', 100, 1782.94, 686.33, 16.22, 0.385], ['SparseFool', 100, 172.78, 45.02, 2.96, 0.386], ['GreedyFool', 100, 160.46, 36.91, 2.3, 0.345], ['SASBO', 100, 145.77, 38.29, 1.44, 0.379]],
      '10': [['PGD-ℓ0+ℓ∞', 64.92, 14750.05, 535.25, 4.56, 0.039], ['SparseFool', 100, 1257.56, 39.1, 1.04, 0.039], ['GreedyFool', 100, 1104.27, 38.95, 0.84, 0.038], ['SASBO', 100, 1051.24, 40.86, 0.57, 0.039]],
    },
  },
  {
    id: 'cifar-targeted', en: 'CIFAR-10 · targeted', zh: 'CIFAR-10 · 定向', table: '3', pixels: 32 * 32,
    thresholds: {
      '255': [['PGD-ℓ0+ℓ∞', 100, 54.03, 32.59, 5.54, 1], ['GreedyFool', 100, 48.99, 16.52, 2.61, 0.992], ['SASBO', 100, 14.88, 13.95, 1.87, 0.981]],
      '100': [['PGD-ℓ0+ℓ∞', 100, 461.91, 168.24, 8.09, 0.389], ['GreedyFool', 100, 98.46, 15.83, 3.41, 0.391], ['SASBO', 100, 29.94, 11.34, 1.55, 0.39]],
      '10': [['PGD-ℓ0+ℓ∞', 54.79, 955.35, 32.17, 1.19, 0.039], ['GreedyFool', 100, 412.08, 14.41, 0.79, 0.039], ['SASBO', 100, 324.14, 12.62, 0.68, 0.039]],
    },
  },
  {
    id: 'imagenet-targeted', en: 'ImageNet · targeted', zh: 'ImageNet · 定向', table: '4', pixels: 224 * 224,
    thresholds: {
      '255': [['PGD-ℓ0+ℓ∞', 100, 10015.04, 9873.23, 113.13, 1], ['GreedyFool', 100, 503.27, 350.41, 27.38, 0.935], ['SASBO', 100, 272.95, 205.87, 15.33, 0.995]],
      '100': [['PGD-ℓ0+ℓ∞', 100, 32842.92, 10867.91, 60.23, 0.389], ['GreedyFool', 100, 1196.42, 173.76, 10.25, 0.391], ['SASBO', 100, 600.8, 142.83, 6.56, 0.39]],
      '10': [['PGD-ℓ0+ℓ∞', 51.02, 49516.2, 1826.12, 8.72, 0.039], ['GreedyFool', 100, 6476.42, 225.64, 3.12, 0.039], ['SASBO', 100, 4782.61, 186.49, 2.61, 0.039]],
    },
  },
];

const thresholds = ['255', '100', '10'] as const;

/** Mean number of perturbed pixels per method, with the full table row beside each bar. */
export function SparsityChart() {
  const [settingId, setSettingId] = useState(settings[0].id);
  const [threshold, setThreshold] = useState<(typeof thresholds)[number]>('255');
  const setting = settings.find(item => item.id === settingId)!;
  const rows = setting.thresholds[threshold];
  const longest = Math.max(...rows.map(row => row[2]));

  return (
    <div className="l0-chart">
      <div className="l0-controls">
        <div className="segmented" role="tablist" aria-label="Benchmark">
          {settings.map(item => (
            <button key={item.id} type="button" role="tab" aria-selected={item.id === settingId} onClick={() => setSettingId(item.id)}>
              <Localized en={item.en} zh={item.zh} />
            </button>
          ))}
        </div>
        <div className="segmented" role="tablist" aria-label="Perturbation threshold">
          {thresholds.map(value => (
            <button key={value} type="button" role="tab" aria-selected={value === threshold} onClick={() => setThreshold(value)}>
              ε = {value}
            </button>
          ))}
        </div>
      </div>
      <div className="table-scroll">
        <table className="data-table l0-table">
          <caption className="sr-only">
            Table {setting.table} of the paper: {setting.en}, ε = {threshold}
          </caption>
          <thead>
            <tr>
              <th scope="col"><Localized en="Method" zh="方法" /></th>
              <th scope="col" className="l0-bar-heading"><Localized en="Mean perturbed pixels (ℓ0)" zh="平均扰动像素数（ℓ0）" /></th>
              <th scope="col">ASR %</th>
              <th scope="col">ℓ1</th>
              <th scope="col">ℓ2</th>
              <th scope="col">ℓ∞</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([method, asr, l0, l1, l2, linf]) => (
              <tr key={method} data-ours={method === 'SASBO' || undefined}>
                <th scope="row">{method}</th>
                <td className="l0-bar-cell">
                  <span className="l0-bar" style={{ width: `${Math.max((l0 / longest) * 100, 0.6)}%` }} />
                  <span className="l0-value">
                    {l0.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    <small>{((l0 / setting.pixels) * 100).toFixed(2)}%</small>
                  </span>
                </td>
                <td data-failed={asr < 100 || undefined}>{asr}</td>
                <td>{l1.toFixed(2)}</td>
                <td>{l2.toFixed(2)}</td>
                <td>{linf.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
