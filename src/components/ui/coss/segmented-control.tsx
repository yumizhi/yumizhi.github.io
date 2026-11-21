"use client";

// Vendored from the coss UI registry (MIT). See LICENSE in this directory.

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import * as React from "react";
import { frame, cancelFrame, springValue } from "motion";
import { selectionOptics } from "../cupertino/selection-optics";
import { cn } from "@/lib/utils";

export type SegmentedControlSize = "default" | "lg" | "sm";

export const segmentedControlItemSizeClassNames: Record<
  SegmentedControlSize,
  string
> = {
  default: "h-8.5 px-[calc(--spacing(2.5)-1px)] sm:h-7.5",
  lg: "h-9.5 px-[calc(--spacing(3)-1px)] sm:h-8.5",
  sm: "h-7.5 px-[calc(--spacing(2)-1px)] sm:h-6.5",
};

export const segmentedControlItemLayoutClassName =
  "gap-1.5 [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:-mx-0.5 [&_svg]:shrink-0";

export const segmentedControlIndicatorSurfaceClassName =
  "rounded-md bg-background shadow-sm/5 dark:bg-input";

const SegmentedControlContext: React.Context<SegmentedControlSize> =
  React.createContext<SegmentedControlSize>("default");

export function SegmentedControl({
  className,
  children,
  render,
  size = "default",
  ...props
}: useRender.ComponentProps<"div"> & {
  size?: SegmentedControlSize;
}): React.ReactElement {
  const defaultProps = {
    children: (
      <>
        <div data-segment-items="">{children}</div>
        <SegmentedControlIndicator />
      </>
    ),
    className: cn(
      "relative z-0 flex w-fit items-center justify-center gap-0.5 rounded-lg bg-muted p-0.5",
      className,
    ),
    "data-size": size,
    "data-slot": "segmented-control",
  };

  const element = useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });

  return (
    <SegmentedControlContext.Provider value={size}>
      {element}
    </SegmentedControlContext.Provider>
  );
}

export function SegmentedControlItem({
  className,
  render,
  size,
  ...props
}: useRender.ComponentProps<"button"> & {
  size?: SegmentedControlSize;
}): React.ReactElement {
  const contextSize = React.useContext(SegmentedControlContext);
  const resolvedSize = size ?? contextSize;

  const defaultProps = {
    className: cn(
      "relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-md border border-transparent font-medium text-base text-muted-foreground/72 outline-2 outline-transparent transition-[color,outline-color] hover:bg-transparent hover:text-muted-foreground focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-64 data-disabled:pointer-events-none data-disabled:opacity-64 sm:text-sm",
      "data-checked:bg-background data-checked:text-foreground data-checked:shadow-sm/5 dark:data-checked:bg-input",
      "aria-[current=page]:bg-background aria-[current=page]:text-foreground aria-[current=page]:shadow-sm/5 dark:aria-[current=page]:bg-input",
      "data-pressed:bg-background data-pressed:text-foreground data-pressed:shadow-sm/5 dark:data-pressed:bg-input",
      segmentedControlItemLayoutClassName,
      segmentedControlItemSizeClassNames[resolvedSize],
      className,
    ),
    "data-size": resolvedSize,
    "data-slot": "segmented-control-item",
    ...(render ? {} : { type: "button" as const }),
  };

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(defaultProps, props),
    render,
  });
}

const activeItemSelector =
  ':scope > [data-checked], :scope > [aria-current="page"], :scope > [data-pressed]';

const observedAttributes: string[] = [
  "data-selected",
  "data-checked",
  "aria-current",
  "data-pressed",
];

interface ActiveItemRect {
  height: number;
  left: number;
  top: number;
  width: number;
}

function isSameRect(
  a: ActiveItemRect | null,
  b: ActiveItemRect | null,
): boolean {
  return (
    a?.left === b?.left &&
    a?.top === b?.top &&
    a?.width === b?.width &&
    a?.height === b?.height
  );
}

function getCssSize(element: HTMLElement): { height: number; width: number } {
  const style = getComputedStyle(element);
  const width = Number.parseFloat(style.width) || 0;
  const height = Number.parseFloat(style.height) || 0;
  if (
    Math.round(width) !== element.offsetWidth ||
    Math.round(height) !== element.offsetHeight
  ) {
    return { height: element.offsetHeight, width: element.offsetWidth };
  }
  return { height, width };
}

function measureItem(item: HTMLElement, root: HTMLElement): ActiveItemRect {
  const { width, height } = getCssSize(item);
  const rootSize = getCssSize(root);
  const itemRect = item.getBoundingClientRect();
  const rootRect = root.getBoundingClientRect();
  const scaleX = rootSize.width > 0 ? rootRect.width / rootSize.width : 1;
  const scaleY = rootSize.height > 0 ? rootRect.height / rootSize.height : 1;

  const rectLeft =
    (itemRect.left - rootRect.left) / scaleX -
    root.clientLeft +
    root.scrollLeft;
  const rectTop =
    (itemRect.top - rootRect.top) / scaleY - root.clientTop + root.scrollTop;

  return {
    height,
    left: rectLeft,
    top: rectTop,
    width,
  };
}

const travel = { stiffness: 540, damping: 40, mass: .8, restDelta: .03, restSpeed: .3 };
const itemSelector = ':scope > a, :scope > button';

function SegmentedControlIndicator(): React.ReactElement {
  const ref = React.useRef<HTMLSpanElement>(null);
  React.useLayoutEffect(() => {
    const thumb = ref.current;
    const root = thumb?.parentElement;
    const ink = root?.querySelector<HTMLElement>('[data-segment-items]');
    if (!root || !thumb || !ink) return;

    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const solid = matchMedia('(prefers-reduced-transparency: reduce), (prefers-contrast: more), (forced-colors: active)');
    const glass = root.hasAttribute('data-glass-selection');
    const scrub = root.hasAttribute('data-glass-scrub');
    const cx = springValue<number>(0, travel);
    const cy = springValue<number>(0, travel);
    const width = springValue<number>(1, travel);
    const height = springValue<number>(1, travel);
    const optics = glass ? selectionOptics(ink) : undefined;
    let current: HTMLElement | null = null;
    let targetRect: ActiveItemRect | null = null;
    let releaseTimer = 0;
    let swallowClick = false;
    type Stop = { item: HTMLElement; rect: ActiveItemRect; center: number };
    let press: {
      id: number;
      x: number;
      y: number;
      center: number;
      stops: Stop[];
      dragging: boolean;
      candidate: HTMLElement;
    } | null = null;

    function paint() {
      if (!targetRect) return;
      const w = width.get(), h = height.get();
      const x = cx.get() - w / 2, y = cy.get() - h / 2;
      // Pin the face and both dimensions in the same paint, including the
      // very first visible frame and a reflow from a horizontal to vertical rail.
      thumb!.style.transform = `translate3d(${x}px,${y}px,0) scale(${w/targetRect.width},${h/targetRect.height})`;
      if (thumb!.hasAttribute('data-lifted')) optics?.place(x, y, w, h);
    }
    const schedule = () => frame.render(paint);
    const values = [cx, cy, width, height];
    const unsubscribe = values.map(value => value.on('change', schedule));
    function target(rect: ActiveItemRect, snap = false) {
      const method = snap || !targetRect || reduced.matches ? 'jump' : 'set';
      targetRect = rect;
      thumb!.style.width = rect.width + 'px';
      thumb!.style.height = rect.height + 'px';
      cx[method](rect.left + rect.width/2); cy[method](rect.top + rect.height/2);
      width[method](rect.width); height[method](rect.height);
      paint();
      thumb!.hidden = false;
    }
    function lower() {
      delete thumb!.dataset.lifted;
      optics?.clear();
    }
    function raise() {
      if (!glass || reduced.matches || solid.matches) return;
      clearTimeout(releaseTimer);
      thumb!.dataset.lifted = '';
      paint();
    }
    function settle() {
      clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(lower, 280);
    }
    function sync(snap = false) {
      const item = ink!.querySelector<HTMLElement>(':scope > [data-selected="true"]') ?? ink!.querySelector<HTMLElement>(activeItemSelector);
      if (!item || !item.offsetWidth) { lower(); thumb!.hidden = true; targetRect = null; return; }
      if (press?.dragging) return;
      const rect = measureItem(item, root!);
      if (snap || !isSameRect(rect, targetRect)) {
        if (current && item !== current && !snap) { raise(); settle(); }
        target(rect, snap || item === current);
      }
      current = item;
    }
    const children = () => Array.from(ink!.querySelectorAll<HTMLElement>(itemSelector));
    function down(e: PointerEvent) {
      if (!glass || !e.isPrimary || e.button || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const item = (e.target as Element).closest<HTMLElement>('button,a');
      if (!item || item.parentElement !== ink) return;
      const stops = scrub ? children().map(el => {
        const rect = measureItem(el, root!);
        return { item: el, rect, center: rect.left + rect.width/2 };
      }) : [];
      const grabbed = stops.find(stop => stop.item === item);
      const center = item === current ? cx.get() : grabbed?.center ?? cx.get();
      press = { id: e.pointerId, x: e.clientX, y: e.clientY, center, stops, dragging: false, candidate: item };
      swallowClick = false;
      raise();
    }
    function move(e: PointerEvent) {
      if (!press?.stops.length || e.pointerId !== press.id) return;
      const dx = e.clientX - press.x, dy = e.clientY - press.y;
      if (!press.dragging) {
        if (Math.abs(dx) < 5 || Math.abs(dx) <= Math.abs(dy)) return;
        root!.setPointerCapture(e.pointerId);
        press.dragging = true;
      }
      const { stops } = press;
      const position = Math.max(stops[0].center, Math.min(stops[stops.length-1].center, press.center + dx));
      const nearest = stops.reduce((a, b) =>
        Math.abs(position - a.center) <= Math.abs(position - b.center) ? a : b
      );
      press.candidate = nearest.item;
      // The original grip point stays under the finger; only release snaps to a stop.
      cx.jump(position);
      if (width.get() !== nearest.rect.width) width[reduced.matches ? 'jump' : 'set'](nearest.rect.width);
      paint();
    }
    function finish(e?: PointerEvent) {
      if (!press || (e && e.pointerId !== press.id)) return;
      const { id, candidate, dragging } = press;
      press = null;
      if (root!.hasPointerCapture(id)) root!.releasePointerCapture(id);
      if (dragging && current) {
        let destination = current;
        if (e?.type === 'pointerup') {
          swallowClick = true;
          const r = ink!.getBoundingClientRect();
          if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
            destination = candidate;
            candidate.click();
            candidate.focus({ preventScroll: true });
          }
        }
        target(measureItem(destination, root!));
      }
      settle();
    }
    function click(e: MouseEvent) {
      if (swallowClick && e.detail > 0) { swallowClick = false; e.preventDefault(); e.stopImmediatePropagation(); }
    }
    const resize = new ResizeObserver(() => { optics?.resize(); if (!press) sync(); });
    const mutations = new MutationObserver(records => {
      if (records.some(record => record.type === 'childList')) observeItems();
      sync();
    });
    function observeItems() {
      resize.disconnect();
      mutations.disconnect();
      mutations.observe(ink!, { childList: true });
      resize.observe(root!);
      resize.observe(ink!);
      for (const el of children()) {
        resize.observe(el);
        mutations.observe(el, {attributes:true, attributeFilter:observedAttributes});
      }
    }
    function preference() { lower(); sync(true); }
    optics?.resize();
    sync(true);
    observeItems();
    const blur = () => finish();
    reduced.addEventListener('change', preference); solid.addEventListener('change', preference);
    root.addEventListener('pointerdown', down); root.addEventListener('pointermove', move);
    root.addEventListener('click', click, true);
    window.addEventListener('pointerup', finish); window.addEventListener('pointercancel', finish);
    window.addEventListener('blur', blur);
    return () => {
      resize.disconnect(); mutations.disconnect(); clearTimeout(releaseTimer);
      unsubscribe.forEach(stop => stop()); values.forEach(value => value.destroy()); cancelFrame(paint);
      optics?.destroy();
      reduced.removeEventListener('change', preference); solid.removeEventListener('change', preference);
      root.removeEventListener('pointerdown', down); root.removeEventListener('pointermove', move);
      root.removeEventListener('click', click, true);
      window.removeEventListener('pointerup', finish); window.removeEventListener('pointercancel', finish);
      window.removeEventListener('blur', blur);
    };
  }, []);
  return <span ref={ref} hidden aria-hidden="true" data-slot="segmented-control-indicator"
    className="pointer-events-none absolute -z-1 rounded-full" style={{ transformOrigin: '0 0' }} />;
}
