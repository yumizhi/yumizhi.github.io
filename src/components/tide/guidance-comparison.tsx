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
      <path className="guide-blue-wire" d="M200 164H236"/>
      <path className="guide-blue-wire" d="M200 224H236"/>
      <path className="guide-blue-wire" d="M200 284H236"/>
      <path className="guide-blue-wire" d="M376 190V198"/>
      <path className="guide-blue-wire" d="M376 250V258"/>
      <path className="guide-blue-wire" d="M516 284H552"/>
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
  <div className="guide-scroll" tabIndex={0} aria-label="Architecture comparison">
   <div className="guide-canvas">
    <header className="guide-heading"><h3><Localized en="Fixed guidance" zh="固定引导"/></h3><p><Localized en="The same weighting rule is used throughout the remaining denoising steps." zh="在后续去噪步骤中，沿用相同的引导权重。"/></p></header>
    <div className="guide-before-board">
      {predictions.map((p,i)=><div className="guide-before-row" key={p.title.en} style={{gridRow:i+1}}><Node title={p.title} detail={p.detail} icon={p.icon}/><Node title={p.method} detail={p.description}/></div>)}
      <div className="guide-sampler"><span>DDIM</span><span><Localized en="sampler" zh="采样器"/></span></div>
      <Wires/>
    </div>
    <div className="guide-divider"/>
    <header className="guide-heading guide-heading-after"><h3>TIDE</h3><p><Localized en="Retain text guidance. Control the watermark contribution at every step." zh="保留文本引导，逐步控制水印对采样更新的贡献。"/></p></header>
    <div className="guide-after-board">
      <Node className="guide-unchanged-input" title={{en:'Original guidance',zh:'原有引导'}} detail={{en:'Base + text guidance',zh:'基础预测与文本引导'}} icon={<Layers size={16}/>}/>
      <Node className="guide-unchanged" title={{en:'Text-guided prediction',zh:'文本引导预测'}} detail={{en:'Keep the original generation direction',zh:'保留原有的生成更新方向'}}/>
      <div className="guide-controller">
       <header><h4><Localized en="Trajectory-aware control" zh="轨迹感知控制"/></h4><p><Localized en="Applied at every step after injection" zh="注入后的每一步都执行"/></p></header>
       <Node title={{en:'Estimate the text subspace',zh:'估计文本引导子空间'}} detail={{en:'Use the recent text-guidance directions',zh:'使用近期的文本引导方向'}}/>
       <Node title={{en:'Remove the aligned component',zh:'去除对齐分量'}} detail={{en:'Keep the complementary residual',zh:'保留水印残差中与之互补的分量'}}/>
       <Node title={{en:'Set the guidance budget',zh:'分配引导预算'}} detail={{en:'Scale the retained watermark direction',zh:'调整保留水印方向的引导强度'}}/>
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
