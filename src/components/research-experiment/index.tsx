'use client';

import { useId, useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { Tabs as CossTabs, TabsList, TabsTab, TabsPanel } from '@/components/ui/coss/tabs';
import { ArrowUpRight } from 'lucide-react';
import { TransitionPanel } from '@/components/ui/motion-primitives/transition-panel';
import { useLanguage } from '@/components/language';
import { asset } from '@/lib/paths';
import { injectionData, injectionSteps, type GuidanceStrategy } from './injection-data';
import styles from './study.module.css';

const scenes = [
  { id: 'street', en: 'City', zh: '街景' },
  { id: 'car', en: 'Car', zh: '跑车' },
  { id: 'guitar', en: 'Guitarist', zh: '吉他手' },
] as const;
const methods = [
  { id: 'tree', name: 'Tree-Ring' },
  { id: 'robin', name: 'ROBIN' },
  { id: 'tide', name: 'TIDE' },
] as const;

/** Figure 2 samples, kept at a size appropriate to their source resolution. */
export function TideStudyBanner({ compact = false }: { compact?: boolean }) {
  const [scene, setScene] = useState<string>('street');
  const [method, setMethod] = useState<string>('tide');
  const { language } = useLanguage();
  const zh = language === 'zh';
  const reduced = useReducedMotion();
  const id = useId();
  const currentScene = scenes.find(item => item.id === scene)!;

  return (
    <LayoutGroup id={id}>
      <figure className={styles.banner} data-compact={compact || undefined}>
        <Tabs.Root value={method} onValueChange={setMethod}>
          <div className={styles.bannerToolbar}>
            <span className={styles.figureLabel}>{zh ? '生成图像对照' : 'Generated image comparison'}</span>
            <Tabs.List className={styles.methodTabs} aria-label={zh ? '水印方法' : 'Watermark method'}>
              {methods.map(item => (
                <Tabs.Trigger key={item.id} value={item.id}>
                  {method === item.id && <motion.span className={styles.selectedMethod} layoutId="method" transition={{ duration: reduced ? 0 : .26, ease: [.22, 1, .36, 1] }} />}
                  <span>{item.name}</span>
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </div>
          <div className={styles.imagePair}>
            <div className={styles.sample}>
              <div className={styles.sampleImages}>
                {scenes.map(item => (
                  <motion.img key={item.id} src={asset(`/images/tide-paper/clean-${item.id}.webp`)} width={226} height={226}
                    alt={item.id === scene ? `${zh ? '无水印' : 'Unwatermarked'} · ${zh ? currentScene.zh : currentScene.en}` : ''}
                    aria-hidden={item.id !== scene} initial={false}
                    animate={{ opacity: item.id === scene ? 1 : 0 }} transition={{ duration: reduced ? 0 : .24 }} />
                ))}
              </div>
              <span className={styles.sampleLabel}>{zh ? '无水印' : 'Unwatermarked'}<span>{zh ? '参照图像' : 'Reference image'}</span></span>
            </div>
            <div className={styles.sample}>
              <div className={styles.sampleImages}>
                {methods.map(item => (
                  <Tabs.Content key={item.id} value={item.id} forceMount className={styles.methodPanel} aria-hidden={method !== item.id} tabIndex={-1}>
                    {scenes.map(example => (
                      <motion.img key={example.id} src={asset(`/images/tide-paper/${item.id}-${example.id}.webp`)} width={226} height={226}
                        alt={method === item.id && scene === example.id ? `${item.name} · ${zh ? currentScene.zh : currentScene.en}` : ''}
                        aria-hidden={method !== item.id || scene !== example.id} initial={false}
                        animate={{ opacity: method === item.id && scene === example.id ? 1 : 0 }} transition={{ duration: reduced ? 0 : .24 }} />
                    ))}
                  </Tabs.Content>
                ))}
              </div>
              <span className={styles.sampleLabel}>{methods.find(item => item.id === method)!.name}<span>{zh ? '水印图像' : 'Watermarked image'}</span></span>
            </div>
          </div>
        </Tabs.Root>
        <div className={styles.bannerBottom}>
          <div className={styles.scenePicker} role="group" aria-label={zh ? '选择图像' : 'Choose an image'}>
            {scenes.map(item => (
              <button key={item.id} type="button" aria-pressed={scene === item.id} onClick={() => setScene(item.id)}>
                <img src={asset(`/images/tide-paper/clean-${item.id}.webp`)} width={26} height={26} alt="" />
                <span>{zh ? item.zh : item.en}</span>
              </button>
            ))}
          </div>
          {!compact && <a className={styles.fullFigure} href={asset('/images/tide-results-original.webp')} target="_blank" rel="noreferrer">{zh ? '完整图像' : 'Full figure'}<ArrowUpRight size={13} /></a>}
        </div>
        {!compact && <figcaption className={styles.caption}>Qualitative comparison of different methods.</figcaption>}
      </figure>
    </LayoutGroup>
  );
}

const strategies: { id: GuidanceStrategy; en: string; zh: string }[] = [
  { id: 'none', en: 'No guidance', zh: '无水印引导' },
  { id: 'fixed', en: 'Fixed budget', zh: '固定预算' },
  { id: 'adaptive', en: 'TIDE', zh: 'TIDE' },
];
const attacks = [
  { en: 'Blur', zh: '模糊' }, { en: 'Noise', zh: '噪声' }, { en: 'JPEG', zh: 'JPEG' },
  { en: 'Rotation', zh: '旋转' }, { en: 'Crop', zh: '裁剪' },
];
const observations = [
  { en: 'An early injection leaves 45 denoising steps. TIDE reaches 92.6% mean detection, but changes the reference image more: PSNR is 18.92 dB.', zh: '早期注入后还有 45 步去噪。TIDE 的平均检出率为 92.6%，但与原图的偏离较大：PSNR 为 18.92 dB。' },
  { en: 'Moving the injection later improves both outcomes for TIDE: mean detection rises to 94.7%, and PSNR reaches 20.31 dB.', zh: '注入点后移后，TIDE 的两项指标同时改善：平均检出率达到 94.7%，PSNR 升至 20.31 dB。' },
  { en: 'At step 25, TIDE and no guidance reach the same mean detection rate. Adaptive guidance preserves more of the reference image: 23.19 versus 22.02 dB.', zh: '第 25 步，TIDE 与无水印引导的平均检出率相同；自适应引导更好地保留原图，PSNR 为 23.19 dB，无引导为 22.02 dB。' },
  { en: 'At the training step, adaptive guidance is strongest on both mean detection and PSNR. A fixed budget is particularly weak under rotation: 59.7% versus TIDE’s 96.4%.', zh: '在训练时采用的第 35 步，自适应引导同时获得最高的平均检出率和 PSNR。固定预算尤其容易受到旋转影响：检出率为 59.7%，TIDE 为 96.4%。' },
  { en: 'Only five denoising steps remain. Image fidelity stays high, but blur and rotation sharply reduce detection for all three strategies.', zh: '此时只剩五步去噪。图像保真度仍然较高，但在模糊和旋转下，三种策略的检出率都明显下降。' },
];

/** A linked view of the measured cross-step ablation, not a simulated sampler. */
export function InjectionStudy() {
  const [value, setValue] = useState('35');
  const step = Number(value) as typeof injectionSteps[number];
  const index = injectionSteps.indexOf(step);
  const { language } = useLanguage();
  const zh = language === 'zh';
  const reduced = useReducedMotion();
  const id = useId();
  const transition = { duration: reduced ? 0 : .46, ease: [.22, 1, .36, 1] as [number, number, number, number] };

  return (
    <LayoutGroup id={id}>
      <figure className={styles.injectionStudy}>
        <CossTabs value={value} onValueChange={setValue}>
          <div className={styles.trendHeading}>
            <h3>{zh ? '注入时刻与检出率' : 'Detection by injection step'}</h3>
            <span>{zh ? '平均 TPR @ 1% FPR' : 'Mean TPR @ 1% FPR'}</span>
          </div>
          <div className={styles.trend} role="img" aria-label={zh
            ? '自适应引导在第 35 步检出率最高。第 45 步注入时，三种引导方式的检出率均下降。'
            : 'Adaptive guidance peaks at step 35. Detection falls for all three strategies at step 45.'}>
            <div className={styles.trendTicks} aria-hidden="true"><span>100%</span><span>75%</span><span>50%</span></div>
            <svg viewBox="0 0 50 50" preserveAspectRatio="none" aria-hidden="true">
              <path className={styles.trendGrid} d="M0 0H50M0 25H50M0 50H50" vectorEffect="non-scaling-stroke" />
              <motion.line className={styles.trendCursor} initial={false} animate={{ x1: step, x2: step }} y1={0} y2={50}
                vectorEffect="non-scaling-stroke" transition={transition} />
              {strategies.map(strategy => (
                <polyline className={styles.trendSeries} key={strategy.id} data-strategy={strategy.id}
                  points={injectionSteps.map((sample, i) => `${sample},${100 - injectionData[strategy.id][i].tpr[5] * 100}`).join(' ')}
                  vectorEffect="non-scaling-stroke" />
              ))}
            </svg>
          </div>
          <TabsList className={styles.stepTabs} aria-label={zh ? '水印注入步数' : 'Watermark injection step'}>
            {injectionSteps.map(step => (
              <TabsTab key={step} value={String(step)}>
                <span>{zh ? `第 ${step} 步` : `Step ${step}`}</span>
              </TabsTab>
            ))}
          </TabsList>
          {injectionSteps.map(step => <TabsPanel key={step} value={String(step)} className={styles.srOnly}>{zh ? `当前在第 ${step} 步注入水印` : `Watermark injected at step ${step}`}</TabsPanel>)}
        </CossTabs>
        <div className={styles.legend}>{strategies.map(strategy => <span key={strategy.id} data-strategy={strategy.id}><i />{zh ? strategy.zh : strategy.en}</span>)}</div>

        <div className={styles.studyPlots}>
          <div className={styles.robustness}>
            <div className={styles.plotHeading}><strong>{zh ? '经过图像变换后的检出率' : 'Detection after image transformations'}</strong><span>TPR @ 1% FPR</span></div>
            <div className={styles.axis}><span>0</span><span>50%</span><span>100%</span></div>
            {attacks.map((attack, column) => (
              <div className={styles.attackRow} key={attack.en}>
                <span className={styles.attackName}>{zh ? attack.zh : attack.en}</span>
                <div className={styles.attackBars}>
                  {strategies.map(strategy => {
                    const result = injectionData[strategy.id][index].tpr[column];
                    return <div key={strategy.id} className={styles.barTrack} data-strategy={strategy.id}>
                      <motion.span className={styles.bar} initial={false} animate={{ width: `${result * 100}%` }} transition={transition} />
                      <span className={styles.barValue}>{(result * 100).toFixed(1)}%</span>
                      <span className={styles.srOnly}>{zh ? strategy.zh : strategy.en}</span>
                    </div>;
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.studySummary}>
            <table className={styles.metrics}>
              <caption>{zh ? '检测与保真度' : 'Detection & fidelity'}</caption>
              <thead><tr><th scope="col">{zh ? '引导方式' : 'Guidance'}</th><th scope="col">{zh ? '平均 TPR' : 'Mean TPR'}</th><th scope="col">PSNR</th></tr></thead>
              <tbody>{strategies.map(strategy => {
                const result = injectionData[strategy.id][index];
                return <tr key={strategy.id} data-strategy={strategy.id}><th scope="row">{zh ? strategy.zh : strategy.en}</th><td>{(result.tpr[5] * 100).toFixed(1)}<small>%</small></td><td>{result.psnr.toFixed(2)}<small> dB</small></td></tr>;
              })}</tbody>
            </table>
            <span className={styles.srOnly} aria-live="polite">{zh ? observations[index].zh : observations[index].en}</span>
            <TransitionPanel activeIndex={index} transition={{ duration: reduced ? 0 : .22, ease: 'easeOut' }}
              aria-hidden="true"
              variants={{ enter: { opacity: 0, y: reduced ? 0 : 4 }, center: { opacity: 1, y: 0 }, exit: { opacity: 0 } }}>
              {observations.map(observation => (
                <p key={observation.en} className={styles.observation}>{zh ? observation.zh : observation.en}</p>
              ))}
            </TransitionPanel>
          </div>
        </div>
        <figcaption className={styles.caption}>{zh ? '水印与辅助条件在第 35 步训练，再直接迁移到其他注入时刻。平均 TPR 为以上五种图像变换的均值。' : 'The watermark and auxiliary condition are trained at step 35 and transferred without retraining. Mean TPR averages the five transformations shown.'}</figcaption>
      </figure>
    </LayoutGroup>
  );
}
