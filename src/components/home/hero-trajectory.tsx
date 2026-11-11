'use client';

import { useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Localized } from '@/components/language';
import { asset } from '@/lib/paths';
import { INJECTION_STEP, TOTAL_STEPS } from '@/components/tide/data';

/** Position of one frame inside the 10 × 5 sprite sheet of a sampling run. */
function spritePosition(step: number) {
  const index = step - 1;
  return `${((index % 10) / 9) * 100}% ${(Math.floor(index / 10) / 4) * 100}%`;
}

/**
 * The homepage plate: fifty denoising steps of one real TIDE sampling run laid side by side.
 * Pointing at a strip shows the model's full estimate of the image at that step.
 */
export function HeroTrajectory() {
  const plate = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<number | null>(null);

  function point(event: PointerEvent<HTMLDivElement>) {
    const box = plate.current!.getBoundingClientRect();
    const ratio = Math.min(Math.max((event.clientX - box.left) / box.width, 0), 0.9999);
    setStep(Math.floor(ratio * TOTAL_STEPS) + 1);
  }

  const marked = step !== null && step > INJECTION_STEP;
  return (
    <figure className="hero-plate">
      <div
        className="hero-plate-art"
        ref={plate}
        onPointerMove={point}
        onPointerDown={point}
        onPointerLeave={() => setStep(null)}
      >
        <img
          src={asset('/images/art/tide-banner.webp')}
          width={1800}
          height={760}
          alt="Fifty vertical strips, one per denoising step, in which a robot in a city resolves from blur to a sharp image."
          fetchPriority="high"
        />
        <span className="hero-plate-injection" style={{ left: `${(INJECTION_STEP / TOTAL_STEPS) * 100}%` }} aria-hidden="true" />
        {step !== null && (
          <div
            className="hero-lens"
            data-marked={marked || undefined}
            style={{ '--at': `${((step - 0.5) / TOTAL_STEPS) * 100}%` } as CSSProperties}
            aria-hidden="true"
          >
            <span
              className="hero-lens-frame"
              style={{ backgroundImage: `url(${asset('/images/art/tide-sprite-tide.webp')})`, backgroundPosition: spritePosition(step) }}
            />
            <span className="hero-lens-label">
              <Localized en={`Step ${step} / ${TOTAL_STEPS}`} zh={`第 ${step} / ${TOTAL_STEPS} 步`} />
            </span>
          </div>
        )}
      </div>
      <figcaption>
        <p>
          <Localized
            en="One image, fifty denoising steps of Stable Diffusion 2.1, left to right. At step 35 (dashed line) TIDE writes its watermark and steers the remaining steps. Point at a strip to see that step."
            zh="同一幅图像在 Stable Diffusion 2.1 中的五十步去噪过程，自左向右。TIDE 在第 35 步（虚线处）写入水印，并引导余下的步骤。将指针移到任意一条上可查看该步的图像。"
          />
        </p>
        <Link className="arrow-link" data-direction="right" href="/research/tide/">
          <Localized en="Read the TIDE article" zh="阅读 TIDE 文章" />
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </figcaption>
    </figure>
  );
}
