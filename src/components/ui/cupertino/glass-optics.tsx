'use client';

import { useEffect, useId, useRef, useState, type RefObject } from 'react';
import { makeLensMap } from './lens-map';

export type LensScene = { src: string; frame: RefObject<HTMLDivElement | null> };

// The button and its portaled menu must sample the same photograph. Coordinates
// come from the actual displayed image, including a menu that flips or overhangs it.
export function LensRefraction({ scene }: { scene?: LensScene }) {
  const id = 'optic-' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const svg = useRef<SVGSVGElement>(null);
  const photo = useRef<SVGImageElement>(null);
  const [size, setSize] = useState<{ map: string; width: number; height: number }>();
  const frame = scene?.frame;
  const source = scene?.src;
  useEffect(() => {
    const control = svg.current?.parentElement;
    if (!control) return;
    const image = frame?.current;
    let raf = 0, previousWidth = 0, previousHeight = 0;
    let samples: Uint8ClampedArray | undefined;
    // Read a small same-origin thumbnail once per photo. Both the trigger and
    // the menu choose their lettering from the crop they actually sit over.
    const thumbnail = source ? new Image() : null;
    if (thumbnail && source) {
      thumbnail.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 24;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(thumbnail, 0, 0, 24, 24);
        samples = ctx.getImageData(0, 0, 24, 24).data;
        schedule();
      };
      thumbnail.src = source;
    }
    function measure() {
      raf = 0;
      if (!control) return;
      const w = control.offsetWidth, h = control.offsetHeight;
      if (!w || !h) return;
      if (w !== previousWidth || h !== previousHeight) {
        const r = parseFloat(getComputedStyle(control).borderTopLeftRadius);
        setSize({ map: makeLensMap(w, h, r, Math.min(15, h * .26)), width: w, height: h });
        previousWidth = w; previousHeight = h;
      }
      if (!image || !photo.current) return;
      const a = image.getBoundingClientRect(), b = control.getBoundingClientRect();
      const element = photo.current;
      element.setAttribute('x', String(a.left - b.left));
      element.setAttribute('y', String(a.top - b.top));
      element.setAttribute('width', String(a.width));
      element.setAttribute('height', String(a.height));
      if (samples && a.width && a.height) {
        let light = 0;
        for (const v of [.2, .5, .8]) for (const u of [.15, .35, .55, .75, .9]) {
          const x = Math.floor(24 * (b.left + b.width * u - a.left) / a.width);
          const y = Math.floor(24 * (b.top + b.height * v - a.top) / a.height);
          if (x < 0 || x >= 24 || y < 0 || y >= 24) {
            light += document.documentElement.classList.contains('dark') ? 22 : 250;
          } else {
            const i = 4 * (24*y+x);
            light += .213 * samples[i] + .715 * samples[i+1] + .072 * samples[i+2];
          }
        }
        control.toggleAttribute('data-bright-photo', light / 15 > 150);
      }
    }
    function schedule() { if (!raf) raf = requestAnimationFrame(measure); }
    measure();
    const resize = new ResizeObserver(schedule);
    resize.observe(control);
    if (image) resize.observe(image);
    // Base UI places the portal after mount and can flip it while scrolling.
    const positioner = control.closest('.glass-positioner');
    const placement = new MutationObserver(schedule);
    if (positioner) {
      placement.observe(positioner, { attributes: true });
      control.addEventListener('transitionend', schedule);
      window.addEventListener('scroll', schedule, { passive: true, capture: true });
    }
    return () => {
      if (thumbnail) thumbnail.onload = null;
      resize.disconnect(); placement.disconnect(); cancelAnimationFrame(raf);
      control.removeEventListener('transitionend', schedule);
      window.removeEventListener('scroll', schedule, true);
    };
  }, [frame, source]);

  useEffect(() => {
    const control = svg.current?.parentElement;
    if (!control || !size || scene) return;
    control.style.setProperty('--rim-filter', `url("#${id}")`);
    return () => { control.style.removeProperty('--rim-filter'); };
  }, [id, size, scene]);

  return <svg ref={svg} aria-hidden="true" focusable="false" width={scene ? '100%' : 0} height={scene ? '100%' : 0}
    className={scene ? 'lens-scene' : 'lens-defs'}>
    {size && <defs>
      <filter id={id} filterUnits="userSpaceOnUse" x="0" y="0" width={size.width} height={size.height} colorInterpolationFilters="sRGB">
        <feImage href={size.map} width={size.width} height={size.height} preserveAspectRatio="none" result="map" />
        <feComponentTransfer in="map" result="normal">
          <feFuncR type="linear" intercept={-.5 / 255} /><feFuncG type="linear" intercept={-.5 / 255} />
        </feComponentTransfer>
        <feDisplacementMap in="SourceGraphic" in2="normal" scale="44" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>}
    {scene && <g filter={size ? `url(#${id})` : undefined}>
      <image ref={photo} href={scene.src} preserveAspectRatio="xMidYMid slice" />
    </g>}
  </svg>;
}
