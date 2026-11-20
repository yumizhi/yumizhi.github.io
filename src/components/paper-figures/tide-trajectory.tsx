'use client';

import { useId } from 'react';
import { motion, useTransform, type MotionValue } from 'motion/react';
import { Localized, useLanguage } from '../language';
import { FigurePlayer } from './figure-player';
import './tide-trajectory.css';

const chapters = [
  {
    label: { en: 'Denoise', zh: '共同去噪' },
    description: { en: 'Both runs share the same prompt and noise before the watermark is written. The contours indicate a region of similar outcomes in this sketch.', zh: '两条轨迹从相同的提示词和噪声出发，写入之前走的是同一段去噪路径。等高线示意生成结果相近的区域。' },
  },
  {
    label: { en: 'Write', zh: '写入' },
    description: { en: 'Replacing selected Fourier coefficients shifts the current latent. The watermarked run begins its remaining steps from the displaced point.', zh: '替换选定的频域系数会使当前潜变量发生变化。带水印的采样从偏移后的位置继续。' },
  },
  {
    label: { en: 'Separate', zh: '分解方向' },
    description: { en: 'Recent text residuals define a local subspace. Projecting the watermark residual separates the part that overlaps with text guidance from the complementary part.', zh: '最近几步的文本残差张成局部子空间。投影把水印残差分成与文本引导重合的分量和互补分量。' },
  },
  {
    label: { en: 'Guide', zh: '调整引导' },
    description: { en: 'TIDE uses the complementary residual and adapts its strength as the path evolves. The watermark can persist while the output stays closer to the unwatermarked reference.', zh: 'TIDE 保留互补分量，并随轨迹变化调整强度。这样可以让水印延续，同时使成图更接近无水印参考。' },
  },
];

const common = 'M49 161 C105 174 132 92 212 107';
const reference = 'M212 107 C265 110 284 64 329 64 S386 78 422 52';
const uncontrolled = 'M214 155 C273 159 286 131 327 150 S388 174 430 154';
const guided = 'M214 155 C270 153 286 104 326 95 S389 102 422 75';

const contours = Array.from({ length: 13 }, (_, index) => {
  const radius = 14 + index * 12.5;
  const coordinates = Array.from({ length: 78 }, (_, point) => {
    const theta = point * 2 * Math.PI / 78;
    const ripple = 1 + .12 * Math.sin(3 * theta + index * .12) + .045 * Math.cos(6 * theta);
    const x = 417 - index * 2.3 + Math.cos(theta) * radius * 1.47 * ripple;
    const y = 57 + index * 2.8 - Math.cos(theta) * radius * .33 + Math.sin(theta) * radius * .62 * ripple;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return 'M' + coordinates.join('L') + 'Z';
});

const noise = Array.from({ length: 30 }, (_, i) => ({
  x: 49 + Math.sin(i * 3.38) * (8 + i % 11),
  y: 161 + Math.cos(i * 4.67) * (10 + i % 17),
  radius: i % 4 === 0 ? 1.65 : 1,
}));

function Legend({ tone, label }: { tone: string; label: { en: string; zh: string } }) {
  return <span><i className={tone} /><Localized {...label} /></span>;
}

function TrajectoryScene({ step, reduced, position }: { step: number; reduced: boolean; position: MotionValue<number> }) {
  const uid = useId();
  const zh = useLanguage().language === 'zh';
  const draw = { duration: reduced ? 0 : .85, ease: 'easeInOut' as const };
  const reveal = { duration: reduced ? 0 : .32 };
  const marker = `url(#${uid}-arrow)`;
  const commonLength = useTransform(position, [0, .81], [.025, 1]);
  const noiseScale = useTransform(position, [0, .82], [1.18, .27]);
  const noiseOpacity = useTransform(position, [0, .45, .83], [.75, .5, .08]);
  const noiseX = useTransform(position, [0, .36, .83], [0, 66, 162]);
  const noiseY = useTransform(position, [0, .36, .83], [0, -15, -54]);
  const writeLength = useTransform(position, [1.04, 1.41], [0, 1]);
  const driftLength = useTransform(position, [1.39, 1.82], [0, 1]);
  const guidedLength = useTransform(position, [3.02, 3.84], [0, 1]);
  const guidanceX = useTransform(position, [3.02, 3.19, 3.34, 3.5, 3.68, 3.84], [214, 252, 291, 326, 374, 422]);
  const guidanceY = useTransform(position, [3.02, 3.19, 3.34, 3.5, 3.68, 3.84], [155, 145, 117, 95, 94, 75]);
  return <div className="tide-trajectory">
    <div className="trajectory-field">
      <div className="figure-label"><Localized en="Denoising trajectories" zh="去噪轨迹" /></div>
      <svg viewBox="0 0 468 214" aria-hidden="true">
        <defs>
          <radialGradient id={`${uid}-field`} cx="86%" cy="26%" r="72%">
            <stop stopColor="var(--figure-line)" stopOpacity=".9" />
            <stop offset="1" stopColor="var(--figure-panel)" stopOpacity=".12" />
          </radialGradient>
          <marker id={`${uid}-arrow`} viewBox="0 0 8 8" refX="6.8" refY="4" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M1 1 7 4 1 7" fill="none" stroke="context-stroke" strokeWidth="1.3" />
          </marker>
        </defs>
        <rect width="468" height="214" fill={`url(#${uid}-field)`} />
        <motion.g fill="none" stroke="var(--figure-accent)" strokeWidth=".65" initial={false}
          animate={{ opacity: step === 0 ? .14 : .26, scale: step === 3 ? .91 : 1.03 }}
          style={{ transformOrigin: '411px 57px' }} transition={draw}>
          {contours.map(path => <path d={path} key={path} />)}
        </motion.g>
        <motion.g fill="var(--figure-accent)" style={{
          transformOrigin: '49px 161px', opacity: noiseOpacity, scale: noiseScale, x: noiseX, y: noiseY,
        }}>
          {noise.map(({ x, y, radius }) => <circle key={x} cx={x} cy={y} r={radius} />)}
        </motion.g>
        <path d={reference} className="trajectory-reference" />
        <motion.path d={common} className="trajectory-common" style={{ pathLength: commonLength }} />
        <motion.path d="M212 107 L214 155" className="trajectory-write" initial={false}
          animate={{ opacity: step >= 1 ? 1 : 0 }} transition={reveal} style={{ pathLength: writeLength }}
          markerEnd={marker} />
        <motion.path d={uncontrolled} className="trajectory-uncontrolled" initial={false}
          animate={{ opacity: step >= 1 ? .9 : 0 }} transition={reveal} style={{ pathLength: driftLength }} />
        <motion.path d={guided} className="trajectory-guided" initial={false}
          animate={{ opacity: step === 3 ? 1 : 0 }} transition={reveal} style={{ pathLength: guidedLength }} />
        <circle cx="49" cy="161" r="3" fill="var(--figure-muted)" />
        <circle cx="212" cy="107" r="4" fill="var(--figure-ink)" />
        <motion.circle cx="214" cy="155" r="4.6" fill="var(--figure-accent)" initial={false}
          animate={{ opacity: step >= 1 ? 1 : 0 }} transition={reveal} />
        <motion.g initial={false} animate={{ opacity: step === 3 ? 1 : 0 }} transition={reveal}>
          <motion.g style={{ x: guidanceX, y: guidanceY }}>
            <circle r="7.5" fill="var(--figure-panel)" />
            <circle r="4.6" fill="var(--figure-accent)" />
            <path d="M-13 15 L-5 5" className="trajectory-write" markerEnd={marker} />
          </motion.g>
        </motion.g>
        <g className="trajectory-plot-label">
          <text x="25" y="198">{zh ? '起始噪声' : 'Noise'}</text>
          <text x="431" y="39" textAnchor="end">{zh ? '参考终点' : 'Reference'}</text>
          <motion.text x="222" y="142" initial={false} animate={{ opacity: step === 1 ? 1 : 0 }} transition={reveal}>{zh ? '写入偏移' : 'Injection shift'}</motion.text>
        </g>
      </svg>
      <div className="trajectory-legend">
        <Legend tone="ref" label={{ en: 'Unwatermarked', zh: '无水印' }} />
        <Legend tone="drift" label={{ en: 'No trajectory control', zh: '无轨迹控制' }} />
        <Legend tone="guided" label={{ en: 'TIDE', zh: 'TIDE' }} />
      </div>
    </div>
    <div className="trajectory-detail">
      <div className="figure-label"><Localized en="Local guidance" zh="局部引导" /></div>
      <svg className="trajectory-vector" viewBox="0 0 224 170" aria-hidden="true">
        <motion.g initial={false} animate={{ opacity: step < 2 ? .38 : 1, rotate: step === 3 ? -9 : 0 }}
          style={{ transformOrigin: '41px 130px' }} transition={draw}>
          <path d="M16 118 L196 82 L206 119 L23 156Z" fill="var(--figure-blue)" opacity=".11" />
          <path d="M23 134 L199 99" className="trajectory-text-vector" markerEnd={marker} />
          <motion.g initial={false} animate={{ opacity: step === 3 ? .26 : 1 }} transition={reveal}>
            <path d="M41 130 L121 46" className="trajectory-raw-vector" markerEnd={marker} />
          </motion.g>
          <motion.g initial={false} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={reveal}>
            <path d="M41 130 L134 111 L121 46" className="trajectory-projection" />
            <path d="M121 46 L29 65" className="trajectory-projection" />
            <motion.path d="M41 130 L29 65" className="trajectory-kept-vector" markerEnd={marker}
              initial={false} animate={{ pathLength: step >= 2 ? 1 : 0, d: step === 3 ? 'M41 130 L33 86' : 'M41 130 L29 65' }} transition={draw} />
          </motion.g>
          <circle cx="41" cy="130" r="3.5" fill="var(--figure-ink)" />
        </motion.g>
      </svg>
      <div className="trajectory-legend trajectory-vector-legend">
        <Legend tone="text" label={{ en: 'Text subspace', zh: '文本子空间' }} />
        <Legend tone="drift" label={{ en: 'Watermark residual', zh: '水印残差' }} />
        <Legend tone="guided" label={{ en: 'Kept component', zh: '保留分量' }} />
      </div>
    </div>
  </div>;
}

export function TideTrajectory() {
  return <FigurePlayer id="trajectory-figure" title={{ en: 'A watermark changes the next step', zh: '写入水印之后的轨迹分岔' }} chapters={chapters}>
    {(step, reduced, position) => <TrajectoryScene step={step} reduced={reduced} position={position} />}
  </FigurePlayer>;
}
