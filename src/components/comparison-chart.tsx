'use client';

import { useEffect, useRef } from 'react';
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { Localized } from './language';
import './research-visuals.css';

type Text = { en: string; zh: string };
type Series = { label: Text; accent?: boolean };
type Row = { label: string; values: number[]; accent?: boolean };

function Value({ value, decimals, suffix }: { value: number; decimals: number; suffix: string }) {
  const reduced = useReducedMotion();
  const current = useMotionValue(value);
  const formatted = useTransform(current, n => n.toFixed(decimals) + suffix);
  useEffect(() => {
    const control = animate(current, value, { duration: reduced ? 0 : .55, ease: [.22, 1, .36, 1] });
    return () => control.stop();
  }, [current, value, reduced]);
  return <span className="comparison-value"><span className="sr-only">{value.toFixed(decimals) + suffix}</span><motion.span aria-hidden="true">{formatted}</motion.span></span>;
}

export function ComparisonChart({ title, note, rows, series, maximum, decimals = 1, suffix = '%' }: {
  title: Text; note: Text; rows: Row[]; series: Series[]; maximum: number; decimals?: number; suffix?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { once: true, amount: .2 });
  const reduced = useReducedMotion();
  return <figure className="comparison-chart" ref={ref}>
    <figcaption><strong><Localized {...title}/></strong><span><Localized {...note}/></span></figcaption>
    {series.length > 1 && <div className="comparison-legend">{series.map(s => <span key={s.label.en}><i data-accent={s.accent || undefined}/><Localized {...s.label}/></span>)}</div>}
    <div className="comparison-rows">
      {rows.map(row => <motion.div layout="position" transition={{ duration: reduced ? 0 : .35 }} className="comparison-row" key={row.label}>
        <span className="comparison-label" data-accent={row.accent || undefined}>{row.label}</span>
        <div className="comparison-bars">{row.values.map((value, i) => <div className="comparison-bar-line" key={series[i].label.en}>
          <span className="sr-only"><Localized {...series[i].label}/>: </span>
          <div className="comparison-track" aria-hidden="true"><motion.div className="comparison-fill" data-accent={row.accent || series[i].accent || undefined}
            initial={false} animate={{ width: visible || reduced ? `${value / maximum * 100}%` : '0%' }}
            transition={{ duration: reduced ? 0 : .6, ease: [.22, 1, .36, 1] }}/></div>
          <Value value={value} decimals={decimals} suffix={suffix}/>
        </div>)}</div>
      </motion.div>)}
    </div>
    <div className="comparison-axis" aria-hidden="true"><span>0</span><span>{maximum / 2}{suffix}</span><span>{maximum}{suffix}</span></div>
  </figure>;
}
