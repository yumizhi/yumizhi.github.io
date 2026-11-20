'use client';

import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { Localized } from './language';
import { ComparisonChart } from './comparison-chart';

type Text = {en:string; zh:string};
type Dataset = {
  id:string; tab:Text; explanation:Text; caption:Text;
  headings:Text[]; rows:string[][];
};
const sasboColumns = [
  {en:'Method',zh:'方法'}, {en:'Success rate',zh:'攻击成功率'}, {en:'Mean ℓ₀',zh:'平均 ℓ₀'},
];
const sasbo:Dataset[] = [
  {
    id:'targeted', tab:{en:'Targeted',zh:'定向攻击'},
    explanation:{
      en:'Each method reaches the prescribed target class on every example. SASBO uses a mean ℓ₀ of 14.88, compared with 48.99 for GreedyFool.',
      zh:'三种方法都能把分类结果改成指定类别。区别在于需要修改多少：SASBO 的平均 ℓ₀ 为 14.88，GreedyFool 为 48.99。',
    },
    caption:{en:'Table 3 · Targeted attacks on CIFAR-10, ε = 255',zh:'表 3 · CIFAR-10 定向攻击，ε = 255'},
    headings:sasboColumns, rows:[['PGD-ℓ₀ + ℓ∞','100%','54.03'],['GreedyFool','100%','48.99'],['SASBO','100%','14.88']],
  },
  {
    id:'untargeted', tab:{en:'Untargeted',zh:'非定向攻击'},
    explanation:{
      en:'When any incorrect class counts as a success, all four methods reach 100%. SASBO reduces mean ℓ₀ to 3.95, compared with 12.29 for GreedyFool.',
      zh:'当任意错误类别都算攻击成功时，四种方法的成功率均为 100%。SASBO 的平均 ℓ₀ 降至 3.95，GreedyFool 为 12.29。',
    },
    caption:{en:'Table 1 · Untargeted attacks on CIFAR-10, ε = 255',zh:'表 1 · CIFAR-10 非定向攻击，ε = 255'},
    headings:sasboColumns, rows:[['PGD-ℓ₀ + ℓ∞','100%','48.01'],['SparseFool','100%','22.03'],['GreedyFool','100%','12.29'],['SASBO','100%','3.95']],
  },
];
export function SparseResults(){
  const datasets = sasbo;
  const [selected,setSelected]=useState(datasets[0].id);
  const reduced=useReducedMotion();
  const d=datasets.find(dataset=>dataset.id===selected)!;
  return <LayoutGroup><Tabs.Root className="sparse-results" value={selected} onValueChange={setSelected}>
    <Tabs.List aria-label="Experiment setting" className="tide-variant-list">
      {datasets.map(d=><Tabs.Trigger key={d.id} value={d.id}>
        {d.id===selected&&<motion.i layoutId="experiment" transition={{duration:reduced?0:.24}}/>}
        <span><Localized {...d.tab}/></span>
      </Tabs.Trigger>)}
    </Tabs.List>
    <Tabs.Content value={selected}>
      <p className="tide-prose"><Localized {...d.explanation}/></p>
      <ComparisonChart
        title={{en:'Fewer changes, the same success rate',zh:'同样成功，改动更少'}}
        note={{en:'Mean ℓ₀ · CIFAR-10 · ε = 255 · 100% success for all methods · lower is better',zh:'平均 ℓ₀ · CIFAR-10 · ε = 255 · 均为 100% 成功率 · 越低越好'}}
        series={[{label:{en:'Mean ℓ₀',zh:'平均 ℓ₀'}}]}
        rows={d.rows.map(([label,,value])=>({label,values:[Number(value)],accent:label==='SASBO'}))}
        maximum={60} decimals={2}/>
      <details className="result-data"><summary><Localized en="View the numerical results" zh="查看完整数值"/></summary>
      <div className="tide-table-wrap"><table>
        <caption><Localized {...d.caption}/></caption>
        <thead><tr>{d.headings.map(h=><th scope="col" key={h.en}><Localized {...h}/></th>)}</tr></thead>
        <tbody>{d.rows.map(([name,...values])=><tr key={name}><th scope="row">{name}</th>
          {values.map((value,i)=><td key={i}>{value}</td>)}</tr>)}</tbody>
      </table></div>
      </details>
    </Tabs.Content>
  </Tabs.Root></LayoutGroup>;
}
