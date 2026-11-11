import { M } from '@/components/article';
import { Localized } from '@/components/language';
import { asset } from '@/lib/paths';
import { quality, runtime, unwatermarked, verification } from './data';

const family = {
  post: { en: 'Post-processing', zh: '后处理' },
  in: { en: 'In-generation', zh: '生成过程中' },
  ours: { en: 'In-generation', zh: '生成过程中' },
};

/** Table 1 as bars: TPR@1%FPR averaged over the seven attacks, with the no-attack value as a tick. */
export function RobustnessChart() {
  return (
    <table className="rank-chart">
      <caption className="sr-only">Verification TPR at 1% FPR, without attacks and averaged over seven attacks</caption>
      <thead>
        <tr>
          <th scope="col"><Localized en="Method" zh="方法" /></th>
          <th scope="col"><Localized en="TPR@1%FPR under attack (tick: no attack)" zh="攻击下的 TPR@1%FPR（刻线：无攻击）" /></th>
          <th scope="col">AUC</th>
        </tr>
      </thead>
      <tbody>
        {verification.map(row => (
          <tr key={row.method} data-family={row.family}>
            <th scope="row">
              {row.method}
              <small><Localized en={family[row.family].en} zh={family[row.family].zh} /></small>
            </th>
            <td>
              <div className="rank-track">
                <span className="rank-bar" style={{ width: `${row.attacked[1] * 100}%` }} aria-hidden="true" />
                <span className="rank-tick" style={{ left: `${row.clean[1] * 100}%` }} title={`No attack: ${row.clean[1].toFixed(3)}`} aria-hidden="true" />
                <span className="rank-value" style={{ left: `${row.attacked[1] * 100}%` }}>{row.attacked[1].toFixed(3)}</span>
                <span className="sr-only"> (no attack {row.clean[1].toFixed(3)})</span>
              </div>
            </td>
            <td>{row.attacked[0].toFixed(3)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const qualityColumns = [
  ['psnr', 'PSNR ↑', 2], ['ssim', 'SSIM ↑', 3], ['msssim', 'MS-SSIM ↑', 3], ['clip', 'CLIP-S ↑', 3],
  ['lpips', 'LPIPS ↓', 3], ['fid', 'FID ↓', 2], ['fidRef', 'FID† ↓', 2],
] as const;

/** Table 2. */
export function QualityTable() {
  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col"><Localized en="Method" zh="方法" /></th>
            {qualityColumns.map(([key, label]) => <th key={key} scope="col">{label}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row"><Localized en="No watermark" zh="无水印" /></th>
            <td>∞</td><td>1.000</td><td>1.000</td><td>{unwatermarked.clip.toFixed(3)}</td><td>0</td><td>{unwatermarked.fid.toFixed(2)}</td><td>0</td>
          </tr>
          {quality.map(row => (
            <tr key={row.method} data-highlight={row.method === 'TIDE' || undefined}>
              <th scope="row">{row.method}</th>
              {qualityColumns.map(([key, , digits]) => <td key={key}>{row[key].toFixed(digits)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Table 5. */
export function RuntimeTable() {
  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col"><Localized en="Method" zh="方法" /></th>
            <th scope="col"><Localized en="Generation (s / image)" zh="生成（秒 / 张）" /></th>
            <th scope="col"><Localized en="Verification (s / query)" zh="验证（秒 / 次）" /></th>
          </tr>
        </thead>
        <tbody>
          {runtime.map(row => (
            <tr key={row.method} data-highlight={row.method === 'TIDE' || undefined}>
              <th scope="row">{row.method}</th>
              <td>{row.generate.toFixed(4)}</td>
              <td>{row.verify.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const subjects = ['car', 'guitar', 'interior', 'robot', 'street'] as const;
const rows = [
  { id: 'clean', en: 'No watermark', zh: '无水印' },
  { id: 'tree', en: 'Tree-Ring', zh: 'Tree-Ring' },
  { id: 'robin', en: 'ROBIN', zh: 'ROBIN' },
  { id: 'tide', en: 'TIDE', zh: 'TIDE' },
] as const;

/** The qualitative comparison of the paper, as the original image crops. */
export function QualitativeGrid() {
  return (
    <div className="qualitative" role="group" aria-label="Images generated from the same prompts and seeds by four methods">
      {rows.map(row => (
        <div className="qualitative-row" key={row.id} data-method={row.id}>
          <p className="qualitative-label"><Localized en={row.en} zh={row.zh} /></p>
          {subjects.map(subject => (
            <img
              key={subject}
              src={asset(`/images/tide-paper/${row.id}-${subject}.webp`)}
              width={226}
              height={226}
              loading="lazy"
              alt={`${row.en}: ${subject} prompt`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Real spectra of the latent before and after the watermark is written (one channel, recorded run). */
export function SpectrumPair() {
  const items = [
    { src: '/media/tide/sampling/frequency-before.webp', en: 'Spectrum of the latent at step 35', zh: '第 35 步潜变量的频谱', tex: '\\mathcal{F}(z_\\tau)' },
    { src: '/media/tide/sampling/tide-spectrum-watermark.png', en: 'Learned watermark on the ring mask', zh: '环形掩码上的可学习水印', tex: 'M \\odot W' },
    { src: '/media/tide/sampling/frequency-marked.webp', en: 'Spectrum after the write', zh: '写入后的频谱', tex: '\\mathcal{F}(\\tilde z_\\tau)' },
  ];
  return (
    <div className="spectrum">
      {items.map((item, index) => (
        <div className="spectrum-item" key={item.src}>
          <img src={asset(item.src)} width={216} height={216} loading="lazy" alt={item.en} />
          <p><span className="spectrum-symbol"><M tex={item.tex} /></span><Localized en={item.en} zh={item.zh} /></p>
          {index < 2 && <span className="spectrum-operator" aria-hidden="true">{index === 0 ? '+' : '='}</span>}
        </div>
      ))}
    </div>
  );
}
