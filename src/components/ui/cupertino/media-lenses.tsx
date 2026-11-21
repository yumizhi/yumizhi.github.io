'use client';

import { useEffect, useId, useRef } from 'react';
import { makeLensMap } from './lens-map';

// Bend only the illustration or screenshot sharing a frame with its controls.
// Source and lens move together as the document scrolls.
const content = '[data-lens-source]';
const lensSelector = '[data-media-lens]';
const ns = 'http://www.w3.org/2000/svg';
function svgTag(name: string, attributes: Record<string, string>) {
  const el = document.createElementNS(ns, name);
  for (const [key, value] of Object.entries(attributes)) el.setAttribute(key, value);
  return el;
}

export function MediaLenses() {
  const defs = useRef<SVGDefsElement>(null);
  const prefix = 'media-lens-' + useId().replace(/[^a-zA-Z0-9_-]/g, '');

  useEffect(() => {
    const bank = defs.current;
    const root = bank?.parentElement?.parentElement;
    if (!root || !bank) return;
    const access = matchMedia('(prefers-reduced-transparency: reduce), (prefers-contrast: more), (forced-colors: active)');
    const visible = new Set<HTMLElement | SVGElement>();
    const maps = new WeakMap<HTMLElement, { width: number; height: number; url: string; decoded: boolean }>();
    const active = new Map<HTMLElement | SVGElement, { filter: Element; merge: Element; r: Element; g: Element; displacement: Element; images: Element[]; signature: string }>();
    // WebKit resolves the two displacement axes against their respective box
    // dimensions. Blink uses the width for both.
    const webkit = CSS.supports('background-image', '-webkit-named-image(i)');
    const gecko = CSS.supports('-moz-appearance', 'none');
    let live = true, next = 0, raf = 0;
    function schedule() { if (live && !raf) raf = requestAnimationFrame(paint); }

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement | SVGElement;
        if (entry.isIntersecting) visible.add(el); else visible.delete(el);
      }
      schedule();
    }, { rootMargin: '32px' });

    function clear(el: HTMLElement | SVGElement) {
      el.style.removeProperty('--page-optics');
      el.removeAttribute('data-optical-target');
      active.get(el)?.filter.remove(); active.delete(el);
    }

    function paint() {
      raf = 0;
      if (!visible.size && !active.size) return;
      const lenses = [...root!.querySelectorAll<HTMLElement>(lensSelector)].map(el => {
        const box = el.getBoundingClientRect();
        const w = Math.round(box.width / 4) * 4, h = Math.round(box.height);
        if (!w || !h || access.matches) return null;
        let map = maps.get(el);
        if (!map || map.width !== w || map.height !== h) {
          const fresh = { width: w, height: h, url: makeLensMap(w, h, h / 2, Math.min(13, h * .29)), decoded: false };
          maps.set(el, fresh); map = fresh;
          const bitmap = new Image();
          bitmap.src = fresh.url;
          bitmap.decode().then(() => { fresh.decoded = true; schedule(); }).catch(() => {});
        }
        return map.decoded ? { box, map } : null;
      }).filter(lens => lens !== null);
      const kept = new Set<HTMLElement | SVGElement>();
      for (const el of visible) {
        if (!el.isConnected || el.closest('[aria-hidden=true]')) continue;
        const bounds = el.getBoundingClientRect();
        const touching = lenses.filter(({ box }) => box.left < bounds.right && box.right > bounds.left && box.top < bounds.bottom && box.bottom > bounds.top);
        if (!touching.length || bounds.height > 1500 || bounds.width > 2200) continue;
        const signature = [bounds.width, bounds.height, ...touching.flatMap(({ box }) =>
          [box.width, box.height, box.left - bounds.left, box.top - bounds.top])].map(n => n.toFixed(2)).join(',');
        kept.add(el);
        let state = active.get(el);
        if (state?.signature === signature) continue;
        if (!state) {
          if (getComputedStyle(el).filter !== 'none') continue;
          const filter = svgTag('filter', { filterUnits: 'objectBoundingBox', primitiveUnits: 'objectBoundingBox', x: '-.06', y: '-.15', width: '1.12', height: '1.3', 'color-interpolation-filters': 'sRGB' });
          const base = svgTag('feFlood', { 'flood-color': '#808080', result: 'flat' });
          const merge = svgTag('feMerge', { result: 'field' });
          merge.append(svgTag('feMergeNode', { in: 'flat' }));
          const centered = svgTag('feComponentTransfer', { in: 'field', result: 'normal' });
          const r = svgTag('feFuncR', { type: 'linear' }), g = svgTag('feFuncG', { type: 'linear' });
          centered.append(r, g);
          const displacement = svgTag('feDisplacementMap', { in: 'SourceGraphic', in2: 'normal', xChannelSelector: 'R', yChannelSelector: 'G' });
          filter.append(base, merge, centered, displacement);
          bank!.append(filter);
          state = { filter, merge, r, g, displacement, images: [], signature: '' };
          active.set(el, state);
        }
        state.signature = signature;
        const unit = webkit ? Math.min(bounds.width, bounds.height) : gecko ? Math.hypot(bounds.width, bounds.height) / Math.SQRT2 : bounds.width;
        state.displacement.setAttribute('scale', String(20 / unit));
        for (const [channel, extent] of [[state.r, bounds.width], [state.g, bounds.height]] as const) {
          const gain = webkit ? unit / extent : 1;
          channel.setAttribute('slope', String(gain));
          channel.setAttribute('intercept', String(.5 - gain * 128 / 255));
        }
        while (state.images.length > touching.length) {
          state.images.pop()!.remove(); state.merge.lastElementChild!.remove();
        }
        touching.forEach(({ box, map }, i) => {
          let image = state!.images[i];
          if (!image) {
            image = svgTag('feImage', { result: 'lens' + i, preserveAspectRatio: 'none' });
            state!.filter.insertBefore(image, state!.merge); state!.images.push(image);
            state!.merge.append(svgTag('feMergeNode', { in: 'lens' + i }));
          }
          if (image.getAttribute('href') !== map.url) {
            image.setAttribute('href', map.url);
            image.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', map.url);
          }
          image.setAttribute('width', String(box.width / bounds.width)); image.setAttribute('height', String(box.height / bounds.height));
          image.setAttribute('x', String((box.left - bounds.left) / bounds.width)); image.setAttribute('y', String((box.top - bounds.top) / bounds.height));
        });
        if (!state.filter.id || webkit) {
          state.filter.id = prefix + '-' + (++next);
          el.style.setProperty('--page-optics', `url("#${state.filter.id}")`);
          el.setAttribute('data-optical-target', '');
        }
      }
      for (const el of active.keys()) if (!kept.has(el)) clear(el);
    }

    const resize = new ResizeObserver(schedule);
    const updates = new MutationObserver(schedule);
    resize.observe(root);
    root.querySelectorAll(content).forEach(source => {
      observer.observe(source);
      resize.observe(source);
      updates.observe(source, { attributes: true, attributeFilter: ['aria-hidden'] });
    });
    root.querySelectorAll(lensSelector).forEach(lens => resize.observe(lens));
    access.addEventListener('change', schedule);
    return () => {
      live = false; cancelAnimationFrame(raf); observer.disconnect(); updates.disconnect(); resize.disconnect();
      access.removeEventListener('change', schedule);
      for (const el of active.keys()) clear(el);
    };
  }, [prefix]);

  return <svg width="0" height="0" className="lens-defs" aria-hidden="true" focusable="false"><defs ref={defs} /></svg>;
}
