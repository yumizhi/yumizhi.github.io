'use client';

import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { asset } from '@/lib/paths';
import type { Paper } from '@/lib/content';
import { Localized, useLanguage } from '../language';
import { GlassChoice } from '../ui/cupertino/choice';

const methods = [{ value: 'tree', label: 'Tree-Ring' }, { value: 'robin', label: 'ROBIN' }, { value: 'tide', label: 'TIDE' }];
const scenes = [
  { id: 'car', en: 'Sports car', zh: '跑车' }, { id: 'interior', en: 'Interior', zh: '室内' },
  { id: 'guitar', en: 'Guitarist', zh: '吉他手' }, { id: 'street', en: 'Street', zh: '街景' }, { id: 'robot', en: 'Robot', zh: '机器人' },
];
const sample = (method: string, scene: string) => asset(`/images/tide-paper/${method}-${scene}.webp`);

export function TideComparison({ original, caption }: { original: string; caption: Paper['imageCaption'] }) {
  const [scene, setScene] = useState(scenes[0]);
  const [method, setMethod] = useState('tree');
  const frame = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { language } = useLanguage();
  return (
    <figure id="image-comparison" className="tide-comparison" aria-label={language === 'zh' ? '图像对照' : 'Image comparison'}>
      <div className="tide-pair">
        <div className="tide-sample">
          <img width={226} height={226} src={sample('clean', scene.id)} alt={`Unwatermarked · ${scene.en}`} />
          <span className="tide-reference"><Localized en="Unwatermarked" zh="无水印" /></span>
        </div>
        <div ref={frame} className="tide-sample tide-versions">
          {methods.map(item => (
            <motion.img key={item.value} className="tide-version" width={226} height={226} src={sample(item.value, scene.id)}
              initial={false} animate={{ opacity: item.value === method ? 1 : 0 }} transition={{ duration: reduced ? 0 : .22 }}
              aria-hidden={item.value !== method} alt={item.value === method ? `${item.label} · ${scene.en}` : ''} />
          ))}
          <div className="tide-lens"><GlassChoice scene={{ src: sample(method, scene.id), frame }} label={language === 'zh' ? '水印方法' : 'Watermark method'} items={methods} value={method} onChange={setMethod} /></div>
        </div>
      </div>
      <div className="tide-scene-picker" role="group" aria-label={language === 'zh' ? '选择场景' : 'Image prompt'}>
        {scenes.map(item => <button key={item.id} type="button" aria-pressed={item.id === scene.id}
          aria-label={item[language]} title={item[language]} onClick={() => setScene(item)}>
          <img src={sample('clean', item.id)} alt="" width={32} height={32} />
        </button>)}
      </div>
      <figcaption className="tide-figure-note">
        <span><strong><Localized en="Figure 2." zh="图 2。" /></strong>{' '}<Localized {...caption} /></span>
        <a href={asset(original)} target="_blank" rel="noreferrer"><Localized en="Full figure" zh="完整原图" /><ArrowUpRight size={14} /></a>
      </figcaption>
    </figure>
  );
}
