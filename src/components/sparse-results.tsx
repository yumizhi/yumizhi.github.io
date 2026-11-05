'use client';

import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { Localized } from './language';

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
const targets = ['ResNeXt50 32×4d','ResNet50','DenseNet161','GoogLeNet','MobileNetV2','MnasNet1.0'];
function transferRows(sa:number[],sam:number[]){
  const rate=(n:number)=>n.toFixed(1)+'%';
  const mean=(values:number[])=>values.reduce((a,b)=>a+b)/values.length;
  return [...targets.map((name,i)=>[name,rate(sa[i]),rate(sam[i])]),
    ['Mean',rate(mean(sa)),rate(mean(sam))]];
}
const samColumns = [{en:'Black-box target',zh:'黑盒目标模型'},{en:'SA',zh:'SA'},{en:'SAM',zh:'SAM'}];
const sam:Dataset[] = [
  {
    id:'50',tab:{en:'50 pixels · ε = 255',zh:'50 像素 · ε = 255'},
    explanation:{en:'With a budget of 50 pixels, mean attack success on the six unseen models is 85.5% for SAM and 68.4% for the VGG19-only SA baseline.',zh:'预算为 50 个像素时，SAM 在六个未参与优化的模型上的平均成功率为 85.5%，仅使用 VGG19 的 SA 基线为 68.4%。'},
    caption:{en:'Table VI · CIFAR-10 untargeted attack success, ℓ₀ = 50, ε = 255',zh:'表 VI · CIFAR-10 非定向攻击成功率，ℓ₀ = 50，ε = 255'},
    headings:samColumns, rows:transferRows([67.2,64.3,68.2,73.8,67.3,69.8],[88.5,88.1,91.5,86.6,79.4,78.8]),
  },
  {
    id:'300',tab:{en:'300 pixels · ε = 16',zh:'300 像素 · ε = 16'},
    explanation:{en:'This setting allows more pixels to change but limits each change to ε = 16. SAM transfers more often than the single-model SA baseline on all six targets.',zh:'这一设置允许修改更多像素，同时把每处改动的幅度限制在 ε = 16。在六个目标模型上，SAM 的迁移成功率均高于单模型 SA 基线。'},
    caption:{en:'Table VI · CIFAR-10 untargeted attack success, ℓ₀ = 300, ε = 16',zh:'表 VI · CIFAR-10 非定向攻击成功率，ℓ₀ = 300，ε = 16'},
    headings:samColumns,rows:transferRows([31.3,23.2,25.8,20.8,24.4,28.2],[43.9,50.8,48.5,45.8,43.3,57]),
  },
];

export function SparseResults({study}:{study:'sasbo'|'sam'}){
  const datasets=study==='sasbo'?sasbo:sam;
  const [selected,setSelected]=useState(datasets[0].id);
  const reduced=useReducedMotion();
  return <LayoutGroup><Tabs.Root className="sparse-results" value={selected} onValueChange={setSelected}>
    <Tabs.List aria-label="Experiment setting" className="tide-variant-list">
      {datasets.map(d=><Tabs.Trigger key={d.id} value={d.id}>
        {d.id===selected&&<motion.i layoutId="experiment" transition={{duration:reduced?0:.24}}/>}
        <span><Localized {...d.tab}/></span>
      </Tabs.Trigger>)}
    </Tabs.List>
    {datasets.map(d=><Tabs.Content key={d.id} value={d.id}>
      <p className="tide-prose"><Localized {...d.explanation}/></p>
      <div className="tide-table-wrap"><table>
        <caption><Localized {...d.caption}/></caption>
        <thead><tr>{d.headings.map(h=><th scope="col" key={h.en}><Localized {...h}/></th>)}</tr></thead>
        <tbody>{d.rows.map(([name,...values])=><tr key={name}><th scope="row">{name==='Mean'?<Localized en="Mean" zh="平均"/>:name}</th>
          {values.map((value,i)=><td key={i}>{value}</td>)}</tr>)}</tbody>
      </table></div>
    </Tabs.Content>)}
  </Tabs.Root></LayoutGroup>;
}
