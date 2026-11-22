import { ArrowRight } from 'lucide-react';
import { Localized } from '../language';
import './verification-path.css';

const runs = [
  { en: 'Generation', zh: '生成路径', stops: [
    {en:'Starting noise',zh:'起始噪声',symbol:'zₜ', checkpoint:false},
    {en:'Write the spectrum',zh:'写入频谱',symbol:'τ', checkpoint:true},
    {en:'Complete denoising',zh:'完成后续去噪',symbol:'x', checkpoint:false},
  ]},
  { en: 'Verification', zh: '验证路径', stops: [
    {en:'Encode the received image',zh:'编码收到的图像',symbol:'x′', checkpoint:false},
    {en:'Invert to the write step',zh:'反演至写入步',symbol:'τ', checkpoint:true},
    {en:'Compare the template',zh:'匹配水印模板',symbol:'d', checkpoint:false},
  ]},
];

export function TideVerificationPath() {
  return <figure className="tide-readback detail-text">
    {runs.map(run=><div className="readback-row" key={run.en}><strong><Localized en={run.en} zh={run.zh}/></strong>
      <ol>{run.stops.map((s,i)=><li key={s.en} data-checkpoint={s.checkpoint || undefined}>
        <i aria-hidden="true">{s.symbol}</i><span><Localized en={s.en} zh={s.zh}/></span>
        {i<2 && <ArrowRight aria-hidden="true" size={16}/>}</li>)}</ol>
    </div>)}
    <figcaption><Localized en="The two passes meet at τ. Sampling writes into a latent there. The verifier estimates a latent at the same step from the received image, then compares its spectrum with the learned template. The original prompt and the paired clean image are absent from the verification path." zh="两条路径在 τ 处对应。采样时在这一时刻写入潜变量；验证时从收到的图像估计同一步的潜变量，再将其频谱与模板匹配。验证过程只拿到待查图像，不需要原始提示词或配对的无水印成图。"/></figcaption>
  </figure>;
}
