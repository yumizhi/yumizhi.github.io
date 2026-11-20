'use client';

import { useId } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { asset } from '@/lib/paths';
import { Localized, useLanguage } from '../language';
import './evidence-figure.css';
import './sam-method.css';

const footprint = Array.from({ length: 20 }, (_, i) => ({ x: i % 5 * 6, y: Math.floor(i / 5) * 6 }));
const kept = new Set([2, 6, 13, 16]);

export function SamMethod({ original }: { original?: string }) {
  const id = useId();
  const zh = useLanguage().language === 'zh';
  const reduced = useReducedMotion();
  const draw = (start: number) => ({
    initial: reduced ? false as const : { pathLength: 0, opacity: .25 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true },
    transition: { duration: reduced ? 0 : .62, delay: reduced ? 0 : start, ease: 'easeOut' as const },
  });
  const arrow = `url(#${id}-signal)`;

  return <figure id="handoff-figure" className="paper-evidence-figure sam-method">
    <h3><Localized en="Evaluate the proposal, update the input" zh="查询在临时图上，更新从本轮输入开始" /></h3>
    <svg viewBox="0 0 620 247" role="img" aria-labelledby={`${id}-title ${id}-description`}>
      <title id={`${id}-title`}>{zh ? 'SAM 一轮任务中的图像状态' : 'The image states in one SAM task'}</title>
      <desc id={`${id}-description`}>{zh ? '支持集先从本轮输入得到临时图。查询模型在临时图上计算反馈。外层更新从本轮输入出发，随后稀疏化得到下一轮的图。' : 'Support models create a temporary proposal. The query model evaluates that proposal. Its feedback updates the original input of the round before projection yields the next sparse image.'}</desc>
      <defs>
        <radialGradient id={`${id}-support`} cx=".64" cy=".28" r=".59">
          <stop stopColor="var(--figure-blue)" stopOpacity=".16" />
          <stop offset="1" stopColor="var(--figure-blue)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-sparse`} cx=".84" cy=".71" r=".43">
          <stop stopColor="var(--figure-accent)" stopOpacity=".14" />
          <stop offset="1" stopColor="var(--figure-accent)" stopOpacity="0" />
        </radialGradient>
        <marker id={`${id}-signal`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M1 1 7 4 1 7" fill="none" stroke="context-stroke" strokeWidth="1.25" />
        </marker>
      </defs>
      <rect width="620" height="247" fill={`url(#${id}-support)`} />
      <rect width="620" height="247" fill={`url(#${id}-sparse)`} />
      <path d="M61 184H568" className="sam-method-baseline" />
      <motion.path d="M78 184 C149 166 158 79 271 68 C316 64 340 68 380 65"
        className="sam-support-path" {...draw(0)} />
      <motion.path d="M78 184 C163 176 211 163 276 176 S350 185 401 184"
        className="sam-query-path" {...draw(1)} />
      <motion.path d="M407 184 C458 184 482 184 533 184"
        className="sam-projection-path" markerEnd={arrow} {...draw(1.65)} />
      <motion.path d="M383 71 C397 117 354 127 270 126 C243 126 225 140 221 160"
        className="sam-query-signal" markerEnd={arrow}
        initial={reduced ? false : { opacity: .18 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        transition={{ duration: reduced ? 0 : .43, delay: reduced ? 0 : .68 }} />
      <g className="sam-method-labels">
        <text x="78" y="218" textAnchor="middle">{zh ? '本轮输入' : 'Round input'}</text>
        <text x="198" y="61" textAnchor="middle" className="sam-support-label">{zh ? '支持集更新' : 'Support update'}</text>
        <text x="380" y="36" textAnchor="middle">{zh ? '在临时图上查询' : 'Query the proposal'}</text>
        <text x="283" y="115" textAnchor="middle" className="sam-query-label">{zh ? '查询反馈' : 'Query feedback'}</text>
        <text x="402" y="218" textAnchor="middle">{zh ? '稠密更新' : 'Dense update'}</text>
        <text x="469" y="176" textAnchor="middle" className="sam-projection-label">{zh ? '投影' : 'Project'}</text>
        <text x="546" y="218" textAnchor="middle">{zh ? '下一轮的稀疏图' : 'Next sparse input'}</text>
      </g>
      <circle cx="78" cy="184" r="5" fill="var(--figure-ink)" />
      <circle cx="380" cy="65" r="6" fill="var(--figure-panel)" stroke="var(--figure-blue)" strokeWidth="2" />
      <g transform="translate(390 145)" className="sam-pixels">
        {footprint.map(({ x, y }, i) => <rect key={i} x={x} y={y} width="3.8" height="3.8" opacity={.26 + (i % 6) * .11} />)}
      </g>
      <g transform="translate(534 150)" className="sam-pixels">
        {footprint.map(({ x, y }, i) => <rect key={i} x={x} y={y} width="3.8" height="3.8" opacity={kept.has(i) ? .86 : .13} />)}
      </g>
      <circle cx="402" cy="184" r="4.4" fill="var(--figure-rust)" />
      <circle cx="546" cy="184" r="4.8" fill="var(--figure-accent)" />
    </svg>
    <figcaption>
      <Localized en="The dashed path carries feedback. The solid paths show changes to the image during one task." zh="虚线传递查询反馈。实线表示一轮任务中图像的两次更新及最后的投影。" />{' '}
      {original && <a href={asset(original)} target="_blank" rel="noreferrer"><Localized en="Meta-learning figure from the paper" zh="论文的元学习原图" /></a>}
    </figcaption>
  </figure>;
}
