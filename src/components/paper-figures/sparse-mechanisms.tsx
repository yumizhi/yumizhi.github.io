'use client';

import { ArrowDown, ArrowRight, Network, Repeat2 } from 'lucide-react';
import type { CSSProperties } from 'react';
import { LayoutGroup, motion } from 'motion/react';
import { asset } from '@/lib/paths';
import { Localized } from '../language';
import { FigurePlayer } from './figure-player';
import './sparse-mechanisms.css';

const sasboChapters = [
  {
    label: { en: 'Score', zh: '学习概率' },
    description: { en: 'Each location has a selection probability. The shaded cells show relative preference in this schematic.', zh: '每个坐标都有一个被选中的概率。格子的深浅表示示意中的相对倾向。' },
  },
  {
    label: { en: 'Select', zh: '确定选区' },
    description: { en: 'A budget turns those probabilities into a binary mask. Perturbation values are updated only at the selected coordinates.', zh: '在预算限制下，选择概率变成一张二值掩码。只有被选中的坐标才更新扰动幅度。' },
  },
  {
    label: { en: 'Revisit', zh: '重新选择' },
    description: { en: 'After the magnitudes change, a new round can select different coordinates. The outlined cells show locations left behind by the previous mask.', zh: '幅度更新后，新一轮可以选中不同的坐标。空心格表示上一轮选中、这轮放弃的位置。' },
  },
  {
    label: { en: 'Tighten', zh: '缩减预算' },
    description: { en: 'The last search tries smaller coordinate budgets and retains a smaller mask when the perturbation remains effective.', zh: '最后尝试更小的坐标预算。若缩减后的扰动仍然有效，就保留更小的掩码。' },
  },
];

const cells = Array.from({ length: 36 }, (_, i) => i);
const firstMask = [3, 9, 13, 16, 21, 26, 31];
const revisedMask = [3, 8, 13, 16, 20, 25, 31];
const compactMask = [8, 13, 20, 25, 31];

function SparseMaskScene({ step }: { step: number }) {
  const candidate = step >= 2 ? revisedMask : firstMask;
  const selected = step === 0 ? [] : step === 3 ? compactMask : candidate;
  return <div className="mask-experiment" aria-hidden="true">
    <div className="mask-frame" data-highlight={step === 0 || step === 2}>
      <span className="figure-label"><Localized en="Selection probabilities" zh="位置选择概率" /></span>
      <div className="mask-grid">
        {cells.map(i => <span key={i} className="mask-score" style={{
          opacity: candidate.includes(i) ? .6 + (i % 3) * .14 : .05 + ((i * 7) % 11) * .022,
        }} />)}
      </div>
    </div>
    <ArrowRight className="mask-arrow" />
    <div className="mask-frame" data-highlight={step === 1}>
      <span className="figure-label"><Localized en="Binary mask" zh="二值掩码" /></span>
      <div className="mask-grid">
        {cells.map(i => <span key={i} className="mask-cell" data-selected={selected.includes(i)}
          data-old={step === 2 && firstMask.includes(i) && !selected.includes(i)} />)}
      </div>
    </div>
    <ArrowRight className="mask-arrow" />
    <div className="mask-frame" data-highlight={step === 3}>
      <span className="figure-label"><Localized en="Applied perturbation" zh="实际施加的位置" /></span>
      <div className="mask-image">
        <img src={asset('/images/sasbo-dog-clean.webp')} alt="" width={139} height={139} loading="lazy" />
        <div className="mask-grid mask-overlay">
          {cells.map(i => <span key={i} data-selected={selected.includes(i)} />)}
        </div>
      </div>
    </div>
  </div>;
}

const samChapters = [
  {
    label: { en: 'Support', zh: '支持集更新' },
    description: { en: 'The support classifiers see one image. Their gradient signals are combined to update its perturbation.', zh: '支持集模型看的是同一张图。它们各自给出的梯度合在一起，用来更新图像扰动。' },
  },
  {
    label: { en: 'Query', zh: '查询集反馈' },
    description: { en: 'The query classifier checks the updated image. Its feedback enters the next perturbation, even though it was absent from the support update.', zh: '查询模型用更新后的图像检验这次改动。它没有参加刚才的支持集更新，但反馈会进入新的扰动。' },
  },
  {
    label: { en: 'Project', zh: '稀疏化' },
    description: { en: 'Projection keeps the parts of the dense update that best fit the pixel and magnitude limits. The input stays within budget for the next task.', zh: '投影在像素数量和幅度上限内，尽可能保留稠密更新的效果。得到的图像可以带着这个预算进入下一轮。' },
  },
  {
    label: { en: 'Resample', zh: '轮换模型' },
    description: { en: 'The model roles are sampled again. An independent group of classifiers is reserved for evaluation after optimization.', zh: '下一轮重新分配模型角色。优化结束后，才把图像交给独立的一组分类器评估。' },
  },
];

function Model({ name, reduced }: { name: string; reduced: boolean }) {
  return <motion.span layoutId={reduced ? undefined : name} className="sam-model" transition={{ duration: reduced ? 0 : .5, ease: [.22, 1, .36, 1] }}>
    <Network size={13} />
    <Localized en={`Model ${name}`} zh={`模型 ${name}`} />
  </motion.span>;
}

function ModelHandoff({ step, reduced }: { step: number; reduced: boolean }) {
  const resampled = step === 3;
  const support = resampled ? ['B', 'C'] : ['A', 'B'];
  const query = resampled ? 'A' : 'C';
  return <LayoutGroup>
    <div className="sam-handoff" aria-hidden="true" data-step={step}>
      <div className="sam-handoff-lane">
        <div className="sam-role" data-current={step === 0 || resampled}>
          <div className="figure-label"><Localized en="Support" zh="支持集" /></div>
          <div className="sam-role-models">{support.map(name => <Model key={name} name={name} reduced={reduced} />)}</div>
        </div>
        <ArrowRight className="sam-flow-arrow" data-on={step === 0 || resampled} />
        <div className="sam-round-patch" data-current={step === 2}>
          <div className="figure-label"><Localized en="Image update" zh="图像更新" /></div>
          <div className="sam-patch-grid">
            {cells.map(i => <span key={i} data-hot={step >= 2 ? compactMask.includes(i) : (i % 4 !== 2)}
              style={{ '--cell-tone': .23 + ((i * 17) % 10) * .065 } as CSSProperties} />)}
          </div>
        </div>
        <ArrowRight className="sam-flow-arrow" data-on={step === 1} />
        <div className="sam-role sam-query-role" data-current={step === 1 || resampled}>
          <div className="figure-label"><Localized en="Query" zh="查询集" /></div>
          <div className="sam-role-models"><Model key={query} name={query} reduced={reduced} /></div>
        </div>
      </div>
      <div className="sam-feedback-rail">
        <div className="sam-feedback" data-current={step === 1 || resampled}><Repeat2 size={15} /><Localized en="Feedback carried into the next task" zh="反馈带入下一轮任务" /></div>
        <ArrowDown className="sam-evaluation-arrow" size={17} />
        <div className="sam-final-evaluation"><Network size={15} /><Localized en="Independent evaluation after optimization" zh="优化结束后评估独立模型" /></div>
      </div>
    </div>
  </LayoutGroup>;
}

export function SparseMaskFigure() {
  return <FigurePlayer id="mask-figure" title={{ en: 'Learning where to make a change', zh: '从一张概率图到一组坐标' }} chapters={sasboChapters}>
    {step => <SparseMaskScene step={step} />}
  </FigurePlayer>;
}

export function SamHandoffFigure() {
  return <FigurePlayer id="handoff-figure" title={{ en: 'One perturbation, different model roles', zh: '同一个扰动在不同模型之间接力' }} chapters={samChapters}>
    {(step, reduced) => <ModelHandoff step={step} reduced={reduced} />}
  </FigurePlayer>;
}
