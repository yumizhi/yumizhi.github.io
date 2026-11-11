'use client';

import { useState } from 'react';
import { Localized } from '@/components/language';

const sources = ['VGG19', 'VGG16', 'ResNet101', 'ResNet152', 'DenseNet201', 'DenseNet169'];
const targets = ['ResNeXt50 32×4d', 'ResNet50', 'DenseNet161', 'GoogLeNet', 'MobileNetV2', 'MnasNet1.0'];

/** Table VI of the paper: attack success rate (%) on CIFAR-10, non-targeted. Columns follow Table I. */
const settings = [
  {
    id: '50', en: '50 pixels · ε = 255', zh: '50 像素 · ε = 255',
    sa: [91.8, 81.6, 71.4, 74.7, 75.2, 79.3, 67.2, 64.3, 68.2, 73.8, 67.3, 69.8],
    sam: [89.9, 87.7, 90.0, 92.8, 93.6, 93.3, 88.5, 88.1, 91.5, 86.6, 79.4, 78.8],
  },
  {
    id: '300', en: '300 pixels · ε = 16', zh: '300 像素 · ε = 16',
    sa: [80.6, 30.6, 26.2, 18.8, 15.4, 25.8, 31.3, 23.2, 25.8, 20.8, 24.4, 28.2],
    sam: [66.4, 63.4, 58.5, 62.3, 61.0, 63.7, 43.9, 50.8, 48.5, 45.8, 43.3, 57.0],
  },
];

const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;

function Row({ name, sa, sam, isMean }: { name: React.ReactNode; sa: number; sam: number; isMean?: boolean }) {
  return (
    <div className="transfer-row" data-mean={isMean || undefined}>
      <span>{name}</span>
      <div className="transfer-bars">
        <div className="transfer-bar"><i style={{ width: `${sa * 0.8}%` }} />{sa.toFixed(1)}</div>
        <div className="transfer-bar" data-ours><i style={{ width: `${sam * 0.8}%` }} />{sam.toFixed(1)}</div>
      </div>
    </div>
  );
}

/** Success rate with and without the meta-learning stages, on source models and on unseen targets. */
export function TransferChart() {
  const [id, setId] = useState(settings[0].id);
  const setting = settings.find(item => item.id === id)!;

  return (
    <div className="transfer-chart">
      <div className="l0-controls">
        <div className="segmented" role="tablist" aria-label="Attack budget">
          {settings.map(item => (
            <button key={item.id} type="button" role="tab" aria-selected={item.id === id} onClick={() => setId(item.id)}>
              <Localized en={item.en} zh={item.zh} />
            </button>
          ))}
        </div>
        <p className="transfer-legend">
          <span><i /><Localized en="SA: VGG19 only, no meta-learning" zh="SA：仅用 VGG19，无元学习" /></span>
          <span data-ours><i />SAM</span>
        </p>
      </div>
      <p className="label"><Localized en="Source models (white-box)" zh="源模型（白盒）" /></p>
      {sources.map((name, index) => <Row key={name} name={name} sa={setting.sa[index]} sam={setting.sam[index]} />)}
      <p className="label transfer-group"><Localized en="Unseen targets (black-box)" zh="未见目标模型（黑盒）" /></p>
      {targets.map((name, index) => <Row key={name} name={name} sa={setting.sa[index + 6]} sam={setting.sam[index + 6]} />)}
      <Row isMean name={<Localized en="Black-box mean" zh="黑盒平均" />} sa={mean(setting.sa.slice(6))} sam={mean(setting.sam.slice(6))} />
    </div>
  );
}
