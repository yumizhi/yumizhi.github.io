import { ArrowRight, ArrowDown, ArrowLeftRight, Network, Repeat2, ScanSearch, Scissors } from 'lucide-react';
import { Localized } from './language';
import './sparse-method-comparison.css';

function Matrix({kind}:{kind:'mask'|'values'|'result'}) {
  const selected=[2,5,11,14];
  return <div className={`algorithm-matrix matrix-${kind}`} aria-hidden="true">{Array.from({length:16},(_,i)=><i key={i} data-active={selected.includes(i)||undefined} style={kind==='values'||(kind==='result'&&selected.includes(i))?{opacity:.15+(i*7%13)/16}:undefined}/>)}</div>;
}
function Arrow(){return <ArrowRight className="algorithm-arrow" aria-hidden="true"/>;}
function Model({query=false}:{query?:boolean}){return <div className="algorithm-model" data-query={query||undefined}><Network/><Localized en={query?'Query surrogate':'Support surrogates'} zh={query?'查询模型':'支持模型'}/></div>;}
export function SparseMethodComparison({study}:{study:'sasbo'|'sam'}){
 return <figure className="algorithm-comparison">
  {study==='sasbo'?<>
   <header><span>GreedyFool</span><p><Localized en="Select locations from gradients, then prune." zh="根据梯度添加位置，再贪心删减。"/></p></header>
   <div className="algorithm-baseline"><div className="algorithm-source"><ScanSearch/><Localized en="Image gradients" zh="图像梯度"/></div><Arrow/><div className="algorithm-baseline-process"><span><Localized en="Add influential pixels" zh="添加重要像素"/></span><Arrow/><span><Localized en="Remove redundant pixels" zh="删去冗余像素"/></span></div></div>
   <header className="algorithm-proposed"><span>SASBO</span><p><Localized en="Optimize the selection and its magnitude separately." zh="将位置选择与改动幅度分开优化。"/></p></header>
   <div className="sasbo-architecture">
    <div className="algorithm-inputs"><div><Matrix kind="mask"/><span><strong>M</strong><Localized en="Binary coordinates" zh="二值坐标"/></span></div><div><Matrix kind="values"/><span><strong>E</strong><Localized en="Continuous magnitudes" zh="连续幅度"/></span></div></div>
    <Arrow/>
    <div className="algorithm-engine"><strong><Localized en="Alternating optimization" zh="交替优化"/></strong><div className="algorithm-operation"><b> M </b><span><Localized en="Learn selection probabilities" zh="学习位置选择概率"/><small>Bernoulli · ARM</small></span></div><ArrowLeftRight className="algorithm-exchange"/><div className="algorithm-operation"><b> E </b><span><Localized en="Update selected magnitudes" zh="更新选定位置的幅度"/><small><Localized en="Gradient descent" zh="梯度下降"/></small></span></div></div>
    <Arrow/>
    <div className="algorithm-output"><Matrix kind="result"/><strong>M ⊙ E</strong><span><Localized en="Sparse perturbation" zh="稀疏扰动"/></span></div>
   </div>
   <div className="algorithm-budget"><Scissors/><span><strong><Localized en="Binary search" zh="二分搜索"/></strong><Localized en="Reduce the coordinate budget while retaining attack success." zh="缩减坐标预算，保留仍能成功的攻击。"/></span></div>
   <figcaption><Localized en="Schematic matrices illustrate the factorization. Selected coordinates and magnitudes are updated alternately before the final budget search." zh="矩阵示意扰动的分解方式。坐标与幅度交替更新，最后搜索更小的有效预算。"/></figcaption>
  </>:<>
   <header><span>SA</span><p><Localized en="One surrogate supplies the optimization gradients." zh="优化梯度来自单一替代模型。"/></p></header>
   <div className="algorithm-baseline"><div className="algorithm-source"><Network/>VGG19</div><Arrow/><div className="algorithm-baseline-process"><span><Localized en="Optimize the perturbation" zh="优化扰动"/></span><Arrow/><span><Localized en="Evaluate on unseen models" zh="在未知模型上评估"/></span></div></div>
   <header className="algorithm-proposed"><span>SAM</span><p><Localized en="Sample support and query roles from known surrogates." zh="从已知替代模型中采样支持与查询角色。"/></p></header>
   <div className="sam-architecture">
    <div className="sam-inputs"><Model/><Arrow/><Model query/><Arrow/></div>
    <div className="algorithm-engine sam-engine"><strong><Localized en="One meta-learning task" zh="一个元学习任务"/></strong><div className="algorithm-operation"><span><Localized en="Support update" zh="支持集更新"/><small><Localized en="Combine support-model gradients" zh="综合支持模型的梯度"/></small></span></div><ArrowDown className="sam-step-arrow"/><div className="algorithm-operation"><span><Localized en="Query feedback → meta-update" zh="查询反馈 → 元更新"/><small><Localized en="Evaluate transfer within the surrogate pool" zh="在替代模型池内检验迁移"/></small></span></div></div>
   </div>
   <div className="sam-output-flow"><div><Scissors/><Localized en="Project to the sparse budget" zh="投影回稀疏预算"/></div><Arrow/><div><Repeat2/><Localized en="Resample model roles" zh="重新采样模型角色"/></div></div>
   <div className="sam-evaluation"><Network/><span><strong><Localized en="Final evaluation: unseen classifiers" zh="最终评估：未知分类器"/></strong><Localized en="No target gradients enter the optimization." zh="目标模型不向优化过程提供梯度。"/></span></div>
   <figcaption><Localized en="The query model is held out from the support set for each task. It remains a known surrogate; final black-box targets are separate." zh="每轮任务的查询模型独立于支持集，但仍属于已知替代模型。最终黑盒评估使用另一组模型。"/></figcaption>
  </>}
 </figure>;
}
