import type { ReactNode } from 'react';
import { Waves, Type, Fingerprint, History, ChartNoAxesCombined, Layers } from 'lucide-react';
import { Localized } from '../language';
import './guidance-comparison.css';

type Label={en:string;zh:string};
function Node({title,detail,icon,className='',style}:{title:Label;detail:Label;icon?:ReactNode;className?:string;style?:React.CSSProperties}){
 return <div className={`guide-node ${icon?'guide-input':''} ${className}`} style={style}>{icon&&<span className="guide-icon">{icon}</span>}<div><strong><Localized {...title}/></strong><p><Localized {...detail}/></p></div></div>;
}
function Wires({after=false}:{after?:boolean}){
 return <svg className="guide-wires" viewBox={after?'0 0 656 394':'0 0 656 180'} aria-hidden="true">
   <defs><marker id={after?'guide-after-arrow':'guide-before-arrow'} viewBox="0 0 7 8" refX="7" refY="4" markerWidth="7" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L7 4L0 8Z" fill="context-stroke"/></marker></defs>
   <g fill="none" strokeWidth="1.25" strokeLinejoin="round" markerEnd={`url(#${after?'guide-after-arrow':'guide-before-arrow'})`}>
    {after?<>
      <path d="M200 26H224"/><path d="M528 26H552"/>
      <path className="guide-accent-wire" d="M200 164H236"/>
      <path className="guide-accent-wire" d="M200 224H236"/>
      <path className="guide-accent-wire" d="M200 284H236"/>
      <path className="guide-accent-wire" d="M376 190V198"/>
      <path className="guide-accent-wire" d="M376 250V258"/>
      <path className="guide-accent-wire" d="M516 284H552"/>
      <path d="M604 322V362Q604 368 598 368H528"/>
    </>:<>{[26,90,154].map(y=><g key={y}><path d={`M200 ${y}H224`}/><path d={`M528 ${y}H552`}/></g>)}</>}
   </g>
 </svg>;
}
const predictions=[
 {title:{en:'Base prediction',zh:'基础预测'},detail:{en:'Unconditional U-Net',zh:'无条件 U-Net 预测'},icon:<Waves size={16}/>,method:{en:'Base component',zh:'基础分量'},description:{en:'Unconditional noise prediction',zh:'保留无条件噪声预测'}},
 {title:{en:'Text residual',zh:'文本残差'},detail:{en:'Text minus base',zh:'文本预测减去无条件预测'},icon:<Type size={16}/>,method:{en:'Text guidance',zh:'文本引导'},description:{en:'Fixed text-guidance scale',zh:'使用固定的文本引导系数'}},
 {title:{en:'Watermark residual',zh:'水印残差'},detail:{en:'Watermark minus base',zh:'水印预测减去基础预测'},icon:<Fingerprint size={16}/>,method:{en:'Watermark guidance',zh:'水印引导'},description:{en:'Fixed watermark-guidance scale',zh:'使用固定的水印引导系数'}},
];
export function GuidanceComparison(){
 return <figure className="guidance-comparison" id="guidance-comparison">
  <figcaption className="guide-caption"><Localized en="Guidance after watermark injection" zh="水印注入后的引导方式"/></figcaption>
  <div className="guide-mobile">
    <section className="guide-mobile-baseline">
      <h3><Localized en="Fixed guidance" zh="固定引导"/></h3>
      <p><Localized en="Base + text + watermark predictions" zh="基础预测 + 文本残差 + 水印残差"/></p>
      <span className="guide-mobile-arrow" aria-hidden="true">↓</span>
      <div className="guide-mobile-step"><strong><Localized en="Apply fixed weights" zh="使用固定的引导权重"/></strong><p><Localized en="Reuse the same weights at each step" zh="后续每一步沿用相同权重"/></p></div>
      <span className="guide-mobile-arrow" aria-hidden="true">↓</span>
      <p className="guide-mobile-output"><Localized en="DDIM sampler → next latent" zh="DDIM 采样器 → 下一步潜变量"/></p>
    </section>
    <section className="guide-mobile-tide">
      <h3>TIDE</h3>
      <p><Localized en="Recompute after every denoising step" zh="在注入后的每一步重新计算"/></p>
      <ol>
        <li><small><Localized en="Recent text residuals" zh="近期文本残差"/></small><strong><Localized en="Estimate the text subspace" zh="估计文本引导子空间"/></strong></li>
        <li><small><Localized en="Current watermark residual" zh="当前水印残差"/></small><strong><Localized en="Remove its aligned component" zh="去掉与文本子空间对齐的分量"/></strong></li>
        <li><small><Localized en="Curvature, overlap and strength" zh="轨迹曲率、方向重合与残差强度"/></small><strong><Localized en="Allocate an adaptive budget" zh="自适应分配引导预算"/></strong></li>
      </ol>
      <p className="guide-mobile-combine"><Localized en="Combine with the base and text branches; retain a minimum text budget." zh="与基础、文本分支组合，并为文本保留最低引导预算。"/></p>
      <span className="guide-mobile-arrow" aria-hidden="true">↓</span>
      <p className="guide-mobile-output"><Localized en="DDIM sampler → next latent" zh="DDIM 采样器 → 下一步潜变量"/></p>
    </section>
  </div>
  <div className="guide-scroll" tabIndex={0} aria-label="Architecture comparison">
   <div className="guide-canvas">
    <header className="guide-heading"><h3><Localized en="Fixed guidance" zh="固定引导"/></h3><p><Localized en="The same weighting rule is used throughout the remaining denoising steps." zh="在后续去噪步骤中，沿用相同的引导权重。"/></p></header>
    <div className="guide-before-board">
      {predictions.map((p,i)=><div className="guide-before-row" key={p.title.en} style={{gridRow:i+1}}><Node title={p.title} detail={p.detail} icon={p.icon}/><Node title={p.method} detail={p.description}/></div>)}
      <div className="guide-sampler"><span>DDIM</span><span><Localized en="sampler" zh="采样器"/></span></div>
      <Wires/>
    </div>
    <div className="guide-divider"/>
    <header className="guide-heading guide-heading-after"><h3>TIDE</h3><p><Localized en="Preserve the text branch. Reallocate the guidance budget at every step." zh="保留文本分支，逐步分配文本与水印的引导预算。"/></p></header>
    <div className="guide-after-board">
      <Node className="guide-unchanged-input" title={{en:'Base + text',zh:'基础与文本分支'}} detail={{en:'Unconditional and text predictions',zh:'无条件预测与文本残差'}} icon={<Layers size={16}/>}/>
      <Node className="guide-unchanged" title={{en:'Text-guided contribution',zh:'文本引导分量'}} detail={{en:'Reserve a minimum text budget',zh:'为文本保留最低引导预算'}}/>
      <div className="guide-controller">
       <header><h4><Localized en="Trajectory-aware control" zh="轨迹感知控制"/></h4><p><Localized en="Applied at every step after injection" zh="注入后的每一步都执行"/></p></header>
       <Node title={{en:'Estimate the text subspace',zh:'估计文本引导子空间'}} detail={{en:'Use the recent text-guidance directions',zh:'使用近期的文本引导方向'}}/>
       <Node title={{en:'Remove the aligned component',zh:'去除对齐分量'}} detail={{en:'Keep the complementary residual',zh:'保留水印残差中与之互补的分量'}}/>
       <Node title={{en:'Set the guidance budget',zh:'分配引导预算'}} detail={{en:'Share the total budget with the text branch',zh:'与文本分支分配总引导预算'}}/>
      </div>
      <Node className="guide-history" title={{en:'Text residuals',zh:'文本残差'}} detail={{en:'Recent sampling steps',zh:'来自近期采样步骤'}} icon={<History size={16}/>}/>
      <Node className="guide-watermark" title={{en:'Watermark residual',zh:'水印残差'}} detail={{en:'Current sampling step',zh:'来自当前采样步骤'}} icon={<Fingerprint size={16}/>}/>
      <Node className="guide-statistics" title={{en:'Local trajectory',zh:'局部轨迹'}} detail={{en:'Sampling statistics',zh:'曲率、重合度、残差强度'}} icon={<ChartNoAxesCombined size={16}/>}/>
      <div className="guide-sampler"><span>DDIM</span><span><Localized en="sampler" zh="采样器"/></span></div>
      <Node className="guide-next" title={{en:'Next latent',zh:'下一步潜变量'}} detail={{en:'Repeat until the sampling process ends',zh:'继续重复，直到采样结束'}}/>
      <Wires after/>
    </div>
    <p className="guide-footnote"><Localized en="All predictions use the same frozen U-Net. The control repeats at every step after injection." zh="图中展示注入后的推理过程。U-Net 参数保持冻结，残差由条件预测减去无条件预测得到。"/></p>
   </div>
  </div>
 </figure>;
}
