"use client";

// Vendored from the coss UI registry (MIT). See LICENSE in this directory.

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform, useVelocity } from "motion/react";
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
        {children}
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
      "[:has(>[data-slot=segmented-control-indicator]:not([hidden]))>&]:bg-transparent! [:has(>[data-slot=segmented-control-indicator]:not([hidden]))>&]:shadow-none!",
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

const MAX_LAYOUT_ROUNDING_ERROR = 2;

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

  const isUndistorted =
    Math.abs(rectLeft - item.offsetLeft) <= MAX_LAYOUT_ROUNDING_ERROR &&
    Math.abs(rectTop - item.offsetTop) <= MAX_LAYOUT_ROUNDING_ERROR;

  return {
    height,
    left: isUndistorted ? rectLeft : item.offsetLeft,
    top: isUndistorted ? rectTop : item.offsetTop,
    width,
  };
}

// Centre and footprint settle independently. A second tap updates the same
// springs, carrying their current position and velocity into the next move.
const travel = { stiffness: 580, damping: 36, mass: .82 };
const settle = { stiffness: 480, damping: 26, mass: .8 };
const itemSelector = ':scope > a, :scope > button';

function SegmentedControlIndicator(): React.ReactElement {
  const ref = React.useRef<HTMLSpanElement>(null);
  const cx = useSpring(0, travel);
  const cy = useSpring(0, travel);
  const width = useSpring(1, settle);
  const height = useSpring(1, settle);
  const lift = useSpring(0, settle);
  const baseW = useMotionValue(1);
  const baseH = useMotionValue(1);
  const elastic = useMotionValue(0);
  const vx = useVelocity(cx);
  const vy = useVelocity(cy);
  const x = useTransform(() => cx.get() - baseW.get() / 2);
  const y = useTransform(() => cy.get() - baseH.get() / 2);
  const scaleX = useTransform(() => width.get() / baseW.get() *
    (1 + elastic.get() * (.145 * Math.tanh(Math.abs(vx.get()) / 680) + .045 * lift.get())));
  const scaleY = useTransform(() => height.get() / baseH.get() *
    (1 + elastic.get() * (.145 * Math.tanh(Math.abs(vy.get()) / 680) + .07 * lift.get())));

  React.useLayoutEffect(() => {
    const thumb = ref.current;
    const root = thumb?.parentElement;
    if (!root || !thumb) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const glass = root.hasAttribute('data-glass-selection');
    const scrub = root.hasAttribute('data-glass-scrub');
    let last: ActiveItemRect | null = null;
    let current: HTMLElement | null = null;
    let press: { id: number; x: number; y: number; dragging: boolean; candidate: HTMLElement } | null = null;
    let stops: { item: HTMLElement; center: number; right: number }[] = [];
    let trackLeft = 0;
    let releaseTimer = 0, followFrame = 0, swallowClick = false;
    const children = () => Array.from(root.querySelectorAll<HTMLElement>(itemSelector));
    function target(item: HTMLElement | null, snap = false) {
      if (!item || !item.offsetWidth) { thumb!.hidden = true; last = null; return; }
      const rect = measureItem(item, root!);
      if (!snap && isSameRect(rect, last)) return;
      const jump = snap || !last || reduced.matches;
      const method = jump ? 'jump' : 'set';
      baseW.set(rect.width); baseH.set(rect.height);
      cx[method](rect.left + rect.width / 2); cy[method](rect.top + rect.height / 2);
      width[method](rect.width); height[method](rect.height);
      last = rect; thumb!.hidden = false;
    }
    function raise() {
      if (!glass || reduced.matches) return;
      clearTimeout(releaseTimer);
      thumb!.dataset.lifted = '';
      lift.set(1);
    }
    function settleLift() {
      clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(() => {
        delete thumb!.dataset.lifted; lift.set(0);
      }, reduced.matches ? 0 : 125);
    }
    function sync(snap = false) {
      const item = root!.querySelector<HTMLElement>(':scope > [data-selected="true"]') ??
        root!.querySelector<HTMLElement>(activeItemSelector);
      const changed = item !== current;
      if (current && changed && !press && !snap) { raise(); settleLift(); }
      current = item;
      if (!press) target(item, snap);
    }
    function preference() {
      elastic.set(glass && !reduced.matches ? 1 : 0);
      if (reduced.matches) { lift.jump(0); delete thumb!.dataset.lifted; }
      sync(true);
    }
    function down(e: PointerEvent) {
      if (!glass || !e.isPrimary || e.button || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const item = (e.target as Element).closest<HTMLElement>('button,a');
      if (!item || item.parentElement !== root) return;
      press = { id:e.pointerId, x:e.clientX, y:e.clientY, dragging:false, candidate:item };
      swallowClick = false;
      raise(); target(item);
    }
    function move(e: PointerEvent) {
      if (!scrub || !press || e.pointerId !== press.id) return;
      const dx = e.clientX - press.x, dy = e.clientY - press.y;
      if (!press.dragging) {
        if (Math.abs(dx) < 6 || Math.abs(dx) <= Math.abs(dy)) return;
        trackLeft = root!.getBoundingClientRect().left;
        stops = children().map(item => {
          const bounds = item.getBoundingClientRect();
          return { item, center: bounds.left + bounds.width / 2 - trackLeft, right: bounds.right };
        });
        if (!stops.length) return;
        root!.setPointerCapture(e.pointerId);
        press.dragging = true;
      }
      const nearest = stops.find(stop => e.clientX <= stop.right) ?? stops[stops.length - 1];
      if (nearest.item !== press.candidate) { press.candidate = nearest.item; target(nearest.item); }
      // Between detents the glass follows the finger; selection commits on lift.
      const position = Math.max(stops[0].center, Math.min(stops[stops.length - 1].center, e.clientX - trackLeft));
      cx[reduced.matches ? 'jump' : 'set'](position);
    }
    function finish(e?: PointerEvent) {
      if (!press || (e && e.pointerId !== press.id)) return;
      const { dragging, candidate, id } = press;
      press = null;
      if (root!.hasPointerCapture(id)) root!.releasePointerCapture(id);
      if (dragging && last) {
        cx[reduced.matches ? 'jump' : 'set'](last.left + last.width / 2);
        if (e?.type === 'pointerup') {
          swallowClick = true;
          const bounds = root!.getBoundingClientRect();
          if (e.clientY >= bounds.top && e.clientY <= bounds.bottom) {
            candidate.click();
            candidate.focus({ preventScroll: true });
          }
        }
      }
      settleLift();
      cancelAnimationFrame(followFrame);
      followFrame = requestAnimationFrame(() => sync());
    }
    function click(e: MouseEvent) {
      if (swallowClick && e.detail > 0) {
        e.preventDefault(); e.stopImmediatePropagation(); swallowClick = false;
      }
    }
    preference();
    const resize = new ResizeObserver(() => {
      if (!press && current && !isSameRect(measureItem(current, root), last)) sync(true);
    });
    resize.observe(root);
    const mutations = new MutationObserver(records => {
      if (records.some(record => record.type === 'childList')) observeItems();
      sync();
    });
    function observeItems() {
      for (const child of children()) {
        resize.observe(child);
        mutations.observe(child, { attributes: true, attributeFilter: observedAttributes });
      }
    }
    observeItems();
    mutations.observe(root, { childList: true });
    const blur = () => finish();
    reduced.addEventListener('change', preference);
    root.addEventListener('pointerdown', down);
    root.addEventListener('pointermove', move);
    root.addEventListener('click', click, true);
    window.addEventListener('pointerup', finish);
    window.addEventListener('pointercancel', finish);
    window.addEventListener('blur', blur);
    return () => {
      resize.disconnect(); mutations.disconnect();
      clearTimeout(releaseTimer); cancelAnimationFrame(followFrame);
      reduced.removeEventListener('change', preference);
      root.removeEventListener('pointerdown', down); root.removeEventListener('pointermove', move);
      root.removeEventListener('click', click, true);
      window.removeEventListener('pointerup', finish); window.removeEventListener('pointercancel', finish);
      window.removeEventListener('blur', blur);
    };
  }, [cx, cy, width, height, lift, baseW, baseH, elastic]);

  return <motion.span ref={ref} hidden aria-hidden="true" data-slot="segmented-control-indicator"
    className="pointer-events-none absolute -z-1 rounded-full"
    style={{ x, y, width: baseW, height: baseH, scaleX, scaleY }} />;
}
