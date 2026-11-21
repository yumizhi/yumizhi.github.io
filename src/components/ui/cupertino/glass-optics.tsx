'use client';

import { useEffect, useId, useRef, useState } from 'react';

// Sample the normal of a rounded lens at each point on its rim. Neutral
// displacement in the centre keeps type and the scenery behind it steady.
function makeRimMap(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) return '';
  const image = context.createImageData(width, height);
  const radius = height / 2;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const px = x + .5, py = y + .5;
      const dx = px - Math.min(width - radius, Math.max(radius, px));
      const dy = py - radius;
      const distance = Math.hypot(dx, dy);
      const depth = Math.max(0, Math.min(1, (radius - distance) / 6));
      const bend = 113 * Math.sin(Math.PI * depth) * (1 - depth);
      const offset = (y * width + x) * 4;
      image.data[offset] = 128 - bend * dx / (distance || 1);
      image.data[offset + 1] = 128 - bend * dy / (distance || 1);
      image.data[offset + 2] = 128;
      image.data[offset + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  return canvas.toDataURL();
}

export function LensRefraction() {
  const id = 'lens-' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const svg = useRef<SVGSVGElement>(null);
  const [map, setMap] = useState('');
  useEffect(() => {
    const control = svg.current?.parentElement;
    if (!control || !('ResizeObserver' in window)) return;
    const observer = new ResizeObserver(() => {
      const { offsetWidth: width, offsetHeight: height } = control;
      if (width >= height && height > 0 && height <= 70 && width < 600) setMap(makeRimMap(width, height));
    });
    observer.observe(control);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const control = svg.current?.parentElement;
    if (!control || !map) return;
    control.style.setProperty('--rim-filter', `url("#${id}")`);
    return () => { control.style.removeProperty('--rim-filter'); };
  }, [id, map]);
  return <svg ref={svg} aria-hidden="true" focusable="false" width="0" height="0" style={{ position: 'absolute' }}>
    {map && <defs>
      <filter id={id} x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feImage href={map} width="100%" height="100%" preserveAspectRatio="none" result="lens" />
        <feDisplacementMap in="SourceGraphic" in2="lens" scale="16" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>}
  </svg>;
}
