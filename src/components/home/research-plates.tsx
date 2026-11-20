'use client';

import { useState } from 'react';
import { ArrowLeftRight, Layers2 } from 'lucide-react';
import { ReactCompareSliderCssVars } from 'react-compare-slider/consts';
import { HandleRoot, Item, Provider, Root } from 'react-compare-slider/components';
import { useReactCompareSlider } from 'react-compare-slider/hooks';
import { Button } from '@/components/ui/coss/button';
import { Localized, useLanguage } from '@/components/language';
import { asset } from '@/lib/paths';
import './home-previews.css';

export function SasboPlate() {
  const { language } = useLanguage();
  const flower = asset('/images/research-motion/sasbo-flower-attack.webp');
  const map = asset('/images/research-motion/sasbo-flower-map.webp');
  const comparison = useReactCompareSlider({ defaultPosition: 64, boundsPadding: '20px',
    onlyHandleDraggable: true, keyboardIncrement: '6%', transition: '' });
  return (
    <div className="ph-preview ph-preview--sasbo">
      <Provider {...comparison}>
        <Root className="ph-sasbo-slider" style={{ overflow: 'clip' }}>
          <Item item="itemOne">
            <div className="ph-compare-image">
              <img src={flower} width={139} height={139}
                alt={language === 'zh' ? 'SASBO 论文中的花朵对抗样本' : 'Adversarial flower sample from the SASBO paper'} />
            </div>
          </Item>
          <Item item="itemTwo">
            <div className="ph-compare-image ph-compare-image--map">
              <img src={flower} width={139} height={139} alt="" aria-hidden="true" />
              <img src={map} width={139} height={139}
                alt={language === 'zh' ? '亮点表示改动过的颜色通道' : 'Colored points mark altered color channels'} />
            </div>
          </Item>
          <HandleRoot className="ph-compare-divider"
            style={{
              justifyContent: 'center',
              left: `var(${ReactCompareSliderCssVars.currentPosition})`,
              translate: '-50% 0',
              width: '2.75rem',
              pointerEvents: 'auto',
            }}
            aria-label={language === 'zh' ? '拖动对比样本与像素扰动图' : 'Drag to compare the image and pixel map'}>
            <span className="ph-compare-handle" aria-hidden="true"><ArrowLeftRight size={16} /></span>
          </HandleRoot>
        </Root>
      </Provider>
      <span className="ph-compare-tag ph-compare-tag--image" aria-hidden="true"><Localized en="Image" zh="样本" /></span>
      <span className="ph-compare-tag ph-compare-tag--map" aria-hidden="true"><Localized en="Pixel map" zh="扰动图" /></span>
    </div>
  );
}

export function EpubPlate() {
  const [merged, setMerged] = useState(false);
  const [started, setStarted] = useState(false);
  return (
    <div className="ph-preview ph-preview--epub">
      <div className="ph-books" data-merged={merged} data-started={started} aria-hidden="true">
        <span className="ph-book ph-book--a">A</span>
        <span className="ph-book ph-book--b">B</span>
        <span className="ph-loose-page ph-loose-page--a" />
        <span className="ph-loose-page ph-loose-page--b" />
        <span className="ph-book ph-book--collection">A+B</span>
      </div>
      <Button className="ph-book-toggle" variant="secondary" size="sm" onClick={() => { setStarted(true); setMerged(value => !value); }}>
        <Layers2 size={15} aria-hidden="true" />
        {merged ? <Localized en="Split volumes" zh="拆回原卷" /> : <Localized en="Merge volumes" zh="合并分卷" />}
      </Button>
    </div>
  );
}
