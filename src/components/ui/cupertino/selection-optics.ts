import { makeLensMap } from './lens-map';

const ns = 'http://www.w3.org/2000/svg';
let shoulder: string | undefined;
let nextLens = 0;

function node(tag: string, attrs: Record<string, string>) {
  const element = document.createElementNS(ns, tag);
  for (const [name, value] of Object.entries(attrs)) element.setAttribute(name, value);
  return element;
}

// Keep the labels in their native layout. A neutral field leaves all ink
// untouched except the small shoulder travelling across the control itself.
export function selectionOptics(ink: HTMLElement) {
  const id = 'selection-lens-' + ++nextLens;
  const filter = node('filter', { id, filterUnits: 'objectBoundingBox', primitiveUnits: 'objectBoundingBox',
    x: '-.05', y: '-.05', width: '1.1', height: '1.1', 'color-interpolation-filters': 'sRGB' });
  shoulder ??= makeLensMap(96, 46, 23, 12);
  const map = node('feImage', { href: shoulder, preserveAspectRatio: 'none', result: 'rim' });
  const normalize = node('feComponentTransfer', { result: 'normal' });
  const red = node('feFuncR', { type: 'linear' }), green = node('feFuncG', { type: 'linear' });
  normalize.append(red, green);
  const bend = node('feDisplacementMap', { in: 'SourceGraphic', in2: 'normal', xChannelSelector: 'R', yChannelSelector: 'G' });
  filter.append(node('feFlood', { 'flood-color': '#808080', result: 'flat' }), map,
    node('feComposite', { in: 'rim', in2: 'flat', operator: 'over' }), normalize, bend);
  const bank = node('svg', { width: '0', height: '0', 'aria-hidden': 'true', focusable: 'false', class: 'selection-defs' });
  const defs = node('defs', {});
  defs.append(filter); bank.append(defs); ink.after(bank);
  const webkit = CSS.supports('background-image', '-webkit-named-image(i)');
  const gecko = CSS.supports('-moz-appearance', 'none');
  let w = 0, h = 0, left = 0, top = 0;
  function resize() {
    w = ink.offsetWidth; h = ink.offsetHeight; left = ink.offsetLeft; top = ink.offsetTop;
    if (!w || !h) return;
    const unit = webkit ? Math.min(w, h) : gecko ? Math.hypot(w, h) / Math.SQRT2 : w;
    bend.setAttribute('scale', String(11 / unit));
    for (const [channel, extent] of [[red, w], [green, h]] as const) {
      const gain = webkit ? unit / extent : 1;
      channel.setAttribute('slope', String(gain));
      channel.setAttribute('intercept', String(.5 - gain * 128 / 255));
    }
  }
  return {
    resize,
    place(x: number, y: number, width: number, height: number) {
      if (!w || !h) return;
      map.setAttribute('x', String((x - left) / w)); map.setAttribute('y', String((y - top) / h));
      map.setAttribute('width', String(width / w)); map.setAttribute('height', String(height / h));
      if (!ink.style.filter) ink.style.filter = `url("#${id}")`;
    },
    clear() { ink.style.removeProperty('filter'); },
    destroy() { ink.style.removeProperty('filter'); bank.remove(); },
  };
}
