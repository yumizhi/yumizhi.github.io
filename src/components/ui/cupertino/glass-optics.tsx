'use client';

import { useEffect, useId, useRef, useState, type RefObject } from 'react';

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

export type LensScene = { src: string; frame: RefObject<HTMLDivElement | null> };

export function LensRefraction({ scene }: { scene?: LensScene }) {
  const id = 'lens-' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const svg = useRef<SVGSVGElement>(null);
  const [geometry, setGeometry] = useState<{
    map: string; width: number; height: number; x: number; y: number; frameWidth: number; frameHeight: number;
  }>();
  const frame = scene?.frame;
  useEffect(() => {
    const control = svg.current?.parentElement;
    if (!control) return;
    const photo = frame?.current;
    const observer = new ResizeObserver(() => {
      const { offsetWidth: width, offsetHeight: height } = control;
      if (!height || width < height || width >= 600 || height > 70) return;
      const bounds = control.getBoundingClientRect();
      const image = photo?.getBoundingClientRect();
      setGeometry(previous => ({
        map: previous?.width === width && previous.height === height ? previous.map : makeRimMap(width, height),
        width, height, x: image ? image.left - bounds.left : 0, y: image ? image.top - bounds.top : 0,
        frameWidth: image?.width ?? 0, frameHeight: image?.height ?? 0,
      }));
    });
    observer.observe(control);
    if (photo) observer.observe(photo);
    return () => observer.disconnect();
  }, [frame]);

  const map = geometry?.map;
  useEffect(() => {
    const control = svg.current?.parentElement;
    if (!control || !map || frame) return;
    control.style.setProperty('--rim-filter', `url("#${id}")`);
    return () => { control.style.removeProperty('--rim-filter'); };
  }, [id, map, frame]);

  const showScene = !!(scene && geometry?.frameWidth && map);
  return <svg ref={svg} aria-hidden="true" focusable="false" width={showScene ? '100%' : '0'} height={showScene ? '100%' : '0'}
    className={showScene ? 'lens-scene' : undefined} style={{ position: 'absolute', pointerEvents: 'none' }}>
    {geometry && map && <defs>
      <filter id={id} filterUnits="userSpaceOnUse" x="0" y="0" width={geometry.width} height={geometry.height} colorInterpolationFilters="sRGB">
        <feImage href={map} width={geometry.width} height={geometry.height} preserveAspectRatio="none" result="lens" />
        {/* The neutral map byte is 128. Centre it at exactly one half so
            identical pixels underneath the flat face remain stationary. */}
        <feComponentTransfer in="lens" result="centredLens">
          <feFuncR type="linear" slope="1" intercept={-0.5 / 255} />
          <feFuncG type="linear" slope="1" intercept={-0.5 / 255} />
        </feComponentTransfer>
        <feDisplacementMap in="SourceGraphic" in2="centredLens" scale="19" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      {scene && <linearGradient id={id + '-light'} x1="0" y1="0" x2="1" y2=".8" gradientUnits="objectBoundingBox">
        <stop offset="2%" stopColor="white" stopOpacity=".58" />
        <stop offset="23%" stopColor="white" stopOpacity="0" />
        <stop offset="76%" stopColor="white" stopOpacity="0" />
        <stop offset="97%" stopColor="white" stopOpacity=".28" />
      </linearGradient>}
    </defs>}
    {showScene && <>
      <g filter={`url(#${id})`}>
        <image href={scene.src} x={geometry.x} y={geometry.y} width={geometry.frameWidth} height={geometry.frameHeight} preserveAspectRatio="xMidYMid slice" />
      </g>
      <rect width="100%" height="100%" fill="var(--glass-wash)" />
      <rect x=".5" y=".5" width={geometry.width - 1} height={geometry.height - 1} rx={geometry.height / 2}
        fill="none" stroke={`url(#${id}-light)`} strokeWidth=".8" />
    </>}
  </svg>;
}
