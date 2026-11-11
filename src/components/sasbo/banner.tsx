'use client';

import { useEffect, useState } from 'react';
import { Localized } from '@/components/language';
import { asset } from '@/lib/paths';

const image = (name: string) => asset(`/images/research-motion/sasbo-${name}.webp`);

/** The example from Figure 1 of the paper as a blink comparator: clean image, adversarial image, and the pixels that differ. */
export function SasboBanner() {
  const [blinking, setBlinking] = useState(false);
  const [showClean, setShowClean] = useState(false);

  useEffect(() => {
    if (!blinking) return;
    const timer = window.setInterval(() => setShowClean(value => !value), 650);
    return () => { window.clearInterval(timer); setShowClean(false); };
  }, [blinking]);

  return (
    <figure className="sasbo-banner">
      <div className="sasbo-panels">
        <div className="sasbo-panel">
          <img src={image('clean')} width={468} height={468} alt="Photograph of a dog, unmodified." />
          <span className="label"><Localized en="Clean" zh="原图" /></span>
        </div>
        <div className="sasbo-panel">
          <img src={image('attack')} width={468} height={468} alt="The same photograph after the sparse attack; it looks identical." />
          <img className="sasbo-blink" data-visible={showClean || undefined} src={image('clean')} width={468} height={468} alt="" aria-hidden="true" />
          <span className="label" aria-live="off">
            {showClean ? <Localized en="Clean" zh="原图" /> : <Localized en="Adversarial" zh="对抗样本" />}
          </span>
        </div>
        <div className="sasbo-panel" data-map>
          <img src={image('map')} width={468} height={468} alt="A black square with scattered single-coloured dots marking the perturbed pixels." />
          <span className="label"><Localized en="Perturbed coordinates" zh="被扰动的坐标" /></span>
        </div>
      </div>
      <figcaption>
        <p>
          <Localized
            en="The dog example from Figure 1 of the paper (non-targeted attack, ε = 10). The first two images are classified differently. The third shows where they differ: black means untouched, and a red, green or blue dot means one colour channel of that pixel changed."
            zh="论文图 1 中的示例（非定向攻击，ε = 10）。前两幅图像被分类器判为不同类别。第三幅标出两者的差异位置：黑色表示未改动，红、绿、蓝点表示该像素的一个颜色通道被修改。"
          />
        </p>
        <button className="pill" type="button" aria-pressed={blinking} onClick={() => setBlinking(value => !value)}>
          {blinking ? <Localized en="Stop blinking" zh="停止切换" /> : <Localized en="Blink clean ↔ adversarial" zh="交替显示原图与对抗样本" />}
        </button>
      </figcaption>
    </figure>
  );
}
