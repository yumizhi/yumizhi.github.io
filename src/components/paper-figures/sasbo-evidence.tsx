import { asset } from '@/lib/paths';
import { Localized } from '../language';
import './evidence-figure.css';
import './sasbo-evidence.css';

const path = '/images/research-motion/sasbo-';
const examples = [
  { image: 'clean', en: 'Original', zh: '原图', alt: 'Unperturbed dog image from the paper' },
  { image: 'attack', en: 'With SASBO', zh: '施加 SASBO 扰动', alt: 'SASBO example of the same dog image' },
  { image: 'map', en: 'Perturbation map', zh: '扰动位置', alt: 'Colored points on black show changed channels in the paper figure' },
];

export function SasboEvidence({ original }: { original: string }) {
  return <figure className="paper-evidence-figure">
    <div className="sasbo-evidence-plates">
      {examples.map(({ image, en, zh, alt }) => (
        <div key={image}>
          <h3><Localized en={en} zh={zh} /></h3>
          <img src={asset(path + image + '.webp')} alt={alt} width={468} height={468} />
        </div>
      ))}
    </div>
    <figcaption>
      <Localized en="Example from Figure 1. Colored points mark the RGB channels that change." zh="论文图 1 的狗图示例。右图的彩色点标出发生变化的颜色通道。" />{' '}
      <a href={asset(original)} target="_blank" rel="noreferrer"><Localized en="Complete figure" zh="完整原图" /></a>
    </figcaption>
  </figure>;
}
