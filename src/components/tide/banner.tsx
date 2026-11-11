import { Localized } from '@/components/language';
import { asset } from '@/lib/paths';
import { INJECTION_STEP, TOTAL_STEPS } from './data';

const ticks = [1, 10, 20, 30, INJECTION_STEP, 40, 50];
const position = (step: number) => `${(step / TOTAL_STEPS) * 100}%`;

/**
 * One denoising run as a single picture. The banner is cut into 50 vertical strips;
 * strip k is taken from the clean-image estimate at step k, so reading left to right
 * is reading the trajectory. The watermark enters where the ring sits.
 */
export function TideBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div className="tide-banner" data-compact={compact || undefined}>
      <div className="tide-banner-art">
        <img
          src={asset('/images/art/tide-banner.webp')}
          width={1800}
          height={760}
          alt="A robot in a futuristic city resolving from blur on the left to a sharp image on the right: fifty vertical strips, one per denoising step of a single TIDE sampling run."
          fetchPriority="high"
        />
        <div className="tide-banner-marker" style={{ left: position(INJECTION_STEP) }} aria-hidden="true">
          <svg className="tide-ring" viewBox="-36 -36 72 72" width="72" height="72">
            <circle r="17.5" fill="none" stroke="currentColor" strokeWidth="25" opacity="0.28" />
            <circle r="30" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle r="17.5" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 5" />
          </svg>
        </div>
      </div>
      <div className="tide-banner-ruler" aria-hidden="true">
        <span className="tide-banner-phase" style={{ left: 0, width: position(INJECTION_STEP) }}>
          <Localized en="Unchanged trajectory" zh="原始生成轨迹" />
        </span>
        <span className="tide-banner-phase" data-phase="guided" style={{ left: position(INJECTION_STEP), right: 0 }}>
          <Localized en="Guided propagation" zh="引导传播" />
        </span>
        {ticks.map(step => (
          <span key={step} className="tide-banner-tick" data-injection={step === INJECTION_STEP || undefined} style={{ left: position(step) }}>
            {step === INJECTION_STEP ? 'τ = 35' : step}
          </span>
        ))}
      </div>
      {!compact && (
        <p className="tide-banner-caption">
          <span className="label"><Localized en="Banner · real sampling run" zh="题图 · 真实采样过程" /></span>
          <Localized
            en="Fifty strips, one per denoising step of a single Stable Diffusion 2.1 run (seed 42). TIDE leaves steps 1–35 untouched, writes a ring-shaped watermark into the latent spectrum at τ = 35, and guides the last fifteen steps."
            zh="一次 Stable Diffusion 2.1 采样（种子 42）的 50 个去噪步，每一步对应一条竖带。TIDE 不改动前 35 步，在 τ = 35 时把环形水印写入潜变量频谱，并引导余下的 15 步。"
          />
        </p>
      )}
    </div>
  );
}
