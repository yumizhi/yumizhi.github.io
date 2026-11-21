'use client';

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from 'motion/react';
import { Pause, Play, SkipForward } from 'lucide-react';
import { MediaLenses } from '@/components/ui/cupertino/media-lenses';
import { FilterTabs } from '../filter-tabs';
import { Localized, useLanguage } from '../language';
import { Button } from '../ui/coss/button';

const stages = [
  { value: 'denoise', en: 'Denoise', zh: '去噪', time: .26 },
  { value: 'inject', en: 'Inject', zh: '注入', time: .45 },
  { value: 'guide', en: 'Guide', zh: '引导', time: 1 },
];
const branchStart = .45;
const reference = 'M169 104 C214 100 241 62 273 67 S321 72 344 58';
const guided = 'M177 131 C220 136 244 88 273 82 S321 90 344 74';
const drift = 'M177 131 C224 137 242 124 277 137 S320 145 351 131';
const contourCount = 13;
const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(callback: () => void) {
  const media = window.matchMedia(reducedMotionQuery);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}

const readReducedMotion = () => window.matchMedia(reducedMotionQuery).matches;
const readServerReducedMotion = () => false;

function contour(index: number) {
  const radius = 13 + index * 10;
  const points = Array.from({ length: 81 }, (_, i) => {
    const theta = (i / 80) * Math.PI * 2;
    const wave = 1 + .13 * Math.sin(3 * theta + index * .19) + .07 * Math.cos(4 * theta);
    const x = 334 - index * 4.6 + Math.cos(theta) * radius * 1.42 * wave;
    const y = 69 + index * 1.4 + Math.sin(theta) * radius * .61 * wave - Math.cos(theta) * radius * .31;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return `M${points.join(' L')}Z`;
}

const contours = Array.from({ length: contourCount }, (_, index) => contour(index));
const particles = Array.from({ length: 37 }, (_, i) => ({
  x: 42 + Math.sin(i * 5.13) * (9 + i % 14),
  y: 116 + Math.cos(i * 7.31) * (13 + i % 20),
  r: i % 4 === 0 ? 1.7 : .85,
  opacity: .23 + (i % 6) / 10,
}));

export function TidePlate() {
  const id = useId();
  const { language } = useLanguage();
  const reduced = useSyncExternalStore(subscribeReducedMotion, readReducedMotion, readServerReducedMotion);
  const progress = useMotionValue(1);
  const [stage, setStage] = useState('guide');
  const [playing, setPlaying] = useState(false);
  const playback = useRef<ReturnType<typeof animate> | null>(null);
  const preview = useRef<HTMLDivElement>(null);
  const guidedTrace = useRef<SVGPathElement>(null);
  const driftTrace = useRef<SVGPathElement>(null);
  const guidedMarker = useRef<SVGGElement>(null);
  const driftMarker = useRef<SVGCircleElement>(null);

  const commonLength = useTransform(progress, [0, .31], [.03, 1]);
  const injectionLength = useTransform(progress, [.32, branchStart], [0, 1]);
  const branchLength = useTransform(progress, [branchStart, 1], [0, 1]);
  const referenceLength = useTransform(progress, [branchStart, .91], [0, 1]);
  const particleX = useTransform(progress, [0, .31], [0, 126]);
  const particleScale = useTransform(progress, [0, .31], [1.2, .2]);
  const particleOpacity = useTransform(progress, [0, .21, .38, 1], [.9, .68, .08, .08]);
  const injectOpacity = useTransform(progress, [.32, .43], [0, 1]);
  const guideOpacity = useTransform(progress, [.48, .62], [0, 1]);
  const meshScale = useTransform(progress, [0, .42, 1], [1.2, 1.12, 1]);
  const meshOpacity = useTransform(progress, [0, .38, 1], [.38, .79, 1]);
  const endOpacity = useTransform(progress, [.87, 1], [0, 1]);

  useMotionValueEvent(progress, 'change', value => {
    if (playing) setStage(value < .32 ? 'denoise' : value <= branchStart ? 'inject' : 'guide');
    if (!guidedTrace.current || !driftTrace.current || !guidedMarker.current || !driftMarker.current) return;
    const fraction = Math.max(0, (value - branchStart) / (1 - branchStart));
    const guidedPoint = guidedTrace.current.getPointAtLength(guidedTrace.current.getTotalLength() * fraction);
    const driftPoint = driftTrace.current.getPointAtLength(driftTrace.current.getTotalLength() * fraction);
    guidedMarker.current.setAttribute('transform', `translate(${guidedPoint.x} ${guidedPoint.y})`);
    driftMarker.current.setAttribute('cx', String(driftPoint.x));
    driftMarker.current.setAttribute('cy', String(driftPoint.y));
  });

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        playback.current?.stop();
        setPlaying(false);
      }
    });
    if (preview.current) observer.observe(preview.current);
    return () => {
      observer.disconnect();
      playback.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (!reduced) return;
    playback.current?.stop();
    setPlaying(false);
  }, [reduced]);

  function selectStage(value: string) {
    const selected = stages.find(stage => stage.value === value);
    if (!selected) return;
    playback.current?.stop();
    setPlaying(false);
    setStage(value);
    if (reduced) progress.set(selected.time);
    else playback.current = animate(progress, selected.time, { type: 'spring', duration: .65, bounce: 0 });
  }

  function togglePlayback() {
    if (reduced) {
      selectStage(stages[(stages.findIndex(item => item.value === stage) + 1) % stages.length].value);
      return;
    }
    if (playing) {
      playback.current?.stop();
      setPlaying(false);
      return;
    }
    if (progress.get() === 1) {
      progress.set(0);
      setStage('denoise');
    }
    setPlaying(true);
    playback.current = animate(progress, 1, {
      duration: 6.3 * (1 - progress.get()),
      ease: 'linear',
      onComplete: () => setPlaying(false),
    });
  }

  return (
    <div ref={preview} className="ph-preview ph-preview--tide" data-stage={stage}>
      <MediaLenses />
      <svg data-lens-source="" className="ph-tide-map" viewBox="0 0 416 220" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
        <title id={`${id}-title`}>{language === 'zh' ? 'TIDE 去噪轨迹示意' : 'Illustration of the TIDE denoising trajectory'}</title>
        <desc id={`${id}-desc`}>{language === 'zh'
          ? '从噪声出发。写入水印时轨迹发生跳跃，后续引导帮助保留水印，同时让轨迹更接近无水印参考。'
          : 'Denoising starts at noise. The watermark shifts the path at injection. Subsequent guidance carries the watermark closer to the unwatermarked reference trajectory.'}</desc>
        <defs>
          <radialGradient id={`${id}-field`} cx="80%" cy="28%" r="77%">
            <stop stopColor="#d8c1e7" />
            <stop offset=".58" stopColor="#ede4f3" />
            <stop offset="1" stopColor="#f6f1f7" />
          </radialGradient>
          <linearGradient id={`${id}-mesh`} x2="1" y2=".8" gradientUnits="objectBoundingBox">
            <stop stopColor="#8e64a8" stopOpacity=".05" />
            <stop offset=".63" stopColor="#805693" stopOpacity=".45" />
            <stop offset="1" stopColor="#9d68b6" stopOpacity=".15" />
          </linearGradient>
          <marker id={`${id}-arrow`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M1 1 7 4 1 7" fill="none" stroke="#762280" strokeWidth="1.3" />
          </marker>
        </defs>
        <rect width="416" height="220" fill={`url(#${id}-field)`} />
        <motion.g fill="none" stroke={`url(#${id}-mesh)`} strokeWidth=".65"
          style={{ scale: meshScale, opacity: meshOpacity, transformOrigin: '332px 69px' }}>
          {contours.map(path => <path key={path} d={path} />)}
        </motion.g>
        <motion.g style={{ x: particleX, scale: particleScale, opacity: particleOpacity, transformOrigin: '42px 116px' }} fill="#805191">
          {particles.map((particle, i) => <circle key={i} cx={particle.x} cy={particle.y} r={particle.r} opacity={particle.opacity} />)}
        </motion.g>
        <motion.path d="M43 117 C87 130 129 104 169 104" fill="none" stroke="#655271" strokeWidth="2"
          strokeLinecap="round" style={{ pathLength: commonLength }} />
        <motion.path d={reference} fill="none" stroke="#695978" strokeWidth="1.5" strokeDasharray="3 4"
          opacity=".72" pathLength={1} style={{ strokeDasharray: '0.024 0.04' }} />
        <motion.path d={reference} fill="none" stroke="#655271" strokeWidth="1.6" opacity=".42" strokeLinecap="round"
          style={{ pathLength: referenceLength }} />
        <motion.path d="M169 104 Q170 120 177 131" fill="none" stroke="#762280" strokeWidth="2"
          markerEnd={`url(#${id}-arrow)`} style={{ pathLength: injectionLength, opacity: injectOpacity }} />
        <motion.path ref={driftTrace} d={drift} fill="none" stroke="#a36a56" opacity=".78" strokeWidth="1.75" strokeLinecap="round"
          style={{ pathLength: branchLength }} />
        <motion.path ref={guidedTrace} d={guided} fill="none" stroke="#772282" strokeWidth="2.5" strokeLinecap="round"
          style={{ pathLength: branchLength }} />
        <motion.g style={{ opacity: injectOpacity }}>
          <circle cx="169" cy="104" r="3" fill="#695978" />
          <circle cx="177" cy="131" r="7" fill="#a25ca3" fillOpacity=".17" />
          <circle cx="177" cy="131" r="3.6" fill="#762280" stroke="#fff" strokeWidth="1" />
        </motion.g>
        <motion.g style={{ opacity: guideOpacity }}>
          <circle ref={driftMarker} cx="351" cy="131" r="3.2" fill="#a36a56" stroke="#fff" strokeWidth="1" />
          <g ref={guidedMarker} transform="translate(344 74)">
            <path d="M-13 20 Q-17 10 -2 3" fill="none" stroke="#762280" strokeWidth="1.35" markerEnd={`url(#${id}-arrow)`} />
            <circle r="6.3" fill="#9d50a2" opacity=".25" />
            <circle r="3" fill="#762280" stroke="#fff" strokeWidth="1.2" />
          </g>
        </motion.g>
        <motion.g className="ph-tide-endpoints" style={{ opacity: endOpacity }}>
          <circle cx="344" cy="58" r="2.5" fill="#695978" />
          <text x="350" y="53" fill="#5c4b69">{language === 'zh' ? '参考' : 'Reference'}</text>
          <text x="354" y="83" fill="#702276">TIDE</text>
          <text x="351" y="122" textAnchor="end" fill="#704637">{language === 'zh' ? '未引导' : 'No guidance'}</text>
        </motion.g>
      </svg>
      <span className="ph-preview-note"><Localized en="Trajectory illustration" zh="轨迹示意" /></span>
      <div className="ph-tide-controls reader-glass media-glass" data-media-lens="">
        <Button className="ph-tide-play" variant="ghost" size="icon-sm" onClick={togglePlayback}
          aria-label={language === 'zh' ? (reduced ? '下一阶段' : playing ? '暂停轨迹' : '播放轨迹') : (reduced ? 'Next trajectory stage' : playing ? 'Pause trajectory' : 'Play trajectory')}>
          {reduced ? <SkipForward aria-hidden="true" /> : playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
        </Button>
        <FilterTabs surface="grouped" value={stage} onChange={selectStage} className="ph-tide-segments"
          label={language === 'zh' ? '轨迹阶段' : 'Trajectory stages'}
          options={stages.map(item => ({ value: item.value, label: <Localized en={item.en} zh={item.zh} /> }))} />
      </div>
    </div>
  );
}
