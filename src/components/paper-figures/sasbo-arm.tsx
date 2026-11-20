'use client';

import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Localized } from '../language';
import './evidence-figure.css';
import './sasbo-arm.css';

// Schematic values show how the same uniform draws are compared against both tails.
const samples = [
  { id: 'a', p: .62, u: .17 },
  { id: 'b', p: .34, u: .76 },
  { id: 'c', p: .54, u: .46 },
  { id: 'd', p: .28, u: .87 },
  { id: 'e', p: .71, u: .35 },
  { id: 'f', p: .42, u: .52 },
];

export function SasboArm() {
  const reduced = useReducedMotion();
  const appear = (index: number) => ({
    initial: reduced ? false as const : { opacity: .18, y: -5 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: reduced ? 0 : .37, delay: reduced ? 0 : index * .18 },
  });

  return <figure id="mask-figure" className="paper-evidence-figure arm-figure">
    <h3><Localized en="One draw, two mask evaluations" zh="一次随机抽样，两次掩码评估" /></h3>
    <div className="arm-board" aria-hidden="true">
      <div className="arm-lanes">
        <div className="arm-draw-row">
          <span className="figure-label"><Localized en="Shared draw" zh="共享抽样" /></span>
          <div className="arm-samples">
            {samples.map(({ id, u }) => (
              <motion.span className="arm-track" key={id} {...appear(0)}>
                <i className="arm-dot" style={{ left: u * 100 + '%' }} />
              </motion.span>
            ))}
          </div>
        </div>
        {(['lower', 'upper'] as const).map((tail, index) => (
          <div className="arm-mask-row" data-tail={tail} key={tail}>
            <span className="figure-label"><Localized en={tail === 'lower' ? 'Lower-tail mask' : 'Upper-tail mask'} zh={tail === 'lower' ? '低端掩码' : '高端掩码'} /></span>
            <div className="arm-samples">
              {samples.map(({ id, p, u }) => {
                const selected = tail === 'lower' ? u < p : u > 1 - p;
                return (
                  <motion.span className="arm-track" data-selected={selected} key={id} {...appear(index + 1)}>
                    <span className="arm-gate" style={{ width: p * 100 + '%' }} />
                    <i className="arm-dot" style={{ left: u * 100 + '%' }} />
                  </motion.span>
                );
              })}
            </div>
            <motion.div className="arm-loss" {...appear(index + 2)}>
              <ArrowRight size={13} />
              <span>{tail === 'lower' ? 'L₋' : 'L₊'}</span>
            </motion.div>
          </div>
        ))}
      </div>
      <div className="arm-readout">
        <motion.span {...appear(3)}><Localized en="Same classifier" zh="同一个分类器" /></motion.span>
        <motion.span {...appear(4)} className="arm-estimate">
          <span>L₊ − L₋</span>
          <small><Localized en="× centered draw" zh="× 居中的随机样本" /></small>
        </motion.span>
        <motion.div className="arm-update" {...appear(5)}>
          <ArrowRight size={13} /><Localized en="Update selection probabilities" zh="更新坐标选择概率" />
        </motion.div>
      </div>
    </div>
    <figcaption><Localized
      en="The dot stays at the same position in both masks. It selects a coordinate when it falls inside the shaded tail."
      zh="同一列的圆点在两张掩码里保持原位置。圆点落在阴影尾部时，该坐标被选中。"
    /></figcaption>
  </figure>;
}
